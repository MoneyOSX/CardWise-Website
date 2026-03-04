import { Link } from 'react-router-dom';
import Logo from '../shared/Logo';

export default function Navbar() {
    return (
        <nav>
            <div className="container nav-inner">
                <Link to="/">
                    <Logo />
                </Link>
                <ul className="nav-links" id="navLinks">
                    <li><a href="#how-it-works">How it works</a></li>
                    <li><a href="#features">Why CardWise</a></li>
                    <li><a href="#cards">Top Cards</a></li>
                </ul>
                <div className="nav-cta">
                    <button className="btn-ghost" onClick={() => window.scrollTo({ top: 0 })}>Sign In</button>
                    <Link to="/app" className="btn-primary">Find My Card →</Link>
                </div>
            </div>
        </nav>
    );
}
