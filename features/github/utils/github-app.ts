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

    console.log("PRIVATE KEY HASH:", hash);

    try {
      crypto.createPrivateKey(privateKey);
      console.log("✅ PRIVATE KEY IS VALID");
    } catch (error) {
      console.error("❌ PRIVATE KEY IS INVALID:", error);
    }

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
    const url = new URL(`https://github.com/apps/retrack-code-reviewer/installations/new`);
    // `state` round-trips through GitHub so we can link the installation to this user.
    url.searchParams.set("state", userId);
    return url.toString();
}