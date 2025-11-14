<div align="center">

# 🪙 Mintly CLI

### Create Solana SPL Tokens with Metadata - (Low-fee and open-source)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-juliuspleunes4-blue?logo=github)](https://github.com/juliuspleunes4/mintly-cli)
[![Solana](https://img.shields.io/badge/Solana-SPL_Token-14F195?logo=solana)](https://solana.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)

[Website](https://www.mintly.cc) • [CLI Version](https://github.com/juliuspleunes4/mintly-cli) • [Report Bug](https://github.com/juliuspleunes4/mintly-cli/issues)

</div>

---

## 📖 About

**Mintly CLI** is a command-line tool for creating Solana SPL tokens with custom images and metadata. This is a fork of [Woody4618's create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata) project, enhanced with additional features and improved documentation.

### 🌐 Mintly Ecosystem

- **CLI Version** (this repository): Free and open-source command-line tool. Only pay standard Solana network fees.
- **Web Version** ([www.mintly.cc](https://www.mintly.cc)): User-friendly web interface with the same functionality. Includes a small service fee on top of network fees. Also open-source!

Both versions are fully open-source and maintained primarily by [Julius Pleunes](https://linkedin.com/in/juliuspleunes).

## ✨ Features

- 🎨 Create SPL tokens with custom images and metadata
- 🔐 Support for wallet.json or default Solana CLI wallet
- 🎯 Optional vanity address generation
- 🌐 Works on devnet and mainnet
- 💰 **No service fees** - only pay standard Solana network costs
- 📝 Base58 private key conversion utility

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Solana CLI tools](https://solana.com/docs/intro/installation)
- SOL in your wallet for transaction fees
  - Devnet: Use the faucet at [faucet.solana.com](https://faucet.solana.com)
  - Mainnet: Purchase SOL from an exchange

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/juliuspleunes4/mintly-cli.git
cd mintly-cli
npm install
```

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

## 📝 Step-by-Step Guide

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

Replace `src/image.png` with your token image:
- **Recommended size:** 512x512px
- **Format:** PNG or JPG
- **Keep the filename as:** `image.png`

### Step 3: Generate Vanity Address (Optional)

Create a custom token address with a specific prefix:

```bash
cd src
solana-keygen grind --starts-with MINT:1 | tee /dev/tty | grep -oE '[1-9A-HJ-NP-Za-km-z]{32,44}\.json' | head -n1 | xargs -I{} mv {} token-mint-address.json
```

**Tips:**
- Replace `MINT:1` with your desired prefix
- Prefixes longer than 4 characters may take significant time
- This overwrites `token-mint-address.json` - back it up if needed

### Step 4: Create Your Token

Run the minting script:

```bash
node src/mint-token-with-metadata.js
```

This will:
1. Upload your image to a decentralized storage
2. Create metadata for your token
3. Mint the SPL token on Solana
4. Transfer the specified amount to your wallet
5. Return your token's mint address

### Step 5: Interact With Your Token

Transfer tokens to another wallet:

```bash
spl-token transfer <mint-address> <amount> <recipient-wallet> --fund-recipient
```

Add network flags:
- `-ud` for devnet
- `-um` for mainnet

For more operations, check the [Solana SPL Token CLI docs](https://solana.com/docs/tokens).

## 🛠️ Additional Commands

### Upload Metadata Only

If you only need the metadata URI without minting:

```bash
node src/upload-image-and-metadata.js
```

### Convert Base58 Private Key

Convert a base58 private key to wallet.json format:

```bash
node convert-key.js
```

## 💡 Usage Tips

- **Testing First:** Always test on devnet before deploying to mainnet
- **Backup Keys:** Keep secure backups of your wallet files and private keys
- **Network Fees:** Ensure you have enough SOL for transaction fees
- **Image Hosting:** Images are uploaded to decentralized storage (Arweave via Irys)

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