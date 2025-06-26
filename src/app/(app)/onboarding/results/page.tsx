
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { avatars } from "@/components/avatars";

export default function OnboardingResultsPage() {
    const [baselineCo2, setBaselineCo2] = useState<number | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedCo2 = localStorage.getItem("baselineCo2");
        const storedName = localStorage.getItem("onboardingDisplayName");
        const storedAvatar = localStorage.getItem("onboardingAvatarId");
        
        if (storedCo2) setBaselineCo2(Number(storedCo2));
        if (storedName) setDisplayName(storedName);
        if (storedAvatar) setAvatarId(storedAvatar);
        
        setIsLoading(false);

        // Clean up localStorage
        localStorage.removeItem("baselineCo2");
        localStorage.removeItem("onboardingDisplayName");
        localStorage.removeItem("onboardingAvatarId");
    }, []);

    const AvatarComponent = avatarId ? avatars[avatarId]?.component : null;

    if (isLoading) {
        return (
             <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="mx-auto w-full max-w-md text-center">
                    <Skeleton className="h-10 w-48 mx-auto mb-4" />
                    <Skeleton className="h-4 w-full mb-6" />
                    <Skeleton className="h-48 w-full mb-6" />
                    <Skeleton className="h-10 w-36 mx-auto" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="mx-auto w-full max-w-md text-center">
                <Card>
                    <CardHeader>
                        {AvatarComponent ? (
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                                <AvatarComponent className="h-20 w-20" />
                            </div>
                        ) : (
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                                <PartyPopper className="h-10 w-10 text-green-600 dark:text-green-400" />
                            </div>
                        )}
                        <CardTitle className="text-3xl">You're All Set, {displayName || 'Guardian'}!</CardTitle>
                        <CardDescription>You've set your baseline. Now the real impact begins.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">Based on your answers, your estimated carbon footprint for the last year was:</p>
                        <div className="text-5xl font-bold text-primary">
                            {baselineCo2?.toLocaleString() ?? 'N/A'}
                        </div>
                        <p className="font-semibold">kg CO₂e</p>
                        <p className="text-muted-foreground pt-4">This is your starting line. With EcoStep, you now have the tools and insights to watch this number shrink. Every small step makes a world of difference.</p>
                        <Button asChild size="lg" className="w-full mt-4">
                            <Link href="/dashboard">Start My Journey</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
