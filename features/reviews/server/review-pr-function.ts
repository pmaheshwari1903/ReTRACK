import { inngest } from "@/features/inngest/client";
import { prisma } from "@/lib/db";
import { getPullRequestFiles } from "./pr-files";
import { chunkPrFiles } from "../utils/chunk-code";
import { generateReview } from "./generate-review";
import { getGithubApp } from "@/features/github/utils/github-app";

export const reviewPullRequest = inngest.createFunction(
    {
        id: "review-pull-request",
        triggers: { event: "github/pr.received" },
    },
    async ({ event, step }) => {
        const pullRequestId = event.data.pullRequestId;

        const pullRequest = await step.run("mark-processing", async () => {
            return prisma.pullRequest.update({
                where: { id: pullRequestId },
                data: { status: "processing" },
            });
        });

        const files = await step.run("fetch-pull-request-diff", async () => {
            return getPullRequestFiles(
                pullRequest.installationId,
                pullRequest.repoFullName,
                pullRequest.prNumber
            );
        });

        const chunks = chunkPrFiles(pullRequest.prNumber, files);

        if (chunks.length === 0) {
            await step.run("mark-reviewed-no-code", async () => {
                return prisma.pullRequest.update({
                    where: { id: pullRequestId },
                    data: { status: "reviewed" },
                });
            });

            return {
                pullRequestId,
                status: "reviewed",
                reason: "no code changes",
            };
        }

        const review = await step.run("generate-ai-review", async () => {
            return generateReview({
                repoFullName: pullRequest.repoFullName,
                title: pullRequest.title,
                diff: files
                    .map((file) => `diff --git a/${file.filePath} b/${file.filePath}\n${file.patch}`)
                    .join("\n\n"),
            })
        })

        await step.run("post-pr-comment", async () => {
            await postPrComment(
                pullRequest.installationId, 
                pullRequest.repoFullName, 
                pullRequest.prNumber, 
                review);
        });

        await step.run("mark-reviewed", async () => {
            await prisma.pullRequest.update({
                where: { id: pullRequestId },
                data: {
                    status: "reviewed",
                    reviewComment: review,
                    reviewedAt: new Date(),
                },
            })
        })
    }
);

async function postPrComment(
    installationId: number,
    repoFullName: string,
    prNumber: number,
    review: string
) {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const [owner, repo] = repoFullName.split("/");

    await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
            owner,
            repo,
            issue_number: prNumber,
            body: review,
        }
    );
}
