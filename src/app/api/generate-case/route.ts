import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { rank } = await req.json();

    const prompt = `
      Generate a unique detective mystery case for a player of rank: ${rank}.
      
      Structure the response EXACTLY according to this JSON schema:
      {
        "id": "generated-uuid",
        "title": "Case Title",
        "difficulty": 1-5 (integer),
        "description": "Brief case summary...",
        "correctHypothesisVector": "The factual truth of what happened (used for validation)",
        "scenes": [
          {
            "id": "scene-1",
            "title": "Scene Name",
            "description": "Visual description...",
            "imageUrl": "https://placehold.co/800x600?text=Scene+Visual", 
            "clues": [
               { "id": "c1", "description": "...", "type": "physical|testimony|digital", "isHidden": boolean }
            ]
          }
        ],
        "suspects": [
           { "id": "s1", "name": "...", "profile": "...", "alibi": "...", "isGuilty": boolean }
        ]
      }
      
      Make the mystery logical but challenging. Ensure the "correctHypothesisVector" is detailed enough to validate user theories.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(jsonStr));

  } catch (error: any) {
    console.error("Case generation failed:", error);
    return NextResponse.json({
      error: "Failed to generate case",
      details: error.message || String(error)
    }, { status: 500 });
  }
}
