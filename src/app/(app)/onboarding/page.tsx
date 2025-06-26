"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Icons } from "@/components/icons";

const questions = [
  {
    id: "flights",
    text: "How many round-trip flights did you take in the last year?",
    options: [
      { value: "0", label: "None", co2: 0 },
      { value: "1", label: "1-2 short-haul (e.g., domestic)", co2: 400 },
      { value: "2", label: "1-2 long-haul (e.g., international)", co2: 3000 },
      { value: "3", label: "More than 2 long-haul", co2: 7000 },
    ],
  },
  {
    id: "carTravel",
    text: "On average, how much do you travel by a gasoline-powered car per week?",
    options: [
      { value: "0", label: "I don't use a car / I use an EV", co2: 100 },
      { value: "1", label: "Less than 100 km (60 miles)", co2: 500 },
      { value: "2", label: "100 - 300 km (60 - 180 miles)", co2: 1500 },
      { value: "3", label: "More than 300 km (180 miles)", co2: 3000 },
    ],
  },
  {
    id: "diet",
    text: "How would you describe your diet?",
    options: [
      { value: "0", label: "Vegan or Vegetarian", co2: 600 },
      { value: "1", label: "Low meat consumption (few times a week)", co2: 1200 },
      { value: "2", label: "Moderate meat consumption (daily)", co2: 2500 },
      { value: "3", label: "High meat consumption (most meals)", co2: 3300 },
    ],
  },
  {
    id: "energyUsage",
    text: "How conscious are you of your electricity usage at home?",
    options: [
      { value: "0", label: "Very conscious, I use renewables/unplug devices", co2: 500 },
      { value: "1", label: "Somewhat conscious, I turn off lights", co2: 1200 },
      { value: "2", label: "Not very conscious, I leave things on", co2: 2400 },
      { value: "3", label: "I use a lot of high-energy appliances", co2: 4000 },
    ],
  },
  {
    id: "onlineShopping",
    text: "How much of your shopping is done online?",
    options: [
      { value: "0", label: "Rarely, I prefer local stores", co2: 50 },
      { value: "1", label: "Occasionally, a few packages a month", co2: 150 },
      { value: "2", label: "Frequently, I get packages weekly", co2: 300 },
      { value: "3", label: "Constantly, it's my primary way to shop", co2: 500 },
    ],
  },
];

const formSchema = z.object({
  flights: z.string({ required_error: "Please select an option." }),
  carTravel: z.string({ required_error: "Please select an option." }),
  diet: z.string({ required_error: "Please select an option." }),
  energyUsage: z.string({ required_error: "Please select an option." }),
  onlineShopping: z.string({ required_error: "Please select an option." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    let totalCo2 = 0;
    for (const [key, value] of Object.entries(data)) {
        const question = questions.find(q => q.id === key);
        const option = question?.options.find(o => o.value === value);
        if (option) {
            totalCo2 += option.co2;
        }
    }
    
    try {
        await updateUser({ onboardingCompleted: true, baselineCo2: totalCo2 });
        localStorage.setItem('baselineCo2', totalCo2.toString());
        router.push("/onboarding/results");
    } catch(error) {
        console.error("Failed to update user profile", error);
        // Handle error with a toast or message
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mx-auto w-full max-w-2xl">
            <div className="flex flex-col items-center gap-2 text-center mb-8">
                <Icons.logo className="h-12 w-12 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Welcome, Earth Guardian!</h1>
                <p className="text-muted-foreground">
                    Let's set your baseline. Answer a few questions about your habits from the past year to estimate your starting carbon footprint.
                </p>
            </div>
            
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="pt-6 space-y-8">
                            {questions.map((q, index) => (
                                <FormField
                                    key={q.id}
                                    control={form.control}
                                    name={q.id as keyof FormValues}
                                    render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="font-semibold text-base">{index + 1}. {q.text}</FormLabel>
                                        <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                        >
                                            {q.options.map((opt) => (
                                                <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0 p-4 rounded-md border has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                                    <FormControl>
                                                        <RadioGroupItem value={opt.value} id={`${q.id}-${opt.value}`} />
                                                    </FormControl>
                                                    <Label htmlFor={`${q.id}-${opt.value}`} className="font-normal flex-1 cursor-pointer">{opt.label}</Label>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Calculate My Baseline
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    </div>
  );
}
