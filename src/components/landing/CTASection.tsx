import { Link } from 'react-router-dom';
import { trackCTAClick } from '../../services/analytics';

export default function CTASection() {
    return (
        <section className="cta-section">
            <div className="container">
                <h2 className="cta-h2">Ready to find your<br /><span className="accent">perfect card?</span></h2>
                <p className="cta-sub">Join thousands of Indians who found their ideal credit card with CardWise.</p>
                <div className="cta-actions">
                    <Link to="/app" className="btn-primary large" style={{ background: 'white', color: 'var(--navy)' }} onClick={() => trackCTAClick('cta_section')}>
                        ✦ Get My Recommendations
                    </Link>
                </div>
                <div className="cta-trust">
                    <div className="cta-trust-item">🔒 No data stored</div>
                    <div className="cta-trust-item">📧 No email required</div>
                    <div className="cta-trust-item">⚡ Results in 2 minutes</div>
                    <div className="cta-trust-item">₹0 Completely free</div>
                </div>
            </div>
        </section>
    );
}
