"use client";

import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // If onboarding is not complete, and we are not already on an onboarding page, redirect.
    if (user.onboardingCompleted === false && !pathname.startsWith('/onboarding')) {
      router.push('/onboarding');
    }

  }, [isLoading, user, router, pathname]);

  // Show a loader while checking auth state or if user data is still being processed
  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // For users completing onboarding, don't show the main header/layout.
  if (pathname.startsWith('/onboarding')) {
    return <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>;
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
       <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        Crafted with ❤️ by Harpinder Singh.
      </footer>
    </div>
  );
}
