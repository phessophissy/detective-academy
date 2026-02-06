import { visionModel, generateWithRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { imageBase64, caseContext } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const prompt = `
      You are an expert forensic analyst AI. 
      Analyze this image in the context of a detective investigation.
      Case Context: ${caseContext || "General investigation"}
      
      Identify:
      1. Key objects or potential clues.
      2. Anomalies or things out of place.
      3. Hidden details that a casual observer might miss.
      
      Return a JSON object with:
      {
        "description": "Detailed analysis of the visual evidence...",
        "hiddenClues": ["Clue 1", "Clue 2"]
      }
    `;

        // Remove data URL prefix if present for the API call
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        const result = await generateWithRetry(visionModel, [
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg", // Assuming JPEG for simplicity, can be dynamic
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present (Gemini sometimes adds them even in JSON mode)
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(jsonStr));

    } catch (error) {
        console.error("Analysis failed:", error);
        return NextResponse.json({ error: "Failed to analyze evidence" }, { status: 500 });
    }
}
