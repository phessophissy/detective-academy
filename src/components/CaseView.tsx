"use client";

import { Case, Scene } from "@/lib/types";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import styles from "./CaseView.module.css";
import InvestigationPanel from "./InvestigationPanel";
import Notebook from "./Notebook";

type Tab = "scene" | "evidence" | "suspects" | "investigate";

interface CaseViewProps {
    caseData: Case;
}

function formatTime(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "scene", label: "Scene", icon: "🖼️" },
    { key: "evidence", label: "Evidence", icon: "🔍" },
    { key: "suspects", label: "Suspects", icon: "👤" },
    { key: "investigate", label: "Investigate", icon: "🧠" },
];

export default function CaseView({ caseData }: CaseViewProps) {
    const { quitCase } = useGame();
    const [activeScene, setActiveScene] = useState<Scene>(caseData.scenes[0]);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [showImagePrompt, setShowImagePrompt] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("scene");
    const [showNotebook, setShowNotebook] = useState(false);
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const [seconds, setSeconds] = useState(0);

    // Case clock — counts up while the case is open
    useEffect(() => {
        const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => window.clearInterval(id);
    }, []);

    const toggleFlag = (id: string) => {
        setFlagged((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleGenerateScene = async () => {
        setIsGeneratingImage(true);
        setGenerationError(null);
        try {
            const res = await fetch("/api/generate-scene", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: activeScene.title,
                    description: activeScene.description,
                    clues: activeScene.clues,
                    suspects: caseData.suspects,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `API error: ${res.status}`);
            if (data.image_base64) {
                setActiveScene((prev) => ({
                    ...prev,
                    generatedImage: data.image_base64,
                    imagePrompt: data.prompt_used,
                }));
            } else {
                throw new Error("No image data returned from Gemini");
            }
        } catch (e: any) {
            console.error("Failed to generate scene", e);
            setGenerationError(e.message || "Gemini could not visualize this scene right now.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const tabHidden = (t: Tab) => (activeTab !== t ? styles.tabHidden : "");

    return (
        <div className={styles.container}>
            <div className={styles.caseHeader}>
                <div className={styles.caseHeaderTop}>
                    <div className={styles.caseMeta}>
                        <span className={styles.difficulty}>
                            {"★".repeat(caseData.difficulty)}{"☆".repeat(Math.max(0, 5 - caseData.difficulty))}
                        </span>
                        <h1 className={styles.title}>{caseData.title}</h1>
                    </div>
                    <div className={styles.headerActions}>
                        <span className={styles.timer} title="Time on case">⏱️ {formatTime(seconds)}</span>
                        <button
                            className={styles.iconBtn}
                            onClick={() => setShowNotebook(true)}
                            aria-label="Open notebook"
                            title="Investigation notebook"
                        >
                            📓
                        </button>
                        <button className={styles.quitBtn} onClick={quitCase}>
                            Give Up
                        </button>
                    </div>
                </div>
                <p className={styles.description}>{caseData.description}</p>
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.visualsColumn}>
                    <div className={`${styles.sceneViewer} ${tabHidden("scene")}`}>
                        <div className={styles.imageContainer}>
                            {activeScene.generatedImage ? (
                                <img
                                    src={activeScene.generatedImage}
                                    alt={`Crime scene: ${activeScene.title} — generated by Gemini 3`}
                                    className={styles.sceneImage}
                                />
                            ) : (
                                <div className={styles.placeholder}>
                                    <div className={styles.placeholderIcon}>🖼️</div>
                                    <p>No visual reconstruction yet.</p>
                                    <p className={styles.placeholderSub}>
                                        Tap below to let Gemini 3 render this crime scene.
                                    </p>
                                    {generationError && (
                                        <p className={styles.errorText}>{generationError}</p>
                                    )}
                                </div>
                            )}

                            {activeScene.generatedImage && (
                                <div className={styles.geminiImageBadge}>
                                    🧠 Gemini 3
                                    <span className={styles.modelTag}>gemini-3-image</span>
                                </div>
                            )}

                            <div className={styles.sceneOverlay}>
                                <h3>{activeScene.title}</h3>
                            </div>

                            {isGeneratingImage && (
                                <div className={styles.loadingOverlay}>
                                    <div className={styles.spinner} />
                                    <p>Reconstructing the crime scene…</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.sceneControls}>
                            <button
                                onClick={handleGenerateScene}
                                className={styles.regenBtn}
                                disabled={isGeneratingImage}
                            >
                                {isGeneratingImage
                                    ? "Rendering…"
                                    : `🔄 ${activeScene.generatedImage ? "Re-render Scene" : "Generate Realistic Scene"}`}
                            </button>
                            {activeScene.imagePrompt && (
                                <button
                                    onClick={() => setShowImagePrompt(!showImagePrompt)}
                                    className={styles.promptBtn}
                                >
                                    ▶ Prompt
                                </button>
                            )}
                        </div>

                        {showImagePrompt && activeScene.imagePrompt && (
                            <div className={styles.promptBox}>
                                <strong>Image prompt:</strong>
                                <pre>{activeScene.imagePrompt}</pre>
                            </div>
                        )}

                        <p className={styles.sceneDescription}>{activeScene.description}</p>
                    </div>

                    <div className={`${styles.evidenceBoard} ${tabHidden("evidence")}`}>
                        <h2>Known Evidence</h2>
                        <div className={styles.clueList}>
                            {activeScene.clues.map((clue) => (
                                <div
                                    key={clue.id}
                                    className={`${styles.clue} ${clue.isHidden ? styles.hiddenClue : ""}`}
                                >
                                    <span className={styles.clueType}>{clue.type}</span>
                                    <p>{clue.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.investigationColumn}>
                    <div className={`${styles.suspectsPanel} ${tabHidden("suspects")}`}>
                        <h2>Suspects</h2>
                        <p className={styles.suspectsHint}>Tap a suspect to flag them as a person of interest.</p>
                        {caseData.suspects.map((s) => {
                            const isFlagged = flagged.has(s.id);
                            return (
                                <button
                                    key={s.id}
                                    className={`${styles.suspectCard} ${isFlagged ? styles.suspectFlagged : ""}`}
                                    onClick={() => toggleFlag(s.id)}
                                    aria-pressed={isFlagged}
                                >
                                    <div className={styles.suspectHead}>
                                        <h3>{s.name}</h3>
                                        <span className={styles.flagBadge}>
                                            {isFlagged ? "🚩 Flagged" : "Flag"}
                                        </span>
                                    </div>
                                    <p><strong>Profile:</strong> {s.profile}</p>
                                    <p><strong>Alibi:</strong> {s.alibi}</p>
                                </button>
                            );
                        })}
                    </div>

                    <div className={`${styles.investigateWrap} ${tabHidden("investigate")}`}>
                        <InvestigationPanel onSolved={() => setActiveTab("investigate")} />
                    </div>
                </div>
            </div>

            <nav className={styles.bottomNav} aria-label="Case sections">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        className={`${styles.navBtn} ${activeTab === t.key ? styles.navBtnActive : ""}`}
                        onClick={() => setActiveTab(t.key)}
                        aria-pressed={activeTab === t.key}
                    >
                        <span className={styles.navIcon}>{t.icon}</span>
                        <span className={styles.navLabel}>{t.label}</span>
                    </button>
                ))}
            </nav>

            <Notebook
                open={showNotebook}
                onClose={() => setShowNotebook(false)}
                caseId={caseData.id}
                caseTitle={caseData.title}
            />
        </div>
    );
}
