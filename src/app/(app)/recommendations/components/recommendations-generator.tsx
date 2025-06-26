"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, TriangleAlert, Info, Recycle, Sprout, ShoppingBag, Landmark, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { generateLocalRecommendationsAction } from "@/lib/actions";
import type { GenerateLocalRecommendationsOutput } from "@/ai/flows/generate-local-recommendations-flow";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons = {
    Recycling: Recycle,
    Conservation: Sprout,
    Shopping: ShoppingBag,
    Policy: Landmark,
    Energy: Zap,
}

export function RecommendationsGenerator() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [recommendations, setRecommendations] = useState<GenerateLocalRecommendationsOutput['recommendations'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState(false);

    const country = user?.country;

    const handleGenerate = async () => {
        if (!country) {
            setError("Please set your country in your profile to get local recommendations.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setRecommendations(null);
        setHasGenerated(true);

        const result = await generateLocalRecommendationsAction({ country });
        if (result.success) {
            setRecommendations(result.recommendations);
        } else {
            setError(result.error || "An unknown error occurred.");
        }
        setIsLoading(false);
    }
    
    if (isAuthLoading) {
        return <Skeleton className="h-48 w-full" />
    }
    
    return (
        <Card>
            <CardContent className="pt-6">
                {!hasGenerated && (
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-accent/50 text-accent-foreground">
                            <Sparkles className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold font-headline">Get Local Tips</h2>
                        <p className="text-muted-foreground max-w-md">
                           {country ? `Ready to get sustainability tips tailored for ${country}?` : "Set your country in your profile to get personalized local tips."}
                        </p>
                        <Button onClick={handleGenerate} disabled={isLoading || !country}>
                            {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                            ) : (
                            "Generate My Recommendations"
                            )}
                        </Button>
                    </div>
                )}


                {isLoading && <LoadingSkeleton />}
                
                {error && (
                    <Alert variant="destructive" className="mt-6">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                {recommendations && (
                    <div className="space-y-6">
                         <h3 className="text-2xl font-bold tracking-tight font-headline text-center">
                            Recommendations for {country}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {recommendations.map((rec, index) => {
                                const Icon = categoryIcons[rec.category] || Info;
                                return (
                                <Card key={index} className="bg-muted/40">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-lg">
                                            <Icon className="h-5 w-5 text-primary" />
                                            {rec.title}
                                        </CardTitle>
                                        <CardDescription className="pt-2">{rec.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            )})}
                        </div>
                         <div className="text-center pt-4">
                            <Button onClick={handleGenerate} disabled={isLoading || !country}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Regenerate"}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <div className="grid md:grid-cols-2 gap-4">
                {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="space-y-2 p-4 border rounded-lg">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ))}
            </div>
        </div>
    )
}
