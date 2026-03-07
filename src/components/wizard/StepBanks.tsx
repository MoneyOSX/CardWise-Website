import { useState, useMemo } from 'react';
import { useUserStore } from '../../store/userStore';
import { MAJOR_BANKS } from '../../constants';
import { createToggleHandler } from '../../utils/helpers';
import { getCardsForBanks } from '../../data/cards';
import type { CardType, CreditCard } from '../../types';

const CARD_TYPE_OPTIONS: { label: string; value: CardType }[] = [
    { label: 'Cashback', value: 'cashback' },
    { label: 'Rewards', value: 'rewards' },
    { label: 'Travel', value: 'travel' },
    { label: 'Fuel', value: 'fuel' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Lifestyle', value: 'lifestyle' },
];

export default function StepBanks({ onNext }: { onNext: () => void }) {
    const {
        profile,
        addBankAccount,
        removeBankAccount,
        toggleExistingCard,
        toggleExistingCardType,
    } = useUserStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [showTypeFallback, setShowTypeFallback] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleBank = createToggleHandler(profile.bankAccounts, addBankAccount, removeBankAccount);

    const { prioritized, others } = useMemo(
        () => getCardsForBanks(profile.bankAccounts),
        [profile.bankAccounts]
    );

    // Quick picks: prioritized cards not already selected, max 6
    const quickPicks = useMemo(
        () => prioritized.filter(c => !profile.existingCardIds.includes(c.id)).slice(0, 6),
        [prioritized, profile.existingCardIds]
    );

    // Search results: filter by query across all cards, prioritized first
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        const match = (card: CreditCard) =>
            card.name.toLowerCase().includes(q) ||
            card.issuer.toLowerCase().includes(q);

        const fromBanks = prioritized.filter(match);
        const fromOthers = others.filter(match);
        return [...fromBanks, ...fromOthers]
            .filter(c => !profile.existingCardIds.includes(c.id))
            .slice(0, 8);
    }, [searchQuery, prioritized, others, profile.existingCardIds]);

    // Resolve selected card IDs to card objects for display
    const selectedCards = useMemo(
        () => [...prioritized, ...others].filter(c => profile.existingCardIds.includes(c.id)),
        [prioritized, others, profile.existingCardIds]
    );

    const showDropdown = isSearchFocused && searchQuery.trim().length > 0 && searchResults.length > 0;

    return (
        <div className="main-panel">
            <div className="step-eyebrow">Step 6 of 6</div>
            <h2>Which banks are you with?</h2>
            <p>Existing bank relationships improve your approval chances significantly.</p>
            <div className="bank-grid">
                {MAJOR_BANKS.map(b => (
                    <div
                        key={b}
                        className={`bank-btn ${profile.bankAccounts.includes(b) ? 'selected' : ''}`}
                        onClick={() => handleBank(b)}
                    >
                        {b}
                    </div>
                ))}
            </div>

            {profile.bankAccounts.length > 0 && (
                <div className="existing-cards-section">
                    <label className="form-label">Do you have any existing credit cards?</label>
                    <p className="existing-cards-subtitle">
                        Helps us avoid duplicates and find complementary cards
                    </p>

                    {/* Selected cards as removable tags */}
                    {(selectedCards.length > 0 || profile.existingCardTypes.length > 0) && (
                        <div className="selected-cards-tags">
                            {selectedCards.map(card => (
                                <span
                                    key={card.id}
                                    className="card-tag"
                                    onClick={() => toggleExistingCard(card.id)}
                                >
                                    {card.issuer} {card.name} ×
                                </span>
                            ))}
                            {profile.existingCardTypes.map(type => (
                                <span
                                    key={`type-${type}`}
                                    className="card-tag card-tag-type"
                                    onClick={() => toggleExistingCardType(type)}
                                >
                                    Other — {type} ×
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Search combobox */}
                    <div className="card-search-wrapper">
                        <input
                            type="text"
                            className="card-search-input"
                            placeholder="Search for a card (e.g. Millennia, Amazon Pay)..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        />
                        {showDropdown && (
                            <div className="card-search-dropdown">
                                {searchResults.map(card => (
                                    <div
                                        key={card.id}
                                        className="card-search-option"
                                        onMouseDown={() => {
                                            toggleExistingCard(card.id);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <span className="card-search-name">{card.name}</span>
                                        <span className="card-search-issuer">{card.issuer}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick-pick chips */}
                    {quickPicks.length > 0 && (
                        <div className="quick-picks">
                            {quickPicks.map(card => (
                                <div
                                    key={card.id}
                                    className="chip"
                                    onClick={() => toggleExistingCard(card.id)}
                                >
                                    {card.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Type fallback */}
                    {!showTypeFallback ? (
                        <div
                            className="type-fallback-link"
                            onClick={() => setShowTypeFallback(true)}
                        >
                            Don't see your card?
                        </div>
                    ) : (
                        <div className="type-fallback-section">
                            <div className="type-fallback-label">What type of card is it?</div>
                            <div className="chip-row">
                                {CARD_TYPE_OPTIONS.map(opt => (
                                    <div
                                        key={opt.value}
                                        className={`chip ${profile.existingCardTypes.includes(opt.value) ? 'selected' : ''}`}
                                        onClick={() => toggleExistingCardType(opt.value)}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button className="cta-btn" onClick={onNext}>Get Recommendations ✦</button>
            <div className="skip-link" onClick={onNext}>Skip this step</div>
        </div>
    );
}
