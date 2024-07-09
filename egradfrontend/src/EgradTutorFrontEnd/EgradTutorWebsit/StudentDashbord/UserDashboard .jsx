import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTIAuth } from '../../../TechInfoContext/AuthContext';
// import { decryptData } from '../../../../../egradServer/CryptoUtils/CryptoUtils';
const UserDashboard = () => {
  const { user_Id } = useParams();
  const [tiAuth, settiAuth] = useTIAuth()
  // Use userId as needed in your component
  const navigate = useNavigate();
  console.log(user_Id, "user id from the params");

  // let userIdDecrypted
  console.log(user_Id, "thisis the userid from the params");
  // try {
  //   const decryptedUserId = decryptData(decodeURIComponent(user_Id))
  //   userIdDecrypted = decryptedUserId;
  //   console.log(userIdDecrypted, "userIdDecrypted");
  // } catch (error) {
  //   console.error('Error decrypting user ID:', error);
  // }

  const handleLogOut = () => {

    settiAuth({
      ...tiAuth,
      user: null,
      token: ""
    })
    localStorage.removeItem('tiAuth')
    // localStorage.removeItem("user")
    navigate('/')
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>User ID: {user_Id}</p>

      <pre>
        {JSON.stringify(tiAuth, null, 4)}
      </pre>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default UserDashboard;
