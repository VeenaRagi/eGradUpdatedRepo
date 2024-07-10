import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/Login/login', { email, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      if (role === 'superadmin') {
        navigate('/superadmin-dashboard');
      } else if (role === 'User') {
        console.log('User access is not allowed on this page');
        alert('You dont have access to this page');
      } else if (role === 'Admin') {
        console.log(' Admin access is not allowed on this page');
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
              <h1>Super Admin Login</h1>
            </div>
            <form onSubmit={handleSubmit} className='userLoginForm' >
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
                <label>Password</label>
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
  );
};

export default SuperAdminLogin;
