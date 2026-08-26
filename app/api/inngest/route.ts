import { serve } from "inngest/next";
import { inngest } from "@/features/inngest/client";
import { processTask } from "@/app/api/inngest/function";
import { reviewPullRequest } from "@/features/reviews/server/review-pr-function";
import { syncRepoCodebaseFunction } from "@/features/repo-sync/server/repo_sync-function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, reviewPullRequest, syncRepoCodebaseFunction],
});