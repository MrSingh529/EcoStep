import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">EcoStep</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight">
              Understand and Reduce Your Environmental Impact
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              EcoStep helps you track your carbon footprint, discover personalized tips, and make a positive change for the planet. Start your journey to a more sustainable lifestyle today.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard">Start Tracking Now</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Image
              src="/hero-image.png"
              alt="EcoStep app screenshot"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
              data-ai-hint="nature app"
            />
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        Crafted with ❤️ by Harpinder Singh. © 2025 EcoStep.
      </footer>
    </div>
  );
}