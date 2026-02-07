"use client";

import { Case, Scene } from "@/lib/types";
import { useState } from "react";
import styles from "./CaseView.module.css";
import InvestigationPanel from "./InvestigationPanel";
import Image from "next/image";

interface CaseViewProps {
    caseData: Case;
}

export default function CaseView({ caseData }: CaseViewProps) {
    const [activeScene, setActiveScene] = useState<Scene>(caseData.scenes[0]);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [showImagePrompt, setShowImagePrompt] = useState(false);

    // Initial load: Generate image if missing
    // In a real app with persistence, we'd check if it exists on the server.
    // Here we trigger it client-side if the 'generatedImage' field is empty but we want one.

    const handleGenerateScene = async () => {
        setIsGeneratingImage(true);
        try {
            const res = await fetch('/api/generate-scene', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId: caseData.id,
                    location: activeScene.title,
                    description: activeScene.description,
                    clues: activeScene.clues,
                    suspects: caseData.suspects
                })
            });
            const data = await res.json();

            if (data.image_base64) {
                setActiveScene(prev => ({
                    ...prev,
                    generatedImage: data.image_base64,
                    imagePrompt: data.prompt_used
                }));
            }
        } catch (e) {
            console.error("Failed to generate scene", e);
            alert("Gemini could not visualize this scene right now.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.caseHeader}>
                <div className={styles.caseMeta}>
                    <span className={styles.difficulty}>{"★".repeat(caseData.difficulty)} Difficulty</span>
                    <h1 className={styles.title}>{caseData.title}</h1>
                </div>
                <p className={styles.description}>{caseData.description}</p>
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.visualsColumn}>
                    <div className={styles.sceneViewer}>
                        <div className={styles.imageContainer}>
                            {activeScene.generatedImage ? (
                                <img
                                    src={activeScene.generatedImage}
                                    alt="Gemini Generated Scene"
                                    className={styles.sceneImage}
                                />
                            ) : activeScene.svgImage ? (
                                <div
                                    className={styles.sceneSvg}
                                    dangerouslySetInnerHTML={{ __html: activeScene.svgImage }}
                                />
                            ) : (
                                <div className={styles.placeholder}>
                                    <p>Scene Visualization Unavailable</p>
                                </div>
                            )}

                            {/* Gemini Badge Overlay */}
                            <div className={styles.geminiImageBadge}>
                                🧠 Gemini 3 Generated Scene
                                <span className={styles.modelTag}>model: gemini-3-image-latest</span>
                            </div>

                            <div className={styles.sceneOverlay}>
                                <h3>{activeScene.title}</h3>
                            </div>

                            {isGeneratingImage && (
                                <div className={styles.loadingOverlay}>
                                    <div className={styles.spinner}></div>
                                    <p>Gemini is reconstructing the crime scene...</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.sceneControls}>
                            <button
                                onClick={handleGenerateScene}
                                className={styles.regenBtn}
                                disabled={isGeneratingImage}
                            >
                                🔄 {activeScene.generatedImage ? "Re-generate Scene (Gemini)" : "Generate Realistic Scene"}
                            </button>

                            {activeScene.imagePrompt && (
                                <button
                                    onClick={() => setShowImagePrompt(!showImagePrompt)}
                                    className={styles.promptBtn}
                                >
                                    ▶ View Gemini Image Prompt
                                </button>
                            )}
                        </div>

                        {showImagePrompt && activeScene.imagePrompt && (
                            <div className={styles.promptBox}>
                                <strong>Generic Prompt Used:</strong>
                                <pre>{activeScene.imagePrompt}</pre>
                            </div>
                        )}

                        <p className={styles.sceneDescription}>{activeScene.description}</p>
                    </div>

                    <div className={styles.evidenceBoard}>
                        <h2>Known Evidence</h2>
                        <div className={styles.clueList}>
                            {activeScene.clues.map(clue => (
                                <div key={clue.id} className={`${styles.clue} ${clue.isHidden ? styles.hiddenClue : ''}`}>
                                    <span className={styles.clueType}>{clue.type}</span>
                                    <p>{clue.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.investigationColumn}>
                    <div className={styles.suspectsPanel}>
                        <h2>Suspects</h2>
                        {caseData.suspects.map(s => (
                            <div key={s.id} className={styles.suspectCard}>
                                <h3>{s.name}</h3>
                                <p><strong>Profile:</strong> {s.profile}</p>
                                <p><strong>Alibi:</strong> {s.alibi}</p>
                            </div>
                        ))}
                    </div>

                    <InvestigationPanel />
                </div>
            </div>
        </div>
    );
}
