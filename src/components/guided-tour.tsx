
"use client";

import { useContext, useEffect, } from 'react';
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';

const steps = [
    {
      id: 'intro',
      title: 'Welcome to EcoStep!',
      text: "Let's take a quick tour of your dashboard to get you started.",
      buttons: [{ text: 'Skip', action: 'cancel', classes: 'shepherd-button-secondary' }, { text: 'Next', action: 'next' }]
    },
    {
      id: 'user-menu',
      attachTo: { element: '#tour-user-menu', on: 'bottom' },
      title: 'Your Profile',
      text: 'This is your user menu. You can manage your profile, give feedback, or log out from here.',
      buttons: [{ text: 'Back', action: 'back', classes: 'shepherd-button-secondary' }, { text: 'Next', action: 'next' }]
    },
    {
      id: 'gamification',
      attachTo: { element: '#tour-gamification-status', on: 'bottom' },
      title: 'Your Status',
      text: 'Here you can track your Level, XP, and Daily Streak. Earn points by logging activities!',
      buttons: [{ text: 'Back', action: 'back', classes: 'shepherd-button-secondary' }, { text: 'Next', action: 'next' }]
    },
    {
      id: 'impact-cards',
      attachTo: { element: '#tour-impact-cards', on: 'bottom' },
      title: 'Impact Overview',
      text: 'These cards give you a quick overview of your carbon footprint based on the time filter you select.',
      buttons: [{ text: 'Back', action: 'back', classes: 'shepherd-button-secondary' }, { text: 'Next', action: 'next' }]
    },
    {
      id: 'charts',
      attachTo: { element: '#tour-dashboard-charts', on: 'top' },
      title: 'Detailed Charts',
      text: 'Dive deeper with these charts showing your impact breakdown and progress over time.',
      buttons: [{ text: 'Back', action: 'back', classes: 'shepherd-button-secondary' }, { text: 'Next', action: 'next' }]
    },
    {
      id: 'activities',
      attachTo: { element: '#tour-activities-link', on: 'bottom' },
      title: 'Log Your Activities',
      text: "When you're ready, head over to the Activities page to log your daily data and see your impact.",
      buttons: [{ text: 'Back', action: 'back', classes: 'shepherd-button-secondary' }, { text: 'Next', action: 'next' }]
    },
    {
      id: 'finish',
      title: "You're All Set!",
      text: 'Enjoy exploring the app and start making a positive impact on the planet.',
      buttons: [{ text: 'Finish', action: 'next'}]
    },
];

const tourOptions = {
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      classes: 'shadow-md bg-popover',
      scrollTo: { behavior: 'smooth', block: 'center' }
    },
    useModalOverlay: true
};

function TourInstance() {
    const tour = useContext(ShepherdTourContext);

    useEffect(() => {
        const tourNeeded = localStorage.getItem('ecostep_guided_tour_needed');
        if (tourNeeded === 'true' && tour) {
            // Use a timeout to ensure all elements are rendered
            setTimeout(() => {
                tour.start();
                tour.on('complete', () => localStorage.setItem('ecostep_guided_tour_needed', 'false'));
                tour.on('cancel', () => localStorage.setItem('ecostep_guided_tour_needed', 'false'));
            }, 500);
        }
    }, [tour]);
    
    return null;
}


export function GuidedTourProvider({ children }: { children: React.ReactNode }) {
    return (
        <ShepherdTour steps={steps} tourOptions={tourOptions}>
            {children}
            <TourInstance />
        </ShepherdTour>
    )
}
