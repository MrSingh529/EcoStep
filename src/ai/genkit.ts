import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Log to check if the environment variable is loaded on the server.
// This will only show up in the server-side console/logs (e.g., Vercel logs), not the browser.
console.log(
  'Initializing Genkit. GOOGLE_API_KEY available:',
  !!process.env.GOOGLE_API_KEY
);
if (!process.env.GOOGLE_API_KEY) {
  console.error(
    'FATAL: GOOGLE_API_KEY environment variable is not set. AI features will fail.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
