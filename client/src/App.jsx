import { useState, useEffect } from 'react';
import Dither from './components/Dither';
import Footer from './components/Footer';
import './App.css';
import { createCreateMetadataAccountV3Instruction } from '@metaplex-foundation/mpl-token-metadata';

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
    console.log('🔍 Checking for installed wallets...');
    const wallets = [];
    if (window.solana && window.solana.isPhantom) {
      console.log('✅ Phantom wallet detected');
      wallets.push({ name: 'Phantom', provider: window.solana, icon: '👻' });
    }
    if (window.solflare && window.solflare.isSolflare) {
      console.log('✅ Solflare wallet detected');
      wallets.push({ name: 'Solflare', provider: window.solflare, icon: '🔥' });
    }
    console.log(`📦 Found ${wallets.length} wallet(s):`, wallets.map(w => w.name).join(', '));
    setAvailableWallets(wallets);
  }, []);

  useEffect(() => {
    console.log('💰 Setting estimated cost...');
    // Service fee: 0.1 SOL
    // Irys storage (image + metadata): ~0.02-0.05 SOL (paid from our wallet)
    // Mint account rent: ~0.00144 SOL
    // Metadata account rent: ~0.00153 SOL  
    // Token account rent: ~0.00203 SOL
    // Transaction fees: ~0.00015 SOL per tx (3-4 transactions)
    // Total: 0.2 SOL (0.1 service fee + 0.1 blockchain costs)
    setEstimatedCost('0.2');
    console.log('✅ Estimated cost set to 0.2 SOL (0.1 service fee + 0.1 blockchain costs)');
  }, []);

  const openWalletModal = () => {
    console.log('🔓 Opening wallet modal...');
    if (availableWallets.length === 0) {
      console.warn('⚠️ No wallets detected');
      alert('No wallet detected!\n\nPlease install one of these wallets:\n\nPhantom: https://phantom.app\nSolflare: https://solflare.com');
      return;
    }
    console.log('✅ Opening modal with', availableWallets.length, 'wallet(s)');
    setShowWalletModal(true);
  };

  const connectWallet = async (provider, walletName) => {
    try {
      console.log(`🔌 Attempting to connect ${walletName}...`);
      setShowWalletModal(false);
      
      // Check if already connecting
      if (provider.isConnected) {
        const publicKey = provider.publicKey.toString();
        console.log(`✅ ${walletName} already connected:`, publicKey);
        
        setWalletAdapter(provider);
        setWalletPublicKey(publicKey);
        setWalletBalance('-.----'); // Will update in background
        setIsWalletConnected(true);
        
        console.log('📊 Fetching balance in background...');
        // Fetch balance in background (non-blocking)
        fetchBalance(provider.publicKey);
        
        return;
      }
      
      console.log(`🔑 Requesting ${walletName} connection...`);
      const resp = await provider.connect();
      const publicKey = resp.publicKey.toString();
      console.log(`✅ ${walletName} connected successfully:`, publicKey);
      
      setWalletAdapter(provider);
      setWalletPublicKey(publicKey);
      setWalletBalance('-.----'); // Will update in background
      setIsWalletConnected(true);
      
      console.log('📊 Fetching balance in background...');
      // Fetch balance in background (non-blocking)
      fetchBalance(resp.publicKey);
      
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      
      // More specific error messages
      if (error.message?.includes('User rejected')) {
        console.warn('⚠️ User rejected connection request');
        alert('Connection cancelled. Please try again and approve the connection in your wallet.');
      } else if (error.code === 4001) {
        console.warn('⚠️ Connection rejected (code 4001)');
        alert('Connection rejected. Please try again.');
      } else {
        console.error('❌ Connection error:', error.message || 'Unknown error');
        alert(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const fetchBalance = async (publicKey) => {
    console.log('💰 Fetching balance for:', publicKey.toString());
    try {
      // Try multiple RPC endpoints in order
      const rpcEndpoints = [
        'https://solana-mainnet.g.alchemy.com/v2/demo',
        'https://rpc.ankr.com/solana',
        'https://solana-api.projectserum.com',
        window.solanaWeb3.clusterApiUrl('mainnet-beta')
      ];
      
      for (let i = 0; i < rpcEndpoints.length; i++) {
        const endpoint = rpcEndpoints[i];
        try {
          console.log(`🔗 Trying RPC endpoint ${i + 1}/${rpcEndpoints.length}:`, endpoint);
          const connection = new window.solanaWeb3.Connection(endpoint, 'confirmed');
          const balance = await connection.getBalance(publicKey);
          const balanceSOL = (balance / 1e9).toFixed(4);
          console.log(`✅ Balance fetched: ${balanceSOL} SOL (${balance} lamports)`);
          setWalletBalance(balanceSOL);
          return; // Success, exit
        } catch (err) {
          console.warn(`⚠️ RPC endpoint ${endpoint} failed:`, err.message);
          continue; // Try next endpoint
        }
      }
      
      // All endpoints failed
      console.error('❌ All RPC endpoints failed to fetch balance');
      setWalletBalance('-.----');
    } catch (error) {
      console.error('❌ Failed to fetch balance:', error);
      setWalletBalance('-.----');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('🖼️ Image selected:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);

    if (!file.type.startsWith('image/')) {
      console.warn('⚠️ Invalid file type:', file.type);
      alert('Please upload an image file (PNG or JPG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.warn('⚠️ File too large:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      alert('Image size must be less than 5MB');
      return;
    }

    console.log('✅ Image validation passed, loading preview...');
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('✅ Image preview loaded');
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
    console.log('🚀 Form submitted');

    if (!isWalletConnected) {
      console.warn('⚠️ Wallet not connected');
      alert('Please connect your wallet first');
      return;
    }

    if (!imageFile) {
      console.warn('⚠️ No image selected');
      alert('Please upload a token image');
      return;
    }

    console.log('✅ Validation passed, starting token creation process...');
    console.log('📝 Token details:', {
      name: formData.name,
      symbol: formData.symbol,
      decimals: formData.decimals,
      mintAmount: formData.mintAmount,
      network: formData.network
    });
    setIsSubmitting(true);

    try {
      // Step 1: Pay service fee (0.1 SOL) to Mintly wallet
      console.log('💳 Step 1: Processing service fee payment...');
      const SERVICE_FEE_LAMPORTS = 0.1 * 1e9; // 0.1 SOL in lamports
      const MINTLY_WALLET = new window.solanaWeb3.PublicKey('EC4PEYPmsvULrs6cPFGdLzx3hkNcxbmbtqnHFpTTBVnR'); // Replace with your actual wallet
      
      const connection = new window.solanaWeb3.Connection(
        window.solanaWeb3.clusterApiUrl(formData.network),
        'confirmed'
      );
      
      console.log('💰 Sending 0.1 SOL service fee to Mintly...');
      
      const paymentTransaction = new window.solanaWeb3.Transaction().add(
        window.solanaWeb3.SystemProgram.transfer({
          fromPubkey: walletAdapter.publicKey,
          toPubkey: MINTLY_WALLET,
          lamports: SERVICE_FEE_LAMPORTS,
        })
      );
      
      paymentTransaction.feePayer = walletAdapter.publicKey;
      paymentTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      const signedPayment = await walletAdapter.signTransaction(paymentTransaction);
      const paymentSignature = await connection.sendRawTransaction(signedPayment.serialize());
      
      console.log('⏳ Confirming payment transaction...');
      await connection.confirmTransaction(paymentSignature);
      console.log('✅ Service fee payment confirmed:', paymentSignature);

      // Step 2: Upload image and metadata via backend
      console.log('📤 Step 2: Uploading image and metadata to Irys...');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('symbol', formData.symbol);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('network', formData.network);
      formDataToSend.append('image', imageFile);
      
      const validAttributes = attributes.filter(attr => attr.trait_type && attr.value);
      console.log('🏷️ Adding', validAttributes.length, 'attribute(s)');
      formDataToSend.append('attributes', JSON.stringify(validAttributes));

      const uploadResponse = await fetch('/api/mint-token', {
        method: 'POST',
        body: formDataToSend
      });

      if (!uploadResponse.ok) {
        console.error('❌ Upload failed with status:', uploadResponse.status);
        throw new Error('Failed to upload metadata');
      }

      const { metadataUri } = await uploadResponse.json();
      console.log('✅ Metadata uploaded to:', metadataUri);

      // Step 3: Create token mint
      console.log('🪙 Step 3: Creating token mint...');

      const { PublicKey, Keypair } = window.solanaWeb3;
      const { createInitializeMintInstruction, TOKEN_PROGRAM_ID } = window.solanaWeb3.splToken;
      
      // Generate mint keypair
      const mintKeypair = Keypair.generate();
      console.log('🔑 Generated mint keypair:', mintKeypair.publicKey.toString());
      
      const lamports = await connection.getMinimumBalanceForRentExemption(82);
      console.log('💰 Mint account rent:', (lamports / 1e9).toFixed(6), 'SOL');
      
      const createAccountIx = SystemProgram.createAccount({
        fromPubkey: walletAdapter.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: 82,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      });

      const initializeMintIx = createInitializeMintInstruction(
        mintKeypair.publicKey,
        formData.decimals,
        walletAdapter.publicKey,
        walletAdapter.publicKey,
        TOKEN_PROGRAM_ID
      );

      const transaction = new Transaction().add(createAccountIx, initializeMintIx);
      transaction.feePayer = walletAdapter.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      transaction.partialSign(mintKeypair);
      
      console.log('🔐 Requesting wallet signature...');
      const signed = await walletAdapter.signTransaction(transaction);
      
      console.log('📡 Sending transaction...');
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log('📨 Transaction signature:', signature);
      
      console.log('⏳ Confirming transaction...');
      await connection.confirmTransaction(signature);
      console.log('✅ Token mint created!');

      // Step 4: Add metadata account
      console.log('📝 Step 4: Creating metadata account...');
      const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
      
      const [metadataAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      
      const createMetadataIx = createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataAccount,
          mint: mintKeypair.publicKey,
          mintAuthority: walletAdapter.publicKey,
          payer: walletAdapter.publicKey,
          updateAuthority: walletAdapter.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: {
              name: formData.name,
              symbol: formData.symbol,
              uri: metadataUri,
              sellerFeeBasisPoints: 0,
              creators: [
                {
                  address: walletAdapter.publicKey,
                  verified: true,
                  share: 100,
                },
              ],
              collection: null,
              uses: null,
            },
            isMutable: true,
            collectionDetails: null,
          },
        }
      );

      const metadataTransaction = new Transaction().add(createMetadataIx);
      metadataTransaction.feePayer = walletAdapter.publicKey;
      metadataTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      const signedMetadata = await walletAdapter.signTransaction(metadataTransaction);
      const metadataSignature = await connection.sendRawTransaction(signedMetadata.serialize());
      await connection.confirmTransaction(metadataSignature);
      
      console.log('✅ Metadata account created!');

      // Step 5: Mint tokens to user
      console.log('💎 Step 5: Minting tokens to your wallet...');
      const { getOrCreateAssociatedTokenAccount, mintTo } = window.solanaWeb3.splToken;
      
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        walletAdapter,
        mintKeypair.publicKey,
        walletAdapter.publicKey
      );
      console.log('✅ Token account:', tokenAccount.address.toString());

      const mintAmountRaw = formData.mintAmount * Math.pow(10, formData.decimals);
      console.log('💎 Minting', formData.mintAmount, 'tokens (', mintAmountRaw, 'raw amount)...');
      await mintTo(
        connection,
        walletAdapter,
        mintKeypair.publicKey,
        tokenAccount.address,
        walletAdapter.publicKey,
        mintAmountRaw
      );

      console.log('✅ Tokens minted successfully!');

      const explorerUrl = `https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}${
        formData.network === 'mainnet-beta' ? '' : `?cluster=${formData.network}`
      }`;
      
      console.log('🎉 Token creation complete!');
      console.log('🔗 Explorer URL:', explorerUrl);
      
      setResult({
        success: true,
        mintAddress: mintKeypair.publicKey.toString(),
        metadataUri: metadataUri,
        network: formData.network,
        explorerUrl: explorerUrl
      });

    } catch (error) {
      console.error('❌ Error creating token:', error);
      console.error('❌ Error stack:', error.stack);
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
                      Includes 0.1 SOL service fee + blockchain costs (storage, rent-exempt accounts, transaction fees)
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
      <Footer />
    </div>
  );
}

export default App;
