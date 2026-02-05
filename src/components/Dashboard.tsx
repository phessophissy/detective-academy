"use client";

import { useGame } from "@/context/GameContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const { playerState, startNewCase, isLoading } = useGame();

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <span className={styles.badgeLabel}>Rank</span>
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

            <main className={styles.main}>
                <h1 className={styles.title}>Welcome, Detective.</h1>
                <p className={styles.subtitle}>
                    The Academy AI is ready to generate your next simulation scenario.
                </p>

                <button
                    className={styles.startButton}
                    onClick={startNewCase}
                    disabled={isLoading}
                >
                    {isLoading ? "Generating Scenario..." : "Initialize New Case"}
                </button>

                {playerState.history.length > 0 && (
                    <div className={styles.history}>
                        <h2>Case History</h2>
                        <ul className={styles.historyList}>
                            {playerState.history.map((record, i) => (
                                <li key={i} className={styles.historyItem}>
                                    <span>{record.caseId}</span>
                                    <span>Score: {record.score}</span>
                                    <span>{new Date(record.date).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
