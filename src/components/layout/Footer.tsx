import { Link } from 'react-router-dom';
import Logo from '../shared/Logo';

export default function Footer() {
    return (
        <footer>
            <div className="container footer-inner">
                <div>
                    <Logo textColor="white" style={{ marginBottom: '10px' }} />
                    <div className="footer-note">
                        CardWise is an independent recommendation tool. We are not affiliated with any bank. Card details may change — always verify on the bank's official website before applying.
                    </div>
                </div>
                <div className="footer-links">
                    <Link to="/">Privacy Policy</Link>
                    <Link to="/">Disclaimer</Link>
                    <Link to="/">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
