const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAKI7-Ekw3PYxl_HKKvauZu4QNLbB_p4Uk";

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
        const result = await model.generateContent("Hello.");
        const response = await result.response;
        console.log(`✅ Success with ${modelName}`);
        return true;
    } catch (error) {
        if (error.message.includes("429")) {
            console.log(`✅ Success (Rate Limited) with ${modelName}`);
            return true;
        }
        console.error(`❌ Failed with ${modelName}:`, error.message.split("\n")[0]);
        return false;
    }
}

async function run() {
    await testModel("gemini-3.0-flash");
    await testModel("gemini-3-flash-preview");
    await testModel("gemini-3.0-flash-preview");

    // Fallback check
    await testModel("gemini-2.0-flash");
}

run();
