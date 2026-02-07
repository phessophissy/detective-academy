import { model, generateWithRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { caseContext, currentEvidence } = await req.json();

        const prompt = `
            You are a senior detective mentor (Gemini 3). 
            The student detective is stuck. Provide guidance based on the case file.

            Case Context:
            ${JSON.stringify(caseContext)}

            Current Known Evidence:
            ${JSON.stringify(currentEvidence)}

            Provide a subtle hint that points them in the right direction without solving the case.
            Focus on overlooked details or contradictions.

            Return JSON:
            {
                "hint": "Have you checked the timestamp on...",
                "focusArea": "Review Witness Statements"
            }
        `;

        const result = await generateWithRetry(model, prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(jsonStr);

        return NextResponse.json({
            ...parsedData,
            modelName: "gemini-3-flash-preview"
        });

    } catch (error: any) {
        console.error("Guidance generation failed:", error);
        return NextResponse.json({
            error: "Failed to generate guidance",
            details: error.message
        }, { status: 500 });
    }
}
