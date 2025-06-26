import { EcoActionsList } from "./components/eco-actions-list";

export default function ActionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Eco Actions
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Discover AI-recommended actions you can take to make a difference. Set goals or mark them as complete.
        </p>
      </div>

      <EcoActionsList />
    </div>
  );
}
