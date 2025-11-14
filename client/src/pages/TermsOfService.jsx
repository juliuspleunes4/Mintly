import { Link } from 'react-router-dom';
import Dither from '../components/Dither';
import Footer from '../components/Footer';
import '../App.css';

function TermsOfService() {
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

          <h1>Terms of Service</h1>
          <p className="text-muted">Last Updated: November 14, 2025</p>

          <div className="legal-content">
            <div className="warning-box">
              <h3>⚠️ IMPORTANT DISCLAIMER</h3>
              <p>
                <strong>Mintly is currently in EARLY DEVELOPMENT and BETA TESTING phase.</strong>
              </p>
              <p>
                By using this service, you acknowledge and accept that:
              </p>
              <ul>
                <li>The platform may contain bugs or unexpected behavior</li>
                <li>Token creation may fail without refund of the service fee</li>
                <li>You may lose SOL paid for service fees and blockchain costs</li>
                <li>Created tokens may not function as expected</li>
                <li>Metadata or images may not be stored correctly</li>
                <li>We provide NO WARRANTY or guarantee of service availability</li>
              </ul>
            </div>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Mintly ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Mintly is a decentralized token creation platform on the Solana blockchain. The Service allows 
              users to create SPL tokens with metadata through a web interface.
            </p>

            <h2>3. Service Fees</h2>
            <p>The current fee structure is:</p>
            <ul>
              <li><strong>Total Cost: 0.2 SOL</strong></li>
              <li>Service Fee: 0.1 SOL (paid to Mintly)</li>
              <li>Blockchain Costs: ~0.1 SOL (rent, storage, transaction fees)</li>
            </ul>
            <p>
              <strong>All fees are NON-REFUNDABLE</strong>, even if token creation fails or encounters errors.
            </p>

            <h2>4. No Liability for Loss</h2>
            <p>
              <strong>WE ARE NOT RESPONSIBLE FOR:</strong>
            </p>
            <ul>
              <li>Loss of SOL due to failed transactions</li>
              <li>Loss of SOL due to user error (wrong network, insufficient balance, etc.)</li>
              <li>Failure to create tokens due to blockchain issues</li>
              <li>Loss or corruption of token metadata</li>
              <li>Loss of access to created tokens</li>
              <li>Price volatility of SOL or created tokens</li>
              <li>Any financial losses whatsoever</li>
            </ul>

            <h2>5. User Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul>
              <li>Securing your wallet and private keys</li>
              <li>Verifying all transaction details before approval</li>
              <li>Ensuring sufficient SOL balance (minimum 0.3 SOL recommended)</li>
              <li>Understanding Solana blockchain technology</li>
              <li>Complying with all applicable laws and regulations</li>
              <li>The content and legality of tokens you create</li>
            </ul>

            <h2>6. Prohibited Uses</h2>
            <p>You may NOT use Mintly to:</p>
            <ul>
              <li>Create tokens for illegal purposes</li>
              <li>Violate intellectual property rights</li>
              <li>Create scam or fraudulent tokens</li>
              <li>Impersonate other projects or people</li>
              <li>Upload offensive, illegal, or harmful content</li>
              <li>Attempt to exploit or hack the Service</li>
            </ul>

            <h2>7. Beta Testing Phase</h2>
            <p>
              As an early-stage platform, Mintly is provided "AS IS" without warranties of any kind. 
              The Service may be modified, suspended, or discontinued at any time without notice.
            </p>

            <h2>8. Blockchain Risks</h2>
            <p>You acknowledge that blockchain technology involves inherent risks including:</p>
            <ul>
              <li>Transaction failures and reverts</li>
              <li>Network congestion and high fees</li>
              <li>Smart contract vulnerabilities</li>
              <li>Irreversible transactions</li>
              <li>Regulatory uncertainty</li>
            </ul>

            <h2>9. No Investment Advice</h2>
            <p>
              Mintly does not provide financial, investment, or legal advice. Creating tokens does not 
              guarantee value or marketability. Cryptocurrency investments are highly speculative and risky.
            </p>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Mintly, its operators, and affiliates from any claims, 
              damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, MINTLY SHALL NOT BE LIABLE FOR ANY DIRECT, 
              INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.</strong>
            </p>

            <h2>12. Third-Party Services</h2>
            <p>
              The Service integrates with third-party platforms (Solana, Irys, wallet providers). 
              We are not responsible for the performance or availability of these services.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the Service 
              after changes constitutes acceptance of the new Terms.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable international 
              laws regarding decentralized services.
            </p>

            <h2>15. Contact</h2>
            <p>
              For questions about these Terms, please contact us through our GitHub repository at 
              github.com/juliuspleunes4/Mintly-CLI
            </p>

            <div className="warning-box">
              <p>
                <strong>By using Mintly, you acknowledge that you have read, understood, and agree to 
                these Terms of Service, including all disclaimers and limitations of liability.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsOfService;
