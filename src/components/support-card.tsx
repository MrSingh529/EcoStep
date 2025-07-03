
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, PartyPopper } from "lucide-react";

export function SupportCard() {
  return (
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
            <a href="https://coff.ee/mrsingh529" target="_blank" rel="noopener noreferrer">
                <Coffee className="mr-2 h-4 w-4" />
                Buy me a Coffee
            </a>
        </Button>
      </CardContent>
    </Card>
  );
}
