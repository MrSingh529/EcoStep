"use client";

import { useState, useEffect } from "react";
import { getLeaderboardUsers } from "@/lib/firestore-service";
import type { UserProfile } from "@/lib/firestore-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Medal, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Shield className="h-5 w-5 text-orange-600" />;
    return <span className="text-sm font-bold w-5 text-center">{rank + 1}</span>;
}

export function Leaderboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLeaderboardUsers()
      .then(setUsers)
      .catch(err => {
        console.error(err);
        setError("Could not load leaderboard data. Please check your Firestore security rules.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
        Global Leaderboard
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Top Earth Guardians</CardTitle>
          <CardDescription>See who is leading the charge in making a difference, ranked by XP.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : error ? (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={user.uid} className="flex items-center gap-4 p-2 rounded-lg even:bg-muted/50">
                  <div className="w-6 flex justify-center">{getRankIcon(index)}</div>
                  <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{user.displayName || 'Anonymous Guardian'}</p>
                    <p className="text-sm text-muted-foreground">Level {user.level || 1}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{user.xp || 0} XP</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
