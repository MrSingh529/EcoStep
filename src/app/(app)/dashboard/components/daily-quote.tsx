import { getDailyQuoteAction } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export async function DailyQuote() {
  const result = await getDailyQuoteAction();

  if (!result.success) {
    return null; // Or show an error state
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
        Food for Thought
      </h2>
      <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/20 rounded-full">
                  <Lightbulb className="h-8 w-8 text-primary" />
              </div>
          </div>
          <blockquote className="text-xl font-medium text-foreground/90 italic">
            “{result.quote.quote}”
          </blockquote>
          <footer className="text-base not-italic font-semibold text-foreground/70 mt-4">
            — {result.quote.author}
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}
