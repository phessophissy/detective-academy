export default function Footer() {
    return (
        <footer
            style={{
                textAlign: 'center',
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                borderTop: '1px solid var(--fg-muted)',
                marginTop: 'auto',
                color: 'var(--fg-muted)',
                fontSize: 'clamp(0.72rem, 3vw, 0.82rem)',
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.25))',
            }}
        >
            <p>
                Built for{' '}
                <strong style={{ color: 'var(--accent-gold)' }}>Gemini 3 Hackathon</strong> 🧠
            </p>
            <p style={{ marginTop: '0.35rem', opacity: 0.75 }}>
                Powered by Google Gemini 3 · An AI detective simulator
            </p>
        </footer>
    );
}
