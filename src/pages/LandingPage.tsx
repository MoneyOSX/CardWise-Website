import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import TrustBar from '../components/landing/TrustBar';
import Stats from '../components/landing/Stats';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import CardsPreview from '../components/landing/CardsPreview';
import CTASection from '../components/landing/CTASection';

export default function LandingPage() {
    return (
        <div id="landing">
            <Navbar />
            <Hero />
            <TrustBar />
            <Stats />
            <HowItWorks />
            <Features />
            <CardsPreview />
            <CTASection />
            <Footer />
        </div>
    );
}
