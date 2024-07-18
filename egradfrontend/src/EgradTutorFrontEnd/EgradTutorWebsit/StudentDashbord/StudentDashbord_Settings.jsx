import React, { useEffect, useState } from 'react'
import BASE_URL from '../../../apiConfig';
import axios from 'axios';
import '../../EgradTutorWebsit/StudentDashbord/Style/StudentDashbord_Settings.css'
import { useTIAuth } from '../../../TechInfoContext/AuthContext';
const StudentDashbord_Settings = ({ usersData, decryptedUserIdState }) => {
  // form states
  const [otp, setOtp] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorsOfForm, setErrorsOfForm] = useState("");
  const [showChangePasswordForm, setShowPasswordForm] = useState(false)
  const [userNameFromContext, setUserNameFromContext] = useState("");
  const [userDetailsForEdit, setUserDetailsForEdit] = useState([])
  const [regIdOfUser, setRegIdOfUser] = useState(null)
  const [tiAuth] = useTIAuth();
const[updateUserName,setUpdateUserName]=useState("");
const[updateUserNumber,setUpdateUserNumber]=useState("");
  // useEffect for getting the role
  // useEffect(()=>{
  //   const { userData } = tiAuth;
  //   if (!userData) {
  //     return <div>Loading...</div>;
  //   }
  //  const userName = userData.users[0].username;
  //  console.log(userData.users[0].studentregistationId,"This is the user's dasta  ")
  //  setUserNameFromContext(userName)
  //  setRegIdOfUser(userData.users[0].studentregistationId);
  //  console.log(regIdOfUser,"This is the userData.users[0].studentregistationId")
  // console.log(userName,"ddddddddddddddddddddddddddddddddddddddd")
  // })

  useEffect(() => {
    const { userData } = tiAuth;
    if (userData) {
      const userName = userData.users[0].username;
      const studentRegId = userData.users[0].studentregistationId;

      setUserNameFromContext(userName);
      // setRegIdOfUser(studentRegId);

      console.log(studentRegId, "This is the user's data");
      console.log(userName, "User Name");
    }
  }, [tiAuth]);
  useEffect(() => {
    const { userData } = tiAuth;
    if (userData) {
      // const studentRegId = userData.users[0].studentregistationId;
      const studentRegId = userData.users[0].studentregistationId;
      setRegIdOfUser(studentRegId);
      console.log(regIdOfUser, "From seperate useeffect")
    }
  }, []);
  useEffect(() => {
    console.log(regIdOfUser, "From separate useEffect");
  }, [regIdOfUser]);
  const handleChangePassword = async (decryptedUserId) => {
    console.log(decryptedUserId, "this is decryptedUserId from handleChangePassword");
    //  i need to send otp to the user reg email if he selects yes from the alert
    const userConfirmed = window.confirm("Do you want to change your password?")
    if (userConfirmed) {
      try {
        const response = await axios.post(`${BASE_URL}/studentSettings/changePasswordUsingOTP/${decryptedUserId}`)
        console.log(response.status, response.data)
        if (response.status === 200) {
          alert("OTP has been sent successfully")
          setOtp(true)
          setShowPasswordForm(true)
        }
        else {
          alert("Failed to send the OTP to registered Email. Please try again.")
        }
      } catch (error) {
        console.log("Error sending OTP", error)
        alert("An error occurred while sending the OTP. Please try again")
      }
    }
  }
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorsOfForm("New password and Confirm password do not match")
      return;
    }


    try {
      const response = await axios.post(`${BASE_URL}/studentSettings/verifyOTP`, {
        userId: decryptedUserIdState,
        otp,
        newPassword
      })
      console.log(response, "response from backend");
      if (response.status === 200) {
        alert("Password changed successfully")
      } else {
        alert("Error changing password")
      }
    } catch (error) {
      console.log("error while posting the password", error)
      alert("Can't post the details")
    }
  }
  const handleClose = () => {
    setShowPasswordForm(false)
  }
  useEffect(() => {
    const fetchStudentDetailsForUpdate = async () => {
      const response = await axios.get(`${BASE_URL}/studentSettings/fetchStudentDetailsForEdit/${regIdOfUser}`);
      console.log(response, "22222222222");
      setUserDetailsForEdit(response.data);
      setUpdateUserName(response.data[0].candidateName)
      setUpdateUserNumber(response.data[0].contactNo)
      console.log(userDetailsForEdit, "setUserDetailsForEditvvvvvvvvvvvvv");


    }
    if (regIdOfUser) {
      fetchStudentDetailsForUpdate();
    }
  }, [regIdOfUser])

  useEffect(() => {
    console.log(userDetailsForEdit, "this is from the usee effect")
  }, [userDetailsForEdit])
const handleUpdateStudentData=async(e)=>{
  // have to post the data 
  e.preventDefault();
  try {
    const response=await axios.post(`${BASE_URL}/studentSettings/studentNameNumberUpdate/${regIdOfUser}`,{
      userName:updateUserName,
      userNumber:updateUserNumber
    });
    console.log(response.data,"response form the backend");
    if(response.status===200){
      alert(response.data.message)
    }
    else{
      alert(response.data.error)
    }

  } catch (error) {
    console.log(error)
  }
  // alert it back

}
const handleUseNameChange=(e)=>{
  setUpdateUserName(prev=>e.target.value)
  console.log(updateUserName)
}

const handleUserNumberChange=(e)=>{
  setUpdateUserNumber(prev=>e.target.value)
  console.log(updateUserNumber)
}

  return (
    <div className="dashboard_settings">
      {usersData.users && usersData.users.length > 0 && (
        <ul className="dashboard_settings_user_details">
          {usersData.users.map((user) => (
            <div className='dashboard_settings_user_details_container'>
              <p className='users_user_name'> {user.username}</p>
              <div className='users_user_profile_container'>
                <img className="users_profile_img" src={`${BASE_URL}/uploads/studentinfoimeages/${user.UplodadPhto}`} alt={`no img${user.UplodadPhto}`} />
                {/* <img src="http://localhost:3000/uploads/your-image.jpg" alt="" /> */}
              </div>
            </div>
          ))}
          {/* <img src={`${BASE_URL}/uploads/studentinfoimeages/${img}`} alt="nnnnnnnn" /> */}
        </ul>
      )}

      {showChangePasswordForm ? (
        <div className="change-password-container">
          <form className="change-password-form" onSubmit={(e) => handleChangePasswordSubmit(e)}>
            <div>
              <div>NOTE: OTP IS VALID FOR TEN MINUTES ONLY</div>
              <label htmlFor="otp">Enter your Code (sent through Email):</label>
              <input
                type="number"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newPassword">Enter new password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            {errorsOfForm && (
              <div className="error-message">{errorsOfForm}</div>
            )}
            <div className="button-container">
              <button type="submit">Change Password</button>
              <button type="button" className="close-button" onClick={() => handleClose()}>Close</button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={() => handleChangePassword(decryptedUserIdState)}>Change Password ?</button>
      )}
      <h3>This is the username from the context globally so that every component can access..........</h3>
      <p>{userNameFromContext}</p>
      <div>
        <div>
          {userDetailsForEdit.map((student, index) => (
            <div key={index} className="student-details">
              <h2>{student.candidateName}</h2>
              <p>Date of Birth: {student.dateOfBirth}</p>
              <p>Gender: {student.Gender}</p>
              <p>Category: {student.Category}</p>
              <p>Email: {student.emailId}</p>
              {/* Render other details as needed */}
            </div>
          ))}
        </div>
      </div>
      <form action="" onSubmit={handleUpdateStudentData}>
        <input type="text" value={updateUserName} onChange={handleUseNameChange}/>
        <input type="number" value={updateUserNumber} onChange={handleUserNumberChange}/>
        <button type='submit'>Submit</button>
      </form>

    </div>
  )
}

export default StudentDashbord_Settings