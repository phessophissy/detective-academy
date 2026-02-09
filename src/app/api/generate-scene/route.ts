import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-3-pro-image-preview";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

function buildScenePrompt(
    location: string,
    description: string,
    clues: Array<{ description: string; type: string }>,
    suspects: Array<{ name: string }>
): string {
    const evidenceDetails = clues.map((c) => c.description).join(". ");
    const suspectNames = suspects.map((s) => s.name).join(", ");

    return `Generate a highly realistic, cinematic crime scene photograph.

Location: ${location}
Scene description: ${description}
Key physical evidence visible: ${evidenceDetails}
Suspects involved: ${suspectNames}

Art direction:
- Photorealistic detective/forensic crime scene
- Cinematic noir lighting with dramatic shadows
- Indoor environment with warm amber and cool blue tones
- High detail on forensic elements and evidence markers
- Atmospheric tension - dust particles in light beams
- No people visible in the scene
- No text overlays or watermarks
- Crime has already occurred - aftermath scene
- Subtle clues and evidence scattered naturally
- 16:9 widescreen composition
- Professional crime scene photography style`;
}

export async function POST(req: NextRequest) {
    try {
        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY not configured" },
                { status: 500 }
            );
        }

        const { location, description, clues, suspects } = await req.json();

        const prompt = buildScenePrompt(
            location || "Unknown Location",
            description || "A crime scene",
            clues || [],
            suspects || []
        );


        // Call Gemini 3 image generation via REST API
        // Implement exponential backoff for 429 errors
        let geminiResponse;
        const maxRetries = 3;
        const baseDelay = 1000;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                geminiResponse = await fetch(GEMINI_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: prompt }],
                            },
                        ],
                        generationConfig: {
                            responseModalities: ["TEXT", "IMAGE"],
                        },
                    }),
                });

                if (geminiResponse.status === 429 && attempt < maxRetries) {
                    console.warn(`Gemini API 429 (Rate Limit). Retrying in ${baseDelay * Math.pow(2, attempt)}ms...`);
                    await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
                    continue;
                }

                break; // If success or non-retryable error, exit loop
            } catch (err: any) {
                if (attempt === maxRetries) throw err;
                console.warn(`Gemini API fetch error. Retrying... ${err.message}`);
                await new Promise(resolve => setTimeout(resolve, baseDelay));
            }
        }

        if (!geminiResponse) {
            throw new Error("Failed to connect to Gemini API after retries");
        }

        if (!geminiResponse.ok) {
            const errBody = await geminiResponse.text();
            console.error("Gemini API error:", geminiResponse.status, errBody);

            // Parse error if possible to give better message
            let errorMessage = `Gemini API error: ${geminiResponse.status}`;
            try {
                const errJson = JSON.parse(errBody);
                errorMessage = errJson.error?.message || errorMessage;
            } catch { }

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: errBody,
                    status: geminiResponse.status,
                },
                { status: geminiResponse.status === 429 ? 429 : 502 }
            );
        }

        const geminiData = await geminiResponse.json();

        // Extract image data from response
        // Structure: candidates[0].content.parts[] -> find part with inlineData
        const candidate = geminiData.candidates?.[0];
        if (!candidate?.content?.parts) {
            console.error("Unexpected Gemini response structure:", JSON.stringify(geminiData, null, 2));
            return NextResponse.json(
                { error: "No image data in Gemini response", raw: geminiData },
                { status: 502 }
            );
        }

        let imageBase64: string | null = null;
        let mimeType = "image/png";

        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                imageBase64 = part.inlineData.data;
                mimeType = part.inlineData.mimeType || "image/png";
                break;
            }
        }

        if (!imageBase64) {
            console.error("No inlineData found in parts:", JSON.stringify(candidate.content.parts, null, 2));
            return NextResponse.json(
                { error: "Gemini did not return image data" },
                { status: 502 }
            );
        }

        // Return base64 image with data URI prefix for direct <img> src usage
        return NextResponse.json({
            image_base64: `data:${mimeType};base64,${imageBase64}`,
            prompt_used: prompt,
            model_used: GEMINI_MODEL,
        });
    } catch (error: any) {
        console.error("Image generation failed:", error);
        return NextResponse.json(
            {
                error: "Failed to generate scene image",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
