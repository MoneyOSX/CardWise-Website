import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StepOccupation from './StepOccupation';
import StepIncome from './StepIncome';
import StepCredit from './StepCredit';
import StepSpending from './StepSpending';
import StepPreferences from './StepPreferences';
import StepBanks from './StepBanks';
import SidePanel from './SidePanel';
import LoadingScreen from './LoadingScreen';
import Logo from '../shared/Logo';

export default function WizardLayout() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < 6) {
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setIsLoading(true);
        }
    };

    const handleLoadingComplete = () => {
        navigate('/app/results');
    };

    if (isLoading) {
        return <LoadingScreen onComplete={handleLoadingComplete} />;
    }

    return (
        <div id="app-flow" style={{ display: 'block' }}>
            <div className="app-header">
                <Link to="/">
                    <Logo size="small" />
                </Link>

                <div className="stepper">
                    {[
                        { num: 1, label: 'Work' },
                        { num: 2, label: 'Income' },
                        { num: 3, label: 'Credit' },
                        { num: 4, label: 'Spends' },
                        { num: 5, label: 'Preferences' },
                        { num: 6, label: 'Banks' }
                    ].map((s, idx) => (
                        <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={`step-item ${step === s.num ? 'active' : ''}`}>
                                <div className="step-num">{s.num}</div> {s.label}
                            </div>
                            {idx < 5 && <div className={`step-connector ${step > s.num ? 'active' : ''}`}></div>}
                        </div>
                    ))}
                </div>

                <Link to="/" className="btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }}>← Back to Home</Link>
            </div>

            <div className="app-body">
                <div className="app-screen active">
                    {step === 1 && <StepOccupation onNext={handleNext} />}
                    {step === 2 && <StepIncome onNext={handleNext} />}
                    {step === 3 && <StepCredit onNext={handleNext} />}
                    {step === 4 && <StepSpending onNext={handleNext} />}
                    {step === 5 && <StepPreferences onNext={handleNext} />}
                    {step === 6 && <StepBanks onNext={handleNext} />}
                </div>

                <div className="app-screen active">
                    <SidePanel step={step} />
                </div>
            </div>
        </div>
    );
}
