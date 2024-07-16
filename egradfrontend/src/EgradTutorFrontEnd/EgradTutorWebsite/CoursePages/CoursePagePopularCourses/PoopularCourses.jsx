import React, { useContext, useEffect, useState,} from "react";
import BASE_URL from "../../../../apiConfig";
import { Link, useParams,useNavigate } from "react-router-dom";
import { GoChevronDown } from "react-icons/go";
import '../../../../styles/CoursesPageStyles/CoursePage.css'
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import img from '../../../../styles/About_us_Image.jpeg'
// theme-2
import '../../../../styles/CoursesPageStyles/OrangeTheme.css'
// theme white is for default
import '../../../../styles/CoursesPageStyles/themeWhite.css'
// before themes, css
import '../../../../styles/CoursesPageStyles/Home.css'
// theme-1 (green,yellow )
import '../../../../styles/CoursesPageStyles/Theme-green.css';
import '../../../../styles/CoursesPageStyles/CoursePage.css'
 
const PoopularCourses = ({userRole}) => {
  const { Portale_Id } = useParams();
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);
  const themeFromContext = useContext(ThemeContext);
  const fetchunPurchasedCourses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/PoopularCourses/unPurchasedCoursesOnHomePage/${Portale_Id}`
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
  }, []);
 
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
 
  const coursesByPortalAndExam = unPurchasedCourses.reduce(
    (portals, course) => {
      const portal = course.portal || "Unknown Portal";
      const examName = course.examName || "Unknown Exam";
      if (!portals[portal]) {
        portals[portal] = {};
      }
      if (!portals[portal][examName]) {
        portals[portal][examName] = [];
      }
      portals[portal][examName].push(course);
      console.log(portals, "portals from the coursesByPortalAndExam");
      return portals;
    },
    {}
  );
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // for refreshing the page when admin clicked theme
  const refreshChannel = new BroadcastChannel("refresh_channel");
  refreshChannel.onmessage = function (event) {
    if (event.data === "refresh_page") {
      window.location.reload(); // Reload the page
    }
  };


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate(); // Use this for navigation
  // const [popupContent, setPopupContent] = useState(null);
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
 
  return (
    <div id="PoopularCourses" className={`${themeDetails.themePopularCourses_container}`}>
      <div className={`${themeDetails.themePopularCourses_Subcontainer}`}>
        <div className={`courseheader_continer ${themeDetails.themeCourseheader_continer }`}>
          <div
            className={`${themeDetails.theme_COURSES} `}
          >
            <div className={`${themeDetails.themeHeadingInCp}`}>
              <h2
                className={`${themeDetails.themeContant} `}
              >BUY COURSES</h2>
            </div>
            <div className={`${themeDetails.themeBuyCourseSpan}`}>
            <span>Choose your course and get started.</span>
            </div>
          </div>
          <div className="beforelogin_Quiz_cards_cantainer_contain">
          {Object.keys(coursesByPortalAndExam).length > 0 ? (
        Object.entries(coursesByPortalAndExam).map(([portal, exams]) => (
          <div key={portal} className={themeDetails.theme_portal}>
            {themeColor === 'theme-purple' ? (
              <div className="pp">
                <h2 className="portal_group_h2">{portal}</h2>
                <div>
                  <img src={img} alt="" />
                </div>
              </div>
            ) : (
              <h2 className="portal_group_h2">{portal}</h2>
            )}
            {Object.entries(exams).map(([examName, courses], index) => (
              <div
                key={examName}
                className={`exam_group ${themeDetails.theme_exam_group}
                ${index % 2 === 0 ? 'evenColor' : 'oddColor'}`}
              >
                <h2
                  className={`subheading ${themeDetails.theme_examName}`}
                  id={themeDetails.theme_examName}
                >
                  {examName}
                </h2>
                <div
                  className={`courses_container ${themeDetails.theme_courses_container}`}
                >
                  {courses.length > 0 ? (
                    courses.map((courseExamsDetails) => (
                      <div
                        key={courseExamsDetails.courseCreationId}
                        className={`card_container ${themeDetails.themeCard}`}
                      >
                        <div
                          className={`before_login_first_card ${themeDetails.themeCardImg}`}
                        >
                          <img
                            src={courseExamsDetails.courseCardImage}
                            alt={courseExamsDetails.courseName}
                          />
                          {themeColor === 'theme-purple' && (
                            <div className="purpleCardHeading">
                              {courseExamsDetails.courseName}
                            </div>
                          )}
                          {themeColor === 'theme-blue' && (
                            <div className="blueCardHeading">
                              {courseExamsDetails.courseName}
                              <GoChevronDown />
                            </div>
                          )}
                          {themeColor === 'theme-purple' && (
                            <p>
                              <span className='durationBeforeHover'>Duration:</span>
                              {formatDate(courseExamsDetails.courseStartDate)}
                              <small style={{ textTransform: 'capitalize', padding: '0 1px' }}> to </small>
                              {formatDate(courseExamsDetails.courseEndDate)}
                            </p>
                          )}
                          <div
                            className={`before_login_first_carddel ${themeDetails.themeCardBody}`}
                          >
                            <p className={`courseNameInCard ${themeDetails.themeCourseNameInCard}`}>
                              {courseExamsDetails.courseName}
                            </p>
                            <p>
                              <span className={themeDetails.themeCourseInfoSpan}>Duration:</span>
                              {formatDate(courseExamsDetails.courseStartDate)} to
                              {formatDate(courseExamsDetails.courseEndDate)}
                            </p>
                            <p className="Price_Discount">
                              <p>
                                <span className={themeDetails.themeCourseInfoSpan}>Price:</span>
                                <span className="toBeStrikeOff">
                                  {courseExamsDetails.ActualtotalPrice}
                                </span>
                              </p>
                              <p>
                                <span className={themeDetails.themeCourseInfoSpan}>Discount:</span> {courseExamsDetails.discount}%
                              </p>
                            </p>
                            <p className={themeDetails.themeCourseAmountSpan}>
                              <span className={themeDetails.themeCourseInfoSpan}>Amount: ₹</span>
                              {courseExamsDetails.totalPrice}/-
                            </p>
                            <div className={`before_start_now ${themeDetails.themeBuyButtonInCP}`}>
                              <Link
                                // to={`/RegistrationForm/${courseExamsDetails.courseCreationId}`}
                                onClick={() =>
                                  studentbuynowbtnuserboughtcoursecheck(
                                    courseExamsDetails.courseCreationId,
                                    userData.id
                                  )
                                }
                              >
                                Buy Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : userRole === 'user' ? (
                    <p>No courses available at the moment. Please check back later.</p>
                  ) : userRole === 'admin' ? (
                    <p>No courses available. Please add the necessary courses.</p>
                  ) : (
                    <p>No courses available. Please contact support if this issue persists.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : userRole === 'user' ? (
        <p>No portals or exams available at the moment. Please check back later.</p>
      ) : userRole === 'admin' ? (
        <p>No portals or exams available. Please update the necessary details.</p>
      ) : (
        <p>No portals or exams available. Please contact support if this issue persists.</p>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default PoopularCourses;