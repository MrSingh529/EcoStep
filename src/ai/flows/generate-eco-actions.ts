'use server';
/**
 * @fileOverview An AI flow to generate a list of common environmental actions.
 *
 * - generateEcoActions - A function that generates a list of eco-friendly actions.
 * - GenerateEcoActionsOutput - The return type for the generateEcoActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EcoActionSchema = z.object({
  id: z.string().describe("A unique, url-friendly identifier for the action, e.g., 'switch-to-leds'."),
  title: z.string().describe('A short, catchy title for the action.'),
  summary: z.string().describe('A one-sentence summary of the action.'),
  description: z.string().describe('A detailed description of the action, around 70-80 words, explaining its importance.'),
  tips: z.array(z.string()).describe('A list of 2-3 actionable tips related to implementing the action.'),
  icon: z.string().describe("The name of a relevant lucide-react icon, e.g., 'Lightbulb'."),
});

const GenerateEcoActionsOutputSchema = z.object({
  actions: z.array(EcoActionSchema),
});
export type GenerateEcoActionsOutput = z.infer<typeof GenerateEcoActionsOutputSchema>;

export async function generateEcoActions(): Promise<GenerateEcoActionsOutput> {
  return generateEcoActionsFlow();
}

const prompt = ai.definePrompt({
  name: 'generateEcoActionsPrompt',
  output: {schema: GenerateEcoActionsOutputSchema},
  prompt: `You are an AI assistant passionate about environmentalism. Generate a list of 10 diverse and impactful eco-friendly actions that a person can take in their daily life.

  For each action, provide the following:
  - id: A unique, URL-friendly identifier (e.g., 'reduce-food-waste').
  - title: A short, catchy title (e.g., "Reduce Food Waste").
  - summary: A one-sentence summary.
  - description: A detailed description of about 70-80 words.
  - tips: A list of 2-3 actionable tips.
  - icon: The name of a relevant icon from the lucide-react library (e.g., 'Trash2', 'Wind', 'ShoppingBag', 'Thermometer', 'Droplets', 'Bike', 'Lightbulb', 'Sprout', 'MessageSquare', 'Trees'). Ensure the icon exists in the library.

  Make the actions varied, covering topics like waste, energy, water, consumption, and advocacy.`,
});

const generateEcoActionsFlow = ai.defineFlow(
  {
    name: 'generateEcoActionsFlow',
    outputSchema: GenerateEcoActionsOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
