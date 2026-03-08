# Existing Card Selection Redesign

## Problem

When users select 1+ existing cards, they see all 22+ cards from the database grouped by ~15 issuers. This creates friction in Step 3 (StepCredit), which already asks about credit score and card count. Mixed audience (first-timers and experienced users) means we can't ignore this.

## Goals

- Reduce friction in card selection while preserving recommendation quality
- Keep both duplicate filtering and complementary card scoring
- Support cards outside our 22-card database
- No additional wizard steps

## Design

### 1. Move card selection from StepCredit to StepBanks

StepBanks already collects which banks the user has accounts with. "Which cards do you have from these banks?" is a natural follow-up.

**StepBanks new flow:**
1. Bank selection grid (unchanged)
2. Card selection section (appears after selecting 1+ banks):
   - Search combobox: filters cards from DB, prioritizes cards from selected banks, other cards shown below a divider
   - Quick-pick chips: 4-6 popular cards from selected banks, updates dynamically as banks change, disappear once selected
   - Selected cards: shown as removable tags/pills above the search input
   - "Don't see your card?" link: expands a row of CardType buttons (Cashback, Travel, Rewards, Fuel, Shopping, Lifestyle). Selecting one adds a tag like "Other - Travel"
   - Hidden if no banks selected, skippable if no cards
3. Continue button

### 2. Simplify StepCredit

Remove card count selector and card picker. StepCredit becomes a single question: credit score selection.

### 3. Data model changes

**UserProfile:**
- Add `existingCardTypes: CardType[]` for unknown cards captured via type fallback
- Remove `existingCardsCount` (derive from `existingCardIds.length + existingCardTypes.length`)

**userStore:**
- Add `toggleExistingCardType(type: CardType)` action
- Remove `setExistingCardsCount` action
- Update reset logic accordingly

### 4. Engine changes

**RecommendationService - complementary scoring (`calculateFitScore`):**
- Current: resolves `existingCardIds` to types via DB lookup
- Change: merge with `existingCardTypes` directly
- `ownedTypes = Set([...types from existingCardIds lookup, ...existingCardTypes])`

**RecommendationService - duplicate filtering:**
- No change. Still uses `existingCardIds`.

**RecommendationService - reasoning generation:**
- Same merge of owned types for complementary card reasoning.

### 5. Display updates

**ResultsSidebar and SidePanel:**
- Replace `profile.existingCardsCount` with `profile.existingCardIds.length + profile.existingCardTypes.length`

## Files to modify

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `existingCardTypes`, remove `existingCardsCount` |
| `src/constants/index.ts` | Update default values |
| `src/store/userStore.ts` | Add `toggleExistingCardType`, remove `setExistingCardsCount` |
| `src/components/wizard/StepBanks.tsx` | Add card selection UI |
| `src/components/wizard/StepCredit.tsx` | Remove card count + card picker |
| `src/services/RecommendationService.ts` | Merge `existingCardTypes` into complementary scoring |
| `src/components/results/ResultsSidebar.tsx` | Derive card count |
| `src/components/wizard/SidePanel.tsx` | Derive card count |
| `src/data/cards.ts` | Keep `getCardsByIssuer`, may add helper to get cards by bank list |

## What stays the same

- Duplicate filtering logic
- All other wizard steps (Income, Spending, Occupation, Preferences)
- Scoring weights and thresholds
- Card database structure
- Step numbering (still 6 steps)

## Expected impact

- StepCredit: 3 questions reduced to 1
- Card selection: users see ~3-6 relevant cards instead of 22+
- Natural context: card selection follows bank selection
- Zero extra steps added
