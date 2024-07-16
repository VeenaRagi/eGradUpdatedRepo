

// import React, { useState, useEffect } from "react";


// // ------------------ icons -----------------------
import { MdAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

// import { Link, Navigate } from "react-router-dom";
// import { NavData } from "../components/ug_homepage/components/Header/NavData";
// // ------------css ---------------
// import "./Login.css";

// // ------------ img ---------------
// import loginlogo from "./asserts/loginlogo.jpeg";
// import { nav } from "../Exam_Portal_QuizApp/Data/Data";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

// //main
// // const handleLogin = async (e) => {
// //   e.preventDefault();

// //   try {
// //     const response = await fetch('http://localhost:5001/ughomepage_banner_login/login', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({ email, password }),
// //       credentials: 'same-origin',
// //     });

// //     if (response.ok) {
// //       const responseData = await response.json();
// //       const { token, user } = responseData;

// //       localStorage.setItem('token', token); // Store the token in localStorage
// //       localStorage.setItem('userRole', user.role);
// //       localStorage.setItem('isLoggedIn', 'true');
// //       setMessage('Login successful!');
// //       setEmail('');
// //       setPassword('');
// //       window.location.href = '/UgadminHome'; // Redirect to the desired page after successful login
// //     } else {
// //       const data = await response.json();
// //       throw new Error(data.error || 'Failed to login');
// //     }
// //   } catch (error) {
// //     setMessage(error.message || 'Error logging in');
// //     console.error('Error:', error);
// //   }
// // };

// //practise
// const handleLogin = async (e) => {
//   e.preventDefault();

  
//   try {
//     const response = await fetch('http://localhost:5001/ughomepage_banner_login/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//       credentials: 'same-origin',
//     });

//     if (response.ok) {
//       const responseData = await response.json();
//       const { token, user } = responseData;

//       localStorage.setItem('token', token); // Store the token in localStorage
//       localStorage.setItem('userRole', user.role);
//       localStorage.setItem('isLoggedIn', 'true');

//       // Get the current time
//       const currentTime = new Date();
//       const currentHour = currentTime.getHours();

//       // Determine the greeting based on the current hour
//       let greeting = '';
//       if (currentHour < 12) {
//         greeting = 'Good Morning,';
//       } else if (currentHour < 18) {
//         greeting = 'Good Afternoon,';
//       } else {
//         greeting = 'Good Evening,';
//       }

//       // Set the greeting message in localStorage
//       localStorage.setItem('greeting', greeting);

//       setMessage('Login successful!');
//       setEmail('');
//       setPassword('');
//       window.location.href = '/UgadminHome'; // Redirect to the desired page after successful login
//     } else {
//       const data = await response.json();
//       throw new Error(data.error || 'Failed to login');
//     }
//   } catch (error) {
//     setMessage(error.message || 'Error logging in');
//     console.error('Error:', error);
//   }
// };
// const [isLoggedIn, setIsLoggedIn] = useState(false);
//    const [userData, setUserData] = useState({});

//    console.log(userData);
//    useEffect(() => {
//      const checkLoggedIn = () => {
//        const loggedIn = localStorage.getItem("isLoggedIn");
//        if (loggedIn === "true") {
//          setIsLoggedIn(true);
//          fetchUserData();
//        }
//      };
//      checkLoggedIn();
//    }, []);

//    const fetchUserData = async () => {
//      try {
//        const token = localStorage.getItem("token");
//        const response = await fetch(
//          "http://localhost:5001/ughomepage_banner_login/user",
//          {
//            headers: {
//              Authorization: `Bearer ${token}`,
//            },
//          }
//        );

//        if (!response.ok) {
//          // Token is expired or invalid, redirect to login page
//          localStorage.removeItem("isLoggedIn");
//          localStorage.removeItem("token");
//          setIsLoggedIn(false);
//          Navigate("/uglogin"); // Assuming you have the 'navigate' function available

//          return;
//        }

//        if (response.ok) {
//          // Token is valid, continue processing user data
//          const userData = await response.json();
//          setUserData(userData);
//          // ... process userData
//        }
//      } catch (error) {
//        console.error("Error fetching user data:", error);
//      }
//    };
//   //  if (isLoggedIn == true) {
//   //    return <Navigate to="/student_dashboard" />;
//   //  }

  
//  if (isLoggedIn == true) {
//   setIsLoggedIn(isLoggedIn);
//   // alert("Are you sure to logout")
//    return <Navigate to="/UgadminHome" />;
//  }
//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userRole");
//     window.location.href = "/uglogin";
//   };

//   return (
//     <>
//       {isLoggedIn ? (
//         <>
//           {" "}
//           <div>
//             <p>Are you sure to logout</p>
//             <button> yes</button>

//             <button> No</button>
//           </div>
//         </>
//       ) : (
//         <>
//           {/* ------------------ header ------------------- */}
//           <div>
//             <div className="Quiz_main_page_header">
//               {NavData.map((NavData, index) => {
//                 return (
//                   <>
//                     <div key={index} className="Quiz_main_page_navbar">
//                       <div className="Quizzlogo">
//                         <img src={NavData.logo} alt="" />
//                       </div>
//                       {/* <li  className={showcardactive1?"showcardactive":"showcardactivenone"}> */}

//                       <div className="quiz_app_quiz_menu_login_btn_contaioner">
//                         <button style={{ background: "none" }}>
//                           <Link
//                             to="/Exam_portal_home_page"
//                             className="Quiz__home"
//                           >
//                             Home
//                           </Link>
//                         </button>
//                         <div>
//                           {/* <a class="ugQUIz_login_btn" href="/Register">
//                         Registration
//                       </a> */}
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 );
//               })}
//             </div>
//           </div>

//           {/* ------------------ Login ------------------- */}

//           <div className="ug_logincontainer">
//             <div className="ug_logincontainer_box">
//               <h2>Login</h2>

//               <div className="ug_logincontainer_box_subbox">
//                 <div className="loginlogo_img">
//                   <img src={loginlogo} alt="" />
//                 </div>

//                 <div className="login_from_continer">
//                   <form>
//                     {message && (
//                       <p
//                         style={{
//                           color: "green",
//                         }}
//                       >
//                         {message}
//                       </p>
//                     )}
//                     <label>
//                       <MdAlternateEmail />
//                       <input
//                         type="email"
//                         placeholder="Email ID"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </label>

//                     <label>
//                       <FaLock />
//                       <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                       />
//                     </label>
//                     <button type="button" onClick={handleLogin}>
//                       Login
//                     </button>
//                   </form>
//                   <p>
//                     Don't have an account ?
//                     <Link to="/Register">Register here</Link>
//                   </p>

//                   <Link to="/OTS_ForgotPassword">Forgot Password ?</Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Login;



import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
// import { NavData } from "../components/ug_homepage/components/Header/NavData";
import "./Styles/Login.css";
import loginlogo from "./asserts/loginlogo.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5001/ughomepage_banner_login/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const { token, user } = responseData;

      localStorage.setItem("token", token); // Store the token in localStorage
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("isLoggedIn", "true");

      // Get the current time
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      // Determine the greeting based on the current hour
      let greeting = "";
      if (currentHour < 12) {
        greeting = "Good Morning,";
      } else if (currentHour < 18) {
        greeting = "Good Afternoon,";
      } else {
        greeting = "Good Evening,";
      }

      // Set the greeting message in localStorage
      localStorage.setItem("greeting", greeting);

      setMessage("Login successful!");
      setEmail("");
      setPassword("");
      window.location.href = "/UgadminHome"; // Redirect to the desired page after successful login
    } else {
      const data = await response.json();
      throw new Error(data.error || "Failed to login");
    }
  } catch (error) {
    setMessage(error.message || "Error logging in");
    console.error("Error:", error);
  }
};
  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        fetchUserData();
      }
    };
    checkLoggedIn();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/ughomepage_banner_login/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        return <Navigate to="/uglogin" />;
      }

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/uglogin";
  };

  const handleYesClick = () => {
    handleLogout();
  };

  const handleNoClick = () => {
 window.location.href = "/UgadminHome";
     
    // Handle the case where the user clicks 'No'
    // For example, close the dialog or do nothing
  };

  if (isLoggedIn) {
    return (
      <div className="logout">
        <div className="logout-conatiner">
          <p>Are you sure you want to logout ?</p>
          <div>
            <button onClick={handleYesClick}>Yes</button>
            <button onClick={handleNoClick}>No</button>
          </div>
          {/* <button onClick={handleYesClick}>Yes</button>
          <button onClick={handleNoClick}>No</button> */}
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="Quiz_main_page_header">
          {/* {NavData.map((NavData, index) => {
            return (
              <div key={index} className="Quiz_main_page_navbar">
                <div className="Quizzlogo">
                  <img src={NavData.logo} alt="" />
                </div>
                <div className="quiz_app_quiz_menu_login_btn_contaioner">
                  <button style={{ background: "none" }}>
                    <Link to="/Exam_portal_home_page" className="Quiz__home">
                      Home
                    </Link>
                  </button>
                </div>
              </div>
            );
          })} */}
        </div>
      </div>

      <div className="ug_logincontainer">
        <div className="ug_logincontainer_box">
          <h2>Login</h2>
          <div className="ug_logincontainer_box_subbox">
            <div className="loginlogo_img">
              <img src={loginlogo} alt="" />
            </div>
            <div className="login_from_continer">
              <form>
                {message && <p style={{ color: "green" }}>{message}</p>}
                <label>
                  <MdAlternateEmail />
                  <input
                    type="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label>
                  <FaLock />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
                <button type="button" onClick={handleLogin}>
                  Login
                </button>
              </form>
              <p>
                Don't have an account ?{" "}
                <Link to="/Register">Register here</Link>
              </p>
              <Link to="/OTS_ForgotPassword">Forgot Password ?</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

