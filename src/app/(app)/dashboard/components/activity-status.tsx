"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getActivities } from "@/lib/firestore-service";
import type { ActivityData } from "@/lib/calculations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, CalendarPlus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { activityCategories } from "@/lib/data";

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export function ActivityStatus() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getActivities(user.uid)
        .then(setActivities)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const lastActivity = activities.length > 0 ? activities[activities.length - 1] : null;
  const loggedToday = lastActivity && isSameDay(new Date(lastActivity.date), new Date());

  const recentActivities = activities.slice(-3).reverse();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        {!loggedToday && (
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle>Log Your Activities!</CardTitle>
              <CardDescription>Let's see how our Earth Guardian is doing today.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/activities">
                  Log Today's Impact <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Recent Activity
        </h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <Card key={activity.date}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(new Date(activity.date), 'PPPP')}
                  </CardTitle>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground pt-2">
                    {activityCategories.map(cat => {
                        const value = activity[cat.id as keyof ActivityData]
                        if (typeof value !== 'undefined') {
                            return (
                                <div key={cat.id} className="flex items-center gap-1">
                                    <cat.icon className="h-3 w-3" />
                                    <span>{cat.name}</span>
                                </div>
                            )
                        }
                        return null;
                    })}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <CalendarPlus className="h-4 w-4" />
            <AlertTitle>No Recent Activities</AlertTitle>
            <AlertDescription>
              Your last few days of logged activities will appear here. Get started by logging today!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
