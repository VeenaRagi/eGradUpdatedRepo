import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTIAuth } from '../../../TechInfoContext/AuthContext';
// import decryptData from './Decrypt';
// import decryptData from './Decrypt';
// Function to call the backend API for decryption
const SDAfterLogin = () => {
    const { userIdTesting } = useParams();
    const [decryptedUserIdState, setDecryptedUserIdState] = useState("")
    console.log(userIdTesting, "3222222222222222222222")
    const [tiAuth, settiAuth] = useTIAuth()
    const secretKey = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
    console.log(secretKey,"secret key while decoding")
    useEffect(()=>{
        try {
            const decodedUserId = decodeURIComponent(userIdTesting);
    
            // Decrypt the decoded user ID
            const bytes = CryptoJS.AES.decrypt(decodedUserId, secretKey);
            const decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedUserId) {
                throw new Error('Decryption failed');
            }
            setDecryptedUserIdState(decryptedUserId)
            console.log('Decrypted User ID:', decryptedUserId);
        } catch (error) {
            console.error('Decryption error:', error.message);
        }
    },[])


    const navigate = useNavigate();
    const handleLogOut = () => {
        settiAuth({
            ...tiAuth,
            user: null,
            token: ""
        })
        localStorage.removeItem('tiAuth')
        // localStorage.removeItem("user")
        navigate('/userlogin')
    }

    return (
        <div>SDAfterLogin <br />

            {userIdTesting}
            {decryptedUserIdState}
            <button onClick={handleLogOut} >Log out</button>
        </div>

    )
}

export default SDAfterLogin