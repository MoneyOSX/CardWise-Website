# Existing Card Selection Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move credit card selection from StepCredit to StepBanks with a search-first UI, add support for unknown cards via type fallback, and simplify StepCredit to a single question.

**Architecture:** Data model gets `existingCardTypes: CardType[]` alongside existing `existingCardIds: string[]`. StepBanks gains a card selection section with search combobox, quick-pick chips, and type fallback. RecommendationService merges both sources for complementary scoring.

**Tech Stack:** React 19, TypeScript, Zustand, Vite

---

### Task 1: Update types — add `existingCardTypes`, remove `existingCardsCount`

**Files:**
- Modify: `src/types/index.ts:102-103`

**Step 1: Edit UserProfile interface**

In `src/types/index.ts`, replace line 102:
```typescript
    existingCardsCount: number;
```
with:
```typescript
    existingCardTypes: CardType[];
```

Keep `existingCardIds: string[]` on line 103 unchanged.

**Step 2: Verify TypeScript catches all usages**

Run: `npx tsc --noEmit`
Expected: Multiple errors in files that reference `existingCardsCount` — this confirms we'll fix them in subsequent tasks.

**Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "$(cat <<'EOF'
refactor: replace existingCardsCount with existingCardTypes in UserProfile

Part of existing card selection redesign. The card count is now derived
from existingCardIds.length + existingCardTypes.length.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Update constants — remove `existingCardsCount` default

**Files:**
- Modify: `src/constants/index.ts:227`

**Step 1: Edit DEFAULT_VALUES**

In `src/constants/index.ts`, replace line 227:
```typescript
    existingCardsCount: 0,
```
with:
```typescript
    existingCardTypes: [] as import("../types").CardType[],
```

**Step 2: Verify no other constant references existingCardsCount**

Run: `npx tsc --noEmit 2>&1 | grep -c "existingCardsCount"`
Expected: Count should only show errors from store, components, not constants.

**Step 3: Commit**

```bash
git add src/constants/index.ts
git commit -m "$(cat <<'EOF'
refactor: update DEFAULT_VALUES for existingCardTypes

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Update userStore — add `toggleExistingCardType`, remove `setExistingCardsCount`

**Files:**
- Modify: `src/store/userStore.ts`

**Step 1: Update imports**

At line 10, add `CardType` to the import:
```typescript
import type { UserProfile, Occupation, TravelFrequency, PrimaryGoal, FeePreference, CardType } from "../types";
```

**Step 2: Update initialProfile**

Replace line 35:
```typescript
    existingCardsCount: DEFAULT_VALUES.existingCardsCount,
```
with:
```typescript
    existingCardTypes: DEFAULT_VALUES.existingCardTypes,
```

**Step 3: Update UserStore interface**

Remove the `setExistingCardsCount` method (lines 92-96). Add after `toggleExistingCard`:
```typescript
    /**
     * Toggles a card type in/out of existingCardTypes
     * @param cardType - Card type to toggle
     */
    toggleExistingCardType: (cardType: CardType) => void;
```

**Step 4: Update implementation**

Remove the `setExistingCardsCount` implementation (lines 232-239). Add after `toggleExistingCard` implementation:
```typescript
    toggleExistingCardType: (cardType) =>
        set((state) => {
            const types = state.profile.existingCardTypes;
            const existingCardTypes = types.includes(cardType)
                ? types.filter(t => t !== cardType)
                : [...types, cardType];
            return { profile: { ...state.profile, existingCardTypes } };
        }),
```

**Step 5: Verify store compiles**

Run: `npx tsc --noEmit 2>&1 | grep "userStore"`
Expected: No errors from userStore.ts.

**Step 6: Commit**

```bash
git add src/store/userStore.ts
git commit -m "$(cat <<'EOF'
refactor: update userStore for card selection redesign

Add toggleExistingCardType action, remove setExistingCardsCount.
existingCardTypes stores CardType[] for unknown cards.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Add `getCardsForBanks` helper to cards.ts

**Files:**
- Modify: `src/data/cards.ts`

**Step 1: Add bank-to-issuer mapping and helper function**

Add after the `getCardsByIssuer` function at the end of the file:

```typescript
/**
 * Maps short bank names (from MAJOR_BANKS) to card issuer names in the database.
 * This is needed because MAJOR_BANKS uses "HDFC" but cards use "HDFC Bank", etc.
 */
const BANK_TO_ISSUER: Record<string, string> = {
    "HDFC": "HDFC Bank",
    "ICICI": "ICICI Bank",
    "SBI": "SBI Card",
    "Axis": "Axis Bank",
    "Kotak": "Kotak Mahindra Bank",
    "IndusInd": "IndusInd Bank",
    "IDFC First": "IDFC First Bank",
    "Yes Bank": "Yes Bank",
    "Citibank": "Citibank",
    "Standard Chartered": "Standard Chartered",
};

/**
 * Returns cards filtered by selected bank names.
 * Prioritizes cards from selected banks, then includes the rest.
 *
 * @param selectedBanks - Bank names from MAJOR_BANKS (e.g., ["HDFC", "ICICI"])
 * @returns Object with `prioritized` (cards from selected banks) and `others` (remaining cards)
 */
export function getCardsForBanks(selectedBanks: string[]): {
    prioritized: CreditCard[];
    others: CreditCard[];
} {
    const issuerNames = new Set(
        selectedBanks.map(bank => BANK_TO_ISSUER[bank]).filter(Boolean)
    );

    const prioritized: CreditCard[] = [];
    const others: CreditCard[] = [];

    for (const card of cards) {
        if (issuerNames.has(card.issuer)) {
            prioritized.push(card);
        } else {
            others.push(card);
        }
    }

    return { prioritized, others };
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep "cards.ts"`
Expected: No errors from cards.ts.

**Step 3: Commit**

```bash
git add src/data/cards.ts
git commit -m "$(cat <<'EOF'
feat: add getCardsForBanks helper for bank-filtered card selection

Maps MAJOR_BANKS names to card issuer names and returns cards split
into prioritized (from selected banks) and others.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Update RecommendationService — merge existingCardTypes into complementary scoring

**Files:**
- Modify: `src/services/RecommendationService.ts`

**Step 1: Update `calculateFitScore` complementary card logic (lines 378-398)**

Replace the existing complementary card block (lines 378-398) with:
```typescript
    // Complementary card type boost
    const ownedTypes = new Set<string>();

    // Types from known cards in our database
    if (profile.existingCardIds?.length > 0) {
        for (const c of allCards) {
            if (profile.existingCardIds.includes(c.id)) {
                ownedTypes.add(c.type);
            }
        }
    }

    // Types from unknown cards (user-provided via fallback)
    if (profile.existingCardTypes?.length > 0) {
        for (const t of profile.existingCardTypes) {
            ownedTypes.add(t);
        }
    }

    if (ownedTypes.size > 0) {
        const complementMap: Record<string, string[]> = {
            cashback: ["travel", "rewards"],
            rewards: ["travel", "cashback"],
            travel: ["cashback", "shopping"],
            shopping: ["travel", "rewards"],
            fuel: ["travel", "cashback"],
            lifestyle: ["travel", "cashback"],
        };
        for (const ownedType of ownedTypes) {
            if (complementMap[ownedType]?.includes(card.type)) {
                score += SCORING_CONSTANTS.complementaryBonus;
                break;
            }
        }
    }
```

**Step 2: Update `generateReasoning` complementary reasoning (lines 619-637)**

Replace the existing complementary reasoning block (lines 619-637) with:
```typescript
    // Complementary card reasoning
    const ownedTypesForReasoning = new Set<string>();
    if (profile.existingCardIds?.length > 0) {
        for (const c of allCards) {
            if (profile.existingCardIds.includes(c.id)) {
                ownedTypesForReasoning.add(c.type);
            }
        }
    }
    if (profile.existingCardTypes?.length > 0) {
        for (const t of profile.existingCardTypes) {
            ownedTypesForReasoning.add(t);
        }
    }
    if (ownedTypesForReasoning.size > 0) {
        const complementMap: Record<string, string[]> = {
            cashback: ["travel", "rewards"],
            rewards: ["travel", "cashback"],
            travel: ["cashback", "shopping"],
            shopping: ["travel", "rewards"],
            fuel: ["travel", "cashback"],
            lifestyle: ["travel", "cashback"],
        };
        for (const ownedType of ownedTypesForReasoning) {
            if (complementMap[ownedType]?.includes(card.type)) {
                reasons.push(`Complements your existing ${ownedType} card with ${card.type} benefits`);
                break;
            }
        }
    }
```

**Step 3: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep "RecommendationService"`
Expected: No errors from RecommendationService.ts.

**Step 4: Commit**

```bash
git add src/services/RecommendationService.ts
git commit -m "$(cat <<'EOF'
feat: merge existingCardTypes into complementary scoring

Both existingCardIds (known cards) and existingCardTypes (unknown cards
from type fallback) are now used for complementary card recommendations.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Simplify StepCredit — remove card count and card picker

**Files:**
- Modify: `src/components/wizard/StepCredit.tsx`

**Step 1: Rewrite StepCredit**

Replace the entire file content with:
```tsx
import { useUserStore } from '../../store/userStore';

export default function StepCredit({ onNext }: { onNext: () => void }) {
    const { profile, setCreditScore } = useUserStore();

    const scoreOptions = [
        { label: 'Poor', range: '<650', value: 600 },
        { label: 'Fair', range: '650–700', value: 680 },
        { label: 'Good', range: '700–750', value: 720 },
        { label: 'Excellent', range: '750+', value: 780 },
        { label: "Don't Know", range: 'Check free', value: undefined }
    ];

    return (
        <div className="main-panel">
            <div className="step-eyebrow">Step 3 of 6</div>
            <h2>Your Credit Profile</h2>
            <p>This helps us find cards you're likely to be approved for.</p>

            <label className="form-label">What's your estimated credit score?</label>
            <div className="score-grid">
                {scoreOptions.map((opt, i) => (
                    <div
                        key={i}
                        className={`score-btn ${profile.creditScore === opt.value ? 'selected' : ''}`}
                        onClick={() => setCreditScore(opt.value)}
                    >
                        <span className="score-btn-label">{opt.label}</span>
                        <span className="score-btn-range">{opt.range}</span>
                    </div>
                ))}
            </div>

            <button className="cta-btn" onClick={onNext}>Continue →</button>
        </div>
    );
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep "StepCredit"`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/wizard/StepCredit.tsx
git commit -m "$(cat <<'EOF'
refactor: simplify StepCredit to credit score only

Card count and card picker removed — moved to StepBanks.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Update display components — derive card count

**Files:**
- Modify: `src/components/results/ResultsSidebar.tsx:23`
- Modify: `src/components/wizard/SidePanel.tsx:45`

**Step 1: Update ResultsSidebar**

At line 23, replace:
```tsx
                    <div><div className="pdc-label">Cards Held</div><div className="pdc-val">{profile.existingCardsCount}</div></div>
```
with:
```tsx
                    <div><div className="pdc-label">Cards Held</div><div className="pdc-val">{profile.existingCardIds.length + profile.existingCardTypes.length}</div></div>
```

**Step 2: Update SidePanel**

At line 45, replace:
```tsx
                            {step >= 5 && <div><div className="ppd-label">Cards Held</div><div className="ppd-value">{profile.existingCardsCount}</div></div>}
```
with:
```tsx
                            {step >= 5 && <div><div className="ppd-label">Cards Held</div><div className="ppd-value">{profile.existingCardIds.length + profile.existingCardTypes.length}</div></div>}
```

**Step 3: Verify both compile**

Run: `npx tsc --noEmit 2>&1 | grep -E "ResultsSidebar|SidePanel"`
Expected: No errors.

**Step 4: Commit**

```bash
git add src/components/results/ResultsSidebar.tsx src/components/wizard/SidePanel.tsx
git commit -m "$(cat <<'EOF'
refactor: derive card count from existingCardIds + existingCardTypes

Replace removed existingCardsCount with computed value in ResultsSidebar
and SidePanel.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Build new StepBanks with card selection UI

**Files:**
- Modify: `src/components/wizard/StepBanks.tsx`

This is the largest task. The new StepBanks has:
1. Bank selection grid (existing)
2. Card selection section (new) with search combobox, quick-pick chips, selected tags, and type fallback

**Step 1: Rewrite StepBanks**

Replace the entire file with:
```tsx
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
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors (all tasks 1-7 should have resolved prior type errors).

**Step 3: Commit**

```bash
git add src/components/wizard/StepBanks.tsx
git commit -m "$(cat <<'EOF'
feat: add card selection UI to StepBanks

Search combobox with bank-filtered results, quick-pick chips for
popular cards from selected banks, removable tags for selected cards,
and 'Don't see your card?' type fallback.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Add CSS for card selection components

**Files:**
- Modify: `src/index.css`

**Step 1: Add styles at the end of the file (before any closing comments)**

Append these styles to the end of `src/index.css`:

```css
/* ── Card Selection in StepBanks ── */

.selected-cards-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.card-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: var(--blue);
    color: white;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
}

.card-tag:hover {
    opacity: 0.8;
}

.card-tag-type {
    background: var(--text-2);
}

.card-search-wrapper {
    position: relative;
    margin-bottom: 12px;
}

.card-search-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    font-size: 14px;
    background: white;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
}

.card-search-input:focus {
    border-color: var(--blue);
}

.card-search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-top: 4px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow: hidden;
}

.card-search-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.1s;
}

.card-search-option:hover {
    background: var(--bg-alt, #f5f5f7);
}

.card-search-name {
    font-weight: 600;
    font-size: 14px;
}

.card-search-issuer {
    font-size: 12px;
    color: var(--text-2);
}

.quick-picks {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.type-fallback-link {
    font-size: 13px;
    color: var(--blue);
    cursor: pointer;
    margin-top: 4px;
    margin-bottom: 8px;
}

.type-fallback-link:hover {
    text-decoration: underline;
}

.type-fallback-section {
    margin-top: 8px;
}

.type-fallback-label {
    font-size: 13px;
    color: var(--text-2);
    margin-bottom: 8px;
}
```

**Step 2: Visually verify**

Run: `npm run dev`
Navigate to the wizard, reach StepBanks (Step 6), select a bank, and verify:
- Card selection section appears
- Search input renders
- Quick-pick chips show cards from selected bank
- "Don't see your card?" link expands type selector
- Selected cards appear as removable tags

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "$(cat <<'EOF'
style: add CSS for card selection UI in StepBanks

Styles for search combobox, dropdown, card tags, quick-pick chips,
and type fallback section.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Full build verification and cleanup

**Files:** None new — verification only.

**Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`
Expected: Zero errors.

**Step 2: Run lint**

Run: `npm run lint`
Expected: No new errors. Fix any that appear.

**Step 3: Run build**

Run: `npm run build`
Expected: Successful build with no errors.

**Step 4: Manual smoke test**

Run: `npm run dev`
Test the full flow:
1. Go through wizard steps 1-5 normally
2. At Step 6 (StepBanks), select 2 banks
3. Verify card section appears with quick picks from those banks
4. Search for a card, select it — verify tag appears
5. Click "Don't see your card?" — select a type — verify tag appears
6. Remove a tag by clicking it
7. Click "Get Recommendations" — verify results page shows correct "Cards Held" count
8. Verify recommendations exclude selected known cards
9. Test with 0 banks selected — card section should be hidden

**Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: address lint/build issues from card selection redesign

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```
