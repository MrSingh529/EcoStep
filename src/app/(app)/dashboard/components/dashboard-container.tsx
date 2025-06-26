
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getActivities } from '@/lib/firestore-service';
import type { ActivityData } from '@/lib/calculations';
import { subDays, startOfDay } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImpactSummaryCards } from './impact-summary-cards';
import { OverviewChart } from './overview-chart';
import { ProgressChart } from './progress-chart';
import { Skeleton } from '@/components/ui/skeleton';

type FilterType = '7d' | '30d' | '90d' | 'all';

export function DashboardContainer() {
    const { user } = useAuth();
    const [allActivities, setAllActivities] = useState<ActivityData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('30d');

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getActivities(user.uid)
                .then(setAllActivities)
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    const filteredActivities = useMemo(() => {
        if (filter === 'all') {
            return allActivities;
        }
        const days = { '7d': 7, '30d': 30, '90d': 90 };
        const cutOffDate = startOfDay(subDays(new Date(), days[filter]));
        return allActivities.filter(activity => new Date(activity.date) >= cutOffDate);
    }, [allActivities, filter]);

    if (isLoading) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="grid lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[450px] w-full" />
                    <Skeleton className="h-[450px] w-full" />
                </div>
            </div>
        )
    }
    
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
                    <TabsList>
                        <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
                        <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
                        <TabsTrigger value="90d">Last 90 Days</TabsTrigger>
                        <TabsTrigger value="all">All Time</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            
            <ImpactSummaryCards activities={filteredActivities} />
            
            <div id="tour-dashboard-charts" className="grid lg:grid-cols-2 gap-8">
                <OverviewChart activities={filteredActivities} />
                <ProgressChart activities={filteredActivities} />
            </div>
        </div>
    );
}
