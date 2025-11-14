import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  Keypair,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import pkg from "@metaplex-foundation/mpl-token-metadata";
const { createCreateMetadataAccountV3Instruction } = pkg;
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  createGenericFile,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper function to load wallet keypair
function loadWalletKeypair() {
  try {
    const localWalletPath = path.resolve(__dirname, 'src/wallet.json');
    if (fs.existsSync(localWalletPath)) {
      console.log('📁 Found wallet.json, using it for transactions...');
      const keypairData = JSON.parse(fs.readFileSync(localWalletPath, 'utf8'));
      return Keypair.fromSecretKey(new Uint8Array(keypairData));
    } else {
      console.log('📁 No wallet.json found, using default Solana keypair...');
      const homedir = process.env.HOME || process.env.USERPROFILE;
      const configPath = `${homedir}/.config/solana/id.json`;
      const keypairData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return Keypair.fromSecretKey(new Uint8Array(keypairData));
    }
  } catch (error) {
    console.error('❌ Could not load any keypair:', error.message);
    return null;
  }
}

// Helper function to upload image and metadata
async function uploadImageAndMetadata(imagePath, metadata, network) {
  console.log('🚀 Starting upload process...');

  try {
    const umi = createUmi(`https://api.${network}.solana.com`);
    const localKeypair = loadWalletKeypair();
    
    if (!localKeypair) {
      throw new Error('Could not load wallet keypair');
    }

    const keypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);
    const signer = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(signer));
    umi.use(irysUploader());

    console.log('📸 Uploading image...');
    const buffer = fs.readFileSync(imagePath);
    const file = createGenericFile(buffer, path.basename(imagePath), {
      contentType: 'image/png',
    });

    const [imageUri] = await umi.uploader.upload([file]);
    console.log('✅ Image uploaded:', imageUri);

    console.log('📄 Uploading metadata...');
    const metadataUri = await umi.uploader.uploadJson({
      name: metadata.name,
      description: metadata.description,
      image: imageUri,
      symbol: metadata.symbol,
      attributes: metadata.attributes || [],
      properties: {
        files: [
          {
            type: 'image/png',
            uri: imageUri,
          },
        ],
        category: 'image',
        creators: [
          {
            address: signer.publicKey.toString(),
            share: 100,
          },
        ],
      },
    });

    console.log('✅ Metadata uploaded:', metadataUri);
    return metadataUri;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
}

// API endpoint to mint token
app.post('/api/mint-token', upload.single('image'), async (req, res) => {
  console.log('📨 Received mint token request');

  try {
    // Parse metadata from form data
    const metadata = {
      name: req.body.name,
      symbol: req.body.symbol,
      description: req.body.description || '',
      decimals: parseInt(req.body.decimals) || 9,
      mintAmount: parseInt(req.body.mintAmount) || 1000,
      network: req.body.network || 'devnet',
      attributes: req.body.attributes ? JSON.parse(req.body.attributes) : []
    };

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    console.log('📋 Token metadata:', metadata);

    // Load wallet keypair
    const walletKeypair = loadWalletKeypair();
    if (!walletKeypair) {
      return res.status(500).json({ error: 'Could not load wallet keypair' });
    }

    // Connect to Solana
    const connection = new Connection(
      clusterApiUrl(metadata.network),
      'confirmed'
    );

    // Check wallet balance
    const balance = await connection.getBalance(walletKeypair.publicKey);
    console.log(`💰 Wallet balance: ${balance / 1e9} SOL`);

    if (balance < 0.1 * 1e9) {
      return res.status(400).json({ 
        error: 'Insufficient SOL balance. Please add more SOL to your wallet.' 
      });
    }

    // Upload image and metadata
    console.log('📤 Uploading image and metadata...');
    const metadataUri = await uploadImageAndMetadata(
      req.file.path,
      metadata,
      metadata.network
    );

    // Create mint keypair
    const mintKeypair = Keypair.generate();
    console.log('🪙 Creating token mint...');

    // Create the mint
    const mint = await createMint(
      connection,
      walletKeypair,
      walletKeypair.publicKey,
      walletKeypair.publicKey,
      metadata.decimals,
      mintKeypair,
      { commitment: 'confirmed' }
    );

    console.log(`✅ Token mint created: ${mint.toString()}`);

    // Create associated token account
    console.log('Creating associated token account...');
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletKeypair,
      mint,
      walletKeypair.publicKey,
      false,
      'confirmed'
    );

    // Mint tokens
    console.log(`Minting ${metadata.mintAmount} tokens...`);
    await mintTo(
      connection,
      walletKeypair,
      mint,
      associatedTokenAccount.address,
      walletKeypair,
      metadata.mintAmount * Math.pow(10, metadata.decimals)
    );

    // Create metadata account
    console.log('Creating metadata account...');
    const metadataAccount = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(),
        mint.toBuffer(),
      ],
      new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
    )[0];

    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAccount,
        mint: mint,
        mintAuthority: walletKeypair.publicKey,
        payer: walletKeypair.publicKey,
        updateAuthority: walletKeypair.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadataUri,
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: walletKeypair.publicKey,
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

    const transaction = new Transaction().add(createMetadataInstruction);
    await sendAndConfirmTransaction(connection, transaction, [walletKeypair]);

    console.log('✅ Metadata account created!');

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Return success response
    res.json({
      success: true,
      name: metadata.name,
      symbol: metadata.symbol,
      mintAddress: mint.toString(),
      metadataUri: metadataUri,
      network: metadata.network,
      explorerUrl: `https://explorer.solana.com/address/${mint.toString()}${
        metadata.network === 'mainnet-beta' ? '' : `?cluster=${metadata.network}`
      }`
    });

  } catch (error) {
    console.error('❌ Error minting token:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to mint token',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mintly server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});
