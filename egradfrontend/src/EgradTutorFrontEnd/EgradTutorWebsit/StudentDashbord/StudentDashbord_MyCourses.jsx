

import React, { useEffect, useState } from "react";
import BASE_URL from "../../../apiConfig";
import "./Style/StudentDashbord_MyCourses.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { encryptData } from "./utils/crypto";
import './Style/StudentDashbord_MyCourses.css'

const StudentDashbord_MyCourses = ({ usersData, decryptedUserIdState }) => {
  const [showQuizCourses, setShowQuizCourses] = useState(true);
  const [showtestContainer1, setShowtestContainer1] = useState(false);

  const [testData, setTestData] = useState(null); // State to hold fetched test data
  const [purchasedCourses, setPurchasedCourses] = useState([]); // State to hold fetched purchased courses
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  const user_Id = decryptedUserIdState;
  // Fetch test details based on courseCreationId and decryptedUserIdState
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestPage/feachingOveralltest/1/${user_Id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTestData(data);
        setIsLoading(false); // Set loading state to false after data is fetched
        console.log("Fetched test data:", data);
      } catch (error) {
        console.error("Error fetching test data:", error);
        setIsLoading(false); // Set loading state to false on error
      }
    };

    fetchTestDetails();
  }, [user_Id]);

  // Fetch purchased courses based on decryptedUserIdState
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Exam_Course_Page/purchasedCourses/${user_Id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch purchased courses");
        }
        const data = await response.json();
        setPurchasedCourses(data);
        console.log("Fetched purchased courses:", data);
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
      }
    };

    fetchPurchasedCourses();
  }, [user_Id]);

  // Function to format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [testDetails, setTestDetails] = useState();
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
  // Render logic for displaying fetched data
  return (
    <div>
      {showQuizCourses && (
        <div>
          <h2>Purchased Courses</h2>
          {purchasedCourses.length > 0 ? (
            <ul>
              {purchasedCourses.map((course) => (
                <li  className="courses_boxcontainer" key={course.courseId}>
                  <img src={course.courseCardImage} alt={course.courseName} />
                  <p>Course Name:</p> {course.courseName}
                  <p>
                    <b>Duration:</b>
                    {formatDate(course.courseStartDate)} to{" "}
                    {formatDate(course.courseEndDate)}
                  </p>
                  <Link
                    onClick={() => {
                      handletestClick(course.courseCreationId, user_Id);
                    }}
                  >
                    {/* {portalId === 1 || portalId === 2
                  ? "Go to Test"
                  : portalId === 3
                  ? "Start Lecture"
                  : portalId === 4
                  ? "Open Complete Package"
                  : null} */}
                    Go to Test
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No purchased courses found.</p>
          )}
        </div>
      )}
      {showtestContainer1 && (
        <div>
          <h2>Test Details</h2>
          {isLoading ? (
            <p>Loading test details...</p>
          ) : testData ? (
            <ul>
              {testData.map((test) => (
                <li key={test.testCreationTableId}>
                  <li>{test.TestName}</li>
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
                    {" "}
                    <Link
                      className="test_start_button"
                      to="#"
                      onClick={() => {
                        openPopup(test.testCreationTableId, user_Id);
                        handleSaveStartTime(
                          user_Id,
                          test.testCreationTableId,
                          test.courseCreationId
                        );
                      }}
                    >
                      Start Test
                    </Link>
                  </li>
                </li>
              ))}
            </ul>
          ) : (
            <p>Error fetching test details.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashbord_MyCourses;
