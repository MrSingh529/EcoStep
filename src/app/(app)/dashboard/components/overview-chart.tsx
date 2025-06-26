"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { calculateMonthlyImpact, ActivityData } from "@/lib/calculations";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getActivities } from "@/lib/firestore-service";

export function OverviewChart() {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchChartData = async () => {
      try {
        const storedActivities = await getActivities(user.uid);
        if (storedActivities.length > 0) {
          const latestActivity = storedActivities[storedActivities.length - 1];
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
      } catch (error) {
        console.error("Failed to load chart data", error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [user]);

  if (isLoading) {
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

  if (!chartData || chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Impact Overview</CardTitle>
                <CardDescription>Your estimated monthly carbon footprint breakdown (in kg CO2e).</CardDescription>
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
    <Card>
      <CardHeader>
        <CardTitle>Monthly Impact Overview</CardTitle>
        <CardDescription>Your estimated monthly carbon footprint breakdown (in kg CO2e) based on your latest entry.</CardDescription>
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
