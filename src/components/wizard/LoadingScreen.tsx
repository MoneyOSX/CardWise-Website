import { useState, useEffect } from 'react';
import { trackLoadingScreenView } from '../../services/analytics';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    const steps = [
        { label: "Checking income eligibility", icon: "check" },
        { label: "Verifying approval chances", icon: "check" },
        { label: "Calculating annual savings...", icon: "zap" },
        { label: "Ranking your top 5 matches", icon: "trophy" }
    ];

    useEffect(() => {
        trackLoadingScreenView();

        const duration = 3200;
        const interval = 50;
        let elapsed = 0;

        const timer = setInterval(() => {
            elapsed += interval;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (elapsed >= duration) {
                clearInterval(timer);
                onComplete();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    const activeStep = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);

    return (
        <div className="loading-screen-dark">
            <div className="loading-card-glow">
                <div className="loading-card-icon">💳</div>
            </div>

            <div className="loading-banks">
                <span className="bank-badge active">HDFC</span>
                <span className="bank-badge active">Axis</span>
                <span className="bank-badge">ICICI</span>
                <span className="bank-badge">Kotak</span>
                <span className="bank-badge">SBI</span>
            </div>

            <h2 className="loading-title">Finding your matches...</h2>
            <p className="loading-subtitle">Checking 50+ cards for your profile</p>

            <div className="loading-progress-wrapper">
                <div className="loading-progress-container">
                    <div className="loading-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="loading-progress-percent">{Math.round(progress)}%</span>
            </div>

            <div className="loading-checklist">
                {steps.map((step, idx) => {
                    const isActive = idx <= activeStep;
                    return (
                        <div key={idx} className={`checklist-item ${isActive ? 'active' : ''}`}>
                            <div className="checklist-icon">
                                {step.icon === 'check' && (
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                                {step.icon === 'zap' && (
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                )}
                                {step.icon === 'trophy' && (
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                        <path d="M4 22h16"></path>
                                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                    </svg>
                                )}
                            </div>
                            <span className="checklist-label">{step.label}</span>
                            {isActive && (
                                <div className="checklist-success-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
