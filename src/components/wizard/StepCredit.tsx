import { useUserStore } from '../../store/userStore';

export default function StepCredit({ onNext }: { onNext: () => void }) {
    const { profile, setCreditScore, setExistingCardsCount } = useUserStore();

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

            <label className="form-label">How many credit cards do you currently have?</label>
            <div className="chip-row">
                {[0, 1, 2, 3, 4, 5].map(num => (
                    <div
                        key={num}
                        className={`chip ${profile.existingCardsCount === num ? 'selected' : ''}`}
                        onClick={() => setExistingCardsCount(num)}
                    >
                        {num === 5 ? '5+' : num}
                    </div>
                ))}
            </div>

            <button className="cta-btn" onClick={onNext}>Continue →</button>
        </div>
    );
}
