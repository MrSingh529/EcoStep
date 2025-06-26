// src/ai/flows/generate-eco-tips.ts
'use server';

/**
 * @fileOverview Generates personalized eco-tips for users based on their tracked activities.
 *
 * - generateEcoTips - A function that generates personalized eco-tips.
 * - GenerateEcoTipsInput - The input type for the generateEcoTips function.
 * - GenerateEcoTipsOutput - The return type for the generateEcoTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEcoTipsInputSchema = z.object({
  transportation: z.string().describe('Details about transportation activities.'),
  energyConsumption: z.string().describe('Details about energy consumption.'),
  wasteDisposal: z.string().describe('Details about waste disposal.'),
  waterUsage: z.string().describe('Details about water usage.'),
  foodConsumption: z.string().describe('Details about food consumption.'),
});
export type GenerateEcoTipsInput = z.infer<typeof GenerateEcoTipsInputSchema>;

const GenerateEcoTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of personalized eco-tips.'),
});
export type GenerateEcoTipsOutput = z.infer<typeof GenerateEcoTipsOutputSchema>;

export async function generateEcoTips(input: GenerateEcoTipsInput): Promise<GenerateEcoTipsOutput> {
  return generateEcoTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEcoTipsPrompt',
  input: {schema: GenerateEcoTipsInputSchema},
  output: {schema: GenerateEcoTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized eco-tips to users based on their tracked activities.

  Based on the following user activities, provide a list of actionable tips to reduce their environmental impact. Be concise and specific.

  Transportation: {{{transportation}}}
  Energy Consumption: {{{energyConsumption}}}
  Waste Disposal: {{{wasteDisposal}}}
  Water Usage: {{{waterUsage}}}
  Food Consumption: {{{foodConsumption}}}

  Tips:
  `,
});

const generateEcoTipsFlow = ai.defineFlow(
  {
    name: 'generateEcoTipsFlow',
    inputSchema: GenerateEcoTipsInputSchema,
    outputSchema: GenerateEcoTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
