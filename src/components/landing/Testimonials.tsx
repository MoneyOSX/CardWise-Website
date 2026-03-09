export default function Testimonials() {
    return (
        <section className="section" id="testimonials">
            <div className="container">
                <div className="section-label">Testimonials</div>
                <h2 className="section-h2">What our users say</h2>
                <p className="section-sub">
                    Thousands of Indians have found their perfect credit card with CardWise. Here's what a few of them had to say.
                </p>

                <div className="testimonial-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-quote">
                            "I was paying ₹5,000 in annual fees for a card that barely gave cashback on groceries. CardWise recommended a zero-fee card that saves me ₹800 every month on BigBasket and Swiggy alone."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">A</div>
                            <div>
                                <div className="testimonial-name">Ananya Sharma</div>
                                <div className="testimonial-role">Product Manager, Bengaluru</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-quote">
                            "I travel twice a month for work and had no idea my spending qualified me for a premium lounge-access card with no joining fee. Found it through CardWise in under two minutes."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">R</div>
                            <div>
                                <div className="testimonial-name">Rohit Menon</div>
                                <div className="testimonial-role">Chartered Accountant, Mumbai</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-quote">
                            "Most recommendation sites ignore people without a salary slip. CardWise asked the right questions and matched me with a card I got approved for on the first try."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">P</div>
                            <div>
                                <div className="testimonial-name">Priya Krishnamurthy</div>
                                <div className="testimonial-role">Freelance Designer, Hyderabad</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
