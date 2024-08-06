import React, { useEffect, useRef, useState } from "react";

import BASE_URL from "../../../apiConfig";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { encryptData } from "./utils/crypto";
import "./Style/StudentDashbord_MyCourses.css";
import { FaBookOpenReader } from "react-icons/fa6";
import ReactPlayer from "react-player";
import ProgressPieChart from "../ProgressPieChart ";

const StudentDashbord_MyCourses = ({ usersData, decryptedUserIdState,Branch_Id }) => {
  const [showQuizCourses, setShowQuizCourses] = useState(true);
  const [showtestContainer1, setShowtestContainer1] = useState(false);
  const [showtestContainer2, setShowtestContainer2] = useState(false);
  const [testData, setTestData] = useState(null); // State to hold fetched test data
  const [purchasedCourses, setPurchasedCourses] = useState([]); // State to hold fetched purchased courses
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [selectedPortal, setSelectedPortal] = useState("");
  const [selectedTypeOfTest, setSelectedTypeOfTest] = useState("");
  const [filteredTestData, setFilteredTestData] = useState([]);
  const { courseCreationId } = useParams();
  const user_Id = decryptedUserIdState;
  const [videoProgress, setVideoProgress] = useState({ watched: 0, total: 0 });
  // Fetch test details based on courseCreationId and decryptedUserIdState
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}/${user_Id}`
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
          `${BASE_URL}/Exam_Course_Page/purchasedCourses/${user_Id}/${Branch_Id}`
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
  }, [user_Id,Branch_Id]);

  // Function to check if a course is within the specified time frame
  const isCourseActive = (course) => {
    const currentDate = new Date();
    const startDate = new Date(course.courseStartDate); // Start date from database
    const endDate = new Date(course.courseEndDate); // End date from database
    return currentDate >= startDate && currentDate <= endDate;
  };

  // Filter purchased courses based on active status
  const activeCourses = purchasedCourses.filter(isCourseActive);

  const filteredCourses = activeCourses.filter(
    (course) => selectedPortal === "" || course.portalName === selectedPortal
  );

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

      if (newWinRef) {
        newWinRef.onload = () => {
          newWinRef.postMessage({ usersData }, "*");
        };
      } else {
        console.error("Failed to open new window");
      }

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
          // alert(
          //   "Warning: You are not allowed to switch applications during the test."
          // );
          // newWinRef.focus();
          newWinRef.postMessage('showMalpracticeWarning', '*');
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

  // //mouseclick disabling
  // const handleContextMenu = (e) => {
  //   e.preventDefault();
  // };
  // useEffect(() => {
  //   document.addEventListener("contextmenu", handleContextMenu);

  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);

  const handleTypeOfTestClickback = () => {
    setShowQuizCourses(true);
    // setShowtestContainer(false);
    setShowtestContainer1(false);
    setShowtestContainer2(false);
    // setShowCompletePackageContainer(false);
  };

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
          to={`/UserReport/${user_Id}/${testCreationTableId}/${courseCreationId}`}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "6.9px",
            textDecoration: "none",
            marginBottom: "5px",
          }}
        >
          View Report
        </Link>
      );
    }

    if (Portale_Id === 1 && testAttemptStatus === "Attempted") {
      return (
        <span
          className="span_style_attempt_status"

          // style={{
          //   backgroundColor: "red",
          //   color: "white",
          //   padding: "2.9px",
          //   textDecoration: "none",
          // }}
        >
          Attempted
        </span>
      );
    }

    return (
      <Link
        className="span_style_start_button"
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

  const handleTypeOfTestClick = (typeOfTestName) => {
    setSelectedTypeOfTest(typeOfTestName);
  };

  const handleReset = () => {
    setSelectedTypeOfTest("");
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

  // =======================OVL START====================
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);

  const [courses, setCourses] = useState([]);
  const [initialPlayTime, setInitialPlayTime] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${BASE_URL}/OtsvidesUploads/videos`);
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleViewVideo = async (OVL_Linke_Id) => {
    try {
      const video = videos.find((video) => video.OVL_Linke_Id === OVL_Linke_Id);
      if (!video) {
        throw new Error("Video not found");
      }
      const savedProgress = localStorage.getItem(
        `video-progress-${video.OVL_Linke_Id}`
      );
      const initialPlayTime = savedProgress
        ? JSON.parse(savedProgress).playedSeconds
        : 0;
      setSelectedVideo(video.Drive_Link); // Ensure this is a valid Base64 data URL
      setInitialPlayTime(initialPlayTime);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

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

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(false);
  };

  const handleProgress = (progress) => {
    // Save the current playback position to local storage
    // localStorage.setItem(`video-progress-${selectedVideo}`, JSON.stringify(progress));
  };

  const handleDuration = (duration) => {
    setDuration(duration);
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

  // =======================OVL END====================

  return (
    <div>
         <h1>Branch_Id:{Branch_Id}</h1>
      {!showtestContainer1 &&
        !showtestContainer2 &&
        // !showCompletePackageContainer
        // &&
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
                    <div className="NoActiveCourses_MyCourseTab">
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
                    ).map(([, { portalName, examName, portalId, courses }]) => (
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
                                  {formatDate(courseExamsDetails.courseEndDate)}
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
                                      if (portalId === 1 || portalId === 2) {
                                        handletestClick(
                                          courseExamsDetails.courseCreationId,
                                          user_Id,
                                          portalId
                                        );
                                      } else if (portalId === 3) {
                                        handleVideosClick(
                                          courseExamsDetails.courseCreationId
                                        );
                                      }
                                      // else if (portalId === 4) {
                                      //   handleCompletePackage(
                                      //     courseExamsDetails.courseCreationId,
                                      //     user_Id,
                                      //     portalId
                                      //   );
                                      // }
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
                    ))
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
                    <div
                      // className="by_selected_type"

                      className="default_test_cards"
                    >
                      <div className="testPageHeading">
                        <h4>{selectedTypeOfTest}</h4>
                      </div>

                      <div className="test_cards">
                        {filteredTestData.map((test, index) => (
                          <>
                            <div className="test_card">
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
                            </div>
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
                                  <ul
                                    // className="testcard_inline"
                                    className="testcard_inline"
                                    style={{
                                      backgroundColor: getBackgroundColor(type),
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
                      {/* {videos.map((video) => (
                        <div
                          className="OVL_card_data"
                          key={video.OVL_Linke_Id}
                        >
                          <h2 className="OVL_text">{video.Lectures_name}</h2>
                          <button
                            className="view-video-button"
                            onClick={() =>{
                              handleViewVideo(video.OVL_Linke_Id)
                              console.log(video.OVL_Linke_Id)
                            }
                             
                            }
                          >
                            <i className="fa-solid fa-play"></i>
                          </button>
                          <div>
                            <ProgressPieChart videoProgress={videoProgress} />
                          </div>
                        </div>
                      ))} */}

                      {videos.map((video) => (
                        <div className="OVL_card_data" key={video.OVL_Linke_Id}>
                          <h2 className="OVL_text">{video.Lectures_name}</h2>
                          {/* <React.Fragment key={video.OVL_Linke_Id}> */}
                          <ProgressPieChart
                            className="pie_button"
                            videoProgress={videoProgress}
                            onClick={() => {
                              handleViewVideo(video.OVL_Linke_Id);
                              console.log(video.OVL_Linke_Id);
                            }}
                          />
                          {/* </React.Fragment> */}
                        </div>
                      ))}
                    </div>
                    {isModalOpen && (
                      <div className="video-modal">
                        <button onClick={handleCloseModal}>Close</button>
                        <div className="video-container">
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
                            played={initialPlayTime}
                            config={{
                              file: {
                                attributes: {
                                  controlsList: "nodownload",
                                },
                              },
                            }}
                            onError={(e) => console.error("Video Error:", e)}
                          />
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
    </div>
  );
};

export default StudentDashbord_MyCourses;



