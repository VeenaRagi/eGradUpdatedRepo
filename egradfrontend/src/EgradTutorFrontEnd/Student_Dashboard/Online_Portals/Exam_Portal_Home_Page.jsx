import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from '../../src/apiConfig'
import { Link, Navigate, useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import { AiOutlineForm, AiFillDelete } from "react-icons/ai";
import { HiArrowSmUp } from "react-icons/hi";
import { PiHandTapBold } from "react-icons/pi";
import
{ useSpring, animated }
from
"react-spring";
import { FaSearch } from "react-icons/fa";
// ------------------------------------------------------------------------- data ---------------------------------------------
import {
  FooterData,
  nav,
  quiz__Home_continer_left,
  quiz__Home_continer_right,
} from "./Data/Data";

// ------------------------------------------------------------------------- css ---------------------------------------------
import "./styles/Home.css";
import "./styles/Dashboard.css";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { HashLink } from "react-router-hash-link";

// ------------------------------------------------------------------------- program start  ---------------------------------------------
const Exam_portal_home_page = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/courses`)
      .then((res) => {
        setCourses(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > window.innerHeight * 0.3) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
        <Header />
      </div>

      <div>
        <Home_section />

        <div id="QuizCourse">
          <Quiz_Courses />
        </div>
      </div>
      <HashLink
        onClick={scrollToTop}
        className={`lms_homepageheader ${scrolled ? "examQuiztop" : ""}`}
      >
        <HiArrowSmUp />
      </HashLink>
      {/* <div className="examQuiztop"> */}

      <Footer />
    </>
  );
};

export default Exam_portal_home_page;

// ------------------------------------------------------------------------- header start ---------------------------------------------

export const Header = () => {
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

  // ----------------- dashborad ---------------------/

  //  localStorage.setItem("isLoggedIn", "true");
  return (
    <>
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
                  {isLoggedIn === true ? (
                    <>
                      {" "}
                      <li>
                        <Link to="/home" className="Quiz__home">
                          Home
                        </Link>
                      </li>
                      <li>
                        <a href="#QuizCourse" className="Quiz__home">
                          My Courses
                        </a>
                      </li>
                      <li>
                        <a href="#QuizCourse" className="Quiz__home">
                          Buy Courses
                        </a>
                      </li>
                      <li>
                        <HashLink to="/home#contact" className="Quiz__home">
                          Contact Us
                        </HashLink>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/home" className="Quiz__home">
                          Home
                        </Link>
                      </li>
                      <li>
                        <HashLink to="#QuizCourse" className="Quiz__home">
                          Buy Courses
                        </HashLink>
                      </li>

                      <li>
                        <HashLink to="/home#contact" className="Quiz__home">
                          Contact us
                        </HashLink>
                      </li>
                    </>
                  )}

                  <div className="Quiz_main_page_login_signUp_btn">
                    {isLoggedIn === true ? (
                      <>
                        {(userRole === "admin" ||
                          userRole === "ugotsadmin" ||
                          userRole === "ugadmin") && (
                          <>
                            <li>
                              <button>
                                <Link to="/Quiz_dashboard">Admin Settings</Link>
                              </button>
                            </li>
                          </>
                        )}
                        {userRole === "viewer" && (
                          <>
                            <button>
                              <Link
                                to="/student_dashboard"
                                className="Quiz__home"
                              >
                                DashBoard
                              </Link>
                            </button>
                          </>
                        )}
                      </>
                    ) : null}
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
                                src={`${BASE_URL}/uploads/OtsStudentimeages/${userData.imageData}`}
                                alt={`Image ${userData.user_Id}`}
                              />
                            <h2>{userData.username}</h2>
                            <div className="dropdownmenu_foradim_page">
                              <Link to="/student_dashboard">My profile</Link>
                              <Link onClick={handleLogout}>Logout</Link>
                            </div>
                          </button>
                        </>
                      )}

                      {userRole === "viewer" && (
                        <>
                          <button id="dropdownmenu_foradim_page_btn">
                            {/* <img
                              title={userData.username}
                              src={userData.imageData}
                              alt={`Image ${userData.user_Id}`}
                            /> */}
                            <img
                                title={userData.username}
                                src={`${BASE_URL}/uploads/OtsStudentimeages/${userData.imageData}`}
                                alt={`Image ${userData.user_Id}`}
                              />
                            <h2>{userData.username}</h2>
                            <div className="dropdownmenu_foradim_page">
                             
                              <Link to="/student_dashboard">My profile</Link>
                              <Link onClick={handleLogout}>Logout</Link>
                            </div>
                          </button>
                        </>
                      )}
                      
                    </>
                  ) : (
                    <>
                      <a class="ugQUIz_login_btn" href="/UgadminHome">
                        Login
                      </a>
                    </>
                  )}

                  {isLoggedIn === "flase" && (
                    <>
                      <button id="dropdownmenu_foradim_page_btn">
                        {/* {userData.username} */}
                        <div className="dropdownmenu_foradim_page">
                 
                        </div>
                      </button>
                    </>
                  )}
                </div>
                <div className="quz_menu" onClick={QuiZ_menu}>
                  <div className="lines"></div>
                  <div className="lines"></div>
                  <div className="lines"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ------------------------------------------------------------------------- header end ---------------------------------------------

// ------------------------------------------------------------------------- home section ---------------------------------------------

export const Home_section = () => {
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
    <>
      {/* //
      -------------------------------------------------------------------------
      before login start --------------------------------------------- */}

      {/* //
      -------------------------------------------------------------------------
      before login end --------------------------------------------- */}

      <div>
        {isLoggedIn === true ? (
          <div className="quiz__Home_continer">
            <div>
              <div className="quiz__Home_continer_left">
                {quiz__Home_continer_left.map((home, index) => {
                  return (
                    <div
                      key={index}
                      className="quiz__Home_continer_left_subpart"
                    >
                      <h4>
                        Welcome <span>{userData.username}</span> to eGRADTutor
                      </h4>
                      
                    </div>
                  );
                })}
              </div>
              <div className="quiz__Home_continer_right">
                {quiz__Home_continer_right.map((homer, index) => {
                  return (
                    <div key={index}>
                      <Carousel
                        autoPlay
                        infiniteLoop
                        interval={5000}
                        showArrows={false}
                        showStatus={false}
                        showThumbs={false}
                      >
                        <div>
                          <img src={homer.carousel1} alt="" />
                        </div>
                        <div>
                          <img src={homer.carousel2} alt="" />
                        </div>
                        <div>
                          <img src={homer.carousel3} alt="" />
                        </div>
                        <div>
                          <img src={homer.carousel4} alt="" />
                        </div>
                      </Carousel>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="before_login_Quiz_home_continer">
            <div className="quiz__Home_continer_right">
              {quiz__Home_continer_right.map((homer, index) => {
                return (
                  <div key={index}>
                    <Carousel
                      autoPlay
                      infiniteLoop
                      interval={5000}
                      showArrows={false}
                      showStatus={false}
                      showThumbs={false}
                    >
                      <div>
                        <img src={homer.carousel1} alt="" />
                      </div>
                      <div>
                        <img src={homer.carousel2} alt="" />
                      </div>
                      <div>
                        <img src={homer.carousel3} alt="" />
                      </div>
                      <div>
                        <img src={homer.carousel4} alt="" />
                      </div>
                    </Carousel>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ------------------------------------------------------------------------- home section end ---------------------------------------------

// ------------------------------------------------------------------------- Quiz_Courses ---------------------------------------------

export const Quiz_Courses = () => {
  // ----------------------------------------------------------courses ug states--------------------------------------------------------
  const [coursesug, setCoursesug] = useState([]);
  const [showcard1, setshowcard1] = useState(false);
  const [showcardactive1, setshowcardactive1] = useState(false);
  const [examsug, setExamsug] = useState([0]);
  // ----------------------------------------------------------currentcourses states--------------------------------------------------------
  const [coursescurrentug, setCoursescurrentug] = useState([]);
  const [examscurrentug, setExamscurrentug] = useState([0]);
  const [showcard2, setshowcard2] = useState(true);
  const [showcardactive2, setshowcardactive2] = useState(true);
 
  // ----------------------------------------------------------courses ug function--------------------------------------------------------
 const [popupbeforelogin,setPopupbeforelogin]=useState(false);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/coursesug`)
      .then((res) => {
        setCoursesug(res.data);
        console.log(coursesug);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
 
  // ----------------------------------------------------------currentcourses function--------------------------------------------------------
  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/coursescurrentug`)
      .then((res) => {
        setCoursescurrentug(res.data);
        console.log(coursesug);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
 
  // ----------------------------------------------------------examsug function--------------------------------------------------------
 
  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/examsug`)
      .then((res) => {
        setExamsug(res.data);
        console.log(setExamsug);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  // ----------------------------------------------------------examexamscurrentugsug function--------------------------------------------------------
  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/examsug`)
      .then((res) => {
        setExamsug(res.data);
        console.log(setExamsug);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
 
  // ---------------------------------------------------------- onclick displayexamsug function--------------------------------------------------------
 
  const displayexamsug = () => {
    setshowcard1(true);
    setshowcard2(false);
    setshowcardactive1(true);
    setshowcardactive2(false);
  };
 
  // ---------------------------------------------------------- onclick displaycurrentexamsug function--------------------------------------------------------
  const displaycurrentexamsug = () => {
    setshowcard1(false);
    setshowcard2(true);
    setshowcardactive1(false);
    setshowcardactive2(true);
  };
 
  const [examCardName, setExamCardName] = useState([]);
  const [noOfCourses, setNoOfCourses] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const examResponse = await axios.get(
          `${BASE_URL}/ExamPage/examData`
        );
        setExamCardName(examResponse.data);
 
        const courseResponse = await fetch(
          `${BASE_URL}/ExamPage/courses/count`
        );
 
        if (!courseResponse.ok) {
          throw new Error("Network response was not ok");
        }
 
        const courseData = await courseResponse.json();
        setNoOfCourses(courseData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNoexam(true); // Set Noexam to true if there is an error
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
  const currentDate = new Date(); // Get the current date
  const filteredExams = examCardName.filter(
    (exam) =>
      new Date(exam.startDate) <= currentDate &&
      currentDate <= new Date(exam.endDate)
  );
    const [popupContent, setPopupContent] = useState(null);
 
  const [noexam, setNoexam] = useState(false);
 
  // ------------ ----login in content -------------------------------
  const [userData, setUserData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
 
  const [examCourseCards, setExamCourseCards] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ExamCourses = await axios.get(
          `${BASE_URL}/Exam_Course_Page/ExamCourses`
        );
        setExamCourseCards(ExamCourses.data);
        // console.log(ExamCourses)
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally, you can set an error state here and display it to the user
      }
    };
 
    fetchData();
  }, []);
 
  const handleBuyNow = async (courseCreationId) => {
    console.log("Buy Now clicked for Course Creation ID:", courseCreationId);
    // console.log(userId);
    // Add your logic for handling the buy action, such as making an API call
    try {
      // Here you can make your API call to perform the buy action
      const userId = userData.id; // Assuming you have userData available in your component state
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/buy_course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
 
          body: JSON.stringify({ userId, courseCreationId }), // Pass userId and courseCreationId to the backend
        }
      );
      // Handle the response if needed
      console.log("Handling the response after saving...");
    } catch (error) {
      console.error("Error handling buy action:", error);
    }
  };
  console.log(userData.id);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
 
 
 
  useEffect(() => {
    fetchPurchasedCourses();
  }, [userData.id]);
 
  const fetchPurchasedCourses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/purchasedCourses/${userData.id}`
      );
      const data = await response.json();
      if (data.length === 0) {
        console.log("No data");
      } else {
        setPurchasedCourses(data);
      }
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    }
  };
 
  // Function to check if a course is within the specified time frame
  const isCourseActive = (course) => {
    const currentDate = new Date();
    const startDate = new Date(course.courseStartDate);
    const endDate = new Date(course.courseEndDate);
    return currentDate >= startDate && currentDate <= endDate;
  };
 
  // Filter purchased courses based on active status
  const activeCourses = purchasedCourses.filter(isCourseActive);
 
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);
 
  const fetchunPurchasedCourses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${userData.id}`
      );
      const data = await response.json();
      setUnPurchasedCourses(data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    }
  };
 
  useEffect(() => {
    fetchunPurchasedCourses();
  }, [userData.id]);
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
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
 
// const handlemoreinfo = async (userId) => {
//   setPopupbeforelogin(true)
//   try {
//     const response = await fetch(
//       `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${userId}`
//     );
//     const data = await response.json();
//     setUnPurchasedCourses(data);
//     console.log(data);

    
//   } catch (error) {
//     console.error("Error fetching purchased courses:", error);
//   }
// };

// const handlemoreinfo = async (userId, Portale_Id) => {
//   setPopupbeforelogin(true);
//   console.log(userId,Portale_Id)
//   try {
//     const response = await fetch(
//       `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${userId}`
//     );
//     if(Portale_Id=Portale_Id){
//       console.log(data)
//     }
//     const data = await response.json();
//     setUnPurchasedCourses(data);
//     console.log(data);
//   } catch (error) {
//     console.error("Error fetching purchased courses:", error);
//   }
// };
// const handlemoreinfo = async (userId, Portale_Id, courseCreationId) => {
//   setPopupbeforelogin(true);
//   try {
//     const response = await fetch(
//       `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${userId}`
//     );
//     const data = await response.json();

//     // Filter the data based on Portale_Id and courseCreationId
//     const filteredData = data.filter(
//       (item) =>
//         item.Portale_Id === Portale_Id &&
//         item.courseCreationId === courseCreationId
//     );

//     // Update state only with the filtered data
//     setUnPurchasedCourses(filteredData);
//     console.log(filteredData);
//   } catch (error) {
//     console.error("Error fetching purchased courses:", error);
//   }
// };
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
    <>
      {isLoggedIn === true ? (
        <>
          {/* ---------------------------------- working working code after login start
         
          ---------------------------------------------------------- */}
          <div className="before_login_courses_btn_continer" id="QuizCourses">
            <div className="courseheader_continer">
              <h2>BUY COURSES</h2>
              <span>Choose your course and get started.</span>
              <div className="beforelogin_Quiz_cards_cantainer_contain">
                <div>
                  {Object.entries(coursesByPortalAndExam).map(
                    ([portal, exams]) => (
                      <div key={portal}>
                        <h2 className="portal_group_h2">{portal}</h2>{" "}
                        {/* Display portal name */}
                        {Object.entries(exams).map(([examName, courses]) => (
                          <div key={examName} className="exam_group">
                            <h2 className="subheading">{examName}</h2>
                            <div className="courses_container">
                              {courses.map((courseExamsDetails) => (
                                <div className="card_container">
                                  <div
                                    key={courseExamsDetails.courseCreationId}
                                    className="before_login_first_card"
                                  >
                                    <img
                                      src={courseExamsDetails.courseCardImage}
                                      alt={courseExamsDetails.courseName}
                                    />

                                    <div className="before_login_first_carddel">
                                      <p>{courseExamsDetails.courseName}</p>
                                      <p>
                                        Duration:
                                        {formatDate(
                                          courseExamsDetails.courseStartDate
                                        )}
                                        to
                                        {formatDate(
                                          courseExamsDetails.courseEndDate
                                        )}
                                      </p>
                                      {/* <p>
                                        Price: ₹ {courseExamsDetails.totalPrice}
                                      </p> */}
                                      <label>
                                        Price:
                                        <span>
                                          ₹{courseExamsDetails.ActualtotalPrice}
                                        </span>
                                        <span>
                                          {courseExamsDetails.discount}%
                                        </span>
                                        <span>
                                          ₹{courseExamsDetails.totalPrice}
                                        </span>
                                        {/* {courseExamsDetails.ActualtotalPrice}/
                                       
                                        {courseExamsDetails.discount}%/
                                        {courseExamsDetails.totalPrice}/ */}
                                      </label>{" "}
                                    </div>

                                    <div className="before_start_now">
                                      <Link
                                        to={`/coursedataSRP/${courseExamsDetails.courseCreationId}`}
                                      >
                                        Buy Now
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ---------------------------------- working working code after login  end ---------------------------------------------------------- */}
        </>
      ) : (
        <>
          {/* ---------------------------------- working working code before login start ---------------------------------------------------------- */}
          {/* <div
            className="before_login_courses_btn_continer_dashbord_homepage
            "
            id="QuizCourses"
          >
            <div className="courseheader_continer">
              <h2>BUY COURSES</h2>
              <span>Choose your course and get started.</span>
              <div className="beforelogin_Quiz_cards_cantainer_contain">
                <div>
                  {Object.entries(coursesByPortalAndExam).map(
                    ([portal, exams]) => (
                      <div key={portal} className="portal_group">
                        <h2 className="portal_group_h2">{portal}</h2>{" "}
                     
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
                                  <p>{courseExamsDetails.courseName}</p>
                                  <p>
                                    Duration:{" "}
                                    {formatDate(
                                      courseExamsDetails.courseStartDate
                                    )}{" "}
                                    to{" "}
                                    {formatDate(
                                      courseExamsDetails.courseEndDate
                                    )}
                                  </p>
                                  <p>
                                    Price: ₹ {courseExamsDetails.totalPrice}
                                  </p>
                                  <div className="before_start_now">
                                    <Link
                                      to={`/coursedataSRP/${courseExamsDetails.courseCreationId}`}
                                    >
                                      Buy Now
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div> */}
          {/* ---------------------------------- working working code before login  end ----------------
          ------------------------------------------ */}

          <div id="QuizCourses">
            {/* <span>Choose your course and get started.</span> */}
            {popupContent}

            <div className="QuizBUy_courses">
              <div className="QuizBUy_coursessub_conatiner ">
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
                                  {popupbeforelogin ? (
                                    <>
                                      <div className="popupbeforelogin">
                                        {courseExamsDetails.subjectNames}
                                        {courseExamsDetails.testCount}
                                        {courseExamsDetails.customName}
                                        {courseExamsDetails.topicName}
                                      </div>
                                    </>
                                  ) : null}
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
                                      )}
                                       to 
                                      {formatDate(
                                        courseExamsDetails.courseEndDate
                                      )}
                                    </p>
                                    
                                    <p>
                                      <a
                                        style={{ color: "blue",cursor:"pointer" }}
                                        onClick={() =>
                                          handlemoreinfo(
                                            userData.userId,
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
                                        {userData.userId} More Info...
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
                                        <span>
                                          {courseExamsDetails.discount}%
                                        </span>
                                        <span>
                                          ₹{courseExamsDetails.totalPrice}
                                        </span>
                                        {/* {courseExamsDetails.ActualtotalPrice}/
                                       
                                        {courseExamsDetails.discount}%/
                                        {courseExamsDetails.totalPrice}/ */}
                                      </label>{" "}
                                      <Link
                                        to={`/coursedataSRP/${courseExamsDetails.courseCreationId}`}
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
        </>
      )}
    </>
  );
};

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
          Copyright © 2024 eGradTutor All rights reserved
        </p>
      </div>
    </div>
  );
};
