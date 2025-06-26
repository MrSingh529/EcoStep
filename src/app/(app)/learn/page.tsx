import { ArticleGenerator } from "./components/article-generator";

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Learn Section
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Expand your knowledge with AI-generated articles on key environmental topics.
        </p>
      </div>

      <ArticleGenerator />
    </div>
  );
}
