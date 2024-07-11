import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Style/ChangePasswordCss.css'
const PasswordChangeForm = () => {
  const { user_Id } = useParams();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    console.log(`Received user_Id: ${user_Id}`);
  }, [user_Id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_Id, oldPassword, newPassword, confirmPassword }),
      });

      if (response.ok) {
        alert('Password updated successfully');
        navigate('/UserLogin');
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
        setAttempts(attempts + 1);
        if (attempts >= 2) {
          await handleResendPassword();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating password');
    }
  };

  const handleResendPassword = async () => {
    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/resend-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_Id }),
      });

      if (response.ok) {
        alert('New code sent to your registered email');
        setAttempts(0);
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error resending password');
    }
  };

  return (
    <div className="userLoginPagePC ">
      <div className="userLoginSubContainer">

        <div>
          <h1>Change Password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='passwordChangeFormGroup'>
            <label>Code</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className='passwordChangeFormGroup'>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className='passwordChangeFormGroup'>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className='passwordChangeFormGroup'>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      {attempts >= 3 && (
        <button onClick={handleResendPassword}>Resend Password</button>
      )}
    </div>
  );
};

export default PasswordChangeForm;
