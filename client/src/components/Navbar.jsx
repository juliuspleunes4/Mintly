import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <img src="/favicon.png" alt="Mintly" />
          <span>Mintly</span>
        </Link>

        <div className="navbar-links">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/mint" 
            className={`navbar-link ${isActive('/mint') ? 'active' : ''}`}
          >
            Mint
          </Link>
          <Link 
            to="/cli" 
            className={`navbar-link ${isActive('/cli') ? 'active' : ''}`}
          >
            CLI
          </Link>
          <a 
            href="https://github.com/juliuspleunes4/mintly" 
            target="_blank" 
            rel="noopener noreferrer"
            className="navbar-link navbar-link-github"
          >
            GitHub
            <span className="external-icon">↗</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
