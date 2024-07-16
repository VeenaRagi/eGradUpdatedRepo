
import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'


function QUiZ_ForgotPassword() {
  const [email, setEmail] = useState("");
    const navigate = useNavigate()

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5001/ughomepage_banner_login/QUiZ_ForgotPassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      // Handle non-successful response
      console.error("Unexpected response from server:", response);
      return;
    }

    const data = await response.json();

    if (data.Status === "Success") {
      console.log("Reset password email sent successfully");
      navigate("/uglogin");
    } else {
      console.error("Unexpected response from server:", data);
    }
  } catch (error) {
    console.error("Error during request:", error);
  }
};


    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h4>Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Send
          </button>
          </form>
        
      </div>
    </div>
    )
}

export default QUiZ_ForgotPassword;