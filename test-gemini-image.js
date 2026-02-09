const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3-pro-image-preview";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

async function testGeminiImage() {
    if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set.");
        return;
    }

    console.log(`Testing Gemini Image Generation with model: ${MODEL}`);
    console.log(`Endpoint: ${ENDPOINT.replace(GEMINI_API_KEY, "REDACTED")}`);

    const prompt = "A futuristic city under a glass dome on Mars, cinematic lighting, 8k resolution.";

    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    responseModalities: ["TEXT", "IMAGE"]
                }
            })
        });

        console.log(`Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error Body:", errorText);
        } else {
            const data = await response.json();
            // console.log("Success! Response structure:");
            // console.log(JSON.stringify(data, null, 2).substring(0, 500) + "..."); 

            const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (imagePart) {
                console.log("SUCCESS: Image data received!");
                console.log("MimeType:", imagePart.inlineData.mimeType);
                console.log("Data length:", imagePart.inlineData.data.length);
            } else {
                console.error("FAILED: No image data in response.");
                console.log(JSON.stringify(data, null, 2));
            }
        }
    } catch (error) {
        console.error("Request failed:", error);
    }
}

testGeminiImage();
