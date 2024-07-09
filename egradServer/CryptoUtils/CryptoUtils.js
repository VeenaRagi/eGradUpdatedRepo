// import CryptoJS from "crypto-js";
// import { json } from "react-router-dom";
// // require('dotenv').config();

// const secretKeyForUserId=process.env.LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
// console.log(secretKeyForUserId,"Ttttttttttttttttttttt")
// export const encryptData=(data)=>{
//     return CryptoJS.AES.encrypt(JSON.stringify(data),secretKeyForUserId).toString();

// }
// export const decryptData=(cipherText)=>{
//     const bytes=CryptoJS.AES.decrypt(cipherText,secretKeyForUserId);
//     const decryptedData=bytes.toString(CryptoJS.enc.Utf8);
//     console.log(decryptData,"This is the decrypted dataa")
//     return JSON.parse(decryptData);
// }
