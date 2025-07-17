
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, User } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { avatars } from "@/components/avatars";
import { cn } from "@/lib/utils";
import { DeleteAccountDialog } from "./delete-account-dialog";

const profileSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }).optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  birthYear: z.coerce.number().min(1920).max(new Date().getFullYear()).optional(),
  avatarId: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      country: user?.country || "",
      currency: user?.currency || "",
      gender: user?.gender as any || undefined,
      birthYear: user?.birthYear || undefined,
      avatarId: user?.avatarId || "sprout",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await updateUser(data as Partial<User>);
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
        action: (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        ),
      });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>This information may be used to personalize your experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="avatarId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Your Eco-Avatar</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-3 md:grid-cols-5 gap-4">
                        {Object.entries(avatars).map(([id, { component: Icon, label }]) => (
                          <FormItem key={id}>
                            <FormControl>
                              <RadioGroupItem value={id} id={`profile-${id}`} className="sr-only" />
                            </FormControl>
                            <Label htmlFor={`profile-${id}`} className={cn("flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground", field.value === id && "border-primary bg-primary/10")}>
                              <Icon className="w-16 h-16" />
                              <span className="text-xs font-semibold">{label}</span>
                            </Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Canada" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CAD" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="birthYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Year</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1995" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-wrap gap-4"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male" className="font-normal">Male</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female" className="font-normal">Female</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
                                <Label htmlFor="prefer_not_to_say" className="font-normal">Prefer not to say</Label>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            These actions are permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  );
}
