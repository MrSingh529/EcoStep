"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getEcoTipsAction } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, Sparkles, TriangleAlert, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { GenerateEcoTipsInput } from "@/ai/flows/generate-eco-tips";
import { useAuth } from "@/hooks/use-auth";
import { getActivities } from "@/lib/firestore-service";

export function EcoTipsGenerator() {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleGenerateTips = async () => {
    if (!user) {
      setError("You must be logged in to generate tips.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setTips([]);

    let input: GenerateEcoTipsInput;
    try {
      const storedActivities = await getActivities(user.uid);
      if (storedActivities.length === 0) {
        setError("No activity data found. Please log your activities first.");
        setIsLoading(false);
        return;
      }
      const latestActivity = storedActivities[storedActivities.length - 1];

      let transportString = `Travels by ${latestActivity.transportMode.replace('_', ' ')} for ${latestActivity.distance}km per day.`;
      if (latestActivity.ownsVehicle) {
        transportString += " They own a personal vehicle.";
      }

      input = {
        transportation: transportString,
        energyConsumption: `Uses ${latestActivity.energy} kWh of electricity per month.`,
        wasteDisposal: `Produces ${latestActivity.waste}kg of waste per day.`,
        waterUsage: `Consumes ${latestActivity.water} liters of water per day.`,
        foodConsumption: `Eats meat ${latestActivity.food} times per day.`,
      };

    } catch (e) {
      console.error(e);
      setError("Could not load your activity data from the database.");
      setIsLoading(false);
      return;
    }

    const result = await getEcoTipsAction(input);

    if (result.success) {
      setTips(result.tips);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full bg-accent/50 text-accent-foreground">
            <Sparkles className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold font-headline">Ready for your tips?</h2>
          <p className="text-muted-foreground max-w-md">
            Click the button below to generate personalized suggestions from our AI assistant based on your latest activities.
          </p>
          <Button onClick={handleGenerateTips} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate My Tips"
            )}
          </Button>
        </div>

        {error && (
            <Alert variant="destructive" className="mt-6">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {!error && !isLoading && tips.length === 0 && (
            <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Get Started</AlertTitle>
                <AlertDescription>Your personalized tips will appear here once you generate them.</AlertDescription>
            </Alert>
        )}

        {tips.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold text-center font-headline">Here are your personalized tips:</h3>
            {tips.map((tip, index) => (
              <Alert key={index} className="bg-primary/10 border-primary/20">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold text-primary/90">Tip #{index + 1}</AlertTitle>
                <AlertDescription className="text-foreground/80">{tip}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
