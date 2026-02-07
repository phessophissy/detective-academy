"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import styles from "./InvestigationPanel.module.css";
import { EngineResponse } from "@/lib/types";

export default function InvestigationPanel() {
    const { submitHypothesis, analyzeImage, quitCase, askForGuidance, isLoading } = useGame();
    const [hypothesis, setHypothesis] = useState("");
    const [lastResponse, setLastResponse] = useState<EngineResponse | null>(null);
    const [guidance, setGuidance] = useState<{ hint: string; focusArea: string; modelName?: string } | null>(null);
    const [showDevMode, setShowDevMode] = useState(false);
    const [isGettingGuidance, setIsGettingGuidance] = useState(false);

    const handleSubmit = async () => {
        if (!hypothesis.trim()) return;

        const response = await submitHypothesis({
            statement: hypothesis,
            supportingEvidenceIds: []
        });
        setLastResponse(response);
        setGuidance(null); // Clear guidance on new submission
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const result = await analyzeImage(e.target.files[0]);
            alert(`AI Analysis: ${result.description}\nFound: ${result.hiddenClues.join(", ")}`);
        }
    };

    const handleGetGuidance = async () => {
        setIsGettingGuidance(true);
        try {
            const result = await askForGuidance();
            setGuidance(result);
        } catch (e) {
            alert("Gemini is busy collecting clues. Try again.");
        } finally {
            setIsGettingGuidance(false);
        }
    };

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2>Investigation Interface</h2>
                <div className={styles.geminiBadge}>
                    🧠 Powered by <strong>Gemini 3</strong>
                </div>
            </div>

            <div className={styles.tools}>
                <div className={styles.tool}>
                    <label className={styles.label}>Upload Evidence (Image)</label>
                    <input type="file" onChange={handleFileUpload} className={styles.fileInput} disabled={isLoading} />
                </div>

                <div className={styles.tool}>
                    <label className={styles.label}>Stuck? Ask Gemini 3</label>
                    <button
                        onClick={handleGetGuidance}
                        className={styles.guidanceBtn}
                        disabled={isLoading || isGettingGuidance}
                    >
                        {isGettingGuidance ? "Consulting AI..." : "Ask for Investigative Guidance"}
                    </button>
                </div>
            </div>

            {guidance && (
                <div className={styles.guidanceBox}>
                    <h4>🧠 Gemini says:</h4>
                    <p><strong>Focus Area:</strong> {guidance.focusArea}</p>
                    <p>"{guidance.hint}"</p>
                </div>
            )}

            <div className={styles.deductionArea}>
                <label className={styles.label}>Formulate Hypothesis</label>
                <textarea
                    className={styles.textarea}
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                    placeholder="Enter your deduction here..."
                    disabled={isLoading}
                />
                <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={isLoading || !hypothesis}
                >
                    {isLoading ? "Analyzing..." : "Submit to Academy Engine"}
                </button>
            </div>

            {lastResponse && (
                <div className={`${styles.feedback} ${lastResponse.isCorrect ? styles.success : styles.failure}`}>
                    <div className={styles.feedbackHeader}>
                        <h3>Gemini 3 Assessment</h3>
                        <span className={styles.modelTag}>Model: {lastResponse.modelName || "gemini-3-flash-preview"}</span>
                    </div>

                    <div className={styles.scoreCircle}>
                        <span>Match Score</span>
                        <strong>{lastResponse.score}%</strong>
                    </div>
                    <p className={styles.feedbackText}>{lastResponse.feedback}</p>

                    {/* Suspect Probabilities Table */}
                    {lastResponse.suspectProbabilities && (
                        <div className={styles.probTable}>
                            <h4>Suspect Probability Analysis</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Suspect</th>
                                        <th>Probability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(lastResponse.suspectProbabilities).map(([name, prob]) => (
                                        <tr key={name}>
                                            <td>{name}</td>
                                            <td>
                                                <div className={styles.probBar}>
                                                    <div className={styles.probFill} style={{ width: `${prob}%` }}></div>
                                                    <span>{prob}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Reasoning Summary */}
                    {lastResponse.reasoningSummary && (
                        <div className={styles.summaryBox}>
                            <h4>Gemini Reasoning Summary</h4>
                            <ul>
                                {lastResponse.reasoningSummary.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lastResponse.reasoningTrace && (
                        <div className={styles.trace}>
                            <h4>Gemini 3 Reasoning Trace:</h4>
                            <ul>
                                {lastResponse.reasoningTrace.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Dev Mode Toggle */}
                    <div className={styles.devMode}>
                        <button onClick={() => setShowDevMode(!showDevMode)} className={styles.devToggle}>
                            ▶ View Gemini Structured Response (Dev Mode)
                        </button>
                        {showDevMode && (
                            <pre className={styles.rawJson}>
                                {JSON.stringify(lastResponse.rawResponse || lastResponse, null, 2)}
                            </pre>
                        )}
                    </div>
                </div>
            )}

            {lastResponse && !lastResponse.isCorrect && (
                <div className={styles.actions}>
                    <button onClick={quitCase} className={styles.quitBtn}>
                        Return to Headquarters (Give Up)
                    </button>
                </div>
            )}
        </div>
    );
}
