import crypto from "crypto";
import { App } from "octokit";

let githubApp: App | null = null;

export function getGithubApp() {
  if (!githubApp) {
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY!.replace(
      /\\n/g,
      "\n"
    );

    const hash = crypto
      .createHash("sha256")
      .update(privateKey)
      .digest("hex");

    githubApp = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey,
      webhooks: {
        secret: process.env.GITHUB_APP_WEBHOOK_SECRET!,
      },
    });
  }

  return githubApp;
}

export function getGithubInstallUrl(userId: string) {
    const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || "retrack-code-reviewer";
    const url = new URL(`https://github.com/apps/${appName}/installations/new`);
    // `state` round-trips through GitHub so we can link the installation to this user.
    url.searchParams.set("state", userId);
    return url.toString();
}