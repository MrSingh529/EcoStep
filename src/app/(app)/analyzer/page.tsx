import { ProductAnalyzer } from "./components/product-analyzer";

export default function AnalyzerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          AI Product Analyzer
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Check the potential environmental impact of a product before you buy.
        </p>
      </div>

      <ProductAnalyzer />
    </div>
  );
}
