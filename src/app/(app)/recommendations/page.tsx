import { RecommendationsGenerator } from "./components/recommendations-generator";

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Local Recommendations
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Discover sustainability tips and practices relevant to your country.
        </p>
      </div>

      <RecommendationsGenerator />
    </div>
  );
}
