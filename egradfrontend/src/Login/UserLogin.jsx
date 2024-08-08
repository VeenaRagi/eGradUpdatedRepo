import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BASE_URL from "../apiConfig";
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useTIAuth } from '../TechInfoContext/AuthContext';
import '../styles/UserLoginPage/userLoginPageCss.css'

const UserLogin = () => {

  const [tiAuth, settiAuth] = useTIAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Current tiAuth state:", tiAuth);
  }, [tiAuth]);
  const encryptUserId = (userId) => {
    const secretKey = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
    return CryptoJS.AES.encrypt(userId.toString(), secretKey).toString();
  };

  const secretKey = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
  console.log(secretKey, "from front end env ")

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

      const { user_Id, role, accessToken, decryptedId,userDetails,Branch_Id,encryptedBranchId,branchId} = response.data;
      console.log("Extracted Data:", { user_Id, role, accessToken,userDetails,Branch_Id,encryptedBranchId,branchId });
      if (!user_Id) {
        throw new Error('User ID is missing');
      }
      if (role === 'User') {
        console.log("User role detected:", user_Id, role, accessToken,userDetails);
        console.log("encryting data using cru[t", user_Id, secretKey,userDetails)

        // const encryptedUserId=encryptUserId(user_Id)
        // console.log("encrypting data using cru[t",user_Id,secretKey,"and after encryption",encryptedUserId)
        const newAuthState = {
          ...tiAuth,
          user: user_Id,
          token: accessToken,
          role: role,
          userDecryptedId: decryptedId,
          isLoggedIn: true,
          userData:userDetails,
          userBranchId:encryptedBranchId,
          decryptedBranchId:branchId
        };
        console.log("New Auth State:", newAuthState);
        settiAuth(newAuthState);

        localStorage.setItem("tiAuth", JSON.stringify(newAuthState));

        console.log("Stored in localStorage and useContext:", tiAuth);
        const encodedUserId = encodeURIComponent((user_Id));
        const encodedBranchId=encodeURIComponent((encryptedBranchId))
        console.log("first")
        navigate(`/Student_dashboard/${encodedUserId}/${encodedBranchId}`);

        // Get the current time
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        // Determine the greeting based on the current hour
        let greeting = "";
        if (currentHour < 12) {
          greeting = "Good Morning,";
        } else if (currentHour < 18) {
          greeting = "Good Afternoon,";
        } else {
          greeting = "Good Evening,";
        }

        // Set the greeting message in localStorage
        localStorage.setItem("greeting", greeting);

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


  // const handleForgotPassword = () => {
  //   navigate('/forgot-password');
  // };

  const [welcomeimage, setWelcomeImage] = useState(null);

  const fetchWelcomeImage = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/LandingPageHeader/welcomeimage`,
        {
          responseType: "arraybuffer",
        }
      );
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setWelcomeImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };


  useEffect(() => {
    fetchWelcomeImage();
  }, []);

  return (
    <div className="">
      <div className='userLoginPagePC'>
        <div className='userLoginSubContainer'>
          <div className='formAndHeaddingContainer'>
            <div className='logoInLogin'> < img src={welcomeimage} className='userlogoimg' alt="welcomeCurrent" /></div>
        
            <div className='loginPageHeadingContainer'>
              <h1>User Login</h1>
            </div>
            <div>
              <form onSubmit={handleReactLoginSubmit} className='userLoginForm'>
                <div className='formGroup'>
                  <label>Email Id:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder='Enter your Email Id here'
                  />
                </div>
                <div className='formGroup'>
                  <label>Password :</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder='Enter your Password here'
                  />
                </div>
                <div className='formGroup'>
                  <button type="submit">Login</button>
                </div>
              </form>
              <div className='userLoginFPDiv'>
              
              <a href='/forgot-password'>Forgot Password?</a>

                </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
