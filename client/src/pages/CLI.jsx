import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Silk from '../components/Silk';
import Footer from '../components/Footer';
import './CLI.css';

function CLI() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="cli-page">
      <Silk
        speed={5}
        scale={1}
        color="#7000FA"
        noiseIntensity={1.5}
        rotation={0}
      />
      
      <Navbar />

      <div className="cli-content">
        <motion.section 
          className="cli-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="cli-icon">⌨️</div>
          <h1>Mintly CLI</h1>
          <p className="cli-subtitle">
            Command-line interface for developers who prefer automation and lower costs
          </p>
        </motion.section>

        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="content-card">
            <h2>What is Mintly CLI?</h2>
            <p>
              Mintly CLI is a command-line tool for creating Solana SPL tokens without the web interface. 
              Perfect for developers who want to automate token creation, integrate minting into scripts, 
              or batch-create multiple tokens.
            </p>
            <p>
              Unlike the web version, CLI users <strong>don't pay the 0.1 SOL service fee</strong> - you only 
              pay the blockchain costs (~0.1 SOL or €11.88). This makes it significantly cheaper for high-volume use cases.
            </p>
          </div>
        </motion.section>

        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Key Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Lower Cost</h3>
              <p>No service fee - only pay ~0.1 SOL (€11.88) blockchain costs</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Automation</h3>
              <p>Script token creation for batch operations</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔧</div>
              <h3>Full Control</h3>
              <p>Configure every aspect via JSON files</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌐</div>
              <h3>Devnet Support</h3>
              <p>Test on devnet before mainnet deployment</p>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Installation</h2>
          <div className="code-section">
            <div className="code-block">
              <div className="code-header">
                <span>Bash</span>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText('git clone https://github.com/juliuspleunes4/mintly-cli.git\ncd mintly-cli\nnpm install')}>
                  Copy
                </button>
              </div>
              <pre><code>{`git clone https://github.com/juliuspleunes4/mintly-cli.git
cd mintly-cli
npm install`}</code></pre>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Quick Start</h2>
          <div className="steps-cli">
            <div className="step-cli">
              <div className="step-cli-number">1</div>
              <div className="step-cli-content">
                <h3>Configure Token Metadata</h3>
                <p>Edit <code>src/token-metadata.json</code> with your token details:</p>
                <div className="code-block">
                  <pre><code>{`{
  "name": "My Token",
  "symbol": "MTK",
  "description": "My awesome token",
  "decimals": 9,
  "mintAmount": 1000000,
  "network": "mainnet-beta"
}`}</code></pre>
                </div>
              </div>
            </div>

            <div className="step-cli">
              <div className="step-cli-number">2</div>
              <div className="step-cli-content">
                <h3>Add Token Image</h3>
                <p>Place your token image at <code>src/image.png</code> (512x512px recommended)</p>
              </div>
            </div>

            <div className="step-cli">
              <div className="step-cli-number">3</div>
              <div className="step-cli-content">
                <h3>Run Mint Command</h3>
                <div className="code-block">
                  <pre><code>npm run mint</code></pre>
                </div>
                <p>This will upload metadata to Arweave and mint your token on Solana.</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Available Commands</h2>
          <div className="commands-table">
            <div className="command-row">
              <code>npm run mint</code>
              <span>Create and mint a new SPL token</span>
            </div>
            <div className="command-row">
              <code>npm run upload</code>
              <span>Upload image and metadata only</span>
            </div>
            <div className="command-row">
              <code>npm run convert-key</code>
              <span>Convert base58 private key to wallet.json</span>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Cost Comparison</h2>
          <div className="comparison-grid">
            <div className="comparison-card">
              <h3>🌐 Web Version</h3>
              <div className="comparison-price">0.2 SOL <span style={{fontSize: '0.7em', opacity: 0.8}}>(€23.75)</span></div>
              <ul>
                <li>0.1 SOL (€11.88) service fee</li>
                <li>~0.1 SOL (€11.88) blockchain costs</li>
                <li>Easy web interface</li>
                <li>No setup required</li>
              </ul>
            </div>
            <div className="comparison-card comparison-card-highlight">
              <div className="comparison-badge">50% Cheaper</div>
              <h3>⌨️ CLI Version</h3>
              <div className="comparison-price">~0.1 SOL <span style={{fontSize: '0.7em', opacity: 0.8}}>(€11.88)</span></div>
              <ul>
                <li><strong>No service fee</strong></li>
                <li>~0.1 SOL (€11.88) blockchain costs only</li>
                <li>Command-line interface</li>
                <li>Requires Node.js setup</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="section section-opensource"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="opensource-card">
            <div className="opensource-icon">🔓</div>
            <h2>100% Open Source</h2>
            <p>
              Mintly CLI is completely open source. Review the code, contribute improvements, 
              or fork it for your own use. We believe in transparency for tools handling your crypto assets.
            </p>
            <div className="opensource-links">
              <a 
                href="https://github.com/juliuspleunes4/mintly-cli" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary btn-large"
              >
                View on GitHub →
              </a>
            </div>
            <p className="opensource-note">
              ⭐ Star the repo • 🐛 Report issues • 🤝 Contribute code
            </p>
          </div>
        </motion.section>

        <motion.section 
          className="section section-requirements"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Requirements</h2>
          <div className="requirements-list">
            <div className="requirement-item">
              <span className="requirement-icon">✅</span>
              <div>
                <strong>Node.js</strong>
                <p>Version 18 or higher</p>
              </div>
            </div>
            <div className="requirement-item">
              <span className="requirement-icon">✅</span>
              <div>
                <strong>Solana Wallet</strong>
                <p>Funded wallet with at least 0.1 SOL</p>
              </div>
            </div>
            <div className="requirement-item">
              <span className="requirement-icon">✅</span>
              <div>
                <strong>Command Line</strong>
                <p>Basic terminal/command line knowledge</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="section section-cta"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Prefer a Web Interface?</h2>
          <p>No coding required - create tokens in minutes</p>
          <a href="/mint" className="btn btn-secondary btn-large">
            Try Web Version
          </a>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}

export default CLI;
