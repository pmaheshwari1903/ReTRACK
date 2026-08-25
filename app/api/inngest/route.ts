import { serve } from "inngest/next";
import { inngest } from "@/features/inngest/client";
import { processTask } from "@/app/api/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask],
});