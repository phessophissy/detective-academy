"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import styles from "./InvestigationPanel.module.css";
import { EngineResponse } from "@/lib/types";

export default function InvestigationPanel() {
    const { submitHypothesis, analyzeImage, quitCase, isLoading } = useGame();
    const [hypothesis, setHypothesis] = useState("");
    const [lastResponse, setLastResponse] = useState<EngineResponse | null>(null);

    const handleSubmit = async () => {
        if (!hypothesis.trim()) return;

        const response = await submitHypothesis({
            statement: hypothesis,
            supportingEvidenceIds: [] // TODO: Implement evidence selection
        });
        setLastResponse(response);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const result = await analyzeImage(e.target.files[0]);
            // In a real app, this would add to global evidence state
            alert(`AI Analysis: ${result.description}\nFound: ${result.hiddenClues.join(", ")}`);
        }
    };

    return (
        <div className={styles.panel}>
            <h2>Investigation Interface</h2>

            <div className={styles.tools}>
                <div className={styles.tool}>
                    <label className={styles.label}>Upload Evidence (Image)</label>
                    <input type="file" onChange={handleFileUpload} className={styles.fileInput} disabled={isLoading} />
                </div>
            </div>

            <div className={styles.deductionArea}>
                <label className={styles.label}>Formulate Hypothesis</label>
                <textarea
                    className={styles.textarea}
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                    placeholder="Enter your deduction here (e.g., 'The janitor entered through the vent because...')"
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
                    <h3>Academy Feedback</h3>
                    <div className={styles.scoreCircle}>
                        <span>Match Score</span>
                        <strong>{lastResponse.score}%</strong>
                    </div>
                    <p className={styles.feedbackText}>{lastResponse.feedback}</p>

                    {lastResponse.reasoningTrace && (
                        <div className={styles.trace}>
                            <h4>Logic Trace:</h4>
                            <ul>
                                {lastResponse.reasoningTrace.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    )}
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
