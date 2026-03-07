import { useState } from 'react';
import { trackResultsFeedback } from '../../services/analytics';

export default function FeedbackPrompt() {
    const [status, setStatus] = useState<'idle' | 'up' | 'down'>('idle');

    const handleClick = (thumbs: 'up' | 'down') => {
        trackResultsFeedback(thumbs);
        setStatus(thumbs);
    };

    if (status !== 'idle') {
        return (
            <div style={{
                padding: '32px 40px',
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 16,
                textAlign: 'center',
                marginTop: 24,
            }}>
                <span style={{ fontSize: '1.3rem', color: 'var(--green)', fontWeight: 600 }}>
                    Thanks for your feedback!
                </span>
            </div>
        );
    }

    return (
        <div style={{
            padding: '32px 40px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 16,
            textAlign: 'center',
            marginTop: 24,
        }}>
            <div style={{ color: 'var(--text-2)', fontSize: '1rem', marginBottom: 16 }}>
                Did you find a card you'd apply for?
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <button
                    onClick={() => handleClick('up')}
                    style={{
                        fontSize: '1.5rem',
                        padding: '8px 24px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    👍
                </button>
                <button
                    onClick={() => handleClick('down')}
                    style={{
                        fontSize: '1.5rem',
                        padding: '8px 24px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    👎
                </button>
            </div>
        </div>
    );
}
