"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Coffee, Heart, Loader2, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const feedbackSchema = z.object({
    feedbackType: z.enum(["idea", "bug", "improvement", "other"], {
        required_error: "Please select a feedback type.",
    }),
    message: z.string().min(10, { message: "Please enter at least 10 characters." }).max(2000, { message: "Feedback cannot exceed 2000 characters."}),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            message: "",
        },
    });

    const onSubmit = async (data: FeedbackFormValues) => {
        setIsSubmitting(true);
        // In a real app, you'd send this data to a server/API
        console.log("Feedback submitted:", data);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: "Feedback Sent!",
            description: "Thank you for helping us improve EcoStep.",
            action: (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
            ),
        });
        form.reset();
        setIsSubmitting(false);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                             <CardHeader>
                                <CardTitle>Submit Your Feedback</CardTitle>
                                <CardDescription>Found a bug? Have an idea? Let us know!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="feedbackType"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>What kind of feedback do you have?</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                                >
                                                    <FormItem className="flex items-center space-x-2">
                                                        <RadioGroupItem value="idea" id="idea" />
                                                        <Label htmlFor="idea" className="font-normal">New Idea</Label>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <RadioGroupItem value="bug" id="bug" />
                                                        <Label htmlFor="bug" className="font-normal">Bug Report</Label>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <RadioGroupItem value="improvement" id="improvement" />
                                                        <Label htmlFor="improvement" className="font-normal">Improvement</Label>
                                                    </FormItem>
                                                     <FormItem className="flex items-center space-x-2">
                                                        <RadioGroupItem value="other" id="other" />
                                                        <Label htmlFor="other" className="font-normal">Other</Label>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us what's on your mind..."
                                                    className="resize-y min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                             <CardFooter className="justify-between">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Feedback
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>
            <div className="space-y-8">
                 <Card className="bg-gradient-to-br from-accent/50 to-transparent">
                    <CardHeader>
                        <div className="flex justify-center mb-2">
                            <div className="p-3 rounded-full bg-background border shadow-sm">
                               <PartyPopper className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-center">Enjoying EcoStep?</CardTitle>
                        <CardDescription className="text-center">
                            If you find this app helpful, consider supporting its development. Your contribution helps keep the servers running and new features coming!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            {/* Make sure to replace this with your actual "Buy Me A Coffee" link */}
                            <a href="https://coff.ee/mrsingh529" target="_blank" rel="noopener noreferrer">
                                <Coffee className="mr-2 h-4 w-4" />
                                Buy me a Coffee
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
