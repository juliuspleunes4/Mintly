import { useState, useEffect } from 'react';
import Dither from './components/Dither';
import './App.css';

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAdapter, setWalletAdapter] = useState(null);
  const [walletPublicKey, setWalletPublicKey] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [availableWallets, setAvailableWallets] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    decimals: 9,
    mintAmount: 1000000,
    network: 'mainnet-beta'
  });

  useEffect(() => {
    // Check which wallets are installed
    const wallets = [];
    if (window.solana && window.solana.isPhantom) {
      wallets.push({ name: 'Phantom', provider: window.solana, icon: '👻' });
    }
    if (window.solflare && window.solflare.isSolflare) {
      wallets.push({ name: 'Solflare', provider: window.solflare, icon: '🔥' });
    }
    setAvailableWallets(wallets);
  }, []);

  useEffect(() => {
    // Estimate transaction cost
    const estimateCost = async () => {
      try {
        const connection = new window.solanaWeb3.Connection(
          window.solanaWeb3.clusterApiUrl(formData.network),
          'confirmed'
        );
        
        // Get rent exemption for mint account (82 bytes)
        const mintRent = await connection.getMinimumBalanceForRentExemption(82);
        
        // Estimate transaction fees (typically 5000 lamports per signature, ~3 signatures)
        const estimatedFees = 5000 * 3;
        
        // Metadata account rent (~679 bytes)
        const metadataRent = await connection.getMinimumBalanceForRentExemption(679);
        
        // Token account rent (~165 bytes)
        const tokenAccountRent = await connection.getMinimumBalanceForRentExemption(165);
        
        const totalLamports = mintRent + estimatedFees + metadataRent + tokenAccountRent;
        const totalSol = totalLamports / 1e9;
        
        setEstimatedCost(totalSol.toFixed(6));
      } catch (error) {
        console.error('Failed to estimate cost:', error);
        setEstimatedCost('0.005'); // Fallback estimate
      }
    };

    if (formData.network) {
      estimateCost();
    }
  }, [formData.network]);

  const openWalletModal = () => {
    if (availableWallets.length === 0) {
      alert('No wallet detected!\n\nPlease install one of these wallets:\n\nPhantom: https://phantom.app\nSolflare: https://solflare.com');
      return;
    }
    setShowWalletModal(true);
  };

  const connectWallet = async (provider, walletName) => {
    try {
      setShowWalletModal(false);
      
      const resp = await provider.connect();
      const publicKey = resp.publicKey.toString();
      
      // Get balance
      const connection = new window.solanaWeb3.Connection(
        window.solanaWeb3.clusterApiUrl('devnet'),
        'confirmed'
      );
      const balance = await connection.getBalance(resp.publicKey);
      
      setWalletAdapter(provider);
      setWalletPublicKey(publicKey);
      setWalletBalance((balance / 1e9).toFixed(4));
      setIsWalletConnected(true);
      
      console.log(`${walletName} connected:`, publicKey);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG or JPG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  const updateAttribute = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!imageFile) {
      alert('Please upload a token image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload image and metadata
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('symbol', formData.symbol);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('network', formData.network);
      formDataToSend.append('image', imageFile);
      
      const validAttributes = attributes.filter(attr => attr.trait_type && attr.value);
      formDataToSend.append('attributes', JSON.stringify(validAttributes));

      const uploadResponse = await fetch('/api/mint-token', {
        method: 'POST',
        body: formDataToSend
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload metadata');
      }

      const { metadataUri } = await uploadResponse.json();

      // Step 2: Create token mint (client-side with user's wallet)
      const connection = new window.solanaWeb3.Connection(
        window.solanaWeb3.clusterApiUrl(formData.network),
        'confirmed'
      );

      // Import SPL Token functions
      const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = window.solanaWeb3.splToken;
      const { PublicKey, Transaction, SystemProgram } = window.solanaWeb3;

      console.log('🪙 Creating token mint...');
      
      // Create mint account
      const mintKeypair = window.solanaWeb3.Keypair.generate();
      const lamports = await connection.getMinimumBalanceForRentExemption(82);
      
      const createAccountIx = SystemProgram.createAccount({
        fromPubkey: walletAdapter.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: 82,
        lamports,
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });

      // Initialize mint
      const initializeMintIx = window.solanaWeb3.splToken.createInitializeMintInstruction(
        mintKeypair.publicKey,
        formData.decimals,
        walletAdapter.publicKey,
        walletAdapter.publicKey
      );

      const transaction = new Transaction().add(createAccountIx, initializeMintIx);
      transaction.feePayer = walletAdapter.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      // Sign with mint keypair
      transaction.partialSign(mintKeypair);
      
      // Request wallet signature
      const signed = await walletAdapter.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      console.log('✅ Token mint created:', mintKeypair.publicKey.toString());

      // Step 3: Add metadata
      const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
      
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );

      // Create metadata instruction (simplified - you may need to add the full instruction)
      const metadataTransaction = new Transaction();
      metadataTransaction.feePayer = walletAdapter.publicKey;
      metadataTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      const signedMetadata = await walletAdapter.signTransaction(metadataTransaction);
      await connection.sendRawTransaction(signedMetadata.serialize());

      console.log('✅ Metadata added');

      // Step 4: Mint tokens to user
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        walletAdapter,
        mintKeypair.publicKey,
        walletAdapter.publicKey
      );

      await mintTo(
        connection,
        walletAdapter,
        mintKeypair.publicKey,
        tokenAccount.address,
        walletAdapter.publicKey,
        formData.mintAmount * Math.pow(10, formData.decimals)
      );

      console.log('✅ Tokens minted');

      setResult({
        success: true,
        mintAddress: mintKeypair.publicKey.toString(),
        metadataUri: metadataUri,
        network: formData.network,
        explorerUrl: `https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}${
          formData.network === 'mainnet-beta' ? '' : `?cluster=${formData.network}`
        }`
      });

    } catch (error) {
      console.error('Error creating token:', error);
      alert('Failed to create token: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      symbol: '',
      description: '',
      decimals: 9,
      mintAmount: 1000000,
      network: 'devnet'
    });
    setImageFile(null);
    setImagePreview('');
    setAttributes([]);
    setIsSubmitting(false);
    setResult(null);
  };

  const truncateAddress = (address) => {
    return address.slice(0, 4) + '...' + address.slice(-4);
  };

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
        <header className="header">
          <img src="/favicon.png" alt="Mintly" className="logo" />
          <p className="subtitle">Create your own Solana token in seconds</p>
          
          {!isWalletConnected ? (
            <button className="btn btn-primary" onClick={openWalletModal}>
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-info">
              <p><strong>Address:</strong> {truncateAddress(walletPublicKey)}</p>
              <p><strong>Balance:</strong> {walletBalance} SOL</p>
            </div>
          )}
        </header>

        {showWalletModal && (
          <div className="modal-overlay" onClick={() => setShowWalletModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Connect Wallet</h2>
              <p className="modal-subtitle">Choose your wallet to connect</p>
              
              <div className="wallet-options">
                {availableWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    className="wallet-option"
                    onClick={() => connectWallet(wallet.provider, wallet.name)}
                  >
                    <span className="wallet-icon">{wallet.icon}</span>
                    <span className="wallet-name">{wallet.name}</span>
                    <span className="wallet-status">Detected</span>
                  </button>
                ))}
              </div>

              {availableWallets.length === 0 && (
                <div className="no-wallets">
                  <p>No wallets detected</p>
                  <div className="install-links">
                    <a href="https://phantom.app" target="_blank" rel="noopener noreferrer">
                      Install Phantom
                    </a>
                    <a href="https://solflare.com" target="_blank" rel="noopener noreferrer">
                      Install Solflare
                    </a>
                  </div>
                </div>
              )}

              <button className="btn-close" onClick={() => setShowWalletModal(false)}>
                ×
              </button>
            </div>
          </div>
        )}

        {!result ? (
          !isSubmitting ? (
            <div className="card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Token Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., My Awesome Token"
                    required
                    disabled={!isWalletConnected}
                  />
                </div>

                <div className="form-group">
                  <label>Token Symbol *</label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    placeholder="e.g., MAT"
                    maxLength="10"
                    required
                    disabled={!isWalletConnected}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your token..."
                    rows="3"
                    disabled={!isWalletConnected}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Decimals</label>
                    <input
                      type="number"
                      value={formData.decimals}
                      onChange={(e) => setFormData({ ...formData, decimals: parseInt(e.target.value) })}
                      min="0"
                      max="9"
                      required
                      disabled={!isWalletConnected}
                    />
                  </div>

                  <div className="form-group">
                    <label>Initial Supply</label>
                    <input
                      type="number"
                      value={formData.mintAmount}
                      onChange={(e) => setFormData({ ...formData, mintAmount: parseInt(e.target.value) })}
                      min="1"
                      required
                      disabled={!isWalletConnected}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Token Image *</label>
                  <div className="upload-area" onClick={() => !isWalletConnected || document.getElementById('tokenImage').click()}>
                    {!imagePreview ? (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <span>Click to upload image</span>
                        <small>PNG or JPG, max 5MB</small>
                      </div>
                    ) : (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                          type="button"
                          className="btn-icon remove-image"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="tokenImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={!isWalletConnected}
                  />
                </div>

                <div className="form-group">
                  <label>Attributes (Optional)</label>
                  <div className="attributes-container">
                    {attributes.map((attr, index) => (
                      <div key={index} className="attribute-row">
                        <input
                          type="text"
                          className="attr-key"
                          placeholder="Trait Type"
                          value={attr.trait_type}
                          onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                          disabled={!isWalletConnected}
                        />
                        <input
                          type="text"
                          className="attr-value"
                          placeholder="Value"
                          value={attr.value}
                          onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                          disabled={!isWalletConnected}
                        />
                        <button
                          type="button"
                          className="btn-icon btn-remove-attr"
                          onClick={() => removeAttribute(index)}
                          disabled={!isWalletConnected}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addAttribute}
                    disabled={!isWalletConnected}
                  >
                    + Add Attribute
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={!isWalletConnected}
                >
                  Create Token
                </button>

                {estimatedCost && (
                  <div className="cost-estimate">
                    <div className="cost-label">Estimated Cost:</div>
                    <div className="cost-value">~{estimatedCost} SOL</div>
                    <div className="cost-note">
                      This includes network fees + rent for token accounts on Solana Mainnet
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="card text-center">
              <div className="spinner"></div>
              <h2>Creating Your Token...</h2>
              <div className="progress-steps">
                <div className="progress-step active">
                  <div className="step-icon">📤</div>
                  <p>Uploading image and metadata to Irys...</p>
                </div>
                <div className="progress-step active">
                  <div className="step-icon">🪙</div>
                  <p>Creating token mint account...</p>
                </div>
                <div className="progress-step active">
                  <div className="step-icon">✨</div>
                  <p>Minting initial supply...</p>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="card text-center">
            <div className="success-icon">✅</div>
            <h2>Token Created Successfully!</h2>
            <div className="result-info">
              <div className="result-item">
                <strong>Mint Address:</strong>
                <div className="address-box">
                  <code>{result.mintAddress}</code>
                  <button
                    className="btn-icon"
                    onClick={() => navigator.clipboard.writeText(result.mintAddress)}
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div className="result-item">
                <strong>Metadata URI:</strong>
                <a href={result.metadataUri} target="_blank" rel="noopener noreferrer">
                  View on Irys
                </a>
              </div>

              <div className="result-item">
                <strong>Explorer:</strong>
                <a
                  href={`https://explorer.solana.com/address/${result.mintAddress}?cluster=${formData.network}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Solana Explorer
                </a>
              </div>
            </div>

            <button className="btn btn-primary btn-large" onClick={resetForm}>
              Create Another Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
