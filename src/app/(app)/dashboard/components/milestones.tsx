"use client";

import { Award, ShieldCheck, Target, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { calculateMonthlyImpact, calculateSavings, ActivityData } from "@/lib/calculations";
import { useAuth } from "@/hooks/use-auth";
import { getActivities } from "@/lib/firestore-service";

export function Milestones() {
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
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchAndProcessMilestones = async () => {
            try {
                const storedActivities: ActivityData[] = await getActivities(user.uid);
                if (storedActivities.length > 0) {
                    const newMilestones = milestones.map(m => ({ ...m })); // Create a shallow copy to update state

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
        };

        fetchAndProcessMilestones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
         <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
                Milestones
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {milestones.map((milestone) => {
                    const Icon = milestone.icon;
                    return (
                        <Card key={milestone.title} className={!milestone.achieved ? "opacity-50" : ""}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className="p-3 rounded-full bg-primary/20 text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>{milestone.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{milestone.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
