import { useUserStore } from '../../store/userStore';
import { INCOME_INPUT_LIMITS } from '../../constants';
import { getIncomeBucket } from '../../utils/helpers';

export default function StepIncome({ onNext }: { onNext: () => void }) {
    const { profile, setIncome } = useUserStore();
    const income = profile.monthlyIncome;

    const bucket = getIncomeBucket(income);
    const isTooLow = income > 0 && income < INCOME_INPUT_LIMITS.min;
    const isCapped = income >= INCOME_INPUT_LIMITS.cap;

    const getBucketHint = () => {
        if (income === 0) return "Enter your income to see matches";
        if (isTooLow) return "Income too low for most cards";
        if (bucket === "secured_only") return "Secured & student cards only";
        if (bucket === "limited") return "Limited entry-level results";
        if (bucket === "normal") return "Full card recommendations";
        return "Premium & elite card recommendations";
    };

    return (
        <div className="main-panel">
            <div className="step-eyebrow">Step 2 of 6</div>
            <h2>What's your monthly income?</h2>
            <p>We use this to check which cards you are eligible for.</p>

            <div className="income-box">
                <div className="income-label">Monthly Take-home Salary</div>
                <div className="income-row">
                    <div className="rupee-sym">₹</div>
                    <input
                        className="income-input"
                        type="number"
                        value={income || ''}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setIncome(val);
                        }}
                        placeholder="50000"
                    />
                </div>

                <div className="income-hint" style={{ color: isTooLow ? 'var(--error)' : 'inherit' }}>
                    {income >= 1000 ? `₹${(income / 1000).toFixed(0)}K / month` : 'Enter amount'}
                    <span style={{ margin: '0 8px', opacity: 0.3 }}>•</span>
                    <span style={{ fontWeight: 500 }}>{getBucketHint()}</span>
                </div>
            </div>

            {isTooLow && (
                <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: 8, padding: '8px 12px', background: '#fff5f5', borderRadius: 8, border: '1px solid #ff000020' }}>
                    ⚠️ Recommendations start from ₹{INCOME_INPUT_LIMITS.min.toLocaleString()} per month.
                </div>
            )}

            {isCapped && (
                <div style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: 8, padding: '8px 12px', background: '#f0f7ff', borderRadius: 8, border: '1px solid #0000ff10' }}>
                    ✨ We've capped this at ₹10L — you'll see all premium cards!
                </div>
            )}

            <div className="privacy-note" style={{ marginTop: 24 }}>🛡️ Your data is processed locally and never stored on our servers.</div>

            <button
                className="cta-btn"
                onClick={onNext}
                disabled={!income || isTooLow}
                style={{ marginTop: 16 }}
            >
                Continue →
            </button>
        </div>
    );
}
