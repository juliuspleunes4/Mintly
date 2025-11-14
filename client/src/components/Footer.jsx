import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/favicon.png" alt="Mintly" />
          <span>Mintly</span>
        </div>
        
        <div className="footer-links">
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <span className="footer-separator">•</span>
          <a href="/terms" className="footer-link">Terms of Service</a>
        </div>
        
        <div className="footer-warning">
          <span className="beta-badge">BETA</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
