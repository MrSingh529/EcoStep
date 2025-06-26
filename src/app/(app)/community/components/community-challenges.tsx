"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { communityChallengesData } from "@/lib/data";
import { Check } from "lucide-react";

export function CommunityChallenges() {
    const { user, joinChallenge } = useAuth();

    const handleJoinChallenge = (challengeId: string) => {
        if (!user) return;
        joinChallenge(challengeId);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
                Community Challenges
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityChallengesData.map((challenge) => {
                    const isJoined = user?.joinedChallenges?.includes(challenge.id);
                    return (
                        <Card key={challenge.title}>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-primary/20 text-primary">
                                        <challenge.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle>{challenge.title}</CardTitle>
                                </div>
                                <CardDescription className="pt-2">{challenge.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={challenge.progress} className="h-2" />
                                <p className="text-sm text-muted-foreground mt-2 text-center">
                                    Community Goal: <span className="font-semibold text-foreground">{challenge.goal}</span>
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={isJoined ? "secondary" : "outline"}
                                    onClick={() => handleJoinChallenge(challenge.id)}
                                    disabled={isJoined}
                                >
                                    {isJoined ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Challenge Joined
                                        </>
                                    ) : (
                                        "Join Challenge"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
