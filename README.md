# 🪙 Mintly

### Create Solana SPL Tokens with a Beautiful Web Interface

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-juliuspleunes4-blue?logo=github)](https://github.com/juliuspleunes4/mintly-cli)
[![Solana](https://img.shields.io/badge/Solana-SPL_Token-14F195?logo=solana)](https://solana.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)

---

## 🌐 About Mintly

**Mintly** is a modern web application for creating Solana SPL tokens with custom images and metadata. No command-line knowledge required! Simply connect your wallet, fill in your token details, upload an image, and mint your token - all through an intuitive web interface.

### Perfect For:
- 🎨 **Artists & Creators** - Launch your token with your artwork
- 🚀 **Project Founders** - Create tokens for your community
- 🎮 **Game Developers** - Mint in-game currencies and assets
- 💡 **Web3 Enthusiasts** - Experiment with token creation on Solana

### Two Ways to Use:

1. **🌐 Web Application** (Recommended) - Beautiful UI with wallet integration
2. **💻 CLI Tool** - Command-line interface for automation and scripting

*Built on top of [Woody4618's create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata), enhanced with a full-stack web experience.*

## ✨ Why Choose Mintly?

### 🎯 User-Friendly Web Interface
- ✨ **No coding required** - Intuitive form-based token creation
- 🔐 **Secure wallet integration** - Connect Phantom or Solflare directly
- 📸 **Visual image upload** - Drag & drop with instant preview
- 🎨 **Real-time validation** - Get feedback as you fill the form
- 📊 **Live progress tracking** - See each step of token creation
- 🔗 **Instant results** - Direct links to Solana Explorer
- 📱 **Works everywhere** - Responsive design for desktop and mobile
- 💰 **Transparent costs** - Only pay standard Solana network fees

### 🛠️ Also Includes CLI Tools
For developers who prefer command-line workflows:
- Automation and scripting support
- Wallet.json integration
- Batch token creation capabilities

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/juliuspleunes4/mintly.git
cd mintly
npm install
```

### Start the Web Server

```bash
npm start
```

Then open your browser and navigate to: **http://localhost:3000**

### How to Create Your Token

1. **🔌 Connect Your Wallet**
   - Click "Connect Wallet" button
   - Approve the connection in your Phantom or Solflare wallet
   - Your balance will be displayed automatically

2. **🌐 Choose Your Network**
   - **Devnet** - Free testing environment (recommended for first-time users)
   - **Mainnet** - Production environment for real tokens

3. **📝 Fill in Token Details**
   - **Name** - Your token's full name (e.g., "Awesome Token")
   - **Symbol** - Ticker symbol (e.g., "AWE")
   - **Description** - What your token represents
   - **Decimals** - Usually 9 (standard for Solana tokens)
   - **Mint Amount** - Total supply to create

4. **🖼️ Upload Your Token Image**
   - Drag & drop or click to browse
   - Recommended: 512x512px PNG or JPG
   - Preview appears instantly

5. **✨ Add Custom Attributes** (Optional)
   - Add metadata like "Category", "Type", etc.
   - Great for NFT-style tokens

6. **🚀 Create Your Token**
   - Click "Create Token" button
   - Approve the transaction in your wallet
   - Watch the progress in real-time

7. **🎉 View Your Token**
   - Get your mint address
   - View on Solana Explorer
   - Token appears in your wallet automatically

### What You'll Need

- **Wallet Extension**: [Phantom](https://phantom.app) or [Solflare](https://solflare.com)
- **SOL for Fees**: 
  - Devnet: Free SOL from [faucet.solana.com](https://faucet.solana.com)
  - Mainnet: ~0.01-0.02 SOL for token creation + ~0.001 SOL for metadata

---

## 💻 Advanced: CLI Tools

<details>
<summary><strong>For developers who need automation or scripting</strong> (Click to expand)</summary>

### CLI Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Solana CLI tools](https://solana.com/docs/intro/installation) (optional)
- Server wallet configuration (for backend token minting)

> **Note:** The CLI uses a server-side wallet (wallet.json or default Solana keypair), not your browser wallet. This is only needed if you're running the server yourself or using CLI commands.

### Step 1: Configure Token Metadata

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

Place your token image at `src/image.png` (512x512px PNG or JPG recommended)

### Step 3: Create Your Token

```bash
npm run mint
```

This will:
1. Upload your image to decentralized storage
2. Create metadata for your token
3. Mint the SPL token on Solana
4. Transfer the specified amount to your wallet
5. Return your token's mint address

### Other CLI Commands

```bash
npm run upload        # Upload metadata only
npm run convert-key   # Convert base58 private key to wallet.json
npm run dev          # Start server with auto-reload
```

</details>---

## 🔌 Technical: API Endpoints

For developers integrating Mintly into other applications:

- `GET /` - Main web interface
- `POST /api/mint-token` - Token creation endpoint (multipart/form-data)
- `GET /api/health` - Server health check

---

## 📁 Project Structure

```
mintly/
├── server.js           # 🌐 Express web server (main entry point)
├── public/              # 🎨 Web interface
│   ├── index.html      #    Main application page
│   ├── css/
│   │   └── style.css   #    Modern UI styles
│   └── js/
│       └── app.js      #    Client-side logic & wallet integration
├── src/                # 🛠️ CLI tools (for advanced users)
│   ├── mint-token-with-metadata.js
│   ├── upload-image-and-metadata.js
│   ├── token-metadata.json
│   └── image.png
├── convert-key.js      # 🔑 Wallet key conversion utility
├── package.json
└── README.md
```

---

## 🔒 Security & Privacy

- **Your keys, your tokens** - The web app connects directly to YOUR browser wallet
- **No key storage** - We never see or store your private keys
- **Test first** - Always use devnet for testing before mainnet
- **Open source** - All code is public and auditable
- **Server wallet** - Only needed if self-hosting (for backend operations)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is a fork of [create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata) by [Woody4618](https://github.com/Woody4618). Special thanks to the original creator for the foundation of this tool.

## 🔗 Links & Resources

- **🌐 Live Demo:** [www.mintly.cc](https://www.mintly.cc)
- **📦 GitHub:** [github.com/juliuspleunes4/mintly-cli](https://github.com/juliuspleunes4/mintly-cli)
- **🐛 Report Issues:** [github.com/juliuspleunes4/mintly-cli/issues](https://github.com/juliuspleunes4/mintly-cli/issues)
- **📖 Solana Docs:** [solana.com/docs](https://solana.com/docs)
- **👏 Original CLI:** [Woody4618's create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata)

---

<div align="center">

### Made with ❤️ by the Mintly team

**Start creating your Solana tokens today - no coding required!**

[Get Started](http://localhost:3000) • [Documentation](https://github.com/juliuspleunes4/mintly-cli) • [Support](https://github.com/juliuspleunes4/mintly-cli/issues)

</div>