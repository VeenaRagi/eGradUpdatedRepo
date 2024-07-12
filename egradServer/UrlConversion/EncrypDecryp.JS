





const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const algorithm = 'aes-256-cbc';
let secretKey = process.env.SECRET_KEY || ''; // Fetch secret key from environment variable

// Validate and adjust the secret key length if necessary
if (secretKey.length !== 32) {
  console.error('Invalid secret key length. Adjusting...');
  if (secretKey.length < 32) {
    secretKey = secretKey.padEnd(32, ' '); // Pad with spaces to make it 32 bytes
  } else {
    secretKey = secretKey.slice(0, 32); // Trim to 32 bytes
  }
}

const ivLength = 16; // AES block size

// Function to encrypt data
const encrypt = (text) => {
  console.log('Encrypting:', text); // Adding console log
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const encryptedText = iv.toString('hex') + ':' + encrypted.toString('hex');
  console.log('Encrypted:', encryptedText); // Adding console log
  return encryptedText;
};

// Function to decrypt data
const decrypt = (text) => {
  console.log('Decrypting:', text); // Adding console log
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  const decryptedText = decrypted.toString();
  console.log('Decrypted:', decryptedText); // Adding console log
  return decryptedText;
};

router.post('/encrypt', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }
  try {
    const encrypted = encrypt(text);
    console.log('Encryption successful');
    res.json({ encrypted });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: 'Encryption failed' });
  }
});

router.post('/decrypt', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }
  try {
    const decrypted = decrypt(text);
    console.log('Decryption successful');
    res.json({ decrypted });
  } catch (error) {
    console.error('Decryption error:', error);
    res.status(500).json({ error: 'Decryption failed' });
  }
});




module.exports = router;