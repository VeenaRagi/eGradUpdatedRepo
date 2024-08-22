// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import "./UG_OTSQuizPage.css";
// import BASE_URL from "../../../../apiConfig";
// import { decryptData, encryptData } from "../utils/crypto";
// import { BiMenuAltLeft } from "react-icons/bi";
// import { MdOutlineTimer } from "react-icons/md";
// import "../Style/Watermark.css";

// const UG_OTSQuizPage = () => {
//   const [testData, setTestData] = useState(null);
//   const [selectedSubjectId, setSelectedSubjectId] = useState(null);
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [selectedQuestionId, setSelectedQuestionId] = useState(null);
//   const [radioResponses, setRadioResponses] = useState({});
//   const [checkboxResponses, setCheckboxResponses] = useState({});
//   const [textResponses, setTextResponses] = useState({});
//   const [visitedQuestions, setVisitedQuestions] = useState([]);
//   const [answeredQuestions, setAnsweredQuestions] = useState([]);
//   const [notAnsweredQuestions, setNotAnsweredQuestions] = useState([]);
//   const [isSidebarVisible, setSidebarVisible] = useState(false);
//   const [markedForReviewQuestions, setMarkedForReviewQuestions] = useState([]);
//   const [answeredSaved, setAnsweredSaved] = useState([]);
//   const [activeQuestionId, setActiveQuestionId] = useState(null);
//   const [showExamSumary, setShowExamSumary] = useState(false);
//   const location = useLocation();
//   const { userData } = location.state || {};
//   const [testName, setTestName] = useState("");
//   const navigate = useNavigate();
//   const { param1, param2 } = useParams();
//   const [decryptedParam1, setDecryptedParam1] = useState("");
//   const [decryptedParam2, setDecryptedParam2] = useState("");
//   const [image, setImage] = useState(null);
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [error, setError] = useState(null);
//   const [countDown, setCountDown] = useState(180 * 60);
//   const timerId = useRef();
//   const [showButtonNo, setShowButtonNo] = useState(false);
//   const [questionButtonClass, setQuestionButtonClass] = useState({});
//   const [showMalPractisePopup, setShowMalPractisePopup] = useState(false);

//   useEffect(() => {
//     timerId.current = setInterval(() => {
//       setCountDown((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timerId.current);
//   }, []);

//   const quizRef = useRef(null);

//   const enterFullscreen = () => {
//     const element = quizRef.current;
//     if (element.requestFullscreen) {
//       element.requestFullscreen();
//     } else if (element.mozRequestFullScreen) {
//       element.mozRequestFullScreen();
//     } else if (element.webkitRequestFullscreen) {
//       element.webkitRequestFullscreen();
//     } else if (element.msRequestFullscreen) {
//       element.msRequestFullscreen();
//     }
//   };

//   const handleVisibilityChange = () => {
//     if (document.hidden) {
//       console.log("Page is now hidden");
//       setShowMalPractisePopup(true);
//     } else {
//       console.log("Page is now visible");
//     }
//   };

//   const handleBlur = () => {
//     console.log("Window is not focused");
//     setShowMalPractisePopup(true);
//   };

//   const handleFocus = () => {
//     console.log("Window is focused");
//   };

//   useEffect(() => {
//     if ("hidden" in document) {
//       document.addEventListener("visibilitychange", handleVisibilityChange);
//     } else {
//       console.log("Page Visibility API is not supported");
//     }

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   const handleBeforeUnload = (event) => {
//     const confirmationMessage = "Are you sure you want to leave this page?";
//     event.returnValue = confirmationMessage; // For most browsers
//     setShowMalPractisePopup(true);
//     // setAttemptedToClose(true);
//     return confirmationMessage; // For some older browsers
//   };
//   const [isShiftPressed, setIsShiftPressed] = useState(false);
//   const [isMetaPressed, setIsMetaPressed] = useState(false);

//   const handleKeyDown = (event) => {
//     if (event.key === "Shift") {
//       event.preventDefault();
//       setIsShiftPressed(true);
//     }
//     if (event.key === "Meta" || event.key === "Win") {
//       event.preventDefault();
//       setIsMetaPressed(true);
//     }
//     if (event.key === "s" && isShiftPressed && isMetaPressed) {
//       event.preventDefault();
//       window.history.back();
//       window.close();
//     }

//     if (isShiftPressed && isMetaPressed) {
//       event.preventDefault();
//       setShowMalPractisePopup(true);
//     }
//   };

//   const handleKeyUp = (event) => {
//     if (event.key === "Shift") {
//       event.preventDefault();
//       setIsShiftPressed(false);
//     }
//     if (event.key === "Meta" || event.key === "Win") {
//       event.preventDefault();
//       setIsMetaPressed(false);
//     }
//   };

//   useEffect(() => {
//     if ("hidden" in document) {
//       document.addEventListener("visibilitychange", handleVisibilityChange);

//       window.addEventListener("focus", handleFocus);
//       window.addEventListener("blur", handleBlur);

//       document.addEventListener("keydown", handleKeyDown);
//       document.addEventListener("keyup", handleKeyUp);
//     } else {
//       console.log("Page Visibility API is not supported");
//     }

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);

//       window.removeEventListener("focus", handleFocus);
//       window.removeEventListener("blur", handleBlur);

//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [isShiftPressed, isMetaPressed]);

//   useEffect(() => {
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   });

//   // Convert seconds to hours, minutes, and seconds
//   const hours = Math.floor(countDown / 3600);
//   const minutes = Math.floor((countDown % 3600) / 60);
//   const seconds = countDown % 60;
//   const fetchImage = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/Logo/image`, {
//         responseType: "arraybuffer",
//       });
//       const imageBlob = new Blob([response.data], { type: "image/png" });
//       const imageUrl = URL.createObjectURL(imageBlob);
//       setImage(imageUrl);
//     } catch (error) {
//       console.error("Error fetching image:", error);
//     }
//   };
//   useEffect(() => {
//     fetchImage();
//   }, []);
//   useEffect(() => {
//     const token = sessionStorage.getItem("navigationToken");

//     if (!token) {
//       navigate("/Error");
//       return;
//     }

//     const decryptParams = async () => {
//       try {
//         const decrypted1 = await decryptData(param1);
//         const decrypted2 = await decryptData(param2);

//         if (
//           !decrypted1 ||
//           !decrypted2 ||
//           isNaN(parseInt(decrypted1)) ||
//           isNaN(parseInt(decrypted2))
//         ) {
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

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/QuizPage/UG_QuestionOptions/${decryptedParam1}/${decryptedParam2}`
//         );
//         const data = response.data;
//         // Set the test name
//         if (data && data.length > 0) {
//           setTestName(data[0].TestName);
//         }

//         if (data.subjects.length > 0) {
//           setSelectedSubjectId(data.subjects[0].subjectId);
//           if (data.subjects[0].sections.length > 0) {
//             setSelectedSectionId(data.subjects[0].sections[0].sectionId);
//             setSelectedQuestionId(
//               data.subjects[0].sections[0].questions[0].question_id
//             );
//           } else {
//             setSelectedQuestionId(data.subjects[0].questions[0].question_id);
//           }
//         }

//         setTestData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [decryptedParam1, decryptedParam2]);

//   useEffect(() => {
//     if (decryptedParam2) {
//       const fetchStudentDetails = async () => {
//         try {
//           const response = await axios.get(
//             `${BASE_URL}/StudentSettings/fetchStudentDetailstest/${decryptedParam2}`
//           );
//           setStudentDetails(response.data);
//         } catch (err) {
//           setError("Error fetching student details");
//           console.error(err);
//         }
//       };
//       fetchStudentDetails();
//     }
//   }, [decryptedParam2]);
//   const handleSubjectClick = (subjectId) => {
//     setSelectedSubjectId(subjectId);
//     const selectedSubject = testData.subjects.find(
//       (subject) => subject.subjectId === subjectId
//     );
//     if (selectedSubject.sections.length > 0) {
//       setSelectedSectionId(selectedSubject.sections[0].sectionId);
//       setSelectedQuestionId(
//         selectedSubject.sections[0].questions[0].question_id
//       );
//     } else {
//       setSelectedSectionId(null);
//       setSelectedQuestionId(selectedSubject.questions[0].question_id);
//     }
//   };

//   const handleSectionClick = (sectionId) => {
//     setSelectedSectionId(sectionId);
//     const selectedSection = testData.subjects
//       .find((subject) => subject.subjectId === selectedSubjectId)
//       .sections.find((section) => section.sectionId === sectionId);
//     setSelectedQuestionId(selectedSection.questions[0].question_id);
//   };

//   const handleQuestionClick = (questionId) => {
//     // Set the active and selected question IDs
//     setActiveQuestionId(questionId);
//     setSelectedQuestionId(questionId);

//     // Mark the question as visited
//     if (!visitedQuestions.includes(questionId)) {
//       setVisitedQuestions([...visitedQuestions, questionId]);
//     }

//     // Ensure the question shows as not answered
//     if (!answeredQuestions.includes(questionId)) {
//       setNotAnsweredQuestions((prev) => [...prev, questionId]);
//     }

//     const isAnswered = answeredQuestions.includes(questionId);
//     const isMarkedForReview = markedForReviewQuestions.includes(questionId);

//     setQuestionButtonClass((prevClasses) => ({
//       ...prevClasses,
//       [questionId]: isAnswered
//         ? isMarkedForReview
//           ? "purpleBox" // Answered and marked for review
//           : "answered" // Answered but not marked for review
//         : isMarkedForReview
//         ? "blueBox" // Not answered but marked for review
//         : "notAnswered", // Not answered and not marked for review
//     }));

//     setVisitedQuestions((prev) => {
//       if (!prev.includes(questionId)) {
//         return [...prev, questionId];
//       }
//       return prev;
//     });
//   };

//   const handleRadioChange = (questionId, optionId, optionIndex) => {
//     setRadioResponses((prevResponses) => ({
//       ...prevResponses,
//       [questionId]: { optionId, optionIndex },
//     }));
//   };

//   const handleCheckboxChange = (
//     questionId,
//     optionId,
//     isChecked,
//     optionIndex
//   ) => {
//     setCheckboxResponses((prevResponses) => {
//       const currentOptions = prevResponses[questionId] || [];
//       const updatedOptions = isChecked
//         ? [...currentOptions, { optionId, optionIndex }]
//         : currentOptions.filter((option) => option.optionId !== optionId);

//       return {
//         ...prevResponses,
//         [questionId]: updatedOptions,
//       };
//     });
//   };

//   const handleKeypadClick = (key) => {
//     setTextResponses((prevResponses) => {
//       const currentInput = prevResponses[selectedQuestion.question_id] || "";

//       if (key === "DEL") {
//         // Remove the last character from the current input value
//         return {
//           ...prevResponses,
//           [selectedQuestion.question_id]: currentInput.slice(0, -1),
//         };
//       } else {
//         // Add the clicked key to the current input value
//         return {
//           ...prevResponses,
//           [selectedQuestion.question_id]: currentInput + key,
//         };
//       }
//     });
//   };

//   const handleTextChange = (questionId, value) => {
//     setTextResponses({
//       ...textResponses,
//       [questionId]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       setShowExamSumary(true);
//       // setShowButtonNo(true);
//       // calculateResult();

//       // const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
//       // const counts = calculateQuestionCounts();
//       // setAnsweredCount(counts.answered);
//       // setNotAnsweredCount(counts.notAnswered);
//       // setMarkedForReviewCount(counts.markedForReview);
//       // setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
//       // setVisitedCount(counts.VisitedCount);

//       // const currentQuestion = questionData.questions[currentQuestionIndex];
//       // const questionId = currentQuestion.question_id;

//       // const formattedTime = WformatTime(wtimer);

//       // // Save exam summary
//       // const saveExamSummaryResponse = await fetch(
//       //   `${BASE_URL}/QuizPage/saveExamSummary`,
//       //   {
//       //     method: "POST",
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //     },
//       //     body: JSON.stringify({
//       //       userId: decryptedParam2,
//       //       totalUnattempted: notAnsweredCount,
//       //       totalAnswered: answeredCount,
//       //       NotVisitedb: NotVisitedb,
//       //       testCreationTableId: decryptedParam1,
//       //     }),
//       //   }
//       // );

//       // const saveExamSummaryResult = await saveExamSummaryResponse.json();
//       // console.log("Exam summary saved:", saveExamSummaryResult);

//       // // Submit time left
//       // const submitTimeLeftResponse = await fetch(
//       //   `${BASE_URL}/QuizPage/submitTimeLeft`,
//       //   {
//       //     method: "POST",
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //     },
//       //     body: JSON.stringify({
//       //       userId: decryptedParam2,
//       //       testCreationTableId: decryptedParam1,
//       //       timeLeft: formattedTime,
//       //     }),
//       //   }
//       // );

//       // const submitTimeLeftResult = await submitTimeLeftResponse.json();
//       // console.log("Time left submission result:", submitTimeLeftResult);

//       // // Clear local storage data for the current question
//       // if (questionId) {
//       //   try {
//       //     console.log(
//       //       "Removing from local storage for questionId:",
//       //       questionId
//       //     );
//       //     localStorage.removeItem(`calculatorValue_${questionId}`);
//       //     console.log("Item removed successfully.");
//       //   } catch (error) {
//       //     console.error("Error removing item from local storage:", error);
//       //   }
//       // }
//     } catch (error) {
//       console.error("Error in handleSubmit:", error);
//     }
//   };

//   const handleClearResponse = async () => {
//     console.log("Response cleared");

//     if (selectedQuestionId) {
//       const allQuestions = testData.subjects.flatMap((subject) =>
//         subject.sections.flatMap((section) => section.questions)
//       );

//       const question = allQuestions.find(
//         (q) => q.question_id === selectedQuestionId
//       );

//       if (question) {
//         // Clear the response based on question type
//         if (
//           question.quesion_type.some((type) =>
//             [1, 2, 7, 8].includes(type.quesionTypeId)
//           )
//         ) {
//           setRadioResponses((prev) => ({
//             ...prev,
//             [selectedQuestionId]: undefined,
//           }));
//         } else if (
//           question.quesion_type.some((type) =>
//             [3, 4].includes(type.quesionTypeId)
//           )
//         ) {
//           setCheckboxResponses((prev) => ({
//             ...prev,
//             [selectedQuestionId]: [],
//           }));
//         } else if (
//           question.quesion_type.some((type) =>
//             [5, 6].includes(type.quesionTypeId)
//           )
//         ) {
//           setTextResponses((prev) => ({
//             ...prev,
//             [selectedQuestionId]: undefined,
//           }));
//         }

//         // Update question button class
//         setQuestionButtonClass((prevClasses) => ({
//           ...prevClasses,
//           [selectedQuestionId]: "notAnswered",
//         }));

//         setAnsweredQuestions((prev) =>
//           prev.filter((id) => id !== selectedQuestionId)
//         );
//         setMarkedForReviewQuestions((prev) =>
//           prev.filter((id) => id !== selectedQuestionId)
//         );
//         setNotAnsweredQuestions((prev) => [...prev, selectedQuestionId]);

//         try {
//           const response = await axios.delete(
//             `http://localhost:5001/QuizPage/deleteResponse/${decryptedParam2}/${decryptedParam1}/${selectedQuestionId}`
//           );

//           console.log("Response received:", response); // Log full response object
//           console.log("Response status:", response.status); // Log status code
//           console.log("Response data:", response.data); // Log response data

//           if (response.status === 200) {
//             console.log(
//               "Response cleared successfully:",
//               response.data.message
//             ); // Log success message
//           } else {
//             console.error(
//               "Failed to clear response:",
//               response.data.message || "Unknown error"
//             );
//           }
//         } catch (error) {
//           console.error(
//             "Error clearing response from the database:",
//             error.message || error
//           );
//         }
//       }
//     }
//   };

//   if (!testData) {
//     return <div>Loading...</div>;
//   }

//   const selectedSubject = testData.subjects.find(
//     (subject) => subject.subjectId === selectedSubjectId
//   );
//   const selectedSection = selectedSubject?.sections.find(
//     (section) => section.sectionId === selectedSectionId
//   );
//   const selectedQuestion = selectedSection
//     ? selectedSection.questions.find(
//         (question) => question.question_id === selectedQuestionId
//       )
//     : selectedSubject.questions.find(
//         (question) => question.question_id === selectedQuestionId
//       );

//   const handlePreviousClick = () => {
//     const selectedSubject = testData.subjects.find(
//       (subject) => subject.subjectId === selectedSubjectId
//     );
//     const selectedSection = selectedSubject.sections.find(
//       (section) => section.sectionId === selectedSectionId
//     );
//     const questionIndex = selectedSection.questions.findIndex(
//       (question) => question.question_id === selectedQuestionId
//     );
//     const sectionIndex = selectedSubject.sections.findIndex(
//       (section) => section.sectionId === selectedSectionId
//     );
//     const subjectIndex = testData.subjects.findIndex(
//       (subject) => subject.subjectId === selectedSubjectId
//     );

//     let newQuestionId = null;

//     if (questionIndex > 0) {
//       newQuestionId = selectedSection.questions[questionIndex - 1].question_id;
//     } else if (sectionIndex > 0) {
//       const prevSection = selectedSubject.sections[sectionIndex - 1];
//       newQuestionId =
//         prevSection.questions[prevSection.questions.length - 1].question_id;
//       setSelectedSectionId(prevSection.sectionId);
//     } else if (subjectIndex > 0) {
//       const prevSubject = testData.subjects[subjectIndex - 1];
//       const prevSubjectLastSection =
//         prevSubject.sections[prevSubject.sections.length - 1];
//       newQuestionId =
//         prevSubjectLastSection.questions[
//           prevSubjectLastSection.questions.length - 1
//         ].question_id;
//       setSelectedSubjectId(prevSubject.subjectId);
//       setSelectedSectionId(prevSubjectLastSection.sectionId);
//     }

//     const allQuestions = testData.subjects.flatMap((subject) =>
//       subject.sections.flatMap((section) => section.questions)
//     );

//     // Mark the current question answer for saved for evaluation
//     setAnsweredSaved((prev) => [...prev, selectedQuestionId]);

//     // Determine if the current question is answered
//     const isCurrentQuestionAnswered = () => {
//       if (selectedQuestionId) {
//         const question = allQuestions.find(
//           (q) => q.question_id === selectedQuestionId
//         );
//         if (question) {
//           if (
//             question.quesion_type.some((type) =>
//               [1, 2, 7, 8].includes(type.quesionTypeId)
//             )
//           ) {
//             return radioResponses[selectedQuestionId] !== undefined;
//           }
//           if (
//             question.quesion_type.some((type) =>
//               [3, 4].includes(type.quesionTypeId)
//             )
//           ) {
//             return (checkboxResponses[selectedQuestionId] || []).length > 0;
//           }
//           if (
//             question.quesion_type.some((type) =>
//               [5, 6].includes(type.quesionTypeId)
//             )
//           ) {
//             return textResponses[selectedQuestionId] !== undefined;
//           }
//         }
//       }
//       return false;
//     };
//     const isCurrentQuestionMarkedForReview = () => {
//       return markedForReviewQuestions.includes(selectedQuestionId);
//     };
//     const isCurrentQuestionAnswerSaved = () => {
//       return answeredSaved.includes(selectedQuestionId);
//     };
//     const answered = isCurrentQuestionAnswered();
//     const markedForReview = isCurrentQuestionMarkedForReview();
//     const answerSaved = isCurrentQuestionAnswerSaved();
//     if (answered) {
//       setAnsweredQuestions((prev) => [...prev, selectedQuestionId]);
//       setNotAnsweredQuestions((prev) =>
//         prev.filter((id) => id !== selectedQuestionId)
//       );

//       if (!markedForReview && !answerSaved) {
//         setQuestionButtonClass((prevClasses) => ({
//           ...prevClasses,
//           [selectedQuestionId]: "answered",
//         }));
//       } else if (markedForReview && !answerSaved) {
//         setQuestionButtonClass((prevClasses) => ({
//           ...prevClasses,
//           [selectedQuestionId]: "purpleBox",
//         }));
//       } else if (answerSaved) {
//         setQuestionButtonClass((prevClasses) => ({
//           ...prevClasses,
//           [selectedQuestionId]: "answered",
//         }));
//       }
//       // // Set the class to "purpleBox" for answered questions
//       // setQuestionButtonClass((prevClasses) => ({
//       //   ...prevClasses,
//       //   [selectedQuestionId]: "answered",
//       // }));
//     } else {
//       setNotAnsweredQuestions((prev) => {
//         if (!prev.includes(selectedQuestionId)) {
//           return [...prev, selectedQuestionId];
//         }
//         return prev;
//       });
//       if (markedForReview) {
//         // Set the class to "purpleBox" for answered questions
//         setQuestionButtonClass((prevClasses) => ({
//           ...prevClasses,
//           [selectedQuestionId]: "blueBox",
//         }));
//       } else {
//         // Set the class to "purpleBox" for answered questions
//         setQuestionButtonClass((prevClasses) => ({
//           ...prevClasses,
//           [selectedQuestionId]: "notAnswered",
//         }));
//       }
//     }

//     if (newQuestionId !== null) {
//       setSelectedQuestionId(newQuestionId);
//       if (!visitedQuestions.includes(newQuestionId)) {
//         setVisitedQuestions((prev) => [...prev, newQuestionId]);
//       }
//       // Update the question status
//       const isNotAnswered = !answeredQuestions.includes(newQuestionId);
//       const isMarkedForReview =
//         markedForReviewQuestions.includes(newQuestionId);

//       if (isMarkedForReview) {
//         if (answeredQuestions.includes(newQuestionId)) {
//           setNotAnsweredQuestions((prev) =>
//             prev.filter((id) => id !== newQuestionId)
//           );
//         } else {
//           setNotAnsweredQuestions((prev) => [...prev, newQuestionId]);
//         }
//       } else {
//         if (isNotAnswered) {
//           setNotAnsweredQuestions((prev) => [...prev, newQuestionId]);
//         } else {
//           setNotAnsweredQuestions((prev) =>
//             prev.filter((id) => id !== newQuestionId)
//           );
//         }
//       }
//     }
//   };

//   const currentQuestionIndex = selectedSection
//     ? selectedSection.questions.findIndex(
//         (q) => q.question_id === selectedQuestionId
//       ) + 1
//     : null;
//   const currentQuestionId =
//     selectedSection && currentQuestionIndex
//       ? selectedSection.questions.find(
//           (q, index) => index === currentQuestionIndex - 1
//         )?.question_id
//       : null;
//   const moveToNextQuestion = () => {
//     let nextQuestionId = currentQuestionIndex + 1;
//     console.log("nextQuestionId", nextQuestionId);
//     const selectedSubject = testData.subjects.find(
//       (subject) => subject.subjectId === selectedSubjectId
//     );
//     const selectedSection = selectedSubject.sections.find(
//       (section) => section.sectionId === selectedSectionId
//     );
//     const questionIndex = selectedSection.questions.findIndex(
//       (question) => question.question_id === selectedQuestionId
//     );
//     const sectionIndex = selectedSubject.sections.findIndex(
//       (section) => section.sectionId === selectedSectionId
//     );
//     const subjectIndex = testData.subjects.findIndex(
//       (subject) => subject.subjectId === selectedSubjectId
//     );

//     if (questionIndex < selectedSection.questions.length - 1) {
//       nextQuestionId = selectedSection.questions[questionIndex + 1].question_id;
//     } else if (sectionIndex < selectedSubject.sections.length - 1) {
//       const nextSection = selectedSubject.sections[sectionIndex + 1];
//       nextQuestionId = nextSection.questions[0].question_id;
//       setSelectedSectionId(nextSection.sectionId);
//     } else if (subjectIndex < testData.subjects.length - 1) {
//       const nextSubject = testData.subjects[subjectIndex + 1];
//       setSelectedSubjectId(nextSubject.subjectId);
//       const nextSection = nextSubject.sections[0];
//       nextQuestionId = nextSection.questions[0].question_id;
//       setSelectedSectionId(nextSection.sectionId);
//     } else {
//       alert("No more questions.");
//       return;
//     }
//     const allQuestions = testData.subjects.flatMap((subject) =>
//       subject.sections.flatMap((section) => section.questions)
//     );

//     const isCurrentQuestionAnswered = () => {
//       if (selectedQuestionId) {
//         const question = allQuestions.find(
//           (q) => q.question_id === selectedQuestionId
//         );
//         if (question) {
//           if (
//             question.quesion_type.some((type) =>
//               [1, 2, 7, 8].includes(type.quesionTypeId)
//             )
//           ) {
//             return radioResponses[selectedQuestionId] !== undefined;
//           }
//           if (
//             question.quesion_type.some((type) =>
//               [3, 4].includes(type.quesionTypeId)
//             )
//           ) {
//             return (checkboxResponses[selectedQuestionId] || []).length > 0;
//           }
//           if (
//             question.quesion_type.some((type) =>
//               [5, 6].includes(type.quesionTypeId)
//             )
//           ) {
//             return textResponses[selectedQuestionId] !== undefined;
//           }
//         }
//       }
//       return false;
//     };
//     const isCurrentQuestionMarkedForReview = () => {
//       return markedForReviewQuestions.includes(selectedQuestionId);
//     };
//     const isCurrentQuestionAnswerSaved = () => {
//       return answeredSaved.includes(selectedQuestionId);
//     };
//     // Determine the status of the next question
//     const isAnswered = isCurrentQuestionAnswered();
//     const isMarkedForReview = isCurrentQuestionMarkedForReview();
//     const isAnswerSaved = isCurrentQuestionAnswerSaved();

//     if (nextQuestionId) {
//       setSelectedQuestionId(nextQuestionId);

//       // // Update the visited questions
//       // setVisitedQuestions((prev) => {
//       //   if (!prev.includes(nextQuestionId)) {
//       //     return [...prev, nextQuestionId];
//       //   }
//       //   return prev;
//       // });

//       // // Update the not answered questions
//       // setNotAnsweredQuestions((prev) => {
//       //   if (
//       //     !prev.includes(nextQuestionId) &&
//       //     !answeredQuestions.includes(nextQuestionId) &&
//       //     !markedForReviewQuestions.includes(nextQuestionId)
//       //   ) {
//       //     return [...prev, nextQuestionId];
//       //   }
//       //   return prev;
//       // });

//       // Update the question button class based on the question's status
//       if (isAnswered) {
//         setAnsweredQuestions((prev) => [...prev, nextQuestionId]);
//         setNotAnsweredQuestions((prev) =>
//           prev.filter((id) => id !== nextQuestionId)
//         );

//         if (isMarkedForReview && !isAnswerSaved) {
//           setQuestionButtonClass((prevClasses) => ({
//             ...prevClasses,
//             [nextQuestionId]: "purpleBox",
//           }));
//         } else if (isAnswerSaved && !isMarkedForReview) {
//           setQuestionButtonClass((prevClasses) => ({
//             ...prevClasses,
//             [nextQuestionId]: "answered",
//           }));
//         }
//       } else if (!isAnswered) {
//         setNotAnsweredQuestions((prev) => {
//           if (!prev.includes(nextQuestionId)) {
//             return [...prev, nextQuestionId];
//           }
//           return prev;
//         });

//         if (isMarkedForReview && !isAnswerSaved) {
//           setQuestionButtonClass((prevClasses) => ({
//             ...prevClasses,
//             [nextQuestionId]: "blueBox",
//           }));
//         } else if (!isAnswerSaved && !isMarkedForReview) {
//           setQuestionButtonClass((prevClasses) => ({
//             ...prevClasses,
//             [nextQuestionId]: "notAnswered",
//           }));
//         }
//       }
//     }
//   };
//   // console.log("shizukaaaaaaaaa")
//   // console.log("currentQuestionIndex",currentQuestionIndex)
//   // console.log("currentQuestionId",currentQuestionId)

//   //MAIN CODE
//   const handleSaveAndNext = async () => {
//     console.log("radioResponses", radioResponses);
//     console.log("checkboxResponses", checkboxResponses);

//     const allQuestions = testData.subjects.flatMap((subject) =>
//       subject.sections.flatMap((section) => section.questions)
//     );

//     // Mark the current question answer as saved for evaluation
//     setAnsweredSaved((prev) => [...prev, selectedQuestionId]);

//     // Determine if the current question is answered
//     const isCurrentQuestionAnswered = () => {
//       if (selectedQuestionId) {
//         const question = allQuestions.find(
//           (q) => q.question_id === selectedQuestionId
//         );
//         if (question) {
//           if (
//             question.quesion_type.some((type) =>
//               [1, 2, 7, 8].includes(type.quesionTypeId)
//             )
//           ) {
//             return radioResponses[selectedQuestionId] !== undefined;
//           }
//           if (
//             question.quesion_type.some((type) =>
//               [3, 4].includes(type.quesionTypeId)
//             )
//           ) {
//             return (checkboxResponses[selectedQuestionId] || []).length > 0;
//           }
//           if (
//             question.quesion_type.some((type) =>
//               [5, 6].includes(type.quesionTypeId)
//             )
//           ) {
//             return textResponses[selectedQuestionId] !== undefined;
//           }
//         }
//       }
//       return false;
//     };

//     const isCurrentQuestionMarkedForReview = () => {
//       return markedForReviewQuestions.includes(selectedQuestionId);
//     };

//     const isCurrentQuestionAnswerSaved = () => {
//       return answeredSaved.includes(selectedQuestionId);
//     };

//     const answered = isCurrentQuestionAnswered();
//     // const markedForReview = isCurrentQuestionMarkedForReview();
//     // const answerSaved = isCurrentQuestionAnswerSaved();

//     if (answered) {
//       setAnsweredQuestions((prev) => [...prev, selectedQuestionId]);
//       setNotAnsweredQuestions((prev) =>
//         prev.filter((id) => id !== selectedQuestionId)
//       );
//       setQuestionButtonClass((prevClasses) => ({
//         ...prevClasses,
//         [selectedQuestionId]: "answered",
//       }));

//       const selectedOption1 = radioResponses[selectedQuestionId];
//       const selectedOption2 = checkboxResponses[selectedQuestionId];

//       const optionIndexes1 = selectedOption1
//         ? [selectedOption1.optionIndex]
//         : [];
//       const optionIndexes2 = selectedOption2
//         ? selectedOption2.map((item) => item.optionIndex)
//         : [];

//       const optionIndexes1CharCodes = optionIndexes1.map((index) => {
//         return String.fromCharCode("a".charCodeAt(0) + index);
//       });

//       const optionIndexes2CharCodes = optionIndexes2.map((index) => {
//         return String.fromCharCode("a".charCodeAt(0) + index);
//       });

//       const response = {
//         userId: decryptedParam2,
//         questionId: currentQuestionId,
//         testCreationTableId: decryptedParam1,
//         subjectId: selectedSubjectId,
//         sectionId: selectedSectionId,
//         optionIndexes1: selectedOption1 ? selectedOption1.optionId : "",
//         optionIndexes2: (checkboxResponses[selectedQuestionId] || [])
//           .map((item) => item.optionId)
//           .join(","),
//         optionIndexes1CharCodes: optionIndexes1CharCodes,
//         optionIndexes2CharCodes: optionIndexes2CharCodes,
//         calculatorInputValue: textResponses[selectedQuestionId] || "",
//       };

//       const updateResponse = {
//         userId: decryptedParam2,
//         questionId: selectedQuestionId,
//         testCreationTableId: decryptedParam1,
//         subjectId: selectedSubjectId,
//         sectionId: selectedSectionId,
//         optionIndexes1: selectedOption1 ? selectedOption1.optionId : "",
//         optionIndexes2: (checkboxResponses[selectedQuestionId] || [])
//           .map((item) => item.optionId)
//           .join(","),
//         optionIndexes1CharCodes: optionIndexes1CharCodes,
//         optionIndexes2CharCodes: optionIndexes2CharCodes,
//         calculatorInputValue: textResponses[selectedQuestionId] || "",
//       };

//       try {
//         if (answeredQuestions.includes(selectedQuestionId)) {
//           // Update the existing response
//           const url = `${BASE_URL}/QuizPage/updateResponse/${decryptedParam2}/${decryptedParam1}/${selectedSubjectId}/${selectedSectionId}/${selectedQuestionId}`;
//           console.log(
//             "Updating response with URL:",
//             url,
//             "Payload:",
//             updateResponse
//           );
//           await fetch(url, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(updateResponse),
//           });
//           console.log("Response updated successfully");
//         } else {
//           // Save the new response
//           const url = `${BASE_URL}/QuizPage/response`;
//           console.log(
//             "Saving new response with URL:",
//             url,
//             "Payload:",
//             response
//           );
//           await fetch(url, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(response),
//           });
//           console.log("Response saved successfully");
//         }
//         setQuestionButtonClass((prevClasses) => ({
//           ...prevClasses,
//           [selectedQuestionId]: "answered",
//         }));
//       } catch (error) {
//         console.error("Error saving or updating response:", error);
//       }
//     } else {
//       setNotAnsweredQuestions((prev) => {
//         if (!prev.includes(selectedQuestionId)) {
//           return [...prev, selectedQuestionId];
//         }
//         return prev;
//       });
//       setQuestionButtonClass((prevClasses) => ({
//         ...prevClasses,
//         [selectedQuestionId]: "notAnswered",
//       }));
//       // if (markedForReview) {
//       //   setQuestionButtonClass((prevClasses) => ({
//       //     ...prevClasses,
//       //     [selectedQuestionId]: 'blueBox',
//       //   }));
//       // } else {
//       //   setQuestionButtonClass((prevClasses) => ({
//       //     ...prevClasses,
//       //     [selectedQuestionId]: 'notAnswered',
//       //   }));
//       // }
//     }

//     // Call the function to move to the next question
//     moveToNextQuestion();
//   };

//   const handleMarkForReview = async () => {
//     const allQuestions = testData.subjects.flatMap((subject) =>
//       subject.sections.flatMap((section) => section.questions)
//     );

//     // Determine if the current question is answered
//     const isCurrentQuestionAnswered = () => {
//       if (selectedQuestionId) {
//         const question = allQuestions.find(
//           (q) => q.question_id === selectedQuestionId
//         );
//         if (question) {
//           if (
//             question.quesion_type.some((type) =>
//               [1, 2, 7, 8].includes(type.quesionTypeId)
//             )
//           ) {
//             return radioResponses[selectedQuestionId] !== undefined;
//           }
//           if (
//             question.quesion_type.some((type) =>
//               [3, 4].includes(type.quesionTypeId)
//             )
//           ) {
//             return (checkboxResponses[selectedQuestionId] || []).length > 0;
//           }
//           if (
//             question.quesion_type.some((type) =>
//               [5, 6].includes(type.quesionTypeId)
//             )
//           ) {
//             return textResponses[selectedQuestionId] !== undefined;
//           }
//         }
//       }
//       return false;
//     };

//     const answered = isCurrentQuestionAnswered();

//     // Mark the current question for review
//     setMarkedForReviewQuestions((prev) => [...prev, selectedQuestionId]);

//     if (answered) {
//       setAnsweredQuestions((prev) => [...prev, selectedQuestionId]);
//       setNotAnsweredQuestions((prev) =>
//         prev.filter((id) => id !== selectedQuestionId)
//       );
//       const selectedOption1 = radioResponses[selectedQuestionId];
//       const selectedOption2 = checkboxResponses[selectedQuestionId];

//       const optionIndexes1 = selectedOption1
//         ? [selectedOption1.optionIndex]
//         : [];
//       const optionIndexes2 = selectedOption2
//         ? selectedOption2.map((item) => item.optionIndex)
//         : [];

//       const optionIndexes1CharCodes = optionIndexes1.map((index) => {
//         return String.fromCharCode("a".charCodeAt(0) + index);
//       });

//       const optionIndexes2CharCodes = optionIndexes2.map((index) => {
//         return String.fromCharCode("a".charCodeAt(0) + index);
//       });

//       const response = {
//         userId: decryptedParam2,
//         questionId: selectedQuestionId,
//         testCreationTableId: decryptedParam1,
//         subjectId: selectedSubjectId,
//         sectionId: selectedSectionId,
//         optionIndexes1: selectedOption1 ? selectedOption1.optionId : "",
//         optionIndexes2: (checkboxResponses[selectedQuestionId] || [])
//           .map((item) => item.optionId)
//           .join(","),
//         optionIndexes1CharCodes: optionIndexes1CharCodes,
//         optionIndexes2CharCodes: optionIndexes2CharCodes,
//         calculatorInputValue: textResponses[selectedQuestionId] || "",
//       };

//       try {
//         if (answeredQuestions.includes(selectedQuestionId)) {
//           // Update the existing response
//           await fetch(
//             `${BASE_URL}/QuizPage/updateResponse/${decryptedParam2}/${decryptedParam1}/${selectedSubjectId}/${selectedSectionId}/${selectedQuestionId}`,
//             {
//               method: "PUT",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(response),
//             }
//           );
//           console.log("Response updated successfully");
//           console.log("Updated Response", response);
//         } else {
//           // Save the new response
//           await fetch(`${BASE_URL}/QuizPage/response`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(response),
//           });
//           console.log("Response saved successfully");
//           console.log("New Response", response);
//         }
//       } catch (error) {
//         console.error("Error saving or updating response:", error);
//       }
//       // Set the class to "purpleBox" for answered questions
//       setQuestionButtonClass((prevClasses) => ({
//         ...prevClasses,
//         [selectedQuestionId]: "purpleBox",
//       }));
//     } else {
//       setNotAnsweredQuestions((prev) => [...prev, selectedQuestionId]);
//       // Set the class to "blueBox" for unanswered questions
//       setQuestionButtonClass((prevClasses) => ({
//         ...prevClasses,
//         [selectedQuestionId]: "blueBox",
//       }));
//     }

//     // Handle moving to the next question
//     let nextQuestionId = null;
//     const selectedSubject = testData.subjects.find(
//       (subject) => subject.subjectId === selectedSubjectId
//     );
//     const selectedSection = selectedSubject.sections.find(
//       (section) => section.sectionId === selectedSectionId
//     );
//     const questionIndex = selectedSection.questions.findIndex(
//       (question) => question.question_id === selectedQuestionId
//     );
//     const sectionIndex = selectedSubject.sections.findIndex(
//       (section) => section.sectionId === selectedSectionId
//     );
//     const subjectIndex = testData.subjects.findIndex(
//       (subject) => subject.subjectId === selectedSubjectId
//     );

//     if (questionIndex < selectedSection.questions.length - 1) {
//       nextQuestionId = selectedSection.questions[questionIndex + 1].question_id;
//     } else if (sectionIndex < selectedSubject.sections.length - 1) {
//       const nextSection = selectedSubject.sections[sectionIndex + 1];
//       nextQuestionId = nextSection.questions[0].question_id;
//       setSelectedSectionId(nextSection.sectionId);
//     } else if (subjectIndex < testData.subjects.length - 1) {
//       const nextSubject = testData.subjects[subjectIndex + 1];
//       setSelectedSubjectId(nextSubject.subjectId);
//       const nextSection = nextSubject.sections[0];
//       nextQuestionId = nextSection.questions[0].question_id;
//       setSelectedSectionId(nextSection.sectionId);
//     } else {
//       alert("No more questions.");
//       return;
//     }

//     if (nextQuestionId) {
//       setSelectedQuestionId(nextQuestionId);
//       setVisitedQuestions((prev) => [...prev, nextQuestionId]);

//       // Ensure the color reflects the correct state
//       setNotAnsweredQuestions((prev) => {
//         if (
//           !prev.includes(nextQuestionId) &&
//           !answeredQuestions.includes(nextQuestionId) &&
//           !markedForReviewQuestions.includes(nextQuestionId)
//         ) {
//           return [...prev, nextQuestionId];
//         }
//         return prev;
//       });
//     }
//   };

//   const questions = selectedSection
//     ? selectedSection.questions
//     : selectedSubject.questions;

//   const visitedCount = visitedQuestions.length;
//   const totalQuestions = testData?.subjects.flatMap((subject) =>
//     subject.sections.flatMap((section) => section.questions)
//   ).length;

//   // Calculate Answered and Marked for Review count
//   const answeredAndMarkForReviewCount = answeredQuestions.filter((id) =>
//     markedForReviewQuestions.includes(id)
//   ).length;

//   // Calculate counts excluding the Answered and Marked for Review count
//   const answeredOnlyCount =
//     answeredQuestions.length - answeredAndMarkForReviewCount;
//   const markForReviewOnlyCount =
//     markedForReviewQuestions.length - answeredAndMarkForReviewCount;

//   // Calculate Not Answered but Visited count
//   const notAnsweredButVisitedCount = visitedQuestions.filter(
//     (id) =>
//       !answeredQuestions.includes(id) && !markedForReviewQuestions.includes(id)
//   ).length;

//   const notVisitedCount = totalQuestions - visitedQuestions.length;

//   const toggleSidebar = () => {
//     setSidebarVisible(!isSidebarVisible);
//   };
//   // Find the selected subject
//   const selectedSubjectName = testData.subjects.find(
//     (subject) => subject.subjectId === selectedSubjectId
//   );

//   // Find the selected section within the selected subject
//   const selectedSectionName = selectedSubject
//     ? selectedSubject.sections.find(
//         (section) => section.sectionId === selectedSectionId
//       )
//     : null;

//   const handleMalPractiseSubmit = async () => {
//     console.log("Handling malpractice submit");
//     // try {
//     //   // window.alert(
//     //   //   "Your Test has been Submitted!! Click Ok to See Result.",
//     //   //   calculateResult()
//     //   // );
//     //   setShowButtonNo(false);
//     //   setShowExamSumary(true);
//     //   setShowMalPractisePopup(false);
//     //   calculateResult();
//     //   const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
//     //   const counts = calculateQuestionCounts();
//     //   setAnsweredCount(counts.answered);
//     //   setNotAnsweredCount(counts.notAnswered);
//     //   setMarkedForReviewCount(counts.markedForReview);
//     //   setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
//     //   setVisitedCount(counts.VisitedCount);

//     //   // Assuming you have these variables in your component's state
//     //   const currentQuestion = questionData.questions[currentQuestionIndex];
//     //   const questionId = currentQuestion.question_id;

//     //   // Format time
//     //   const formattedTime = WformatTime(wtimer);
//     //   const response = await fetch(`${BASE_URL}/QuizPage/saveExamSummary`, {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({
//     //       userId: decryptedParam2,
//     //       totalUnattempted: notAnsweredCount,
//     //       totalAnswered: answeredCount,
//     //       NotVisitedb: NotVisitedb,
//     //       testCreationTableId: decryptedParam1,
//     //     }),
//     //   });
//     //   const result = await response.json();
//     //   console.log("Exam summary saved:", result);
//     //   try {
//     //     // Make a POST request to your server to submit time left
//     //     const response = await fetch(`${BASE_URL}/QuizPage/submitTimeLeft`, {
//     //       method: "POST",
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //       },

//     //       body: JSON.stringify({
//     //         userId: decryptedParam2,
//     //         testCreationTableId: decryptedParam1,
//     //         timeLeft: formattedTime,
//     //       }),
//     //     });

//     //     const result = await response.json();

//     //     console.log("Time left submission result:", result);
//     //   } catch (error) {
//     //     console.error("Error submitting time left:", error);
//     //   } finally {
//     //     // Ensure that the questionId is correctly obtained
//     //     if (questionId) {
//     //       // Clear local storage data for the current question
//     //       try {
//     //         console.log(
//     //           "Removing from local storage for questionId:",
//     //           questionId
//     //         );
//     //         localStorage.removeItem(`calculatorValue_${questionId}`);
//     //         console.log("Item removed successfully.");
//     //       } catch (error) {
//     //         console.error("Error removing item from local storage:", error);
//     //       }
//     //     }
//     //   }
//     // } catch (error) {
//     //   console.error("Error in handleSubmit:", error);
//     // }
//   };

//   const handleYes = async () => {
//     // setShowPopup(true);
//     // navigate(`/Submit_Page`);
//     try {
//       const encryptedParam1 = await encryptData(decryptedParam1.toString());
//       const encryptedParam2 = await encryptData(decryptedParam2.toString());

//       const token = new Date().getTime().toString();
//       sessionStorage.setItem("navigationToken", token);
//       // to={`/TestResultsPage/${decryptedParam1}/${userData.id}`}
//       const url = `/TestResultsPage/${encodeURIComponent(
//         encryptedParam1
//       )}/${encodeURIComponent(encryptedParam2)}`;

//       navigate(url, { state: { userData } });
//     } catch (error) {
//       console.error("Error encrypting data:", error);
//     }
//     // try {
//     //   // const userId = decryptedParam2;
//     //   console.log("sddvfnjdxnvjkncmvncx");
//     //   console.log(decryptedParam2);
//     //   const courseCreationId = testDetails?.[0]?.courseCreationId;
//     //   console.log(
//     //     courseCreationId ? courseCreationId : "Course creation ID not available"
//     //   );
//     //   console.log(decryptedParam1);

//     //   // Prepare data for the POST request
//     //   const postData = {
//     //     userId: decryptedParam2,
//     //     courseCreationId: courseCreationId,
//     //     testCreationTableId: decryptedParam1,
//     //     test_status: "Completed",
//     //   };

//     //   // Make the POST request
//     //   const response = await fetch(
//     //     `${BASE_URL}/QuizPage/insertTestAttemptStatus`,
//     //     {
//     //       method: "POST",
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //       },
//     //       body: JSON.stringify(postData),
//     //     }
//     //   );

//     //   if (!response.ok) {
//     //     throw new Error("Failed to insert test attempt status");
//     //   }
//     //   console.log("Test attempt status inserted successfully");
//     //   // await fetchQuestionCount();
//     //   // Navigate to the test results page
//     //   // navigate(`/Submit_Page`);
//     // } catch (error) {
//     //   console.error("Error:", error.message);
//     // }
//   };

//   const handleNo = () => {
//     setShowExamSumary(false);
//   };

//   // Function to get the button class based on the question's state
//   const getButtonClass = (question_id) => {
//     const isAnswered = answeredQuestions.includes(question_id);
//     const isMarkedForReview = markedForReviewQuestions.includes(question_id);
//     const isActive = selectedQuestionId === question_id;

//     if (isMarkedForReview) {
//       return isAnswered ? "purpleBox" : "blueBox";
//     }
//     return isAnswered ? "answered" : "question_button";
//   };

//   return (
//     <div
//       className="QuestionPaper_-container"
//       ref={quizRef}
//       onClick={enterFullscreen}
//       style={{ backgroundColor: "white" }}
//     >
//       <div className="quiz_exam_interface_header quiz_exam_interface_header_q_if_H">
//         <div className="quiz_exam_interface_header_LOGO ">
//           <img src={image} alt="Current" />
//         </div>
//         <p className="ots_quiz_testname" key={testName.decryptedParam1}>
//           {testData.TestName}
//         </p>
//       </div>
//       {!showExamSumary ? (
//         <div className="quiz_exam_interface_body">
//           <div className="quizPagewatermark">
//             <div className="quiz_exam_interface_body_left_container">
//               <div className="quiz_exam_interface_exam_subCONTAINEr">
//                 <div className="quiz_exam_interface_exam_qN_Q">
//                   <div class="SUBJECTS_CONTAINER">
//                     <div className="subject_container">
//                       {testData.subjects.map((subject) => (
//                         <button
//                           key={subject.subjectId}
//                           onClick={() => handleSubjectClick(subject.subjectId)}
//                           className={`sidebar-button ${
//                             subject.subjectId === selectedSubjectId
//                               ? "active"
//                               : ""
//                           }`}
//                         >
//                           {subject.SubjectName}
//                         </button>
//                       ))}
//                     </div>
//                     <div className="sections_conatiner">
//                       {selectedSubjectId && (
//                         <div className="child_sections_conatiner">
//                           {testData.subjects
//                             .find(
//                               (subject) =>
//                                 subject.subjectId === selectedSubjectId
//                             )
//                             .sections.map((section) => (
//                               <button
//                                 key={section.sectionId}
//                                 onClick={() =>
//                                   handleSectionClick(section.sectionId)
//                                 }
//                                 // className={
//                                 //   selectedSectionId === section.sectionId ? "selected" : ""
//                                 // }
//                                 className={`sidebar-button ${
//                                   section.sectionId === selectedSectionId
//                                     ? "active"
//                                     : ""
//                                 }`}
//                               >
//                                 {section.SectionName}
//                               </button>
//                             ))}
//                         </div>
//                       )}
//                     </div>
//                     <div className="time_qtype_div">
//                       <div className="qtype_timer">
//                         <p className="qtype">
//                           {selectedQuestion.quesion_type.map((type) => (
//                             <div key={type.quesionTypeId}>
//                               {type.typeofQuestion}
//                             </div>
//                           ))}
//                         </p>
//                         <p className="time_left_tag">
//                           <span id="time_left_icon">
//                             <MdOutlineTimer />
//                           </span>
//                           <div>
//                             Time Left: {hours.toString().padStart(2, "0")}:
//                             {minutes.toString().padStart(2, "0")}:
//                             {seconds.toString().padStart(2, "0")}
//                           </div>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {selectedQuestion && (
//                   <div className="question_options_div">
//                     <div className="paragraphQuestion_div">
//                       <div className="pravagragh_container ">
//                         {selectedQuestion.paragraph &&
//                           selectedQuestion.paragraph.paragraphImg && (
//                             <div className="Paragraph_div ">
//                               <b>Paragraph:</b>
//                               <img
//                                 src={`${BASE_URL}/uploads/${selectedQuestion.documen_name}/${selectedQuestion.paragraph.paragraphImg}`}
//                                 alt={`ParagraphImage ${selectedQuestion.paragraph.paragraph_Id}`}
//                               />
//                             </div>
//                           )}
//                       </div>
//                     </div>
//                     <div className="question_number_continer">
//                       <div id="question_number_div">
//                         <b>Question</b>
//                         <h4 id="question_number_tag">
//                           {currentQuestionIndex}.
//                         </h4>
//                       </div>
//                       <div>
//                         <img
//                           className="question_image"
//                           src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${selectedQuestion.questionImgName}`}
//                           alt={`Question ${selectedQuestion.question_id}`}
//                         />
//                       </div>
//                     </div>
//                     <div className="parent_div">
//                       {selectedQuestion.quesion_type.some((type) =>
//                         [1, 2, 7, 8].includes(type.quesionTypeId)
//                       ) && (
//                         <div className="options">
//                           {selectedQuestion.options.map(
//                             (option, optionIndex) => (
//                               <div key={option.option_id}>
//                                 <input
//                                   type="radio"
//                                   name={`question_${selectedQuestion.question_id}`}
//                                   value={option.option_id}
//                                   // checked={
//                                   //   radioResponses[selectedQuestion.question_id] ===
//                                   //   option.option_id
//                                   // }
//                                   checked={
//                                     radioResponses[selectedQuestion.question_id]
//                                       ?.optionId === option.option_id
//                                   }
//                                   onChange={() =>
//                                     handleRadioChange(
//                                       selectedQuestion.question_id,
//                                       option.option_id,
//                                       optionIndex
//                                     )
//                                   }
//                                 />
//                                 (
//                                 {String.fromCharCode(
//                                   "a".charCodeAt(0) + optionIndex
//                                 )}
//                                 )
//                                 <img
//                                   src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${option.optionImgName}`}
//                                   alt={`Option ${option.option_index}`}
//                                 />
//                               </div>
//                             )
//                           )}
//                         </div>
//                       )}
//                       {selectedQuestion.quesion_type.some((type) =>
//                         [3, 4].includes(type.quesionTypeId)
//                       ) && (
//                         <div className="options">
//                           {selectedQuestion.options.map(
//                             (option, optionIndex) => (
//                               <div key={option.option_id}>
//                                 <input
//                                   type="checkbox"
//                                   name={`question_${selectedQuestion.question_id}`}
//                                   value={option.option_id}
//                                   checked={checkboxResponses[
//                                     selectedQuestion.question_id
//                                   ]?.some(
//                                     (resp) => resp.optionId === option.option_id
//                                   )}
//                                   onChange={(e) =>
//                                     handleCheckboxChange(
//                                       selectedQuestion.question_id,
//                                       option.option_id,
//                                       e.target.checked,
//                                       optionIndex
//                                     )
//                                   }
//                                 />
//                                 (
//                                 {String.fromCharCode(
//                                   "a".charCodeAt(0) + optionIndex
//                                 )}
//                                 )
//                                 <img
//                                   src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${option.optionImgName}`}
//                                   alt={`Option ${option.option_index}`}
//                                 />
//                               </div>
//                             )
//                           )}
//                         </div>
//                       )}
//                       <div className="quiz_exam_interface_exam_qN_Q_options_calculator_input">
//                         {selectedQuestion.quesion_type.some((type) =>
//                           [5].includes(type.quesionTypeId)
//                         ) && (
//                           <>
//                             <div className="calculator_div">
//                               <div className="display">
//                                 <label>Answer:</label>
//                                 <input
//                                   type="text"
//                                   id="input_number_text_box"
//                                   value={
//                                     textResponses[
//                                       selectedQuestion.question_id
//                                     ] || ""
//                                   }
//                                   placeholder="Enter your answer"
//                                   onChange={(e) =>
//                                     handleTextChange(
//                                       selectedQuestion.question_id,
//                                       e.target.value
//                                     )
//                                   }
//                                   // onClick={() => handleClickInput(selectedQuestion.question_id)}
//                                 />
//                                 <div className="input_numbers_div">
//                                   {[
//                                     "DEL",
//                                     "1",
//                                     "2",
//                                     "3",
//                                     "4",
//                                     "5",
//                                     "6",
//                                     "7",
//                                     "8",
//                                     "9",
//                                     "0",
//                                     "-",
//                                   ].map((key) => (
//                                     <button
//                                       key={key}
//                                       onClick={() => handleKeypadClick(key)}
//                                       className={
//                                         key === "DEL"
//                                           ? "del_button"
//                                           : "number_btn"
//                                       }
//                                     >
//                                       {key}
//                                     </button>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                         {selectedQuestion.quesion_type.some((type) =>
//                           [6].includes(type.quesionTypeId)
//                         ) && (
//                           <>
//                             <div className="calculator_div">
//                               <div className="display">
//                                 <label>Answer:</label>
//                                 <input
//                                   type="text"
//                                   id="input_number_text_box"
//                                   value={
//                                     textResponses[
//                                       selectedQuestion.question_id
//                                     ] || ""
//                                   }
//                                   placeholder="Enter your answer"
//                                   onChange={(e) =>
//                                     handleTextChange(
//                                       selectedQuestion.question_id,
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                                 <div className="input_numbers_div">
//                                   {[
//                                     "DEL",
//                                     "1",
//                                     "2",
//                                     "3",
//                                     "4",
//                                     "5",
//                                     "6",
//                                     "7",
//                                     "8",
//                                     "9",
//                                     "0",
//                                     "-",
//                                     ".",
//                                   ].map((key) => (
//                                     <button
//                                       key={key}
//                                       onClick={() => handleKeypadClick(key)}
//                                       className={
//                                         key === "DEL"
//                                           ? "del_button"
//                                           : "number_btn"
//                                       }
//                                     >
//                                       {key}
//                                     </button>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="quiz_btns_contaioner">
//                 <div>
//                   <button
//                     className="Quiz_Save_MarkforReview"
//                     onClick={handleMarkForReview}
//                     title="Click here to Save & Mark for Review"
//                   >
//                     Mark for Review & Next
//                   </button>
//                   <button
//                     className="Quiz_clearResponse"
//                     onClick={handleClearResponse}
//                     title="Click here to Clear Response"
//                   >
//                     Clear Response
//                   </button>
//                   <button
//                     title="Click here to Save & Next"
//                     className="quizsave_next"
//                     onClick={handleSaveAndNext}
//                   >
//                     Save & Next
//                   </button>
//                 </div>
//                 <div className="quiz_Next_back">
//                   <button
//                     className="previous-btn"
//                     onClick={handlePreviousClick}
//                     // disabled={currentQuestionIndex === 0}
//                     title="Click here to go Back"
//                   >
//                     <i className="fa-solid fa-angles-left"></i> Back
//                   </button>
//                   <button
//                     style={{ background: "#f0a607da" }}
//                     onClick={handleSubmit}
//                     id="submit_btn"
//                     title="Click here to Submit"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="quiz_exam_interface_body_right_container">
//             <div className="rightsidebar_container">
//               <div
//                 className="rightsidebar_container_btn_menubar"
//                 onClick={toggleSidebar}
//               >
//                 <BiMenuAltLeft />
//               </div>
//               <div
//                 className={
//                   isSidebarVisible ? "rightsidebar visible" : "rightsidebar"
//                 }
//               >
//                 <div className="right-side-bar">
//                   <div className="rightSidebar-topHeader">
//                     {studentDetails.map((student, index) => (
//                       <div key={index}>
//                         <img
//                           className="users_profile_img"
//                           src={`${BASE_URL}/uploads/studentinfoimeages/${student.UplodadPhto}`}
//                           alt={`no img${student.UplodadPhto}`}
//                         />
//                         <p>Candidate Name:{student.candidateName}</p>
//                       </div>
//                     ))}
//                     <p key={testName.testCreationTableId}>
//                       Test Name: {testData.TestName}
//                     </p>
//                   </div>
//                   <div className="buttons_container">
//                     <p className="abt_Question_Palette">
//                       Your viewing{" "}
//                       {selectedSubjectName && (
//                         <p className="sub_section">
//                           {selectedSubject.SubjectName}
//                         </p>
//                       )}{" "}
//                       -{" "}
//                       {selectedSectionName && (
//                         <p className="sub_section">
//                           {selectedSection.SectionName}
//                         </p>
//                       )}{" "}
//                       Question Palette
//                     </p>

//                     <div className="ques-btn">
//                       <ul className="btn-ul quesAns-btn">
//                         {questions.map((question, index) => {
//                           // Determine button class based on question ID
//                           const buttonClass =
//                             questionButtonClass[question.question_id] ||
//                             "question_button";

//                           return (
//                             <li key={question.question_id}>
//                               <button
//                                 className={buttonClass}
//                                 onClick={() =>
//                                   handleQuestionClick(question.question_id)
//                                 }
//                               >
//                                 {index + 1}
//                               </button>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="sidebar-footer">
//                     <h4 className="sidebar-footer-header">Legend:</h4>
//                     <div className="footer-btns">
//                       <div className="inst-btns">
//                         {" "}
//                         <p className="question_button" title="VisitedCount">
//                           {notVisitedCount}
//                         </p>
//                         <span>Not Visited</span>
//                       </div>
//                       <div className="inst-btns">
//                         <p
//                           className="instruction-btn1 r_S_B_BTNS"
//                           title="answeredCount"
//                         >
//                           {answeredOnlyCount}
//                         </p>
//                         <span>Answered</span>
//                       </div>
//                       <div className="inst-btns">
//                         <p
//                           className="instruction-btn2 r_S_B_BTNS"
//                           title="notAnsweredCount"
//                         >
//                           {notAnsweredButVisitedCount}
//                         </p>
//                         <span>Not Answered</span>
//                       </div>
//                       <div className="inst-btns">
//                         <p
//                           className="instruction-btn3 r_S_B_BTNS"
//                           title="answeredmarkedForReviewCount"
//                         >
//                           {markForReviewOnlyCount}
//                         </p>
//                         <span>Marked for Review</span>
//                       </div>
//                       <div className="inst-btns">
//                         <p
//                           className="instruction-btn4 r_S_B_BTNS"
//                           title="markedForReviewCount"
//                         >
//                           {answeredAndMarkForReviewCount}
//                         </p>
//                         <span>
//                           Answered & Marked for Review (will be considered for
//                           evaluation)
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="examSummary_quizPagewatermark">
//           <h3 className="Exam_summary_heading">Exam Summary</h3>

//           <div className="Exam_summary_table">
//             <table id="customers" className="exam_summary_table">
//               <tr className="exam_summary_table_tr">
//                 <td>Total Questions</td>
//                 <td>Answered Questions</td>
//                 <td>Not Answered Questions</td>
//                 <td>Not Visited Count</td>
//                 <td>Marked for Review Questions</td>
//                 <td>Answered & Marked for Review Questions</td>
//               </tr>
//               <tr>
//                 <td>{notVisitedCount}</td>
//                 <td>{answeredOnlyCount}</td>
//                 <td>{notAnsweredButVisitedCount}</td>
//                 <td>{notVisitedCount}</td>
//                 <td>{markForReviewOnlyCount}</td>
//                 <td>{answeredAndMarkForReviewCount}</td>
//               </tr>
//             </table>
//           </div>

//           <div>
//             {showButtonNo === false ? (
//               <h2 className="Exam_summary_question_tag">
//                 Please press okay to view your result.
//               </h2>
//             ) : (
//               <h2 className="Exam_summary_question_tag">
//                 Are you sure you want to submit ? <br />
//                 No changes will be allowed after submission.
//               </h2>
//             )}

//             <div className="Exam_summary_btns">
//               {showButtonNo === false ? (
//                 <>
//                   <Link
//                     className="es_btn"
//                     onClick={handleYes}
//                     title="Click here to go Next"
//                   >
//                     Okay
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     className="es_btn"
//                     // to={`/TestResultsPage/${decryptedParam1}/${userData.id}`}
//                     // to='/Submit_Page'
//                     onClick={handleYes}
//                     title="Click here to go Next"
//                   >
//                     Yes
//                   </Link>
//                 </>
//               )}
//               {showButtonNo && (
//                 <button
//                   className="es_btn"
//                   title="Click here to go Back"
//                   onClick={handleNo}
//                 >
//                   NO
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UG_OTSQuizPage;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./UG_OTSQuizPage.css";
import BASE_URL from "../../../../apiConfig";
import { decryptData } from "../utils/crypto";

const UG_OTSQuizPage = () => {
  const [testData, setTestData] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [radioResponses, setRadioResponses] = useState({});
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const [textResponses, setTextResponses] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [notAnsweredQuestions, setNotAnsweredQuestions] = useState([]);

  const [markedForReviewQuestions, setMarkedForReviewQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [questionss, setQuestions] = useState([]);

  const location = useLocation();
  const { userData } = location.state || {};

  const navigate = useNavigate();
  const { param1, param2 } = useParams();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");

  useEffect(() => {
    if (testData?.subjects?.length) {
      // Flatten questions from all subjects and sections
      const allQuestions = testData.subjects.flatMap(subject =>
        subject.sections.flatMap(section => section.questions)
      );
      setQuestions(allQuestions);

      // Set the first question as the selected question
      const firstQuestion = allQuestions[0];
      if (firstQuestion) {
        setSelectedQuestionId(firstQuestion.question_id);

        // Set the first question as visited but not answered
        setVisitedQuestions([firstQuestion.question_id]);
        setNotAnsweredQuestions([firstQuestion.question_id]);
      }
    }
  }, [testData]);

  const handleSectionClick = (sectionId) => {
    setSelectedSectionId(sectionId);
    const selectedSection = testData.subjects
      .find((subject) => subject.subjectId === selectedSubjectId)
      .sections.find((section) => section.sectionId === sectionId);

    if (selectedSection) {
      setQuestions(selectedSection.questions);
      const firstQuestion = selectedSection.questions[0];
      if (firstQuestion) {
        setSelectedQuestionId(firstQuestion.question_id);
        if (!visitedQuestions.includes(firstQuestion.question_id)) {
          setVisitedQuestions([...visitedQuestions, firstQuestion.question_id]);
          setNotAnsweredQuestions([firstQuestion.question_id]);
        }
      }
    }
  };


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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/QuizPage/UG_QuestionOptions/${decryptedParam1}/${decryptedParam2}`
        );
        const data = response.data;

        if (data.subjects.length > 0) {
          setSelectedSubjectId(data.subjects[0].subjectId);
          if (data.subjects[0].sections.length > 0) {
            setSelectedSectionId(data.subjects[0].sections[0].sectionId);
            setSelectedQuestionId(
              data.subjects[0].sections[0].questions[0].question_id
            );
          } else {
            setSelectedQuestionId(data.subjects[0].questions[0].question_id);
          }
        }

        setTestData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [decryptedParam1, decryptedParam2]);

  const handleSubjectClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
    const selectedSubject = testData.subjects.find(
      (subject) => subject.subjectId === subjectId
    );
    if (selectedSubject.sections.length > 0) {
      setSelectedSectionId(selectedSubject.sections[0].sectionId);
      setSelectedQuestionId(
        selectedSubject.sections[0].questions[0].question_id
      );
    } else {
      setSelectedSectionId(null);
      setSelectedQuestionId(selectedSubject.questions[0].question_id);
    }
  };

  // const handleSectionClick = (sectionId) => {
  //   setSelectedSectionId(sectionId);
  //   const selectedSection = testData.subjects
  //     .find((subject) => subject.subjectId === selectedSubjectId)
  //     .sections.find((section) => section.sectionId === sectionId);
  //   setSelectedQuestionId(selectedSection.questions[0].question_id);
  // };

  const handleQuestionClick = (questionId) => {
    // Set the active and selected question IDs
    setActiveQuestionId(questionId);
    setSelectedQuestionId(questionId);

    // Mark the question as visited
    if (!visitedQuestions.includes(questionId)) {
      setVisitedQuestions([...visitedQuestions, questionId]);
    }

    // Ensure the question shows as not answered
    if (!answeredQuestions.includes(questionId)) {
      setNotAnsweredQuestions((prev) => [...prev, questionId]);
    }
  };

  const handleRadioChange = (questionId, optionId, optionIndex) => {
    setRadioResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: { optionId, optionIndex },
    }));
  };

  const handleCheckboxChange = (
    questionId,
    optionId,
    isChecked,
    optionIndex
  ) => {
    setCheckboxResponses((prevResponses) => {
      const currentOptions = prevResponses[questionId] || [];
      const updatedOptions = isChecked
        ? [...currentOptions, { optionId, optionIndex }]
        : currentOptions.filter((option) => option.optionId !== optionId);

      return {
        ...prevResponses,
        [questionId]: updatedOptions,
      };
    });
  };
  const handleTextChange = (questionId, value) => {
    setTextResponses({
      ...textResponses,
      [questionId]: value,
    });
  };
  const handleKeypadClick = (value) => {
    if (selectedQuestionId !== null) {
      const currentValue = textResponses[selectedQuestionId] || "";
      const updatedValue = value === "Clear" ? "" : currentValue + value;
      handleTextChange(selectedQuestionId, updatedValue);
    }
  };
  const handleSubmit = () => {
    const allQuestions = testData.subjects.flatMap((subject) =>
      subject.sections.flatMap((section) => section.questions)
    );
    const allAnswered = allQuestions.every((question) => {
      if (
        question.quesion_type.some((type) =>
          [1, 2, 7, 8].includes(type.quesionTypeId)
        )
      ) {
        return radioResponses[question.question_id] !== undefined;
      }
      if (
        question.quesion_type.some((type) =>
          [3, 4].includes(type.quesionTypeId)
        )
      ) {
        return (checkboxResponses[question.question_id] || []).length > 0;
      }
      if (
        question.quesion_type.some((type) =>
          [5, 6].includes(type.quesionTypeId)
        )
      ) {
        return textResponses[question.question_id] !== undefined;
      }
      return false;
    });

    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Submit logic here (e.g., POST request)
    alert("Quiz submitted successfully!");
  };

  const handleClearResponse = async () => {
    // Ensure the current question is selected
    if (selectedQuestionId) {
      // Define allQuestions from testData
      const allQuestions = testData.subjects.flatMap((subject) =>
        subject.sections.flatMap((section) => section.questions)
      );

      // Find the question based on selectedQuestionId
      const question = allQuestions.find(
        (q) => q.question_id === selectedQuestionId
      );

      if (question) {
        // Clear the response based on question type
        if (
          question.quesion_type.some((type) =>
            [1, 2, 7, 8].includes(type.quesionTypeId)
          )
        ) {
          // Clear radio responses
          setRadioResponses((prev) => ({
            ...prev,
            [selectedQuestionId]: undefined,
          }));
        } else if (
          question.quesion_type.some((type) =>
            [3, 4].includes(type.quesionTypeId)
          )
        ) {
          // Clear checkbox responses
          setCheckboxResponses((prev) => ({
            ...prev,
            [selectedQuestionId]: [],
          }));
        } else if (
          question.quesion_type.some((type) =>
            [5, 6].includes(type.quesionTypeId)
          )
        ) {
          // Clear text responses
          setTextResponses((prev) => ({
            ...prev,
            [selectedQuestionId]: undefined,
          }));
        }

        // Update states to reflect the cleared response
        setAnsweredQuestions((prev) =>
          prev.filter((id) => id !== selectedQuestionId)
        );
        setMarkedForReviewQuestions((prev) =>
          prev.filter((id) => id !== selectedQuestionId)
        );

        // If the question was marked for review, ensure it shows as orange
        setNotAnsweredQuestions((prev) => [...prev, selectedQuestionId]);

        // Clear the response from the database
        try {
          const response = await axios.put(
            `http://localhost:5001/QuizPage/clearResponse/${decryptedParam2}/${decryptedParam1}/${selectedQuestionId}`
          );

          if (response.status === 200) {
            console.log("Response cleared successfully");
            // Additional actions can be performed if needed
          } else {
            console.error("Failed to clear response:", response.data);
          }
        } catch (error) {
          console.error("Error clearing response from the database:", error);
        }
      }
    }
  };

  if (!testData) {
    return <div>Loading...</div>;
  }

  const selectedSubject = testData.subjects.find(
    (subject) => subject.subjectId === selectedSubjectId
  );
  const selectedSection = selectedSubject?.sections.find(
    (section) => section.sectionId === selectedSectionId
  );
  const selectedQuestion = selectedSection
    ? selectedSection.questions.find(
        (question) => question.question_id === selectedQuestionId
      )
    : selectedSubject.questions.find(
        (question) => question.question_id === selectedQuestionId
      );

  const handlePreviousClick = () => {
    const selectedSubject = testData.subjects.find(
      (subject) => subject.subjectId === selectedSubjectId
    );
    const selectedSection = selectedSubject.sections.find(
      (section) => section.sectionId === selectedSectionId
    );
    const questionIndex = selectedSection.questions.findIndex(
      (question) => question.question_id === selectedQuestionId
    );
    const sectionIndex = selectedSubject.sections.findIndex(
      (section) => section.sectionId === selectedSectionId
    );
    const subjectIndex = testData.subjects.findIndex(
      (subject) => subject.subjectId === selectedSubjectId
    );

    let newQuestionId = null;

    if (questionIndex > 0) {
      newQuestionId = selectedSection.questions[questionIndex - 1].question_id;
    } else if (sectionIndex > 0) {
      const prevSection = selectedSubject.sections[sectionIndex - 1];
      newQuestionId =
        prevSection.questions[prevSection.questions.length - 1].question_id;
      setSelectedSectionId(prevSection.sectionId);
    } else if (subjectIndex > 0) {
      const prevSubject = testData.subjects[subjectIndex - 1];
      const prevSubjectLastSection =
        prevSubject.sections[prevSubject.sections.length - 1];
      newQuestionId =
        prevSubjectLastSection.questions[
          prevSubjectLastSection.questions.length - 1
        ].question_id;
      setSelectedSubjectId(prevSubject.subjectId);
      setSelectedSectionId(prevSubjectLastSection.sectionId);
    }

    if (newQuestionId !== null) {
      setSelectedQuestionId(newQuestionId);
      if (!visitedQuestions.includes(newQuestionId)) {
        setVisitedQuestions((prev) => [...prev, newQuestionId]);
      }
      // Update the question status
      const isNotAnswered = !answeredQuestions.includes(newQuestionId);
      const isMarkedForReview =
        markedForReviewQuestions.includes(newQuestionId);

      if (isMarkedForReview) {
        if (answeredQuestions.includes(newQuestionId)) {
          setNotAnsweredQuestions((prev) =>
            prev.filter((id) => id !== newQuestionId)
          );
        } else {
          setNotAnsweredQuestions((prev) => [...prev, newQuestionId]);
        }
      } else {
        if (isNotAnswered) {
          setNotAnsweredQuestions((prev) => [...prev, newQuestionId]);
        } else {
          setNotAnsweredQuestions((prev) =>
            prev.filter((id) => id !== newQuestionId)
          );
        }
      }
    }
  };

  const handleSaveAndNext = async () => {
    console.log("radioResponses", radioResponses);
    console.log("checkboxResponses", checkboxResponses);
    const allQuestions = testData.subjects.flatMap((subject) =>
      subject.sections.flatMap((section) => section.questions)
    );

    // Determine if the current question is answered
    const isCurrentQuestionAnswered = () => {
      if (selectedQuestionId) {
        const question = allQuestions.find(
          (q) => q.question_id === selectedQuestionId
        );
        if (question) {
          if (
            question.quesion_type.some((type) =>
              [1, 2, 7, 8].includes(type.quesionTypeId)
            )
          ) {
            return radioResponses[selectedQuestionId] !== undefined;
          }
          if (
            question.quesion_type.some((type) =>
              [3, 4].includes(type.quesionTypeId)
            )
          ) {
            return (checkboxResponses[selectedQuestionId] || []).length > 0;
          }
          if (
            question.quesion_type.some((type) =>
              [5, 6].includes(type.quesionTypeId)
            )
          ) {
            return textResponses[selectedQuestionId] !== undefined;
          }
        }
      }
      return false;
    };

    const answered = isCurrentQuestionAnswered();

    if (answered) {
      setAnsweredQuestions((prev) => [...prev, selectedQuestionId]);
      setNotAnsweredQuestions((prev) =>
        prev.filter((id) => id !== selectedQuestionId)
      );
    } else {
      setNotAnsweredQuestions((prev) => {
        if (!prev.includes(selectedQuestionId)) {
          return [...prev, selectedQuestionId];
        }
        return prev;
      });
    }

    const selectedOption1 = radioResponses[selectedQuestionId];
    const selectedOption2 = checkboxResponses[selectedQuestionId];

    // Extract optionIndex values
    const optionIndexes1 = selectedOption1 ? [selectedOption1.optionIndex] : [];
    const optionIndexes2 = selectedOption2
      ? selectedOption2.map((item) => item.optionIndex)
      : [];

    console.log("optionIndexes1", optionIndexes1);
    console.log("optionIndexes2", optionIndexes2);

    // Convert option indexes to characters
    const optionIndexes1CharCodes = optionIndexes1.map((index) => {
      return String.fromCharCode("a".charCodeAt(0) + index);
    });

    const optionIndexes2CharCodes = optionIndexes2.map((index) => {
      return String.fromCharCode("a".charCodeAt(0) + index);
    });

    console.log("optionIndexes1CharCodes", optionIndexes1CharCodes);
    console.log("optionIndexes2CharCodes", optionIndexes2CharCodes);

    const response = {
      userId: decryptedParam2, // Ensure userId is defined
      questionId: selectedQuestionId,
      testCreationTableId: decryptedParam1, // Ensure testCreationTableId is defined
      subjectId: selectedSubjectId,
      sectionId: selectedSectionId,
      [selectedQuestionId]: {
        optionIndexes1: selectedOption1 ? selectedOption1.optionId : "", // Radio input: single value (if needed)
        optionIndexes2: (checkboxResponses[selectedQuestionId] || [])
          .map((item) => item.optionId)
          .join(","), // Checkbox input: comma-separated string
        optionIndexes1CharCodes: optionIndexes1CharCodes,
        optionIndexes2CharCodes: optionIndexes2CharCodes,
        calculatorInputValue: textResponses[selectedQuestionId] || "", // Text input value
      },
    };

    console.log("response saving:", response);
    try {
      await fetch(`${BASE_URL}/QuizPage/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });
    } catch (error) {
      console.error("Error saving response:", error);
    }

    let nextQuestionId = null;
    const selectedSubject = testData.subjects.find(
      (subject) => subject.subjectId === selectedSubjectId
    );
    const selectedSection = selectedSubject.sections.find(
      (section) => section.sectionId === selectedSectionId
    );
    const questionIndex = selectedSection.questions.findIndex(
      (question) => question.question_id === selectedQuestionId
    );
    const sectionIndex = selectedSubject.sections.findIndex(
      (section) => section.sectionId === selectedSectionId
    );
    const subjectIndex = testData.subjects.findIndex(
      (subject) => subject.subjectId === selectedSubjectId
    );

    if (questionIndex < selectedSection.questions.length - 1) {
      nextQuestionId = selectedSection.questions[questionIndex + 1].question_id;
    } else if (sectionIndex < selectedSubject.sections.length - 1) {
      const nextSection = selectedSubject.sections[sectionIndex + 1];
      nextQuestionId = nextSection.questions[0].question_id;
      setSelectedSectionId(nextSection.sectionId);
    } else if (subjectIndex < testData.subjects.length - 1) {
      const nextSubject = testData.subjects[subjectIndex + 1];
      setSelectedSubjectId(nextSubject.subjectId);
      const nextSection = nextSubject.sections[0];
      nextQuestionId = nextSection.questions[0].question_id;
      setSelectedSectionId(nextSection.sectionId);
    } else {
      alert("No more questions.");
      return;
    }

    if (nextQuestionId) {
      setSelectedQuestionId(nextQuestionId);
      setVisitedQuestions((prev) => {
        if (!prev.includes(nextQuestionId)) {
          return [...prev, nextQuestionId];
        }
        return prev;
      });

      // Handle the case where the next question is not visited, not answered, and not marked for review
      setNotAnsweredQuestions((prev) => {
        if (
          !prev.includes(nextQuestionId) &&
          !answeredQuestions.includes(nextQuestionId) &&
          !markedForReviewQuestions.includes(nextQuestionId)
        ) {
          return [...prev, nextQuestionId];
        }
        return prev;
      });
    }
  };

  const handleMarkForReview = () => {
    const allQuestions = testData.subjects.flatMap((subject) =>
      subject.sections.flatMap((section) => section.questions)
    );

    // Determine if the current question is answered
    const isCurrentQuestionAnswered = () => {
      if (selectedQuestionId) {
        const question = allQuestions.find(
          (q) => q.question_id === selectedQuestionId
        );
        if (question) {
          if (
            question.quesion_type.some((type) =>
              [1, 2, 7, 8].includes(type.quesionTypeId)
            )
          ) {
            return radioResponses[selectedQuestionId] !== undefined;
          }
          if (
            question.quesion_type.some((type) =>
              [3, 4].includes(type.quesionTypeId)
            )
          ) {
            return (checkboxResponses[selectedQuestionId] || []).length > 0;
          }
          if (
            question.quesion_type.some((type) =>
              [5, 6].includes(type.quesionTypeId)
            )
          ) {
            return textResponses[selectedQuestionId] !== undefined;
          }
        }
      }
      return false;
    };

    const answered = isCurrentQuestionAnswered();

    // Mark the current question for review
    setMarkedForReviewQuestions((prev) => [...prev, selectedQuestionId]);

    if (answered) {
      setAnsweredQuestions((prev) => [...prev, selectedQuestionId]);
      setNotAnsweredQuestions((prev) =>
        prev.filter((id) => id !== selectedQuestionId)
      );
    } else {
      setNotAnsweredQuestions((prev) => [...prev, selectedQuestionId]);
    }

    // Handle moving to the next question
    let nextQuestionId = null;
    const selectedSubject = testData.subjects.find(
      (subject) => subject.subjectId === selectedSubjectId
    );
    const selectedSection = selectedSubject.sections.find(
      (section) => section.sectionId === selectedSectionId
    );
    const questionIndex = selectedSection.questions.findIndex(
      (question) => question.question_id === selectedQuestionId
    );
    const sectionIndex = selectedSubject.sections.findIndex(
      (section) => section.sectionId === selectedSectionId
    );
    const subjectIndex = testData.subjects.findIndex(
      (subject) => subject.subjectId === selectedSubjectId
    );

    if (questionIndex < selectedSection.questions.length - 1) {
      nextQuestionId = selectedSection.questions[questionIndex + 1].question_id;
    } else if (sectionIndex < selectedSubject.sections.length - 1) {
      const nextSection = selectedSubject.sections[sectionIndex + 1];
      nextQuestionId = nextSection.questions[0].question_id;
      setSelectedSectionId(nextSection.sectionId);
    } else if (subjectIndex < testData.subjects.length - 1) {
      const nextSubject = testData.subjects[subjectIndex + 1];
      setSelectedSubjectId(nextSubject.subjectId);
      const nextSection = nextSubject.sections[0];
      nextQuestionId = nextSection.questions[0].question_id;
      setSelectedSectionId(nextSection.sectionId);
    } else {
      alert("No more questions.");
      return;
    }

    if (nextQuestionId) {
      setSelectedQuestionId(nextQuestionId);
      setVisitedQuestions((prev) => [...prev, nextQuestionId]);

      // Ensure the color reflects the correct state
      setNotAnsweredQuestions((prev) => {
        if (
          !prev.includes(nextQuestionId) &&
          !answeredQuestions.includes(nextQuestionId) &&
          !markedForReviewQuestions.includes(nextQuestionId)
        ) {
          return [...prev, nextQuestionId];
        }
        return prev;
      });
    }
  };

  const currentQuestionIndex = selectedSection
    ? selectedSection.questions.findIndex(
        (q) => q.question_id === selectedQuestionId
      ) + 1
    : null;

  const questions = selectedSection
    ? selectedSection.questions
    : selectedSubject.questions;


// Over all counts
  const visitedCount = visitedQuestions.length;
  const totalQuestions = testData?.subjects.flatMap((subject) =>
    subject.sections.flatMap((section) => section.questions)
  ).length;

  // Calculate Answered and Marked for Review count
  const answeredAndMarkForReviewCount = answeredQuestions.filter((id) =>
    markedForReviewQuestions.includes(id)
  ).length;

  // Calculate counts excluding the Answered and Marked for Review count
  const answeredOnlyCount =
    answeredQuestions.length - answeredAndMarkForReviewCount;
  const markForReviewOnlyCount =
    markedForReviewQuestions.length - answeredAndMarkForReviewCount;

  // Calculate Not Answered but Visited count
  const notAnsweredButVisitedCount = visitedQuestions.filter(
    (id) =>
      !answeredQuestions.includes(id) && !markedForReviewQuestions.includes(id)
  ).length;

  const notVisitedCount = totalQuestions - visitedQuestions.length;


  //subject wise and section wise counts
  const getCountsBySubjectAndSection = (subjects) => {
    // Initialize objects to hold counts
    const subjectCounts = {};
    const sectionCounts = {};
  
    // Iterate through subjects and their sections
    subjects.forEach(subject => {
      subjectCounts[subject.subjectId] = {
        totalQuestions: subject.sections.flatMap(section => section.questions).length,
        answeredQuestions: answeredQuestions.filter(id =>
          subject.sections.flatMap(section => section.questions.map(question => question.question_id)).includes(id)
        ).length,
        markedForReviewQuestions: markedForReviewQuestions.filter(id =>
          subject.sections.flatMap(section => section.questions.map(question => question.question_id)).includes(id)
        ).length,
        notAnsweredButVisited: visitedQuestions.filter(id =>
          !answeredQuestions.includes(id) &&
          !markedForReviewQuestions.includes(id) &&
          subject.sections.flatMap(section => section.questions.map(question => question.question_id)).includes(id)
        ).length,
        notVisited: subject.sections.flatMap(section => section.questions).length - visitedQuestions.filter(id =>
          subject.sections.flatMap(section => section.questions.map(question => question.question_id)).includes(id)
        ).length,
      };
  
      subject.sections.forEach(section => {
        sectionCounts[section.sectionId] = {
          totalQuestions: section.questions.length,
          answeredQuestions: answeredQuestions.filter(id =>
            section.questions.map(question => question.question_id).includes(id)
          ).length,
          markedForReviewQuestions: markedForReviewQuestions.filter(id =>
            section.questions.map(question => question.question_id).includes(id)
          ).length,
          notAnsweredButVisited: visitedQuestions.filter(id =>
            !answeredQuestions.includes(id) &&
            !markedForReviewQuestions.includes(id) &&
            section.questions.map(question => question.question_id).includes(id)
          ).length,
          notVisited: section.questions.length - visitedQuestions.filter(id =>
            section.questions.map(question => question.question_id).includes(id)
          ).length,
        };
      });
    });
  
    return { subjectCounts, sectionCounts };
  };
  
  const { subjectCounts, sectionCounts } = getCountsBySubjectAndSection(testData?.subjects || []);
  


  return (
    <div>
      <div>
        {testData.subjects.map((subject) => (
          <button
            key={subject.subjectId}
            onClick={() => handleSubjectClick(subject.subjectId)}
            className={`sidebar-button ${
              subject.subjectId === selectedSubjectId ? "active" : ""
            }`}
          >
            {subject.SubjectName}
          </button>
        ))}
      </div>
      {selectedSubjectId && (
        <div>
          {testData.subjects
            .find((subject) => subject.subjectId === selectedSubjectId)
            .sections.map((section) => (
              <button
                key={section.sectionId}
                onClick={() => handleSectionClick(section.sectionId)}
                // className={
                //   selectedSectionId === section.sectionId ? "selected" : ""
                // }
                className={`sidebar-button ${
                  section.sectionId === selectedSectionId ? "active" : ""
                }`}
              >
                {section.SectionName}
              </button>
            ))}
        </div>
      )}
      {selectedQuestion && (
        <div>
          <div>
            Question:{currentQuestionIndex}
            <img
              src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${selectedQuestion.questionImgName}`}
              alt={`Question ${selectedQuestion.question_id}`}
            />
          </div>
          {selectedQuestion.quesion_type.some((type) =>
            [1, 2, 7, 8].includes(type.quesionTypeId)
          ) && (
            <div className="options">
              {selectedQuestion.options.map((option, optionIndex) => (
                <div key={option.option_id}>
                  <input
                    type="radio"
                    name={`question_${selectedQuestion.question_id}`}
                    value={option.option_id}
                    // checked={
                    //   radioResponses[selectedQuestion.question_id] ===
                    //   option.option_id
                    // }
                    checked={
                      radioResponses[selectedQuestion.question_id]?.optionId ===
                      option.option_id
                    }
                    onChange={() =>
                      handleRadioChange(
                        selectedQuestion.question_id,
                        option.option_id,
                        optionIndex
                      )
                    }
                  />
                  ({String.fromCharCode("a".charCodeAt(0) + optionIndex)}
                  )
                  <img
                    src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${option.optionImgName}`}
                    alt={`Option ${option.option_index}`}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedQuestion.quesion_type.some((type) =>
            [3, 4].includes(type.quesionTypeId)
          ) && (
            <div className="options">
              {selectedQuestion.options.map((option, optionIndex) => (
                <div key={option.option_id}>
                  <input
                    type="checkbox"
                    name={`question_${selectedQuestion.question_id}`}
                    value={option.option_id}
                    checked={checkboxResponses[
                      selectedQuestion.question_id
                    ]?.some((resp) => resp.optionId === option.option_id)}
                    onChange={(e) =>
                      handleCheckboxChange(
                        selectedQuestion.question_id,
                        option.option_id,
                        e.target.checked,
                        optionIndex
                      )
                    }
                  />
                  ({String.fromCharCode("a".charCodeAt(0) + optionIndex)}
                  )
                  <img
                    src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${option.optionImgName}`}
                    alt={`Option ${option.option_index}`}
                  />
                </div>
              ))}
            </div>
          )}

          {selectedQuestion.quesion_type.some((type) =>
            [5].includes(type.quesionTypeId)
          ) && (
            <>
              <input
                type="number"
                value={textResponses[selectedQuestion.question_id] || ""}
                onChange={(e) =>
                  handleTextChange(selectedQuestion.question_id, e.target.value)
                }
                // onClick={() => handleClickInput(selectedQuestion.question_id)}
              />
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0",
                "Clear",
              ].map((key) => (
                <button key={key} onClick={() => handleKeypadClick(key)}>
                  {key}
                </button>
              ))}
            </>
          )}
            {selectedQuestion.quesion_type.some((type) =>
            [6].includes(type.quesionTypeId)
          ) && (
            <>
              <input
                type="number"
                value={textResponses[selectedQuestion.question_id] || ""}
                onChange={(e) =>
                  handleTextChange(selectedQuestion.question_id, e.target.value)
                }
                // onClick={() => handleClickInput(selectedQuestion.question_id)}
              />
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0",
                ".",
                "Clear",
              ].map((key) => (
                <button key={key} onClick={() => handleKeypadClick(key)}>
                  {key}
                </button>
              ))}
            </>
          )}
        </div>
      )}
      <div>
        {questions.map((question, index) => {
          let buttonClass = "question_button";

          const isAnswered = answeredQuestions.includes(question.question_id);
          const isNotAnswered = notAnsweredQuestions.includes(
            question.question_id
          );
          const isMarkedForReview = markedForReviewQuestions.includes(
            question.question_id
          );
          const isVisited = visitedQuestions.includes(question.question_id) ;
          const isActive = selectedQuestionId === question.question_id;
          // Single if-else statement to determine the button class
          if (isMarkedForReview) {
            buttonClass += isAnswered ? " purpleBox" : " blueBox"; // Marked for review
          }
          if (isAnswered) {
            buttonClass += " answered"; // Answered question
          } else if (isNotAnswered) {
            buttonClass += " notAnswered"; // Visited but not answered
          } else if (isVisited) {
            buttonClass += " visited"; // Visited but not interacted with
          } else {
            buttonClass += " question_button"; // Not visited question
          }
          if (isActive) {
            buttonClass += " orangeBox"; // Active question, first-time visit
          }
          return (
            <button
              key={question.question_id}
              className={buttonClass}
              onClick={() => handleQuestionClick(question.question_id)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <button onClick={handlePreviousClick}>Previous</button>
      <button onClick={handleSaveAndNext}>Save and Next</button>
      <button onClick={handleMarkForReview}>Mark for Review</button>
      <button onClick={handleClearResponse}>Clear Response</button>
      <button onClick={handleSubmit}>Submit</button>
      <div className="counts">
        <h3>Over all Counts</h3>
        <p>Total Questions: {totalQuestions}</p>
        <p>Visited: {visitedCount}</p>
        <p>Not Visited: {totalQuestions - visitedQuestions.length}</p>
        <p>Answered: {answeredOnlyCount}</p>
        <p>Not Answered: {notAnsweredButVisitedCount}</p>
        <p>Marked for Review: {markForReviewOnlyCount}</p>
        <p>Answered and Marked for Review: {answeredAndMarkForReviewCount}</p>
      </div>
       <div>
    <h2>Subject-wise Counts</h2>
    {testData?.subjects.map(subject => (
      <div key={subject.subjectId}>
        <h3>{subject.SubjectName}</h3>
        <p>Total Questions: {subjectCounts[subject.subjectId]?.totalQuestions}</p>
        <p>Answered: {subjectCounts[subject.subjectId]?.answeredQuestions}</p>
        <p>Marked for Review: {subjectCounts[subject.subjectId]?.markedForReviewQuestions}</p>
        <p>Not Answered but Visited: {subjectCounts[subject.subjectId]?.notAnsweredButVisited}</p>
        <p>Not Visited: {subjectCounts[subject.subjectId]?.notVisited}</p>
      </div>
    ))}

    <h2>Section-wise Counts</h2>
    {testData?.subjects.flatMap(subject => subject.sections).map(section => (
      <div key={section.sectionId}>
        <h3>{section.SectionName}</h3>
        <p>Total Questions: {sectionCounts[section.sectionId]?.totalQuestions}</p>
        <p>Answered: {sectionCounts[section.sectionId]?.answeredQuestions}</p>
        <p>Marked for Review: {sectionCounts[section.sectionId]?.markedForReviewQuestions}</p>
        <p>Not Answered but Visited: {sectionCounts[section.sectionId]?.notAnsweredButVisited}</p>
        <p>Not Visited: {sectionCounts[section.sectionId]?.notVisited}</p>
      </div>
    ))}
  </div>
    </div>
  );
};

export default UG_OTSQuizPage;
