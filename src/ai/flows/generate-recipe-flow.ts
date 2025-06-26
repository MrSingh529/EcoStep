'use server';
/**
 * @fileOverview An AI flow to generate an eco-friendly recipe.
 *
 * - generateRecipe - A function that handles recipe generation.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  diet: z.string().optional().describe('The dietary preference, e.g., "vegetarian", "vegan", "low-carb".'),
  cuisine: z.string().optional().describe('The type of cuisine, e.g., "Italian", "Mexican", "Asian".'),
  ingredients: z.string().optional().describe('A comma-separated list of ingredients the user has or wants to use.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  title: z.string().describe('The name of the recipe.'),
  description: z.string().describe('A short, appealing description of the dish.'),
  servings: z.string().describe('The number of servings the recipe makes.'),
  prepTime: z.string().describe('The preparation time, e.g., "15 minutes".'),
  cookTime: z.string().describe('The cooking time, e.g., "30 minutes".'),
  ingredients: z.array(z.string()).describe('A list of ingredients with quantities.'),
  instructions: z.array(z.string()).describe('A list of step-by-step instructions.'),
  sustainabilityTip: z.string().describe('A tip on how to make this recipe even more sustainable, e.g., by using leftovers or sourcing local ingredients.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a creative chef who specializes in sustainable, low-carbon-footprint cooking. A user wants a recipe.

Generate a delicious and eco-friendly recipe based on their preferences. Prioritize plant-based ingredients and seasonal produce where possible.

User Preferences:
{{#if diet}}Dietary Preference: {{{diet}}}{{/if}}
{{#if cuisine}}Cuisine Style: {{{cuisine}}}{{/if}}
{{#if ingredients}}Ingredients to use: {{{ingredients}}}{{/if}}

After creating the recipe, add a unique sustainability tip related to the dish.
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
