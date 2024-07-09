import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../assets/actions/authActions';
import { AuthContext } from '../EgradTutorFrontEnd/AuthContext';
import axios from '../api/axios';
import CryptoJS from 'crypto-js';
import { useTIAuth } from '../TechInfoContext/AuthContext';
// const LOGIN_URL ='/UserLogin'
// import CryptoJS from 'crypto-js';
// import { decryptData, encryptData } from './CryptoUtils/CryptoUtils';
const UserLogin = () => {
  const[tiAuth,settiAuth]=useTIAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Current tiAuth state:", tiAuth);
  }, [tiAuth]);
  const encryptUserId = (userId) => {
  const secretKey=process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
    return CryptoJS.AES.encrypt(userId.toString(), secretKey).toString();
  };

  const secretKey=process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
  console.log(secretKey,"from front end env ")
  
  const handleReactLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/Login/login', 
        JSON.stringify({ email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      console.log("Response Data:", response.data);
  
      const { user_Id, role, accessToken } = response.data;
      console.log("Extracted Data:", { user_Id, role, accessToken });
      if (!user_Id) {
        throw new Error('User ID is missing');
      }
      if (role === 'User') {
        console.log("User role detected:", user_Id, role, accessToken);
        console.log("encryting data using cru[t",user_Id,secretKey,)

        // const encryptedUserId=encryptUserId(user_Id)
        // console.log("encrypting data using cru[t",user_Id,secretKey,"and after encryption",encryptedUserId)
        const newAuthState = {
          ...tiAuth,
          user: user_Id,
          token: accessToken
        };
        console.log("New Auth State:", newAuthState);
        settiAuth(newAuthState);

        localStorage.setItem("tiAuth", JSON.stringify(newAuthState));

        console.log("Stored in localStorage and useContext:", tiAuth);
        const encodedUserId = encodeURIComponent((user_Id));
        navigate(`/testingUrl/${encodedUserId}`);
      } else if (role === 'Admin' || role === 'SuperAdmin') {
        alert('You don\'t have access to this page');
      } else {
        alert('Unauthorized');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Invalid email or password');
    }
  };
  

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };




  return (
    <div className="container mt-4">
      <h1>User Login</h1>
      <form onSubmit={handleReactLoginSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={handleForgotPassword}>Forgot Password</button>
    </div>
  );
};

export default UserLogin;
