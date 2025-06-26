"use client";

import { Award, ShieldCheck, Target, TrendingDown } from "lucide-react";
import { ProgressChart } from "./components/progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { calculateMonthlyImpact, calculateSavings, ActivityData } from "@/lib/calculations";

export default function ProgressPage() {
    const [milestones, setMilestones] = useState([
        {
            icon: Target,
            title: "First Steps",
            description: "Logged your first activity.",
            achieved: false,
        },
        {
            icon: TrendingDown,
            title: "Impact Reducer",
            description: "Reduced your monthly footprint compared to the previous entry.",
            achieved: false,
        },
        {
            icon: ShieldCheck,
            title: "Green Commuter",
            description: "Saved CO2e by choosing sustainable transport.",
            achieved: false,
        },
        {
            icon: Award,
            title: "Eco-Hero",
            description: "Achieved a total monthly footprint below 500 kg CO2e.",
            achieved: false,
        },
    ]);

    useEffect(() => {
        try {
            const storedActivities: ActivityData[] = JSON.parse(localStorage.getItem('eco-activities') || '[]');
            if (storedActivities.length > 0) {
                const newMilestones = JSON.parse(JSON.stringify(milestones));
                
                newMilestones[0].achieved = true; // First Steps

                if (storedActivities.length > 1) {
                    const lastImpact = calculateMonthlyImpact(storedActivities[storedActivities.length - 1]).total;
                    const secondLastImpact = calculateMonthlyImpact(storedActivities[storedActivities.length - 2]).total;
                    if (lastImpact < secondLastImpact) {
                        newMilestones[1].achieved = true; // Impact Reducer
                    }
                }

                const latestActivity = storedActivities[storedActivities.length - 1];
                
                const savings = calculateSavings(latestActivity);
                if (savings > 0) {
                    newMilestones[2].achieved = true; // Green Commuter
                }
                
                const latestImpact = calculateMonthlyImpact(latestActivity).total;
                if (latestImpact < 500) {
                    newMilestones[3].achieved = true; // Eco-Hero
                }

                setMilestones(newMilestones);
            }
        } catch (error) {
            console.error("Failed to process milestones:", error);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight font-headline">
                    Your Progress
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Track your journey to a more sustainable lifestyle over time.
                </p>
            </div>

            <ProgressChart />

            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
                    Milestones
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {milestones.map((milestone) => (
                        <Card key={milestone.title} className={!milestone.achieved ? "opacity-50" : ""}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className="p-3 rounded-full bg-primary/20 text-primary">
                                    <milestone.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>{milestone.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{milestone.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
