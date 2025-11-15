import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Silk from '../components/Silk';
import Footer from '../components/Footer';
import './Home.css';

function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="home">
      <Silk
        speed={5}
        scale={1}
        color="#7000FA"
        noiseIntensity={1.5}
        rotation={0}
      />
      
      <Navbar />

      <div className="home-content">
        {/* Hero Section */}
        <motion.section 
          className="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img src="/favicon.png" alt="Mintly" className="hero-logo" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Create Solana Tokens <br />
            <span className="gradient-text">In Minutes</span>
          </motion.h1>
          
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            The easiest way to mint SPL tokens on Solana blockchain.
            <br />No coding required. Full transparency. Instant results.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/mint" className="btn btn-primary btn-large">
              Start Minting
            </Link>
            <a 
              href="https://github.com/juliuspleunes4/mintly" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary btn-large"
            >
              View on GitHub
            </a>
          </motion.div>
        </motion.section>

        {/* What is Token Minting Section */}
        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp}>What is Token Minting?</motion.h2>
          <motion.div className="content-card" variants={fadeInUp}>
            <p>
              Token minting is the process of creating new cryptocurrency tokens on a blockchain network. 
              On Solana, you can create <strong>SPL tokens</strong> (Solana Program Library tokens) - similar 
              to ERC-20 tokens on Ethereum.
            </p>
            <p>
              These tokens can represent anything: currencies, rewards, assets, voting rights, or digital collectibles. 
              With Mintly, you can create your own tokens with custom images, metadata, and supply - all through an 
              intuitive web interface.
            </p>
          </motion.div>
        </motion.section>

        {/* Why Solana Section */}
        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp}>Why Solana?</motion.h2>
          <motion.div className="features-grid" variants={stagger}>
            <motion.div className="feature-card" variants={fadeInUp}>
              <div className="feature-icon">⚡</div>
              <h3>Blazing Fast</h3>
              <p>65,000 transactions per second with 400ms block times</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeInUp}>
              <div className="feature-icon">💰</div>
              <h3>Low Costs</h3>
              <p>Transaction fees average $0.00025 - significantly cheaper than Ethereum</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeInUp}>
              <div className="feature-icon">🌍</div>
              <h3>Eco-Friendly</h3>
              <p>Proof of Stake consensus with minimal energy consumption</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeInUp}>
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Battle-tested blockchain with billions in value secured</p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp}>How It Works</motion.h2>
          <motion.div className="steps-container" variants={stagger}>
            <motion.div className="step" variants={fadeInUp}>
              <div className="step-number">1</div>
              <h3>Connect Your Wallet</h3>
              <p>Connect your Phantom or Solflare wallet with one click. We never see or store your private keys.</p>
            </motion.div>
            <motion.div className="step" variants={fadeInUp}>
              <div className="step-number">2</div>
              <h3>Fill Token Details</h3>
              <p>Add your token name, symbol, description, supply, and upload an image. Customize with optional attributes.</p>
            </motion.div>
            <motion.div className="step" variants={fadeInUp}>
              <div className="step-number">3</div>
              <h3>Pay & Mint</h3>
              <p>Pay 0.2 SOL (~€23.75) total (service fee + blockchain costs). Your metadata is uploaded to Arweave for permanent storage.</p>
            </motion.div>
            <motion.div className="step" variants={fadeInUp}>
              <div className="step-number">4</div>
              <h3>Receive Tokens</h3>
              <p>Tokens are minted directly to your wallet. View them on Solana Explorer and share with your community.</p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Costs Section */}
        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp}>Transparent Pricing</motion.h2>
          <motion.div className="pricing-grid" variants={stagger}>
            <motion.div className="pricing-card" variants={fadeInUp}>
              <div className="pricing-badge">Web Version</div>
              <div className="pricing-amount">0.2 SOL</div>
              <div className="pricing-subtitle">~€23.75</div>
              <ul className="pricing-features">
                <li><strong>0.1 SOL</strong> service fee</li>
                <li><strong>~0.1 SOL</strong> blockchain costs</li>
                <li>✅ Easy web interface</li>
                <li>✅ No coding required</li>
                <li>✅ Instant results</li>
                <li>✅ Support included</li>
              </ul>
              <Link to="/mint" className="btn btn-primary">Start Minting</Link>
            </motion.div>
            <motion.div className="pricing-card pricing-card-highlight" variants={fadeInUp}>
              <div className="pricing-badge pricing-badge-pro">CLI Version</div>
              <div className="pricing-amount">~0.1 SOL</div>
              <div className="pricing-subtitle">~€11.88</div>
              <ul className="pricing-features">
                <li><strong>No service fee</strong></li>
                <li><strong>~0.1 SOL</strong> blockchain costs only</li>
                <li>✅ Command-line interface</li>
                <li>✅ Full automation support</li>
                <li>✅ Batch operations</li>
                <li>✅ Open source</li>
              </ul>
              <Link to="/cli" className="btn btn-secondary">Learn More</Link>
            </motion.div>
          </motion.div>
          <motion.p className="pricing-note" variants={fadeInUp}>
            💡 All fees are non-refundable. Blockchain costs may vary based on network congestion.
          </motion.p>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp}>Frequently Asked Questions</motion.h2>
          <motion.div className="faq-container" variants={stagger}>
            <motion.div 
              className={`faq-item ${openFaq === 0 ? 'active' : ''}`} 
              variants={fadeInUp}
              onClick={() => toggleFaq(0)}
            >
              <h3>
                <span className="faq-question">
                  Why is there a service fee on the web version?
                </span>
                <span className="faq-toggle">{openFaq === 0 ? '−' : '+'}</span>
              </h3>
              {openFaq === 0 && (
                <p>The 0.1 SOL service fee covers the Irys/Arweave storage costs for your token's image and metadata. Because this is a serverless web application, we can't securely expose our funded wallet's private key to your browser. Instead, our backend server uses a pre-funded wallet to upload your data to Irys on your behalf. While the actual Irys cost is very small (~0.02-0.05 SOL), the service fee also covers hosting, maintenance, and the convenience of not having to run the CLI yourself. CLI users pay only the minimal Irys cost directly from their own wallet.</p>
              )}
            </motion.div>
            <motion.div 
              className={`faq-item ${openFaq === 1 ? 'active' : ''}`} 
              variants={fadeInUp}
              onClick={() => toggleFaq(1)}
            >
              <h3>
                <span className="faq-question">
                  Do I need coding experience?
                </span>
                <span className="faq-toggle">{openFaq === 1 ? '−' : '+'}</span>
              </h3>
              {openFaq === 1 && (
                <p>No! The web version requires zero coding knowledge. Just connect your wallet, fill out a form, and create your token. For developers, we also offer a CLI tool.</p>
              )}
            </motion.div>
            <motion.div 
              className={`faq-item ${openFaq === 2 ? 'active' : ''}`} 
              variants={fadeInUp}
              onClick={() => toggleFaq(2)}
            >
              <h3>
                <span className="faq-question">
                  Is my wallet safe?
                </span>
                <span className="faq-toggle">{openFaq === 2 ? '−' : '+'}</span>
              </h3>
              {openFaq === 2 && (
                <p>Absolutely. We never see or store your private keys. Mintly connects directly to your browser wallet (Phantom/Solflare), and all transactions are signed locally on your device.</p>
              )}
            </motion.div>
            <motion.div 
              className={`faq-item ${openFaq === 3 ? 'active' : ''}`} 
              variants={fadeInUp}
              onClick={() => toggleFaq(3)}
            >
              <h3>
                <span className="faq-question">
                  Where is my token metadata stored?
                </span>
                <span className="faq-toggle">{openFaq === 3 ? '−' : '+'}</span>
              </h3>
              {openFaq === 3 && (
                <p>Your token image and metadata are uploaded to Arweave via Irys, ensuring permanent, decentralized storage that can never be taken down or modified.</p>
              )}
            </motion.div>
            <motion.div 
              className={`faq-item ${openFaq === 4 ? 'active' : ''}`} 
              variants={fadeInUp}
              onClick={() => toggleFaq(4)}
            >
              <h3>
                <span className="faq-question">
                  Can I create tokens on devnet for testing?
                </span>
                <span className="faq-toggle">{openFaq === 4 ? '−' : '+'}</span>
              </h3>
              {openFaq === 4 && (
                <p>Currently, Mintly only supports mainnet to ensure real value transactions. For testing, use the CLI version with devnet configuration.</p>
              )}
            </motion.div>
            <motion.div 
              className={`faq-item ${openFaq === 5 ? 'active' : ''}`} 
              variants={fadeInUp}
              onClick={() => toggleFaq(5)}
            >
              <h3>
                <span className="faq-question">
                  What if my transaction fails?
                </span>
                <span className="faq-toggle">{openFaq === 5 ? '−' : '+'}</span>
              </h3>
              {openFaq === 5 && (
                <p>If a transaction fails, you'll see a clear error message. Fees are only charged for successful transactions. Our Terms of Service cover edge cases and liability.</p>
              )}
            </motion.div>
            <motion.div 
              className={`faq-item ${openFaq === 6 ? 'active' : ''}`} 
              variants={fadeInUp}
              onClick={() => toggleFaq(6)}
            >
              <h3>
                <span className="faq-question">
                  Can I mint more tokens later?
                </span>
                <span className="faq-toggle">{openFaq === 6 ? '−' : '+'}</span>
              </h3>
              {openFaq === 6 && (
                <p>Yes! You maintain full mint authority over your token. You can mint additional supply anytime using Solana tools or by creating another batch through Mintly.</p>
              )}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Open Source Section */}
        <motion.section 
          className="section section-opensource"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div className="opensource-card" variants={fadeInUp}>
            <div className="opensource-icon">🔓</div>
            <h2>100% Open Source</h2>
            <p>
              Mintly is fully open source and transparent. Every line of code is publicly available 
              on GitHub for you to review, audit, and contribute to. We believe in radical transparency 
              for web3 tools handling your assets.
            </p>
            <div className="opensource-links">
              <a 
                href="https://github.com/juliuspleunes4/mintly" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Web Version →
              </a>
              <a 
                href="https://github.com/juliuspleunes4/mintly-cli" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                CLI Version →
              </a>
            </div>
            <p className="opensource-note">
              ⭐ Star us on GitHub • 🐛 Report issues • 🤝 Contribute code
            </p>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="section section-cta"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2>Ready to Mint Your Token?</h2>
          <p>Join hundreds of creators launching tokens on Solana</p>
          <Link to="/mint" className="btn btn-primary btn-large">
            Get Started Now
          </Link>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
