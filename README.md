## 🧠 Detective Academy: Powered by Gemini 3



Detective Academy transforms the standard "chat with AI" paradigm into a **reasoning-first detective game**. By leveraging **Gemini 3 Flash & Pro**, we generate infinite, logically consistent murder mysteries, analyze evidence multi-modally, and evaluate player deductions with probabilistic precision.

*(Note: All core reasoning logic is handled dynamically by Gemini 3. Nothing is hardcoded.)*

## 🏗️ Architecture: A Robust Reasoning Orchestrator

**Detective Academy is not a prompt wrapper.** It is a stateful application that orchestrates multiple specialized Gemini 3 calls to build a cohesive gameplay experience.

**Why this fits the "Action Era":**
1.  **Stateful Persistence**: A single prompt cannot solve this. The game maintains complex state (evidence found, player rank, case history) that persists across multiple AI interactions.
2.  **Multi-Step Agents**:
    *   **Generator Agent**: Creates the world, logic, and truth vector.
    *   **Vision Agent**: Analyzes *new* user-injected evidence in the context of the specific case.
    *   **Evaluator Agent**: Blindly compares user deductions against the hidden truth vector using probabilistic logic.
    *   **Visualizer Agent**: Reconstructs the scene visually based on evolving data.

```ascii
[User Interface]  <-- React/Next.js -->  [API Routes]
       |                                      |
       v                                      v
 [State Manager]                       [Gemini 3 Flash/Pro]
 (Game Context)                        (Reasoning Engine)
       ^                                      |
       |______________________________________|
             JSON Structured Output
```

## 🚀 Key Gemini 3 Capabilities Used

### 1. **Structured Reasoning (JSON Mode)**
We force Gemini to output complex game states (crime scenes, clues, suspect profiles) as strict JSON. This allows the UI to render interactive elements like the **Suspect Probability Table** and **Evidence Boards** rather than just text blocks.

### 2. **Multimodal Analysis & Generation**
- **Input**: Players upload photos of "evidence", analyzed by **Gemini 3 Vision**.
- **Output**: The game generates **realistic crime scene images** using `gemini-3-image-latest`, adhering to the specific clues and location data of the generated case.

### 3. **Probabilistic Scoring**
Instead of a simple "Correct/Incorrect", the engine calculates a confidence score for each suspect based on the player's hypothesis, modeling real detective intuition.

### 4. **Guidance Mode (Metacognition)**
If a player is stuck, they can ask for help. Gemini analyzes the *entire* case history and evidence to generate a subtle hint that nudges the player without spoiling the mystery.

## 🛠️ How to Demo

1.  **Start a Case**: Click "Initialize New Case".
2.  **Explore**: Read the scene and suspect profiles.
3.  **Investigate**: Use the **"Ask Gemini 3"** button if you get stuck.
4.  **Deduce**: Submit a hypothesis. Watch the **Probability Table** update in real-time.
5.  **Verify**: Toggle **Dev Mode** (▶ button) to see the raw Gemini JSON response.

## 📦 Tech Stack
- **AI**: Google Gemini 3 (Flash Preview / Pro)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules (Custom "Detective" Theme)
- **Deployment**: Vercel

---
*Built by Phessophissy for the Gemini 3 Hackathon*

