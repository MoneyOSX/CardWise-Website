# Feedback Button on Results Screen — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a binary feedback prompt to the results screen so we can measure if the recommendation engine is working from day one.

**Architecture:** A single `FeedbackPrompt` component rendered after the last result card. On thumb click, fires a Firebase Analytics event via the existing `track()` helper and swaps to a thank-you message. No new dependencies.

**Tech Stack:** React, TypeScript, Firebase Analytics (existing)

---

## Context

- **App:** React + TypeScript + Vite credit card recommendation site
- **Existing analytics:** `src/services/analytics.ts` with `track()` helper wrapping Firebase `logEvent`
- **Results page:** `src/components/results/ResultsPage.tsx` renders up to 5 `ResultCard` components
- **Styling convention:** Inline styles (no CSS modules), uses CSS variables from `src/index.css`
- **No test framework installed** — skip TDD for this task

---

### Task 1: Add the analytics tracking function

**Files:**
- Modify: `src/services/analytics.ts:47-48` (append after last export)

**Step 1: Add `trackResultsFeedback` to analytics.ts**

Add this export at the end of the file, after `trackFilterClick`:

```typescript
export const trackResultsFeedback = (thumbs: 'up' | 'down') =>
  track('results_feedback', { thumbs });
```

**Step 2: Verify the build compiles**

Run: `npx tsc --noEmit 2>&1 | head -5`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/services/analytics.ts
git commit -m "feat: add results_feedback analytics event"
```

---

### Task 2: Create the FeedbackPrompt component

**Files:**
- Create: `src/components/results/FeedbackPrompt.tsx`

**Step 1: Create `src/components/results/FeedbackPrompt.tsx`**

```tsx
import { useState } from 'react';
import { trackResultsFeedback } from '../../services/analytics';

export default function FeedbackPrompt() {
    const [status, setStatus] = useState<'idle' | 'up' | 'down'>('idle');

    const handleClick = (thumbs: 'up' | 'down') => {
        trackResultsFeedback(thumbs);
        setStatus(thumbs);
    };

    if (status !== 'idle') {
        return (
            <div style={{
                padding: '32px 40px',
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 16,
                textAlign: 'center',
                marginTop: 24,
            }}>
                <span style={{ fontSize: '1.3rem', color: 'var(--green)', fontWeight: 600 }}>
                    Thanks for your feedback!
                </span>
            </div>
        );
    }

    return (
        <div style={{
            padding: '32px 40px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 16,
            textAlign: 'center',
            marginTop: 24,
        }}>
            <div style={{ color: 'var(--text-2)', fontSize: '1rem', marginBottom: 16 }}>
                Did you find a card you'd apply for?
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <button
                    onClick={() => handleClick('up')}
                    style={{
                        fontSize: '1.5rem',
                        padding: '8px 24px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    👍
                </button>
                <button
                    onClick={() => handleClick('down')}
                    style={{
                        fontSize: '1.5rem',
                        padding: '8px 24px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    👎
                </button>
            </div>
        </div>
    );
}
```

**Step 2: Verify the build compiles**

Run: `npx tsc --noEmit 2>&1 | head -5`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/results/FeedbackPrompt.tsx
git commit -m "feat: add FeedbackPrompt component"
```

---

### Task 3: Wire FeedbackPrompt into ResultsPage

**Files:**
- Modify: `src/components/results/ResultsPage.tsx:1-8` (add import)
- Modify: `src/components/results/ResultsPage.tsx:72-83` (add component after cards list)

**Step 1: Add import**

Add this import at the top of `ResultsPage.tsx`, after the `FilterChips` import (line 6):

```typescript
import FeedbackPrompt from './FeedbackPrompt';
```

**Step 2: Render the component**

In `ResultsPage.tsx`, add `<FeedbackPrompt />` after the empty-state `div` (after the closing `)}` on line 82), before the closing `</div>` on line 83:

```tsx
                    <FeedbackPrompt />
```

**Step 3: Verify the build compiles**

Run: `npx tsc --noEmit 2>&1 | head -5`
Expected: No errors.

**Step 4: Visual verification**

Run: `npm run dev`
Navigate to the results screen. Verify:
1. The feedback prompt appears below the last card
2. Clicking a thumb swaps to "Thanks for your feedback!"
3. Check browser console — the Firebase analytics event fires

**Step 5: Commit**

```bash
git add src/components/results/ResultsPage.tsx
git commit -m "feat: wire FeedbackPrompt into results page"
```

---

## Summary of all files

| Action | File |
|--------|------|
| Modify | `src/services/analytics.ts` — add `trackResultsFeedback` |
| Create | `src/components/results/FeedbackPrompt.tsx` — feedback prompt component |
| Modify | `src/components/results/ResultsPage.tsx` — import and render `FeedbackPrompt` |
