# 🪙 Mintly

### Create Solana SPL Tokens with a Beautiful Web Interface

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-juliuspleunes4-blue?logo=github)](https://github.com/juliuspleunes4/mintly-cli)
[![Solana](https://img.shields.io/badge/Solana-SPL_Token-14F195?logo=solana)](https://solana.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)

---

## 🌐 About Mintly

**Mintly** is a modern React web application for creating Solana SPL tokens with custom images and metadata. Features a stunning dithered wave shader background and seamless wallet integration. No command-line knowledge required!

### ⚠️ BETA WARNING
This application is in **early development and beta testing**. Use at your own risk. We are not responsible for:
- Loss of SOL or tokens
- Failed transactions
- Token creation failures
- Any blockchain-related issues

All fees are **NON-REFUNDABLE**. Please read our [Terms of Service](#) and [Privacy Policy](#) before using.

### Perfect For:
- 🎨 **Artists & Creators** - Launch your token with your artwork
- 🚀 **Project Founders** - Create tokens for your community
- 🎮 **Game Developers** - Mint in-game currencies and assets
- 💡 **Web3 Enthusiasts** - Experiment with token creation on Solana

*Built on top of [Woody4618's create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata), enhanced with a full React web experience.*

## ✨ Why Choose Mintly?

### 🎯 User-Friendly Web Interface
- ✨ **No coding required** - Intuitive form-based token creation
- 🔐 **Secure wallet integration** - Connect Phantom or Solflare directly (Mainnet only)
- 📸 **Visual image upload** - Drag & drop with instant preview
- 🎨 **Beautiful shader background** - Dithered wave effect with Three.js
- 📊 **Live progress tracking** - See each step of token creation with emoji indicators
- 🔗 **Instant results** - Direct links to Solana Explorer
- 📱 **Responsive design** - Works on desktop and mobile
- 💰 **Transparent pricing** - 0.2 SOL total (0.1 SOL service fee + ~0.1 SOL blockchain costs)
- 📄 **Legal protection** - Comprehensive Terms of Service and Privacy Policy

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/juliuspleunes4/mintly.git
cd mintly
npm install
cd client
npm install
```

### Development Mode

```bash
# Terminal 1 - Start the backend API
npm run dev

# Terminal 2 - Start the React frontend
cd client
npm run dev
```

Then open your browser and navigate to: **http://localhost:5173**

### Production Deployment

Deploy to Vercel (recommended):
1. Set environment variable: `SOLANA_PRIVATE_KEY` (base58 or JSON array format)
2. Deploy using `vercel` CLI or GitHub integration
3. Backend runs as serverless function in `/api/`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### How to Create Your Token

1. **🔌 Connect Your Wallet**
   - Click "Connect Wallet" button
   - Choose Phantom or Solflare
   - Approve the connection in your wallet
   - Your balance will be displayed automatically
   - **Note: Mainnet only** - Application connects to Solana mainnet-beta

2. **💰 Understand the Costs**
   - **Total: 0.2 SOL** per token creation
   - **Service Fee: 0.1 SOL** - Goes to Mintly for hosting and Irys storage
   - **Blockchain Costs: ~0.1 SOL** - Network fees for mint account, metadata, and transactions
   - All fees are **NON-REFUNDABLE**

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
   - **Step 1**: Pay 0.1 SOL service fee
   - **Step 2**: Metadata uploaded to Irys/Arweave
   - **Step 3**: Create token mint account
   - **Step 4**: Create metadata account
   - **Step 5**: Mint tokens to your wallet
   - Watch the progress with emoji indicators

7. **🎉 View Your Token**
   - Get your mint address
   - View on Solana Explorer
   - Token appears in your wallet automatically

### What You'll Need

- **Wallet Extension**: [Phantom](https://phantom.app) or [Solflare](https://solflare.com)
- **SOL Balance**: At least 0.2 SOL on **Mainnet** for token creation
- **Stable Connection**: Token creation involves 5 blockchain transactions

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

- `POST /api/mint-token` - Upload image and metadata to Irys (multipart/form-data)
  - Accepts: `image` (file), `metadata` (JSON string)
  - Returns: `{ metadataUri: string }`
  - Requires: `SOLANA_PRIVATE_KEY` environment variable

---

## 📁 Project Structure

```
mintly/
├── api/                     # 🔧 Vercel serverless functions
│   └── mint-token.js       #    Backend API for Irys uploads
├── client/                  # ⚛️ React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx         #    Main application component
│   │   ├── App.css         #    Application styles
│   │   ├── main.jsx        #    React Router setup
│   │   ├── components/
│   │   │   ├── Dither.jsx  #    Three.js dithered shader background
│   │   │   ├── Footer.jsx  #    Footer with legal links
│   │   │   └── Footer.css  #    Footer styles
│   │   └── pages/
│   │       ├── PrivacyPolicy.jsx    #    Privacy policy page
│   │       └── TermsOfService.jsx   #    Terms of service page
│   ├── public/
│   │   └── favicon.png     #    Mintly logo
│   ├── package.json        #    Frontend dependencies
│   └── vite.config.js      #    Vite configuration
├── src/                     # 🛠️ Original CLI tools (legacy)
│   ├── mint-token-with-metadata.js
│   ├── upload-image-and-metadata.js
│   ├── token-metadata.json
│   └── token-mint-address.json
├── convert-key.js          # 🔑 Wallet key conversion utility
├── vercel.json             # 🚀 Vercel deployment config
├── DEPLOYMENT.md           # 📖 Deployment instructions
├── .env.example            # 🔐 Environment variable template
├── package.json            # 📦 Backend dependencies
└── README.md
```

---

## 🔒 Security & Privacy

- **Your keys, your tokens** - The web app connects directly to YOUR browser wallet
- **No data collection** - We don't collect, store, or process any personal information
- **Decentralized storage** - Images and metadata stored on Irys/Arweave
- **Open source** - All code is public and auditable
- **Server wallet** - Backend uses funded wallet only for Irys uploads (you pay service fee)
- **Mainnet only** - Application connects to Solana mainnet-beta
- **Legal protection** - Comprehensive Terms of Service and Privacy Policy included

### How Payment Works

1. **You pay 0.1 SOL service fee** → Sent to service wallet: `EC4PEYPmsvULrs6cPFGdLzx3hkNcxbmbtqnHFpTTBVnR`
2. **Backend uploads to Irys** → Uses server's funded wallet (your service fee covers this)
3. **You pay blockchain costs** → Network fees for minting (sent directly to Solana network)
4. **Tokens arrive in your wallet** → You own the mint authority and all tokens

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is a fork of [create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata) by [Woody4618](https://github.com/Woody4618). Special thanks to the original creator for the foundation of this tool.

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Three.js** - 3D graphics for dithered shader background
- **@react-three/fiber** - React renderer for Three.js
- **Solana Web3.js** - Blockchain interaction
- **SPL Token** - Token program integration
- **React Router** - Client-side routing

### Backend
- **Express** - API server (Vercel serverless)
- **Metaplex UMI** - Solana framework
- **Irys** - Decentralized storage on Arweave
- **Multer** - File upload handling

### Deployment
- **Vercel** - Serverless hosting
- **Arweave/Irys** - Permanent metadata storage
- **Solana Mainnet** - Production blockchain network

---

## 🔗 Links & Resources

- **📦 GitHub:** [github.com/juliuspleunes4/mintly](https://github.com/juliuspleunes4/mintly)
- **🐛 Report Issues:** [github.com/juliuspleunes4/mintly/issues](https://github.com/juliuspleunes4/mintly/issues)
- **📖 Solana Docs:** [solana.com/docs](https://solana.com/docs)
- **📖 Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **👏 Original CLI:** [Woody4618's create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata)

---

<div align="center">

### Made with ❤️ by the Mintly team

**⚠️ BETA SOFTWARE - Use at your own risk**

**Start creating your Solana tokens today!**

[Get Started](http://localhost:5173) • [Documentation](https://github.com/juliuspleunes4/mintly) • [Support](https://github.com/juliuspleunes4/mintly/issues)

</div>