'use client';

import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/hooks/use-auth';
import { avatars } from '@/components/avatars';
import { Icons } from '@/components/icons';

type Milestone = {
    icon: React.ElementType;
    title: string;
    description: string;
    achieved: boolean;
};

interface ShareableMilestoneCardProps {
    milestone: Milestone;
    user: User | null;
    innerRef: React.Ref<HTMLDivElement>;
}

export function ShareableMilestoneCard({ milestone, user, innerRef }: ShareableMilestoneCardProps) {
    const AvatarComponent = user?.avatarId ? avatars[user.avatarId]?.component : null;
    
    return (
        <div ref={innerRef} className="w-[400px] h-[400px] p-8 flex flex-col justify-between bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground font-body">
            <div>
                <div className="flex items-center gap-4">
                     {AvatarComponent && (
                        <div className="bg-background/20 rounded-full p-1">
                            <AvatarComponent className="w-16 h-16" />
                        </div>
                    )}
                    <div>
                        <p className="text-lg font-semibold">{user?.displayName || 'An Earth Guardian'}</p>
                        <p className="text-sm opacity-80">has unlocked a milestone!</p>
                    </div>
                </div>
            </div>

            <div className="text-center space-y-3">
                <div className="inline-block p-4 bg-background/20 rounded-full">
                    <milestone.icon className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold font-headline">{milestone.title}</h2>
                <p className="text-lg opacity-90">{milestone.description}</p>
            </div>

            <div className="flex items-center justify-center gap-2 opacity-70">
                <Icons.logo className="h-6 w-6" />
                <span className="text-xl font-bold">EcoStep</span>
            </div>
        </div>
    );
}
