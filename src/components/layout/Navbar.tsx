import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../shared/Logo';
import { trackCTAClick } from '../../services/analytics';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu on navigation
    useEffect(() => {
        setIsMenuOpen(false);
        // Ensure body scroll is restored when navigating
        document.body.style.overflow = '';
    }, [location.pathname, location.hash]);

    const toggleMenu = () => {
        const nextState = !isMenuOpen;
        setIsMenuOpen(nextState);
        // Prevent background scrolling when menu is open
        document.body.style.overflow = nextState ? 'hidden' : '';
    };

    const NavLinks = ({ mobile = false }) => (
        <>
            <li><a href="#how-it-works" onClick={() => mobile && setIsMenuOpen(false)}>How it works</a></li>
            <li><a href="#features" onClick={() => mobile && setIsMenuOpen(false)}>Why CardWise</a></li>
            <li><a href="#cards" onClick={() => mobile && setIsMenuOpen(false)}>Top Cards</a></li>
            {mobile && (
                <li>
                    <Link
                        to="/app"
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => {
                            setIsMenuOpen(false);
                            trackCTAClick('navbar-mobile');
                        }}
                    >
                        Find My Card →
                    </Link>
                </li>
            )}
        </>
    );

    return (
        <nav className={isMenuOpen ? 'menu-open' : ''}>
            <div className="container nav-inner">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <Logo />
                </Link>

                {/* Desktop Links */}
                <ul className="nav-links desktop-only">
                    <NavLinks />
                </ul>

                <div className="nav-cta">
                    <Link to="/app" className="btn-primary desktop-only" onClick={() => trackCTAClick('navbar')}>Find My Card →</Link>
                    <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Outside nav-inner to escape containing block constraints */}
            <ul className={`nav-links mobile-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
                <NavLinks mobile={true} />
            </ul>
        </nav>
    );
}
