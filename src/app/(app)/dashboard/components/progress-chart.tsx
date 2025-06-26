"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { calculateMonthlyImpact, ActivityData } from "@/lib/calculations";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ProgressChartProps {
    activities: ActivityData[];
}

export function ProgressChart({ activities }: ProgressChartProps) {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    if (activities.length > 0) {
      const data = activities.map(activity => ({
        month: format(new Date(activity.date), "MMM d"),
        footprint: calculateMonthlyImpact(activity).total,
      }));
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [activities]);

  if (!chartData) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
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
                <CardTitle>Footprint Trend</CardTitle>
                <CardDescription>Your estimated monthly carbon footprint (in kg CO2e) over time.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[350px]">
                <Alert className="max-w-md">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Not Enough Data</AlertTitle>
                  <AlertDescription>
                    No activities logged in the selected date range. Choose a different range to see your trend.
                  </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footprint Trend</CardTitle>
        <CardDescription>Your estimated monthly carbon footprint (in kg CO2e) over time for the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Line
              type="monotone"
              dataKey="footprint"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
