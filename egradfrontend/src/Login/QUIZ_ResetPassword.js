
import React from 'react'
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'


function QUIZ_ResetPassword() {
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const {id, token} = useParams()

 const handleSubmit = async (e) => {
   e.preventDefault();

   try {
     const response = await fetch(
       `http://localhost:5001/ughomepage_banner_login/OTS_reset_password/${id}/${token}`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ password }),
       }
     );

     if (response.ok) {
       const data = await response.json();
       if (data.Status === "Success") {
         navigate("/uglogin");
       }
     } else {
       console.error("Unexpected response from server:", response.statusText);
     }
   } catch (error) {
     console.error("Error during request:", error);
   }
 };


    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h4>Reset Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>New Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Update
          </button>
          </form>
        
      </div>
    </div>
    )
}

export default QUIZ_ResetPassword;