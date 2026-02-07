export default function Footer() {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '2rem',
            borderTop: '1px solid var(--fg-muted)',
            marginTop: 'auto',
            color: 'var(--fg-muted)',
            fontSize: '0.8rem'
        }}>
            <p>Built for <strong>Gemini 3 Hackathon</strong> 🧠</p>
            <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Powered by Google Gemini 3 Flash Preview</p>
        </footer>
    );
}
