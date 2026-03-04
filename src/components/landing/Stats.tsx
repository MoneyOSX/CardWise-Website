export default function Stats() {
    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-num">50<span>+</span></div>
                        <div className="stat-label">Credit cards in database</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-num">₹<span>49K</span></div>
                        <div className="stat-label">Avg. annual savings found</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-num">2<span>min</span></div>
                        <div className="stat-label">To get your top matches</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-num">0<span>₹</span></div>
                        <div className="stat-label">Cost to use. Always free.</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
