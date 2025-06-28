import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Utensils, GraduationCap, MapPin, ChevronRight, ScanLine } from "lucide-react";

const features = [
  {
    icon: ScanLine,
    title: "AI Product Analyzer",
    description: "Scan a product's name or photo for an eco-impact score.",
    href: "/analyzer",
  },
  {
    icon: Lightbulb,
    title: "Personalized Tips",
    description: "Get AI-powered suggestions based on your activity logs.",
    href: "/tips",
  },
  {
    icon: Utensils,
    title: "Eco-Recipe Generator",
    description: "Create sustainable recipes based on your preferences.",
    href: "/recipes",
  },
  {
    icon: GraduationCap,
    title: "Learn Section",
    description: "Read AI-generated articles on environmental topics.",
    href: "/learn",
  },
  {
    icon: MapPin,
    title: "Local Recommendations",
    description: "Discover eco-friendly tips tailored to your country.",
    href: "/recommendations",
  },
];

export default function AIHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          AI Hub
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore powerful AI tools to enhance your sustainable journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
