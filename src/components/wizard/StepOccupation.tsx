import { useUserStore } from '../../store/userStore';
import type { Occupation } from '../../types';

export default function StepOccupation({ onNext }: { onNext: () => void }) {
    const { profile, setOccupation } = useUserStore();

    const handleSelect = (occ: Occupation) => {
        setOccupation(occ);
        onNext();
    };

    return (
        <div className="main-panel">
            <div className="step-eyebrow">Step 1 of 6</div>
            <h2>Tell us about your work</h2>
            <p>We use your occupation to narrow down eligible credit card offers.</p>
            <div className="work-grid">
                <div className={`work-card ${profile.occupation === 'Salaried' ? 'selected' : ''}`} onClick={() => handleSelect('Salaried')}>
                    <div className="work-icon blue">💼</div>
                    <div className="work-title">Salaried</div>
                    <div className="work-desc">Working at a company</div>
                </div>
                <div className={`work-card ${profile.occupation === 'Self-Employed' ? 'selected' : ''}`} onClick={() => handleSelect('Self-Employed')}>
                    <div className="work-icon purple">🏢</div>
                    <div className="work-title">Self-Employed</div>
                    <div className="work-desc">Running your own business</div>
                </div>
                <div className={`work-card ${profile.occupation === 'Business' ? 'selected' : ''}`} onClick={() => handleSelect('Business')}>
                    <div className="work-icon orange">💰</div>
                    <div className="work-title">Business Owner</div>
                    <div className="work-desc">Registered business entity</div>
                </div>
                <div className={`work-card ${profile.occupation === 'Student' ? 'selected' : ''}`} onClick={() => handleSelect('Student')}>
                    <div className="work-icon green">🎓</div>
                    <div className="work-title">Student</div>
                    <div className="work-desc">Currently studying</div>
                </div>
            </div>
            <button className="cta-btn" onClick={onNext}>Continue →</button>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', marginTop: '12px' }}>
                Your data is used only for match recommendations.
            </div>
        </div>
    );
}
