import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [msgIdx, setMsgIdx] = useState(0);
    const messages = [
        "Checking offers from HDFC, ICICI, Axis, Kotak...",
        "Analyzing your profile...",
        "Checking bank eligibility...",
        "Calculating reward permutations...",
        "Finding your best matches..."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setMsgIdx(prev => (prev + 1) % messages.length);
        }, 800);

        const finish = setTimeout(() => {
            onComplete();
        }, 3200);

        return () => {
            clearInterval(timer);
            clearTimeout(finish);
        };
    }, [onComplete, messages.length]);

    return (
        <div id="screen-loading" className="active" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
            {/* Header / Navbar */}
            <div className="app-header" style={{ position: 'relative', width: '100%' }}>
                <Link className="logo" to="/">
                    <div className="logo-mark" style={{ width: '32px', height: '32px', borderRadius: '8px', fontSize: '15px' }}>✦</div>
                    <div className="logo-text">Card<span>Wise</span></div>
                </Link>

                <div className="nav-cta" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: 'auto' }}>
                    <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '14px', border: '1px solid var(--border)', borderRadius: '10px' }} onClick={() => window.scrollTo({ top: 0 })}>Sign In</button>
                    <Link to="/app" className="btn-primary" style={{ padding: '10px 18px', fontSize: '14px', borderRadius: '10px' }}>Find My Card →</Link>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-80px' }}>
                <div className="loading-icon" style={{ borderRadius: '50%', boxShadow: '0 4px 20px rgba(47,111,237,0.3)', width: '90px', height: '90px', background: 'var(--blue)', fontSize: '36px' }}>💳</div>
                <div className="loading-spinner" style={{ width: '48px', height: '48px', border: '3px solid rgba(47,111,237,0.1)', borderTopColor: 'var(--blue)' }}></div>
                <div className="loading-text" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Ranking your top matches...</div>
                <div className="loading-sub">{messages[msgIdx]}</div>
            </div>
        </div>
    );
}
