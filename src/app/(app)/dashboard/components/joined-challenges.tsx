"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { communityChallengesData } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function JoinedChallenges() {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return null; // Or a skeleton loader
    }

    const joined = user?.joinedChallenges 
        ? communityChallengesData.filter(challenge => user.joinedChallenges?.includes(challenge.id))
        : [];

    if (joined.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Active Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                     <Alert>
                        <Target className="h-4 w-4" />
                        <AlertTitle>No Active Challenges</AlertTitle>
                        <AlertDescription>
                            You haven't joined any community challenges yet. Head over to the Community page to find one!
                        </AlertDescription>
                    </Alert>
                    <Button asChild variant="outline" className="mt-4 w-full">
                        <Link href="/community">
                            Explore Challenges <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
                Your Active Challenges
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
                {joined.map(challenge => (
                    <Card key={challenge.id} className="bg-muted/40">
                        <CardHeader>
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/20 text-primary">
                                    <challenge.icon className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                            </div>
                            <CardDescription className="pt-2 text-xs">{challenge.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}
