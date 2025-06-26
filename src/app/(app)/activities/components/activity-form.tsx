"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { activityCategories } from "@/lib/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, HelpCircle, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { saveActivity } from "@/lib/firestore-service";

const formSchema = z.object({
  // New Transportation fields
  transportMode: z.enum(["car", "motorbike", "public_transport", "cycling", "walking"]),
  distance: z.number().min(0).max(500),
  fuelEfficiency: z.number().min(1).optional(),
  ownsVehicle: z.boolean(),
  // Other fields
  energy: z.number().min(0).max(1000),
  waste: z.number().min(0).max(10),
  water: z.number().min(0).max(5000),
  food: z.number().min(0).max(5),
}).refine(data => {
    if ((data.transportMode === 'car' || data.transportMode === 'motorbike') && (!data.fuelEfficiency || data.fuelEfficiency <= 0)) {
        return false;
    }
    return true;
}, {
    message: "A positive fuel efficiency value is required for cars and motorbikes.",
    path: ["fuelEfficiency"],
});

type FormValues = z.infer<typeof formSchema>;

export function ActivityForm() {
  const [activeTab, setActiveTab] = useState(activityCategories[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transportMode: "car",
      distance: 20,
      ownsVehicle: false,
      fuelEfficiency: 12.5,
      energy: 200,
      waste: 2,
      water: 150,
      food: 1,
    },
  });

  const watchedTransportMode = form.watch("transportMode");

  async function onSubmit(data: FormValues) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to save activities.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await saveActivity(user.uid, data);

      toast({
        title: "Activities Saved!",
        description: "Your environmental impact has been updated.",
        action: (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        ),
      });
      router.push('/dashboard');
      router.refresh(); 
    } catch (error) {
      console.error("Failed to save activities:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save activities to the database.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {activityCategories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                <cat.icon className="mr-2 h-4 w-4" />
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <Card className="mt-4">
            <CardContent className="pt-6">
              <TabsContent value="transportation" forceMount>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="transportMode"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base">Primary mode of daily transport?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                          >
                            {(["car", "motorbike", "public_transport", "cycling", "walking"] as const).map(mode => (
                                <FormItem key={mode} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={mode} id={mode} />
                                </FormControl>
                                <Label htmlFor={mode} className="font-normal capitalize">{mode.replace('_', ' ')}</Label>
                                </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <ActivityField name="distance" label="Daily Distance (km)" unit="km" max={500} form={form} />

                  {(watchedTransportMode === 'car' || watchedTransportMode === 'motorbike') && (
                    <FormField
                      control={form.control}
                      name="fuelEfficiency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Fuel Efficiency (km/L)
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button type="button" tabIndex={-1}><HelpCircle className="h-4 w-4 text-muted-foreground" /></button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Enter how many kilometers your vehicle runs on 1 liter of fuel.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="e.g., 15"
                              {...field} 
                              onChange={e => field.onChange(e.target.valueAsNumber)}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="ownsVehicle"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I own a car or motorbike
                          </FormLabel>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">
                            Check this to enable savings calculations when you use other transport.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="energy" forceMount>
                <ActivityField name="energy" label="Electricity Usage (kWh/month)" unit="kWh" max={1000} form={form} />
              </TabsContent>
              <TabsContent value="waste" forceMount>
                <ActivityField name="waste" label="Waste Produced (kg/day)" unit="kg" max={10} form={form} />
              </TabsContent>
              <TabsContent value="water" forceMount>
                <ActivityField name="water" label="Water Consumption (liters/day)" unit="liters" max={5000} form={form} />
              </TabsContent>
              <TabsContent value="food" forceMount>
                <ActivityField name="food" label="Meat Consumption (servings/day)" unit="servings" max={5} form={form} />
              </TabsContent>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Activities
              </Button>
            </CardFooter>
          </Card>
        </Tabs>
      </form>
    </Form>
  );
}

function ActivityField({ name, label, unit, max, form }: { name: "distance" | "energy" | "waste" | "water" | "food", label: string, unit: string, max: number, form: any }) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                <div className="flex items-center gap-4">
                    <Slider
                    value={[field.value || 0]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={max}
                    step={name === 'waste' ? 0.1 : 1}
                    className="flex-1"
                    />
                    <div className="flex items-baseline gap-2 w-28">
                        <Input
                            type="number"
                            value={field.value || 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-20"
                            step={name === 'waste' ? '0.1' : '1'}
                        />
                        <span className="text-sm text-muted-foreground">{unit}</span>
                    </div>
                </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
    )
}
