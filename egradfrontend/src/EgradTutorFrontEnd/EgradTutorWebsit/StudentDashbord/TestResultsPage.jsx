import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import "./Style/TestResultPage.css";
import BASE_URL from "../../../apiConfig";
import axios from "axios";
import { Navbar } from "./Data/Introduction_Page_Data";
import { decryptData, encryptData } from "./utils/crypto";
import { useLocation } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const TestResultsPage = () => {
console.log("11111111111111111111111111111111111111")
  const location = useLocation();
  const { userData } = location.state || {}; 



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


  console.log(decryptedParam1)
  // const { testCreationTableId, user_Id, userId } = useParams();
  const [testName, setTestName] = useState("");

  // const [userData, setUserData] = useState({});
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

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await fetch(
  //         `${BASE_URL}/ughomepage_banner_login/user`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Attach token to headers for authentication
  //           },
  //         }
  //       );

  //       if (response.ok) {
  //         const userData = await response.json();
  //         setUserData(userData);
  //         // console.log(userData);
  //       } else {
  //         // Handle errors, e.g., if user data fetch fails
  //       }
  //     } catch (error) {
  //       // Handle other errors
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const [answer, setAnswer] = useState([]);

  console.log("helloooooo shizukaaaaaaaaa");
  console.log("decryptedParam1", decryptedParam1);
  console.log("decryptedParam2", decryptedParam2);


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

    // const fetchUserData = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await fetch(
    //       `${BASE_URL}/ughomepage_banner_login/user`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );

    //     if (response.ok) {
    //       const userData = await response.json();
    //       setUserData(userData);
    //     } else {
    //       // Handle errors, e.g., if user data fetch fails
    //     }
    //   } catch (error) {
    //     // Handle other errors
    //   }
    // };

    fetchAnswer();
    // fetchUserData();
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




  const [encodedUserId, setEncodedUserId] = useState('');

const encryptUserId = (decryptedParam2) => {
  const secretKey = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
  return CryptoJS.AES.encrypt(decryptedParam2.toString(), secretKey).toString();
};

useEffect(() => {
  if (decryptedParam2) {
    const encryptedUserId = encryptUserId(decryptedParam2);
    const encodedUserId = encodeURIComponent(encryptedUserId);
    setEncodedUserId(encodedUserId);
  }
}, [decryptedParam2]);

  const openPopup = () => {
    window.close();
    if (decryptedParam2) {
      const encryptedUserId = encryptUserId(decryptedParam2);
      const encodedUserId = encodeURIComponent(encryptedUserId);
      navigate(`/Student_dashboard/${encodedUserId}`);
    }
  };


  // const openPopup = () => {
  //   // Close the current window
  //   window.close();

  //   // // Set student dashboard state in local storage
  //   // const state = {
  //   //   studentDashbordconatiner: false,
  //   //   studentDashbordmycourse: false,
  //   //   studentDashbordbuycurses: false,
  //   //   studentDashbordmyresult: true, // Set to true for the desired section
  //   //   studentDashborddountsection: false,
  //   //   studentDashbordbookmark: false,
  //   //   studentDashbordsettings: false,
  //   // };
  //   // localStorage.setItem("student_dashboard_state", JSON.stringify(state));

  //   // Open the desired URL in a new window
  //   // window.open("/Student_dashboard");
  //   // navigate('/StudentDashbord_MyResults')
  //   navigate(`/Student_dashboard/${userIdLink}`)
  // };


  return (
    <>
        {/* <h1>hellooooo</h1>
          {userData.users && userData.users.length > 0 && (
            <ul>
              {userData.users.map((user) => (
                <div className="greeting_section">
                  <h2 className="dashboard_greeting_container">
                    {user.username}
                  </h2>
                </div>
              ))}
            </ul>
          )} */}
      <div className="testResult_-container">
        <div className="viewReport_popup_container">
          <div className="viewReport_popup_content">
            <h2 className="viewReport_popup_heading">
              Your Test has been submitted successfully. <br />
              Your result will be available My Result Tab In student DashBoard.
            </h2>
            <h3 className="viewReport_popup_subheading">View your Test Report</h3>
            <button onClick={openPopup} title="Click here to view report" className="viewReport_popup_button">
              View Report
            </button>
          </div>
        </div>

        <br />
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
