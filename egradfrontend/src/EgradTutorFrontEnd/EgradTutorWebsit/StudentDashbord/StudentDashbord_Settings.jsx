import React, { useEffect, useState } from 'react'
import BASE_URL from '../../../apiConfig';
import axios from 'axios';
const StudentDashbord_Settings = ({ usersData, decryptedUserIdState }) => {
  // form states
  const [otp, setOtp] = useState(false);
  const[newPassword,setNewPassword]=useState("");
    const[confirmNewPassword,setConfirmNewPassword]=useState("");
const[errorsOfForm,setErrorsOfForm]=useState("");

  const [showChangePasswordForm, setShowPasswordForm] = useState(false)
  const handleChangePassword = async (decryptedUserId) => {
    console.log(decryptedUserId, "this is decryptedUserId from handleChangePassword");
    //  i need to send otp to the user reg email if he selects yes from the alert
    const userConfirmed = window.confirm("Do you want to change your password?")
    if (userConfirmed) {
      try {
        const response = await axios.post(`${BASE_URL}/studentSettings/changePasswordUsingOTP/${decryptedUserId}`)
        console.log(response.status,response.data)
        if (response.status === 200) {
          alert("OTP has been sent successfully")
          // setOtp(true)
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
const handleChangePasswordSubmit=async(e)=>{
e.preventDefault();
if(newPassword!==confirmNewPassword){
  setErrorsOfForm("New password and Confirm password do not match")
  return;
}


  try {
    const response=await axios.post(`${BASE_URL}/studentSettings/verifyOTP`,{
      userId:decryptedUserIdState,
      otp,
      newPassword
    })
    console.log(response,"response from backend");
    if(response.status===200){
      alert("Password changed successfully")
    }else{
      alert("Error changing password")
    }
  } catch (error) {
    console.log("error while posting the password",error)
    alert("Can't post the details")
  }
}
const handleClose=()=>{
  setShowPasswordForm(false)
}

  return (
    <div>
      StudentDashbord_Settings
      decryptedUserIdState:{decryptedUserIdState}
      {usersData.users && usersData.users.length > 0 && (
        <ul>
          {usersData.users.map((user) => (
            <>
              <p> {user.username}</p>
              <div style={{ height: "250px", width: "250px" }}>
                <img style={{ width: "100%" }} src={`${BASE_URL}/uploads/studentinfoimeages/${user.UplodadPhto}`} alt={`no img${user.UplodadPhto}`} />
              </div>
            </>
          ))}
        </ul>
      )}
      {showChangePasswordForm ?(
        <form action="" onSubmit={(e)=>handleChangePasswordSubmit(e)} >
          <div>
            <div>NOTE: OTP IS VALID FOR TEN MINUTES ONLY</div>
            <label htmlFor="">Enter your Code (sent through Email):</label>
            <input type="number" value={otp} onChange={(e)=>{setOtp(e.target.value)}}/>
          </div>
          <div>
            <label htmlFor="">Enter new password</label>
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
          </div>
          <div>
            <label htmlFor="">Confirm New Password</label>
            <input type="password" value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)}/>
          </div>
          {errorsOfForm && (
            <div style={{color:"red"}}>{errorsOfForm}</div>
          )}
          <button type='submit'>Change Password</button>
          <button onClick={()=>handleClose()}>Close</button>
        </form>
      ):
      <button onClick={() => handleChangePassword(decryptedUserIdState)}>Change Password ?</button>

      }
    </div>
  )
}

export default StudentDashbord_Settings