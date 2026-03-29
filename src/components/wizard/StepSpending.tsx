import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { CATEGORY_LABELS, SPENDING_SLABS } from '../../constants';

const CATEGORY_UI: Record<keyof typeof CATEGORY_LABELS, { emoji: string; accent: string; accentLight: string }> = {
    online:       { emoji: '🛒', accent: '#4F7DF9', accentLight: '#EEF2FF' },
    foodDelivery: { emoji: '🍱', accent: '#F97B4F', accentLight: '#FFF3ED' },
    dining:       { emoji: '🍽️', accent: '#E5A83B', accentLight: '#FFF9EC' },
    groceries:    { emoji: '🥦', accent: '#10B981', accentLight: '#ECFDF5' },
    fuel:         { emoji: '⛽', accent: '#D4A017', accentLight: '#FEF9EC' },
    utilities:    { emoji: '💡', accent: '#8B5CF6', accentLight: '#F3EEFF' },
    travel:       { emoji: '✈️', accent: '#0EA5E9', accentLight: '#EFF8FF' },
    emi:          { emoji: '📱', accent: '#EC4899', accentLight: '#FFF0F6' },
    other:        { emoji: '💰', accent: '#6B7280', accentLight: '#F3F4F6' },
};

const categories = (Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(id => ({
    id,
    name: CATEGORY_LABELS[id],
    ...CATEGORY_UI[id],
    slabs: SPENDING_SLABS[id],
}));

export default function StepSpending({ onNext }: { onNext: () => void }) {
    const { profile, setSpending, getTotalSpending } = useUserStore();
    const [customOpenId, setCustomOpenId] = useState<string | null>(null);
    const [customInputValue, setCustomInputValue] = useState('');

    const total = getTotalSpending();

    const isCustomValue = (catId: string, val: number): boolean => {
        const cat = categories.find(c => c.id === catId);
        return val > 0 && cat !== undefined && !cat.slabs.some(s => s.value === val);
    };

    const handlePresetClick = (catId: string, val: number) => {
        setSpending(catId as Parameters<typeof setSpending>[0], val);
        setCustomOpenId(null);
        setCustomInputValue('');
    };

    const handleCustomChipClick = (catId: string, currentVal: number, isCurrentlyOpen: boolean, isCurrentlyCustom: boolean) => {
        if (isCurrentlyOpen) {
            setCustomOpenId(null);
            setCustomInputValue('');
        } else {
            setCustomOpenId(catId);
            setCustomInputValue(isCurrentlyCustom ? String(currentVal) : '');
        }
    };

    const handleCustomChange = (catId: string, raw: string) => {
        if (raw === '') {
            setCustomInputValue('');
            setSpending(catId as Parameters<typeof setSpending>[0], 0);
            return;
        }

        const parsed = parseInt(raw, 10);

        if (isNaN(parsed)) {
            setCustomInputValue(raw);
            return;
        }

        const clamped = Math.min(Math.max(parsed, 0), 100000);
        setCustomInputValue(String(clamped));
        setSpending(catId as Parameters<typeof setSpending>[0], clamped);
    };

    const activeCount = categories.filter(cat => profile.spending[cat.id] > 0).length;

    return (
        <div className="main-panel">
            <div className="step-eyebrow">Step 4 of 6</div>
            <h2>How do you spend?</h2>
            <p className="spend-subtitle">
                Pick the range closest to your monthly spend in each category.
                <span className="spend-hint">{activeCount === 0 ? 'Select at least a few to get accurate results.' : `${activeCount} of ${categories.length} categories set`}</span>
            </p>

            <div className="spend-grid-v2">
                {categories.map((cat, catIdx) => {
                    const currentVal = profile.spending[cat.id];
                    const isCustom = isCustomValue(cat.id, currentVal);
                    const isCustomOpen = customOpenId === cat.id;
                    const isActive = currentVal > 0;

                    return (
                        <div
                            className={`spend-card ${isActive ? 'spend-card--active' : ''}`}
                            key={cat.id}
                            style={{
                                '--cat-accent': cat.accent,
                                '--cat-accent-light': cat.accentLight,
                                animationDelay: `${catIdx * 40}ms`,
                            } as React.CSSProperties}
                        >
                            <div className="spend-card-header">
                                <div className="spend-card-icon" style={{ background: cat.accentLight }}>
                                    <span>{cat.emoji}</span>
                                </div>
                                <div className="spend-card-info">
                                    <span className="spend-card-name">{cat.name}</span>
                                    {isActive && (
                                        <span className="spend-card-value" style={{ color: cat.accent }}>
                                            ₹{currentVal.toLocaleString('en-IN')}/mo
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="spend-card-ranges">
                                {cat.slabs.map((slab, idx) => {
                                    const isSelected = currentVal === slab.value && !isCustomOpen;
                                    return (
                                        <button
                                            key={idx}
                                            className={`spend-chip ${isSelected ? 'spend-chip--selected' : ''}`}
                                            style={isSelected ? { background: cat.accent, borderColor: cat.accent } : undefined}
                                            onClick={() => handlePresetClick(cat.id, slab.value)}
                                        >
                                            {slab.label}
                                        </button>
                                    );
                                })}
                                <button
                                    className={`spend-chip spend-chip--custom ${isCustom || isCustomOpen ? 'spend-chip--selected' : ''}`}
                                    style={isCustom || isCustomOpen ? { background: cat.accent, borderColor: cat.accent } : undefined}
                                    onClick={() => handleCustomChipClick(cat.id, currentVal, isCustomOpen, isCustom)}
                                >
                                    ✏️ Custom
                                </button>
                            </div>

                            {isCustomOpen && (
                                <div className="spend-card-custom" style={{ borderColor: cat.accent }}>
                                    <span className="spend-card-custom-symbol" style={{ color: cat.accent }}>₹</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100000}
                                        value={customInputValue}
                                        onChange={(e) => handleCustomChange(cat.id, e.target.value)}
                                        onBlur={() => {
                                            setCustomOpenId(null);
                                            setCustomInputValue('');
                                        }}
                                        autoFocus
                                        placeholder="Enter amount"
                                        aria-label={`Custom monthly spending amount for ${cat.name}`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {total > 0 && (
                <div className="spend-total-strip">
                    <div className="spend-total-left">
                        <span className="spend-total-tag">Monthly Total</span>
                        <span className="spend-total-value">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="spend-total-ring">
                        <span>{activeCount}/{categories.length}</span>
                    </div>
                </div>
            )}

            <button className="cta-btn" onClick={onNext}>Continue →</button>
        </div>
    );
}
