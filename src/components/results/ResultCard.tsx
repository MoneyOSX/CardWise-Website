import type { RankedCard } from '../../types';
import { trackResultCardClick } from '../../services/analytics';

export default function ResultCard({ card, rank }: { card: RankedCard, rank: number }) {
    const getGradient = () => {
        return 'linear-gradient(135deg, var(--blue), var(--navy))';
    };

    return (
        <div className={`result-card ${rank === 1 ? 'top' : ''}`} onClick={() => trackResultCardClick(card.name, rank)}>
            <div className="rc-top-row">
                <div className="rc-left-info">
                    <div className={`rc-rank rank-${Math.min(rank, 3)}`}>#{rank}</div>
                    <div className="rc-card-art" style={{ background: getGradient() }}>
                        <img src={card.image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div>
                        <div className="rc-bank-name">{card.issuer}</div>
                        <div className="rc-card-name">{card.name}</div>
                    </div>
                </div>
                <div className="rc-badges">
                    {card.approvalProbability === 'High' && <span className="rbadge rbadge-green">HIGH Approval</span>}
                    {card.approvalProbability === 'Moderate' && <span className="rbadge rbadge-amber">Good Chances</span>}
                    {card.annualFee === 0 && <span className="rbadge rbadge-blue">LIFETIME FREE</span>}
                </div>
            </div>

            <div className="rc-metrics">
                <div>
                    <div className="rc-metric-label">Match Score</div>
                    <div className="rc-metric-val blue">{Math.round(card.scoreBreakdown.totalScore)}/100</div>
                </div>
                <div>
                    <div className="rc-metric-label">Annual Benefit</div>
                    <div className="rc-metric-val green">₹{(card.netAnnualBenefit + card.annualFee).toLocaleString('en-IN')}</div>
                </div>
                <div>
                    <div className="rc-metric-label">Annual Fee</div>
                    <div className="rc-metric-val">{card.annualFee === 0 ? 'FREE' : `₹${card.annualFee.toLocaleString('en-IN')}`}</div>
                </div>
                <div>
                    <div className="rc-metric-label">Net Savings</div>
                    <div className="rc-metric-val green">₹{card.netAnnualBenefit.toLocaleString('en-IN')}</div>
                </div>
            </div>

            <div className="rc-why-title">Why this card?</div>
            <div className="rc-why-list">
                {card.reasoning.map((reason, i) => (
                    <div className="rc-why-item" key={i}>
                        <div className="why-check">✓</div>
                        {reason}
                    </div>
                ))}
            </div>

            <div className="rc-footer-row">
                <div className="rc-benefit-chips">
                    {card.bestFor[0] && <span className="benefit-chip">{card.bestFor[0]}</span>}
                    {card.bestFor[1] && <span className="benefit-chip">{card.bestFor[1]}</span>}
                </div>
                <a href={card.applyUrl} target="_blank" rel="noopener noreferrer" className="apply-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                    Apply Now →
                </a>
            </div>
        </div>
    );
}
