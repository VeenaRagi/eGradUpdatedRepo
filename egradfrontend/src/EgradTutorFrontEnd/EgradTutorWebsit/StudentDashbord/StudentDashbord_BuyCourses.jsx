import React, { useState, useEffect } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import { PiHandTapBold, PiHandTapThin } from "react-icons/pi";

const StudentDashbord_BuyCourses = ({ usersData }) => {
  const user_Id =
    usersData.users && usersData.users.length > 0
      ? usersData.users.map((user) => user.username)
      : null;

  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);
  const navigate = useNavigate(); // Use this for navigation
  const [popupContent, setPopupContent] = useState(null);

  const fetchUnPurchasedCourses = async () => {
    if (!user_Id) {
      return; // Exit if userData.id is not defined
    }

    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${user_Id}`
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
  }, [user_Id]); // Fetch only when userData.id is defined

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

  function studentbuynowbtnuserboughtcoursecheck(courseCreationId, user_Id) {
    // Make a GET request to your backend endpoint
    fetch(
      `http://localhost:5001/StudentRegistationPage/getotsregistrationdata/${courseCreationId}/${user_Id}`
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
            `http://localhost:5001/StudentRegistationPage/insertthedatainstbtable/${courseCreationId}/${user_Id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ courseCreationId, user_Id }), // Assuming data contains the data you want to write
            }
          )
            .then((response) => response.json())
            .then((responseData) => {
              console.log(courseCreationId, user_Id);
              console.log(responseData.message);
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
  const handlemoreinfo = async (user_Id, Portale_Id, courseCreationId) => {
    // setPopupbeforelogin(true);
    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${user_Id}`
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
                                      user_Id,
                                      courseExamsDetails.Portale_Id,
                                      courseExamsDetails.courseCreationId
                                    )
                                  }
                                >
                                  More Info...
                                </a>
                              </p>

                              <div className="QuizBUy_coursescontainerwithfilteringcoursebox_info_buynoeprice">
                                <label>
                                  Price:
                                  <span>
                                    ₹{courseExamsDetails.ActualtotalPrice}
                                  </span>
                                  <span>{courseExamsDetails.discount}%</span>
                                  <span>₹{courseExamsDetails.totalPrice}</span>
                                </label>{" "}
                                <Link
                                  onClick={() =>
                                    studentbuynowbtnuserboughtcoursecheck(
                                      courseExamsDetails.courseCreationId,
                                      user_Id
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

export default StudentDashbord_BuyCourses;
