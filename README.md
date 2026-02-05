# Detective Academy

**An AI-Powered Immersive Investigative Simulator**

> Built for the Gemini 3 Hackathon. Powered by Google's `gemini-2.0-flash-exp`.

## Overview
Detective Academy is a next-generation role-playing platform where users train as budding detectives under an intelligent AI Game Master. Unlike static logic puzzles or linear visual novels, Detective Academy uses **Gemini 2.0's multimodal reasoning** to generate unique cases, analyze visual evidence uploaded by the user, and evaluate complex hypotheses in real-time.

## How Gemini 3 is Used
This application relies entirely on the Gemini API for its core loop. It is not a wrapper around a database of pre-written cases; the "Game Master" is live AI.

*   **Case Generation**: We use `gemini-2.0-flash-exp` to construct causally consistent mystery scenarios, complete with scene descriptions, physical clues, and suspect alibis, generated on-the-fly based on player rank.
*   **Multimodal Evidence Analysis**: Users can upload images of "crime scenes" (or any photo). The Vision capabilities of Gemini 2.0 analyze these images to find hidden clues and anomalies relevant to the current case context.
*   **Logical Evaluation**: The engine does not just match keywords. It performs a chain-of-thought evaluation of the user's free-text hypothesis against the ground-truth vector of the generated case, providing coaching feedback and a transparent reasoning trace.

## Features
*   🧬 **Live Case Generation**: Infinite replayability with varying difficulty.
*   👁️ **Vision Analysis**: Upload evidence photos for AI forensic scanning.
*   🧠 **Reasoning Engine**: Get graded on logic, not just guessing the right name.
*   🕵️ **Progression System**: Earn ranks from Cadet to Senior Detective.

## Getting Started

### Prerequisites
*   Node.js 18+
*   A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/phessophissy/detective-academy.git
    cd detective-academy
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Tech Stack
*   **Framework**: Next.js 15 (App Router)
*   **AI**: Google Generative AI SDK (`@google/generative-ai`)
*   **Styling**: Vanilla CSS (CSS Modules)
*   **Deployment**: Vercel

## Demo
[Live Demo URL](https://detective-academy.vercel.app/)
