"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PlayerState, PlayerRank, Case, Hypothesis, EngineResponse } from '@/lib/types';
import { useToast } from '@/components/Toast';

interface GameContextType {
    playerState: PlayerState;
    currentCase: Case | null;
    isLoading: boolean;
    startNewCase: () => Promise<void>;
    submitHypothesis: (hypothesis: Hypothesis) => Promise<EngineResponse>;
    analyzeImage: (file: File) => Promise<{ description: string; hiddenClues: string[] }>;
    quitCase: () => void;
    askForGuidance: () => Promise<{ hint: string; focusArea: string; modelName?: string }>;
}

const INITIAL_STATE: PlayerState = {
    rank: 'Cadet',
    completedCases: 0,
    accuracyScore: 100,
    currentCaseId: null,
    history: []
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function rankForCases(completed: number): PlayerRank {
    if (completed >= 12) return 'Senior Detective';
    if (completed >= 5) return 'Investigator';
    return 'Cadet';
}

export function GameProvider({ children }: { children: React.ReactNode }) {
    const { push } = useToast();
    const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_STATE);
    const [currentCase, setCurrentCase] = useState<Case | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load state from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('detective-academy-state');
        if (saved) {
            try {
                setPlayerState(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved state", e);
            }
        }
    }, []);

    // Save state whenever it changes
    useEffect(() => {
        localStorage.setItem('detective-academy-state', JSON.stringify(playerState));
    }, [playerState]);

    const startNewCase = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/generate-case', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rank: playerState.rank })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.details || "API call failed");
            }

            const newCase: Case = await res.json();
            setCurrentCase(newCase);
            setPlayerState(prev => ({ ...prev, currentCaseId: newCase.id }));
        } catch (error: any) {
            console.error("Failed to generate case", error);
            const msg = error.message || "Failed to contact Gemini API";
            if (msg.includes("429") || msg.includes("Too Many Requests")) {
                push({
                    type: "error",
                    title: "Rate limit reached",
                    message: "The AI Detective is busy. Please wait ~30 seconds and try again."
                });
            } else {
                push({ type: "error", title: "Case generation failed", message: msg, duration: 6000 });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const submitHypothesis = async (hypothesis: Hypothesis): Promise<EngineResponse> => {
        if (!currentCase) throw new Error("No active case");
        setIsLoading(true);

        try {
            const res = await fetch('/api/evaluate-hypothesis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hypothesis,
                    caseContext: {
                        correctHypothesisVector: currentCase.correctHypothesisVector,
                        suspects: currentCase.suspects
                    }
                })
            });

            if (!res.ok) throw new Error("API call failed");

            const response: EngineResponse = await res.json();

            if (response.isCorrect) {
                setPlayerState(prev => {
                    const completed = prev.completedCases + 1;
                    return {
                        ...prev,
                        completedCases: completed,
                        rank: rankForCases(completed),
                        currentCaseId: null, // case is closed in state...
                        history: [...prev.history, { caseId: currentCase.id, score: response.score, date: new Date().toISOString() }]
                    };
                });
                // ...but keep currentCase mounted so the player can see their victory
                // feedback & celebration. They return to HQ explicitly via quitCase().
            } else {
                setPlayerState(prev => ({
                    ...prev,
                    accuracyScore: Math.max(0, prev.accuracyScore - 5)
                }));
            }

            return response;
        } catch (error) {
            console.error("Evaluation error", error);
            push({
                type: "error",
                title: "Evaluation failed",
                message: "The Academy Engine could not grade your hypothesis. Try again."
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeImage = async (file: File) => {
        setIsLoading(true);
        try {
            const reader = new FileReader();
            return new Promise<{ description: string; hiddenClues: string[] }>((resolve, reject) => {
                reader.onload = async () => {
                    try {
                        const base64String = reader.result as string;
                        const res = await fetch('/api/analyze-evidence', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                imageBase64: base64String,
                                caseContext: currentCase ? `${currentCase.title}: ${currentCase.description}` : ""
                            })
                        });
                        if (!res.ok) throw new Error("Analysis failed");
                        const data = await res.json();
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                };
                reader.readAsDataURL(file);
            });
        } finally {
            setIsLoading(false);
        }
    };

    const quitCase = () => {
        setCurrentCase(null);
    };

    const askForGuidance = async () => {
        if (!currentCase) throw new Error("No active case");
        setIsLoading(true);
        try {
            // Send a richer, spoiler-free context so hints are actually useful.
            const guidanceContext = {
                title: currentCase.title,
                description: currentCase.description,
                clues: currentCase.scenes.flatMap(s => s.clues.map(c => ({ description: c.description, type: c.type }))),
                suspects: currentCase.suspects.map(s => ({ name: s.name, profile: s.profile, alibi: s.alibi }))
            };
            const res = await fetch('/api/get-guidance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseContext: JSON.stringify(guidanceContext),
                    currentEvidence: []
                })
            });

            if (!res.ok) throw new Error("Guidance failed");
            return await res.json();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GameContext.Provider value={{
            playerState,
            currentCase,
            isLoading,
            startNewCase,
            submitHypothesis,
            analyzeImage,
            quitCase,
            askForGuidance
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
