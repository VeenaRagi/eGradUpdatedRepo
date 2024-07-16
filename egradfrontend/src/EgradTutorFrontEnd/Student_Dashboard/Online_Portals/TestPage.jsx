

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
// import "./styles/SubjectTest.css";
import "./styles/TestPage.css";
import BASE_URL from '../../src/apiConfig'
import { useRef } from "react";
import logo from "./asserts/logo.jpeg";
import { FooterData, nav } from "./Data/Data";
import test_exam_icon from "./asserts/test_exam_icon.png";
import Leftnav from "../Exam_Portal_QuizAdmin/Leftnav";
const TestPage = () => {
  const [testDetails, setTestDetails] = useState([]);
  const [selectedTypeOfTest, setSelectedTypeOfTest] = useState("");
  const [filteredTestData, setFilteredTestData] = useState([]);
  const { courseCreationId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
const user_Id = userData.id;
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}/${user_Id}`
          
        );
        setTestDetails(response.data);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [courseCreationId,user_Id]);

  // const getButtonText = (test_status) => {
  //   if (test_status === 'Completed') {
  //     return 'View Report';
  //   }
  //   else if (test_status === 'incomplete') {
  //     return 'Resume';
  //   }
  //   else {
  //     return 'Start Test';
  //   }
  // };

  // const getButtonText = (
  //   test_status,
  //   userId,
  //   courseCreationId,
  //   testCreationTableId
  // ) => {
  //   // Example conditions, you need to replace them with your actual conditions
  //   if (
  //     test_status === "Completed" &&
  //     userId &&
  //     courseCreationId &&
  //     testCreationTableId
  //   ) {
  //     // Check additional conditions if needed
  //     return "View Report";
  //   } else if (
  //     test_status === "incomplete" &&
  //     userId &&
  //     courseCreationId &&
  //     testCreationTableId
  //   ) {
  //     // Check additional conditions if needed
  //     return "Resume";
  //   } else {
  //     // Default condition if no specific conditions are met
  //     return "Start Test";
  //   }
  // };

  useEffect(() => {
    if (selectedTypeOfTest === "") {
      setFilteredTestData(testDetails);
    } else {
      const filteredData = testDetails.filter(
        (test) => test.typeOfTestName === selectedTypeOfTest
      );
      setFilteredTestData(filteredData);
    }
  }, [testDetails, selectedTypeOfTest]);

  const handleTypeOfTestClick = (typeOfTestName) => {
    setSelectedTypeOfTest(typeOfTestName);
  };

  const handleReset = () => {
    setSelectedTypeOfTest("");
  };
  const firstTestCreationTableId =
    testDetails.length > 0 ? testDetails[0].testCreationTableId : null;
  const [testPageHeading, setTestPageHeading] = useState([]);
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/testDetails/${firstTestCreationTableId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch test details");
        }

        const data = await response.json();

        setTestPageHeading(data.results);
      } catch (error) {
        console.log(error);
        // setError(error.message);
      }
    };

    if (firstTestCreationTableId) {
      fetchTestDetails();
    }
  }, [firstTestCreationTableId]);

  const openPopup = (testCreationTableId) => {
    const newWinRef = window.open(
      `/Instructions/${testCreationTableId}`,
      "_blank",
      "width=1000,height=1000"
    );

    if (newWinRef && !newWinRef.closed) {
      newWinRef.focus();
    }
  };

  // ------------------------------ header-----------------------
  // ---------------------------------- login ---------------------------

  const [showloginQuiz, setShowloginQuiz] = useState(false);
  const [showRegisterQuiz, setShowRegisterQuiz] = useState(false);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const Quiz_login = () => {
    setShowloginQuiz(true);
  };

  const Quiz_register = () => {
    setShowRegisterQuiz(true);
  };

  const Quiz_close = () => {
    setShowloginQuiz(false);
    setShowRegisterQuiz(false);
  };
  const userRole = localStorage.getItem("userRole");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userData, setUserData] = useState({});
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
        `${BASE_URL}/ughomepage_banner_login/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);

        return;
      }

      if (response.ok) {
        // Token is valid, continue processing user data
        const userData = await response.json();
        setUserData(userData);
        // ... process userData
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // const [courses, setCourses] = useState([]);
  const [examsug, setExamsug] = useState([0]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/examsug`)
      .then((res) => {
        setExamsug(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [coursesBtnContainerVisible, setCoursesBtnContainerVisible] =
    useState(false);
  const toggleCoursesBtnContainer = () => {
    setCoursesBtnContainerVisible(!coursesBtnContainerVisible);
  };
  const [showQuizmobilemenu, setShowQuizmobilemenu] = useState(false);

  const QuiZ_menu = () => {
    setShowQuizmobilemenu(!showQuizmobilemenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/uglogin";
  };

  const act_info = () => {
    if (user.role === "admin") {
      window.location.href = "/UgadminHome";
    } else {
      window.location.href = "/userdeatailspage/:id"; // Replace with the URL for user details page
    }
  };

  function getBackgroundColor(type, test) {
    // Check both type and test to determine the background color
    switch (type) {
      case "Chapter Wise Test":
        return "#e6f7e0"; // light green
      case "Full Test":
        return "#ffebee"; // very light pink
      case "Mock Test":
        return "#fff9c4"; // very light yellow
      case "Part Test":
        return "#dcedc8"; // light green
      case "Previous Year Test":
        return "#f5f5dc"; // beige
      case "Subject Wise Test":
        return "#e0f7fa"; // light cyan
      case "Topic Wise Test":
        return "#dcedc8"; // light green (same as Part Test)
      default:
        return "#f5f5f5"; // light gray
    }
  }

  return (
    <div>
      <div className="Quiz_main_page_header">
        {nav.map((nav, index) => {
          return (
            <div key={index} className="Quiz_main_page_navbar">
              <div className="Quizzlogo">
                <img src={nav.logo} alt="" />
              </div>
              {/* <li  className={showcardactive1?"showcardactive":"showcardactivenone"}> */}

              <div
                className={
                  !showQuizmobilemenu
                    ? "Quiz_main_page_navbar_SUBpart Quiz_main_page_navbar_SUBpart_mobile"
                    : "Quiz_main_page_navbar_SUBpart_mobile"
                }
              >
                <ul>
                  {/* <li className="courses_btn_continer">
                    <button
                      className="courses_btn"
                      onClick={toggleCoursesBtnContainer}
                    >
                      Courses
                    </button>
                    {coursesBtnContainerVisible ? (
                      <div className="courses">
                        {examsug.map((e) => {
                          return (
                            <div key={examsug.exam_id}>
                              <a href="">{e.exam_name} </a>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </li> */}

                  {/* <button className="quiz_sign_UP">                   
                    Sign up
                  </button> */}

                  <div className="Quiz_main_page_login_signUp_btn">
                    {/* 
                      <Link to='/'><button onClick={Quiz_login}>
                   Login
                  </button></Link> */}

                    {/* {userRole === "admin"  && (
                      <>
                        <li>
                          <button>
                            <Link to="/Quiz_dashboard">ADMIN Settings</Link>
                          </button>
                        </li>
                      </>
                    )} */}
                  </div>
                </ul>
              </div>

              <div className="quiz_app_quiz_menu_login_btn_contaioner">
                <div>
                  {isLoggedIn === true ? (
                    <>
                      {(userRole === "admin" ||
                        userRole === "ugotsadmin" ||
                        userRole === "ugadmin") && (
                        <>
                          <button id="dropdownmenu_foradim_page_btn">
                            <img
                              title={userData.username}
                              src={userData.imageData}
                              alt={`Image ${userData.user_Id}`}
                            />
                            <div className="dropdownmenu_foradim_page">
                              {/* <Link to={`/userread/${user.id}`} className="btn btn-success mx-2">Read</Link> */}
                              {/* <Link to={`/userdeatailspage/${user.id}`} >Account-info</Link> */}
                              <Link to="/student_dashboard">My profile</Link>
                              <Link onClick={handleLogout}>Logout</Link>
                            </div>
                          </button>
                        </>
                      )}

                      {userRole === "viewer" && (
                        <>
                          <div className="dashbordheder_container">
                            <Link
                              to="http://localhost:3000/Exam_portal_home_page"
                              className="Quiz__home"
                            >
                              Home
                            </Link>

                            <Link
                              to="/student_dashboard"
                              className="Quiz__home"
                            >
                              DashBoard
                            </Link>

                            <button id="dropdownmenu_foradim_page_btn">
                              <img
                                title={userData.username}
                                src={userData.imageData}
                                alt={`Image ${userData.user_Id}`}
                              />
                              <div className="dropdownmenu_foradim_page">
                                {/* <Link to={`/userread/${user.id}`} className="btn btn-success mx-2">Read</Link> */}
                                {/* <Link to={`/userdeatailspage/${user.id}`} >Account-info</Link> */}
                                <Link to="/student_dashboard">My profile</Link>
                                <Link onClick={handleLogout}>Logout</Link>
                              </div>
                            </button>
                          </div>
                        </>
                      )}
                      {/* <button id="dropdownmenu_foradim_page_btn">
                          <img
                            title={userData.username}
                            src={userData.imageData}
                            alt={`Image ${userData.user_Id}`}
                          />
                          <div className="dropdownmenu_foradim_page">
                           
                            <Link to="/Account_info">My profile</Link>
                            <Link onClick={handleLogout}>Logout</Link>
                          </div>
                        </button> */}
                    </>
                  ) : (
                    <>
                      <a class="ugQUIz_login_btn" href="/UgadminHome">
                        Login/Registration
                      </a>
                    </>
                  )}

                  {isLoggedIn === "flase" && (
                    <>
                      <button id="dropdownmenu_foradim_page_btn">
                        {/* {userData.username} */}
                        <div className="dropdownmenu_foradim_page">
                          {/* <Link to={`/userread/${user.id}`} className="btn btn-success mx-2">Read</Link> */}

                          {/* <Link to={`/userdeatailspage/${user.id}`} >Acount-info</Link> */}
                          {/* <Link to="/Account_info">Acount-info</Link>

                            <Link onClick={handleLogout}>Logout</Link> */}
                        </div>
                      </button>
                    </>
                  )}
                </div>
                {/* <div className="quz_menu" onClick={QuiZ_menu}>
                  <div className="lines"></div>
                  <div className="lines"></div>
                  <div className="lines"></div>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
      <div className="test_card_container">
        <div className="test_card_subcontainer">
          <div className="Types_of_Tests">
            {/* <h1>Filtered Test Details</h1> */}
            <ul>
              <div className="">
                <div className="testPageHeading">
                  {testPageHeading && testPageHeading.length > 0 && (
                    <h3>{testPageHeading[0].courseName}</h3>
                  )}
                </div>
                <div className="testpage_menu_reset_btn">
                  <select
                    value={selectedTypeOfTest}
                    onChange={(e) => handleTypeOfTestClick(e.target.value)}
                  >
                    <option value="">Select Type of Test</option>
                    {[
                      ...new Set(
                        testDetails.map((test) => test.typeOfTestName)
                      ),
                    ].map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <button onClick={handleReset}>Reset</button>
                </div>
              </div>
            </ul>
          </div>

          <div>
            {selectedTypeOfTest ? (
              <div className="by_selected_type">
                <div className="testPageHeading">
                  <h4>{selectedTypeOfTest}</h4>
                </div>

                <div className="test_cards">
                  {filteredTestData.map((test, index) => (
                    <div className="test_card_div">
                      <div className="testcard_images_div">
                        <img
                          className="test_card_image"
                          src={test_exam_icon}
                          alt="book"
                        />
                      </div>
                      <div>
                        <div className="test_card_heading">
                          <h4>{test.TestName}</h4>

                          <div className="test_start_time_div">
                            <span
                              id="tcm_icon"
                              class="material-symbols-outlined"
                            >
                              calendar_month
                            </span>
                            <p className="test_date_time">
                              {test.testStartDate}{" "}
                              {test.testStartTime.slice(0, 5)}
                            </p>
                          </div>
                        </div>
                        <p>Total Marks: {test.totalMarks} Marks</p>
                        <p>Test Duration: {test.Duration} Minutes</p>
                        {/* <Link
                          className="test_start_button"
                          to="#"
                          onClick={() => openPopup(test.testCreationTableId)}
                        >
                          Start Test
                        </Link> */}
                        {test.test_status === "Completed" ? (
                          <Link
                            className="test_start_button"
                            to="http://localhost:3000/student_dashboard"
                          >
                            View Report
                          </Link>
                        ) : (
                          <Link
                            className="test_start_button"
                            to="#"
                            onClick={() => openPopup(test.testCreationTableId)}
                          >
                            {test.test_status === "incomplete"
                              ? "Resume"
                              : "Start Test"}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // <div className="by_default">
              //   {/* Map over unique typeOfTestName values */}
              //   {[
              //     ...new Set(testDetails.map((test) => test.typeOfTestName)),
              //   ].map((type, index) => (
              //     <div className="default_test_cards" key={index}>
              //       <div className="testPageHeading">
              //         <h3>{type}</h3>
              //       </div>

              //       <div className="test_cards">
              //         {/* Filter testDetails for the current typeOfTestName */}
              //         {testDetails
              //           .filter((test) => test.typeOfTestName === type)
              //           .map((test, testIndex) => (
              //             <div key={testIndex} className="test_card">
              //               <div
              //                 className="test_card_div"
              //                 style={{
              //                   backgroundColor: getBackgroundColor(type),
              //                 }}
              //               >
              //                 <div className="testcard_images_div">
              //                   <img
              //                     className="test_card_image"
              //                     src={test_exam_icon}
              //                     alt="book"
              //                   />
              //                 </div>
              //                 <div>
              //                   <div className="test_card_heading">
              //                     <h4>{test.TestName}</h4>
              //                     <div className="test_start_time_div">
              //                       <span
              //                         id="tcm_icon"
              //                         class="material-symbols-outlined"
              //                       >
              //                         calendar_month
              //                       </span>{" "}
              //                       <p className="test_date_time">
              //                         {test.testStartDate}{" "}
              //                         {test.testStartTime.slice(0, 5)}
              //                       </p>
              //                     </div>
              //                   </div>

              //                   <p>Total Marks: {test.totalMarks} Marks</p>
              //                   <p>Test Duration: {test.Duration} Minutes</p>
              //                   <Link
              //                     className="test_start_button"
              //                     to="#"
              //                     onClick={() =>
              //                       openPopup(test.testCreationTableId)
              //                     }
              //                   >
              //                     Start Test

              //                   </Link>
              //                 </div>
              //               </div>
              //             </div>
              //           ))}
              //       </div>
              //     </div>
              //   ))}
              // </div>
              <div className="by_default">
                {/* Map over unique typeOfTestName values */}
                {[
                  ...new Set(testDetails.map((test) => test.typeOfTestName)),
                ].map((type, index) => (
                  <div className="default_test_cards" key={index}>
                    <div className="testPageHeading">
                      <h3>{type}</h3>
                    </div>

                    <div className="test_cards">
                      {/* Filter testDetails for the current typeOfTestName */}
                      {testDetails
                        .filter((test) => test.typeOfTestName === type)
                        .map((test, testIndex) => (
                          <div key={testIndex} className="test_card">
                            <div
                              className="test_card_div"
                              style={{
                                backgroundColor: getBackgroundColor(type),
                              }}
                            >
                              <div className="testcard_images_div">
                                <img
                                  className="test_card_image"
                                  src={test_exam_icon}
                                  alt="book"
                                />
                              </div>
                              <div>
                                <div className="test_card_heading">
                                  <h4>{test.TestName}</h4>
                                  <div className="test_start_time_div">
                                    <span
                                      id="tcm_icon"
                                      className="material-symbols-outlined"
                                    >
                                      calendar_month
                                    </span>
                                    <p className="test_date_time">
                                      {test.testStartDate}{" "}
                                      {test.testStartTime.slice(0, 5)}
                                    </p>
                                  </div>
                                </div>
                                <p>Total Marks: {test.totalMarks} Marks</p>
                                <p>Test Duration: {test.Duration} Minutes</p>
                                {/* Conditional rendering based on test status */}

                                {test.test_status === "Completed" ? (
                                  <Link
                                    className="test_start_button"
                                    to="http://localhost:3000/student_dashboard"
                                  >
                                    View Report
                                  </Link>
                                ) : (
                                  <Link
                                    className="test_start_button"
                                    to="#"
                                    onClick={() =>
                                      openPopup(test.testCreationTableId)
                                    }
                                  >
                                    {test.test_status === "incomplete"
                                      ? "Resume"
                                      : "Start Test"}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TestPage;

export const Footer = () => {
  return (
    <div className="footer-container footerBg">
      <footer className="footer">
        {FooterData.map((footerItem, footerIndex) => {
          return (
            <div key={footerIndex} className={footerItem.footerCLass}>
              <h4 className={footerItem.footerCs}>{footerItem.fotterTitles}</h4>
              <p>{footerItem.text}</p>

              <ul>
                <a href={footerItem.PrivacyPolicy}>
                  <li>{footerItem.home}</li>
                </a>

                <a href={footerItem.TermsAndConditions}>
                  <li>{footerItem.about}</li>
                </a>

                <a href={footerItem.RefundPolicy}>
                  <li>
                    {footerItem.career}
                    {footerItem.icon}
                  </li>
                </a>
              </ul>

              <div className="icontsFooter">
                <i id="footerIcons" className={footerItem.fb}></i>
                <i id="footerIcons" className={footerItem.insta}></i>
                <i id="footerIcons" className={footerItem.linkedin}></i>
                <i id="footerIcons" className={footerItem.youtube}></i>
              </div>
            </div>
          );
        })}
      </footer>
      <div
        className=" footer-linkss"
        style={{
          textAlign: "center",
          borderTop: "1px solid #fff",
          paddingTop: "10px",
          paddingBottom: "10px",
          color: "#fff",
        }}
      >
        {" "}
        <p style={{ margin: "0 auto" }}>
          Copyright © 2023 eGradTutor All rights reserved
        </p>
      </div>
    </div>
  );
};
