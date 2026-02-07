import { model, generateWithRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { hypothesis, caseContext } = await req.json();

    const prompt = `
      You are the Academy Engine. Evaluate a student detective's hypothesis.
      
      Case Truth: ${caseContext.correctHypothesisVector}
      Suspects: ${JSON.stringify(caseContext.suspects)}
      
      Student Hypothesis: "${hypothesis.statement}"
      
      Evaluate logical consistency, accuracy against the truth, and missing details.
      
      Return JSON:
      {
        "score": 0-100 (integer),
        "isCorrect": boolean (true if they identified the correct suspect AND means),
        "feedback": "Constructive feedback...",
        "reasoningTrace": [
           "Step 1: Analyzed student claim X against fact Y...",
           "Step 2: Checked suspect alibi consistency..."
        ],
        "suspectProbabilities": {
           "Suspect Name 1": 10,
           "Suspect Name 2": 85
        },
        "reasoningSummary": [
           "Evidence A contradicts Suspect B's alibi",
           "Means of entry matches Suspect C's skills"
        ],
        "nextHint": "A subtle hint if they are wrong, or a congratulatory note if right."
      }
    `;

    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(jsonStr);

    return NextResponse.json({
      ...parsedData,
      modelName: "gemini-3-flash-preview", // Explicitly stating model for Hackathon compliance
      rawResponse: parsedData // For Dev Mode
    });

  } catch (error: any) {
    console.error("Evaluation failed:", error);
    return NextResponse.json({
      error: "Failed to evaluate hypothesis",
      details: error.message || String(error)
    }, { status: 500 });
  }
}
