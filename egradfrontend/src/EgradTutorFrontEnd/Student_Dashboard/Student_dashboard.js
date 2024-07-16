import React, { useEffect, useState, useRef } from "react";
// import { nav } from "../Exam_Portal_QuizApp/Data/Data";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import "./styles/StudentDashbord.css";
import Student_profileUpdate from "./Student_profileUpdate";
import { MdMenu } from "react-icons/md";
import BuyCourses from "./BuyCourses";
import Doubtsection from "./Doubtsection";
import welcome_greeting_img from "./Images/welcome_greeting_img.png";
import axios from "axios";

import { HashLink } from "react-router-hash-link";
import { MdDeleteForever } from "react-icons/md";
import "./styles/BookMarks.css";
import Chart from "chart.js/auto";
// import { GoIssueClosed } from "react-icons/go";
import BASE_URL from "../../apiConfig";
import { encryptData } from "./utils/crypto";
import Control from "./Control";
import "./styles/ComPackC.css";

// import {
//   CircularGaugeComponent,
//   AxesDirective,
//   AxisDirective,
//   PointersDirective,
//   PointerDirective,
//   RangesDirective,
//   RangeDirective,
// } from "@syncfusion/ej2-react-circulargauge";
import { FaBookOpenReader } from "react-icons/fa6";
// import GaugeChart from "react-gauge-chart";
import { TbH1 } from "react-icons/tb";
import ReactPlayer from "react-player";
import { PiHandTapBold, PiHandTapThin } from "react-icons/pi";

const Student_dashboard = () => {
  const userRole = localStorage.getItem("userRole");
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div
        id="quizhome"
        style={{
          backgroundColor: scrollPosition > 10 ? "white" : "",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <StudentDashbordheader />
      </div>
      {userRole === "admin" && (
        <div>
          <StudentDashbordsettings />
        </div>
      )}

      {userRole === "viewer" && (
        <div>
          <Student_dashboardparectcontainer />
        </div>
      )}
    </>
  );
};

export default Student_dashboard;

const STORAGE_KEY = "student_dashboard_state";
export const Student_dashboardparectcontainer = () => {
  const [studentDashbordconatiner, setStudentDashbordconatiner] =
    useState(true);
  const [studentDashbordmycourse, setStudentDashbordmycourse] = useState(false);
  const [studentDashbordbuycurses, setStudentDashbordbuycurses] =
    useState(false);
  const [studentDashbordmyresult, setStudentDashbordmyresult] = useState(false);
  const [StudentDashbordVideoLectures, setStudentDashbordVideoLectures] =
    useState(false);
  const [studentDashbordbookmark, setStudentDashbordbookmark] = useState(false);
  const [studentDashbordsettings, setStudentDashbordsettings] = useState(false);

  const [showLeftMenu, setShowLeftMenu] = useState(false);

  const handleToggleLeftMenu = () => {
    setShowLeftMenu(!showLeftMenu);
  };

  const handleMenuClick = (setState) => {
    setStudentDashbordconatiner(false);
    setStudentDashbordmycourse(false);
    setStudentDashbordbuycurses(false);
    setStudentDashbordmyresult(false);
    setStudentDashbordVideoLectures(false);
    setStudentDashbordbookmark(false);
    setStudentDashbordsettings(false);
    setState(true);
  };

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState) {
      setStudentDashbordconatiner(savedState.studentDashbordconatiner);
      setStudentDashbordmycourse(savedState.studentDashbordmycourse);
      setStudentDashbordbuycurses(savedState.studentDashbordbuycurses);
      setStudentDashbordmyresult(savedState.studentDashbordmyresult);
      setStudentDashbordVideoLectures(savedState.StudentDashbordVideoLectures);
      setStudentDashbordbookmark(savedState.studentDashbordbookmark);
      setStudentDashbordsettings(savedState.studentDashbordsettings);
    }
  }, []);

  useEffect(() => {
    const state = {
      studentDashbordconatiner,
      studentDashbordmycourse,
      studentDashbordbuycurses,
      studentDashbordmyresult,
      StudentDashbordVideoLectures,
      studentDashbordbookmark,
      studentDashbordsettings,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    studentDashbordconatiner,
    studentDashbordmycourse,
    studentDashbordbuycurses,
    studentDashbordmyresult,
    StudentDashbordVideoLectures,
    studentDashbordbookmark,
    studentDashbordsettings,
  ]);

  return (
    <div>
      <div
        className="ugquiz_StudentDashbordconatiner_handleToggleLeftMenu"
        onClick={handleToggleLeftMenu}
      >
        <MdMenu />
      </div>

      <div className="ugquiz_StudentDashbordconatiner">
        <div
          className={`${showLeftMenu
              ? "ugquiz_StudentDashbordconatiner_left_mobile"
              : "ugquiz_StudentDashbordconatiner_left"
            }`}
        >
          <div className="ugquiz_StudentDashbordconatiner_left_menu">
            <button
              className={studentDashbordconatiner ? "activeButton" : ""}
              onClick={() => handleMenuClick(setStudentDashbordconatiner)}
            >
              <span class="material-symbols-outlined">dashboard</span> Dashboard
            </button>
            <button
              className={studentDashbordmycourse ? "activeButton" : ""}
              onClick={() => handleMenuClick(setStudentDashbordmycourse)}
            >
              <span class="material-symbols-outlined">box</span> My Courses
            </button>
            <button
              className={studentDashbordbuycurses ? "activeButton" : ""}
              onClick={() => handleMenuClick(setStudentDashbordbuycurses)}
            >
              <span class="material-symbols-outlined">shopping_cart</span> Buy
              Courses
            </button>
            <button
              className={studentDashbordmyresult ? "activeButton" : ""}
              onClick={() => handleMenuClick(setStudentDashbordmyresult)}
            >
              <span class="material-symbols-outlined">grading</span>
              {/* <span class="material-symbols-outlined">
scoreboard
</span>  */}
              My Results
            </button>
            {/* <button
              className={StudentDashbordVideoLectures ? "activeButton" : ""}
              onClick={() => handleMenuClick(setStudentDashbordVideoLectures)}
            >
              Video Lectures
            </button> */}
            <button
              className={studentDashbordbookmark ? "activeButton" : ""}
              onClick={() => handleMenuClick(setStudentDashbordbookmark)}
            >
              <span class="material-symbols-outlined">bookmark_added</span>{" "}
              Bookmark
            </button>
            <button
              className={studentDashbordsettings ? "activeButton" : ""}
              onClick={() => handleMenuClick(setStudentDashbordsettings)}
            >
              <span class="material-symbols-outlined">
                settings_account_box
              </span>{" "}
              Settings
            </button>
          </div>
        </div>

        <div className="ugquiz_StudentDashbordconatiner_right_Std_MB_Course">
          {studentDashbordconatiner && (
            <>
              <StudentDashbordconatiner />
            </>
          )}

          {studentDashbordmycourse && (
            <>
              <StudentDashbordmycourse />
            </>
          )}
          {studentDashbordbuycurses && (
            <>
              <StudentDashbordbuycurses />
            </>
          )}

          {studentDashbordmyresult && (
            <>
              <StudentDashbordmyresult />
            </>
          )}

          {
            // StudentDashbordVideoLectures && (
            //   <>
            //     <VideoLectures />
            //   </>
            // )
          }

          {studentDashbordbookmark && (
            <>
              <StudentDashbordbookmark />
            </>
          )}

          {studentDashbordsettings && (
            <>
              <StudentDashbordsettings />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const StudentDashbordheader = () => {
  const [showQuizmobilemenu, setShowQuizmobilemenu] = useState(false);
  const QuiZ_menu = () => {
    setShowQuizmobilemenu(!showQuizmobilemenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.clear();
    window.location.href = "/userlogin";
  };
  const userRole = localStorage.getItem("userRole");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

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
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        Navigate("/userlogin"); // Assuming you have the 'navigate' function available

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

  const openPopup = () => {
    // Close the current window
    // window.close();

    window.location.reload();
    // Update the state and store it in localStorage
    // setStudentDashbordeditformnwithpassword(true);
    // setStudentDashbordeditformnwithpasswordbtn(true);

    localStorage.setItem(
      "studentDashbordeditformnwithpassword",
      JSON.stringify(false)
    );
    localStorage.setItem(
      "studentDashbordeditformnwithpasswordbtn",
      JSON.stringify(false)
    );

    localStorage.setItem(
      "studentDashbordeditformnwithoutpasswordbtn",
      JSON.stringify(true)
    );

    localStorage.setItem(
      "studentDashbordeditformnwithoutpassword",
      JSON.stringify(true)
    );
    window.location.reload();
    // Set studentDashbordmyresult to true and store it in localStorage
    localStorage.setItem(
      "student_dashboard_state",
      JSON.stringify({
        studentDashbordmyresult: false,
        studentDashbordconatiner: false,
        studentDashbordmycourse: false,
        studentDashbordbuycurses: false,
        studentDashborddountsection: false,
        studentDashbordbookmark: false,
        studentDashbordsettings: true,
      })
    );

    // Open the desired URL in a new window
    // window.open("http://localhost:3000/student_dashboard");
  };

  //   const openPopuppasword = () => {
  //     // Close the current window
  //     // window.close();
  //     window.location.reload();
  //     // Set studentDashbordmyresult to true and store it in localStorage
  //     localStorage.setItem(
  //       "student_dashboard_state",
  //       JSON.stringify({
  //         studentDashbordmyresult: false,
  //         studentDashbordconatiner: false,
  //         studentDashbordmycourse: false,
  //         studentDashbordbuycurses: false,
  //         studentDashborddountsection: false,
  //         studentDashbordbookmark: false,
  //         studentDashbordsettings: true,
  //         studentDashbordeditformnwithpasswordbtn: true,
  //       })
  //     );
  // //  setStudentDashbordeditformnwithpassword(true);
  //     // Open the desired URL in a new window
  //     // window.open("http://localhost:3000/student_dashboard");
  //   };

  const [
    studentDashbordeditformnwithpassword,
    setStudentDashbordeditformnwithpassword,
  ] = useState(true);
  const [
    studentDashbordeditformnwithpasswordbtn,
    setStudentDashbordeditformnwithpasswordbtn,
  ] = useState(true);
  const openPopuppasword = () => {
    // Close the current window
    // window.close();
    window.location.reload();
    // Update the state and store it in localStorage
    setStudentDashbordeditformnwithpassword(true);
    setStudentDashbordeditformnwithpasswordbtn(true);

    localStorage.setItem(
      "studentDashbordeditformnwithpassword",
      JSON.stringify(true)
    );
    localStorage.setItem(
      "studentDashbordeditformnwithpasswordbtn",
      JSON.stringify(true)
    );

    localStorage.setItem(
      "studentDashbordeditformnwithoutpasswordbtn",
      JSON.stringify(false)
    );

    localStorage.setItem(
      "studentDashbordeditformnwithoutpassword",
      JSON.stringify(false)
    );
    localStorage.setItem(
      "student_dashboard_state",
      JSON.stringify({
        studentDashbordmyresult: false,
        studentDashbordconatiner: false,
        studentDashbordmycourse: false,
        studentDashbordbuycurses: false,
        studentDashborddountsection: false,
        studentDashbordbookmark: false,
        studentDashbordsettings: true,
        studentDashbordeditformnwithpasswordbtn: true,
      })
    );
    // Open the desired URL in a new window
    // window.open("http://localhost:3000/student_dashboard");
  };

  return (
    <div>
      <div className="Quiz_main_page_header">
        {/* {nav.map((nav, index) => { */}
        {/* return ( */}
        <div className="Quiz_main_page_navbar">
          <div className="Quizzlogo">{/* <img src={nav.logo} alt="" /> */}</div>

          <div
            className={
              !showQuizmobilemenu
                ? "Quiz_main_page_navbar_SUBpart Quiz_main_page_navbar_SUBpart_mobile"
                : "Quiz_main_page_navbar_SUBpart_mobile"
            }
          >
            <ul>
              <div className="Quiz_main_page_login_signUp_btn"></div>
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
                            <Link to="/student_dashboard">My profile</Link>
                            <Link onClick={handleLogout}>Logout</Link>
                          </div>
                        </button>
                      </>
                    )}

                  {userRole === "viewer" && (
                    <>
                      <div className="dashbordheder_container">
                        <HashLink to="/home#contact" className="Quiz__home">
                          Contact Us
                        </HashLink>
                        {/* <a
                              href="/home#contact"
                              className="Quiz__home"
                              target="_blank"
                            >
                              {" "}
                              Contact Us
                            </a> */}
                        {/* <Link
                              to="http://localhost:3000/Exam_portal_home_page"
                              className="Quiz__home">
                              Home
                            </Link> */}
                        <button id="dropdownmenu_foradim_page_btn">
                          <img
                            title={userData.username}
                            src={userData.imageData}
                            alt={`Image ${userData.user_Id}`}
                          />

                          {/* <img
                                title={userData.username}
                                src={`${BASE_URL}/uploads/OtsStudentimeages/${userData.imageData}`}
                                alt={`Image ${userData.user_Id}`}
                              /> */}
                          <div className="dropdownmenu_foradim_page">
                            {/* <Link to={`/userread/${user.id}`} className="btn btn-success mx-2">Read</Link> */}
                            {/* <Link to={`/userdeatailspage/${user.id}`} >Account-info</Link> */}
                            <Link onClick={openPopup}>My profile</Link>

                            <Link onClick={openPopuppasword}>
                              Change Password
                            </Link>
                            <Link onClick={handleLogout}>Logout</Link>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
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
                    <div className="dropdownmenu_foradim_page"></div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* ); */}
        {/* })} */}
      </div>
    </div>
  );
};

export const StudentDashbordconatiner = ({ width }) => {
  const { testCreationTableId, courseCreationId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [userMarks, setUserMarks] = useState([]);
  const chartRef = useRef();
  const chartInstance = useRef(null);

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
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        Navigate("/uglogin");
        return;
      }

      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const [overallpercentage, setOverallpercentage] = useState();

  useEffect(() => {
    const fetchUserMarks = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/usermarks/${userData.id}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setUserMarks(result.usermarks);
        setOverallpercentage(result);
        // setOverallpercentage(Math.min(result.averageTestPercentage, 1));
      } catch (error) {
        console.error("Error fetching user marks:", error);
      }
    };

    if (userData.id) {
      fetchUserMarks();
    }
  }, [userData.id]);
  // console.log("hiiiiiii");
  // console.log(overallpercentage.averageTestPercentage)
  const testData = userMarks
    ? userMarks.map((entry) => ({
      testCreationTableId: entry.testCreationTableId,
      TestName: entry.TestName,
      percentage: parseFloat(entry.percentage),
    }))
    : [];

  useEffect(() => {
    if (chartRef.current && testData.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: testData.map((entry) => entry.testCreationTableId),
          datasets: [
            {
              label: "Percentage",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointBorderColor: "rgba(75, 192, 192, 1)",
              pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
              pointHoverBorderColor: "rgba(75, 192, 192, 1)",
              data: testData.map((entry) => ({
                x: entry.testCreationTableId,
                y: entry.percentage,
                TestName: entry.TestName,
              })),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: "Test Creation Table ID",
                color: "black",
              },
              grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: "black",
              },
            },
            y: {
              title: {
                display: true,
                text: "Percentage",
                color: "black",
              },
              grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: "black",
              },
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return [
                    `Test ID: ${context.label}`,
                    `Test Name: ${context.dataset.data[context.dataIndex].TestName
                    }`,
                    `Percentage: ${context.parsed.y}%`,
                  ];
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [testData]);

  // const [greeting, setGreeting] = useState("");
  // useEffect(() => {
  //   // Fetch greeting from localStorage
  //   const storedGreeting = localStorage.getItem("greeting");
  //   if (storedGreeting) {
  //     setGreeting(storedGreeting);
  //   }
  // }, []);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Get current hour
    const currentHour = new Date().getHours();

    // Determine greeting based on time
    let newGreeting;
    if (currentHour < 12) {
      newGreeting = "Good Morning";
    } else if (currentHour < 18) {
      newGreeting = "Good Afternoon";
    } else {
      newGreeting = "Good Evening";
    }

    setGreeting(newGreeting);
  }, []);

  //   const [greeting, setGreeting] = useState("");

  // useEffect(() => {
  //   // Fetch greeting from localStorage
  //   const storedGreeting = localStorage.getItem("greeting");
  //   if (storedGreeting) {
  //     setGreeting(storedGreeting);
  //   } else {
  //     // Get current hour
  //     const currentHour = new Date().getHours();

  //     // Set greeting based on the time of the day
  //     if (currentHour < 12) {
  //       setGreeting("Good morning");
  //     } else if (currentHour < 18) {
  //       setGreeting("Good afternoon");
  //     } else {
  //       setGreeting("Good evening");
  //     }
  //   }
  // }, []);
  // console.log("gvdfnxkgnvfdm,nv m,fncvnmcxnvjkncxjnvcx")
  // console.log(overallpercentage.averageTestPercentage)

  const [attemptedTestCount, setAttemptedTestCount] = useState([]);
  // console.log("attemptedTestCount", attemptedTestCount);
  useEffect(() => {
    const fetchAttemptedTestCount = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Myresult/attempted_test_count/${userData.id}`
        );
        setAttemptedTestCount(response.data);
      } catch (error) {
        console.error("Error fetching attempted test count:", error);
      }
    };

    fetchAttemptedTestCount();
  }, [userData.id]);

  return (
    <div>
      <div className="dashboard_body_container">
        <div className="dashboard_welcome_section">
          <div className="greeting_section">
            <h2 className="dashboard_greeting_container">
              {greeting}, {userData.username}
            </h2>
            <p className="greeting_sub_text">
              "Welcome back, {userData.username}! Your eGradTutor journey to
              academic success begins here. Explore, learn, and thrive on your
              educational path."
            </p>
          </div>
          <div className="dashboard_welcome_img_section">
            <img src={welcome_greeting_img} />
          </div>
        </div>
        <div>
          {/* <h2 className="test_performance_heading">Your Test Performance</h2> */}
          <div className="testcounts_student_dashbard">
            {/* {attemptedTestCount
              .filter((item) => item.Portale_Id === 1 || item.Portale_Id === 2)
              .map((item, index) => (
                <div key={index}>
                  <h3>{item.Portale_Name}</h3>
                  <ul>
                    <li className="total_count_container">
                      Total Tests: {item.test_count}
                    </li>
                    <li className="total_count_container">
                      Total Attempted Tests: {item.attempted_test_count}
                    </li>
                    <li className="total_count_container">
                      Total Unattempted Tests: {item.unattempted_test_count}
                    </li>
                  </ul>
                </div>
              ))} */}
            {attemptedTestCount
              .filter((item) => item.Portale_Id === 1 || item.Portale_Id === 2)
              .map(
                (item, index) =>
                  (item.test_count !== 0 ||
                    (item.Portale_Id !== 2 &&
                      (item.attempted_test_count !== 0 ||
                        item.unattempted_test_count !== 0))) && (
                    <div key={index}>
                      <h3>{item.Portale_Name}</h3>
                      <ul>
                        {item.test_count !== 0 && (
                          <li className="total_count_container">
                            Total Tests: {item.test_count}
                          </li>
                        )}
                        {item.Portale_Id !== 2 &&
                          item.attempted_test_count !== 0 && (
                            <li className="total_count_container">
                              Total Attempted Tests: {item.attempted_test_count}
                            </li>
                          )}
                        {item.Portale_Id !== 2 &&
                          item.unattempted_test_count !== 0 && (
                            <li className="total_count_container">
                              Total Unattempted Tests:{" "}
                              {item.unattempted_test_count}
                            </li>
                          )}
                      </ul>
                    </div>
                  )
              )}
          </div>

          {/* <div className="testcounts_student_dashbard">
            {attemptedTestCount.map((item, index) => (
              <ul key={index}>
                <li className="total_count_container">
                  Total Tests: {item.test_count}
                </li>
                <li className="total_count_container">
                  Total Attempted Tests:{item.attempted_test_count}
                </li>
                <li className="total_count_container">
                  Total Unattempted Tests:{item.unattempted_test_count}
                </li>
              </ul>
            ))}
          </div> */}
          {/* <div className="dashboard_contant">
            {overallpercentage && overallpercentage.averageTestPercentage ? (
              <>
                <div className="dashboard_contantchart">
                  <h2>Your Test Percentage (Vs) In each Test</h2>
                  <div>
                    {" "}
                    <canvas
                      ref={chartRef}
                      className="Your_Test_Performance_graph"
                    />
                  </div>
                </div>

                <div className="dashboard_contantchart " id="gauge-chart">
                  <h2>Your Overall Performance meter</h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <GaugeChart
                      percent={
                        parseFloat(
                          overallpercentage.averageTestPercentage.replace(
                            "%",
                            ""
                          )
                        ) / 100
                      }
                      colors={["#FF5F6D", "#FFC371"]}
                      textColor={"#000"}
                      arcPadding={0.02}
                      cornerRadius={3}
                      needleColor={"#2E384D"}
                      needleBaseSize={10}
                      needleBaseColor={"#2E384D"}
                    />
                    <div style={{ display: "flex", marginTop: "10px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: "#FF5F6D",
                            marginRight: "5px",
                          }}
                        ></div>
                        <span>Good</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: "rgb(255 141 104)",
                            marginRight: "5px",
                          }}
                        ></div>
                        <span>Very Good</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: "rgb(255, 195, 113)",
                            marginRight: "5px",
                          }}
                        ></div>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="subheadingNote_dashboard_forPerformance">
                "You have not yet attempted any tests."
              </p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export const StudentDashbordmycourse = () => {
  const [selectedPortalName, setSelectedPortalName] = useState("");
  const [testDetails, setTestDetails] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [selectedTypeOfTest, setSelectedTypeOfTest] = useState("");
  const [testPageHeading, setTestPageHeading] = useState([]);
  const [filteredTestData, setFilteredTestData] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [showQuizCourses, setShowQuizCourses] = useState(true);
  // const [showtestContainer, setShowtestContainer] = useState(false);
  const [showtestContainer1, setShowtestContainer1] = useState(false);
  const [showtestContainer2, setShowtestContainer2] = useState(false);
  const [showtestContainer3, setShowtestContainer3] = useState(false);
  const [showCompletePackageContainer, setShowCompletePackageContainer] =
    useState(false);
  const [completePackage, setCompletePackage] = useState([]);
  const [mappedData, setMappedData] = useState([]);
  const { user_Id, testCreationTableId, Portale_Id } = useParams();
  const [selectedPortal, setSelectedPortal] = useState("");

  // ************** FOR ONLINE VIDEO CLASS RIGHT CLICK DISABLE FUNCTIONALITY ********************//
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const [state, setState] = useState({ playing: true });
  // const { playing } = state;

  const [playing, setPlaying] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0), "seconds"); // Prevent negative time
    }
  };

  const handleFastForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.min(currentTime + 10, duration), "seconds"); // Prevent exceeding duration
    }
  };
  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played * 100);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value) / 100);
  };

  const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    const preventRightClick = (e) => {
      if (isFullscreen) {
        e.preventDefault();
      }
    };

    // Attach event listener to prevent right-click
    document.addEventListener("contextmenu", preventRightClick);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", preventRightClick);
    };
  }, [isFullscreen]);

  // ************** FOR ONLINE VIDEO CLASS RIGHT CLICK DISABLE FUNCTIONALITY END ********************//

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
  const coursesByPortalAndExam = purchasedCourses.reduce((portals, course) => {
    const portal = course.portalName || "Unknown Portal"; // Use portalName instead of portal
    const examName = course.examName || "Unknown Exam"; // Default value

    if (!portals[portal]) {
      portals[portal] = {}; // Initialize portal if not present
    }

    if (!portals[portal][examName]) {
      portals[portal][examName] = []; // Initialize exam group if not present
    }

    portals[portal][examName].push(course); // Group courses by portal and exam name
    return portals;
  }, {});

  useEffect(() => {
    fetchPurchasedCourses();
  }, [userData.id]);

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

  const handletestClick = async (courseCreationId, user_Id) => {
    console.log("handletestClick:", courseCreationId, user_Id);
    try {
      const response = await axios.get(
        // `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}`
        `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}/${user_Id}`
      );

      setTestDetails(response.data);
      setShowQuizCourses(false);
      setShowtestContainer1(true);
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  const firstTestCreationTableId =
    testDetails.length > 0 ? testDetails[0].testCreationTableId : null;

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/testDetails/${firstTestCreationTableId}/${Portale_Id}`
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

    if ((firstTestCreationTableId, Portale_Id)) {
      fetchTestDetails();
    }
  }, [firstTestCreationTableId, Portale_Id]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        Navigate("/uglogin");
        return;
      }

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        // ... process userData
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/purchasedCourses/${userData.id}`
      );
      const data = await response.json();
      setPurchasedCourses(data);
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    }
  };

  // Function to check if a course is within the specified time frame
  const isCourseActive = (course) => {
    const currentDate = new Date();
    const startDate = new Date(course.courseStartDate); // Start date from database
    const endDate = new Date(course.courseEndDate); // End date from database
    return currentDate >= startDate && currentDate <= endDate;
  };

  // Filter purchased courses based on active status
  const activeCourses = purchasedCourses.filter(isCourseActive);

  // Show the quiz courses if there are active courses
  useEffect(() => {
    setShowQuizCourses(activeCourses.length > 0);
  }, [activeCourses]);

  const handleTypeOfTestClick = (typeOfTestName) => {
    setSelectedTypeOfTest(typeOfTestName);
  };

  const handleReset = () => {
    setSelectedTypeOfTest("");
  };

  const openPopup = async (testCreationTableId, user_Id, Portale_Id) => {
    const userId = user_Id;
    let param1 = testCreationTableId;
    let param2 = user_Id;
    let param3 = Portale_Id;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    try {
      const encryptedParam1 = await encryptData(param1.toString());
      const encryptedParam2 = await encryptData(param2.toString());
      const encryptedParam3 = await encryptData(param3.toString());

      const token = new Date().getTime().toString();
      sessionStorage.setItem("navigationToken", token);

      const url = `/Instructions/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}/${encodeURIComponent(
        encryptedParam3
      )}`;

      const newWinRef = window.open(
        url,
        "_blank",
        `width=${screenWidth},height=${screenHeight},fullscreen=yes`
      );

      if (newWinRef && !newWinRef.closed) {
        newWinRef.focus();
        newWinRef.moveTo(0, 0);
        newWinRef.resizeTo(screenWidth, screenHeight);

        const requestFullscreen = () => {
          const docElm = newWinRef.document.documentElement;
          if (docElm.requestFullscreen) {
            docElm.requestFullscreen().catch((err) => {
              console.error("Fullscreen request failed:", err.message);
            });
          } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen().catch((err) => {
              console.error("Fullscreen request failed:", err.message);
            });
          } else if (docElm.webkitRequestFullscreen) {
            docElm.webkitRequestFullscreen().catch((err) => {
              console.error("Fullscreen request failed:", err.message);
            });
          } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen().catch((err) => {
              console.error("Fullscreen request failed:", err.message);
            });
          }
        };

        const reEnterFullscreen = () => {
          if (
            !newWinRef.document.fullscreenElement &&
            !newWinRef.document.webkitFullscreenElement &&
            !newWinRef.document.mozFullScreenElement &&
            !newWinRef.document.msFullscreenElement
          ) {
            requestFullscreen();
          }
        };

        newWinRef.addEventListener("load", () => {
          requestFullscreen();

          newWinRef.document.body.addEventListener("click", requestFullscreen);

          newWinRef.document.addEventListener("keydown", (event) => {
            if (event.key === "Shift") {
              newWinRef.close();
            }
          });

          ["cut", "copy", "paste"].forEach((eventType) => {
            newWinRef.document.addEventListener(eventType, (event) => {
              event.preventDefault();
            });
          });

          newWinRef.document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
          });

          newWinRef.document.body.style.userSelect = "none";
          newWinRef.document.body.style.webkitUserSelect = "none";
          newWinRef.document.body.style.mozUserSelect = "none";
          newWinRef.document.body.style.msUserSelect = "none";
          newWinRef.document.body.style.webkitUserDrag = "none";
          newWinRef.document.body.draggable = false;

          newWinRef.document.addEventListener("copy", (event) => {
            event.preventDefault();
          });

          newWinRef.addEventListener("beforeunload", (event) => {
            const confirmationMessage =
              "Are you sure you want to leave this page?";
            event.returnValue = confirmationMessage; // For most browsers
            return confirmationMessage; // For some older browsers
          });
        });

        newWinRef.document.addEventListener(
          "fullscreenchange",
          reEnterFullscreen
        );
        newWinRef.document.addEventListener(
          "webkitfullscreenchange",
          reEnterFullscreen
        );
        newWinRef.document.addEventListener(
          "mozfullscreenchange",
          reEnterFullscreen
        );
        newWinRef.document.addEventListener(
          "msfullscreenchange",
          reEnterFullscreen
        );

        // Continuously monitor and correct the window size and position
        setInterval(() => {
          if (
            newWinRef.outerWidth !== screenWidth ||
            newWinRef.outerHeight !== screenHeight
          ) {
            newWinRef.moveTo(0, 0);
            newWinRef.resizeTo(screenWidth, screenHeight);
          }
          newWinRef.focus();
        }, 1000);

        // Detect focus change and show a warning if the user switches away
        const showMalpracticeWarning = () => {
          alert(
            "Warning: You are not allowed to switch applications during the test."
          );
          newWinRef.focus();
        };

        newWinRef.addEventListener("blur", showMalpracticeWarning);
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            showMalpracticeWarning();
          }
        });
      }

      const preventFocusLoss = (e) => {
        if (newWinRef && !newWinRef.closed) {
          newWinRef.focus();
        }
      };

      document.addEventListener("visibilitychange", preventFocusLoss);
    } catch (error) {
      console.error("Error encrypting data:", error);
    }

    try {
      const response = await fetch(
        `http://localhost:5001/QuizPage/clearresponseforPB/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  };

  const handleSaveStartTime = async (
    user_Id,
    testCreationTableId,
    courseCreationId
  ) => {
    try {
      // Get the current date and time in Indian Standard Time (IST)
      const studentTestStartTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });

      // console.log("user_Id:", user_Id);
      // console.log("courseCreationId:", courseCreationId);
      // console.log("testCreationTableId:", testCreationTableId);
      // console.log("Current Date and Time:", studentTestStartTime); // Log the current date and time

      const data = {
        user_Id: user_Id,
        courseCreationId: courseCreationId,
        testCreationTableId: testCreationTableId,
        studentTestStartTime: studentTestStartTime,
        testAttemptStatus: "Attempted", // Include the current date and time in the data
      };

      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/test_attempt_start_time`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      // console.log("Data sent successfully:", responseData);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleTypeOfTestClickback = () => {
    setShowQuizCourses(true);
    // setShowtestContainer(false);
    setShowtestContainer1(false);
    setShowtestContainer2(false);
    setShowCompletePackageContainer(false);
  };

  function getBackgroundColor(type, test) {
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
  const getButtonText = (
    test_status,
    userId,
    courseCreationId,
    testCreationTableId
  ) => {
    // Example conditions, you need to replace them with your actual conditions
    if (
      test_status === "Completed" &&
      userId &&
      courseCreationId &&
      testCreationTableId
    ) {
      // Check additional conditions if needed
      return "View Report";
    } else if (
      test_status === "incomplete" &&
      userId &&
      courseCreationId &&
      testCreationTableId
    ) {
      // Check additional conditions if needed
      return "Resume";
    } else {
      // Default condition if no specific conditions are met
      return "Start Test";
    }
  };
  // console.log("lmkdklfjskjnfvdlskjvkfh");
  // console.log(userData.id);
  // console.log(purchasedCourses.courseCreationId);
  // console.log(testDetails.testCreationTableId)

  // Function to format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [showtestContainer, setShowtestContainer] = useState(false);
  const player = useRef(null);
  const { OVL_Course_Id } = useParams();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch data from your backend API
        const response = await fetch(
          `${BASE_URL}/OtsvidesUploads/coursesvideos`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);

        // setShowtestContainer(true);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleVideosClick = async (OVL_Course_Id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/OtsvidesUploads/videos/${OVL_Course_Id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();
      setVideos(data);
      console.log("OVOOOOOOOOOVVVVVVVVVVVVLLLLLLLLLLLLLLLLLLLLLL");
      console.log(data);
      setShowQuizCourses(false);
      setShowtestContainer2(true);
    } catch (error) {
      console.error("Error fetching test details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleViewVideo = async (OVL_Linke_Id) => {
  //   try {
  //     const video = videos.find((video) => video.OVL_Linke_Id === OVL_Linke_Id);
  //     if (!video) {
  //       throw new Error("Video not found");
  //     }
  //     const proxyUrl = `${BASE_URL}/OtsvidesUploads/proxy/google-drive/${video.Drive_Link}`;
  //     setSelectedVideo(proxyUrl);
  //     setIsModalOpen(true);
  //   } catch (error) {
  //     console.error("Error fetching video:", error);
  //   }
  // };
  const handleViewVideo = async (OVL_Linke_Id) => {
    try {
      const video = videos.find((video) => video.OVL_Linke_Id === OVL_Linke_Id);
      if (!video) {
        throw new Error("Video not found");
      }

      setSelectedVideo(video.Drive_Link); // This should be a valid Base64 data URL
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handlePortalFilterChange = (portalName) => {
    setSelectedPortal(portalName);
  };

  // Filter courses by selected portal
  const filteredCourses = activeCourses.filter(
    (course) => selectedPortal === "" || course.portalName === selectedPortal
  );

  const handleCompletePackage = async (
    courseCreationId,
    user_Id,
    OVL_Course_Id
  ) => {
    console.log("courseCreationId,user_Id", courseCreationId, user_Id);
    console.log("completePackage", completePackage);
    try {
      const response = await axios.get(
        // `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}`
        `${BASE_URL}
        ${courseCreationId}/${user_Id}`
      );

      setCompletePackage(response.data);
      setShowQuizCourses(false);
      setShowCompletePackageContainer(true);
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };
  //  const handleCompletePackage = async (
  //    OVL_Course_Id,
  //    courseCreationId,
  //    user_Id
  //  ) => {
  //    console.log("courseCreationId, user_Id", courseCreationId, user_Id);
  //    console.log("completePackage", completePackage);

  //    try {
  //      const response1 = await axios.get(
  //        `${BASE_URL}/TestPage/CompletePackage/${courseCreationId}/${user_Id}`
  //      );
  //  const data1 = await response1.json();
  //   setCompletePackage(response1.data1);

  //      setShowQuizCourses(false);
  //      setShowCompletePackageContainer(true);
  //    } catch (error) {
  //      console.error("Error fetching complete package:", error);
  //    }

  //    try {
  //      const response2 = await fetch(
  //        `${BASE_URL}/OtsvidesUploads/videos/${OVL_Course_Id}`
  //      );

  //      if (!response2.ok) {
  //        throw new Error("Failed to fetch videos");
  //      }

  //      const data2 = await response2.json();
  //      setVideos(data2);
  //      console.log("OVOOOOOOOOOVVVVVVVVVVVVLLLLLLLLLLLLLLLLLLLLLL");
  //      console.log(data2);
  //      setShowQuizCourses(false);
  //      setShowtestContainer2(true);
  //    } catch (error) {
  //      console.error("Error fetching videos:", error);
  //    } finally {
  //      setIsLoading(false);
  //    }
  //  };
  // const handleCompletePackage = async (
  //   OVL_Course_Id,
  //   courseCreationId,
  //   user_Id
  // ) => {
  //   console.log("courseCreationId, user_Id", courseCreationId, user_Id);
  //   console.log("completePackage", completePackage);

  //   try {
  //     const response1 = await axios.get(
  //       `${BASE_URL}/TestPage/CompletePackage/${courseCreationId}/${user_Id}`
  //     );
  //     if (!response1.ok) {
  //       throw new Error("Failed to fetch complete package");
  //     }
  //     const data1 = await response1.json();
  //     setCompletePackage(data1);
  //     console.log('data1',data1)
  //     setShowQuizCourses(false);
  //     setShowCompletePackageContainer(true);
  //   } catch (error) {
  //     console.error("Error fetching complete package:", error);
  //   }

  //   try {
  //     const response2 = await fetch(
  //       `${BASE_URL}/OtsvidesUploads/videos/${OVL_Course_Id}`
  //     );

  //     if (!response2.ok) {
  //       throw new Error("Failed to fetch videos");
  //     }

  //     const data2 = await response2.json();
  //     setVideos(data2);
  //       console.log('data2',data2)
  //     console.log("OVOOOOOOOOOVVVVVVVVVVVVLLLLLLLLLLLLLLLLLLLLLL");
  //     console.log(data2);
  //     setShowQuizCourses(false);
  //     setShowtestContainer2(true);
  //   } catch (error) {
  //     console.error("Error fetching videos:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCompletePackage = async (
  //   OVL_Course_Id,
  //   courseCreationId,
  //   user_Id
  // ) => {
  //   console.log("courseCreationId, user_Id", courseCreationId, user_Id);
  //   console.log("completePackage", completePackage);

  //   try {
  //     const response1 = await axios.get(
  //       `${BASE_URL}/TestPage/CompletePackage/${courseCreationId}/${user_Id}`
  //     );
  //     if (response1.status !== 200) {
  //       throw new Error("Failed to fetch complete package");
  //     }
  //     const data1 = response1.data;
  //     setCompletePackage(data1);
  //     console.log('data1', data1)
  //     setShowQuizCourses(false);
  //     setShowCompletePackageContainer(true);
  //   } catch (error) {
  //     console.error("Error fetching complete package:", error);
  //   }

  //   try {
  //     const response2 = await fetch(
  //       `${BASE_URL}/OtsvidesUploads/videos/${OVL_Course_Id}`
  //     );

  //     if (!response2.ok) {
  //       throw new Error("Failed to fetch videos");
  //     }

  //     const data2 = await response2.json();
  //     setVideos(data2);
  //     console.log('data2', data2)
  //     console.log("OVOOOOOOOOOVVVVVVVVVVVVLLLLLLLLLLLLLLLLLLLLLL");
  //     console.log(data2);
  //     setShowQuizCourses(false);
  //     setShowtestContainer2(true);
  //   } catch (error) {
  //     console.error("Error fetching videos:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const renderTestAction = (test) => {
    const {
      Portale_Id,
      test_status,
      testAttemptStatus,
      testCreationTableId,
      user_Id,
      courseCreationId,
    } = test;

    if (test_status === "Completed") {
      return (
        <Link
          className=""
          to={`/UserReport/${userData.id}/${testCreationTableId}/${courseCreationId}`}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "6.9px",
            textDecoration: "none",
          }}
        >
          View Report
        </Link>
      );
    }

    if (Portale_Id === 1 && testAttemptStatus === "Attempted") {
      return (
        <span
          className=""
          style={{
            backgroundColor: "#9800ff",
            color: "white",
            padding: "5.9px",
            textDecoration: "none",
            fontSize: "22px",
          }}
        >
          Attempted
        </span>
      );
    }

    return (
      <Link
        className="test_start_button"
        to="#"
        onClick={() => {
          openPopup(testCreationTableId, user_Id, Portale_Id);
          handleSaveStartTime(user_Id, testCreationTableId, courseCreationId);
        }}
      >
        Start Test
      </Link>
    );
  };

  return (
    <>
      <div>
        {!showtestContainer1 &&
          !showtestContainer2 &&
          !showCompletePackageContainer &&
          showQuizCourses && (
            <>
              <div className="QuizBUy_courses QuizBUy_coursesinstudentdB">
                <div className="QuizBUy_coursessub_conatiner QuizBUy_coursessub_conatinerinstudentdB">
                  <div className="QuizBUy_coursesheaderwithfilteringcontainer">
                    <div className="QuizBUy_coursesheaderwithfilteringcontainerwithtagline">
                      <h2>MY COURSES</h2>
                      <span>(Your purchased courses.)</span>
                    </div>
                    <div>
                      <select
                        value={selectedPortal}
                        onChange={(e) => setSelectedPortal(e.target.value)}
                        style={{ margin: "5px" }}
                      >
                        <option value="">All Portals</option>
                        {Array.from(
                          new Set(
                            activeCourses.map((course) => course.portalName)
                          )
                        ).map((portalName) => (
                          <option key={portalName} value={portalName}>
                            {portalName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="QuizBUy_coursescontainerwithfilteringcontainer">
                    {/* Render courses */}
                    {filteredCourses.length === 0 ? (
                      <div>
                        <span>YOU HAVE NO ACTIVE COURSES</span>
                      </div>
                    ) : (
                      Object.entries(
                        filteredCourses.reduce(
                          (coursesByPortalAndExam, course) => {
                            const key = `${course.portalName}_${course.examName}`;
                            if (!coursesByPortalAndExam[key]) {
                              coursesByPortalAndExam[key] = {
                                portalName: course.portalName,
                                examName: course.examName,
                                portalId: course.portal,
                                courses: [],
                              };
                            }
                            coursesByPortalAndExam[key].courses.push(course);
                            return coursesByPortalAndExam;
                          },
                          {}
                        )
                      ).map(
                        ([, { portalName, examName, portalId, courses }]) => (
                          <div
                            key={`${portalName}_${examName}`}
                            className="portal_groupbuycourse"
                          >
                            <h2 className="portal_group_h2">{portalName}</h2>
                            <h2 className="subheadingbuycourse">{examName}</h2>

                            <div className="courses_boxcontainer">
                              {courses.map((courseExamsDetails) => (
                                <div
                                  className="QuizBUy_coursescontainerwithfilteringcoursebox"
                                  key={courseExamsDetails.courseCreationId}
                                >
                                  <img
                                    src={courseExamsDetails.courseCardImage}
                                    alt={courseExamsDetails.courseName}
                                  />
                                  <div className="QuizBUy_coursescontainerwithfilteringcoursebox_info">
                                    <p>{courseExamsDetails.courseName}</p>
                                    <p>
                                      <b>Duration:</b>
                                      {formatDate(
                                        courseExamsDetails.courseStartDate
                                      )}{" "}
                                      to{" "}
                                      {formatDate(
                                        courseExamsDetails.courseEndDate
                                      )}
                                    </p>
                                    <p>
                                      {portalId === 1 || portalId === 2 ? (
                                        <b>No. of Test</b>
                                      ) : portalId === 3 ? (
                                        <b>No. of Lectures</b>
                                      ) : portalId === 4 ? (
                                        <b>Topic Name</b>
                                      ) : null}
                                      :{" "}
                                      {portalId === 1 || portalId === 2
                                        ? courseExamsDetails.totalTests
                                        : portalId === 3
                                          ? courseExamsDetails.totalLectures
                                          : portalId === 4
                                            ? courseExamsDetails.topicName
                                            : null}
                                    </p>

                                    <div className="QuizBUy_coursescontainerwithfilteringcoursebox_info_buynoeprice QuizBUy_coursescontainerwithfilteringcoursebox_info_buynoepricemycourses">
                                      <Link
                                        onClick={() => {
                                          if (
                                            portalId === 1 ||
                                            portalId === 2
                                          ) {
                                            handletestClick(
                                              courseExamsDetails.courseCreationId,
                                              userData.id,
                                              portalId
                                            );
                                          } else if (portalId === 3) {
                                            handleVideosClick(
                                              courseExamsDetails.courseCreationId
                                            );
                                          } else if (portalId === 4) {
                                            handleCompletePackage(
                                              courseExamsDetails.courseCreationId,
                                              userData.id,
                                              portalId
                                            );
                                          }
                                        }}
                                      >
                                        {portalId === 1 || portalId === 2
                                          ? "Go to Test"
                                          : portalId === 3
                                            ? "Start Lecture"
                                            : portalId === 4
                                              ? "Open Complete Package"
                                              : null}
                                      </Link>
                                    </div>
                                  </div>

                                  <div className="before_start_now"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        {showtestContainer1 && (
          <div>
            <div className="card_container_dashbordflowtest">
              <div className="test_card_container">
                <div
                  className="Go_back_from_test_section"
                  onClick={handleTypeOfTestClickback}
                >
                  Go Back
                </div>

                <div className="test_card_subcontainer">
                  <div className="Types_of_Tests">
                    {/* <h1>Filtered Test Details</h1> */}
                    <ul>
                      <div>
                        <div className="testPageHeading">
                          {testDetails
                            .filter(
                              (test, index, self) =>
                                index ===
                                self.findIndex(
                                  (t) =>
                                    t.Portale_Name === test.Portale_Name &&
                                    t.courseName === test.courseName
                                )
                            )
                            .map((test, index) => (
                              <div key={index}>
                                <h2 className="portal_group_h2">
                                  {test.courseName}
                                </h2>
                              </div>
                            ))}
                        </div>
                        <div className="testpage_menu_reset_btn">
                          <select
                            value={selectedTypeOfTest}
                            onChange={(e) =>
                              handleTypeOfTestClick(e.target.value)
                            }
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
                            <>
                              <ul className="testcard_inline">
                                <li>
                                  <span>
                                    {" "}
                                    <FaBookOpenReader />{" "}
                                  </span>
                                  {test.TestName}
                                </li>
                                <li> Total Marks: {test.totalMarks} Marks</li>
                                <li>Test Duration: {test.Duration} Minutes</li>
                                <li>
                                  {" "}
                                  {test.test_status === "Completed" && (
                                    <ul>
                                      {" "}
                                      <li>{formatDate(test.test_end_time)} </li>
                                    </ul>
                                  )}
                                </li>
                                <li>{renderTestAction(test)}</li>
                              </ul>
                            </>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="by_default">
                        {/* Map over unique typeOfTestName values */}
                        {[
                          ...new Set(
                            testDetails.map((test) => test.typeOfTestName)
                          ),
                        ].map((type, index) => (
                          <div className="default_test_cards" key={index}>
                            <div className="testPageHeading">
                              {/* <h1>{type.portalName}</h1>
                            <h2>{type.courseName}</h2> */}
                              <h3>{type}</h3>
                            </div>

                            <div className="test_cards">
                              {/* Filter testDetails for the current typeOfTestName */}
                              {testDetails
                                .filter((test) => test.typeOfTestName === type)
                                .map((test, testIndex) => (
                                  <div key={testIndex} className="test_card">
                                    {/* <h1>{test.Portale_Name}</h1>
                                  <h2>{test.courseName}</h2> */}
                                    <ul
                                      // className="testcard_inline"
                                      className="testcard_inline"
                                      style={{
                                        backgroundColor:
                                          getBackgroundColor(type),
                                      }}
                                    >
                                      <li>
                                        <span>
                                          {" "}
                                          <FaBookOpenReader />{" "}
                                        </span>

                                        {test.TestName}
                                      </li>
                                      <li>
                                        {" "}
                                        Total Marks: {test.totalMarks} Marks
                                      </li>
                                      <li>
                                        Test Duration: {test.Duration} Minutes
                                      </li>
                                      <li>
                                        {" "}
                                        {test.test_status === "Completed" && (
                                          <ul>
                                            {" "}
                                            <li>
                                              {formatDate(test.test_end_time)}{" "}
                                            </li>
                                          </ul>
                                        )}
                                      </li>
                                      <li>{renderTestAction(test)}</li>
                                    </ul>
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
            </div>
          </div>
        )}
        {showtestContainer2 && (
          <div>
            <div className="card_container_dashbordflowtest">
              <div className="test_card_container">
                <div
                  className="Go_back_from_test_section"
                  onClick={handleTypeOfTestClickback}
                >
                  Go Back
                </div>

                <div className="test_cards">
                  {/* {courses.map((course) => (
            <div key={course.courseCreationId || course.OVL_Course_Id}> */}

                  {/* {course.portal === "OVL" && ( */}
                  <div>
                    <h2>OVL 2</h2>
                    {/* <h2 className="OVL_subheading">{course.examName}</h2> */}
                    <div
                    // className="OVL_course_card OVL_continer_data"
                    // key={course.OVL_Course_Id}
                    >
                      {videos.length > 0 && (
                        <h2 className="OVL_PageHeading">
                          {videos[0].OVL_Course_Name}
                        </h2>
                      )}
                      <div className="OVL_cards">
                        {videos.map((video) => (
                          <div
                            className="OVL_card_data"
                            key={video.OVL_Linke_Id}
                          >
                            <h2 className="OVL_text">{video.Lectures_name}</h2>
                            <button
                              className="view-video-button"
                              onClick={() =>
                                handleViewVideo(video.OVL_Linke_Id)
                              }
                            >
                              <i className="fa-solid fa-play"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      {isModalOpen && (
                        <div className="modal">
                          <div className="ovlcontent">
                            <button
                              className="OVL_Video_close"
                              onClick={handleCloseModal}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                            <div
                              className={`video-container ${isFullscreen ? "disable-right-click" : ""
                                }`}
                            >
                              <ReactPlayer
                                className="OVL_Video"
                                ref={playerRef}
                                url={selectedVideo}
                                loop={true}
                                playing={playing}
                                muted={true}
                                width="1000px"
                                height="500px"
                                controls={true}
                                onProgress={handleProgress}
                                onDuration={handleDuration}
                                config={{
                                  youtube: {
                                    playerVars: {
                                      autoplay: 1,
                                      modestbranding: 1,
                                      rel: 0,
                                      showinfo: 0,
                                    },
                                  },
                                  vimeo: {
                                    playerOptions: {
                                      controls: true,
                                      autoplay: 1,
                                    },
                                  },
                                  file: {
                                    attributes: {
                                      controlsList: "nodownload",
                                    },
                                  },
                                }}
                                onError={(e) =>
                                  console.error("Video Error:", e)
                                }
                              />
                              <Control
                                onPlayPause={handlePlayPause}
                                playing={playing}
                                onRewind={handleRewind}
                                onFastForward={handleFastForward}
                                played={played}
                                onSeek={handleSeekChange}
                                onSeekMouseDown={handleSeekMouseDown}
                                onSeekMouseUp={handleSeekMouseUp}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* )} */}
                </div>
                {/* ))}
        </div> */}
              </div>
            </div>
          </div>
        )}
        {/* //main */}
        {showCompletePackageContainer && (
          <div>
            <div className="card_container_dashbordflowtest">
              <div className="test_card_container">
                <div
                  className="Go_back_from_test_section"
                  onClick={handleTypeOfTestClickback}
                >
                  Go Back
                </div>
                {completePackage.map((completeData, index) => (
                  <div key={index}>
                    <h2 className="portal_group_h2">
                      {completeData.courseName}
                      <div className="test_card">
                        <ul className="testcard_inline">
                          <li>
                            <span>
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 512 512"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152V512l-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427V224c0-17.7 14.3-32 32-32H62.3c63.6 0 125.6 19.6 177.7 56zm32 264V248c52.1-36.4 114.1-56 177.7-56H480c17.7 0 32 14.3 32 32V427c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"></path>
                              </svg>
                            </span>
                            {completeData.TestName}
                          </li>
                          <li>Total Marks: {completeData.totalMarks} Marks</li>
                          <li>
                            Test Duration: {completeData.Duration} Minutes
                          </li>
                          <li>
                            <a
                              className="test_start_button"
                              href="/UgadminHome"
                            >
                              Start Test
                            </a>
                          </li>
                        </ul>
                      </div>
                    </h2>
                  </div>
                ))}
                <div className="OVL_cards">
                  {completePackage.map((video) => (
                    <div className="OVL_card_data" key={video.OVL_Linke_Id}>
                      <h2 className="OVL_text">{video.Lectures_name}</h2>
                      <button
                        className="view-video-button"
                        onClick={() => handleViewVideo(video.OVL_Linke_Id)}
                      >
                        <i className="fa-solid fa-play"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const StudentDashbordbuycurses = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);
  const navigate = useNavigate(); // Use this for navigation
  const [popupContent, setPopupContent] = useState(null);
  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        fetchUserData();
      }
    };
    checkLoggedIn();
  }, []); // Dependency array is empty since we only need to check on initial mount

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        navigate("/userlogin"); // Navigate to login if no token
        return;
      }

      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/userlogin");
        return;
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/userlogin"); // Redirect on error
    }
  };

  const fetchUnPurchasedCourses = async () => {
    if (!userData.id) {
      return; // Exit if userData.id is not defined
    }

    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${userData.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setUnPurchasedCourses(data);
      } else {
        console.error("Failed to fetch unPurchased courses");
      }
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    }
  };
  console.log("hiiiiiiiiiiiiiiiiiiiiiiii");
  console.log(unPurchasedCourses);
  useEffect(() => {
    fetchUnPurchasedCourses();
  }, [userData.id]); // Fetch only when userData.id is defined

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const coursesByPortalAndExam = unPurchasedCourses.reduce(
    (portals, course) => {
      const portal = course.portal || "Unknown Portal"; // Default value
      const examName = course.examName || "Unknown Exam"; // Default value

      if (!portals[portal]) {
        portals[portal] = {}; // Initialize portal if not present
      }

      if (!portals[portal][examName]) {
        portals[portal][examName] = []; // Initialize exam group if not present
      }

      portals[portal][examName].push(course); // Group courses by portal and exam name
      return portals;
    },
    {}
  );

  // function studentbuynowbtnuserboughtcoursecheck(courseCreationId, userId) {
  //   // Make a GET request to your backend endpoint
  //   fetch(`http://localhost:5001/StudentRegistationPage/getotsregistrationdata/${courseCreationId}/${userId}`)
  //     .then((response) => {
  //       if (response.ok) {
  //         // Handle successful response
  //         return response.json();
  //       } else {
  //         // Handle errors
  //         console.error("Failed to send IDs to backend");
  //         return { message: "Failed to send IDs to backend" };
  //       }
  //     })
  //     .then((data) => {
  //       // Log the message received from the backend
  //       console.log(data.message);

  //       // Check if data is found or not
  //       if (data.message === "Data found") {
  //         fetch(`http://localhost:5001/StudentRegistationPage/insertthedatainstbtable/${courseCreationId}/${userId}`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json"
  //           },
  //           body: JSON.stringify({ courseCreationId, userId }) // Assuming data contains the data you want to write
  //         })
  //         .then(response => response.json())
  //         .then(responseData => {
  //           console.log(courseCreationId, userId);
  //           console.log(responseData.message);

  //           // Redirect to the found page
  //           // /PayU/:courseCreationId
  //           window.location.href = `/PayU/${courseCreationId}`;
  //         })
  //         .catch(error => {
  //           console.error("Error writing data:", error);
  //         });
  //       } else {
  //         window.location.href = `/coursedataSRP/${courseCreationId}`; // Redirect to not found page
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // }

  function studentbuynowbtnuserboughtcoursecheck(courseCreationId, userId) {
    // Make a GET request to your backend endpoint
    fetch(
      `http://localhost:5001/StudentRegistationPage/getotsregistrationdata/${courseCreationId}/${userId}`
    )
      .then((response) => {
        if (response.ok) {
          // Handle successful response
          return response.json();
        } else {
          // Handle errors
          console.error("Failed to send IDs to backend");
          return { message: "Failed to send IDs to backend" };
        }
      })
      .then((data) => {
        // Log the message received from the backend
        console.log(data.message);

        // Check if data is found or not
        if (data.message === "Data found") {
          fetch(
            `http://localhost:5001/StudentRegistationPage/insertthedatainstbtable/${courseCreationId}/${userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ courseCreationId, userId }), // Assuming data contains the data you want to write
            }
          )
            .then((response) => response.json())
            .then((responseData) => {
              console.log(courseCreationId, userId);
              console.log(responseData.message);

              // Redirect to the found page
              // /PayU/:courseCreationId
              window.location.href = `/PayU/${courseCreationId}`;
            })
            .catch((error) => {
              console.error("Error writing data:", error);
            });
        } else {
          window.location.href = `/coursedataSRP/${courseCreationId}`; // Redirect to not found page
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const [selectedPortal, setSelectedPortal] = useState("");
  function getPortalColorClass(portal) {
    if (selectedPortal === portal) {
      return "selectedPortal";
    } else {
      switch (portal) {
        case "Online Test Series":
          return "portal1";
        case "Practices Question Bank":
          return "portal2";
        case "Online Video Lecture":
          return "portal3";
        default:
          return "defaultPortal";
      }
    }
  }
  const handlemoreinfo = async (userId, Portale_Id, courseCreationId) => {
    // setPopupbeforelogin(true);
    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${userId}`
      );
      const data = await response.json();

      // Filter the data based on Portale_Id and courseCreationId
      const filteredData = data.filter(
        (item) =>
          item.Portale_Id === Portale_Id &&
          item.courseCreationId === courseCreationId
      );

      // Display the filtered data in the popup
      const popupContent = filteredData.map((item) => (
        <div key={item.id} className="popupbeforelogin">
          <button onClick={handleClosePopup} className="closeButton">
            x
          </button>
          <div className="popupbeforeloginbox">
            <div className="popupbeforeloginboxleft">
              <img src={item.courseCardImage} alt="" />
            </div>
            <div className="popupbeforeloginboxright">
              <p>{item.portal}</p>
              <p>
                <b>Exam Name:</b> {item.examName}
              </p>

              <p>
                <b>Course Name:</b> {item.courseName}
              </p>
              <p>
                <b> Duration:</b>
                {formatDate(item.courseStartDate)}to
                {formatDate(item.courseEndDate)}
              </p>

              <p>
                <b>Price:</b>
                {item.totalPrice}
              </p>

              <p>
                <b>No of Tests:</b> {item.testCount}
              </p>
              <p>
                <b> Subject:</b>
                {item.subjectNames}
                {item.topicName}
              </p>
            </div>
          </div>

          {/* <img src={item.courseCardImage} alt="" /> */}

          {/* Add other data fields as needed */}
        </div>
      ));

      // Update state or set a variable to show the popup content
      setPopupContent(popupContent);
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    }
  };
  const handleClosePopup = () => {
    setPopupContent(false);
  };

  return (
    <div>
      {/* <div
        className="before_login_courses_btn_continer_dashbord"
        id="QuizCourses"
      >
        <div className="courseheader_continer">
          <h2>BUY COURSES</h2>
          <span>Choose your course and get started.</span>

          {Object.entries(coursesByPortalAndExam).map(([portal, exams]) => (
            <div key={portal} className="portal_group">
              <h2>{portal}</h2> 
              {Object.entries(exams).map(([examName, courses]) => (
                <div key={examName} className="exam_group">
                  <h2 className="subheading">{examName}</h2>
                  <div className="courses_container">
                    {courses.map((courseExamsDetails) => (
                      <div
                        key={courseExamsDetails.courseCreationId}
                        className="before_login_first_card"
                      >
                        <img
                          src={courseExamsDetails.courseCardImage}
                          alt={courseExamsDetails.courseName}
                        />
                        <p>
                          <b>{courseExamsDetails.courseName}</b>
                        </p>
                        <p>
                          <b>Duration:</b>
                          {formatDate(courseExamsDetails.courseStartDate)}
                          to {formatDate(courseExamsDetails.courseEndDate)}
                        </p>
                        <p>
                          <b> Price:</b>₹ {courseExamsDetails.totalPrice}
                        </p>
                        <div className="before_start_now">
                          <Link
                          
                            onClick={() =>
                              studentbuynowbtnuserboughtcoursecheck(
                                courseExamsDetails.courseCreationId,
                                userData.id
                              )
                            }
                          >
                            <span style={{ fontWeight: 900 }}>
                              <PiHandTapBold
                                style={{
                                  fontWeight: "bold",
                                  fontSize: 22,
                                  color: "#fff",
                                }}
                              />
                            </span>{" "}
                            Buy Now
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div> */}
      <div className="QuizBUy_courses QuizBUy_coursesinstudentdB">
        {popupContent}
        <div className="QuizBUy_coursessub_conatiner QuizBUy_coursessub_conatinerinstudentdB">
          <div className="QuizBUy_coursesheaderwithfilteringcontainer">
            <div className="QuizBUy_coursesheaderwithfilteringcontainerwithtagline">
              <h2>BUY COURSES</h2>
              <span>Choose your course and get started.</span>
            </div>

            {/* <span>Choose your course and get started.</span> */}
            <div>
              <select
                value={selectedPortal}
                onChange={(e) => setSelectedPortal(e.target.value)}
              >
                <option value="">All Portals</option>
                {Object.keys(coursesByPortalAndExam).map((portal) => (
                  <option key={portal} value={portal}>
                    {portal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="QuizBUy_coursescontainerwithfilteringcontainer">
            {Object.entries(coursesByPortalAndExam)
              .filter(
                ([portal, exams]) =>
                  !selectedPortal || portal === selectedPortal
              )
              .map(([portal, exams]) => (
                <div
                  key={portal}
                  className={`portal_groupbuycourse ${getPortalColorClass(
                    portal
                  )}`}
                >
                  <h2 className="portal_group_h2">{portal}</h2>
                  {/* Display portal name */}
                  {Object.entries(exams).map(([examName, courses]) => (
                    <div key={examName} className="exam_group">
                      <h2 className="subheadingbuycourse">{examName}</h2>
                      <div className="courses_boxcontainer">
                        {courses.map((courseExamsDetails) => (
                          <div
                            key={courseExamsDetails.courseCreationId}
                            className="QuizBUy_coursescontainerwithfilteringcoursebox"
                          >
                            <img
                              src={courseExamsDetails.courseCardImage}
                              alt={courseExamsDetails.courseName}
                            />
                            <div className="QuizBUy_coursescontainerwithfilteringcoursebox_info">
                              <p>{courseExamsDetails.courseName}</p>
                              <p>
                                <b> Duration: </b>
                                {formatDate(
                                  courseExamsDetails.courseStartDate
                                )}{" "}
                                to{" "}
                                {formatDate(courseExamsDetails.courseEndDate)}
                              </p>

                              <p>
                                <b>{courseExamsDetails.topicName} </b>
                              </p>
                              <p>
                                <a
                                  style={{ color: "blue", cursor: "pointer" }}
                                  onClick={() =>
                                    handlemoreinfo(
                                      userData.id,
                                      courseExamsDetails.Portale_Id,
                                      courseExamsDetails.courseCreationId
                                    )
                                  }
                                // onClick={() =>
                                //   handlemoreinfo(
                                //     userData.userId,

                                //   )
                                // }
                                >
                                  More Info...
                                </a>
                              </p>

                              <div className="QuizBUy_coursescontainerwithfilteringcoursebox_info_buynoeprice">
                                {/* <label>
                                  Price: ₹ {courseExamsDetails.totalPrice}
                                </label>{" "} */}
                                <label>
                                  Price:
                                  <span>
                                    ₹{courseExamsDetails.ActualtotalPrice}
                                  </span>
                                  <span>{courseExamsDetails.discount}%</span>
                                  <span>₹{courseExamsDetails.totalPrice}</span>
                                  {/* {courseExamsDetails.ActualtotalPrice}/
                                       
                                        {courseExamsDetails.discount}%/
                                        {courseExamsDetails.totalPrice}/ */}
                                </label>{" "}
                                <Link
                                  // to={`/coursedataSRP/${courseExamsDetails.courseCreationId}`}
                                  onClick={() =>
                                    studentbuynowbtnuserboughtcoursecheck(
                                      courseExamsDetails.courseCreationId,
                                      userData.id
                                    )
                                  }
                                >
                                  Buy Now{" "}
                                  <span style={{ fontWeight: 900 }}>
                                    <PiHandTapBold
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: 22,
                                        color: "#fff",
                                      }}
                                    />
                                  </span>{" "}
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentDashbordmyresult = () => {
  const [testDetails, setTestDetails] = useState([]);
  const [selectedTypeOfTest, setSelectedTypeOfTest] = useState("");
  const [filteredTestData, setFilteredTestData] = useState([]);
  // const { user_Id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
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
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        Navigate("/uglogin");
        return;
      }

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        // ... process userData
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const user_Id = userData.id;
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestPage/feachingAttempted_TestDetails/${user_Id}`
        );
        setTestDetails(response.data);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [user_Id]);
  function getBackgroundColor(type, test) {
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
  const openPopup = (user_Id, testCreationTableId, courseCreationId) => {
    const newWinRef = window.open(
      `/Instructions/${user_Id}/${testCreationTableId}/${courseCreationId}`,
      "_blank",
      "width=1000,height=1000"
    );

    if (newWinRef && !newWinRef.closed) {
      newWinRef.focus();
    }
  };
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

  // Function to format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="card_container_dashbordflowtest">
      <div className="test_card_subcontainer">
        {" "}
        <div className="Types_of_Tests">
          <ul>
            <div>
              {testPageHeading &&
                testPageHeading.length > 0 &&
                testPageHeading[0].courseName && (
                  <div className="testPageHeading">
                    <h3>{testPageHeading[0].courseName}</h3>
                  </div>
                )}
            </div>
          </ul>
        </div>
        <div>
          {selectedTypeOfTest ? (
            <></>
          ) : (
            <div className="by_default">
              <div className="test_card_container">
                {filteredTestData.map((test, index) => (
                  <div key={index} className="test_card">
                    <ul
                      // className="testcard_inline"
                      className="testcard_inline"
                      style={{
                        backgroundColor: index === 0 ? "#f0f0f0" : "#ffffff",
                      }}
                    >
                      <li>
                        <span>
                          {" "}
                          <FaBookOpenReader />{" "}
                        </span>

                        {test.TestName}
                      </li>
                      <li> Total Marks: {test.totalMarks} Marks</li>
                      <li>Test Duration: {test.Duration} Minutes</li>
                      <li>
                        {" "}
                        {test.test_status === "Completed" && (
                          <ul>
                            {" "}
                            <li>{formatDate(test.test_end_time)} </li>
                          </ul>
                        )}
                      </li>
                      <li>
                        {test.test_status === "Completed" ? (
                          <Link
                            className="Result_Analysis"
                            to={`/UserReport/${userData.id}/${test.testCreationTableId}/${test.courseCreationId}`}
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              padding: "3.9px",
                              textDecoration: "none",
                            }}
                          >
                            Result Analysis{" "}
                            <span class="material-symbols-outlined">
                              navigate_next
                            </span>
                          </Link>
                        ) : (
                          <Link
                            className="test_start_button"
                            to="#"
                            onClick={() =>
                              openPopup(
                                test.user_Id,
                                test.testCreationTableId,
                                test.courseCreationId
                              )
                            }
                          >
                            {test.test_status === "incomplete"
                              ? "Resume"
                              : "Start Test"}
                          </Link>
                        )}
                      </li>
                    </ul>
                  </div>
                ))}
                {testDetails.length === 0 && (
                  <div className="container">
                    <div className="no_tests_message">
                      You have not attempted any tests yet.
                    </div>

                  </div>


                )}
              </div>
              {/* Render test cards */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// StudentDashbordbookmark ..............................................................
export const StudentDashbordbookmark = () => {
  const { testCreationTableId, question_id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
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
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        Navigate("/uglogin"); // Assuming you have the 'navigate' function available
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

  const user_Id = userData.id;

  const [Questionbookmark, setQuestionbookmark] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/StudentDashbordbookmark_section/${userData.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQuestionbookmark(data.questions);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };
    fetchData();
  }, [userData.id]);

  let previousTestName = null;

  // its fron onclik for solustion
  const [showAnswers, setShowAnswers] = useState(false);

  const toggleAnswer = (questionId) => {
    setShowAnswers((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  const deleteBookmarkQuestion = async (
    user_Id,
    testCreationTableId,
    question_id
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/Myresult/deleteBookmarkQuestion/${userData.id}/${testCreationTableId}/${question_id}`,
        {
          method: "DELETE",
        }
      );
      window.location.reload();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting bookmarked question:", error);
    }
  };

  if (Questionbookmark.length === 0) {
    return (
      <div className="container">
        <div className="subheading">You haven't bookmarked anything yet.</div>
      </div>
    );
  }

  return (
    <div className="Questionbookmark_container">
      <ul className="Questionbookmark_contant">
        {Questionbookmark.map((question, index) => {
          const questionId = question.question_id;
          const isAnswerVisible = showAnswers[questionId];

          const showTestName = question.TestName !== previousTestName;

          previousTestName = question.TestName;

          return (
            <li key={questionId} className="QuestionbookmarkDAta">
              {showTestName && (
                <p className="qbmTitle ">Test Name: {question.TestName} </p>
              )}
              <p className="qbm_QuestionImage">Question:{index + 1} </p>
              {question.paragraph.paragraphImg && (
                <div>
                  <p className="qbm_QuestionImage">Paragraph:</p>
                  <img
                    className="qbm_Image"
                    src={`${BASE_URL}/uploads/${question.documen_name}/${question.paragraph.paragraphImg}`}
                    alt="Paragraph Image"
                  />
                </div>
              )}

              <div className="eGRADTutorWatermark">
                <div>
                  <img
                    className="qbm_Image"
                    src={`${BASE_URL}/uploads/${question.documen_name}/${question.questionImgName}`}
                    alt=""
                  />
                </div>

                <ul className="dbq_options">
                  {question.options.map((option, index) => (
                    <li key={option.option_id}>
                      <span>{String.fromCharCode(97 + index)}:</span>{" "}
                      <img
                        src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                        alt=""
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {isAnswerVisible && (
                <div className="eGRADTutorWatermark">
                  <div className="bdqSolution">
                    <p className="qbm_QuestionImage">Solution: </p>
                    <img
                      className="qbm_Image"
                      src={`${BASE_URL}/uploads/${question.documen_name}/${question.solution.solutionImgName}`}
                      alt=""
                    />
                  </div>
                </div>
              )}

              <div className="toggleAnswerMdDeleteForever">
                <button
                  onClick={() => toggleAnswer(questionId)}
                  className="dbq_Answer_sh"
                >
                  {isAnswerVisible ? "Hide Answer" : "Show Answer"}
                </button>

                <button
                  onClick={() =>
                    deleteBookmarkQuestion(
                      question.testCreationTableId.user_Id,
                      question.testCreationTableId.testCreationTableId,
                      question.question_id
                    )
                  }
                >
                  <MdDeleteForever />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// END StudentDashbordbookmark ..............................................................
export const StudentDashbordsettings = () => {
  const userRole = localStorage.getItem("userRole");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUserData] = useState({});

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
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        Navigate("/uglogin"); // Assuming you have the 'navigate' function available

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

  return (
    <div className="StudentDashbordsettings_conatiner">
      {/* StudentDashbordsettings */}
      <div className="StudentDashbordsettings_subconatiner">
        <div className="StudentDashbordsettings_profile_conatiner">
          <div className="StudentDashbordsettings_profile_box">
            {/* <p>{i + 1}</p> */}
            <div className="pro_img">
              Profile Image
              <img src={user.imageData} alt={`Image ${user.user_Id}`} />
              {/* <img
                title={user.username}
                src={`${BASE_URL}/uploads/OtsStudentimeages/${user.imageData}`}
                alt={`Image ${user.user_Id}`}
              /> */}
            </div>
            <div className="StudentDashbordsettings_profile_box_info">
              <p>User ID:{user.username}</p>
              <p>Email ID:{user.email}</p>
              {/* <p>Role:{user.role}</p> */}
            </div>
            <div className="admin_profile_box_btncontainer">
              {/* <Link to={`/Student_profileUpdate`} className="update">
              Edit
            </Link> */}
            </div>
          </div>
        </div>
        <div className="Student_profileUpdate_editconatiner">
          <Student_profileUpdate />
        </div>
      </div>
    </div>
  );
};
