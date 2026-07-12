"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import styles from "./Notebook.module.css";

interface NotebookProps {
    open: boolean;
    onClose: () => void;
    caseId: string;
    caseTitle: string;
}

const PLACEHOLDER =
    "Suspects:\n - \n\nTimeline:\n - \n\nKey clues:\n - \n\nMy theory:\n ";

export default function Notebook({ open, onClose, caseId, caseTitle }: NotebookProps) {
    const [notes, setNotes] = useState("");
    const textRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem(`detective-academy-notes-${caseId}`);
        setNotes(saved ?? "");
    }, [caseId]);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => textRef.current?.focus(), 140);
        return () => clearTimeout(t);
    }, [open]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const v = e.target.value;
        setNotes(v);
        localStorage.setItem(`detective-academy-notes-${caseId}`, v);
    };

    const handleClear = () => {
        setNotes("");
        localStorage.removeItem(`detective-academy-notes-${caseId}`);
        textRef.current?.focus();
    };

    if (!open) return null;

    const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;

    return (
        <>
            <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
            <aside
                className={`${styles.drawer} anim-fadeIn`}
                role="dialog"
                aria-modal="true"
                aria-label="Investigation notebook"
            >
                <div className={styles.header}>
                    <div className={styles.heading}>
                        <h3 className={styles.title}>📓 Investigation Notebook</h3>
                        <p className={styles.subtitle}>{caseTitle}</p>
                    </div>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Close notebook"
                    >
                        ✕
                    </button>
                </div>

                <p className={styles.hint}>
                    Jot down clues, timelines and suspicions. Saved automatically on this device.
                </p>

                <textarea
                    ref={textRef}
                    className={styles.textarea}
                    value={notes}
                    onChange={handleChange}
                    placeholder={PLACEHOLDER}
                    spellCheck
                />

                <div className={styles.footer}>
                    <span className={styles.counter}>{words} words</span>
                    <button className={styles.clearBtn} onClick={handleClear}>
                        Clear notes
                    </button>
                </div>
            </aside>
        </>
    );
}
