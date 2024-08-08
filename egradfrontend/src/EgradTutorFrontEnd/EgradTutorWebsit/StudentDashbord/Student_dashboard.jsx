import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTIAuth } from "../../../TechInfoContext/AuthContext";
import axios from "axios";
import StudentDashbord_Header from "./StudentDashbord_Header";
import Student_dashboard_Container from "./Student_dashboard_Container";
import PasswordChangeForm from "../../../Login/PasswordChangeForm";
import UserLogin from "../../../Login/UserLogin";
import BASE_URL from "../../../apiConfig";

const Student_dashboard = () => {
  // -----------------PARAMS_DECLARATION_START---------------
  const { userIdTesting } = useParams();
  // -----------------PARAMS_DECLARATION_END-----------------

  // -----------------CONST_VARIABLES_DECLARATION_START---------------
  const navigate = useNavigate();
  const [decryptedUserIdState, setDecryptedUserIdState] = useState("");
  const [tiAuth, settiAuth] = useTIAuth();
  const [usersData, setUsersData] = useState("");
  const[branchIdFromLS,setBranchIdFromLS]=useState("")
  const [scrollPosition, setScrollPosition] = useState(0);
  const secretKey = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
  // -----------------CONST_VARIABLES_DECLARATION_END---------------

  //----------------LOGIN_FUNCTIONALITY_START------------------
  useEffect(() => {
    const fetchUserDecryptedId = async () => {
      const encryptedUserId = userIdTesting;
      const encodedUserId = encodeURIComponent(encryptedUserId);
      try {
        const response = await axios.get(
          `http://localhost:5001/Login/userDecryptedId/${encodedUserId}`,
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
          userData: response.data, // assuming response.data contains all necessary user data
        });
      } catch (error) {
        console.error("Error fetching decrypted user ID:", error);
      }
    };

    if (userIdTesting) {
      fetchUserDecryptedId();
    }
  }, [userIdTesting]);


useEffect(() => {
  // Assuming tiAuth contains the user object
  if (tiAuth.userData) {
    const { userId, role, users, decryptedTosendFrontEnd } = tiAuth.userData;

    console.log("User ID:", userId);
    console.log("Role:", role);
    console.log("Decrypted ID to Send Frontend:", decryptedTosendFrontEnd);

    // If users array contains the details you need
    if (users && users.length > 0) {
      const user = users[0]; // Assuming there's only one user or you want the first one
      console.log("User Details:''''''''''''''''''''''''''''''''''''''''''''", user.Branch_Id);
      setBranchIdFromLS(user.Branch_Id);
      console.log(branchIdFromLS,)
      // setUserDetails(user);
    }
  }
}, [tiAuth]);

  const handleLogOut = () => {
    settiAuth({
      ...tiAuth,
      user: null,
      token: "",
      userDecryptedId:"",
      isLoggedIn: false,
    });
    localStorage.removeItem("tiAuth");
    navigate("/userlogin");
  };

  //----------------LOGIN_FUNCTIONALITY_END------------------

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


    
  // const { Branch_Id } = useParams();

// const Branch_Id =2
// const BranchId

// const [branches, setBranches] = useState([]);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const fetchBranches = async () => {
//     if (!Branch_Id) return;

//     try {
//       const response = await fetch(`${BASE_URL}/LandingPageExamData/branch/${Branch_Id}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setBranches(data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//       setLoading(false);
//     }
//   };

//   fetchBranches();
// }, [Branch_Id]);
// console.log("shinchannnnnnnnnn")
// console.log('Branch_Id', Branch_Id);

  return (
    <>
      {/* SDAfterLogin <br />
      {userIdTesting} <br />
      {decryptedUserIdState} <br /> */}

      {tiAuth.isLoggedIn === true ? (
        <div>
          <div
            id="quizhome"
            style={{
              backgroundColor: scrollPosition > 10 ? "white" : "",
              transition: "background-color 0.3s ease-in-out",
            }}
          >
            {/* <StudentDashbord_Header
              usersData={usersData}
              tiAuth={tiAuth}
              settiAuth={settiAuth}
            /> */}
          </div>
          <Student_dashboard_Container

            usersData={usersData}
            decryptedUserIdState={decryptedUserIdState}
            // Branch_Id={Branch_Id}
            branchIdFromLS={branchIdFromLS}
            // decryptedBranchId={decryptedBranchId}
          />
        </div>
      ) : (
        <UserLogin />
      )}
    </>
  );
};

export default Student_dashboard;
