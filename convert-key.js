import bs58 from 'bs58';
import fs from 'fs';

// Paste your base58 private key here (the string you copied from your wallet)
const base58PrivateKey = 'EXAMPLE_BASE58_PRIVATE_KEY_HERE';

try {
  // Convert base58 to byte array
  const privateKeyBytes = bs58.decode(base58PrivateKey);
  const privateKeyArray = Array.from(privateKeyBytes);
  
  // Save to wallet.json
  fs.writeFileSync('src/wallet.json', JSON.stringify(privateKeyArray, null, 2));
  
  console.log('✅ Successfully converted and saved to src/wallet.json');
  console.log(`📊 Array length: ${privateKeyArray.length} bytes`);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Make sure you pasted a valid base58 private key');
}
