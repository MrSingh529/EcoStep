import { ActivityForm } from "./components/activity-form";

export default function ActivitiesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Log Activities
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Enter your data for each category to calculate your environmental
          impact.
        </p>
      </div>
      <ActivityForm />
    </div>
  );
}
