import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail } from "lucide-react";

export function ContactCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact the Team</CardTitle>
        <CardDescription>
          Have questions or feedback? We'd love to hear from you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href="mailto:harpindersingh529@gmail.com">
            <Mail className="mr-2 h-4 w-4" />
            Email Support
          </a>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href="mailto:harpindersingh529@gmail.com">
            <LifeBuoy className="mr-2 h-4 w-4" />
            Help Center
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
