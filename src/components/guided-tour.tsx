
"use client";

import { useState, useEffect, useCallback } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

export function GuidedTour() {
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const tourNeeded = localStorage.getItem('ecostep_guided_tour_needed');
    if (tourNeeded === 'true') {
      // Use a small timeout to ensure the dashboard elements are mounted
      setTimeout(() => {
        setRun(true);
      }, 500);
    }
  }, []);

  const steps: Step[] = [
    {
      content: <div className="text-center"><h2 className="text-2xl font-bold font-headline mb-2">Welcome to EcoStep!</h2><p>Let's take a quick tour of your dashboard.</p></div>,
      locale: { skip: <strong aria-label="skip">Skip</strong> },
      placement: 'center',
      target: 'body',
    },
    {
      target: '#tour-user-menu',
      content: 'This is your user menu. You can manage your profile, give feedback, or log out from here.',
      placement: 'bottom-end',
      disableBeacon: true,
    },
    {
      target: '#tour-gamification-status',
      content: 'Here you can track your Level, XP, and Daily Streak. Earn points by logging activities!',
      placement: 'bottom',
    },
    {
      target: '#tour-impact-cards',
      content: 'These cards give you a quick overview of your carbon footprint based on the time filter you select.',
      placement: 'bottom',
    },
    {
      target: '#tour-dashboard-charts',
      content: 'Dive deeper with these charts showing your impact breakdown and progress over time.',
      placement: 'top',
    },
    {
      target: '#tour-activities-link',
      content: 'When you\'re ready, head over to the Activities page to log your daily data and see your impact.',
      placement: 'bottom',
    },
    {
      content: <div className="text-center"><h2 className="text-2xl font-bold font-headline mb-2">You're All Set!</h2><p>Enjoy exploring the app and start making a positive impact on the planet.</p></div>,
      locale: { last: 'Finish' },
      placement: 'center',
      target: 'body',
    },
  ];

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('ecostep_guided_tour_needed', 'false');
    }
  }, []);

  if (!isClient) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          backgroundColor: 'hsl(var(--background))',
          arrowColor: 'hsl(var(--background))',
        },
        buttonClose: {
            display: 'none',
        },
        tooltip: {
            borderRadius: 'var(--radius)',
        },
        buttonNext: {
            borderRadius: 'calc(var(--radius) - 4px)',
            backgroundColor: 'hsl(var(--primary))',
        },
        buttonBack: {
            borderRadius: 'calc(var(--radius) - 4px)',
        }
      }}
    />
  );
}
