# Gemini 3 Multimodal Image Generation

**Detective Academy** uses the `gemini-3-image-latest` model to dynamically reconstruct crime scenes based on the case narrative.

## 🖼️ Architecture

```ascii
[Case Context] -> [Prompt Engineering] -> [Gemini 3 Image Model] -> [Frontend Viewer]
```

## 🛠️ API Implementation

The `/api/generate-scene` endpoint handles the generation request:

1.  **Input**: Receives `location`, `description`, `clues`, and `suspects`.
2.  **Prompting**: Constructs a detailed prompt emphasizing "cinematic forensic realism".
3.  **Generation**: Calls `gemini-3-image-latest` (simulated via standard generation for the Hackathon demo if explicit image API is in preview).
4.  **Response**: Returns a Base64 encoded image or URL.

## 🔍 Features

-   **Dynamic Visualization**: Every scene is unique.
-   **Context Awareness**: The image includes details derived from the textual evidence (e.g., specific weapons, room layout).
-   **Transparency**: Users can toggle "View Gemini Image Prompt" to see exactly what was sent to the model.
-   **Regeneration**: Users can request a new angle/version if the first generation isn't perfect.

## 🧠 Key Capabilities Demonstrated

-   **Multimodal Output**: Generating pixels from text context.
-   **Structured Data Integration**: Using JSON case data to inform visual elements.
