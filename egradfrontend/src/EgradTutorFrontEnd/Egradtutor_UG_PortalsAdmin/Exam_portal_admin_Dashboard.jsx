import React, { useState, useEffect } from "react";
import "./styles/Exam_portal_admin_Dashboard.css";
import axios from "axios";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import BASE_URL from "../../apiConfig";
import { useSpring, animated } from "react-spring";
import { FaCircleArrowRight } from "react-icons/fa6";

const useFetchCount = (url) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const firstObject = data[0];
        const totalCount = firstObject ? firstObject.count : 0;

        // console.log("Data received:", totalCount);
        setCount(totalCount);
      })
      .catch((error) =>
        console.error(`Error fetching count from ${url}:`, error.message)
      );
  }, [url]);

  return count;
};

const ExamCount = ({ examCount }) => {
  const props = useSpring({
    to: { number: examCount },
    from: { number: 0 },
    config: { duration: 2000 },
  });

  // console.log("Props from useSpring:", props); // Check the output
  return (
    <animated.h2 className="examCount">
      {props.number.to((n) => n.toFixed(0))}
    </animated.h2>
  );
};

const CourseCount = ({ courseCount }) => {
  const props = useSpring({
    to: { number: courseCount },
    from: { number: 0 },
    config: { duration: 2000 },
  });

  // console.log("Props from useSpring:", props); // Check the output
  return (
    <animated.h2 className="examCount">
      {props.number.to((n) => n.toFixed(0))}
    </animated.h2>
  );
};

const QuestionCount = ({ questionCount }) => {
  const props = useSpring({
    to: { number: questionCount },
    from: { number: 0 },
    config: { duration: 3000 },
  });

  // console.log("Props from useSpring:", props); // Check the output
  return (
    <animated.h2 className="examCount">
      {props.number.to((n) => n.toFixed(0))}
    </animated.h2>
  );
};

const TestCount = ({ testCount }) => {
  const props = useSpring({
    to: { number: testCount },
    from: { number: 0 },
    config: { duration: 2000 },
  });

  // console.log("Props from useSpring:", props); // Check the output
  return (
    <animated.h2 className="examCount">
      {props.number.to((n) => n.toFixed(0))}
    </animated.h2>
  );
};

const UserCount = ({ userCount }) => {
  const props = useSpring({
    to: { number: userCount },
    from: { number: 0 },
    config: { duration: 2000 },
  });

  // console.log("Props from useSpring:", props); // Check the output
  return (
    <animated.h2 className="examCount">
      {props.number.to((n) => n.toFixed(0))}
    </animated.h2>
  );
};

const VideosCount = ({ videosCount }) => {
  const props = useSpring({
    to: { number: videosCount },
    from: { number: 0 },
    config: { duration: 2000 },
  });

  // console.log("Props from useSpring:", props); // Check the output
  return (
    <animated.h2 className="examCount">
      {props.number.to((n) => n.toFixed(0))}
    </animated.h2>
  );
};

const Exam_portal_admin_Dashboard = () => {
  const [showExams, setShowExams] = useState(false);
  const [showExamspopup, setShowExamspopup] = useState(false);
  const [showcoursepopup, setShowcoursepopup] = useState(false);

  // showExamspopup;
  const [exams, setExams] = useState([]);
  const [isListOpen, setListOpen] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const [iscourseListOpen, setCourseListOpen] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [tests, setTests] = useState([]);
  const [isTestListOpen, setTestListOpen] = useState(false);
  const [gototest_Reports, sethandleGototest_Reports] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);

  const [adminTestList, setAdminTestList] = useState([]);
  const [score_Overview, setScore_Overview] = useState(true);
  const [qustion_Overview, setQustion_Overview] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [gototest_review, setGototest_review] = useState(true);

  const courseCount = useFetchCount(`${BASE_URL}/Dashboard/courses/count`);
  const examCount = useFetchCount(`${BASE_URL}/Dashboard/exam/count`);
  const testCount = useFetchCount(`${BASE_URL}/Dashboard/test/count`);
  const userCount = useFetchCount(`${BASE_URL}/Dashboard/user/count`);
  const videosCount = useFetchCount(`${BASE_URL}/Dashboard/videos/count`);

  const questionCount = useFetchCount(`${BASE_URL}/Dashboard/question/count`);

  const handleViewExams = () => {
    fetch(`${BASE_URL}/Dashboard/exam`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setExams(data);
        setListOpen(true);
        setShowExams(true);
        setShowExamspopup(true);
      })
      .catch((error) =>
        console.error("Error fetching exam names:", error.message)
      );
  };

  const handleViewCourse = () => {
    fetch(` ${BASE_URL}/Dashboard/course`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data);
        setCourseListOpen(true);
        setShowCourses(true);
        setShowcoursepopup(true);
      })
      .catch((error) =>
        console.error("Error fetching Course names:", error.message)
      );
  };

  useEffect(() => {
    fetch(`${BASE_URL}/Dashboard/AdminTestList`)
      .then((response) => response.json())
      .then((data) => setAdminTestList(data));
  }, []);

  const handleViewTest = () => {
    fetch(`${BASE_URL}/Dashboard/Test`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTests(data);
        setTestListOpen(!isTestListOpen);
        setShowTests(true);
      })
      .catch((error) =>
        console.error("Error fetching Test names:", error.message)
      );
  };

  const handleGototest_review = () => {
    setGototest_review(!gototest_review);
  };
  const handleGototest_reviewback = () => {
    setGototest_review(true);
  };

  const handleGototest_Reports = async (testCreationTableId) => {
    // console.log(testCreationTableId);
    sethandleGototest_Reports(!gototest_Reports);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Dashboard/AdminDcUsermarks/${testCreationTableId}`
        );
        if (response.data && response.data.message === "No data available.") {
          // console.log("No data available.");
          setShowNoDataMessage(true);
          alert("No data available for this test.");
          sethandleGototest_Reports(gototest_Reports);
        } else {
          setUserData(response.data);
          // console.log(response.data);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    // console.log("first");
    await fetchData();
  };

  const handleGototest_Reports_back = () => {
    sethandleGototest_Reports(true);
  };

  const handlescore_Overview = () => {
    setScore_Overview(true);
    setQustion_Overview(false);
    setParticipants(false);
  };

  const handlequstion_Overview = () => {
    setScore_Overview(false);
    setQustion_Overview(true);
    setParticipants(false);
  };

  const handleparticipats = () => {
    setScore_Overview(false);
    setQustion_Overview(false);
    setParticipants(true);
  };

  const handleshowExamsclose = () => {
    setShowExamspopup(false);
  };

  const handleshowcourseclose = () => {
    setShowcoursepopup(false);
  };
  return (
    <>
      {gototest_Reports ? (
        <>
          {showNoDataMessage ? (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close"
                  onClick={() => setShowNoDataMessage(false)}
                >
                  &times;
                </span>
                <p>No data available.</p>
              </div>
            </div>
          ) : null}
          {gototest_review ? (
            <>
              <div className="DashboardContainer">
                <div className="Dashboard_container">
                  <h1 className="textColor">Dashboard</h1>
                  <div className="DASHBOARDCards_Section">
                    <div className="Dashboard_subcontainer">
                      <div className="Dashboard_contant">
                        <i className="fa-solid fa-user-pen"></i>
                        <h2>Total Exams </h2>
                        <ExamCount examCount={examCount} />
                        <button onClick={handleViewExams}>
                          More Info <FaCircleArrowRight />
                        </button>
                        <div>
                          {showExamspopup ? (
                            <>
                              {showExams && (
                                <div
                                  className="total_list"
                                  style={{ position: "absolute" }}
                                >
                                  <button onClick={handleshowExamsclose}>
                                    X
                                  </button>
                                  {isListOpen && (
                                    <ul>
                                      <h2 className="Dahbord_list_heading">
                                        Exams List
                                      </h2>
                                      {exams.map((exam, index) => (
                                        <li key={index}>
                                          {exam.coursesPortalExamname}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="Dashboard_contant">
                        <i className="fa-solid fa-pen-nib"></i>
                        <h2>Total Courses</h2>
                        <CourseCount courseCount={courseCount} />
                        <button onClick={handleViewCourse}>
                          More Info <FaCircleArrowRight />
                        </button>
                        <div>
                          {showcoursepopup ? (
                            <>
                              {showCourses && (
                                <div
                                  className="total_list"
                                  style={{ position: "absolute" }}
                                >
                                  <button onClick={handleshowcourseclose}>
                                    X
                                  </button>
                                  {iscourseListOpen && (
                                    <ul>
                                      <h2 className="Dahbord_list_heading">
                                        Courses List
                                      </h2>
                                      {courses.map((course, index) => (
                                        <li key={index}>{course.courseName}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="Dashboard_contant">
                        <i className="fa-solid fa-person-chalkboard"></i>
                        <h2>Total Tests</h2>
                        <TestCount testCount={testCount} />
                        <button onClick={handleGototest_review}>
                          More Info <FaCircleArrowRight />
                        </button>
                      </div>
                      <div className="Dashboard_contant">
                        <i class="fa-solid fa-video"></i>
                        <h2>Total Videos</h2>
                        <VideosCount videosCount={videosCount} />
                        <button>
                          {" "}
                          More Info <FaCircleArrowRight />
                        </button>
                      </div>

                      <div className="Dashboard_contant">
                        <i class="fa-solid fa-users"></i>
                        <h2>User Registrations </h2>
                        <UserCount userCount={userCount} />
                        <button>
                          {" "}
                          More Info <FaCircleArrowRight />
                        </button>
                      </div>
                      <div className="Dashboard_contant">
                        <i class="fa-solid fa-clipboard-question"></i>
                        <h2>Total Questions </h2>
                        <QuestionCount questionCount={questionCount} />
                        <button>
                          {" "}
                          More Info <FaCircleArrowRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="admintestReview_section">
                <div className="admin_searchBar">
                  <h4>Test List</h4>
                  <button onClick={handleGototest_reviewback}>Go Back</button>
                </div>
                <div className="admintestReview_container">
                  {adminTestList.map((test) => (
                    <ul className=" admintestReview" key={test.testCreationId}>
                      <li className="TestList_contant TestList_Name">
                        <b>{test.TestName}</b>
                      </li>
                      <li className="TestList_contant">
                        Course:{test.courseName}
                      </li>

                      <li className="TestList_contant">
                        Open Date: {test.formatted_StartDate}{" "}
                        {test.formatted_StartTime}
                      </li>

                      <li className="TestList_contant">
                        Close Date: {test.formatted_EndDate}{" "}
                        {test.formatted_EndTime}
                      </li>

                      <li className="TestList_contant">
                        No of questions: {test.TotalQuestions}
                      </li>

                      <li className="TestList_contant">
                        Status: {test.status}
                      </li>

                      <button
                        onClick={() =>
                          handleGototest_Reports(test.testCreationTableId)
                        }
                      >
                        Reports
                      </button>
                    </ul>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div></div>
          <div className="gototest_Reports">
            <div className="gototest_Reports_btncontiner">
              <div>
                <button
                  onClick={handlescore_Overview}
                  className={score_Overview ? "activeintest_adim" : ""}
                >
                  Score Overview
                </button>
                <button
                  onClick={handlequstion_Overview}
                  className={qustion_Overview ? "activeintest_adim" : ""}
                >
                  Question wise
                </button>
                <button
                  onClick={handleparticipats}
                  className={participants ? "activeintest_adim" : ""}
                >
                  Participants
                </button>
              </div>

              <button onClick={handleGototest_Reports_back}>
                Back to Test List
              </button>
            </div>

            {score_Overview ? (
              <div>
                {userData && (
                  <div className="overall_scores">
                    <ul className="overallscores_list">
                      <li>
                        Test Name: <b>{userData.maxPercentageUser.TestName}</b>
                      </li>
                      <li>
                        Total Marks:{" "}
                        <b>{userData.maxPercentageUser.totalMarks}</b>
                      </li>
                      <li>
                        {" "}
                        Course Name:{" "}
                        <b>{userData.maxPercentageUser.courseName}</b>
                      </li>
                      <li>
                        {" "}
                        Topper: <b>
                          {" "}
                          {userData.maxPercentageUser.username}
                        </b>{" "}
                        Marks: <b>{userData.totalDifference}</b>
                      </li>
                      <li>
                        Percentage: <b>{userData.percentage}%</b>
                      </li>
                      <li>
                        {" "}
                        Attempted Users Count:{" "}
                        <b>{userData.attemptedUsersCount}</b>
                      </li>
                    </ul>
                    <div className="score_Overview_lineChart">
                      <Line
                        data={{
                          labels: userData.usermarks3.map(
                            (user, index) => user.username
                          ),
                          datasets: [
                            {
                              label: "Test Results",
                              data: userData.usermarks3.map(
                                (user) => user.total_marks
                              ),
                              fill: false,
                              borderColor: "rgb(75, 192, 192)",
                              tension: 0.1,
                            },
                          ],
                        }}
                        options={{
                          tooltips: {
                            callbacks: {
                              label: function (tooltipItem, data) {
                                var label = data.labels[tooltipItem.index];
                                var value =
                                  data.datasets[tooltipItem.datasetIndex].data[
                                    tooltipItem.index
                                  ];
                                return `Username: ${label}, Sum of Status 1: ${value}`;
                              },
                            },
                          },
                        }}
                      />
                    </div>
                    <div></div>
                  </div>
                )}
              </div>
            ) : null}

            {qustion_Overview ? (
              <div>
                {userData &&
                  userData.questionStats &&
                  userData.questionStats.map((questionStat, index) => (
                    <div key={index} style={{ display: "flex" }}>
                      <ul className="questions_stats_list">
                        <li>
                          Question: <b>{questionStat["Q.No"]}</b>{" "}
                        </li>
                        <li>
                          {" "}
                          Total Participants:{" "}
                          <b> {questionStat["TotalParticipants"]}</b>
                        </li>
                        <li>
                          Corrected By: <b> {questionStat["CorrectedBy"]}</b>
                        </li>
                        <li>
                          In-corrected By:{" "}
                          <b> {questionStat["In-correctedBy"]}</b>
                        </li>
                        <li>
                          Un-attempted By:{" "}
                          <b>{questionStat["Un-attemptedBy"]}</b>
                        </li>
                      </ul>
                    </div>
                  ))}
              </div>
            ) : null}

            {participants ? (
              <>
                <div>
                  {userData &&
                    userData.usermarks3 &&
                    userData.userStats &&
                    userData.usermarks3.map((usermarks3, index) => {
                      const correspondingUserStats = userData.userStats.find(
                        (userStat) => userStat.user_Id === usermarks3.user_Id
                      );
                      return (
                        <div key={index} style={{ display: "flex" }}>
                          <ul className="questions_stats_listsQP">
                            <li>
                              Participants: <b>{usermarks3["username"]}</b>{" "}
                            </li>

                            <li>
                              Correct: <b>{usermarks3["correct_count"]}</b>{" "}
                            </li>
                            <li>
                              Incorrect: <b> {usermarks3["incorrect_count"]}</b>{" "}
                            </li>
                            <li>
                              Max Score: <b>{usermarks3["totalMarks"]}</b>
                            </li>
                            {correspondingUserStats && (
                              <>
                                <li>
                                  Student Score:
                                  <b> {usermarks3["total_marks"]}</b>
                                </li>

                                <li>
                                  Percentage:{" "}
                                  <b>{correspondingUserStats["percentage"]}%</b>
                                </li>
                              </>
                            )}
                            <li>
                              Time Taken: <b>{usermarks3["time_left"]}</b>{" "}
                            </li>
                          </ul>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default Exam_portal_admin_Dashboard;
