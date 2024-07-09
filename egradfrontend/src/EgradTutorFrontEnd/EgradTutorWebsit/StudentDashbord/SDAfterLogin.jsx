import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTIAuth } from '../../../TechInfoContext/AuthContext';
import axios from '../../../api/axios';
// import decryptData from './Decrypt';
// import decryptData from './Decrypt';
// Function to call the backend API for decryption
const SDAfterLogin = () => {
    const { userIdTesting } = useParams();
    const decodedString = decodeURIComponent(userIdTesting);
    const [decryptedUserIdState, setDecryptedUserIdState] = useState("")
    console.log(userIdTesting, "3222222222222222222222")
    const [tiAuth, settiAuth] = useTIAuth()
    const secretKey = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
    console.log(secretKey,"secret key while decoding")
    // useEffect(()=>{
    //     const fetchUserDecryptedId=async()=>{
    //         const response = await axios.get('http://localhost:5000/Login/userDecryptedId', {
    //             params: { encryptedUserId }
    //         });
    //         console.log(response,"this is the response from decrypting the user id from bacend");

    //     }
    //     fetchUserDecryptedId();

    // },[])
    useEffect(() => {
        const fetchUserDecryptedId = async () => {
            const encryptedUserId=userIdTesting
            try {
                const response = await axios.get('http://localhost:5001/Login/userDecryptedId', {
                    params: { encryptedUserId }
                });
                console.log(response.data, "Response from backend");
                setDecryptedUserIdState(response.data.userId); // Update state with decrypted user ID
            } catch (error) {
                console.error('Error fetching decrypted user ID:', error);
            }
        };

        if (userIdTesting) {
            fetchUserDecryptedId();
        }
    }, [userIdTesting]);
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