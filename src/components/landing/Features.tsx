import { useState } from 'react';

export default function Features() {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: '🧮',
            title: 'Savings calculated for YOUR spend',
            desc: 'We compute actual rupee benefits based on your exact spending pattern — not generic averages.'
        },
        {
            icon: '✅',
            title: 'Approval chances shown upfront',
            desc: "Based on your income, credit score, and bank relationship — we tell you if you're likely to get approved before you apply."
        },
        {
            icon: '🇮🇳',
            title: 'India-first platform selection',
            desc: 'Amazon, Flipkart, Swiggy, Zomato, IRCTC, Nykaa — we know where Indians actually shop and optimize for that.'
        },
        {
            icon: '🔒',
            title: 'Zero data storage, ever',
            desc: 'Your financial info stays on your device. We never store, sell, or share any data. CardWise runs entirely client-side.'
        }
    ];

    return (
        <section className="features-section" id="features">
            <div className="container">
                <div className="section-label" style={{ color: 'rgba(255,255,255,0.4)' }}>Why CardWise</div>
                <h2 className="section-h2" style={{ color: 'white' }}>Not another comparison<br />website. Something better.</h2>

                <div className="features-grid">
                    <div className="feature-list">
                        {features.map((pkg, idx) => (
                            <div
                                key={idx}
                                className={`feature-item ${activeFeature === idx ? 'active' : ''}`}
                                onClick={() => setActiveFeature(idx)}
                            >
                                <div className="feature-icon-wrap">{pkg.icon}</div>
                                <div>
                                    <div className="feature-title">{pkg.title}</div>
                                    <div className="feature-desc">{pkg.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="feature-preview">
                        <div className="preview-window-header">
                            <div className="dot-r"></div>
                            <div className="dot-y"></div>
                            <div className="dot-g"></div>
                        </div>
                        <div className="preview-content-title">Why HDFC Millennia is #1 for you</div>

                        <div className="preview-card-demo">
                            <div className="preview-card-row">
                                <div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>HDFC BANK</div>
                                    <div className="preview-card-name">Millennia Credit Card</div>
                                </div>
                                <div className="preview-score-badge">71/100</div>
                            </div>
                            <div className="preview-why-list">
                                <div className="preview-why-item">
                                    <div className="check-icon">✓</div>
                                    5% cashback on Amazon & Flipkart (your top platforms)
                                </div>
                                <div className="preview-why-item">
                                    <div className="check-icon">✓</div>
                                    Pre-approved — you hold an HDFC salary account
                                </div>
                                <div className="preview-why-item">
                                    <div className="check-icon">✓</div>
                                    Fee waived at ₹1L annual spend — you easily qualify
                                </div>
                                <div className="preview-why-item">
                                    <div className="check-icon">✓</div>
                                    1% back on ₹20,000 "Everything Else" monthly spend
                                </div>
                            </div>
                            <div className="preview-savings-row">
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>Your estimated annual savings</div>
                                <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: "'Clash Display', sans-serif", color: '#10B981' }}>₹11,000</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
