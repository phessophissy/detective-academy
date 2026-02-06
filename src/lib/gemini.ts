
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Use a model that supports JSON mode and multimodality
export const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
        responseMimeType: "application/json"
    }
});

// Helper to handle rate limits with exponential backoff
export async function generateWithRetry(
    modelInstance: any,
    prompt: string,
    retries = 3,
    baseDelay = 2000
): Promise<any> {
    try {
        return await modelInstance.generateContent(prompt);
    } catch (error: any) {
        if (retries > 0 && (error.status === 429 || error.message?.includes('429'))) {
            console.warn(`Rate limited. Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            return generateWithRetry(modelInstance, prompt, retries - 1, baseDelay * 2);
        }
        throw error;
    }
}
