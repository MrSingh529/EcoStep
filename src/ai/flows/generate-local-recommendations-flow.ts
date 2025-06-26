'use server';
/**
 * @fileOverview An AI flow to generate local environmental recommendations.
 *
 * - generateLocalRecommendations - A function that handles recommendation generation.
 * - GenerateLocalRecommendationsInput - The input type for the function.
 * - GenerateLocalRecommendationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocalRecommendationsInputSchema = z.object({
  country: z.string().describe('The country to generate recommendations for.'),
});
export type GenerateLocalRecommendationsInput = z.infer<typeof GenerateLocalRecommendationsInputSchema>;

const RecommendationSchema = z.object({
    title: z.string().describe('The title of the recommendation.'),
    description: z.string().describe('A brief description of the recommendation and why it is relevant to the specified country.'),
    category: z.enum(["Recycling", "Conservation", "Shopping", "Policy", "Energy"]).describe("The category of the recommendation."),
});

const GenerateLocalRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe("A list of 5-6 eco-friendly recommendations tailored to the user's country."),
});
export type GenerateLocalRecommendationsOutput = z.infer<typeof GenerateLocalRecommendationsOutputSchema>;

export async function generateLocalRecommendations(input: GenerateLocalRecommendationsInput): Promise<GenerateLocalRecommendationsOutput> {
  return generateLocalRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocalRecsPrompt',
  input: {schema: GenerateLocalRecommendationsInputSchema},
  output: {schema: GenerateLocalRecommendationsOutputSchema},
  prompt: `You are an expert on global environmental practices and policies. A user from {{{country}}} wants actionable, localized sustainability recommendations.

Generate a list of 5-6 specific and relevant recommendations for someone living in that country. Consider factors like national recycling programs, common energy sources, unique ecosystems, or prevalent consumer habits in that region.

For each recommendation, provide a title, a brief description, and assign it to one of the following categories: "Recycling", "Conservation", "Shopping", "Policy", or "Energy".
`,
});

const generateLocalRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateLocalRecommendationsFlow',
    inputSchema: GenerateLocalRecommendationsInputSchema,
    outputSchema: GenerateLocalRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
