import crypto from "crypto";
import { App } from "octokit";

let githubApp: App | null = null;

export function getGithubApp() {
  if (!githubApp) {
    const rawPrivateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    if (!rawPrivateKey) {
      throw new Error("GITHUB_APP_PRIVATE_KEY is not configured");
    }

    // Vercel may store the PEM key with literal "\n" characters.
    // Convert them into actual newlines before passing the key to Octokit.
    const privateKey = rawPrivateKey.replace(/\\n/g, "\n").trim();

    const hash = crypto
      .createHash("sha256")
      .update(privateKey)
      .digest("hex");

    console.log("GitHub App private key loaded:", {
      length: privateKey.length,
      startsCorrectly: privateKey.startsWith("-----BEGIN"),
      endsCorrectly: privateKey.endsWith("-----"),
      hash,
    });

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
  const appName =
    process.env.NEXT_PUBLIC_GITHUB_APP_NAME || "retrack-code-reviewer";

  const url = new URL(
    `https://github.com/apps/${appName}/installations/new`
  );

  // `state` round-trips through GitHub so we can link the installation to this user.
  url.searchParams.set("state", userId);

  return url.toString();
}