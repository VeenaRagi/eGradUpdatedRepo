import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTIAuth } from "../../../TechInfoContext/AuthContext";
import axios from "../../../api/axios";
import StudentDashbord_Header from "./StudentDashbord_Header";
import Student_dashboard_Container from "./Student_dashboard_Container";
import PasswordChangeForm from "./PasswordChangeForm";

const Student_dashboard = () => {
  // -----------------PARAMS_DECLARATION_START---------------
  const { userIdTesting } = useParams();
  // -----------------PARAMS_DECLARATION_END-----------------

  // -----------------CONST_VARIABLES_DECLARATION_START---------------
  const navigate = useNavigate();
  const [decryptedUserIdState, setDecryptedUserIdState] = useState("");
  const [tiAuth, settiAuth] = useTIAuth();
  const [usersData, setUsersData] = useState("");

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
        console.log(
          encryptedUserId,
          "this is the user id sending throug params receibing through req.query  "
        );
        console.log(response.data, "Response from backend");
        setDecryptedUserIdState(response.data.userId);
        setUsersData(response.data);
        console.log(usersData); // Update state with decrypted user ID
        settiAuth({
          ...tiAuth,
          user: "",
    token: "",
          isLoggedIn: true,
          userData: response.data // assuming response.data contains all necessary user data
        });
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
  console.log("hiiiiiiiiiiiiiii");
  console.log(usersData);
  const handleLogOut = () => {
    settiAuth({
      ...tiAuth,
      user: null,
      token: "",
      isLoggedIn: false,
    });
    localStorage.removeItem("tiAuth");
    navigate("/userlogin");
  };
  //----------------LOGIN_FUNCTIONALITY_END------------------

  return (
    <div>
      {/* SDAfterLogin <br />
      {userIdTesting} <br />
      {decryptedUserIdState} <br /> */}
     
      {tiAuth.isLoggedIn === true ?(
         <div>
         <StudentDashbord_Header usersData={usersData} tiAuth={tiAuth} />
         <Student_dashboard_Container usersData={usersData} />
         <button onClick={handleLogOut}>Log out</button>
       </div>
      ) : (
        // <button>Login</button>
        <PasswordChangeForm/>
      )}
      
    </div>
  );
};

export default Student_dashboard;
