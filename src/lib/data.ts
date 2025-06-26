import { Car, Droplets, Lightbulb, Trash2, Utensils, Zap, Vegan } from "lucide-react";

export const activityCategories = [
    { id: "transportation", name: "Transportation", icon: Car },
    { id: "energy", name: "Energy", icon: Lightbulb },
    { id: "waste", name: "Waste", icon: Trash2 },
    { id: "water", name: "Water", icon: Droplets },
    { id: "food", name: "Food", icon: Utensils },
];

export const communityChallengesData = [
    {
        id: "energy-saver-week",
        icon: Zap,
        title: "Energy Saver Week",
        description: "Reduce your monthly energy consumption by 10% compared to your last log.",
        progress: 65,
        goal: "10,000 kWh saved"
    },
    {
        id: "meat-free-monday",
        icon: Vegan,
        title: "Meat-Free Monday Challenge",
        description: "Log a meat-free day next Monday to collectively reduce our food footprint.",
        progress: 80,
        goal: "5,000 participants"
    },
    {
        id: "water-wise-month",
        icon: Droplets,
        title: "Water Wise Month",
        description: "Aim to keep your daily water usage below 100 liters for a whole month.",
        progress: 40,
        goal: "1M liters saved"
    }
];
