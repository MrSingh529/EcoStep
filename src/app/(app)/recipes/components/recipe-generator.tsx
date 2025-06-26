"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateRecipeAction } from "@/lib/actions";
import type { GenerateRecipeOutput } from "@/ai/flows/generate-recipe-flow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles, TriangleAlert, Info, ChefHat, Clock, Sprout } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  diet: z.string().optional(),
  cuisine: z.string().optional(),
  ingredients: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RecipeGenerator() {
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diet: "",
      cuisine: "",
      ingredients: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);

    const result = await generateRecipeAction(data);
    
    if (result.success) {
      setRecipe(result.recipe);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Recipe Preferences</CardTitle>
            <CardDescription>Tell the AI what you'd like to cook. The more details, the better!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="diet"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dietary Preference</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Vegan, Gluten-Free" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cuisine Style</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Italian, Thai" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Available Ingredients</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., tomatoes, rice, tofu" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading} className="w-48">
                  {isLoading ? <Loader2 className="animate-spin" /> : "Generate Recipe"}
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
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !recipe && !error && (
          <Alert>
            <ChefHat className="h-4 w-4" />
            <AlertTitle>Ready to Cook</AlertTitle>
            <AlertDescription>
              Enter your preferences above and the AI will generate a sustainable recipe for you.
            </AlertDescription>
          </Alert>
      )}

      {recipe && (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">{recipe.title}</CardTitle>
            <CardDescription>{recipe.description}</CardDescription>
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Prep: {recipe.prepTime}</div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Cook: {recipe.cookTime}</div>
                <div className="flex items-center gap-2"><ChefHat className="h-4 w-4" /> Serves: {recipe.servings}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-3">
                    <h3 className="font-semibold text-lg">Ingredients</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        {recipe.ingredients.map((item, i) => <li key={i} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{item}</li>)}
                    </ul>
                </div>
                 <div className="md:col-span-2 space-y-3">
                    <h3 className="font-semibold text-lg">Instructions</h3>
                    <ol className="list-decimal list-outside space-y-3 pl-5">
                        {recipe.instructions.map((step, i) => <li key={i} className="text-muted-foreground">{step}</li>)}
                    </ol>
                </div>
            </div>
            <Separator />
             <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <Sprout className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300 font-semibold">Sustainability Tip</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300/80">
                  {recipe.sustainabilityTip}
                </AlertDescription>
            </Alert>
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
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-6 pt-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Separator />
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-3">
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <Skeleton className="h-6 w-1/3 mb-4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
