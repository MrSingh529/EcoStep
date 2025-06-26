"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeProductAction } from "@/lib/actions";
import type { AnalyzeProductOutput } from "@/ai/flows/analyze-product-flow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles, ThumbsUp, ThumbsDown, TriangleAlert, Info, ScanLine, Recycle, ImageUp, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  productName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeProductOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
        form.clearErrors("productName");
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoDataUri(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!data.productName && !photoDataUri) {
      form.setError("productName", { type: "manual", message: "Please provide a product name or upload an image." });
      return;
    }
    form.clearErrors("productName");
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const result = await analyzeProductAction({ 
      productName: data.productName,
      photoDataUri: photoDataUri || undefined,
    });
    
    if (result.success) {
      setAnalysis(result.analysis);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500 hover:bg-green-500/90";
    if (score >= 5) return "bg-yellow-500 hover:bg-yellow-500/90";
    return "bg-red-500 hover:bg-red-500/90";
  }

  const clearPhoto = () => {
    setPhotoDataUri(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div>
                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'Eco-friendly water bottle'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormLabel className="text-lg font-semibold">Or Upload a Photo</FormLabel>
                     {photoDataUri ? (
                          <div className="relative mt-2 w-full max-w-sm">
                            <Image src={photoDataUri} alt="Product preview" width={400} height={400} className="rounded-lg object-contain w-full h-auto aspect-square border" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                                onClick={clearPhoto}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10">
                        <div className="text-center">
                          <ImageUp className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, WebP up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading} className="w-48">
                  {isLoading ? <Loader2 className="animate-spin" /> : "Analyze Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}
      
      {error && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !analysis && !error && (
          <Alert>
            <ScanLine className="h-4 w-4" />
            <AlertTitle>Ready to Scan</AlertTitle>
            <AlertDescription>
              Enter a product name or upload a photo, and the AI will provide an environmental impact analysis.
            </AlertDescription>
          </Alert>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        Analysis Result
                    </CardTitle>
                    <CardDescription>AI-generated environmental impact assessment.</CardDescription>
                </div>
                <Badge className={cn("text-lg", getScoreColor(analysis.score))}>
                    Score: {analysis.score}/10
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2 text-green-600"><ThumbsUp /> Pros</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {analysis.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2 text-red-600"><ThumbsDown /> Cons</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {analysis.cons.map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                </div>
            </div>
            {analysis.alternatives && analysis.alternatives.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-primary"><Recycle className="h-5 w-5" /> Eco-Friendly Alternatives</h3>
                        <div className="space-y-3">
                            {analysis.alternatives.map((alt, i) => (
                                <div key={i} className="p-4 bg-muted/50 rounded-lg border">
                                    <p className="font-semibold text-card-foreground">{alt.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{alt.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LoadingSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-7 w-24 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <Skeleton className="h-5 w-48 mb-3" />
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
