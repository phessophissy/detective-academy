const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const LIST_MODELS_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

async function listModels() {
    if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set.");
        return;
    }

    console.log("Listing available models...");
    try {
        const response = await fetch(LIST_MODELS_ENDPOINT);
        const data = await response.json();

        if (data.models) {
            console.log("\n--- Available Models ---");
            data.models.forEach(m => {
                // Filter for useful models to reduce noise
                if (m.name.includes("gemini") || m.name.includes("image")) {
                    console.log(`\nName: ${m.name}`);
                    console.log(`DisplayName: ${m.displayName}`);
                    console.log(`Methods: ${m.supportedGenerationMethods?.join(", ")}`);
                }
            });
            console.log("\n------------------------");
        } else {
            console.error("Failed to list models:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("List models request failed:", error);
    }
}

listModels();
