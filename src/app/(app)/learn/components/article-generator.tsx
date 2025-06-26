"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, TriangleAlert, Info, CheckCircle } from "lucide-react";
import { generateArticleAction } from "@/lib/actions";
import type { GenerateArticleOutput } from "@/ai/flows/generate-article-flow";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const topics = [
    "The Truth About Plastic Recycling",
    "What is Fast Fashion?",
    "Benefits of a Plant-Based Diet",
    "Understanding Carbon Footprints",
    "The Importance of Biodiversity",
    "Renewable Energy Explained"
];

export function ArticleGenerator() {
    const [article, setArticle] = useState<GenerateArticleOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const handleGenerate = async (topic: string) => {
        setSelectedTopic(topic);
        setIsLoading(true);
        setError(null);
        setArticle(null);

        const result = await generateArticleAction({ topic });
        if (result.success) {
            setArticle(result.article);
        } else {
            setError(result.error || "An unknown error occurred.");
        }
        setIsLoading(false);
    }
    
    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-4">
                 <h2 className="text-xl font-bold tracking-tight font-headline">
                    Select a Topic
                </h2>
                {topics.map(topic => (
                    <Button 
                        key={topic} 
                        variant={selectedTopic === topic ? "secondary" : "outline"} 
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleGenerate(topic)}
                        disabled={isLoading && selectedTopic === topic}
                    >
                        {isLoading && selectedTopic === topic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {topic}
                    </Button>
                ))}
            </div>
            <div className="lg:col-span-2">
                {isLoading && <LoadingSkeleton />}
                
                {error && (
                    <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Generation Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!isLoading && !article && !error && (
                    <Card className="min-h-[400px] flex items-center justify-center">
                        <CardContent className="text-center pt-6">
                            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">Select a topic to learn</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Your AI-generated article will appear here.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {article && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{article.title}</CardTitle>
                            <CardDescription>AI-Generated Article</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
                            />
                            <Separator className="my-6" />
                            <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Key Takeaways</h3>
                            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                {article.keyTakeaways.map((takeaway, i) => (
                                    <li key={i}>{takeaway}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <br/>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
        </Card>
    )
}
