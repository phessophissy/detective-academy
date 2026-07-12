import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p className={styles.line}>
                Built for{' '}
                <strong className={styles.hackathon}>Gemini 3 Hackathon</strong> 🧠
            </p>
            <p className={styles.lineSub}>
                Powered by Google Gemini 3 · An AI detective simulator
            </p>
            <a
                href="https://x.com/phessophissy"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorLink}
                aria-label="Built by Phessophissy — visit X (Twitter) profile"
            >
                <svg className={styles.xIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Built by <span className={styles.authorName}>Phessophissy</span>
            </a>
        </footer>
    );
}

