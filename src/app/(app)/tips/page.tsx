import { EcoTipsGenerator } from "./components/eco-tips-generator";

export default function TipsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Personalized Eco-Tips
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Get AI-powered recommendations to reduce your environmental impact based on your activities.
        </p>
      </div>

      <EcoTipsGenerator />
    </div>
  );
}
