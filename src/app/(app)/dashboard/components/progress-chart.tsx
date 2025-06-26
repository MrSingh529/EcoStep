"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { calculateMonthlyImpact, ActivityData } from "@/lib/calculations";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getActivities } from "@/lib/firestore-service";


export function ProgressChart() {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchChartData = async () => {
      try {
        const storedActivities = await getActivities(user.uid);
        
        if (storedActivities.length > 0) {
          const data = storedActivities.map(activity => ({
            month: format(new Date(activity.date), "MMM d"),
            footprint: calculateMonthlyImpact(activity).total,
          }));
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
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
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
                <CardTitle>Footprint Trend</CardTitle>
                <CardDescription>Your estimated monthly carbon footprint (in kg CO2e) over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Not Enough Data</AlertTitle>
                  <AlertDescription>
                    Log activities over time to see your progress trend here.
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
        <CardDescription>Your estimated monthly carbon footprint (in kg CO2e) over time.</CardDescription>
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
