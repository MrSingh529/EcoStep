
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address."}),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function LoginPage() {
  const { 
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    user, 
    isLoading, 
    isFirebaseConfigured 
  } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const loginForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });


  useEffect(() => {
    if (user && isFirebaseConfigured) {
      router.push("/dashboard");
    }
  }, [user, router, isFirebaseConfigured]);

  const handleLogin = async (data: FormValues) => {
    try {
      await signInWithEmail(data.email, data.password);
    } catch (error: any) {
      let description = "An unknown error occurred. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/invalid-email':
          case 'auth/wrong-password':
            description = "Invalid email or password. Please check your credentials and try again.";
            break;
          case 'auth/user-not-found':
            description = "No account found with this email address.";
            break;
          case 'auth/network-request-failed':
            description = "Network error. Please check your internet connection.";
            break;
          case 'auth/invalid-api-key':
            description = "Authentication failed. Please check your Firebase project configuration and authorized domains.";
            break;
          default:
            description = `An error occurred. Please check your Firebase configuration. (Code: ${error.code})`;
            break;
        }
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
      });
      loginForm.reset();
    }
  };

  const handleSignUp = async (data: FormValues) => {
    try {
      await signUpWithEmail(data.email, data.password);
    } catch (error: any) {
      let description = "An unknown error occurred during sign-up.";
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            description = "An account with this email address already exists. Please try signing in.";
            break;
          case 'auth/weak-password':
            description = "The password is too weak. Please choose a stronger password.";
            break;
          case 'auth/invalid-email':
            description = "The email address is not valid.";
            break;
          default:
            description = `An error occurred. Please check your Firebase configuration. (Code: ${error.code})`;
        }
      }
       toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: description,
      });
      signUpForm.reset();
    }
  };
  
  const handlePasswordReset = async (data: ResetFormValues) => {
    try {
      await sendPasswordReset(data.email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox to reset your password.",
      });
      setIsResetDialogOpen(false);
      resetForm.reset();
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "Could not send reset email. Please check the address and try again.",
      });
    }
  }


  if (isLoading || (user && isFirebaseConfigured)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-2 text-center mb-6">
        <Icons.logo className="h-12 w-12 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Welcome to EcoStep</h1>
        <p className="text-muted-foreground max-w-sm">
          Enter your credentials to access your account.
        </p>
      </div>

      {!isFirebaseConfigured && (
        <Alert variant="destructive" className="max-w-sm text-left mb-6">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Firebase Not Configured</AlertTitle>
          <AlertDescription>
            Authentication is disabled. Please provide your Firebase
            credentials in the <code>.env</code> file to enable login.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="signin" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Sign in to your existing account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input id="email-signin" type="email" placeholder="m@example.com" {...loginForm.register("email")} />
                  {loginForm.formState.errors.email && <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Password</Label>
                  <Input id="password-signin" type="password" {...loginForm.register("password")} />
                  {loginForm.formState.errors.password && <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting || !isFirebaseConfigured}>
                  {loginForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </CardContent>
             <CardFooter className="text-sm justify-center">
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="p-0 h-auto">Forgot Password?</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Your Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={resetForm.handleSubmit(handlePasswordReset)}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input
                              id="reset-email"
                              placeholder="m@example.com"
                              type="email"
                              {...resetForm.register("email")}
                            />
                            {resetForm.formState.errors.email && <p className="text-sm text-destructive mt-1">{resetForm.formState.errors.email.message}</p>}
                          </div>
                          <Button type="submit" className="w-full" disabled={resetForm.formState.isSubmitting}>
                            {resetForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Reset Link
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="m@example.com" {...signUpForm.register("email")} />
                   {signUpForm.formState.errors.email && <p className="text-sm text-destructive mt-1">{signUpForm.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" {...signUpForm.register("password")} />
                   {signUpForm.formState.errors.password && <p className="text-sm text-destructive mt-1">{signUpForm.formState.errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={signUpForm.formState.isSubmitting || !isFirebaseConfigured}>
                  {signUpForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
