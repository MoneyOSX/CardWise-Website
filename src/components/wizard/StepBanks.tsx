import { useUserStore } from '../../store/userStore';
import { MAJOR_BANKS } from '../../constants';
import { createToggleHandler } from '../../utils/helpers';

export default function StepBanks({ onNext }: { onNext: () => void }) {
    const { profile, addBankAccount, removeBankAccount } = useUserStore();

    const handleBank = createToggleHandler(profile.bankAccounts, addBankAccount, removeBankAccount);

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
            <button className="cta-btn" onClick={onNext}>Get Recommendations ✦</button>
            <div className="skip-link" onClick={onNext}>Skip this step</div>
        </div>
    );
}
