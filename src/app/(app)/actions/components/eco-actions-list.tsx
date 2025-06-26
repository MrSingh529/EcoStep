"use client";

import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { format } from "date-fns";

import { getEcoActionsAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
type Action = {
  id: string;
  title: string;
  summary: string;
  description: string;
  tips: string[];
  icon: string;
};

type ActionState = {
  status: "completed" | "goal" | "dismissed";
  date?: string; // ISO string for goal date
};

const iconMap: { [key: string]: React.ElementType } = {
  Lightbulb: LucideIcons.Lightbulb,
  Trash2: LucideIcons.Trash2,
  Wind: LucideIcons.Wind,
  ShoppingBag: LucideIcons.ShoppingBag,
  Thermometer: LucideIcons.Thermometer,
  Droplets: LucideIcons.Droplets,
  Bike: LucideIcons.Bike,
  Sprout: LucideIcons.Sprout,
  MessageSquare: LucideIcons.MessageSquare,
  Trees: LucideIcons.Trees,
  Recycle: LucideIcons.Recycle,
  Leaf: LucideIcons.Leaf,
  Globe: LucideIcons.Globe,
};

const ACTIONS_STORAGE_KEY = "eco-actions-list";
const ACTION_STATE_STORAGE_KEY = "eco-actions-state";

export function EcoActionsList() {
  const [actions, setActions] = useState<Action[]>([]);
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [goalDate, setGoalDate] = useState<Date | undefined>(new Date());

  // Load actions and their states from localStorage or fetch new ones
  useEffect(() => {
    const fetchAndStoreActions = async () => {
      try {
        const storedActions = localStorage.getItem(ACTIONS_STORAGE_KEY);
        const storedStates = localStorage.getItem(ACTION_STATE_STORAGE_KEY);
        
        if (storedActions) {
          setActions(JSON.parse(storedActions));
        } else {
          const result = await getEcoActionsAction();
          if (result.success && result.actions) {
            setActions(result.actions);
            localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(result.actions));
          } else {
            throw new Error(result.error || "Failed to fetch actions.");
          }
        }
        
        if (storedStates) {
          setActionStates(JSON.parse(storedStates));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndStoreActions();
  }, []);

  const updateActionState = (actionId: string, status: "completed" | "goal" | "dismissed", date?: Date) => {
    const newStates = {
      ...actionStates,
      [actionId]: {
        status,
        date: date?.toISOString(),
      },
    };
    setActionStates(newStates);
    localStorage.setItem(ACTION_STATE_STORAGE_KEY, JSON.stringify(newStates));
    setSelectedAction(null); // Close dialog
  };
  
  const handleOpenDialog = (action: Action) => {
    setSelectedAction(action);
    setGoalDate(new Date());
  };

  const ActionIcon = ({ name }: { name: string }) => {
    const IconComponent = iconMap[name] || LucideIcons.CheckCircle;
    return <IconComponent className="h-8 w-8 text-primary" />;
  };
  
  const getStatusBadge = (actionId: string) => {
    const state = actionStates[actionId];
    if (!state) return null;
    
    if (state.status === 'completed') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"><LucideIcons.CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>;
    }
    if (state.status === 'goal' && state.date) {
      return <Badge variant="secondary"><LucideIcons.Target className="mr-1 h-3 w-3" /> Goal: {format(new Date(state.date), "MMM d")}</Badge>;
    }
    if (state.status === 'dismissed') {
      return <Badge variant="outline"><LucideIcons.XCircle className="mr-1 h-3 w-3" /> Dismissed</Badge>;
    }
    return null;
  };
  
  const availableActions = actions.filter(action => actionStates[action.id]?.status !== 'dismissed');
  const completedActions = actions.filter(action => actionStates[action.id]?.status === 'completed');

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <LucideIcons.TriangleAlert className="h-4 w-4" />
        <AlertTitle>Failed to load actions</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Recommended Actions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableActions.map((action) => (
            <Card key={action.id} className={cn("flex flex-col", actionStates[action.id] && "opacity-60")}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <ActionIcon name={action.icon} />
                  {getStatusBadge(action.id)}
                </div>
                <CardTitle className="pt-4">{action.title}</CardTitle>
                <CardDescription>{action.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOpenDialog(action)}
                    disabled={!!actionStates[action.id]}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {completedActions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
              Completed Actions
            </h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedActions.map((action) => (
                <Card key={action.id} className="bg-muted/40">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <ActionIcon name={action.icon} />
                      {getStatusBadge(action.id)}
                    </div>
                    <CardTitle className="pt-4">{action.title}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
      )}

      {selectedAction && (
        <Dialog open={!!selectedAction} onOpenChange={(isOpen) => !isOpen && setSelectedAction(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                  <ActionIcon name={selectedAction.icon} />
                  {selectedAction.title}
              </DialogTitle>
              <DialogDescription className="pt-2 text-base">
                {selectedAction.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <h4 className="font-semibold mb-2">Tips to get started:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {selectedAction.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
            </div>
            <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-2">
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <LucideIcons.CalendarIcon className="mr-2 h-4 w-4"/>
                                {goalDate ? format(goalDate, "PPP") : "Set a Goal Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                mode="single"
                                selected={goalDate}
                                onSelect={setGoalDate}
                                initialFocus
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button 
                        className="w-full"
                        onClick={() => updateActionState(selectedAction.id, 'goal', goalDate)}
                        disabled={!goalDate}
                    >
                        Add to My Goals
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    <Button variant="secondary" onClick={() => updateActionState(selectedAction.id, 'completed', new Date())}>I've Already Done This</Button>
                    <Button variant="ghost" onClick={() => updateActionState(selectedAction.id, 'dismissed')}>Not For Me</Button>
                </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
