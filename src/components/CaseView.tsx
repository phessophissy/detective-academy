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
                            {activeScene.svgImage ? (
                                <div
                                    className={styles.sceneSvg}
                                    dangerouslySetInnerHTML={{ __html: activeScene.svgImage }}
                                />
                            ) : (
                                <Image
                                    src={activeScene.imageUrl}
                                    alt={activeScene.title}
                                    width={800}
                                    height={600}
                                    className={styles.sceneImage}
                                />
                            )}
                            <div className={styles.sceneOverlay}>
                                <h3>{activeScene.title}</h3>
                            </div>
                        </div>
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
