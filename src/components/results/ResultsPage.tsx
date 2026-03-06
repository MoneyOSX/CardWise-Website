import { useState, useMemo, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { cards } from '../../data/cards';
import { rankCards } from '../../services/RecommendationService';
import ResultsSidebar from './ResultsSidebar';
import FilterChips from './FilterChips';
import ResultCard from './ResultCard';
import { trackResultsView, trackFilterClick } from '../../services/analytics';

export default function ResultsPage() {
    const { profile } = useUserStore();
    const [activeFilter, setActiveFilter] = useState('All Cards');

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

    const topCards = filteredCards.slice(0, 5);

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
                    <FilterChips activeFilter={activeFilter} onFilterChange={(f) => { trackFilterClick(f); setActiveFilter(f); }} />

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
                        <ResultCard key={card.id} card={card} rank={idx + 1} />
                    ))}

                    {topCards.length === 0 && (
                        <div style={{ padding: '40px', background: 'white', border: '1px solid var(--border)', borderRadius: 16, textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 16 }}>🔍</div>
                            <h3 style={{ marginBottom: 8 }}>No matches for this filter</h3>
                            <p style={{ color: 'var(--text-light)' }}>Try selecting "All Cards" or adjusting your preferences.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
