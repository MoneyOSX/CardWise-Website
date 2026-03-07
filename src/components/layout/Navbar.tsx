import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../shared/Logo';
import { trackCTAClick } from '../../services/analytics';

interface NavLinksProps {
    mobile?: boolean;
    onClose: () => void;
}

function NavLinks({ mobile = false, onClose }: NavLinksProps) {
    return (
        <>
            <li><a href="#how-it-works" onClick={() => mobile && onClose()}>How it works</a></li>
            <li><a href="#features" onClick={() => mobile && onClose()}>Why CardWise</a></li>
            <li><a href="#cards" onClick={() => mobile && onClose()}>Top Cards</a></li>
            {mobile && (
                <li>
                    <Link
                        to="/app"
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => {
                            onClose();
                            trackCTAClick('navbar-mobile');
                        }}
                    >
                        Find My Card →
                    </Link>
                </li>
            )}
        </>
    );
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const [prevLocationKey, setPrevLocationKey] = useState(location.key);

    // Close menu when route changes (derived state during render, React-recommended pattern)
    if (prevLocationKey !== location.key) {
        setPrevLocationKey(location.key);
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }

    // Sync body scroll lock with menu state (external DOM system sync — correct use of effect)
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const closeMenu = () => setIsMenuOpen(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <nav className={isMenuOpen ? 'menu-open' : ''}>
            <div className="container nav-inner">
                <Link to="/" onClick={closeMenu}>
                    <Logo />
                </Link>

                {/* Desktop Links */}
                <ul className="nav-links desktop-only">
                    <NavLinks onClose={closeMenu} />
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
                <NavLinks mobile={true} onClose={closeMenu} />
            </ul>
        </nav>
    );
}
