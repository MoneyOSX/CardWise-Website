import { useUserStore } from '../../store/userStore';

export default function StepIncome({ onNext }: { onNext: () => void }) {
    const { profile, setIncome } = useUserStore();

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
                        value={profile.monthlyIncome || ''}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        placeholder="50000"
                    />
                </div>
                <div className="income-hint">₹{(profile.monthlyIncome / 1000).toFixed(1)}K / month</div>
            </div>
            <div className="privacy-note">🛡️ Your data is processed locally and never stored on our servers.</div>
            <button className="cta-btn" onClick={onNext} disabled={!profile.monthlyIncome}>Continue →</button>
        </div>
    );
}
