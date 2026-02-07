# Gemini 3 Integration Proof

**Project:** Detective Academy
**Model Used:** `gemini-3-flash-preview`

## 1. API Implementation
We utilize the Google Generative AI SDK to interface with Gemini 3.

```typescript
// src/lib/gemini.ts
export const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
        responseMimeType: "application/json"
    }
});
```

## 2. Capabilities Demonstrated

### Structured JSON Output
All game logic (cases, evaluation, hints) is returned as strict JSON, ensuring the frontend can render dynamic UI elements like the **Suspect Probability Table**.

### Reasoning & Logic
The "Academy Engine" (`/api/evaluate-hypothesis`) compares user input against a hidden "Truth Vector" to score accuracy:

```json
{
  "score": 85,
  "isCorrect": false,
  "suspectProbabilities": { "Baroness": 15, "Gardener": 80 },
  "reasoningSummary": ["Gardener had means and motive", "Baroness has valid alibi"]
}
```

### Multimodality (Vision)
The `/api/analyze-evidence` route sends uploaded images to `gemini-3-flash-preview` for forensic analysis.

## 3. UI Evidence
- **Header Badge**: "Powered by Gemini 3"
- **Dev Mode**: Toggling this in the UI reveals the raw `modelName` and JSON response from the API.
