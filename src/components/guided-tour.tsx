"use client";

import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps } from "react-joyride";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";

const TOUR_COMPLETED_KEY = "ecostep-tour-completed";

export const GuidedTour = () => {
    const { user } = useAuth();
    const [run, setRun] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
        // Run tour if it hasn't been completed and user has a low level (is new)
        if (!tourCompleted && user && (user.level || 1) <= 1 && (user.xp || 0) < 50) {
            setRun(true);
        }
    }, [user]);

    const steps: Step[] = [
        {
            target: "#tour-gamification-status",
            content: "This is your status panel. Here you can track your level, XP, and daily streak. The more you log, the more you progress!",
            disableBeacon: true,
        },
        {
            target: "#tour-impact-cards",
            content: "These cards give you a quick summary of your environmental footprint. They update every time you log a new activity.",
        },
        {
            target: "#tour-dashboard-charts",
            content: "Here are more detailed charts. You can see a breakdown of your impact by category and track your progress over time.",
        },
        {
            target: "#tour-activities-link",
            content: "Ready to start? Click here to log your first activity and see how it affects your numbers!",
            placement: 'right'
        },
        {
            target: "#tour-user-menu",
            content: "You can always access your profile, provide feedback, or learn more about the app from this menu.",
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = ["finished", "skipped"];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem(TOUR_COMPLETED_KEY, "true");
        }
    };
    
    // Don't render on the server or if run is false
    if (typeof window === "undefined" || !run) {
        return null;
    }

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    arrowColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    primaryColor: '#8FBC8F',
                    textColor: theme === 'dark' ? '#f8fafc' : '#1e293b',
                    zIndex: 1000,
                },
                 buttonClose: {
                    display: 'none',
                },
            }}
        />
    );
};
