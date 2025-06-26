
"use client";

import { ArrowDownRight, ArrowUpRight, Calendar, CalendarDays, Footprints, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { calculateDailyImpact, calculateWeeklyImpact, calculateMonthlyImpact, calculateSavings, ActivityData, ImpactData } from "@/lib/calculations";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

type SummaryCardData = {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  description: string;
  icon: React.ElementType;
};

interface ImpactSummaryCardsProps {
    activities: ActivityData[];
}

export function ImpactSummaryCards({ activities }: ImpactSummaryCardsProps) {
  const [summaryData, setSummaryData] = useState<SummaryCardData[] | null>(null);

  useEffect(() => {
    if (activities.length > 0) {
      const latestActivity = activities[activities.length - 1];
      
      const currentDaily = calculateDailyImpact(latestActivity);
      const currentWeekly = calculateWeeklyImpact(latestActivity);
      const currentMonthly = calculateMonthlyImpact(latestActivity);
      const savings = calculateSavings(latestActivity);
      
      let previousDaily: ImpactData | null = null;
      if (activities.length > 1) {
        const previousActivity = activities[activities.length - 2];
        previousDaily = calculateDailyImpact(previousActivity);
      }
      
      const getChange = (current: number, previous: number | undefined | null) => {
        if (previous === undefined || previous === null || current === previous) return { change: "N/A", changeType: "positive" as const };
        const diff = ((current - previous) / Math.abs(previous)) * 100;
          if (Math.abs(diff) < 1) return { change: "N/A", changeType: "positive" as const };
        return {
          change: `${diff > 0 ? '+' : ''}${Math.round(diff)}%`,
          changeType: diff <= 0 ? "positive" : "negative" as const
        }
      }

      const data: SummaryCardData[] = [
        {
          title: "Today's Footprint",
          value: `${currentDaily.total} kg`,
          ...getChange(currentDaily.total, previousDaily?.total),
          description: "CO2e vs last entry",
          icon: Footprints,
        },
      ];
      
      if (savings > 0) {
        data.push({
          title: "Emissions Saved Today",
          value: `${savings} kg`,
          description: "By using sustainable transport",
          icon: ShieldCheck,
        });
      }

      data.push(
          {
            title: "Weekly Footprint",
            value: `${currentWeekly.total} kg`,
            description: "Est. CO2e this week",
            icon: CalendarDays,
          },
          {
            title: "Monthly Footprint",
            value: `${currentMonthly.total} kg`,
            description: "Est. CO2e this month",
            icon: Calendar,
          }
      )
      
      setSummaryData(data);
    } else {
      setSummaryData([]);
    }
  }, [activities]);


  if (!summaryData) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-7 w-20 mb-2" />
                        <Skeleton className="h-4 w-40" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
  }

  if (summaryData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome!</CardTitle>
            </CardHeader>
            <CardContent>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Activity Data Found</AlertTitle>
                  <AlertDescription>
                    Log your first activity on the Activities page to see your impact overview.
                  </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
  }

  return (
    <div id="tour-impact-cards" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item) => {
        const Icon = item.icon;
        const isNegative = item.changeType === "negative";
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className={cn("h-5 w-5", item.title === 'Emissions Saved Today' ? 'text-green-500' : 'text-muted-foreground')} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {item.change && item.change !== "N/A" ? (
                  <span
                    className={cn(
                      "flex items-center",
                      isNegative ? "text-red-500" : "text-green-500"
                    )}
                  >
                    {isNegative ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {item.change}
                  </span>
                ) : item.change ? (
                  <span className="flex items-center">-</span>
                ) : null}
                <span className={cn(item.change && "ml-2")}>{item.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
