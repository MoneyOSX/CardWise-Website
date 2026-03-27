import { useState } from 'react';
import { useUserStore } from '../../store/userStore';

export default function StepSpending({ onNext }: { onNext: () => void }) {
    const { profile, setSpending, getTotalSpending } = useUserStore();
    const [customOpenId, setCustomOpenId] = useState<string | null>(null);
    const [customInputValue, setCustomInputValue] = useState('');

    const categories = [
        { id: 'online', name: 'Online Shopping', emoji: '🛒', accent: '#4F7DF9', accentLight: '#EEF2FF', ranges: [0, 1500, 3500, 7500, 12000] },
        { id: 'foodDelivery', name: 'Food Delivery', emoji: '🍱', accent: '#F97B4F', accentLight: '#FFF3ED', ranges: [0, 750, 2000, 4000, 6000] },
        { id: 'dining', name: 'Dining Out', emoji: '🍽️', accent: '#E5A83B', accentLight: '#FFF9EC', ranges: [0, 750, 2000, 4000, 6000] },
        { id: 'groceries', name: 'Groceries', emoji: '🥦', accent: '#10B981', accentLight: '#ECFDF5', ranges: [0, 2000, 4000, 7500, 12000] },
        { id: 'fuel', name: 'Fuel', emoji: '⛽', accent: '#D4A017', accentLight: '#FEF9EC', ranges: [0, 1500, 3500, 6500, 10000] },
        { id: 'utilities', name: 'Bills & Utilities', emoji: '💡', accent: '#8B5CF6', accentLight: '#F3EEFF', ranges: [0, 2000, 4000, 6500, 10000] },
        { id: 'travel', name: 'Travel & Hotels', emoji: '✈️', accent: '#0EA5E9', accentLight: '#EFF8FF', ranges: [0, 2000, 5000, 11000, 20000] },
        { id: 'emi', name: 'EMI / Big Buys', emoji: '📱', accent: '#EC4899', accentLight: '#FFF0F6', ranges: [0, 3500, 10000, 20000] },
    ] as const;

    const total = getTotalSpending();

    const isCustomValue = (catId: string, val: number): boolean => {
        const cat = categories.find(c => c.id === catId);
        return val > 0 && cat !== undefined && !(cat.ranges as readonly number[]).includes(val);
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
        const parsed = parseInt(raw, 10);
        const clamped = isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), 100000);
        setSpending(catId as Parameters<typeof setSpending>[0], clamped);
    };

    const formatRange = (val: number, idx: number, total: number) => {
        if (idx === 0) return 'None';
        const k = val / 1000;
        return `₹${k % 1 === 0 ? k : k.toFixed(1)}${idx === total - 1 ? 'K+' : 'K'}`;
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
                                {cat.ranges.map((val, idx) => {
                                    const isSelected = currentVal === val && !isCustomOpen;
                                    return (
                                        <button
                                            key={idx}
                                            className={`spend-chip ${isSelected ? 'spend-chip--selected' : ''}`}
                                            style={isSelected ? { background: cat.accent, borderColor: cat.accent } : undefined}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handlePresetClick(cat.id, val)}
                                        >
                                            {formatRange(val, idx, cat.ranges.length)}
                                        </button>
                                    );
                                })}
                                <button
                                    className={`spend-chip spend-chip--custom ${isCustom || isCustomOpen ? 'spend-chip--selected' : ''}`}
                                    style={isCustom || isCustomOpen ? { background: cat.accent, borderColor: cat.accent } : undefined}
                                    onMouseDown={(e) => e.preventDefault()}
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
                                        onChange={(e) => {
                                            setCustomInputValue(e.target.value);
                                            handleCustomChange(cat.id, e.target.value);
                                        }}
                                        onBlur={() => {
                                            setCustomOpenId(null);
                                            setCustomInputValue('');
                                        }}
                                        autoFocus
                                        placeholder="Enter amount"
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
