
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
import { Loader2, ArrowLeft } from "lucide-react";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { avatars } from "@/components/avatars";

const TOTAL_STEPS = 3;

const questions = [
  {
    id: "flights", text: "How many round-trip flights did you take in the last year?",
    options: [
      { value: "0", label: "None", co2: 0 },
      { value: "1", label: "1-2 short-haul (e.g., domestic)", co2: 400 },
      { value: "2", label: "1-2 long-haul (e.g., international)", co2: 3000 },
      { value: "3", label: "More than 2 long-haul", co2: 7000 },
    ],
  },
  {
    id: "carTravel", text: "On average, how much do you travel by a gasoline-powered car per week?",
    options: [
      { value: "0", label: "I don't use a car / I use an EV", co2: 100 },
      { value: "1", label: "Less than 100 km (60 miles)", co2: 500 },
      { value: "2", label: "100 - 300 km (60 - 180 miles)", co2: 1500 },
      { value: "3", label: "More than 300 km (180 miles)", co2: 3000 },
    ],
  },
  {
    id: "diet", text: "How would you describe your diet?",
    options: [
      { value: "0", label: "Vegan or Vegetarian", co2: 600 },
      { value: "1", label: "Low meat consumption (few times a week)", co2: 1200 },
      { value: "2", label: "Moderate meat consumption (daily)", co2: 2500 },
      { value: "3", label: "High meat consumption (most meals)", co2: 3300 },
    ],
  },
  {
    id: "energyUsage", text: "How conscious are you of your electricity usage at home?",
    options: [
      { value: "0", label: "Very conscious, I use renewables/unplug devices", co2: 500 },
      { value: "1", label: "Somewhat conscious, I turn off lights", co2: 1200 },
      { value: "2", label: "Not very conscious, I leave things on", co2: 2400 },
      { value: "3", label: "I use a lot of high-energy appliances", co2: 4000 },
    ],
  },
  {
    id: "onlineShopping", text: "How much of your shopping is done online?",
    options: [
      { value: "0", label: "Rarely, I prefer local stores", co2: 50 },
      { value: "1", label: "Occasionally, a few packages a month", co2: 150 },
      { value: "2", label: "Frequently, I get packages weekly", co2: 300 },
      { value: "3", label: "Constantly, it's my primary way to shop", co2: 500 },
    ],
  },
];

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  country: z.string().min(2, "Please enter your country."),
});
const avatarSchema = z.object({
  avatarId: z.string({ required_error: "Please select an avatar." }),
});
const questionnaireSchema = z.object({
  flights: z.string().nonempty({ message: "Please select an option." }),
  carTravel: z.string().nonempty({ message: "Please select an option." }),
  diet: z.string().nonempty({ message: "Please select an option." }),
  energyUsage: z.string().nonempty({ message: "Please select an option." }),
  onlineShopping: z.string().nonempty({ message: "Please select an option." }),
});

const formSchemas = [profileSchema, avatarSchema, questionnaireSchema];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchemas[step]),
    defaultValues: {
      displayName: user?.displayName || "",
      country: user?.country || "",
      avatarId: user?.avatarId || "sprout",
      flights: "", carTravel: "", diet: "", energyUsage: "", onlineShopping: "",
    },
  });

  const goNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };
  const goBack = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: any) => {
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
    
    const finalData = {
      ...form.getValues(),
      onboardingCompleted: true,
      baselineCo2: totalCo2,
    };
    
    try {
      await updateUser(finalData);
      localStorage.setItem('baselineCo2', totalCo2.toString());
      localStorage.setItem('onboardingDisplayName', finalData.displayName);
      localStorage.setItem('onboardingAvatarId', finalData.avatarId);
      router.push("/onboarding/results");
    } catch(error) {
      console.error("Failed to update user profile", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <Icons.logo className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold font-headline">Welcome to EcoStep!</h1>
          <p className="text-muted-foreground">
            Let's get your profile set up. It'll only take a minute.
          </p>
        </div>

        <Card>
          <CardHeader>
            <Progress value={((step + 1) / TOTAL_STEPS) * 100} className="h-2" />
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="min-h-[400px] flex flex-col justify-center">
                {step === 0 && <StepProfile form={form} />}
                {step === 1 && <StepAvatar form={form} />}
                {step === 2 && <StepQuestionnaire form={form} />}
              </CardContent>

              <CardFooter className="justify-between">
                {step > 0 ? (
                  <Button type="button" variant="ghost" onClick={goBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                ) : <div />}
                
                {step < TOTAL_STEPS - 1 ? (
                  <Button type="button" onClick={goNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Calculate My Baseline
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

const StepProfile = ({ form }: { form: any }) => (
  <div className="space-y-6 animate-in fade-in-0 duration-500">
    <h2 className="text-xl font-semibold text-center">Tell us about yourself</h2>
    <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
      <FormField
        control={form.control} name="displayName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input placeholder="Jane Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control} name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Canada" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

const StepAvatar = ({ form }: { form: any }) => (
  <div className="animate-in fade-in-0 duration-500">
    <FormField
      control={form.control} name="avatarId"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-xl font-semibold text-center block">Choose Your Eco-Avatar</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(avatars).map(([id, { component: Icon, label }]) => (
                <FormItem key={id}>
                  <FormControl>
                    <RadioGroupItem value={id} id={id} className="sr-only" />
                  </FormControl>
                  <Label htmlFor={id} className={cn("flex flex-col items-center justify-center gap-3 rounded-lg border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", field.value === id && "border-primary bg-primary/10")}>
                    <Icon className="w-20 h-20" />
                    <span className="font-semibold">{label}</span>
                  </Label>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-center" />
        </FormItem>
      )}
    />
  </div>
);

const StepQuestionnaire = ({ form }: { form: any }) => (
  <div className="space-y-6 animate-in fade-in-0 duration-500">
    <h2 className="text-xl font-semibold text-center">Estimate Your Baseline</h2>
    <p className="text-muted-foreground text-center -mt-4">Answer a few questions about your habits from the past year.</p>
    <div className="space-y-6 max-h-[50vh] overflow-y-auto p-2">
      {questions.map((q) => (
        <FormField
          key={q.id} control={form.control} name={q.id as any}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-semibold">{q.text}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt) => (
                    <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0 p-3 rounded-md border has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
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
    </div>
  </div>
);
