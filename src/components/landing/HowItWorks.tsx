import { Link } from 'react-router-dom';

export default function HowItWorks() {
    return (
        <section className="section" id="how-it-works">
            <div className="container">
                <div className="section-label">Simple Process</div>
                <h2 className="section-h2">From zero to your perfect card<br />in under 2 minutes</h2>
                <p className="section-sub">No lengthy forms. No sign up. Just smart questions that help our algorithm find exactly the right card for how you live.</p>

                <div className="how-grid">
                    <div className="how-card">
                        <div className="how-num">01</div>
                        <div className="how-icon">💼</div>
                        <div className="how-title">Tell us about you</div>
                        <p className="how-desc">Your occupation, monthly income, credit score range, and how many cards you already hold. Takes 30 seconds.</p>
                    </div>
                    <div className="how-card">
                        <div className="how-num">02</div>
                        <div className="how-icon">🛒</div>
                        <div className="how-title">Share your spending</div>
                        <p className="how-desc">Select spend ranges for groceries, dining, travel, fuel, bills, and more. No exact numbers needed — just rough estimates work great.</p>
                    </div>
                    <div className="how-card">
                        <div className="how-num">03</div>
                        <div className="how-icon">🎯</div>
                        <div className="how-title">Set your preferences</div>
                        <p className="how-desc">Pick your primary goal — cashback, rewards, travel perks. Tell us where you shop and what fee you're comfortable with.</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                    <Link to="/app" className="btn-primary large">Start Now — It's Free ✦</Link>
                    <p style={{ marginTop: '14px', fontSize: '13px', color: 'var(--text-3)' }}>No account needed · Results in under 2 minutes · Data never saved</p>
                </div>
            </div>
        </section>
    );
}
