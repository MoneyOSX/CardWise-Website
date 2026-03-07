import { useUserStore } from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import type { RankedCard } from '../../types';

export default function ResultsSidebar({ matchedCount, topCard }: { matchedCount: number, topCard?: RankedCard }) {
    const { profile, reset } = useUserStore();
    const navigate = useNavigate();

    const handleRestart = () => {
        reset();
        navigate('/');
    };

    return (
        <div className="results-sidebar">
            <div className="profile-dark-card">
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Your Profile
                </div>
                <div className="pdc-grid">
                    <div><div className="pdc-label">Monthly Income</div><div className="pdc-val blue">₹{(profile.monthlyIncome / 1000).toFixed(0)}K</div></div>
                    <div><div className="pdc-label">CIBIL Score</div><div className="pdc-val">{profile.creditScore || "Don't Know"}</div></div>
                    <div><div className="pdc-label">Cards Held</div><div className="pdc-val">{profile.existingCardIds.length + profile.existingCardTypes.length}</div></div>
                    <div><div className="pdc-label">Banks</div><div className="pdc-val">{profile.bankAccounts.join(', ') || 'None'}</div></div>
                </div>
                <div className="pdc-divider"></div>
                <div className="pdc-savings-row">
                    <div className="pdc-savings-label">Est. Annual Savings</div>
                    <div className="pdc-savings-val">
                        ₹{topCard ? topCard.netAnnualBenefit.toLocaleString('en-IN') : 0}
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    Eligible Cards
                </div>
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '36px', fontWeight: 700, color: 'var(--blue)', marginBottom: '4px' }}>
                    {matchedCount}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                    cards match your profile. Showing top {Math.min(matchedCount, 5)}.
                </div>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                <div className="tip-box">
                    <div className="tip-box-icon">⚡</div>
                    <div className="tip-box-text">
                        <strong>Pro tip:</strong> Cards with "Pre-Approved" or "HIGH Approval" badges mean your profile matches their ideal customer persona perfectly.
                    </div>
                </div>
            </div>

            <button className="restart-btn" onClick={handleRestart}>← Start Over</button>
        </div>
    );
}
