export default function CardsPreview() {
    return (
        <section className="cards-preview" id="cards">
            <div className="container">
                <div className="section-label">Top Cards</div>
                <h2 className="section-h2">50+ cards. One perfect match.</h2>
                <p className="section-sub">From lifetime-free entry cards to premium travel cards — we cover the entire Indian market.</p>
            </div>

            <div className="cards-scroll" style={{ paddingLeft: 'calc((100% - 1160px)/2 + 40px)' }}>
                <div className="card-preview-item">
                    <div className="card-preview-visual" style={{ background: 'linear-gradient(135deg,#1a237e,#3F51B5)' }}>💳</div>
                    <div className="card-preview-bank">HDFC Bank</div>
                    <div className="card-preview-name">Millennia Credit Card</div>
                    <div className="card-preview-stats">
                        <div className="cps-item"><div className="cps-val green">₹12K</div><div className="cps-label">Annual Benefit</div></div>
                        <div className="cps-item"><div className="cps-val">₹1,000</div><div className="cps-label">Annual Fee</div></div>
                    </div>
                </div>
                <div className="card-preview-item">
                    <div className="card-preview-visual" style={{ background: 'linear-gradient(135deg,#1B4332,#2D6A4F)' }}>💳</div>
                    <div className="card-preview-bank">SBI Card</div>
                    <div className="card-preview-name">SimplyCLICK</div>
                    <div className="card-preview-stats">
                        <div className="cps-item"><div className="cps-val green">₹7.2K</div><div className="cps-label">Annual Benefit</div></div>
                        <div className="cps-item"><div className="cps-val">FREE</div><div className="cps-label">Annual Fee</div></div>
                    </div>
                </div>
                <div className="card-preview-item">
                    <div className="card-preview-visual" style={{ background: 'linear-gradient(135deg,#7B1818,#C62828)' }}>💳</div>
                    <div className="card-preview-bank">Axis Bank</div>
                    <div className="card-preview-name">ACE Credit Card</div>
                    <div className="card-preview-stats">
                        <div className="cps-item"><div className="cps-val green">₹9K</div><div className="cps-label">Annual Benefit</div></div>
                        <div className="cps-item"><div className="cps-val">FREE</div><div className="cps-label">Annual Fee</div></div>
                    </div>
                </div>
                <div className="card-preview-item">
                    <div className="card-preview-visual" style={{ background: 'linear-gradient(135deg,#4A148C,#7B1FA2)' }}>💳</div>
                    <div className="card-preview-bank">ICICI Bank</div>
                    <div className="card-preview-name">Amazon Pay ICICI</div>
                    <div className="card-preview-stats">
                        <div className="cps-item"><div className="cps-val green">₹8.4K</div><div className="cps-label">Annual Benefit</div></div>
                        <div className="cps-item"><div className="cps-val">FREE</div><div className="cps-label">Annual Fee</div></div>
                    </div>
                </div>
                <div className="card-preview-item">
                    <div className="card-preview-visual" style={{ background: 'linear-gradient(135deg,#0D47A1,#1565C0)' }}>💳</div>
                    <div className="card-preview-bank">Kotak</div>
                    <div className="card-preview-name">811 Dream Different</div>
                    <div className="card-preview-stats">
                        <div className="cps-item"><div className="cps-val green">₹5K</div><div className="cps-label">Annual Benefit</div></div>
                        <div className="cps-item"><div className="cps-val">FREE</div><div className="cps-label">Annual Fee</div></div>
                    </div>
                </div>
                <div className="card-preview-item">
                    <div className="card-preview-visual" style={{ background: 'linear-gradient(135deg,#1A237E,#283593)' }}>💳</div>
                    <div className="card-preview-bank">Yes Bank</div>
                    <div className="card-preview-name">Prosperity Rewards Plus</div>
                    <div className="card-preview-stats">
                        <div className="cps-item"><div className="cps-val green">₹12K</div><div className="cps-label">Annual Benefit</div></div>
                        <div className="cps-item"><div className="cps-val">₹2,499</div><div className="cps-label">Annual Fee</div></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
