import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/send-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setCodeSent(true);
        alert('Code sent to your email');
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
    //   console.error('Error sending code:', error);
      alert('Error sending code');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // console.log('Reset password request:', { email, code, newPassword });

    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (response.ok) {
        alert('Password reset successfully');
        navigate('/UserLogin');
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
    //   console.error('Error resetting password:', error);
      alert('Error resetting password');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Forgot Password</h1>
      {!codeSent ? (
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSendCode}>Send Code</button>
        </div>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div>
            <label>Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
