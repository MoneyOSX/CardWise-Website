import { useUserStore } from '../../store/userStore';
import type { PrimaryGoal } from '../../types';

export default function StepPreferences({ onNext }: { onNext: () => void }) {
    const {
        profile,
        setTravelFrequency,
        setAirportLoungeImportance,
        addShoppingPlatform,
        removeShoppingPlatform,
        setPrimaryGoals,
        setFeePreference
    } = useUserStore();

    const handlePlatform = (p: string) => {
        if (profile.primaryShoppingPlatforms.includes(p)) {
            removeShoppingPlatform(p);
        } else {
            addShoppingPlatform(p);
        }
    };

    const handleGoal = (g: PrimaryGoal) => {
        const goals = [...profile.primaryGoals];
        if (goals.includes(g)) {
            setPrimaryGoals(goals.filter(x => x !== g));
        } else if (goals.length < 2) {
            setPrimaryGoals([...goals, g]);
        }
    };

    const platforms = [
        { id: 'Amazon', icon: '📦' }, { id: 'Flipkart', icon: '🛒' }, { id: 'Myntra', icon: '👗' },
        { id: 'Swiggy', icon: '🍱' }, { id: 'Zomato', icon: '🍕' }, { id: 'BigBasket', icon: '🥦' },
        { id: 'BookMyShow', icon: '🎬' }, { id: 'IRCTC', icon: '🚂' }, { id: 'MakeMyTrip', icon: '✈️' },
        { id: 'Nykaa', icon: '💄' }, { id: 'Apple', icon: '🍎' }, { id: 'Other', icon: '🌐' }
    ];

    const goalsList: { id: PrimaryGoal, icon: string, label: string, sub: string }[] = [
        { id: 'cashback', icon: '💰', label: 'Maximize Cashback', sub: 'Get money back on every purchase' },
        { id: 'rewards', icon: '⭐', label: 'Earn Reward Points', sub: 'Accumulate points for gifts and vouchers' },
        { id: 'travel', icon: '✈️', label: 'Travel Benefits', sub: 'Lounge access, air miles, hotel upgrades' },
        { id: 'building_credit', icon: '📈', label: 'Build Credit History', sub: 'Improve CIBIL score for future loans' }
    ];

    return (
        <div className="main-panel">
            <div className="step-eyebrow">Step 5 of 6</div>
            <h2>Your Preferences</h2>
            <p>Help us personalize your recommendations.</p>

            <div className="pref-section">
                <div className="pref-title">How often do you travel? ✈️</div>
                <div className="toggle-row">
                    <button className={`toggle-opt ${profile.travelFrequency === 'none' ? 'selected' : ''}`} onClick={() => setTravelFrequency('none')}>🏠 Rarely</button>
                    <button className={`toggle-opt ${profile.travelFrequency === 'occasional' ? 'selected' : ''}`} onClick={() => setTravelFrequency('occasional')}>🚗 Sometimes</button>
                    <button className={`toggle-opt ${profile.travelFrequency === 'frequent' ? 'selected' : ''}`} onClick={() => setTravelFrequency('frequent')}>✈️ Often</button>
                </div>
            </div>

            <div className="pref-section">
                <div className="pref-title">Airport lounge access importance 🛋️</div>
                <div className="importance-row">
                    <button className={`imp-btn ${profile.airportLoungeImportance === 1 ? 'selected' : ''}`} onClick={() => setAirportLoungeImportance(1)}>Not Important</button>
                    <button className={`imp-btn ${profile.airportLoungeImportance === 3 ? 'selected' : ''}`} onClick={() => setAirportLoungeImportance(3)}>Somewhat</button>
                    <button className={`imp-btn ${profile.airportLoungeImportance === 5 ? 'selected' : ''}`} onClick={() => setAirportLoungeImportance(5)}>Very Important</button>
                </div>
            </div>

            <div className="pref-section">
                <div className="pref-title">Where do you shop online? 🛍️</div>
                <div className="platform-grid">
                    {platforms.map(p => (
                        <div
                            key={p.id}
                            className={`plat-btn ${profile.primaryShoppingPlatforms.includes(p.id) ? 'selected' : ''}`}
                            onClick={() => handlePlatform(p.id)}
                        >
                            <span className="pe">{p.icon}</span><span className="pn">{p.id}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pref-section">
                <div className="pref-title">Primary goal? <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-3)' }}>(Pick up to 2)</span></div>
                <div className="goal-list">
                    {goalsList.map(g => (
                        <div
                            key={g.id}
                            className={`goal-item ${profile.primaryGoals.includes(g.id) ? 'selected' : ''}`}
                            onClick={() => handleGoal(g.id)}
                        >
                            <div className="goal-icon">{g.icon}</div>
                            <div>
                                <div className="goal-label">{g.label}</div>
                                <div className="goal-sub">{g.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pref-section">
                <div className="pref-title">Annual fee preference 💳</div>
                <div className="fee-row">
                    <div className={`fee-btn ${profile.feePreference === 'lifetime_free' ? 'selected' : ''}`} onClick={() => setFeePreference('lifetime_free')}>
                        <span className="fe">🆓</span>
                        <div className="ft">Lifetime Free</div>
                        <div className="fd">₹0 always</div>
                    </div>
                    <div className={`fee-btn ${profile.feePreference === 'low_fee' ? 'selected' : ''}`} onClick={() => setFeePreference('low_fee')}>
                        <span className="fe">💸</span>
                        <div className="ft">Low Fee</div>
                        <div className="fd">Below ₹1,000/yr</div>
                    </div>
                    <div className={`fee-btn ${profile.feePreference === 'dont_mind' ? 'selected' : ''}`} onClick={() => setFeePreference('dont_mind')}>
                        <span className="fe">👑</span>
                        <div className="ft">Premium</div>
                        <div className="fd">Best benefits</div>
                    </div>
                </div>
            </div>

            <button className="cta-btn" onClick={onNext}>Continue →</button>
        </div>
    );
}
