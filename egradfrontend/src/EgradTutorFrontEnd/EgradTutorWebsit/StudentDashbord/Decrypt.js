// const decryptData = async (encryptedText) => {
//     try {
//       const response = await fetch('http://localhost:5001/Login/decrypt', {
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
//       console.log('Decrypted data:', data);
//       return data.decrypted;
//     } catch (error) {
//       console.error('Error decrypting data:', error);
//       throw error;
//     }
//   };
//   export default decryptData;
import CryptoJS from 'crypto-js';
import BASE_URL from '../../../apiConfig';

// const decryptData = async (encryptedData, iv) => {
//   try {
//     const response = await fetch('http://localhost:5001/Login/decrypt', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ text: encryptedData, iv }),
//     });

//     if (!response.ok) {
//       throw new Error('Decryption failed');
//     }

//     const data = await response.json();
//     console.log('Decrypted data:', data.decrypted);
//     return data.decrypted;
//   } catch (error) {
//     console.error('Error decrypting data:', error);
//     throw error;
//   }
// };
// const decryptData = (encryptedText, iv) => {
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Base64.parse(iv), {
//         key: CryptoJS.enc.Base64.parse(process.env.REACT_APP_SECRET_KEY), // Secret key used for encryption
//         iv: CryptoJS.enc.Hex.parse(iv),
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       });
//       return bytes.toString(CryptoJS.enc.Utf8);
//     } catch (error) {
//       console.error('Error decrypting data:', error);
//       throw error;
//     }
//   };
// not working

// const decryptData = (encryptedText, iv) => {
//   if (!encryptedText || !iv) {
//     throw new Error('Invalid encrypted data or IV');
//   }

//   try {
//     const key = CryptoJS.enc.Base64.parse(process.env.REACT_APP_SECRET_KEY); // Ensure the key is correctly set
//     const decryptedBytes = CryptoJS.AES.decrypt(
//       { ciphertext: CryptoJS.enc.Base64.parse(encryptedText) }, // Ensure the format is correct
//       key,
//       {
//         iv: CryptoJS.enc.Hex.parse(iv),
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       }
//     );
//     return decryptedBytes.toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     console.error('Error decrypting data:', error);
//     throw error;
//   }
// };
// export default decryptData;
export const encryptData = async (text) => {
    try {
      const response = await fetch(`${BASE_URL}/Login/encrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error('Encryption failed');
      }
      const data = await response.json();
      return data.encrypted;
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw error;
    }
  };
  
  export const decryptData = async (encryptedText) => {
    try {
      const response = await fetch(`${BASE_URL}/Login/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: encryptedText }),
      });
      if (!response.ok) {
        throw new Error('Decryption failed');
      }
      const data = await response.json();
      return data.decrypted;
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw error;
    }
  };
  