export const decryptData = async (encryptedText) => {
    try {
      const response = await fetch(`${BASE_URL}/decrypt`, {
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