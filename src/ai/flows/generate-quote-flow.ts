'use server';
/**
 * @fileOverview An AI flow to generate a short, inspirational environmental quote.
 *
 * - generateQuote - A function that generates a quote.
 * - GenerateQuoteOutput - The return type for the generateQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuoteOutputSchema = z.object({
  quote: z.string().describe('The text of the quote.'),
  author: z.string().describe('The person who said the quote. If unknown, use "Anonymous".'),
});
export type GenerateQuoteOutput = z.infer<typeof GenerateQuoteOutputSchema>;

export async function generateQuote(): Promise<GenerateQuoteOutput> {
  return generateQuoteFlow();
}

const prompt = ai.definePrompt({
  name: 'generateQuotePrompt',
  output: {schema: GenerateQuoteOutputSchema},
  prompt: `You are an AI assistant tasked with providing users with inspirational quotes.
  
  Generate a single, relatively short, and impactful quote related to nature, environmentalism, conservation, or sustainability.

  Provide the quote and its author.`,
});

const generateQuoteFlow = ai.defineFlow(
  {
    name: 'generateQuoteFlow',
    outputSchema: GenerateQuoteOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
