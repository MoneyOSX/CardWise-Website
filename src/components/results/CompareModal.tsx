import { useEffect } from 'react';
import type { RankedCard } from '../../types';

interface CompareModalProps {
    cards: RankedCard[];
    onClose: () => void;
}

function getTopRewardCategory(card: RankedCard): string {
    const cats = card.categories;
    let best = 'other';
    let bestVal = cats.other;
    const entries: [string, number | undefined][] = [
        ['Online', cats.online],
        ['Dining', cats.dining],
        ['Food Delivery', cats.foodDelivery],
        ['Groceries', cats.groceries],
        ['Fuel', cats.fuel],
        ['Utilities', cats.utilities],
        ['Travel', cats.travel],
        ['EMI', cats.emi],
    ];
    for (const [name, val] of entries) {
        if (val !== undefined && val > bestVal) {
            best = name;
            bestVal = val;
        }
    }
    return `${best} ${bestVal}%`;
}

const approvalRank: Record<string, number> = { High: 3, Moderate: 2, Low: 1 };

export default function CompareModal({ cards, onClose }: CompareModalProps) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const scores = cards.map(c => Math.round(c.scoreBreakdown.totalScore));
    const fees = cards.map(c => c.annualFee);
    const savings = cards.map(c => c.netAnnualBenefit);
    const approvals = cards.map(c => approvalRank[c.approvalProbability] ?? 0);
    const lounges = cards.map(c => c.loungeAccess);

    const bestScore = Math.max(...scores);
    const bestFee = Math.min(...fees);
    const bestSavings = Math.max(...savings);
    const bestApproval = Math.max(...approvals);
    const bestLounge = Math.max(...lounges);

    const cols = cards.length;

    return (
        <div className="compare-modal-backdrop" onClick={onClose}>
            <div className="compare-modal" onClick={e => e.stopPropagation()}>
                <div className="compare-modal-header">
                    <h3>Compare Cards</h3>
                    <button className="compare-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="compare-table" style={{ gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}>
                    {/* Card headers */}
                    <div className="compare-label" />
                    {cards.map(card => (
                        <div key={card.id} className="compare-card-header">
                            <div className="compare-card-art" style={{ background: 'linear-gradient(135deg, var(--blue), var(--navy))' }}>
                                <img src={card.image} alt={card.name} onError={e => { e.currentTarget.style.display = 'none'; }} />
                            </div>
                            <div className="compare-card-issuer">{card.issuer}</div>
                            <div className="compare-card-name">{card.name}</div>
                        </div>
                    ))}

                    {/* Match Score */}
                    <div className="compare-label">Match Score</div>
                    {cards.map((card, i) => (
                        <div key={card.id} className={`compare-cell ${scores[i] === bestScore ? 'winner' : ''}`}>
                            {scores[i]}/100
                        </div>
                    ))}

                    {/* Annual Fee */}
                    <div className="compare-label">Annual Fee</div>
                    {cards.map((card, i) => (
                        <div key={card.id} className={`compare-cell ${fees[i] === bestFee ? 'winner' : ''}`}>
                            {card.annualFee === 0 ? 'FREE' : `₹${card.annualFee.toLocaleString('en-IN')}`}
                        </div>
                    ))}

                    {/* Net Savings */}
                    <div className="compare-label">Net Savings/yr</div>
                    {cards.map((card, i) => (
                        <div key={card.id} className={`compare-cell ${savings[i] === bestSavings ? 'winner' : ''}`}>
                            ₹{card.netAnnualBenefit.toLocaleString('en-IN')}
                        </div>
                    ))}

                    {/* Approval */}
                    <div className="compare-label">Approval</div>
                    {cards.map((card, i) => (
                        <div key={card.id} className={`compare-cell ${approvals[i] === bestApproval ? 'winner' : ''}`}>
                            {card.approvalProbability}
                        </div>
                    ))}

                    {/* Top Reward Category */}
                    <div className="compare-label">Top Reward</div>
                    {cards.map(card => (
                        <div key={card.id} className="compare-cell">
                            {getTopRewardCategory(card)}
                        </div>
                    ))}

                    {/* Lounge Access */}
                    <div className="compare-label">Lounge Access</div>
                    {cards.map((card, i) => (
                        <div key={card.id} className={`compare-cell ${lounges[i] === bestLounge && bestLounge > 0 ? 'winner' : ''}`}>
                            {card.loungeAccess > 0 ? `${card.loungeAccess}/qtr` : 'None'}
                        </div>
                    ))}

                    {/* Best For */}
                    <div className="compare-label">Best For</div>
                    {cards.map(card => (
                        <div key={card.id} className="compare-cell compare-chips-cell">
                            {card.bestFor.slice(0, 2).map((tag, j) => (
                                <span key={j} className="benefit-chip">{tag}</span>
                            ))}
                        </div>
                    ))}

                    {/* Apply buttons */}
                    <div className="compare-label" />
                    {cards.map(card => (
                        <div key={card.id} className="compare-cell compare-apply-cell">
                            <a href={card.applyUrl} target="_blank" rel="noopener noreferrer" className="apply-btn compare-apply-btn">
                                Apply Now →
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
