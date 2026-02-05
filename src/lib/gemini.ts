
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Use a model that supports JSON mode and multimodality
export const model = genAI.getGenerativeModel({
    model: "gemini-3.0-flash",
    generationConfig: {
        responseMimeType: "application/json"
    }
});

export const visionModel = genAI.getGenerativeModel({
    model: "gemini-3.0-flash"
});
