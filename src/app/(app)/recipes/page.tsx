import { RecipeGenerator } from "./components/recipe-generator";

export default function RecipesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Eco-Recipe Generator
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Create delicious, low-impact meals with the help of AI.
        </p>
      </div>

      <RecipeGenerator />
    </div>
  );
}
