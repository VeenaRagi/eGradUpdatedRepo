import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../assets/actions/authActions';
import { AuthContext } from '../EgradTutorFrontEnd/AuthContext';
import axios from '../api/axios';
import { useTIAuth } from '../TechInfoContext/AuthContext';
// const LOGIN_URL ='/UserLogin'
import CryptoJS from 'crypto-js';
const UserLogin = () => {
  const[tiAuth,settiAuth]=useTIAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  useEffect(() => {
    console.log("Current tiAuth state:", tiAuth);
  }, [tiAuth]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const { user_Id, role } = await dispatch(loginUser(email, password));
  //     if (role === 'User') {
  //       navigate(`/user-dashboard/${user_Id}`);
  //     } else if (role === 'Admin' || role === 'SuperAdmin') {
  //       alert('You don\'t have access to this page');
  //       const response=await axios.post(LOGIN_URL,
  //         JSON.stringify({email,password},
  //           {
  //             headers:{}
  //           }
  //         )
  //       )


  //     } else {
  //       alert('Unauthorized');
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     alert('Invalid email or password');
  //   }
  // };
  

  const handleReactLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/Login/login', 
        JSON.stringify({ email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log(response.data,"this is response. dataaaaaaaaaaaaaaaaa")
      const { user_Id, role,accesToken } = response.data;
      if (role === 'User') {
        console.log(user_Id,role,accesToken)

        const newAuthState = {
          ...tiAuth,
          user: user_Id,
          token: accesToken
        };
        console.log(newAuthState,"1111111111")
        settiAuth(newAuthState);
        localStorage.setItem("tiAuth",JSON.stringify(newAuthState))
        console.log("set to the use context to user id when user is logged in using the authcontext",tiAuth)
        navigate(`/user-dashboard/${user_Id}`);
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
