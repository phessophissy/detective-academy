"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PlayerState, Case, Hypothesis, EngineResponse } from '@/lib/types';
// import { MockEngine } from '@/lib/mock-engine'; // Disabled for Real API

interface GameContextType {
    playerState: PlayerState;
    currentCase: Case | null;
    isLoading: boolean;
    startNewCase: () => Promise<void>;
    submitHypothesis: (hypothesis: Hypothesis) => Promise<EngineResponse>;
    analyzeImage: (file: File) => Promise<{ description: string; hiddenClues: string[] }>;
}

const INITIAL_STATE: PlayerState = {
    rank: 'Cadet',
    completedCases: 0,
    accuracyScore: 100,
    currentCaseId: null,
    history: []
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
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

    /* 
    Updated to use Real Gemini API Routes 
  */

    const startNewCase = async () => {
        setIsLoading(true);
        try {
            // Call the live API route
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
                alert("⚠️ The AI Detective is busy (Rate Limit Reached). Please wait 30 seconds and try again.");
            } else {
                alert(`Error: ${msg}`);
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

            // Update player state based on result
            if (response.isCorrect) {
                setPlayerState(prev => ({
                    ...prev,
                    completedCases: prev.completedCases + 1,
                    currentCaseId: null, // Case closed
                    history: [...prev.history, { caseId: currentCase.id, score: response.score, date: new Date().toISOString() }]
                }));
                setCurrentCase(null); // Return to lobby
            } else {
                // Penalty for incorrect guess
                setPlayerState(prev => ({
                    ...prev,
                    accuracyScore: Math.max(0, prev.accuracyScore - 5)
                }));
            }

            return response;
        } catch (error) {
            console.error("Evaluation error", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeImage = async (file: File) => {
        setIsLoading(true);
        try {
            // Convert file to Base64
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
                                caseContext: currentCase ? currentCase.description : ""
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

    return (
        <GameContext.Provider value={{
            playerState,
            currentCase,
            isLoading,
            startNewCase,
            submitHypothesis,
            analyzeImage
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
