"use server";

import { generateEcoTips } from "@/ai/flows/generate-eco-tips";
import type { GenerateEcoTipsInput } from "@/ai/flows/generate-eco-tips";
import { analyzeProduct } from "@/ai/flows/analyze-product-flow";
import type { AnalyzeProductInput } from "@/ai/flows/analyze-product-flow";
import { generateEcoActions } from "@/ai/flows/generate-eco-actions";
import { generateQuote } from "@/ai/flows/generate-quote-flow";
import { generateRecipe } from "@/ai/flows/generate-recipe-flow";
import type { GenerateRecipeInput } from "@/ai/flows/generate-recipe-flow";
import { generateArticle } from "@/ai/flows/generate-article-flow";
import type { GenerateArticleInput } from "@/ai/flows/generate-article-flow";
import { generateLocalRecommendations } from "@/ai/flows/generate-local-recommendations-flow";
import type { GenerateLocalRecommendationsInput } from "@/ai/flows/generate-local-recommendations-flow";

export async function getEcoTipsAction(input: GenerateEcoTipsInput) {
  try {
    const result = await generateEcoTips(input);
    return { success: true, tips: result.tips };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate tips. Please try again." };
  }
}

export async function analyzeProductAction(input: AnalyzeProductInput) {
    try {
        const result = await analyzeProduct(input);
        return { success: true, analysis: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to analyze product. The AI model may be unavailable. Please try again later." };
    }
}

export async function getEcoActionsAction() {
  try {
    const result = await generateEcoActions();
    return { success: true, actions: result.actions };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate actions. Please try again." };
  }
}

export async function getDailyQuoteAction() {
  try {
    const result = await generateQuote();
    return { success: true, quote: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate a quote. Please try again." };
  }
}

export async function generateRecipeAction(input: GenerateRecipeInput) {
    try {
        const result = await generateRecipe(input);
        return { success: true, recipe: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to generate recipe. Please try again." };
    }
}

export async function generateArticleAction(input: GenerateArticleInput) {
    try {
        const result = await generateArticle(input);
        return { success: true, article: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to generate article. Please try again." };
    }
}

export async function generateLocalRecommendationsAction(input: GenerateLocalRecommendationsInput) {
    try {        
        const result = await generateLocalRecommendations(input);
        return { success: true, recommendations: result.recommendations };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to generate recommendations. Please try again." };
    }
}
