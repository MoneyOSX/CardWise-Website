import { useUserStore } from '../../store/userStore';

export default function SidePanel({ step }: { step: number }) {
    const { profile } = useUserStore();

    const renderTip = () => {
        switch (step) {
            case 1: return { icon: '💡', text: 'Banks have different minimum income and employment requirements. Salaried employees often get access to more cards.' };
            case 2: return { icon: '📊', text: 'At ₹50K+ income, you qualify for mid-tier cards. At ₹1L+, premium travel cards open up.' };
            case 3: return { icon: '📈', text: 'Check score free on OneScore or CIBIL. A score above 750 significantly improves approval chances.' };
            case 4: return { icon: '💡', text: "Don't overthink exact amounts. Choose the range that's closest." };
            case 5: return { icon: '🎯', text: 'After preferences, we just need to know your bank relationships to improve approval accuracy.' };
            case 6: return { icon: '⚡', text: 'Select all banks you have accounts with. Multi-bank relationships unlock more cards.' };
            default: return null;
        }
    };

    const tip = renderTip();

    return (
        <div className="side-panel">
            {step === 1 ? (
                <div className="side-card">
                    <div className="side-card-title">Your Progress</div>
                    <div className="progress-tracker">
                        {[1, 2, 3, 4, 5, 6].map(s => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={`pt-step ${step >= s ? 'active' : ''}`}>{s}</div>
                                {s < 6 && <div className={`pt-connector ${step > s ? 'active' : ''}`} style={{ background: step > s ? 'var(--blue)' : 'var(--border)' }}></div>}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="profile-preview-dark">
                    <div className="ppd-shimmer"></div>
                    <div style={{ position: 'relative' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Your Profile So Far
                        </div>
                        <div className="ppd-grid">
                            <div><div className="ppd-label">Employment</div><div className="ppd-value">{profile.occupation || '-'}</div></div>
                            {step >= 3 && <div><div className="ppd-label">Income</div><div className="ppd-value teal">₹{(profile.monthlyIncome || 0) / 1000}K</div></div>}
                            {step >= 4 && <div><div className="ppd-label">CIBIL Score</div><div className="ppd-value">{profile.creditScore || "Don't Know"}</div></div>}
                            {step >= 5 && <div><div className="ppd-label">Cards Held</div><div className="ppd-value">{profile.existingCardIds.length + profile.existingCardTypes.length}</div></div>}
                        </div>
                    </div>
                </div>
            )}

            {tip && (
                <div className="side-card">
                    <div className="tip-box">
                        <div className="tip-box-icon">{tip.icon}</div>
                        <div className="tip-box-text">{tip.text}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
