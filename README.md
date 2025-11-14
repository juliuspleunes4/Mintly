# 🪙 Mintly - Web App & CLI

### Create Solana SPL Tokens with Metadata - Now with a Web Interface!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-juliuspleunes4-blue?logo=github)](https://github.com/juliuspleunes4/mintly-cli)
[![Solana](https://img.shields.io/badge/Solana-SPL_Token-14F195?logo=solana)](https://solana.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)

---

## 🎉 What's New in v2.0

**Mintly is now a full-featured web application!** You can now create Solana SPL tokens with a beautiful, user-friendly web interface - no command line required!

### Two Ways to Use Mintly:

1. **🌐 Web Interface** - Modern, intuitive UI with wallet connection (Phantom/Solflare)
2. **💻 CLI Version** - Original command-line tool for developers

---

## 📖 About

**Mintly** is a tool for creating Solana SPL tokens with custom images and metadata. This is a fork of [Woody4618's create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata) project, enhanced with a full web interface and additional features.

## ✨ Features

### Web Version
- ✨ Modern, responsive UI
- 🔐 Wallet integration (Phantom/Solflare)
- 📸 Drag & drop image upload with preview
- 🎨 Real-time form validation
- 📊 Progress tracking during token creation
- 🔗 Direct links to Solana Explorer
- 📱 Mobile-friendly design

### CLI Version
- 🎨 Create SPL tokens with custom images and metadata
- 🔐 Support for wallet.json or default Solana CLI wallet
- 🎯 Optional vanity address generation
- 🌐 Works on devnet and mainnet
- 💰 **No service fees** - only pay standard Solana network costs
- 📝 Base58 private key conversion utility

---

## 🚀 Quick Start - Web Version

### Installation

```bash
git clone https://github.com/juliuspleunes4/mintly-cli.git
cd mintly-cli
npm install
```

### Start the Web Server

```bash
npm start
```

Then open your browser and navigate to: **http://localhost:3000**

### Using the Web Interface

1. **Connect Your Wallet** - Click "Connect Wallet" and approve the connection in Phantom or Solflare
2. **Select Network** - Choose Devnet (testing) or Mainnet (production)
3. **Enter Token Details** - Fill in your token name, symbol, description, etc.
4. **Upload Image** - Drag & drop or click to upload your token image (PNG/JPG, 512x512px recommended)
5. **Add Attributes** (optional) - Add custom metadata attributes
6. **Create Token** - Click "Create Token" and approve the transaction in your wallet
7. **Done!** - View your token on Solana Explorer and in your wallet

### Requirements for Web Version

- **Browser Wallet**: Install [Phantom](https://phantom.app) or [Solflare](https://solflare.com)
- **SOL Balance**: Ensure you have SOL in your connected wallet
  - Devnet: Get free SOL from [faucet.solana.com](https://faucet.solana.com)
  - Mainnet: Purchase SOL from an exchange

---

## 💻 CLI Version (Original)

The original CLI functionality is still available! Perfect for automation and scripting.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Solana CLI tools](https://solana.com/docs/intro/installation)
- SOL in your wallet for transaction fees

### Wallet Setup

You have two options for wallet configuration:

**Option 1: Use Default Solana CLI Wallet**
- The tool will automatically use your [default Solana wallet](https://solana.com/docs/intro/installation#create-wallet)

**Option 2: Use Custom Wallet (wallet.json)**

If you have a base58-encoded private key (from Phantom, Solflare, etc.):

1. Open `convert-key.js`
2. Replace `'EXAMPLE_BASE58_PRIVATE_KEY_HERE'` with your actual base58 private key
3. Run the conversion:
   ```bash
   node convert-key.js
   ```
4. This will automatically create `src/wallet.json` with your wallet

### Step-by-Step CLI Usage

#### Step 1: Configure Token Metadata

Edit `src/token-metadata.json` with your token details:

```json
{
  "name": "Dishwasher Token",
  "symbol": "DISH",
  "description": "Reward tokens for completing household chores like unloading the dishwasher.",
  "decimals": 6,
  "mintAmount": 1000000,
  "network": "devnet",
  "image": "Will be replaced automatically",
  "attributes": [
    {
      "trait_type": "Category",
      "value": "Household Chores"
    },
    {
      "trait_type": "Task Type",
      "value": "Dishwasher Unloading"
    }
  ]
}
```

**Configuration Options:**
- `network`: Set to `"devnet"` for testing or `"mainnet-beta"` for production
- `mintAmount`: Total supply of tokens to mint
- `decimals`: Number of decimal places (6-9 recommended)
- `attributes`: Custom metadata attributes for your token

### Step 2: Add Your Token Image

Replace `src/image.png` with your token image:
- **Recommended size:** 512x512px
- **Format:** PNG or JPG
- **Keep the filename as:** `image.png`

#### Step 3: Create Your Token

```bash
npm run mint
```

This will:
1. Upload your image to decentralized storage
2. Create metadata for your token
3. Mint the SPL token on Solana
4. Transfer the specified amount to your wallet
5. Return your token's mint address

---

## 🛠️ Additional CLI Commands

### Upload Metadata Only

```bash
npm run upload
```

### Convert Base58 Private Key

```bash
npm run convert-key
```

### Development Mode (Web)

```bash
npm run dev
```

Starts the server with auto-reload on file changes.

---

## 🌐 API Endpoints

The web server exposes the following endpoints:

- `GET /` - Web interface
- `POST /api/mint-token` - Create a new token (multipart/form-data)
- `GET /api/health` - Health check

---

## 📁 Project Structure

```
mintly-cli/
├── public/              # Web interface files
│   ├── index.html      # Main web page
│   ├── css/
│   │   └── style.css   # Styles
│   └── js/
│       └── app.js      # Client-side JavaScript
├── src/                # CLI source files
│   ├── mint-token-with-metadata.js
│   ├── upload-image-and-metadata.js
│   ├── token-metadata.json
│   └── image.png
├── server.js           # Express web server
├── convert-key.js      # Key conversion utility
├── package.json
└── README.md
```

---

## 🔒 Security Notes

- **Never commit wallet.json or private keys to version control**
- **Use devnet for testing before deploying to mainnet**
- **Keep secure backups of your wallet files and private keys**
- **The web interface connects to YOUR wallet - we never have access to your keys**

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is a fork of [create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata) by [Woody4618](https://github.com/Woody4618). Special thanks to the original creator for the foundation of this tool.

## 🔗 Links

- **Website:** [www.mintly.cc](https://www.mintly.cc)
- **GitHub:** [github.com/juliuspleunes4/mintly-cli](https://github.com/juliuspleunes4/mintly-cli)
- **Original Project:** [github.com/Woody4618/create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata)

---

<div align="center">

Made with ❤️ by the Mintly team

</div>