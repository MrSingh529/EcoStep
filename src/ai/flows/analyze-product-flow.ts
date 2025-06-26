'use server';
/**
 * @fileOverview An AI flow to analyze the environmental friendliness of a product.
 *
 * - analyzeProduct - A function that handles the product analysis.
 * - AnalyzeProductInput - The input type for the analyzeProduct function.
 * - AnalyzeProductOutput - The return type for the analyzeProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProductInputSchema = z.object({
  productName: z.string().optional().describe('The name of the product to analyze, e.g., "Brand X Laundry Detergent".'),
  photoDataUri: z.string().optional().describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
}).refine(data => data.productName || data.photoDataUri, {
  message: "Either a product name or a photo must be provided.",
});
export type AnalyzeProductInput = z.infer<typeof AnalyzeProductInputSchema>;

const AnalyzeProductOutputSchema = z.object({
  score: z.number().min(1).max(10).describe('An eco-friendliness score from 1 (very bad) to 10 (excellent).'),
  summary: z.string().describe('A brief summary explaining the score and overall assessment.'),
  pros: z.array(z.string()).describe('A list of positive environmental aspects of the product.'),
  cons: z.array(z.string()).describe('A list of negative environmental aspects of the product.'),
  alternatives: z.array(z.object({
    name: z.string().describe("The name of the alternative product or product type."),
    reason: z.string().describe("A brief explanation of why this alternative is more eco-friendly."),
  })).describe('A list of 2-3 more sustainable alternatives to the analyzed product.')
});
export type AnalyzeProductOutput = z.infer<typeof AnalyzeProductOutputSchema>;

export async function analyzeProduct(input: AnalyzeProductInput): Promise<AnalyzeProductOutput> {
  return analyzeProductFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProductPrompt',
  input: {schema: AnalyzeProductInputSchema},
  output: {schema: AnalyzeProductOutputSchema},
  prompt: `You are an expert environmental scientist specializing in consumer product lifecycle analysis.
  
  A user wants to know the environmental impact of a product. You will be provided with a product name, a photo of the product, or both. Use the photo as the primary source for identification and analysis if it exists. Use the product name to provide additional context if available. If no photo is provided, rely on the product name.
  
  Consider these hypothetical factors in your analysis:
  - **Packaging:** Is it likely to be excessive? Recyclable? Plastic-free?
  - **Ingredients/Materials:** Are they biodegradable, resource-intensive, or potentially polluting? (e.g., phosphates in detergents, plastics in textiles).
  - **Production:** Does manufacturing this type of product typically consume a lot of energy or water?
  - **Use & Disposal:** Does using the product create waste or pollution? Is it durable or single-use? Is it easy to recycle or does it end up in a landfill?

  Provide a balanced analysis, even if you have to make educated guesses based on the product type. Be concise and clear.

  After your analysis, suggest 2-3 more sustainable alternatives. These can be specific product types (e.g., "shampoo bars instead of bottled shampoo") or general categories (e.g., "products with compostable packaging"). For each alternative, briefly explain why it's a better choice.

  {{#if productName}}Product Name: {{{productName}}}{{/if}}
  {{#if photoDataUri}}{{media url=photoDataUri}}{{/if}}
  `,
});

const analyzeProductFlow = ai.defineFlow(
  {
    name: 'analyzeProductFlow',
    inputSchema: AnalyzeProductInputSchema,
    outputSchema: AnalyzeProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
