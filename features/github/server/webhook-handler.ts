import { savePullRequest } from "@/features/reviews/server/save-pull-request";
import { inngest } from "@/features/inngest/client";
import { getGithubApp } from "../utils/github-app";

const REVIEWABLE_ACTIONS = ["opened", "synchronize", "reopened"];

export type PullRequestWebhookPayload = {
    /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
    action: string;
    /** GitHub App installation that received the event */
    installation: { id: number };
    repository: { full_name: string };
    pull_request: {
        number: number;
        title: string;
        user: { login: string } | null;
        head: { sha: string };
        base: { ref: string };
    };
};

async function isSignatureValid(payload: string, signature: string | null) {
    if (!signature) {
        return false;
    }

    const app = getGithubApp();

    return app.webhooks.verify(payload, signature);
}

export async function handleGithubWebhook(req: Request) {
    const payload = await req.text();
    const signature = req.headers.get("x-hub-signature-256");
    const eventName = req.headers.get("x-github-event");

    const isValid = await isSignatureValid(payload, signature);

    if (!isValid) {
        return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (eventName !== "pull_request") {
        return Response.json({ received: true });
    }

    const event = JSON.parse(payload) as PullRequestWebhookPayload;

    console.log("event", event);

    if (!REVIEWABLE_ACTIONS.includes(event.action)) {
        return Response.json({ received: true });
    }

    const pullRequest = await savePullRequest(event);

    await inngest.send({
        name: "github/pr.received",
        data: { pullRequestId: pullRequest.id },
    });

    return Response.json({ received: true });
}