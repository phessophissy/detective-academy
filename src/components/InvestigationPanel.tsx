"use client";

import { useState, type ChangeEvent } from "react";
import { useGame } from "@/context/GameContext";
import { useToast } from "@/components/Toast";
import styles from "./InvestigationPanel.module.css";
import { EngineResponse } from "@/lib/types";

interface InvestigationPanelProps {
    onSolved?: () => void;
}

export default function InvestigationPanel({ onSolved }: InvestigationPanelProps) {
    const { submitHypothesis, analyzeImage, quitCase, askForGuidance, isLoading, currentCase } = useGame();
    const { push } = useToast();
    const [hypothesis, setHypothesis] = useState("");
    const [lastResponse, setLastResponse] = useState<EngineResponse | null>(null);
    const [guidance, setGuidance] = useState<{ hint: string; focusArea: string; modelName?: string } | null>(null);
    const [showDevMode, setShowDevMode] = useState(false);
    const [isGettingGuidance, setIsGettingGuidance] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const handleSubmit = async () => {
        if (!hypothesis.trim()) return;
        setAttempts((a) => a + 1);
        try {
            const response = await submitHypothesis({
                statement: hypothesis,
                supportingEvidenceIds: [],
            });
            setLastResponse(response);
            setGuidance(null);
            if (response.isCorrect) {
                push({
                    type: "success",
                    title: "Case Closed!",
                    message: `Match score ${response.score}% — the Academy has accepted your deduction.`,
                    duration: 6000,
                });
                onSolved?.();
            } else {
                push({
                    type: "info",
                    title: "Hypothesis graded",
                    message: `Match score ${response.score}%. Refine your theory and try again.`,
                });
            }
        } catch {
            // context already shows a toast
        }
    };

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const result = await analyzeImage(e.target.files[0]);
                push({
                    type: "info",
                    title: "🔍 Forensic Scanner",
                    message: result.description
                        ? `${result.description}${result.hiddenClues?.length ? ` · Possible clues: ${result.hiddenClues.join(", ")}` : ""}`
                        : "No notable findings in that image.",
                    duration: 7000,
                });
            } catch {
                push({ type: "error", title: "Scan failed", message: "Gemini could not analyze that image. Try another." });
            } finally {
                e.target.value = "";
            }
        }
    };

    const handleGetGuidance = async () => {
        setIsGettingGuidance(true);
        try {
            const result = await askForGuidance();
            setGuidance(result);
            push({
                type: "hint",
                title: "🧠 Mentor tip",
                message: `${result.focusArea}: ${result.hint}`,
                duration: 8000,
            });
        } catch {
            push({ type: "error", title: "Gemini is busy", message: "Could not retrieve guidance right now. Try again." });
        } finally {
            setIsGettingGuidance(false);
        }
    };

    const insertSuspect = (name: string) => {
        setHypothesis((h) => {
            const sep = h && !h.endsWith(" ") ? " " : "";
            return `${h}${sep}${name} `;
        });
    };

    const suspects = currentCase?.suspects ?? [];

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2>Investigation Interface</h2>
                <div className={styles.geminiBadge}>🧠 Gemini 3</div>
            </div>

            <div className={styles.attemptsRow}>
                <span className={styles.attemptPill}>Attempts: <strong>{attempts}</strong></span>
                <span className={styles.attemptPill}>Length: <strong>{hypothesis.trim().length}</strong></span>
            </div>

            {suspects.length > 0 && (
                <div className={styles.chipsRow}>
                    <span className={styles.chipsLabel}>Quick-add a suspect:</span>
                    <div className={styles.chips}>
                        {suspects.map((s) => (
                            <button
                                key={s.id}
                                className={styles.chip}
                                onClick={() => insertSuspect(s.name)}
                                type="button"
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.tools}>
                <label className={styles.toolBtn}>
                    <span>📸 Upload Evidence</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className={styles.fileInput}
                        disabled={isLoading}
                    />
                </label>
                <button
                    onClick={handleGetGuidance}
                    className={styles.guidanceBtn}
                    disabled={isLoading || isGettingGuidance}
                >
                    {isGettingGuidance ? "Consulting AI…" : "🧠 Ask for a Hint"}
                </button>
            </div>

            {guidance && (
                <div className={`${styles.guidanceBox} anim-slideIn`}>
                    <h4>🧠 Gemini mentor says:</h4>
                    <p><strong>Focus area:</strong> {guidance.focusArea}</p>
                    <p className={styles.guidanceHint}>“{guidance.hint}”</p>
                </div>
            )}

            <div className={styles.deductionArea}>
                <label className={styles.label}>Formulate Hypothesis</label>
                <textarea
                    className={styles.textarea}
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                    placeholder="It was [suspect] because the clue on the vent suggests entry from above, which matches their acrobat background. The guard's alibi is solid…"
                    disabled={isLoading}
                />
                <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={isLoading || !hypothesis.trim()}
                >
                    {isLoading ? "Analyzing…" : "Submit to Academy Engine"}
                </button>
            </div>

            {lastResponse && (
                <div className={`${styles.feedback} ${lastResponse.isCorrect ? styles.success : styles.failure} anim-slideIn`}>
                    <div className={styles.feedbackHeader}>
                        <h3>{lastResponse.isCorrect ? "🎉 Case Closed!" : "Gemini 3 Assessment"}</h3>
                        <span className={styles.modelTag}>
                            Model: {lastResponse.modelName || "gemini-3-flash-preview"}
                        </span>
                    </div>

                    {lastResponse.isCorrect && (
                        <div className={styles.celebrate}>
                            <div className={styles.confetti} aria-hidden="true" />
                            <p>Excellent detective work. The Academy has recorded your success.</p>
                        </div>
                    )}

                    <div className={styles.scoreCircle}>
                        <span>Match Score</span>
                        <strong>{lastResponse.score}%</strong>
                    </div>
                    <p className={styles.feedbackText}>{lastResponse.feedback}</p>

                    {lastResponse.suspectProbabilities && (
                        <div className={styles.probTable}>
                            <h4>Suspect Probability Analysis</h4>
                            {Object.entries(lastResponse.suspectProbabilities)
                                .sort((a, b) => Number(b[1]) - Number(a[1]))
                                .map(([name, prob]) => {
                                    const p = Math.max(0, Math.min(100, Number(prob)));
                                    return (
                                        <div key={name} className={styles.probRow}>
                                            <span className={styles.probName}>{name}</span>
                                            <div className={styles.probBar}>
                                                <div
                                                    className={`${styles.probFill} ${p >= 70 ? styles.probHigh : ""}`}
                                                    style={{ width: `${p}%` }}
                                                />
                                                <span className={styles.probVal}>{p}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    {lastResponse.reasoningSummary && (
                        <div className={styles.summaryBox}>
                            <h4>Reasoning Summary</h4>
                            <ul>
                                {lastResponse.reasoningSummary.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lastResponse.reasoningTrace && (
                        <div className={styles.trace}>
                            <h4>Gemini 3 Reasoning Trace</h4>
                            <ul>
                                {lastResponse.reasoningTrace.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lastResponse.nextHint && !lastResponse.isCorrect && (
                        <div className={styles.nextHint}>
                            <strong>Next hint:</strong> {lastResponse.nextHint}
                        </div>
                    )}
                </div>
            )}

            <div className={styles.actions}>
                {lastResponse && lastResponse.isCorrect ? (
                    <button onClick={quitCase} className={styles.returnBtn}>
                        🏠 Return to Headquarters
                    </button>
                ) : (
                    <button onClick={quitCase} className={styles.quitBtn}>
                        Return to Headquarters (Give Up)
                    </button>
                )}
            </div>

            <div className={styles.devMode}>
                <button onClick={() => setShowDevMode(!showDevMode)} className={styles.devToggle}>
                    ▶ View Gemini Structured Response (Dev Mode)
                </button>
                {showDevMode && (
                    <pre className={styles.rawJson}>
                        {lastResponse
                            ? JSON.stringify(lastResponse.rawResponse || lastResponse, null, 2)
                            : "// No structured response yet.\n// Submit a hypothesis or ask for guidance to see Gemini 3's output trace."}
                    </pre>
                )}
            </div>
        </div>
    );
}
