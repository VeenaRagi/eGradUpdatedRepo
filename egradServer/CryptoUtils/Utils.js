// export const decryptData = async (encryptedText) => {
//     try {
//       const response = await fetch(`${BASE_URL}/decrypt`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: encryptedText }),
//       });
//       if (!response.ok) {
//         throw new Error('Decryption failed');
//       }
//       const data = await response.json();
//       return data.decrypted;
//     } catch (error) {
//       console.error('Error decrypting data:', error);
//       throw error;
//     }
//   };
const CryptoJS = require('crypto-js');

// Replace with a secure key and method of key management
const secretKey = process.env.LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;

// Encrypt data
function encryptData(data) {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

// Decrypt data
// function decryptData(encryptedData) {
//     const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
//     return bytes.toString(CryptoJS.enc.Utf8);
// }
function decryptData(encryptedUserId) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedUserId, secretKey);
        const decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedUserId) {
            throw new Error('Decryption failed');
        }

        return decryptedUserId;
    } catch (error) {
        console.error('Decryption error:', error.message);
        return null;
    }
}

module.exports = { encryptData, decryptData };
