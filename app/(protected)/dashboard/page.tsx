import type { Metadata } from "next";

import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { OverviewContent } from "@/features/dashboard/components/overview-content";
import { getOverview } from "@/features/overview/server/get-overview";

export const metadata: Metadata = {
  title: "Overview · Dashboard",
};

export default async function DashboardPage() {
  const session = await requireAuth();
  const overview = await getOverview(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Overview"
        description="Monitor connected repositories, review counts, and activity."
      />
      <OverviewContent overview={overview} />
    </>
  );
}
