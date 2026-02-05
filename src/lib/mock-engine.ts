import { Case, EngineResponse, Hypothesis, PlayerRank } from "./types";

const MOCK_CASES: Case[] = [
    {
        id: "case-001",
        title: "The Silent Gallery",
        difficulty: 1,
        description: "A priceless artifact has vanished from a sealed room. No signs of forced entry.",
        correctHypothesisVector: "Ventilation shaft access, inside job, janitor involved",
        scenes: [
            {
                id: "scene-1",
                title: "Main Exhibit Hall",
                description: "The glass case is empty. The sensors didn't trip.",
                imageUrl: "https://placehold.co/800x600/18181b/f4f4f5?text=Crime+Scene:+Gallery",
                clues: [
                    { id: "c1", description: "Dust disturbance on the ventilation grate", type: "physical", isHidden: true, coordinates: { x: 80, y: 10 } },
                    { id: "c2", description: "Fingerprint smudge on the inside of the glass", type: "physical", isHidden: false, coordinates: { x: 50, y: 50 } }
                ]
            }
        ],
        suspects: [
            { id: "s1", name: "Arthur P.", profile: "Head of security. Debt issues.", alibi: "Watching monitors.", isGuilty: false },
            { id: "s2", name: "Elena R.", profile: "Night janitor. Former acrobat.", alibi: "Cleaning restrooms.", isGuilty: true }
        ]
    }
];

export class MockEngine {
    static async generateCase(rank: PlayerRank): Promise<Case> {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real app, this would call Gemini 3 to generate a unique case
        // For now, return a static case
        return MOCK_CASES[0];
    }

    static async evaluateHypothesis(hypothesis: Hypothesis, currentCase: Case): Promise<EngineResponse> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const isCorrect = hypothesis.statement.toLowerCase().includes("janitor") || hypothesis.statement.toLowerCase().includes("ventilation");

        return {
            score: isCorrect ? 90 : 45,
            isCorrect,
            feedback: isCorrect
                ? "Excellent deduction. The ventilation grate was indeed the entry point."
                : "Your timeline doesn't account for the silent alarms. Re-examine the entry points.",
            reasoningTrace: [
                "Analyzed entity: 'ventilation grate' -> connection to 'suspicious entry'",
                "Checked assumption: 'sensors didn't trip' -> implies bypass or non-door entry",
                "Correlated Suspect 'Elena' (acrobat) with 'ventilation access'"
            ],
            nextHint: isCorrect ? "Investigate the janitor's locker." : "Look closely at the ceiling."
        };
    }

    static async analyzeImage(file: File): Promise<{ description: string; hiddenClues: string[] }> {
        await new Promise(resolve => setTimeout(resolve, 2500));
        return {
            description: "Analysis of file: " + file.name,
            hiddenClues: ["Trace of red clay on the floor", "Shadow inconsistent with light source"]
        };
    }
}
