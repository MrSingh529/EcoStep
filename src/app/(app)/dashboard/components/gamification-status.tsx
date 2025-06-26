
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const calculateRequiredXp = (level: number) => {
    return Math.floor(level * level * 100);
}

export function GamificationStatus() {
    const { user, isLoading } = useAuth();
    
    if (isLoading || !user) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
        )
    }

    const currentLevel = user.level || 1;
    const currentXp = user.xp || 0;
    const requiredXp = calculateRequiredXp(currentLevel);
    const progressPercentage = requiredXp > 0 ? (currentXp / requiredXp) * 100 : 0;

    const stats = [
        {
            icon: Award,
            label: "Your Level",
            value: currentLevel,
            description: `You are an Earth Guardian, Level ${currentLevel}!`
        },
        {
            icon: TrendingUp,
            label: "XP Progress",
            value: `${currentXp} / ${requiredXp}`,
            description: "Earn XP by logging activities.",
            progress: progressPercentage
        },
        {
            icon: Flame,
            label: "Daily Streak",
            value: `${user.dailyStreak || 0} Days`,
            description: "Log daily to keep your streak alive."
        }
    ]

    return (
        <div id="tour-gamification-status">
             <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
                Your Status
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                            {stat.progress !== undefined && (
                                <Progress value={stat.progress} className="h-2 mt-4" />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
