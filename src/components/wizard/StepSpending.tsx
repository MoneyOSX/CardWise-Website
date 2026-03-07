import { useUserStore } from '../../store/userStore';

export default function StepSpending({ onNext }: { onNext: () => void }) {
    const { profile, setSpending } = useUserStore();

    const categories = [
        { id: 'online', name: 'Online Shopping', emoji: '🛒', bg: '#EEF4FF', ranges: [0, 1500, 3500, 7500, 12000] },
        { id: 'foodDelivery', name: 'Food Delivery', emoji: '🍱', bg: '#FFF4EC', ranges: [0, 750, 2000, 4000, 6000] },
        { id: 'dining', name: 'Dining Out', emoji: '🍽️', bg: '#FFF8E1', ranges: [0, 750, 2000, 4000, 6000] },
        { id: 'groceries', name: 'Groceries', emoji: '🥦', bg: '#EDFDF8', ranges: [0, 2000, 4000, 7500, 12000] },
        { id: 'fuel', name: 'Fuel', emoji: '⛽', bg: '#FEF9EC', ranges: [0, 1500, 3500, 6500, 10000] },
        { id: 'utilities', name: 'Bills & Utilities', emoji: '💡', bg: '#F3EEFF', ranges: [0, 2000, 4000, 6500, 10000] },
        { id: 'travel', name: 'Travel & Hotels', emoji: '✈️', bg: '#EEF4FF', ranges: [0, 2000, 5000, 11000, 20000] },
        { id: 'emi', name: 'EMI / Big Buys', emoji: '📱', bg: '#FFF0F3', ranges: [0, 3500, 10000, 20000] },
    ] as const;

    return (
        <div className="main-panel">
            <div className="step-eyebrow">Step 4 of 6</div>
            <h2>How do you spend?</h2>
            <p>Estimate your monthly spend in each category. Select the range that fits best.</p>

            <div className="spend-grid">
                {categories.map((cat) => (
                    <div className="spend-item" key={cat.id}>
                        <div className="spend-item-top">
                            <div className="spend-emoji-wrap" style={{ background: cat.bg }}>{cat.emoji}</div>
                            <div className="spend-name">{cat.name}</div>
                        </div>
                        <div className="spend-ranges">
                            {cat.ranges.map((val, idx) => {
                                const isSelected = profile.spending[cat.id] === val;
                                return (
                                    <div
                                        key={idx}
                                        className={`range-chip ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSpending(cat.id, val)}
                                    >
                                        {idx === 0 ? 'None' : `₹${val / 1000}${idx === cat.ranges.length - 1 ? 'K+' : 'K'}`}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <button className="cta-btn" onClick={onNext}>Continue →</button>
        </div>
    );
}
