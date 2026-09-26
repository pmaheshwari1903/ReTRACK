/**
 * Repository file fetching and chunking.
 *
 * Fetches indexable source files from GitHub and converts them
 * into chunks that can later be embedded into Pinecone.
 */

import type { CodeChunk } from "@/features/reviews/types/review";
import type { RepoFile } from "@/features/repo-sync/types/repo-sync-types";

import { getGithubApp } from "@/features/github/utils/github-app";
import { splitRepoFullName } from "@/features/reviews/utils/repo-name";

const MAX_FILE_SIZE_BYTES = 100_000;
const MAX_FILES = 200;
const MAX_CHUNK_LINES = 80;

const CODE_EXTENSIONS = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".py",
    ".go",
    ".rb",
    ".rs",
    ".java",
    ".kt",
    ".swift",
    ".c",
    ".h",
    ".cpp",
    ".cs",
    ".php",
    ".sql",
    ".prisma",
    ".css",
    ".md",
    ".yml",
    ".yaml",
];

const SKIPPED_FOLDERS = [
    "node_modules/",
    "dist/",
    "build/",
    ".next/",
    "generated/",
    "vendor/",
];

type TreeEntry = {
    path?: string;
    type?: string;
    sha?: string;
    size?: number;
};

function hasCodeExtension(path: string) {
    return CODE_EXTENSIONS.some((extension) => path.endsWith(extension));
}

function isSkippedPath(path: string) {
    return SKIPPED_FOLDERS.some((folder) => path.includes(folder));
}

function isIndexableFile(entry: TreeEntry) {
    if (!entry.path || !entry.sha || entry.type !== "blob") {
        return false;
    }

    if (entry.size && entry.size > MAX_FILE_SIZE_BYTES) {
        return false;
    }

    if (isSkippedPath(entry.path)) {
        return false;
    }

    return hasCodeExtension(entry.path);
}

function buildChunkId(filePath: string, part: number) {
    return `repo--${filePath}--part-${part}`;
}

/**
 * Fetch files from GitHub.
 */
export async function getRepoFiles(
    installationId: number,
    repoFullName: string,
    branch: string
): Promise<RepoFile[]> {
    const app = getGithubApp();
    try {
        const octokit = await app.getInstallationOctokit(installationId);

        const { owner, repo } = splitRepoFullName(repoFullName);

        const { data: tree } = await octokit.request(
            "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
            {
                owner,
                repo,
                tree_sha: branch,
                recursive: "1",
            }
        );

        const entries = tree.tree.filter(isIndexableFile).slice(0, MAX_FILES);

        const files: RepoFile[] = [];

        const BATCH_SIZE = 15;

        for (let i = 0; i < entries.length; i += BATCH_SIZE) {
            const batch = entries.slice(i, i + BATCH_SIZE);

            const batchResults = await Promise.all(
                batch.map(async (entry) => {
                    try {
                        const { data: blob } = await octokit.request(
                            "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
                            {
                                owner,
                                repo,
                                file_sha: entry.sha!,
                            }
                        );

                        const content = Buffer.from(
                            blob.content,
                            "base64"
                        ).toString("utf-8");

                        return {
                            filePath: entry.path!,
                            content,
                        };
                    } catch {
                        return null;
                    }
                })
            );

            for (const file of batchResults) {
                if (file) {
                    files.push(file);
                }
            }
        }

        return files;
    } catch (error: any) {
        if (error?.status === 404) {
            console.warn(
                `GitHub installation ${installationId} or repo ${repoFullName} returned 404 Not Found.`
            );
            return [];
        }
        throw error;
    }
}

/**
 * Split repository files into Pinecone-ready chunks.
 */
export function chunkRepoFiles(files: RepoFile[]): CodeChunk[] {
    const chunks: CodeChunk[] = [];

    for (const file of files) {
        const lines = file.content.split("\n");

        for (
            let start = 0;
            start < lines.length;
            start += MAX_CHUNK_LINES
        ) {
            const text = lines
                .slice(start, start + MAX_CHUNK_LINES)
                .join("\n")
                .trim();

            // Never create empty chunks.
            if (!text) {
                continue;
            }

            const part = start / MAX_CHUNK_LINES;

            chunks.push({
                id: buildChunkId(file.filePath, part),
                filePath: file.filePath,
                text,
            });
        }
    }

    return chunks;
}