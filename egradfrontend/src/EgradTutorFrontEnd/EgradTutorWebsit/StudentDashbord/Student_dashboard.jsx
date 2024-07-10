import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTIAuth } from "../../../TechInfoContext/AuthContext";
import axios from "../../../api/axios";

const Student_dashboard = () => {

// -----------------PARAMS_DECLARATION_START---------------
const { userIdTesting } = useParams();
// -----------------PARAMS_DECLARATION_END-----------------

// -----------------CONST_VARIABLES_DECLARATION_START---------------
const navigate = useNavigate();
const [decryptedUserIdState, setDecryptedUserIdState] = useState("");
const [tiAuth, settiAuth] = useTIAuth();
const secretKey = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
// -----------------CONST_VARIABLES_DECLARATION_END---------------
 


//----------------LOGIN_FUNCTIONALITY_START------------------
  useEffect(() => {
    const fetchUserDecryptedId = async () => {
      const encryptedUserId = userIdTesting;
      try {
        const response = await axios.get(
          "http://localhost:5001/Login/userDecryptedId",
          {
            params: { encryptedUserId },
          }
        );
        console.log(response.data, "Response from backend");
        setDecryptedUserIdState(response.data.userId); // Update state with decrypted user ID
      } catch (error) {
        console.error("Error fetching decrypted user ID:", error);
      }
    };

    if (userIdTesting) {
      fetchUserDecryptedId();
    }
  }, [userIdTesting]);
  
  console.log(userIdTesting, "3222222222222222222222");
  console.log(secretKey, "secret key while decoding");

  const handleLogOut = () => {
    settiAuth({
      ...tiAuth,
      user: null,
      token: "",
    });
    localStorage.removeItem("tiAuth");
    navigate("/userlogin");
  };
//----------------LOGIN_FUNCTIONALITY_END------------------








  return (
    <div>
      SDAfterLogin <br />
      {userIdTesting} <br />
      {decryptedUserIdState} <br />
      <button onClick={handleLogOut}>Log out</button>
      <div>
        
      </div>
    </div>
  );
};

export default Student_dashboard;
