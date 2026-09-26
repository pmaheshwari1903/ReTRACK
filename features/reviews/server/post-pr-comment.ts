import { getGithubApp } from "@/features/github/utils/github-app";

export async function postPrComment(
    installationId: number,
    repoFullName: string,
    prNumber: number,
    body: string
) {
    const app = getGithubApp();
    try {
        const octokit = await app.getInstallationOctokit(installationId);
        const [owner, repo] = repoFullName.split("/");

        await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
            owner,
            repo,
            issue_number: prNumber,
            body,
        });
    } catch (error: any) {
        if (error?.status === 404) {
            console.warn(
                `Failed to post PR comment: Installation ${installationId} or repo ${repoFullName} returned 404 Not Found.`
            );
            return;
        }
        throw error;
    }
}