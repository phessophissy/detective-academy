const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCR-ApDBvTrxCBQaoFOuBOcC9SQTtspzmw";

async function testSVGGen() {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Generate a crime scene description and a simple SVG representation of it.
    Scene: A dusty Victorian study with a missing painting.
    
    Return JSON:
    {
      "description": "text...",
      "svg": "<svg>...</svg>" (string)
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (e) {
        console.error(e);
    }
}

testSVGGen();
