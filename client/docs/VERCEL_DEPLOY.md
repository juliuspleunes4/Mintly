# Vercel Deployment Guide

## Prerequisites

1. A Vercel account
2. Vercel CLI installed: `npm install -g vercel`

## Setup

### 1. Deploy

```bash
vercel login
vercel --prod
```

That's it! No environment variables needed since users pay with their own wallets.

## Local Testing

To test locally:

```bash
# Terminal 1 - Start backend
npm start

# Terminal 2 - Start frontend
cd client
npm run dev
```

Or use Vercel dev server:
```bash
vercel dev
```

This will start:
- Frontend on http://localhost:3000
- API functions at http://localhost:3000/api/*

## How It Works

- **Backend**: Only handles image/metadata uploads to Irys (free tier)
- **Client**: User's wallet signs all transactions and pays all fees
- **No private keys needed**: Everything is done with the user's connected wallet

## Important Notes

- Users need SOL in their wallet to pay transaction fees (~0.01-0.05 SOL per token)
- The serverless function has a 10-second timeout on free tier, 60s on Pro
- Files are stored in memory (not on disk) in serverless environment

## API Endpoint

Once deployed, your API will be available at:
```
https://your-project.vercel.app/api/mint-token
```
