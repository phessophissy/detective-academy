## 🧠 About This Project

**Detective Academy** was built for the **Gemini 3 Hackathon** hosted on Devpost.

This application integrates directly with the **Google Gemini 3 API**. It uses the Gemini 3 Flash or Gemini 3 Pro model (based on availability and performance) for:

- generating and evaluating investigative logic
- multimodal reasoning with user-provided evidence
- structured AI responses that power game progression

We chose the Gemini 3 model family to ensure the highest reasoning capacity and largest supported context window, which are critical for complex deduced storytelling flows.

### Gemini 3 Usage

In our backend API routes (e.g., `/api/analyzeEvidence` and `/api/evaluateHypothesis`), we call the latest **Gemini 3 model** via the official Gemini API. These calls use structured outputs and reasoning configurations to orchestrate multi-step inferences and maintain session state in real time.

You can inspect the code under `/api/` to see how we handle Gemini 3 integrations and how the AI guides game logic.

This project complies with all hackathon requirements, including public demo, public code repo, and a demo video showing the project functioning live on Vercel.

Built by: *Phessophissy*
