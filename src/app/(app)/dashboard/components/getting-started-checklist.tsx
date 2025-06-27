"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ArrowRight, ListChecks, BrainCircuit, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const CHECKLIST_STORAGE_KEY = "eco-step-checklist-state";
const CHECKLIST_DISMISSED_KEY = "eco-step-checklist-dismissed";

type ChecklistState = {
    loggedActivity: boolean;
    visitedAiHub: boolean;
    visitedCommunity: boolean;
};

export function GettingStartedChecklist() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [checklistState, setChecklistState] = useState<ChecklistState>({
        loggedActivity: false,
        visitedAiHub: false,
        visitedCommunity: false,
    });

    // Initialize state from localStorage
    useEffect(() => {
        const dismissed = localStorage.getItem(CHECKLIST_DISMISSED_KEY);
        if (dismissed === 'true') {
            setIsVisible(false);
            return;
        }

        const storedState = localStorage.getItem(CHECKLIST_STORAGE_KEY);
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            setChecklistState(parsedState);
            if (Object.values(parsedState).every(Boolean)) {
                // If all tasks are done, hide and mark as dismissed
                localStorage.setItem(CHECKLIST_DISMISSED_KEY, 'true');
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        } else {
            // Only show for users with low XP to avoid showing it to established users.
             if ((user?.xp || 0) < 50) {
                setIsVisible(true);
             }
        }
    }, [user]);

    // Update state based on user actions
    useEffect(() => {
        const updateState = (key: keyof ChecklistState, value: boolean) => {
            if (checklistState[key] === value) return; // No change
            
            setChecklistState(prevState => {
                const newState = { ...prevState, [key]: value };
                localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(newState));
                if (Object.values(newState).every(Boolean)) {
                    // All tasks complete, hide the checklist
                    setTimeout(() => {
                        setIsVisible(false);
                        localStorage.setItem(CHECKLIST_DISMISSED_KEY, 'true');
                    }, 1000); // Small delay to show the last checkmark
                }
                return newState;
            });
        };

        if (user?.lastActivityDate) {
            updateState('loggedActivity', true);
        }

        if (pathname.includes('/ai-hub')) {
            updateState('visitedAiHub', true);
        }
        if (pathname.includes('/community')) {
            updateState('visitedCommunity', true);
        }
    }, [pathname, user, checklistState]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(CHECKLIST_DISMISSED_KEY, 'true');
    };

    if (!isVisible) {
        return null;
    }

    const tasks = [
        { id: 'loggedActivity', href: '/activities', text: 'Log your first activity', icon: ListChecks, completed: checklistState.loggedActivity },
        { id: 'visitedAiHub', href: '/ai-hub', text: 'Explore the AI Hub', icon: BrainCircuit, completed: checklistState.visitedAiHub },
        { id: 'visitedCommunity', href: '/community', text: 'Check out Community Challenges', icon: Users, completed: checklistState.visitedCommunity },
    ];
    
    const completedCount = Object.values(checklistState).filter(Boolean).length;
    
    return (
        <Card className="mb-8 relative bg-accent/20 border-accent/30 animate-in fade-in-0 duration-500">
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleDismiss}>
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
            </Button>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Getting Started ({completedCount}/{tasks.length})</CardTitle>
                <CardDescription>Welcome to EcoStep! Here are a few things to get you started on your journey.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tasks.map(task => (
                        <Link href={task.href} key={task.id} className="block">
                            <div className={cn(
                                "flex items-center gap-4 rounded-lg p-4 border transition-all",
                                task.completed ? "border-green-500/50 bg-green-500/10" : "hover:bg-accent/50"
                            )}>
                                <Checkbox checked={task.completed} className="h-5 w-5" />
                                <div className="flex-1">
                                    <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                                        {task.text}
                                    </p>
                                </div>
                                {!task.completed && <ArrowRight className="h-5 w-5 text-muted-foreground" />}
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}