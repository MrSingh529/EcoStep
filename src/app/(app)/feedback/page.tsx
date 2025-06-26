import { FeedbackForm } from "./components/feedback-form";

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Share Your Thoughts!
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your feedback helps make EcoStep better for everyone. We'd love to hear from you!
        </p>
      </div>
      <FeedbackForm />
    </div>
  );
}
