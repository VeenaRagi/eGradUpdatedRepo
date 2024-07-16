import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTIAuth } from '../TechInfoContext/AuthContext';
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [tiAuth, settiAuth] = useTIAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/Login/login', { email, password });
      console.log("Response Data:", response.data);
      // const { accessToken, role } = response.data;
      const { user_Id, role, accessToken,decryptedId } = response.data;
      const newAuthState = {
        ...tiAuth,
        user: user_Id,
        token: accessToken,
        role:role,
        userDecryptedId:decryptedId,
        isLoggedIn:true
      };
      // localStorage.setItem('token', accessToken);
      settiAuth(newAuthState);
      localStorage.setItem("tiAuth", JSON.stringify(newAuthState));
      const refreshChannel2 = new BroadcastChannel('refresh_channel_for_enabling_buttons');
      refreshChannel2.postMessage('refresh_page_for_enabling_buttons');
      if (role === 'admin') {
        navigate('/Adminpage');
      } else if (role === 'User') {
        console.log('User access is not allowed on this page');
        alert('You dont have access to this page');
      } else if (role === 'SuperAdmin') {
        console.log('Super Admin access is not allowed on this page');
        alert('You dont have access to this page');
      } else {
        alert('Unauthorized');
      }
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="">
      <div className='userLoginPagePC'>
        <div className='userLoginSubContainer'>
          <div className='formAndHeaddingContainer'>
            <div className='loginPageHeadingContainer'>
            <h1>Admin Login</h1>
          </div>
          <div>
            <form onSubmit={handleSubmit} className='userLoginForm'>
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
                <label>Password:</label>
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
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};



export default AdminLogin;
