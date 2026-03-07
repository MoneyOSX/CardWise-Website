# Feedback Button on Results Screen — Design Doc

**Date:** 2026-03-07
**Branch:** feature/enchacements

## Goal

Add a single binary feedback prompt ("Did you find a card you'd apply for?") to the results screen to measure whether the recommendation engine is working, from day one.

## Decisions

- **Placement:** After the last result card (not sticky, not modal)
- **Post-submit behavior:** Swap to "Thanks for your feedback!" message (no follow-up questions)
- **Data storage:** Firebase Analytics only (existing `track()` helper), no Firestore

## Design

### Component: `FeedbackPrompt`

**File:** `src/components/results/FeedbackPrompt.tsx`

Self-contained component with two visual states:

1. **Idle:** Question text + two thumb buttons side by side
2. **Submitted:** Checkmark + thank-you message in green

State managed with `useState<'idle' | 'up' | 'down'>`. On click, fires analytics event and transitions to submitted.

### Analytics Event

**File:** `src/services/analytics.ts`

```typescript
export const trackResultsFeedback = (thumbs: 'up' | 'down') =>
  track('results_feedback', { thumbs });
```

Event name: `results_feedback`
Parameter: `thumbs` — `"up"` or `"down"`

### Placement

**File:** `src/components/results/ResultsPage.tsx`

Rendered after the `topCards.map(...)` block and the empty-state fallback, so it appears below the last card.

### Styling

Inline styles matching existing results page patterns:
- White background, `1px solid var(--border)`, `border-radius: 16px`
- Centered text in `var(--text-2)`
- Thumb buttons with `1.5rem` emoji, light hover background
- Submitted state: green checkmark text

No CSS file changes.

## Files Changed

| Action | File |
|--------|------|
| Create | `src/components/results/FeedbackPrompt.tsx` |
| Modify | `src/services/analytics.ts` — add `trackResultsFeedback` |
| Modify | `src/components/results/ResultsPage.tsx` — render `FeedbackPrompt` |
