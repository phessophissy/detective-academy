"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import styles from "./Toast.module.css";

export type ToastType = "success" | "error" | "info" | "hint";

export interface ToastInput {
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

interface ToastItem extends ToastInput {
    id: number;
}

interface ToastContextValue {
    push: (t: ToastInput) => void;
    dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let counter = 0;

const ICONS: Record<ToastType, string> = {
    success: "✅",
    error: "⚠️",
    info: "🔍",
    hint: "🧠",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((t: ToastInput) => {
        const id = ++counter;
        const duration = t.duration ?? 4500;
        setToasts((prev) => [...prev.slice(-3), { ...t, id, duration }]);
        if (duration > 0) {
            window.setTimeout(() => dismiss(id), duration);
        }
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ push, dismiss }}>
            {children}
            <div
                className={styles.toaster}
                role="region"
                aria-live="polite"
                aria-label="Notifications"
            >
                {toasts.map((t) => (
                    <ToastView key={t.id} toast={t} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
    const typeClass =
        toast.type === "success"
            ? styles.success
            : toast.type === "error"
                ? styles.error
                : toast.type === "hint"
                    ? styles.hint
                    : styles.info;

    return (
        <div
            className={`${styles.toast} ${typeClass}`}
            onClick={() => onDismiss(toast.id)}
            role="alert"
        >
            <span className={styles.icon}>{ICONS[toast.type]}</span>
            <div className={styles.body}>
                {toast.title && <strong className={styles.title}>{toast.title}</strong>}
                <span className={styles.message}>{toast.message}</span>
            </div>
            <button
                className={styles.closeBtn}
                onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(toast.id);
                }}
                aria-label="Dismiss notification"
            >
                ✕
            </button>
        </div>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
