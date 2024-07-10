import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTIAuth } from "../../../TechInfoContext/AuthContext";
import axios from "../../../api/axios";
import StudentDashbord_Header from "./StudentDashbord_Header";
import Student_dashboard_Home from "./Student_dashboard_Home";
import StudentDashbord_MyCourses from "./StudentDashbord_MyCourses";
import StudentDashbord_BuyCourses from "./StudentDashbord_BuyCourses";
import StudentDashbord_MyResults from "./StudentDashbord_MyResults";
import StudentDashbord_Bookmarks from "./StudentDashbord_Bookmarks";
import StudentDashbord_Settings from "./StudentDashbord_Settings";

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
        <div>
          <StudentDashbord_Header />
        </div>
        <div>
          <Student_dashboard_Home />
          <StudentDashbord_MyCourses />
          <StudentDashbord_BuyCourses />
          <StudentDashbord_MyResults />
          <StudentDashbord_Bookmarks />
          <StudentDashbord_Settings />
        </div>
      </div>
    </div>
  );
};

export default Student_dashboard;
