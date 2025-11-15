import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Silk from '../components/Silk';
import Footer from '../components/Footer';
import '../App.css';

function NotFound() {
  return (
    <div className="app">
      <Navbar />
      <Silk
        speed={5}
        scale={1}
        color="#7000FA"
        noiseIntensity={1.5}
        rotation={0}
      />
      <div className="container">
        <div className="card text-center">
          <div className="logo-container">
            <img src="/favicon.png" alt="Mintly" className="logo" />
          </div>

          <div className="error-404">
            <h1 style={{ fontSize: '6rem', margin: '0', color: '#663399' }}>404</h1>
            <h2>Page Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Link to="/" className="btn btn-primary btn-large">
            Go Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NotFound;
