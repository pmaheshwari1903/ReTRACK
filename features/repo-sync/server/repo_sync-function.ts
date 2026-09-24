import { inngest } from "@/features/inngest/client";
import { prisma } from "@/lib/db";

import {
    chunkRepoFiles,
    getRepoFiles,
} from "@/features/repo-sync/server/repo-files";

import {
    buildRepoNamespace,
    deleteRepoNamespace,
    saveRepoChunks,
} from "@/features/repo-sync/server/vectors";

export const syncRepoCodebaseFunction =
    inngest.createFunction(
        {
            id: "sync-repo-codebase",

            triggers: {
                event: "repo/sync.requested",
            },

            onFailure: async ({ event }) => {
                const repoSyncId = (
                    event.data?.event?.data as
                    | { repoSyncId?: string }
                    | undefined
                )?.repoSyncId;

                if (!repoSyncId) {
                    return;
                }

                await prisma.repoSync.update({
                    where: {
                        id: repoSyncId,
                    },

                    data: {
                        status: "failed",
                    },
                });
            },
        },

        async ({ event, step }) => {
            const repoSyncId = event.data.repoSyncId;

            /**
             * 1. Mark sync as running.
             */
            const repoSync = await step.run(
                "mark-syncing",
                async () => {
                    return prisma.repoSync.update({
                        where: {
                            id: repoSyncId,
                        },

                        data: {
                            status: "syncing",
                        },
                    });
                }
            );

            /**
             * 2. Fetch repository files and create chunks.
             */
            const chunks = await step.run(
                "fetch-and-chunk-codebase",
                async () => {
                    const files = await getRepoFiles(
                        repoSync.installationId,
                        repoSync.repoFullName,
                        repoSync.branch
                    );

                    return chunkRepoFiles(files);
                }
            );

            /**
             * 3. Build Pinecone namespace.
             */
            const namespace = buildRepoNamespace(
                repoSync.repoFullName
            );

            /**
             * 4. Delete old vectors on re-sync.
             */
            if (repoSync.syncedAt) {
                await step.run(
                    "delete-old-vectors",
                    async () => {
                        await deleteRepoNamespace(namespace);
                    }
                );
            }

            /**
             * 5. Save new chunks to Pinecone.
             */
            await step.run(
                "save-vectors-to-pinecone",
                async () => {
                    await saveRepoChunks(
                        namespace,
                        chunks
                    );
                }
            );

            /**
             * 6. Mark sync as completed.
             */
            await step.run(
                "mark-synced",
                async () => {
                    await prisma.repoSync.update({
                        where: {
                            id: repoSyncId,
                        },

                        data: {
                            status: "synced",
                            syncedAt: new Date(),
                            chunkCount: chunks.length,
                        },
                    });
                }
            );

            return {
                repoSyncId,
                status: "synced",
                chunkCount: chunks.length,
            };
        }
    );