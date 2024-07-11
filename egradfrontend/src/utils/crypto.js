
import BASE_URL from "../apiConfig"


export const encryptData = async (text) => {
  try {
    const response = await fetch(`${BASE_URL}/EncrypDecryp/encrypt`, {
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
    const response = await fetch(`${BASE_URL}/EncrypDecryp/decrypt`, {
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
