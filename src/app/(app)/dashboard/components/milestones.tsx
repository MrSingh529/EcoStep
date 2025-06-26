"use client";

import { Award, ShieldCheck, Target, TrendingDown, Share2, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { calculateMonthlyImpact, calculateSavings, ActivityData } from "@/lib/calculations";
import { useAuth } from "@/hooks/use-auth";
import { getActivities } from "@/lib/firestore-service";
import { ShareableMilestoneCard } from "@/components/shareable-milestone-card";
import { toPng } from 'html-to-image';

type Milestone = {
    icon: React.ElementType;
    title: string;
    description: string;
    achieved: boolean;
};

export function Milestones() {
    const [milestones, setMilestones] = useState<Milestone[]>([
        { icon: Target, title: "First Steps", description: "Logged your first activity.", achieved: false },
        { icon: TrendingDown, title: "Impact Reducer", description: "Reduced your monthly footprint.", achieved: false },
        { icon: ShieldCheck, title: "Green Commuter", description: "Saved CO2e with smart transport.", achieved: false },
        { icon: Award, title: "Eco-Hero", description: "Monthly footprint below 500 kg CO2e.", achieved: false },
    ]);
    const { user } = useAuth();
    const [sharingMilestone, setSharingMilestone] = useState<Milestone | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const fetchAndProcessMilestones = async () => {
            try {
                const storedActivities: ActivityData[] = await getActivities(user.uid);
                if (storedActivities.length > 0) {
                    const newMilestones = [...milestones].map(m => ({ ...m }));

                    newMilestones[0].achieved = true;

                    if (storedActivities.length > 1) {
                        const lastImpact = calculateMonthlyImpact(storedActivities[storedActivities.length - 1]).total;
                        const secondLastImpact = calculateMonthlyImpact(storedActivities[storedActivities.length - 2]).total;
                        if (lastImpact < secondLastImpact) newMilestones[1].achieved = true;
                    }

                    const latestActivity = storedActivities[storedActivities.length - 1];
                    if (calculateSavings(latestActivity) > 0) newMilestones[2].achieved = true;
                    if (calculateMonthlyImpact(latestActivity).total < 500) newMilestones[3].achieved = true;

                    setMilestones(newMilestones);
                }
            } catch (error) {
                console.error("Failed to process milestones:", error);
            }
        };

        fetchAndProcessMilestones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleDownload = () => {
        if (!cardRef.current || !sharingMilestone) return;
        setIsDownloading(true);
        toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `ecostep-milestone-${sharingMilestone.title.toLowerCase().replace(/ /g, '_')}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch(err => console.error(err))
            .finally(() => setIsDownloading(false));
    };

    return (
         <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
                Milestones
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {milestones.map((milestone) => (
                    <Card key={milestone.title} className={!milestone.achieved ? "opacity-50 flex flex-col" : "flex flex-col"}>
                        <CardHeader className="flex-grow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-primary/20 text-primary">
                                    <milestone.icon className="h-6 w-6" />
                                </div>
                                <CardTitle>{milestone.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{milestone.description}</p>
                        </CardContent>
                        <CardFooter>
                            {milestone.achieved && (
                                <Button variant="outline" size="sm" className="w-full" onClick={() => setSharingMilestone(milestone)}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {sharingMilestone && (
                <Dialog open={!!sharingMilestone} onOpenChange={(isOpen) => !isOpen && setSharingMilestone(null)}>
                    <DialogContent className="max-w-fit p-0 bg-transparent border-0">
                        <ShareableMilestoneCard milestone={sharingMilestone} user={user} innerRef={cardRef} />
                        <DialogFooter className="absolute bottom-4 right-4">
                            <Button onClick={handleDownload} disabled={isDownloading}>
                                {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                Download
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
