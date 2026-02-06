import { model } from "@/lib/gemini";
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
        "nextHint": "A subtle hint if they are wrong, or a congratulatory note if right."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(jsonStr));

  } catch (error: any) {
    console.error("Evaluation failed:", error);
    return NextResponse.json({
      error: "Failed to evaluate hypothesis",
      details: error.message || String(error)
    }, { status: 500 });
  }
}
```
