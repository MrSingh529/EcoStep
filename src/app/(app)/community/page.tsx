import { CommunityChallenges } from "./components/community-challenges";
import { Leaderboard } from "./components/leaderboard";

export default function CommunityPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Community Hub
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Join challenges and see how you rank among fellow Earth Guardians.
        </p>
      </div>

      <CommunityChallenges />
      <Leaderboard />
    </div>
  );
}
