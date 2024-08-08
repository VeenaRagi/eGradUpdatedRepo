// import React, { useEffect, useState, useCallback } from "react";
// import PropTypes from "prop-types";
// import { useNavigate, useParams } from "react-router-dom";

// // import axios from "axios";
// import BASE_URL from "../../../../apiConfig";
// import { decryptData, encryptData } from "../utils/crypto";
// import PGQuestionPaper from "./PGQuestionPaper";
// const PGButtonsFunctionality = ({
//   activeQuestion,
//   onQuestionSelect,
//   questionStatus,
//   seconds,
//   setQuestionStatus,
//   answeredCount,
//   notAnsweredCount,
//   answeredmarkedForReviewCount,
//   markedForReviewCount,
//   VisitedCount,
//   questionOptions,
//   updateQuestionStatus,
//   onUpdateOption,
//   option,
//   users,
//   // userData,
// }) => {
//   const navigate = useNavigate();
//   const { param1, param2,Branch_Id } = useParams();

//   const [decryptedParam1, setDecryptedParam1] = useState("");
//   const [decryptedParam2, setDecryptedParam2] = useState("");

//   useEffect(() => {
//     const token = sessionStorage.getItem("navigationToken");

//     // If token doesn't exist, navigate to the error page
//     if (!token) {
//       navigate("/Error");
//       return;
//     }

//     const decryptParams = async () => {
//       try {
//         // Decrypt parameters
//         const decrypted1 = await decryptData(param1);
//         const decrypted2 = await decryptData(param2);

//         // Example validation (you can modify this based on your actual requirements)
//         if (
//           !decrypted1 ||
//           !decrypted2 ||
//           isNaN(parseInt(decrypted1)) ||
//           isNaN(parseInt(decrypted2))
//         ) {
//           // If parameters are not valid, navigate to the error page or handle as needed
//           navigate("/Error");
//           return;
//         }

//         setDecryptedParam1(decrypted1);
//         setDecryptedParam2(decrypted2);
//       } catch (error) {
//         console.error("Error decrypting data:", error);
//         navigate("/Error");
//       }
//     };

//     decryptParams();
//   }, [param1, param2, navigate]);

//   const [wtimer, setWTimer] = useState(0); // State to manage timer


//   // Extract questions from the nested structure
//   const questions = (questionOptions && questionOptions.subjects)
//   ? questionOptions.subjects.flatMap(subject =>
//       subject.sections.flatMap(section =>
//         section.questions
//       )
//     )
//   : [];

//   const remainingQuestions =
//     questions -
//     VisitedCount -
//     notAnsweredCount -
//     answeredCount -
//     markedForReviewCount -
//     answeredmarkedForReviewCount;
//   const NotVisited = remainingQuestions < 0 ? 0 : remainingQuestions;

//   useEffect(() => {
//     console.log("hiiiiiiiiiiiiiiiiiiiiiiiii");
//     console.log("Current active question number:", activeQuestion);
//   }, [activeQuestion]);
//   const [answeredQuestions, setAnsweredQuestions] = useState([]);
//   const [isPaused, setIsPaused] = useState(false);
//   const [testName, setTestName] = useState("");
 
//   const renderQuestionButtons = Array.isArray(questions)
//   ? questions.map((question, index) => {
//       let className = "right_bar_Buttons ";
//       const questionKey = question.question_id || index;
//       let questionStatusAtIndex;
      
//       // Set the status of the first button to "notAnswered" by default
//       if (index === 0 && !questionStatus[index]) {
//         questionStatusAtIndex = "notAnswered";
//       } else {
//         questionStatusAtIndex = questionStatus[index];
//       }

//       if (questionStatusAtIndex === "answered") {
//         className += " instruction-btn1";
//       } else if (questionStatusAtIndex === "notAnswered") {
//         className += " instruction-btn2";
//       } else if (questionStatusAtIndex === "marked") {
//         className += " instruction-btn3";
//       } else if (questionStatusAtIndex === "Answered but marked for review") {
//         className += " instruction-btn4";
//       } else if (questionStatusAtIndex === "notVisited") {
//         className += " instruction-btn5";
//       }

//       // Highlight the current question being displayed
//       if (index === activeQuestion) {
//         className += " active-question";
//       }
      
//       // Different tooltip text for each button
//       let tooltipText = "";
//       if (questionStatusAtIndex === "answered") {
//         tooltipText = "Answered";
//       } else if (questionStatusAtIndex === "notAnswered") {
//         tooltipText = "Not Answered";
//       } else if (questionStatusAtIndex === "marked") {
//         tooltipText = "Marked for review";
//       } else if (questionStatusAtIndex === "Answered but marked for review") {
//         tooltipText = "Answered but marked for review";
//       } else if (questionStatusAtIndex === "notVisited") {
//         tooltipText = "Not Visited";
//       }

//       return (
//         <li key={questionKey}>
//           <button
//             onClick={() => handleButtonClick(index + 1)}
//             className={className}
//             title={tooltipText}
//           >
//             {index + 1}
//           </button>
//         </li>
//       );
//     })
//   : null;



//   const [ setQuestionOptions] = useState({ questions: [] });
//   useEffect(() => {
//     // Check if testCreationTableId is defined before making the request
//     if (decryptedParam1) {
//       fetchData();
//     }
//   }, [decryptedParam1]);

//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/QuizPage/PG_QuestionOptions/${decryptedParam1}/${decryptedParam2}/${Branch_Id}`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//        setQuestionOptions(data);;
//     } catch (error) {
//       console.error("Error fetching question data:", error);
//     }
//   };
//   useEffect(() => {
//     fetchTestName();
//   }, [decryptedParam1]); // Re-fetch test name when testCreationTableId changes

//   const fetchTestName = async () => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/QuizPage/PG_QuestionOptions/${decryptedParam1}/${decryptedParam2}/${Branch_Id}`
//       );
//       const data = await response.json();
//       const testName = data.questions[0].TestName;
//       setTestName(testName);
//     } catch (error) {
//       console.error("Error fetching test name:", error);
//     }
//   };
//  const [selectedSubject, setSelectedSubject] = useState(null); 
//   const [selectedSection, setSelectedSection] = useState(null);
//   const handleButtonClick = useCallback(
//     async (questionNumber) => {
//       const questionIndex = questionNumber - 1;

//       try {
//         const response = await fetch(
//           `${BASE_URL}/QuizPage/PG_QuestionOptions/${decryptedParam1}/${decryptedParam2}`
//         );
//         const data = await response.json();

//         // Log the data for the clicked question
//         console.log("Clicked question data:", data.questions[questionIndex]);

//         const testName = data.questions[0].TestName;
//         setTestName(testName);
//         fetchData();

//         // Update question status based on its current status
//         const currentStatus = questionStatus[questionIndex];
//         console.log("Current status:", currentStatus);

//         if (
//           currentStatus !== "marked" &&
//           currentStatus !== "answered" &&
//           currentStatus !== "Answered but marked for review"
//         ) {
//           // Update status to "notAnswered" if not already answered, marked for review, or answered but marked for review
//           console.log('Updating question status to "notAnswered".');
//           const updatedQuestionStatus = [...questionStatus];
//           updatedQuestionStatus[questionIndex] = "notAnswered";
//           setQuestionStatus(updatedQuestionStatus);
//         } else {
//           console.log(
//             "Question already has a specified status. No action taken."
//           );
//         }

//         onQuestionSelect(questionNumber);

//         // Update other necessary state or perform additional logic
//         setAnsweredQuestions((prevAnsweredQuestions) => [
//           ...prevAnsweredQuestions,
//           questionNumber,
//         ]);
//         setIsPaused(false);

//         // Optionally, you may update the option state in the parent component here
//         onUpdateOption(null); // Assuming null means no option is selected

//         // Log the active question number
//         console.log("Active question number:", questionNumber);
//       } catch (error) {
//         console.error("Error fetching test name:", error);
//       }
//     },
//     [
//       questionStatus,
//       setQuestionStatus,
//       onQuestionSelect,
//       answeredQuestions,
//       onUpdateOption,
//       decryptedParam1,
//       decryptedParam2,
//     ]
//   );

//   // Proptypes for button functionality component
//   PGButtonsFunctionality.propTypes = {
//     onQuestionSelect: PropTypes.func.isRequired,
//     questionStatus: PropTypes.arrayOf(PropTypes.string),
//     seconds: PropTypes.number, // Add the appropriate prop type
//     setQuestionStatus: PropTypes.func.isRequired,
//     answeredCount: PropTypes.number, // Add the appropriate prop type
//     notAnsweredCount: PropTypes.number, // Add the appropriate prop type
//     answeredmarkedForReviewCount: PropTypes.number, // Add the appropriate prop type
//     markedForReviewCount: PropTypes.number, // Add the appropriate prop type
//     VisitedCount: PropTypes.number, // Add the appropriate prop type
//     selectedSubject: PropTypes.string, // Add the appropriate prop type
//     updateButtonStatus: PropTypes.func, // Add the appropriate prop type
//     data: PropTypes.object, // Add the appropriate prop type
//     updateQuestionStatus: PropTypes.func.isRequired, // Add the prop type
//     option: PropTypes.func.isRequired,
//   };

//   // Format time into hours, minutes, seconds
//   const WformatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const remainingSeconds = seconds % 60;
//     return `${hours > 9 ? hours : "0" + hours}:${
//       minutes > 9 ? minutes : "0" + minutes
//     }:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`;
//   };

//   // useEffect to manage timer
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setWTimer((prevTimer) => prevTimer - 1);
//     }, 1000);

//     // Clear the interval and handle time-up logic when timer reaches 0
//     if (wtimer <= 0) {
//       clearInterval(interval);
//       // Handle time-up logic here (e.g., navigate to a different component)
//     }

//     // Clean up the interval on component unmount or when navigating away
//     return () => {
//       clearInterval(interval);
//     };
//   }, [wtimer]);


//   console.log("helloooooooooooooooooooHELLOOOOOOOOOOOOO");
//   console.log(decryptedParam2);

//   const [showPopup, setShowPopup] = useState(false);
//   const openQuestionPaper = () => {
//     setShowPopup(true);
//   };

//   const closeQuestionPaper = () => {
//     setShowPopup(false);
//   };

//   if (!users || !Array.isArray(users)) {
//     return <div>Error: Users data is not available</div>;
//   }


//   return (
//     <>
//       <div>
//         <div>
//           <div>
//             <div>
//               {" "}
//               <button title="VisitedCount">{NotVisited}</button>
//               <span>Not Visited</span>
//             </div>
//             <div>
//               <p title="answeredCount">{answeredCount}</p>
//               <span>Answered</span>
//             </div>
//             <div>
//               <p title="notAnsweredCount">{notAnsweredCount}</p>
//               <span>Not Answered</span>
//             </div>
//             <div>
//               <p title="answeredmarkedForReviewCount">
//                 {answeredmarkedForReviewCount}
//               </p>
//               <span>Marked for Review</span>
//             </div>
//             <div>
//               <p title="markedForReviewCount">{markedForReviewCount}</p>
//               <span>
//                 Answered & Marked for Review (will be considered for evaluation)
//               </span>
//             </div>{" "}
//           </div>
//         </div>
//         <div>
//           {/* {uniqueSections.map((sectionName, index) => (
//             <p key={index}>{sectionName}</p>
//           ))} */}
//         </div>
//         <div>
//           <div>
//             <ul>{renderQuestionButtons}</ul>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PGButtonsFunctionality;



import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

import BASE_URL from "../../../../apiConfig";
import { decryptData } from "../utils/crypto";

const PGButtonsFunctionality = ({
  activeQuestion,
  onQuestionSelect,
  questionStatus,
  seconds,
  setQuestionStatus,
  answeredCount,
  notAnsweredCount,
  answeredmarkedForReviewCount,
  markedForReviewCount,
  VisitedCount,
  questionOptions,
  updateQuestionStatus,
  onUpdateOption,
  option,
  users,
  selectedSubject,
  selectedSection,
  
}) => {
  const navigate = useNavigate();
  const { param1, param2, Branch_Id } = useParams();

  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");
  const [questions, setQuestions] = useState([]);
  const [wtimer, setWTimer] = useState(0); // State to manage timer
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [testName, setTestName] = useState("");
  // const [selectedSubject, setSelectedSubject] = useState(null);
  // const [selectedSection, setSelectedSection] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
console.log("selectedSection from buttons", selectedSection);
console.log("selectedSection from buttons", selectedSection);
  useEffect(() => {
    const token = sessionStorage.getItem("navigationToken");

    if (!token) {
      navigate("/Error");
      return;
    }

    const decryptParams = async () => {
      try {
        const decrypted1 = await decryptData(param1);
        const decrypted2 = await decryptData(param2);

        if (
          !decrypted1 ||
          !decrypted2 ||
          isNaN(parseInt(decrypted1)) ||
          isNaN(parseInt(decrypted2))
        ) {
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

  useEffect(() => {
    if (questionOptions && questionOptions.subjects) {
      const allQuestions = questionOptions.subjects.flatMap((subject) =>
        subject.sections.flatMap((section) => section.questions)
      );
      setQuestions(allQuestions);
    }
  }, [questionOptions]);

  const remainingQuestions =
    questions.length -
    VisitedCount -
    notAnsweredCount -
    answeredCount -
    markedForReviewCount -
    answeredmarkedForReviewCount;
  const NotVisited = remainingQuestions < 0 ? 0 : remainingQuestions;

  useEffect(() => {
    console.log("Current active question number:", activeQuestion);
  }, [activeQuestion]);

  useEffect(() => {
    if (decryptedParam1) {
      fetchData();
    }
  }, [decryptedParam1]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/PG_QuestionOptions/${decryptedParam1}/${decryptedParam2}/${Branch_Id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };

  useEffect(() => {
    fetchTestName();
  }, [decryptedParam1]);

  const fetchTestName = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/PG_QuestionOptions/${decryptedParam1}/${decryptedParam2}/${Branch_Id}`
      );
      const data = await response.json();
      const testName = data.questions[0].TestName;
      setTestName(testName);
    } catch (error) {
      console.error("Error fetching test name:", error);
    }
  };

  const handleButtonClick = useCallback(
    async (questionNumber) => {
      const questionIndex = questionNumber - 1;

      try {
        const response = await fetch(
          `${BASE_URL}/QuizPage/PG_QuestionOptions/${decryptedParam1}/${decryptedParam2}`
        );
        const data = await response.json();

        console.log("Clicked question data:", data.questions[questionIndex]);

        const testName = data.questions[0].TestName;
        setTestName(testName);
        fetchData();

        const currentStatus = questionStatus[questionIndex];
        console.log("Current status:", currentStatus);

        if (
          currentStatus !== "marked" &&
          currentStatus !== "answered" &&
          currentStatus !== "Answered but marked for review"
        ) {
          console.log('Updating question status to "notAnswered".');
          const updatedQuestionStatus = [...questionStatus];
          updatedQuestionStatus[questionIndex] = "notAnswered";
          setQuestionStatus(updatedQuestionStatus);
        } else {
          console.log(
            "Question already has a specified status. No action taken."
          );
        }

        onQuestionSelect(questionNumber);

        setAnsweredQuestions((prevAnsweredQuestions) => [
          ...prevAnsweredQuestions,
          questionNumber,
        ]);
        setIsPaused(false);

        onUpdateOption(null);

        console.log("Active question number:", questionNumber);
      } catch (error) {
        console.error("Error fetching test name:", error);
      }
    },
    [
      questionStatus,
      setQuestionStatus,
      onQuestionSelect,
      answeredQuestions,
      onUpdateOption,
      decryptedParam1,
      decryptedParam2,
    ]
  );
  const renderQuestionButtons = () => {
    const questions = (questionOptions && questionOptions.subjects)
      ? questionOptions.subjects.flatMap(subject =>
          subject.sections.flatMap(section =>
            section.questions
          )
        )
      : [];

    // Filter questions based on selected subject and section
    const filteredQuestions = questions
      .filter(question =>
        (selectedSubject ? question.subject_id === selectedSubject : true) &&
        (selectedSection ? question.section_id === selectedSection : true)
      );

    return Array.isArray(filteredQuestions)
      ? filteredQuestions.map((question, index) => {
          let className = "right_bar_Buttons ";
          const questionKey = question.question_id || index;
          let questionStatusAtIndex = questionStatus[index] || "notAnswered";

          if (questionStatusAtIndex === "answered") {
            className += " instruction-btn1";
          } else if (questionStatusAtIndex === "notAnswered") {
            className += " instruction-btn2";
          } else if (questionStatusAtIndex === "marked") {
            className += " instruction-btn3";
          } else if (questionStatusAtIndex === "Answered but marked for review") {
            className += " instruction-btn4";
          } else if (questionStatusAtIndex === "notVisited") {
            className += " instruction-btn5";
          }

          if (index === activeQuestion) {
            className += " active-question";
          }

          let tooltipText = "";
          if (questionStatusAtIndex === "answered") {
            tooltipText = "Answered";
          } else if (questionStatusAtIndex === "notAnswered") {
            tooltipText = "Not Answered";
          } else if (questionStatusAtIndex === "marked") {
            tooltipText = "Marked for review";
          } else if (questionStatusAtIndex === "Answered but marked for review") {
            tooltipText = "Answered but marked for review";
          } else if (questionStatusAtIndex === "notVisited") {
            tooltipText = "Not Visited";
          }

          return (
            <li key={questionKey}>
              <button
                onClick={() => handleButtonClick(index + 1)}
                className={className}
                title={tooltipText}
              >
                {index + 1}
              </button>
            </li>
          );
        })
      : null;
  };

  const WformatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 9 ? hours : "0" + hours}:${
      minutes > 9 ? minutes : "0" + minutes
    }:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`;
  };

  const openQuestionPaper = () => {
    setShowPopup(true);
  };

  const closeQuestionPaper = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="quizPage_container">
        <div className="quizPage_header">
          <div className="test-name">{testName}</div>
          <div className="status-bar">
            <div>
              <p title="AnsweredCount">{answeredCount}</p>
              <span>Answered</span>
            </div>
            <div>
              <p title="NotAnsweredCount">{notAnsweredCount}</p>
              <span>Not Answered</span>
            </div>
            <div>
              <p title="NotVisited">{NotVisited}</p>
              <span>Not Answered</span>
            </div>
            <div>
              <p title="markedForReviewCount">{markedForReviewCount}</p>
              <span>Marked for review</span>
            </div>
            <div>
              <p title="answeredmarkedForReviewCount">
                {answeredmarkedForReviewCount}
              </p>
              <span>Answered but marked for review</span>
            </div>
            <div>
              <button onClick={openQuestionPaper}>Question Paper</button>
            </div>
            <div>
              <button title="RemainingTime">
                {WformatTime(seconds)} Remaining
              </button>
            </div>
          </div>
          <div>
            <ul>{renderQuestionButtons()}</ul>
          </div>
        </div>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <button onClick={closeQuestionPaper}>Close</button>
              <h2>Question Paper</h2>
              <pre>{JSON.stringify(questions, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

PGButtonsFunctionality.propTypes = {
  activeQuestion: PropTypes.number.isRequired,
  onQuestionSelect: PropTypes.func.isRequired,
  questionStatus: PropTypes.arrayOf(PropTypes.string).isRequired,
  seconds: PropTypes.number.isRequired,
  setQuestionStatus: PropTypes.func.isRequired,
  answeredCount: PropTypes.number.isRequired,
  notAnsweredCount: PropTypes.number.isRequired,
  answeredmarkedForReviewCount: PropTypes.number.isRequired,
  markedForReviewCount: PropTypes.number.isRequired,
  VisitedCount: PropTypes.number.isRequired,
  questionOptions: PropTypes.object.isRequired,
  updateQuestionStatus: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  option: PropTypes.any,
  users: PropTypes.array.isRequired,
};

export default PGButtonsFunctionality;

