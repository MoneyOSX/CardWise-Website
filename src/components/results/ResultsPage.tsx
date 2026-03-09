import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUserStore } from '../../store/userStore';
import { cards } from '../../data/cards';
import { rankCards } from '../../services/RecommendationService';
import ResultsSidebar from './ResultsSidebar';
import FilterChips from './FilterChips';
import ResultCard from './ResultCard';
import CompareBar from './CompareBar';
import CompareModal from './CompareModal';
import { trackResultsView, trackFilterClick, trackCompareToggle, trackCompareView } from '../../services/analytics';

export default function ResultsPage() {
    const { profile } = useUserStore();
    const [activeFilter, setActiveFilter] = useState('All Cards');
    const [sortBy, setSortBy] = useState<'match' | 'benefit' | 'approval'>('match');
    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const result = useMemo(() => {
        return rankCards(profile, cards);
    }, [profile]);

    const rankedCards = result.cards;
    const { incomeBucket, limitedResults, note } = result;

    useEffect(() => {
        if (rankedCards.length > 0) {
            trackResultsView(rankedCards.length, rankedCards[0].name);
        }
    }, [rankedCards]);

    const filteredCards = useMemo(() => {
        if (activeFilter === 'All Cards') return rankedCards;
        if (activeFilter === 'Lifetime Free') return rankedCards.filter(c => c.annualFee === 0);
        if (activeFilter === 'Best Cashback') return rankedCards.filter(c => c.type === 'cashback');
        if (activeFilter === 'Travel') return rankedCards.filter(c => c.type === 'travel');
        if (activeFilter === 'Shopping') return rankedCards.filter(c => c.type === 'shopping');
        return rankedCards;
    }, [rankedCards, activeFilter]);

    const sortedCards = useMemo(() => {
        const sorted = [...filteredCards];
        if (sortBy === 'benefit') {
            sorted.sort((a, b) => b.netAnnualBenefit - a.netAnnualBenefit);
        } else if (sortBy === 'approval') {
            const order: Record<string, number> = { High: 3, Moderate: 2, Low: 1 };
            sorted.sort((a, b) => (order[b.approvalProbability] || 0) - (order[a.approvalProbability] || 0));
        }
        return sorted;
    }, [filteredCards, sortBy]);

    const topCards = sortedCards.slice(0, 5);

    const toggleCompare = useCallback((id: string) => {
        setCompareIds(prev => {
            const isSelected = prev.includes(id);
            const card = rankedCards.find(c => c.id === id);
            if (card) trackCompareToggle(card.name, !isSelected);
            if (isSelected) return prev.filter(x => x !== id);
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    }, [rankedCards]);

    const selectedCards = useMemo(() => {
        return compareIds.map(id => rankedCards.find(c => c.id === id)).filter(Boolean) as typeof rankedCards;
    }, [compareIds, rankedCards]);

    const openCompare = () => {
        trackCompareView(selectedCards.map(c => c.name));
        setShowCompareModal(true);
    };

    return (
        <div id="screen-results" style={{ display: 'block' }}>
            <div className="results-hero">
                <span className="results-emoji">🎉</span>
                <div className="results-h2">Your Matches</div>
                <div className="results-sub">
                    Personalized for {profile.occupation} · ₹{(profile.monthlyIncome / 1000).toFixed(0)}K income
                </div>
            </div>

            <div className="results-layout" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
                <ResultsSidebar matchedCount={filteredCards.length} topCard={topCards[0]} />

                <div>
                    <div className="results-toolbar">
                        <FilterChips activeFilter={activeFilter} onFilterChange={(f) => { trackFilterClick(f); setActiveFilter(f); }} />
                        <select
                            className="sort-dropdown"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'match' | 'benefit' | 'approval')}
                        >
                            <option value="match">Sort: Match Score</option>
                            <option value="benefit">Sort: Annual Benefit</option>
                            <option value="approval">Sort: Approval Chance</option>
                        </select>
                    </div>

                    {(limitedResults || incomeBucket === 'secured_only' || note) && (
                        <div style={{
                            padding: '16px 20px',
                            background: '#f0f7ff',
                            border: '1px solid #cce3ff',
                            borderRadius: 12,
                            marginBottom: 24,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            color: '#004a99',
                            fontSize: '0.95rem'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                            <span>{note || (limitedResults ? "Showing top entry-level cards for your profile." : "")}</span>
                        </div>
                    )}

                    {topCards.map((card, idx) => (
                        <ResultCard
                            key={card.id}
                            card={card}
                            rank={idx + 1}
                            isSelected={compareIds.includes(card.id)}
                            onToggleCompare={() => toggleCompare(card.id)}
                            compareCount={compareIds.length}
                        />
                    ))}

                    {topCards.length === 0 && (
                        <div style={{ padding: '40px', background: 'white', border: '1px solid var(--border)', borderRadius: 16, textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 16 }}>🔍</div>
                            <h3 style={{ marginBottom: 8 }}>No matches for this filter</h3>
                            <p style={{ color: 'var(--text-light)' }}>Try selecting "All Cards" or adjusting your preferences.</p>
                        </div>
                    )}

                    <div className="results-meta">
                        <span>Last updated: March 2026</span>
                        <span className="results-meta-dot"></span>
                        <span>Based on 30+ cards from HDFC, SBI, ICICI & more</span>
                    </div>
                </div>
            </div>

            {compareIds.length >= 2 && (
                <CompareBar
                    selectedCards={selectedCards}
                    onCompare={openCompare}
                    onClear={() => setCompareIds([])}
                />
            )}

            {showCompareModal && (
                <CompareModal
                    cards={selectedCards}
                    onClose={() => setShowCompareModal(false)}
                />
            )}
        </div>
    );
}
