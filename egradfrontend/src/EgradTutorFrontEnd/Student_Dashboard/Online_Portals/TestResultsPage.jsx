import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import "./styles/TestResultPage.css";
import BASE_URL from '../../../apiConfig'
import axios from "axios";
import { Navbar } from "./Data/Introduction_Page_Data";
import { decryptData, encryptData } from "../utils/crypto";


const TestResultsPage = () => {
  const navigate = useNavigate();

  const { param1, param2 } = useParams();

  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("navigationToken");

    // If token doesn't exist, navigate to the error page
    if (!token) {
      navigate("/Error");
      return;
    }

    const decryptParams = async () => {
      try {
        // Decrypt parameters
        const decrypted1 = await decryptData(param1);
        const decrypted2 = await decryptData(param2);

        // Example validation (you can modify this based on your actual requirements)
        if (
          !decrypted1 ||
          !decrypted2 ||
          isNaN(parseInt(decrypted1)) ||
          isNaN(parseInt(decrypted2))
        ) {
          // If parameters are not valid, navigate to the error page or handle as needed
          navigate("/Error");
          return;
        }

        setDecryptedParam1(decrypted1);
        setDecryptedParam2(decrypted2);
      } catch (error) {
        console.error("Error decrypting data:", error);
        navigate("/Error");
      }
    };

    decryptParams();
  }, [param1, param2, navigate]);


  // const { testCreationTableId, user_Id, userId } = useParams();
  const [testName, setTestName] = useState("");

  const [userData, setUserData] = useState({});
  const fetchTestName = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptions/${decryptedParam1}`
      );
      const data = await response.json();
      const testName = data.questions[0].TestName;
      setTestName(testName);
    } catch (error) {
      console.error("Error fetching test name:", error);
    }
  };
  useEffect(() => {
    fetchTestName();
  }, [decryptedParam1]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/ughomepage_banner_login/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token to headers for authentication
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
          // console.log(userData);
        } else {
          // Handle errors, e.g., if user data fetch fails
        }
      } catch (error) {
        // Handle other errors
      }
    };

    fetchUserData();
  }, []);

  const [answer, setAnswer] = useState([]);

  console.log(decryptedParam2);
  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const responseAnswer = await fetch(
          `${BASE_URL}/TestResultPage/answer/${decryptedParam1}/${decryptedParam2}`
        );
        const answerData = await responseAnswer.json();
        setAnswer(answerData);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

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

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          // Handle errors, e.g., if user data fetch fails
        }
      } catch (error) {
        // Handle other errors
      }
    };

    fetchAnswer();
    fetchUserData();
  }, [decryptedParam1, decryptedParam2]); // Include dependencies in the dependency array
  // Include dependencies in the dependency array

  // const [answer, setAnswer] = useState([]);
  const [questionData, setQuestionData] = useState({});
  const [questionStatus, setQuestionStatus] = useState([]);
  // const [selectedAnswers, setSelectedAnswers] = useState([]);
  // const { testCreationTableId } = useParams();
  const [answeredCount, setAnsweredCount] = useState(0);
  const [notAnsweredCount, setNotAnsweredCount] = useState(0);

  const [questionCount, setQuestionCount] = useState(null);

  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/questionCount/${decryptedParam1}`
        ); // Replace "yourTestCreationTableId" with the actual testCreationTableId
        const data = await response.json();
        setQuestionCount(data);
      } catch (error) {
        console.error("Error fetching question count:", error);
      }
    };

    fetchQuestionCount();
  }, [decryptedParam1]);

  const [attemptCount, setAttemptCount] = useState(null);
  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/attemptCount/${decryptedParam1}/${decryptedParam2}`
        );
        const data = await response.json();
        setAttemptCount(data);
        // console.log(setAttemptCount, data);
      } catch (error) {
        console.error("Error fetching question count:", error);
      }
    };

    fetchQuestionCount();
  }, [decryptedParam1, decryptedParam2]);

  const [correctAnswers, setCorrectAnswersCount] = useState(null);
  useEffect(() => {
    const fetchCorrectAnswers = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/correctAnswers/${decryptedParam1}/${decryptedParam2}`
        );
        const data = await response.json();

        console.log("Correct Answers Data:", data); // Add this line for debugging

        setCorrectAnswersCount(data.total_matching_rows);
      } catch (error) {
        console.error("Error fetching correct answers:", error);
      }
    };

    fetchCorrectAnswers();
  }, [decryptedParam1, decryptedParam2]);

  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(null);
  useEffect(() => {
    const fetchCorrectAnswers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestResultPage/totalcurrectans/${decryptedParam1}/${decryptedParam2}`
        );

        if (response.data && response.data.length > 0) {
          // Assuming the response is an array with one item
          const totalCorrect = response.data[0].Total_correct;
          setTotalCorrectAnswers(totalCorrect);
        } else {
          setTotalCorrectAnswers(null);
        }
      } catch (error) {
        console.error("Error fetching correct answers:", error);
      }
    };

    fetchCorrectAnswers();
  }, [decryptedParam1, decryptedParam2]);

  const [incorrectAnswers, setIncorrectAnswersCount] = useState(null);
  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/incorrectAnswers/${decryptedParam1}/${decryptedParam2}`
        );
        const data = await response.json();
        setIncorrectAnswersCount(data);
        // console.log(setAttemptCount, data);
      } catch (error) {
        console.error("Error fetching question count:", error);
      }
    };

    fetchQuestionCount();
  }, [decryptedParam1, decryptedParam2]);

  const [totalattemptCount, setTotalAttemptCount] = useState(null);
  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestResultPage/totalcurrectans/${decryptedParam1}/${decryptedParam2}`
        );
        if (response.data && response.data.length > 0) {
          // Assuming the response is an array with one item
          const totalAttempt = response.data[0].Total_Attempted;
          setTotalAttemptCount(totalAttempt);
        } else {
          setTotalAttemptCount(null);
        }
      } catch (error) {
        console.error("Error fetching question count:", error);
      }
    };

    fetchQuestionCount();
  }, [decryptedParam1, decryptedParam2]);

  const [totalincorrectAnswers, setTotalIncorrectAnswersCount] = useState(null);
  useEffect(() => {
    const fetchinCorrectAnswers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestResultPage/totalcurrectans/${decryptedParam1}/${decryptedParam2}`
        );

        if (response.data && response.data.length > 0) {
          // Assuming the response is an array with one item
          const totalinCorrect = response.data[0].Total_wrong;
          setTotalIncorrectAnswersCount(totalinCorrect);
        } else {
          setTotalIncorrectAnswersCount(null);
        }
      } catch (error) {
        console.error("Error fetching correct answers:", error);
      }
    };

    fetchinCorrectAnswers();
  }, [decryptedParam1, decryptedParam2]);

  const [score, setScoreCount] = useState({ totalMarks: 0, netMarks: 0 });

  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/getStudentMarks/${decryptedParam1}/${decryptedParam2}`
          // `${BASE_URL}/TestResultPage/score/4/3`
        );
        const data = await response.json();
        setScoreCount(data);
        // console.log("score")
        // console.log(setScoreCount, data);
      } catch (error) {
        console.error("Error fetching question count:", error);
      }
    };

    fetchQuestionCount();
  }, [decryptedParam1, decryptedParam2]);

  console.log(score);
  console.log("hiiiiiiiiiiiii");
  // console.log("subject:", score.subjectName);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/TestResultPage/getEmployeeData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const employeeData = await response.json();
          console.log("Employee Data:", employeeData);
          // Set your state or perform other actions with the employeeData
        } else {
          console.error(
            "Unexpected response from server:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during request:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  // /getTimeLeftSubmissions/:userId/:testCreationTableId

  const [TimeSpent, setTimeSpent] = useState(null);
  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/getTimeLeftSubmissions/${decryptedParam1}/${decryptedParam2}`
          // `${BASE_URL}/TestResultPage/score/${testCreationTableId}/${userData.id}`
          // `${BASE_URL}/TestResultPage/getTimeLeftSubmissions/3/2`
        );
        const data = await response.json();
        setTimeSpent(data);

        // console.log(setAttemptCount, data);
      } catch (error) {
        console.error("Error fetching question count:", error);
      }
    };

    fetchQuestionCount();
  }, [decryptedParam1, decryptedParam2]);

  console.log("hello");
  console.log("hello time", TimeSpent);

  const [userResponse, setUserResponse] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestResultPage/user_answer`
        );
        setUserResponse(response.data);
      } catch (error) {
        console.error("Error fetching user response:", error.message);
      }
    };

    fetchData();
  }, []);

  // Function to group sections by subject ID and combine scores of sections A and B
  const groupSectionsBySubjectId = () => {
    if (!score || !score.subjects) return [];

    const subjectScores = {}; // Object to store aggregated scores for each subject

    score.subjects.forEach((subject) => {
      if (!subjectScores[subject.subjectId]) {
        subjectScores[subject.subjectId] = {
          subjectId: subject.subjectId,
          subjectName: subject.subjectName,
          totalMarks: 0,
          netMarks: 0,
          correctAnswersCount: 0,
          sections: {}, // Object to store scores for each section
        };
      }

      subject.sections.forEach((section) => {
        // Accumulate scores for sections A and B
        subjectScores[subject.subjectId].totalMarks += parseFloat(
          section.scores.totalMarks
        );
        subjectScores[subject.subjectId].netMarks += parseFloat(
          section.scores.netMarks
        );
        subjectScores[subject.subjectId].correctAnswersCount += parseFloat(
          section.scores.correctAnswersCount
        );

        // Store section-wise scores within the subject object
        if (!subjectScores[subject.subjectId].sections[section.sectionName]) {
          subjectScores[subject.subjectId].sections[section.sectionName] = {
            totalMarks: 0,
            netMarks: 0,
          };
        }

        subjectScores[subject.subjectId].sections[
          section.sectionName
        ].totalMarks += parseFloat(section.scores.totalMarks);
        subjectScores[subject.subjectId].sections[
          section.sectionName
        ].netMarks += parseFloat(section.scores.netMarks);
      });
    });

    // Convert subjectScores object into an array of subject scores
    return Object.values(subjectScores);
  };

  // console.log("subject:",score.subjects.subjectName);
  const [testDetails, setTestDetails] = useState([]);
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/testDetails/${decryptedParam1}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch test details");
        }

        const data = await response.json();

        setTestDetails(data.results);
      } catch (error) {
        // setError(error.message);
      }
    };

    if (decryptedParam1) {
      fetchTestDetails();
    }
  }, [decryptedParam1]);

  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(answer.length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return answer.slice(startIndex, endIndex).map((answerData, index) => (
      <tr key={index}>
        <td>Question: {answerData.question_number}</td>
        <td>{answerData.trimmed_user_answer}</td>
        <td>
          <span
            style={{
              color: "white",
              padding: "0.5rem",
              display: "block",
              width: "150px",
              borderRadius: "10px",
              backgroundColor:
                answerData.status === "CORRECT"
                  ? "green"
                  : answerData.status === "INCORRECT"
                  ? "red"
                  : answerData.status === "N/A"
                  ? "gray"
                  : "inherit",
            }}
          >
            {answerData.status ? answerData.status : "N/A"}
          </span>
        </td>
        <td>{answerData.answer_text}</td>
      </tr>
    ));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={i === currentPage ? "active_result_cunt" : null}>
          <p onClick={() => handleClick(i)}>{i}</p>
        </li>
      );
    }
    return pageNumbers;
  };

  const openPopup = () => {
    // Close the current window
    window.close();
  
    // Set student dashboard state in local storage
    const state = {
      studentDashbordconatiner: false,
      studentDashbordmycourse: false,
      studentDashbordbuycurses: false,
      studentDashbordmyresult: true, // Set to true for the desired section
      studentDashborddountsection: false,
      studentDashbordbookmark: false,
      studentDashbordsettings: false,
    };
    localStorage.setItem("student_dashboard_state", JSON.stringify(state));
  
    // Open the desired URL in a new window
    window.open("/student_dashboard");
  };
  

  return (
    <>
      {/* <Header /> */}
      <div className="testResult_-container">
        {/* <div className="testResult_subcontainer"> */}
          {/* <div className=" testresult_left_conatiner"> */}
            {/* <div className="testresult_profile_conatiner_img"> */}
              {/* <img
                title={userData.username}
                src={userData.imageData}
                alt={`Image ${userData.user_Id}`}
                style={{ borderRadius: "50%" }}
              /> */}
            {/* </div> */}
            {/* <div>
              <p>
                {" "}
                <b>Name: </b> {userData.username}
              </p>
              <p>
                <b>Email:</b> {userData.email}
              </p>
              {testDetails && testDetails.length > 0 && (
                <div>
                  <p>
                    <b>Exam Name:</b> {testDetails[0].examName}
                  </p>
                  <p>
                    <b>Course Name:</b> {testDetails[0].courseName}
                  </p>
                  <p>
                    <b> Test Name:</b> {testDetails[0].TestName}
                  </p>
                </div>
              )}
            </div> */}
          {/* </div> */}
          <div className="popup-container">
      <div className="popup-content">
        <h2 className="popup-heading">Your Test has been submitted successfully. <br />
        Your result will be available My Result Tab In student DashBoard.</h2>
        <h3 className="popup-subheading">View your Test Report</h3>
        <button onClick={openPopup} className="popup-button">
          View Report
        </button>
      </div>
    </div>
          <div className="testresult_right_conatiner">
            <div className="submit-page-container">
              {/* <h2 className="submit-page-heading">
                Your Test has been submitted successfully.
              </h2> */}
              {/* <h3 className="submit-page-subheading">View your Test Report</h3> */}
              {/* <button className="submit-page-button"> */}
                {/* <Link to='/test_report' className="submit-page-link">View Report</Link> */}
                {/* <button onClick={openPopup} className="submit-page-button">
                  View Report
                </button> */}
              {/* </button> */}
            </div>
            {/* <div className="testresult_rightsub_conatinerr">
              <h1>SCORE CARD</h1>
              <div className="testResultTable_container_info">
                <table id="testResultTable_container_info_TB_1">
                  <tr>
                    <td>
                      Total Questions: <span></span>
                    </td>
                    <td>Total Attempted</td>
                    <td>Correct Answers</td>
                    <td>Incorrect Answers</td>
                    <td>Score</td>
                    <td>Time Spent</td>
                  </tr>
                  <tr>
                    <td>
                      {questionCount && questionCount.length > 0 ? (
                        <>{questionCount[0].total_question_count}</>
                      ) : (
                        <span>Loading...</span>
                      )}
                    </td>
                    <td>
                      {totalattemptCount !== null ? (
                        <p>{totalattemptCount}</p>
                      ) : (
                        <span>Loading...</span>
                      )}
                    </td>
                    <td>
                      {totalCorrectAnswers !== null ? (
                        <p>{totalCorrectAnswers}</p>
                      ) : (
                        <span>Loading...</span>
                      )}
                    </td>
                    <td>
                      {totalincorrectAnswers !== null ? (
                        <p>{totalincorrectAnswers}</p>
                      ) : (
                        <span>Loading...</span>
                      )}
                    </td>
                    <td>{score.overallNetMarks}</td>
                    <td>
                      {TimeSpent ? (
                        TimeSpent.map((time, index) => {
                          console.log("hiiiiiiiiiii");
                          console.log("Time:", time); // Add this line for debugging
                          return (
                            <div key={index}>
                              <>{time.time_left}</>
                            </div>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6">Loading...</td>
                        </tr>
                      )}
                    </td>
                  </tr>
                </table>

                <div className="testResultTable_with_btn_nav">
                  <table id="testResultTable_container_info_TB_1">
                    <thead>
                      <tr>
                        <th>Question No.</th>
                        <th>Selected Option</th>
                        <th>Status</th>
                        <th>Correct Option</th>
                      </tr>
                    </thead>
                    <tbody>{renderTableData()}</tbody>
                  </table>
                  <ul className="pagination">{renderPageNumbers()}</ul>
                  <div></div>
                </div>
              </div>
            </div> */}
          </div>
        {/* </div> */}
        {/* <h1>Scrore Card</h1> */}

        <br />
        {/* <div className="testResultTable">
          <table id="customers">
            <tr>
              <td>Question No.</td>
              <td>Selected Option</td>
              <td>Status</td>
              <td>Correct Option</td>
            </tr>
            {answer.map((answerData, index) => (
              <tr key={index}>
                <td>Question: {answerData.question_number}</td>
                <td>{answerData.trimmed_user_answer}</td>
                <td>
                  <span
                    style={{
                      color: "white",
                      padding: "0.5rem",
                      display: "block",
                      width: "150px",
                      borderRadius: "10px",
                      backgroundColor:
                        answerData.status === "CORRECT"
                          ? "green"
                          : answerData.status === "INCORRECT"
                          ? "red"
                          : answerData.status === "N/A"
                          ? "gray"
                          : "inherit",
                    }}
                  >
                    {answerData.status ? answerData.status : "N/A"}
                  </span>
                </td>
                <td>{answerData.answer_text}</td>
              </tr>
            ))}
          </table>
        </div> */}
        {/* main working code for subject wise score */}
        {/* <div className="score_cards_div">
          <h3 className="Total_score">Total Score: {score.overallNetMarks}</h3>
          <div className="score_cards">
            {groupSectionsBySubjectId().map((subject) => (
              <div key={subject.subjectId} className="subject_score_card">
                <h4>{subject.subjectName}</h4>
                <p>Total Marks: {subject.netMarks}</p>
                <div>
                  {Object.entries(subject.sections).map(
                    ([sectionName, sectionScores]) => (
                      <div key={sectionName}>
                        <p>{sectionName}</p>
                        <p>Marks: {sectionScores.netMarks}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div> */}
        {/* main working code for subject wise score */}
      </div>
    </>
  );
};

export default TestResultsPage;
export const Header = () => {
  const [testName, setTestName] = useState("");
  const { decryptedParam1 } = useParams();
  useEffect(() => {
    fetchTestName();
  }, [decryptedParam1]); // Re-fetch test name when decryptedParam1 changes

  const fetchTestName = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptions/${decryptedParam1}`
      );
      const data = await response.json();
      const testName = data.questions[0].TestName;
      setTestName(testName);
    } catch (error) {
      console.error("Error fetching test name:", error);
    }
  };

  // useEffect(() => {

  //   const fetchTestDetails = async () => {

  //     try {

  //       const response = await fetch(`/testDetails/${testCreationTableId}`);

  //       if (!response.ok) {

  //         throw new Error("Failed to fetch test details");

  //       }

  //       const data = await response.json();

  //       setTestDetails(data.results);

  //     } catch (error) {

  //       setError(error.message);

  //     }

  //   };

  //   if (testCreationTableId) {

  //     fetchTestDetails();

  //   }

  // }, [testCreationTableId]);

  return (
    <>
      {Navbar.map((nav, index) => {
        return (
          <div className="Quiz_header" key={index}>
            <div className="Q_logo">
              <img src={nav.Q_logo} alt="" />
            </div>
            <div className="Q_title">
              {/* <h1>{nav.Q_page_title}</h1> */}
              <h1
                className="testname_heading"
                key={testName.testCreationTableId}
              >
                {testName}
              </h1>
            </div>
          </div>
        );
      })}
    </>
  );
};
