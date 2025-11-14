# Deployment Guide

## Setting Up Your Mintly Wallet

Mintly uses a service fee model where:
- Users pay **0.2 SOL** total
- **0.1 SOL** goes to you as service fee
- **~0.1 SOL** covers blockchain costs (storage, rent, tx fees)

Your wallet pays for Irys storage from the collected service fees.

## Prerequisites

1. A funded Solana wallet (mainnet-beta)
2. At least 1-2 SOL in the wallet for Irys uploads
3. Your wallet's private key

## Getting Your Private Key

### Option 1: From Solana CLI
```bash
cat ~/.config/solana/id.json
```

### Option 2: From Phantom/Solflare
Export your private key as a JSON array from your wallet settings.

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Set Environment Variable
```bash
vercel env add SOLANA_PRIVATE_KEY
```
When prompted, paste your private key as a JSON array (e.g., `[1,2,3,...]`)

Select: **Production**, **Preview**, and **Development**

### 4. Deploy
```bash
vercel --prod
```

## Local Development

### 1. Create `.env` file
```bash
cp .env.example .env
```

### 2. Add your private key to `.env`
```
SOLANA_PRIVATE_KEY=[1,2,3,...]
```

### 3. Start development servers
```bash
# Terminal 1: Backend server
npm start

# Terminal 2: Frontend server
cd client && npm run dev
```

## Important Security Notes

⚠️ **NEVER commit your `.env` file to git**
⚠️ **Keep your private key secure**
⚠️ **Monitor your wallet balance regularly**
⚠️ **Start with a test wallet on devnet first**

## Monitoring

- Check your wallet balance: `solana balance`
- View Irys uploads: https://arweave.net/[imageUri]
- Track transactions: https://explorer.solana.com

## Wallet Address

Update the service fee wallet address in `client/src/App.jsx`:
```javascript
const MINTLY_WALLET = new window.solanaWeb3.PublicKey('YOUR_WALLET_ADDRESS_HERE');
```

Current wallet: `EC4PEYPmsvULrs6cPFGdLzx3hkNcxbmbtqnHFpTTBVnR`
