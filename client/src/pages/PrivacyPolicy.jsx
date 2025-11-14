import { Link } from 'react-router-dom';
import Dither from '../components/Dither';
import Footer from '../components/Footer';
import '../App.css';

function PrivacyPolicy() {
  return (
    <div className="app">
      <Dither
        waveColor={[0.4, 0.2, 0.6]}
        waveSpeed={0.05}
        waveFrequency={3}
        waveAmplitude={0.3}
        colorNum={4}
        pixelSize={2}
        enableMouseInteraction={false}
        mouseRadius={1}
      />
      <div className="container">
        <div className="card">
          <Link to="/" className="back-link">← Back to Home</Link>
          
          <div className="logo-container">
            <img src="/favicon.png" alt="Mintly" className="logo" />
          </div>

          <h1>Privacy Policy</h1>
          <p className="text-muted">Last Updated: November 14, 2025</p>

          <div className="legal-content">
            <h2>1. Information We Collect</h2>
            <p>
              Mintly is a decentralized application. We do not collect, store, or process any personal information. 
              All transactions occur directly between your wallet and the Solana blockchain.
            </p>

            <h2>2. Wallet Connection</h2>
            <p>
              When you connect your wallet (Phantom, Solflare, etc.), we only access your public wallet address 
              to facilitate blockchain transactions. We never have access to your private keys or seed phrases.
            </p>

            <h2>3. Transaction Data</h2>
            <p>
              All token creation transactions are recorded on the Solana blockchain, which is publicly accessible. 
              This includes:
            </p>
            <ul>
              <li>Your wallet address</li>
              <li>Token metadata (name, symbol, image)</li>
              <li>Transaction signatures and timestamps</li>
            </ul>

            <h2>4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Irys/Arweave</strong> - For permanent storage of token images and metadata</li>
              <li><strong>Solana RPC Endpoints</strong> - For blockchain interactions</li>
              <li><strong>Vercel</strong> - For hosting the application</li>
            </ul>

            <h2>5. Cookies and Tracking</h2>
            <p>
              We do not use cookies or tracking technologies. The application runs entirely in your browser 
              without analytics or monitoring.
            </p>

            <h2>6. Data Security</h2>
            <p>
              As a decentralized application, all sensitive operations occur client-side in your browser. 
              We do not store any user data on our servers.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              Since we don't collect personal data, there is no data to request, modify, or delete. 
              All blockchain data is immutable and permanently recorded on Solana.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page 
              with an updated "Last Updated" date.
            </p>

            <h2>9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us through our GitHub repository 
              or official social media channels.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
