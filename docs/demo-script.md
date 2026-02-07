# Gemini 3 Hackathon - Demo Script

## 1. Introduction (The Hook)
"Hi, I'm [Your Name], and this is **Detective Academy**, a mystery solving game that doesn't just generate text—it *reasons* like a detective."

## 2. Technical Showcase (Why Gemini 3?)
"We built this using **Gemini 3 Flash Preview** to leverage its multimodal reasoning and structured JSON output capabilities. Unlike standard chatbots, our engine tracks factual consistency across generated scenes."

## 3. The Walkthrough

### Step 1: Case Generation
- **Action**: Click "Initialize New Case" (Rank: Cadet).
- **Highlight**: "Gemini instantly generates a unique crime scene, including an AI-drawn SVG visual of the evidence."
- **Visual**: Point out the "Powered by Gemini 3" badge in the header.

### Step 2: The Investigation
- **Action**: Read the scene description.
- **Action**: (Optional) Upload a dummy image to 'Analyze Evidence' to show multimodal vision capabilities.

### Step 3: Making a Deduction
- **Action**: Type a *wrong* hypothesis first (e.g., "The butler did it with a candlestick").
- **Action**: Click "Submit to Academy Engine".
- **Highlight**: Show the **Suspect Probability Table** and **Reasoning Summary**.
- **Say**: "Gemini analyzes my logic against the ground truth vector. It doesn't just say 'wrong'—it explains *why* using probabilistic scoring."

### Step 4: Guidance Mode (The "Wow" Factor)
- **Action**: Click "Ask for Investigative Guidance".
- **Highlight**: "If a player is stuck, we use a separate Gemini call to analyze the current evidence state and provide a subtle hint without spoiling the mystery."

### Step 5: Transparency (Dev Mode)
- **Action**: Toggle **"▶ View Gemini Structured Response"**.
- **Highlight**: "For the hackathon, we exposed the raw JSON to prove this is real-time structured generation, not hardcoded scripts."

## 4. Conclusion
"Detective Academy demonstrates how Gemini 3 can serve as a dynamic game master, creating infinite, logically consistent content on the fly. Thank you!"
