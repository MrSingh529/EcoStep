'use server';
/**
 * @fileOverview An AI flow to generate an educational article on an environmental topic.
 *
 * - generateArticle - A function that handles the article generation.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleInputSchema = z.object({
  topic: z.string().describe('The environmental topic for the article.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  title: z.string().describe('The title of the generated article.'),
  content: z.string().describe('The full content of the article, formatted in Markdown.'),
  keyTakeaways: z.array(z.string()).describe('A list of 3-4 key takeaway points from the article.'),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

export async function generateArticle(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
  return generateArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticlePrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are an expert environmental journalist. Your task is to write a clear, concise, and engaging article about the topic provided by the user.

The article should be well-structured, easy to understand for a general audience, and about 300-400 words long. Use Markdown for formatting (e.g., headings, bold text, lists).

After writing the article, provide a list of 3-4 key takeaways.

Topic: {{{topic}}}
`,
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
