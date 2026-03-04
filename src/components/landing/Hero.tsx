import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-grid">
                    <div className="hero-left">
                        <div className="hero-badge">
                            <span className="dot"></span>
                            🇮🇳 Built for the Indian market
                        </div>
                        <h1 className="hero-h1">
                            The <span className="accent">smartest</span> way to pick your credit card
                        </h1>
                        <p className="hero-sub">
                            Stop guessing. Tell us how you spend and what you value — we'll match you to the exact card that maximizes your rewards. Free, instant, no sign-up.
                        </p>
                        <div className="hero-actions">
                            <Link to="/app" className="btn-primary large">
                                ✦ Find My Perfect Card
                            </Link>
                            <a href="#how-it-works" className="btn-ghost">See how it works</a>
                        </div>
                        <div className="hero-trust">
                            <div className="trust-item"><span className="icon">🔒</span> No data stored</div>
                            <div className="trust-item"><span className="icon">⚡</span> 2 minutes</div>
                            <div className="trust-item"><span className="icon">💳</span> 50+ cards analyzed</div>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div style={{ position: 'relative', padding: '40px 60px' }}>
                            <div className="float-badge left">
                                <div className="fb-icon">🎉</div>
                                <div>
                                    <div className="fb-text">₹49,000 saved</div>
                                    <div className="fb-sub">Annual estimated benefit</div>
                                </div>
                            </div>
                            <div className="float-badge right">
                                <div className="fb-icon">✅</div>
                                <div>
                                    <div className="fb-text">HIGH Approval</div>
                                    <div className="fb-sub">Based on your profile</div>
                                </div>
                            </div>

                            <div className="phone-mockup">
                                <div className="phone-screen">
                                    <div className="phone-inner">
                                        <div className="phone-header">Your Top 5 Matches</div>
                                        <div className="phone-title">Personalized for you ✦</div>

                                        <div className="phone-card">
                                            <div className="phone-card-top">
                                                <div>
                                                    <div className="phone-bank">HDFC Bank</div>
                                                    <div className="phone-card-name">Millennia Credit Card</div>
                                                </div>
                                                <div className="match-ring">
                                                    <div className="match-num">71</div>
                                                </div>
                                            </div>
                                            <div className="phone-metrics">
                                                <div className="phone-metric">
                                                    <div className="phone-metric-val green">₹12K</div>
                                                    <div className="phone-metric-lbl">Annual Benefit</div>
                                                </div>
                                                <div className="phone-metric">
                                                    <div className="phone-metric-val">₹1K</div>
                                                    <div className="phone-metric-lbl">Annual Fee</div>
                                                </div>
                                                <div className="phone-metric">
                                                    <div className="phone-metric-val green">₹11K</div>
                                                    <div className="phone-metric-lbl">Net Savings</div>
                                                </div>
                                            </div>
                                            <div className="phone-tags">
                                                <span className="phone-tag green">HIGH Approval</span>
                                                <span className="phone-tag">5% Amazon CB</span>
                                                <span className="phone-tag">Swiggy 5%</span>
                                            </div>
                                            <button className="phone-apply">Apply Now →</button>
                                        </div>

                                        <div className="phone-card" style={{ opacity: 0.5, transform: 'scale(0.97)' }}>
                                            <div className="phone-card-top">
                                                <div>
                                                    <div className="phone-bank">SBI Card</div>
                                                    <div className="phone-card-name">SimplyCLICK</div>
                                                </div>
                                                <div className="match-ring" style={{ background: 'conic-gradient(#10B981 65%, #E2E8F4 65%)' }}>
                                                    <div className="match-num" style={{ color: '#10B981' }}>65</div>
                                                </div>
                                            </div>
                                            <div className="phone-tags">
                                                <span className="phone-tag green">LIFETIME FREE</span>
                                                <span className="phone-tag">10X Amazon Points</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
