"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { calculateMonthlyImpact, ActivityData } from "@/lib/calculations";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface OverviewChartProps {
    activities: ActivityData[];
}

export function OverviewChart({ activities }: OverviewChartProps) {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    if (activities.length > 0) {
      const latestActivity = activities[activities.length - 1];
      const impact = calculateMonthlyImpact(latestActivity);
      
      const data = [
        { name: "Transport", value: impact.transport, fill: "var(--chart-1)" },
        { name: "Energy", value: impact.energy, fill: "var(--chart-2)" },
        { name: "Waste", value: impact.waste, fill: "var(--chart-3)" },
        { name: "Water", value: impact.water, fill: "var(--chart-4)" },
        { name: "Food", value: impact.food, fill: "var(--chart-5)" },
      ];
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [activities]);

  if (!chartData) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[350px]" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Impact Overview</CardTitle>
                <CardDescription>Your estimated monthly carbon footprint breakdown (in kg CO2e).</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[350px]">
                <Alert className="max-w-md">
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Activity Data Found</AlertTitle>
                  <AlertDescription>
                    No activities logged in the selected date range. Log an activity to see your impact.
                  </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Impact Overview</CardTitle>
        <CardDescription>Your estimated monthly carbon footprint breakdown (in kg CO2e) based on your latest entry in the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
            />
            <Tooltip 
              cursor={{fill: 'hsl(var(--muted))'}}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
