import { ImpactSummaryCards } from "./components/impact-summary-cards";
import { Milestones } from "./components/milestones";
import { OverviewChart } from "./components/overview-chart";
import { ProgressChart } from "./components/progress-chart";
import { DailyQuote } from "./components/daily-quote";
import { ActivityStatus } from "./components/activity-status";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GamificationStatus } from "./components/gamification-status";
import { JoinedChallenges } from "./components/joined-challenges";

function QuoteSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Hello, Earth Guardian!
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Welcome back! Your positive impact is making a world of difference.
        </p>
      </div>
      
      <GamificationStatus />

      <ImpactSummaryCards />

      <ActivityStatus />
      
      <JoinedChallenges />

      <div className="grid lg:grid-cols-2 gap-8">
        <OverviewChart />
        <ProgressChart />
      </div>

      <Milestones />

      <Suspense fallback={<QuoteSkeleton />}>
        <DailyQuote />
      </Suspense>
    </div>
  );
}
