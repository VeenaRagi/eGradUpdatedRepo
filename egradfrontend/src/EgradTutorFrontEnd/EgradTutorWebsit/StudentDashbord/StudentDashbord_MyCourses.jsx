import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import Control from "./Control";
import { encryptData } from "../../../utils/crypto";
import ReactPlayer from "react-player";
import { FaBookOpenReader } from "react-icons/fa6";
import "./Style/StudentDashbord_MyCourses.css";

const StudentDashbord_MyCourses = ({ usersData, decryptedUserIdState }) => {
  const [testDetails, setTestDetails] = useState([]);
  const [selectedTypeOfTest, setSelectedTypeOfTest] = useState("");
  const [testPageHeading, setTestPageHeading] = useState([]);
  const [filteredTestData, setFilteredTestData] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [showQuizCourses, setShowQuizCourses] = useState(true);
  const [showtestContainer1, setShowtestContainer1] = useState(false);
  const [showtestContainer2, setShowtestContainer2] = useState(false);
  const [showtestContainer3, setShowtestContainer3] = useState(false);
  const [showCompletePackageContainer, setShowCompletePackageContainer] =
    useState(false);
  const [completePackage, setCompletePackage] = useState([]);
  const { Portale_Id } = useParams();
  const [selectedPortal, setSelectedPortal] = useState("");

  const userData =
    usersData.users && usersData.users.length > 0
      ? usersData.users.map((user) => user.user_Id)
      : null;
  const user_Id = decryptedUserIdState;

  console.log("hiiiiiiii");
  console.log(user_Id);
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
  }, [user_Id]);

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

  const handletestClick = async (courseCreationId, decryptedUserIdState) => {
    console.log("handletestClick:", courseCreationId, decryptedUserIdState);
    try {
      const response = await axios.get(
        // `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}`
        `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}/${decryptedUserIdState}`
      );
      console.log(courseCreationId,"This is ccid 111111111111111111111111",decryptedUserIdState,"decrypted")
      setTestDetails(response.data);
      setShowQuizCourses(false);
      setShowtestContainer1(true);
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };
  console.log("helloooooooooooooooooo")
  console.log(testDetails);
  console.log("decryptedUserIdState:",decryptedUserIdState)
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

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/purchasedCourses/${user_Id}`
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
        `http://localhost:5001/QuizPage/clearresponseforPB/${user_Id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ user_Id }),
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
    user_Id,
    courseCreationId,
    testCreationTableId
  ) => {
    // Example conditions, you need to replace them with your actual conditions
    if (
      test_status === "Completed" &&
      user_Id &&
      courseCreationId &&
      testCreationTableId
    ) {
      // Check additional conditions if needed
      return "View Report";
    } else if (
      test_status === "incomplete" &&
      user_Id &&
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
  const [isModalOpen, setIsModalOpen] = useState("");

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

  const handleViewVideo = async (OVL_Linke_Id) => {
    console.log("helloooooooo");
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
  const renderTestAction = (test) => {
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
                                      } else if (portalId === 4) {
                                        handleCompletePackage(
                                          courseExamsDetails.courseCreationId,
                                          user_Id,
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
                      {[
                        ...new Set(
                          testDetails.map((test) => test.typeOfTestName)
                        ),
                      ].map((type, index) => (
                        <div className="default_test_cards" key={index}>
                          <div className="testPageHeading">
                            <h3>{type}</h3>
                          </div>

                          <div className="test_cards">
                            {testDetails
                              .filter((test) => test.typeOfTestName === type)
                              .map((test, testIndex) => (
                                <div key={testIndex} className="test_card">
                                  <ul
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
                <div>
                  <h2>OVL 2</h2>
                  <div>
                    {videos.length > 0 && (
                      <h2 className="OVL_PageHeading">
                        {videos[0].OVL_Course_Name}
                      </h2>
                    )}
                    <div className="OVL_cards">
                      {videos.map((video) => (
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
                            className={`video-container ${
                              isFullscreen ? "disable-right-click" : ""
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
                              onError={(e) => console.error("Video Error:", e)}
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
              </div>
            </div>
          </div>
        </div>
      )}

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
                        <li>Test Duration: {completeData.Duration} Minutes</li>
                        <li>
                          <a className="test_start_button" href="/UgadminHome">
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
  );
};

export default StudentDashbord_MyCourses;
