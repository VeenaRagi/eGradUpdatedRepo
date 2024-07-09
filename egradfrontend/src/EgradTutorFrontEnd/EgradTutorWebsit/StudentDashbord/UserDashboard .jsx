import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTIAuth } from '../../../TechInfoContext/AuthContext';
const UserDashboard = () => {
  const { userId } = useParams();
  const [tiAuth,settiAuth] = useTIAuth()
  // Use userId as needed in your component
  const navigate=useNavigate();

  const handleLogOut=()=>{
    settiAuth({
      ...tiAuth,
      user:null,
      token:""
    })
    localStorage.removeItem('tiAuth')
    // localStorage.removeItem("user")
    navigate('/')
  }
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>User ID: {userId}</p>

      <pre>
        {JSON.stringify(tiAuth, null, 4)}
      </pre>
      <button onClick={handleLogOut}>Log Out</button>
    </div> 
  );
};

export default UserDashboard;
