// Wallet connection
let walletAdapter = null;
let isWalletConnected = false;

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletInfo = document.getElementById('walletInfo');
const walletAddress = document.getElementById('walletAddress');
const walletBalance = document.getElementById('walletBalance');
const tokenForm = document.getElementById('tokenForm');
const submitBtn = document.getElementById('submitBtn');
const progressSection = document.getElementById('progressSection');
const resultSection = document.getElementById('resultSection');
const uploadArea = document.getElementById('uploadArea');
const tokenImage = document.getElementById('tokenImage');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const addAttributeBtn = document.getElementById('addAttribute');
const attributesContainer = document.getElementById('attributesContainer');
const createAnotherBtn = document.getElementById('createAnother');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkWalletConnection();
});

function setupEventListeners() {
    connectWalletBtn.addEventListener('click', connectWallet);
    tokenForm.addEventListener('submit', handleSubmit);
    uploadArea.addEventListener('click', () => tokenImage.click());
    tokenImage.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeImage);
    addAttributeBtn.addEventListener('click', addAttributeRow);
    createAnotherBtn.addEventListener('click', resetForm);

    // Remove attribute buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-attr')) {
            e.target.closest('.attribute-row').remove();
        }
    });
}

// Wallet Connection
async function checkWalletConnection() {
    // Check if Phantom or Solflare is installed
    if (window.solana && window.solana.isPhantom) {
        console.log('Phantom wallet detected');
    } else if (window.solflare && window.solflare.isSolflare) {
        console.log('Solflare wallet detected');
    } else {
        console.log('No wallet detected - will show install prompt');
    }
}

async function connectWallet() {
    try {
        // Try Phantom first, then Solflare
        const provider = window.solana || window.solflare;
        
        if (!provider) {
            alert('Please install Phantom or Solflare wallet!\n\nPhantom: https://phantom.app\nSolflare: https://solflare.com');
            return;
        }

        const resp = await provider.connect();
        const publicKey = resp.publicKey.toString();
        
        // Truncate address for display
        const truncated = publicKey.slice(0, 4) + '...' + publicKey.slice(-4);
        walletAddress.textContent = truncated;
        
        // Get balance
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl('devnet'),
            'confirmed'
        );
        const balance = await connection.getBalance(resp.publicKey);
        walletBalance.textContent = (balance / 1e9).toFixed(4);
        
        // Update UI
        connectWalletBtn.style.display = 'none';
        walletInfo.style.display = 'block';
        submitBtn.disabled = false;
        isWalletConnected = true;
        walletAdapter = provider;
        
        console.log('Wallet connected:', publicKey);
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

// Image Upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG or JPG)');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadPlaceholder.style.display = 'none';
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function removeImage(e) {
    e.stopPropagation();
    tokenImage.value = '';
    uploadPlaceholder.style.display = 'block';
    imagePreview.style.display = 'none';
    previewImage.src = '';
}

// Attributes
function addAttributeRow() {
    const row = document.createElement('div');
    row.className = 'attribute-row';
    row.innerHTML = `
        <input type="text" class="attr-key" placeholder="Trait Type">
        <input type="text" class="attr-value" placeholder="Value">
        <button type="button" class="btn-icon btn-remove-attr">×</button>
    `;
    attributesContainer.appendChild(row);
}

// Form Submission
async function handleSubmit(e) {
    e.preventDefault();

    if (!isWalletConnected) {
        alert('Please connect your wallet first');
        return;
    }

    // Collect form data
    const formData = new FormData(tokenForm);
    
    // Collect attributes
    const attributes = [];
    const attrRows = attributesContainer.querySelectorAll('.attribute-row');
    attrRows.forEach(row => {
        const key = row.querySelector('.attr-key').value.trim();
        const value = row.querySelector('.attr-value').value.trim();
        if (key && value) {
            attributes.push({ trait_type: key, value: value });
        }
    });

    // Build metadata
    const metadata = {
        name: formData.get('name'),
        symbol: formData.get('symbol'),
        description: formData.get('description'),
        decimals: parseInt(formData.get('decimals')),
        mintAmount: parseInt(formData.get('mintAmount')),
        network: formData.get('network'),
        attributes: attributes,
        walletPublicKey: walletAdapter.publicKey.toString()
    };

    // Show progress
    tokenForm.style.display = 'none';
    progressSection.style.display = 'block';

    try {
        // Send to backend
        const response = await fetch('/api/mint-token', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to create token');
        }

        const result = await response.json();
        showResult(result);
    } catch (error) {
        console.error('Error creating token:', error);
        alert('Failed to create token: ' + error.message);
        resetForm();
    }
}

// Progress Updates
function updateProgress(step, percentage) {
    const progressBar = document.getElementById('progressBar');
    const progressSteps = document.getElementById('progressSteps');
    
    progressBar.style.width = percentage + '%';
    
    const stepItem = document.createElement('li');
    stepItem.textContent = step;
    stepItem.className = percentage === 100 ? 'completed' : 'active';
    progressSteps.appendChild(stepItem);
}

// Show Results
function showResult(result) {
    progressSection.style.display = 'none';
    resultSection.style.display = 'block';

    document.getElementById('resultName').textContent = result.name;
    document.getElementById('resultSymbol').textContent = result.symbol;
    document.getElementById('resultMint').textContent = result.mintAddress;
    
    const metadataLink = document.getElementById('resultMetadata');
    metadataLink.href = result.metadataUri;
    metadataLink.textContent = 'View Metadata';

    const network = result.network === 'mainnet-beta' ? '' : `?cluster=${result.network}`;
    const explorerLink = document.getElementById('resultExplorer');
    explorerLink.href = `https://explorer.solana.com/address/${result.mintAddress}${network}`;
    explorerLink.textContent = 'View on Solana Explorer';
}

// Reset Form
function resetForm() {
    tokenForm.reset();
    tokenForm.style.display = 'block';
    progressSection.style.display = 'none';
    resultSection.style.display = 'none';
    removeImage({ stopPropagation: () => {} });
    
    // Clear progress
    document.getElementById('progressSteps').innerHTML = '';
    document.getElementById('progressBar').style.width = '0%';
    
    // Reset attributes to one row
    attributesContainer.innerHTML = `
        <div class="attribute-row">
            <input type="text" class="attr-key" placeholder="Trait Type">
            <input type="text" class="attr-value" placeholder="Value">
            <button type="button" class="btn-icon btn-remove-attr">×</button>
        </div>
    `;
}

// Utility Functions
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

// Load Solana Web3.js from CDN
const script = document.createElement('script');
script.src = 'https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js';
script.onload = () => {
    console.log('Solana Web3.js loaded');
};
document.head.appendChild(script);
