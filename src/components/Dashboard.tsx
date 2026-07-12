"use client";

import Image from "next/image";
import { useState } from "react";
import { useGame } from "@/context/GameContext";
import styles from "./Dashboard.module.css";

function rankProgress(completed: number) {
    if (completed >= 12) return { pct: 100, toNext: 0, next: null as string | null };
    if (completed >= 5) return { pct: ((completed - 5) / (12 - 5)) * 100, toNext: 12 - completed, next: "Senior Detective" };
    return { pct: (completed / 5) * 100, toNext: 5 - completed, next: "Investigator" };
}

export default function Dashboard() {
    const { playerState, startNewCase, isLoading } = useGame();
    const [showGuide, setShowGuide] = useState(false);
    const prog = rankProgress(playerState.completedCases);

    return (
        <div className={styles.dashboard}>
            <div className={styles.logoContainer}>
                <Image
                    src="/logo.svg"
                    alt="Detective Academy"
                    width={350}
                    height={105}
                    priority
                    className={styles.logo}
                />
            </div>

            <header className={styles.header}>
                <div className={styles.badge}>
                    <span className={styles.badgeLabel}>Current Rank</span>
                    <span className={styles.badgeValue}>{playerState.rank}</span>
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{playerState.accuracyScore}%</span>
                        <span className={styles.statLabel}>Accuracy</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{playerState.completedCases}</span>
                        <span className={styles.statLabel}>Cases Solved</span>
                    </div>
                </div>
            </header>

            {prog.next ? (
                <div className={styles.progress}>
                    <div className={styles.progressMeta}>
                        <span>Progress to <strong>{prog.next}</strong></span>
                        <span>{prog.toNext} case{prog.toNext === 1 ? "" : "s"} to go</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${prog.pct}%` }} />
                    </div>
                </div>
            ) : (
                <div className={styles.maxRank}>🏆 Top rank achieved — Senior Detective</div>
            )}

            <main className={styles.main}>
                <p className={styles.kicker}>Case File · Procedurally Generated</p>
                <h1 className={styles.title}>Welcome, Detective.</h1>
                <p className={styles.subtitle}>
                    The Academy AI is ready to generate your next simulation scenario. Every case is
                    unique — built live by Gemini 3 from the ground up.
                </p>

                <button
                    className={styles.startButton}
                    onClick={startNewCase}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className={styles.btnSpinner} /> Generating Scenario…
                        </>
                    ) : (
                        <>🔍 Initialize New Case</>
                    )}
                </button>

                <button className={styles.guideToggle} onClick={() => setShowGuide(s => !s)}>
                    {showGuide ? "Hide field manual ▲" : "How to play ▼"}
                </button>

                {showGuide && (
                    <div className={`${styles.guide} anim-fadeIn`}>
                        <ol>
                            <li><strong>Investigate</strong> — read the scene, study the evidence board and suspect alibis.</li>
                            <li><strong>Use your tools</strong> — generate a crime-scene image, upload extra evidence, or ask Gemini for a hint.</li>
                            <li><strong>Deduce</strong> — write a detailed hypothesis linking a suspect to the clues.</li>
                            <li><strong>Submit</strong> — the engine scores your logic and updates the suspect probability table.</li>
                        </ol>
                    </div>
                )}

                {playerState.history.length > 0 && (
                    <div className={styles.history}>
                        <h2>Case History</h2>
                        <ul className={styles.historyList}>
                            {playerState.history.slice().reverse().map((record, i) => (
                                <li key={i} className={styles.historyItem}>
                                    <span className={styles.historyCase}>{record.caseId}</span>
                                    <span className={styles.historyScore}>Score {record.score}</span>
                                    <span className={styles.historyDate}>{new Date(record.date).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
