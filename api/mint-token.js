import multer from 'multer';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { clusterApiUrl } from "@solana/web3.js";

// Configure multer for serverless
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload image and metadata to Irys using funded Mintly wallet
async function uploadImageAndMetadata(imageBuffer, imageName, metadata) {
  try {
    // Get private key from environment variable
    const privateKeyString = process.env.SOLANA_PRIVATE_KEY;
    if (!privateKeyString) {
      throw new Error('SOLANA_PRIVATE_KEY environment variable not set');
    }

    // Parse private key (expecting base58 or JSON array format)
    let secretKey;
    try {
      // Try parsing as JSON array first
      secretKey = new Uint8Array(JSON.parse(privateKeyString));
    } catch {
      // If that fails, try base58
      const bs58 = await import('bs58');
      secretKey = bs58.default.decode(privateKeyString);
    }

    const umi = createUmi(clusterApiUrl(metadata.network));
    
    // Create keypair from secret key
    const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
    const signer = createSignerFromKeypair(umi, keypair);
    
    umi.use(signerIdentity(signer));
    umi.use(irysUploader());
    
    console.log('🔑 Using Mintly wallet for Irys uploads:', signer.publicKey);

    // Convert image to base64 for free upload
    const imageBase64 = imageBuffer.toString('base64');
    const imageFile = createGenericFile(imageBuffer, imageName, {
      contentType: imageName.endsWith('.png') ? 'image/png' : 'image/jpeg'
    });

    console.log('📤 Uploading image...');
    const [imageUri] = await umi.uploader.upload([imageFile]);
    console.log('✅ Image uploaded:', imageUri);

    const metadataJson = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      image: imageUri,
      attributes: metadata.attributes || [],
      properties: {
        files: [
          {
            uri: imageUri,
            type: imageName.endsWith('.png') ? 'image/png' : 'image/jpeg',
          },
        ],
        category: 'image',
      },
    };

    console.log('📤 Uploading metadata...');
    const metadataUri = await umi.uploader.uploadJson(metadataJson);
    console.log('✅ Metadata uploaded:', metadataUri);

    return { imageUri, metadataUri };
  } catch (error) {
    console.error('Error uploading:', error);
    throw error;
  }
}

// Upload metadata only - minting happens client-side
async function handleUploadMetadata(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const metadata = {
      name: req.body.name,
      symbol: req.body.symbol,
      description: req.body.description || '',
      network: req.body.network || 'mainnet-beta',
      attributes: req.body.attributes ? JSON.parse(req.body.attributes) : []
    };

    console.log('🚀 Uploading metadata...');

    // Upload image and metadata to Irys
    const { imageUri, metadataUri } = await uploadImageAndMetadata(
      req.file.buffer,
      req.file.originalname,
      metadata
    );

    res.json({
      success: true,
      imageUri,
      metadataUri
    });

  } catch (error) {
    console.error('❌ Error uploading metadata:', error);
    res.status(500).json({
      error: 'Failed to upload metadata',
      message: error.message
    });
  }
}

// Export for Vercel serverless
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle multipart form data
  const uploadMiddleware = upload.single('image');
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    await handleUploadMetadata(req, res);
  });
}
