

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonsFunctionality from "./ButtonsFunctionality";
import Tooltip from "@mui/material/Tooltip";
// import "./styles/Paper.css";
// import logo from "../egate logo 1.png";
import { MdOutlineTimer } from "react-icons/md";
import { useRef } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import BASE_URL from "../../../apiConfig";
// import { decryptData } from '../utils/crypto';
import { decryptData, encryptData } from "../utils/crypto";
import "./styles/Watermark.css";
const QuizPage = () => {
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

  console.log("helloooooo shichann");
  console.log("decryptedParam1", decryptedParam1);
  console.log("decryptedParam2", decryptedParam2);

  
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  //mouseclick disabling
  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  //keyboard disabling
  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault(); // Prevent default keyboard action
      event.stopPropagation(); // Stop event propagation
      // Optionally, you can add custom logic here to handle keydown events.
    };

    // Attach event listener to intercept keydown events
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  // useEffect(() => {
  //   const enterFullscreen = () => {
  //     try {
  //       const element = document.documentElement;
  //       if (element.requestFullscreen) {
  //         element.requestFullscreen();
  //       } else if (element.webkitRequestFullscreen) {
  //         element.webkitRequestFullscreen();
  //       } else if (element.msRequestFullscreen) {
  //         element.msRequestFullscreen();
  //       }
  //     } catch (error) {
  //       console.error('Failed to enter fullscreen:', error.message);
  //       // Handle error (e.g., inform the user, provide alternative option)
  //     }
  //   };

  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       console.log("Page is now hidden");
  //       alert("Malpractice attempted");
  //       window.close();
  //     } else {
  //       console.log("Page is now visible");
  //     }
  //   };

  //   // Add event listeners on component mount
  //   document.addEventListener('visibilitychange', handleVisibilityChange);

  //   // Attempt to enter fullscreen on component mount
  //   enterFullscreen();

  //   // Clean up by removing event listeners on component unmount
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, []);

  // const quizRef = useRef(null);

  //   // Function to attempt entering fullscreen
  //   const enterFullscreen = () => {
  //       const element = quizRef.current;
  //       if (element.requestFullscreen) {
  //           element.requestFullscreen();
  //       } else if (element.mozRequestFullScreen) { // Firefox
  //           element.mozRequestFullScreen();
  //       } else if (element.webkitRequestFullscreen) { // Chrome, Safari & Opera
  //           element.webkitRequestFullscreen();
  //       } else if (element.msRequestFullscreen) { // IE/Edge
  //           element.msRequestFullscreen();
  //       }
  //   };

  //   // Handle visibility change
  //   const handleVisibilityChange = () => {
  //       if (document.hidden) {
  //           console.log("Page is now hidden");
  //           alert("malpractice attempted");
  //           window.close();
  //       } else {
  //           console.log("Page is now visible");
  //       }
  //   };

  //   useEffect(() => {
  //       // Check if Page Visibility API is supported
  //       if ('hidden' in document) {
  //           document.addEventListener('visibilitychange', handleVisibilityChange);
  //       } else {
  //           console.log("Page Visibility API is not supported");
  //       }

  //       // Cleanup event listener on component unmount
  //       return () => {
  //           document.removeEventListener('visibilitychange', handleVisibilityChange);
  //       };
  //   }, []);

  // const quizRef = useRef(null);

  // // Function to attempt entering fullscreen
  // const enterFullscreen = () => {
  //     const element = quizRef.current;
  //     if (element.requestFullscreen) {
  //         element.requestFullscreen();
  //     } else if (element.mozRequestFullScreen) { // Firefox
  //         element.mozRequestFullScreen();
  //     } else if (element.webkitRequestFullscreen) { // Chrome, Safari & Opera
  //         element.webkitRequestFullscreen();
  //     } else if (element.msRequestFullscreen) { // IE/Edge
  //         element.msRequestFullscreen();
  //     }
  // };

  // // Handle visibility change
  // const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //         console.log("Page is now hidden");
  //         alert("You have attempted malpractice.");
  //         navigate('/');
  //     } else {
  //         console.log("Page is now visible");
  //     }
  // };

  // // Handle window close event
  // const handleWindowClose = () => {
  //     alert("You have attempted malpractice.");
  //     navigate('/');
  // };

  // useEffect(() => {
  //     // Check if Page Visibility API is supported
  //     if ('hidden' in document) {
  //         document.addEventListener('visibilitychange', handleVisibilityChange);
  //     } else {
  //         console.log("Page Visibility API is not supported");
  //     }

  //     // Handle window close event
  //     window.addEventListener('beforeunload', handleWindowClose);

  //     // Cleanup event listeners on component unmount
  //     return () => {
  //         document.removeEventListener('visibilitychange', handleVisibilityChange);
  //         window.removeEventListener('beforeunload', handleWindowClose);
  //     };
  // }, [navigate]);

  const [showMalPractisePopup, setShowMalPractisePopup] = useState(false);
  const [showButtonNo, setShowButtonNo] = useState(false);

  const quizRef = useRef(null);

  const enterFullscreen = () => {
    const element = quizRef.current;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log("Page is now hidden");
      setShowMalPractisePopup(true);
    } else {
      console.log("Page is now visible");
    }
  };


  const handleBlur = () => {
    console.log("Window is not focused");
    setShowMalPractisePopup(true);
  };

  const handleFocus = () => {
    console.log("Window is focused");
  };


  // useEffect(() => {
  //   if ("hidden" in document) {
  //     document.addEventListener("visibilitychange", handleVisibilityChange);
  //   } else {
  //     console.log("Page Visibility API is not supported");
  //   }

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  const handleBeforeUnload = (event) => {
    const confirmationMessage = "Are you sure you want to leave this page?";
    event.returnValue = confirmationMessage; // For most browsers
    setShowMalPractisePopup(true);
    // setAttemptedToClose(true);
    return confirmationMessage; // For some older browsers
  };
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isMetaPressed, setIsMetaPressed] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Shift") {
      event.preventDefault();
      setIsShiftPressed(true);
    }
    if (event.key === "Meta" || event.key === "Win") {
      event.preventDefault();
      setIsMetaPressed(true);
    }
    if (event.key === "s" && isShiftPressed && isMetaPressed) {
      event.preventDefault();
      window.history.back();
      window.close();
    }

    if (isShiftPressed && isMetaPressed) {
      event.preventDefault();
      setShowMalPractisePopup(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Shift") {
      event.preventDefault();
      setIsShiftPressed(false);
    }
    if (event.key === "Meta" || event.key === "Win") {
      event.preventDefault();
      setIsMetaPressed(false);
    }
  };

  useEffect(() => {
    if ("hidden" in document) {
      document.addEventListener("visibilitychange", handleVisibilityChange);

      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);


      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
    } else {
      console.log("Page Visibility API is not supported");
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);

      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isShiftPressed, isMetaPressed]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  const handleMalPractiseSubmit = async () => {
    console.log("Handling malpractice submit");
    try {
      // window.alert(
      //   "Your Test has been Submitted!! Click Ok to See Result.",
      //   calculateResult()
      // );
      setShowButtonNo(false);
      setShowExamSumary(true);
      setShowMalPractisePopup(false);
      calculateResult();
      const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
      const counts = calculateQuestionCounts();
      setAnsweredCount(counts.answered);
      setNotAnsweredCount(counts.notAnswered);
      setMarkedForReviewCount(counts.markedForReview);
      setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
      setVisitedCount(counts.VisitedCount);

      // Assuming you have these variables in your component's state
      const currentQuestion = questionData.questions[currentQuestionIndex];
      const questionId = currentQuestion.question_id;

      // Format time
      const formattedTime = WformatTime(wtimer);
      const response = await fetch(`${BASE_URL}/QuizPage/saveExamSummary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: decryptedParam2,
          totalUnattempted: notAnsweredCount,
          totalAnswered: answeredCount,
          NotVisitedb: NotVisitedb,
          testCreationTableId: decryptedParam1,
        }),
      });
      const result = await response.json();
      console.log("Exam summary saved:", result);
      try {
        // Make a POST request to your server to submit time left
        const response = await fetch(`${BASE_URL}/QuizPage/submitTimeLeft`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: decryptedParam2,
            testCreationTableId: decryptedParam1,
            timeLeft: formattedTime,
          }),
        });

        const result = await response.json();

        console.log("Time left submission result:", result);
      } catch (error) {
        console.error("Error submitting time left:", error);
      } finally {
        // Ensure that the questionId is correctly obtained
        if (questionId) {
          // Clear local storage data for the current question
          try {
            console.log(
              "Removing from local storage for questionId:",
              questionId
            );
            localStorage.removeItem(`calculatorValue_${questionId}`);
            console.log("Item removed successfully.");
          } catch (error) {
            console.error("Error removing item from local storage:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  // const [showMalPractisePopup, setShowMalPractisePopup] = useState(false);
  // const quizRef = useRef(null);

  // const enterFullscreen = () => {
  //   const element = quizRef.current;
  //   if (element.requestFullscreen) {
  //     element.requestFullscreen();
  //   } else if (element.mozRequestFullScreen) {
  //     element.mozRequestFullScreen();
  //   } else if (element.webkitRequestFullscreen) {
  //     element.webkitRequestFullscreen();
  //   } else if (element.msRequestFullscreen) {
  //     element.msRequestFullscreen();
  //   }
  // };

  // const handleVisibilityChange = () => {
  //   if (document.hidden) {
  //     console.log("Page is now hidden");
  //     setShowMalPractisePopup(true);
  //   } else {
  //     console.log("Page is now visible");
  //   }
  // };

  // useEffect(() => {
  //   if ("hidden" in document) {
  //     document.addEventListener("visibilitychange", handleVisibilityChange);
  //   } else {
  //     console.log("Page Visibility API is not supported");
  //   }

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // const handleMalPractiseSubmit = async () => {
  //   console.log("Handling malpractice submit");

  //   try {
  //     // Perform necessary operations
  //     await calculateResult(); // Assuming this is an async function
  //     const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
  //     const counts = calculateQuestionCounts();
  //     setAnsweredCount(counts.answered);
  //     setNotAnsweredCount(counts.notAnswered);
  //     setMarkedForReviewCount(counts.markedForReview);
  //     setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
  //     setVisitedCount(counts.VisitedCount);

  //     const currentQuestion = questionData.questions[currentQuestionIndex];
  //     const questionId = currentQuestion.question_id;

  //     const formattedTime = WformatTime(wtimer);
  //     const response = await fetch(`${BASE_URL}/QuizPage/saveExamSummary`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: decryptedParam2,
  //         totalUnattempted: notAnsweredCount,
  //         totalAnswered: answeredCount,
  //         NotVisitedb: NotVisitedb,
  //         testCreationTableId: decryptedParam1,
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log("Exam summary saved:", result);

  //     const timeResponse = await fetch(`${BASE_URL}/QuizPage/submitTimeLeft`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: decryptedParam2,
  //         testCreationTableId: decryptedParam1,
  //         timeLeft: formattedTime,
  //       }),
  //     });
  //     const timeResult = await timeResponse.json();
  //     console.log("Time left submission result:", timeResult);

  //     if (questionId) {
  //       localStorage.removeItem(`calculatorValue_${questionId}`);
  //       console.log("Item removed successfully.");
  //     }

  //     const userId = decryptedParam2;
  //     const courseCreationId = testDetails?.[0]?.courseCreationId;

  //     const postData = {
  //       userId: decryptedParam2,
  //       courseCreationId: courseCreationId,
  //       testCreationTableId: decryptedParam1,
  //       test_status: "Completed",
  //     };

  //     const statusResponse = await fetch(
  //       `${BASE_URL}/QuizPage/insertTestAttemptStatus`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(postData),
  //       }
  //     );

  //     if (!statusResponse.ok) {
  //       throw new Error("Failed to insert test attempt status");
  //     }

  //     console.log("Test attempt status inserted successfully");
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error);
  //   }

  //   console.log("Navigating to /student_dashboard");
  //   // navigate('/student_dashboard');
  // };

  // const [showMalPractisePopup, setShowMalPractisePopup] = useState(false);
  // const quizRef = useRef(null);

  // const enterFullscreen = () => {
  //   const element = quizRef.current;
  //   if (element.requestFullscreen) {
  //     element.requestFullscreen();
  //   } else if (element.mozRequestFullScreen) {
  //     element.mozRequestFullScreen();
  //   } else if (element.webkitRequestFullscreen) {
  //     element.webkitRequestFullscreen();
  //   } else if (element.msRequestFullscreen) {
  //     element.msRequestFullscreen();
  //   }
  // };

  // const handleVisibilityChange = () => {
  //   if (document.hidden) {
  //     console.log("Page is now hidden");
  //     setShowMalPractisePopup(true);
  //   } else {
  //     console.log("Page is now visible");
  //   }
  // };

  // useEffect(() => {
  //   if ("hidden" in document) {
  //     document.addEventListener("visibilitychange", handleVisibilityChange);
  //   } else {
  //     console.log("Page Visibility API is not supported");
  //   }

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // const handleMalPractiseSubmit = async () => {
  //   try {
  //     // Perform necessary operations
  //     await calculateResult();
  //     const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
  //     const counts = calculateQuestionCounts();
  //     setAnsweredCount(counts.answered);
  //     setNotAnsweredCount(counts.notAnswered);
  //     setMarkedForReviewCount(counts.markedForReview);
  //     setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
  //     setVisitedCount(counts.VisitedCount);

  //     const currentQuestion = questionData.questions[currentQuestionIndex];
  //     const questionId = currentQuestion.question_id;

  //     const formattedTime = WformatTime(wtimer);
  //     const response = await fetch(`${BASE_URL}/QuizPage/saveExamSummary`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: decryptedParam2,
  //         totalUnattempted: notAnsweredCount,
  //         totalAnswered: answeredCount,
  //         NotVisitedb: NotVisitedb,
  //         testCreationTableId: decryptedParam1,
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log("Exam summary saved:", result);

  //     const timeResponse = await fetch(`${BASE_URL}/QuizPage/submitTimeLeft`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: decryptedParam2,
  //         testCreationTableId: decryptedParam1,
  //         timeLeft: formattedTime,
  //       }),
  //     });
  //     const timeResult = await timeResponse.json();
  //     console.log("Time left submission result:", timeResult);

  //     if (questionId) {
  //       localStorage.removeItem(`calculatorValue_${questionId}`);
  //       console.log("Item removed successfully.");
  //     }

  //     const userId = userData.id;
  //     const courseCreationId = testDetails?.[0]?.courseCreationId;

  //     const postData = {
  //       userId: decryptedParam2,
  //       courseCreationId: courseCreationId,
  //       testCreationTableId: decryptedParam1,
  //       test_status: "Completed",
  //     };

  //     const statusResponse = await fetch(
  //       `${BASE_URL}/QuizPage/insertTestAttemptStatus`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(postData),
  //       }
  //     );

  //     if (!statusResponse.ok) {
  //       throw new Error("Failed to insert test attempt status");
  //     }

  //     console.log("Test attempt status inserted successfully");
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error);
  //   }

  //   navigate('/student_dashboard');
  // };

  // const [showMalPractisePopup, setShowMalPractisePopup] = useState(false);

  // const quizRef = useRef(null);

  // // Function to attempt entering fullscreen
  // const enterFullscreen = () => {
  //   const element = quizRef.current;
  //   if (element.requestFullscreen) {
  //     element.requestFullscreen();
  //   } else if (element.mozRequestFullScreen) {
  //     // Firefox
  //     element.mozRequestFullScreen();
  //   } else if (element.webkitRequestFullscreen) {
  //     // Chrome, Safari & Opera
  //     element.webkitRequestFullscreen();
  //   } else if (element.msRequestFullscreen) {
  //     // IE/Edge
  //     element.msRequestFullscreen();
  //   }
  // };

  // // Handle visibility change
  // const handleVisibilityChange = () => {
  //   if (document.hidden) {
  //     console.log("Page is now hidden");
  //     // alert("You have attempted malpractice.");
  //     setShowMalPractisePopup(true);
  //     window.close(); // Close the window or handle as needed
  //   } else {
  //     console.log("Page is now visible");
  //   }
  // };

  // // Handle window close event
  // const handleWindowClose = (event) => {
  //   event.preventDefault();
  //   alert("You have attempted malpractice.");
  //   // Optionally, perform other actions like navigating away from the page
  //   window.location.href = "http://localhost:3000/student_dashboard";
  // };

  // useEffect(() => {
  //   // Check if Page Visibility API is supported
  //   if ("hidden" in document) {
  //     document.addEventListener("visibilitychange", handleVisibilityChange);
  //   } else {
  //     console.log("Page Visibility API is not supported");
  //   }

  //   // Listen for window close event
  //   window.addEventListener("beforeunload", handleWindowClose);

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     window.removeEventListener("beforeunload", handleWindowClose);
  //   };
  // }, []);

  // const handleMalPractiseSubmit = async () => {
  //   navigate("/student_dashboard");
  //   try {
  //     // window.alert(
  //     //   "Your Test has been Submitted!! Click Ok to See Result.",
  //     //   calculateResult()
  //     // );
  //     // setShowExamSumary(true);
  //     calculateResult();
  //     const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
  //     const counts = calculateQuestionCounts();
  //     setAnsweredCount(counts.answered);
  //     setNotAnsweredCount(counts.notAnswered);
  //     setMarkedForReviewCount(counts.markedForReview);
  //     setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
  //     setVisitedCount(counts.VisitedCount);

  //     // Assuming you have these variables in your component's state
  //     const currentQuestion = questionData.questions[currentQuestionIndex];
  //     const questionId = currentQuestion.question_id;

  //     // Format time
  //     const formattedTime = WformatTime(wtimer);
  //     const response = await fetch(`${BASE_URL}/QuizPage/saveExamSummary`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: decryptedParam2,
  //         totalUnattempted: notAnsweredCount,
  //         totalAnswered: answeredCount,
  //         NotVisitedb: NotVisitedb,
  //         testCreationTableId: decryptedParam1,
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log("Exam summary saved:", result);
  //     try {
  //       // Make a POST request to your server to submit time left
  //       const response = await fetch(`${BASE_URL}/QuizPage/submitTimeLeft`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },

  //         body: JSON.stringify({
  //           userId: decryptedParam2,
  //           testCreationTableId: decryptedParam1,
  //           timeLeft: formattedTime,
  //         }),
  //       });

  //       const result = await response.json();

  //       console.log("Time left submission result:", result);
  //     } catch (error) {
  //       console.error("Error submitting time left:", error);
  //     } finally {
  //       // Ensure that the questionId is correctly obtained
  //       if (questionId) {
  //         // Clear local storage data for the current question
  //         try {
  //           console.log(
  //             "Removing from local storage for questionId:",
  //             questionId
  //           );
  //           localStorage.removeItem(`calculatorValue_${questionId}`);
  //           console.log("Item removed successfully.");
  //         } catch (error) {
  //           console.error("Error removing item from local storage:", error);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error);
  //   }

  //   try {
  //     const userId = userData.id;
  //     const courseCreationId = testDetails?.[0]?.courseCreationId;

  //     // Prepare data for the POST request
  //     const postData = {
  //       userId: decryptedParam2,
  //       courseCreationId: courseCreationId,
  //       testCreationTableId: decryptedParam1,
  //       test_status: "Completed",
  //     };

  //     // Make the POST request
  //     const response = await fetch(
  //       `${BASE_URL}/QuizPage/insertTestAttemptStatus`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(postData),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to insert test attempt status");
  //     }

  //     console.log("Test attempt status inserted successfully");

  //     // Optionally fetch question count if needed
  //     // await fetchQuestionCount();

  //     // Navigate to the test results page or another page as needed
  //     // navigate(`/Submit_Page`);
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //   }
  // };

  // // Handle visibility change
  // const handleVisibilityChange = () => {
  //   if (document.visibilityState === 'hidden')  {
  //     console.log("Page is now hidden");
  //     setShowMalPractisePopup(true); // Show custom popup on page hide
  //   } else {
  //     console.log("Page is now visible");
  //     setShowMalPractisePopup(false); // Hide custom popup on page show
  //   }
  // };

  // useEffect(() => {
  //   // Listen for visibility change
  //   document.addEventListener('visibilitychange', handleVisibilityChange);

  //   // Listen for window close event
  //   window.addEventListener('beforeunload', handleWindowClose);

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //     window.removeEventListener('beforeunload', handleWindowClose);
  //   };
  // }, []);
  // // Handle window close event
  // // const handleWindowClose = (event) => {
  // //   const confirmationMessage = 'Are you sure you want to leave? Your progress may not be saved.';
  // //   event.preventDefault();
  // //   event.returnValue = confirmationMessage;
  // //   return confirmationMessage;
  // // };

  // // Handle popup confirmation
  // const handlePopupConfirm = () => {
  //   setShowMalPractisePopup(false); // Close the popup
  //   window.location.href = 'http://localhost:3000/student_dashboard'; // Redirect to student dashboard
  // };

  // // Handle window close event
  // const handleWindowClose = (event) => {
  //   event.preventDefault();
  //   setShowMalPractisePopup(true); // Show custom popup on window close attempt
  //   // Optionally, perform other actions like navigating away from the page
  //   navigate = '/student_dashboard';
  // };
  // window.addEventListener('beforeunload', handleWindowClose);
  // useEffect(() => {
  //   // Listen for window close event
  //   window.addEventListener('beforeunload', handleWindowClose);

  //   // Check if Page Visibility API is supported
  //   if ('hidden' in document) {
  //     document.addEventListener('visibilitychange', handleVisibilityChange);
  //   } else {
  //     console.log("Page Visibility API is not supported");
  //   }

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //     window.removeEventListener('beforeunload', handleWindowClose);
  //   };
  // }, []);

  // --------------------------------------CONST VARIABLES DECLARATIONS--------------------------
  const [questionData, setQuestionData] = useState({ questions: [] });
  const [value, setValue] = useState("");

  const { subjectId, userId, question_id, user_Id } = useParams();
  const [Subjects, setSubjects] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questionStatus, setQuestionStatus] = useState(
    Array.isArray(questionData)
      ? [
          Array(questionData.questions.length).fill("notAnswered")[0],
          ...Array(questionData.questions.length - 1).fill("notAnswered"),
        ]
      : []
  );

  const [sections, setSections] = useState([]);

  const vl = value;
  // console.log("calculator:", setValue)
  // const navigate = useNavigate();
  const [answeredCount, setAnsweredCount] = useState(0);
  const [notAnsweredCount, setNotAnsweredCount] = useState(0);
  const [answeredmarkedForReviewCount, setAnsweredmarkedForReviewCount] =
    useState(0);
  const [markedForReviewCount, setMarkedForReviewCount] = useState(0);
  const [VisitedCount, setVisitedCount] = useState(0);
  const [NotVisited, setNotVisited] = useState(0);

  const [showExamSumary, setShowExamSumary] = useState(false);

  const [calculatorValue, setCalculatorValue] = useState("");

  const questions = questionData.questions ? questionData.questions.length : 0;
  const remainingQuestions =
    questions -
    VisitedCount -
    notAnsweredCount -
    answeredCount -
    markedForReviewCount -
    answeredmarkedForReviewCount;

  const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;

  const calculateQuestionCounts = () => {
    let answered = 0;
    let notAnswered = 0;
    let markedForReview = 0;
    let answeredmarkedForReviewCount = 0;
    let VisitedCount = 0;
    let NotVisited = 0;
    questionStatus.forEach((status, index) => {
      if (status === "answered") {
        answered++;
      } else if (status === "notAnswered") {
        notAnswered++;
      } else if (status === "marked") {
        markedForReview++;
      } else if (status === "Answered but marked for review") {
        answeredmarkedForReviewCount++;
      } else if (status === "notVisited") {
        VisitedCount++;
      }
    });

    return {
      answered,
      notAnswered,
      markedForReview,
      answeredmarkedForReviewCount,
      VisitedCount,
    };
  };

  const updateCounters = () => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let markedForReview = 0;
    let Visited = 0;

    // If questionStatus is empty, set notAnswered count to 1
    if (questionStatus.length === 0) {
      notAnswered = 1;
    } else {
      // Otherwise, count the occurrences of "notAnswered" status
      questionStatus.forEach((status) => {
        if (status === "answered") {
          answered++;
        } else if (status === "notAnswered") {
          notAnswered++;
        } else if (status === "marked") {
          marked++;
        } else if (status === "Answered but marked for review") {
          markedForReview++;
        } else if (status === "notVisited") {
          Visited++;
        }
      });
    }

    // Update the state with the counts
    setAnsweredCount(answered);
    setNotAnsweredCount(notAnswered);
    setAnsweredmarkedForReviewCount(marked);
    setMarkedForReviewCount(markedForReview);
    setVisitedCount(Visited);
  };

  // const updateCounters = () => {
  //   let answered = 0;
  //   let notAnswered = 0; // Set default value to 1
  //   let marked = 0;
  //   let markedForReview = 0;
  //   let Visited = 0;

  //   questionStatus.forEach((status) => {
  //     if (status === "answered") {
  //       answered++;
  //     } else if (status === "notAnswered") {
  //       notAnswered++;
  //     } else if (status === "marked") {
  //       marked++;
  //     } else if (status === "Answered but marked for review") {
  //       markedForReview++;
  //     } else if (status === "notVisited") {
  //       Visited++;
  //     }
  //   });

  //   // Update notAnswered if there are actual notAnswered questions
  //   if (notAnswered === 1 && answered !== 0) {
  //     notAnswered = 0;
  //   }

  //   setAnsweredCount(answered);
  //   setNotAnsweredCount(notAnswered);
  //   setAnsweredmarkedForReviewCount(marked);
  //   setMarkedForReviewCount(markedForReview);
  //   setVisitedCount(Visited);
  // };

  // const updateCounters = () => {
  //   let answered = 0;
  //   let notAnswered = 1;
  //   let marked = 0;
  //   let markedForReview = 0;
  //   let Visited = 0;

  //   questionStatus.forEach((status) => {
  //     if (status === "answered") {
  //       answered++;
  //     } else if (status === "notAnswered") {
  //       notAnswered++;
  //     } else if (status === "marked") {
  //       marked++;
  //     } else if (status === "Answered but marked for review") {
  //       markedForReview++;
  //     } else if (status === "notVisited") {
  //       Visited++;
  //     }
  //   });

  //   setAnsweredCount(answered);
  //   setNotAnsweredCount(notAnswered);
  //   setAnsweredmarkedForReviewCount(marked);
  //   setMarkedForReviewCount(markedForReview);
  //   setVisitedCount(Visited);
  // };

  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questionData.length).fill("")
  );

  // const handleQuestionSelect = (questionNumber) => {
  //   const updatedQuestionStatus = [...questionStatus];
  //   const updatedIndex = questionNumber - 1; // Calculate the updated index

  //   setCurrentQuestionIndex(updatedIndex); // Update the current question index
  //   updatedQuestionStatus[updatedIndex] = "notAnswered"; // Update the question status at the updated index
  //   setActiveQuestion(updatedIndex); // Set the active question to the updated index
  // };
  const handleQuestionSelect = async (questionNumber) => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptions/${decryptedParam1}/${userData.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData(data);

      const updatedQuestionStatus = [...questionStatus];
      const updatedIndex = questionNumber - 1; // Calculate the updated index

      setCurrentQuestionIndex(updatedIndex); // Update the current question index
      updatedQuestionStatus[updatedIndex] = "notAnswered"; // Update the question status at the updated index
      setActiveQuestion(updatedIndex); // Set the active question to the updated index

      // Extract the useranswer value from the response
      let useranswer = null;

      if (
        data.questions[questionNumber - 1].useranswer &&
        data.questions[questionNumber - 1].useranswer.ans !== null
      ) {
        useranswer = data.questions[questionNumber - 1].useranswer.ans;
      }

      // Check if the question is answered
      let isAnswered = useranswer !== null;

      // If useranswer is null, update isAnswered to false
      if (useranswer === null) {
        isAnswered = false;
      }

      // Log the useranswer value
      // Log the entire response data for debugging
      console.log(`Question ${questionNumber} - Response Data:`, data);
      console.log(`Question ${questionNumber} - User Answer:`, useranswer);
      console.log(`Question ${questionNumber} - Is Answered:`, isAnswered);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };

  const [clickCount, setClickCount] = useState(0);

  const [answeredQuestionsMap, setAnsweredQuestionsMap] = useState({});

  const [selectedAnswersMap1, setSelectedAnswersMap1] = useState({});
  const [selectedAnswersMap2, setSelectedAnswersMap2] = useState({});
  const [selectedAnswersMap3, setSelectedAnswersMap3] = useState({});

  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const calculateResult = () => {};

  const [showPopup, setShowPopup] = useState(false);
  const [score, setScoreCount] = useState({ totalMarks: 0, netMarks: 0 });

  // useEffect(() => {
  //   fetchQuestionCount();
  // }, [testCreationTableId, userData.id]);

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

  const handleYes = async () => {
    // setShowPopup(true);
    // navigate(`/Submit_Page`);
    try {
      const encryptedParam1 = await encryptData(decryptedParam1.toString());
      const encryptedParam2 = await encryptData(decryptedParam2.toString());

      const token = new Date().getTime().toString();
      sessionStorage.setItem("navigationToken", token);
      // to={`/TestResultsPage/${decryptedParam1}/${userData.id}`}
      const url = `/TestResultsPage/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}`;

      navigate(url);
    } catch (error) {
      console.error("Error encrypting data:", error);
    }
    try {
      const userId = decryptedParam2;
      console.log("sddvfnjdxnvjkncmvncx");
      console.log(decryptedParam2);
      const courseCreationId = testDetails?.[0]?.courseCreationId;
      console.log(
        courseCreationId ? courseCreationId : "Course creation ID not available"
      );
      console.log(decryptedParam1);

      // Prepare data for the POST request
      const postData = {
        userId: decryptedParam2,
        courseCreationId: courseCreationId,
        testCreationTableId: decryptedParam1,
        test_status: "Completed",
      };

      // Make the POST request
      const response = await fetch(
        `${BASE_URL}/QuizPage/insertTestAttemptStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to insert test attempt status");
      }
      console.log("Test attempt status inserted successfully");
      await fetchQuestionCount();
      // Navigate to the test results page
      // navigate(`/Submit_Page`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleNo = () => {
    setShowExamSumary(false);
  };

  const [activeQuestion, setActiveQuestion] = useState(0);
  // --------------------------------------END OF CONST VARIABLES DECLARATIONS-----------------------------------

  // ---------------------------------------------TIMER FUNCTION-------------------------------------------
  const [timer, setTimer] = useState(0);
  // const [timers, setTimers] = useState(Array(questionData));
  const [timers, setTimers] = useState(
    Array(questionData.questions.length).fill(0)
  );

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 9 ? hours : "0" + hours}:${
      minutes > 9 ? minutes : "0" + minutes
    }:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`;
  };

  useEffect(() => {
    setTimer(timers[currentQuestionIndex] || 0);
    let interval;
    interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentQuestionIndex, timers]);

  // ------------------------------------------END OF TIMER FUNCTION------------------------
  const [timeLeftAtSubmission, setTimeLeftAtSubmission] = useState(0);

  // -------------------------overall time-------------------------------
  const [wtimer, setWTimer] = useState(0);
  const WformatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 9 ? hours : "0" + hours}:${
      minutes > 9 ? minutes : "0" + minutes
    }:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`;
    // return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    // setWTimer(wtimer);
    let interval;
    interval = setInterval(() => {
      setWTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [wtimer]);

  // main
  const onAnswerSelected1 = (optionIndex) => {
    const questionId = questionData.questions[currentQuestionIndex].question_id;
    const charcodeatopt = String.fromCharCode("a".charCodeAt(0) + optionIndex);

    // console.log("questionId from onAnswerSelected1 : ", questionId);
    const questionIndex = currentQuestionIndex + 1;
    // console.log(`Question Index: ${questionIndex}`);
    // console.log(`Clicked Option Index: ${charcodeatopt}`);
    console.log("Selected option index:", optionIndex);

    const selectedOption =
      questionData.questions[currentQuestionIndex].options[optionIndex];
    // Retrieve the option ID
    const optionId = selectedOption.option_id;

    // Log the selected option index ID and option ID
    console.log("Selected option index:", optionIndex);
    console.log("Selected option ID:", optionId);

    // setSelectedAnswersMap1((prevMap) => ({
    //   ...prevMap,
    //   [questionId]: optionIndex,
    // }));

    setSelectedAnswersMap1((prevMap) => ({
      ...prevMap,
      [currentQuestion.question_id]: optionIndex,
    }));

    // setSelectedAnswersMap1({
    //     ...selectedAnswersMap1,
    //     [currentQuestion.question_id]: optionIndex,
    //   });
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[activeQuestion] = optionIndex;
    setSelectedAnswers(updatedSelectedAnswers);
    // console.log(
    //   "questionId from updatedSelectedAnswers : ",
    //   updatedSelectedAnswers
    // );
  };

  const onAnswerSelected2 = (optionIndex) => {
    const questionId = questionData.questions[currentQuestionIndex].question_id;
    const charcodeatopt = String.fromCharCode("a".charCodeAt(0) + optionIndex);

    // Retrieve the existing selected options for the current question
    const existingSelection = selectedAnswersMap2[questionId] || [];

    // Check if the selected option is already in the existing selection
    const isSelected = existingSelection.includes(optionIndex);

    // Update the selection based on whether the option was already selected or not
    const updatedSelection = isSelected
      ? existingSelection.filter((index) => index !== optionIndex) // Deselect the option if already selected
      : [...existingSelection, optionIndex]; // Select the option if not already selected

    // Update the selected answers map with the updated selection for the current question
    setSelectedAnswersMap2((prevMap) => ({
      ...prevMap,
      [questionId]: updatedSelection,
    }));

    // Update the selected answers array for the active question
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[activeQuestion] = updatedSelection;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const onAnswerSelected3 = (e) => {
    // Call clearResponse with the appropriate clearType for input field
    clearResponse("input");
    const inputValue = e.target.value;
    const parsedValue = parseFloat(inputValue);

    // Set the value state
    setValue(parsedValue);

    if (
      !questionData.questions ||
      !questionData.questions[currentQuestionIndex]
    ) {
      console.error("Invalid question data or index");
      return;
    }

    const currentQuestion = questionData.questions[currentQuestionIndex];
    const questionId = currentQuestion.question_id;

    // Extract the answerNumber from the current question
    const answerNumber = currentQuestion.answerNumber;

    // Update the selected answers map with the answer value
    setSelectedAnswersMap3((prevMap) => ({
      ...prevMap,
      [questionId]: answerNumber,
    }));

    // Directly set the value attribute of the input field
    const inputField = document.getElementById(
      `question-${currentQuestionIndex}`
    );
    if (inputField) {
      inputField.value = answerNumber ? answerNumber.toString() : ""; // Set the value if answerNumber is not null
    }

    console.log("Calculator Value:", parsedValue);
    console.log("Calculator Input Text Box Value:", inputValue);
    console.log("Answer Number:", answerNumber);

    // Update the question status based on the answer
    const updatedQuestionStatus = [...questionStatus];
    updatedQuestionStatus[currentQuestionIndex] = "answered";
    setQuestionStatus(updatedQuestionStatus);
  };

  //end Subjects fetching use effect code

  //users fetching use effect code
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/ughomepage_banner_login/user1`,
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
  //end users fetching use effect code

  //counts use effect code
  useEffect(() => {
    const counts = calculateQuestionCounts();
    setAnsweredCount(counts.answered);
    setNotAnsweredCount(counts.notAnswered);
    setMarkedForReviewCount(counts.markedForReview);
    setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
    setVisitedCount(counts.VisitedCount);
  }, [questionStatus]);

  useEffect(() => {
    // Check if testCreationTableId is defined before making the request
    if (decryptedParam1) {
      fetchData();
    }
  }, [decryptedParam1]);

  const [testName, setTestName] = useState("");
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptions/${decryptedParam1}/${decryptedParam2}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData(data);
      const testName = data.questions[0].TestName;
      setTestName(testName);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };

  const currentQuestion =
    questionData.questions && questionData.questions[currentQuestionIndex];

  const [userData, setUserData] = useState({});
  // user data
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

  const [originalStatuses, setOriginalStatuses] = useState(
    Array(questionData.questions.length).fill("notVisited")
  );

  useEffect(() => {
    // Call the updateCounters function initially when the component mounts
    updateCounters();
  }, [questionStatus]);

  // Reset calculator value when the question changes
  // useEffect(() => {
  //   if (
  //     !questionData.questions ||
  //     !questionData.questions[currentQuestionIndex]
  //   ) {
  //     // Handle the case where questions are not defined
  //     return;
  //   }

  //   const questionId = questionData.questions[currentQuestionIndex].question_id;

  //   // Retrieve the stored value from local storage when the component mounts
  //   const storedValue = localStorage.getItem(`calculatorValue_${questionId}`);
  //   if (storedValue) {
  //     const parsedValue = JSON.parse(storedValue).value;
  //     setValue(parsedValue);
  //     // console.log("Stored Value:", parsedValue);
  //   } else {
  //     setValue(""); // Clear the input if there is no stored value
  //     // console.log("No stored value found.");
  //   }
  // }, [currentQuestionIndex, questionData]);

  useEffect(() => {
    if (
      !questionData.questions ||
      !questionData.questions[currentQuestionIndex]
    ) {
      // Handle the case where questions are not defined
      return;
    }

    // Clear the input since localStorage won't be used
    setValue("");
  }, [currentQuestionIndex, questionData]);

  const [responseCleared, setResponseCleared] = useState(false);
  const currentQuestionTypeId =
    currentQuestion && currentQuestion.quesion_type
      ? currentQuestion.quesion_type.quesionTypeId
      : "";

  //-----------------------------------------------------HANDLE BUTTON FUNCTIONS START--------------------------
  //main working
  const handleSaveNextQuestion = async () => {
    try {
      const updatedQuestionStatus = [...questionStatus];
      const calculatorInputValue = value;

      console.log("Current Question Index:", currentQuestionIndex);
      console.log("Current Question:", currentQuestion);

      const isCurrentQuestionAnswered =
        selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
        (selectedAnswersMap2[currentQuestion.question_id] &&
          selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
        calculatorInputValue !== "";

      console.log("Is Current Question Answered:", isCurrentQuestionAnswered);

      if (!isCurrentQuestionAnswered) {
        window.alert("Please answer the question before proceeding.");
      } else {
        updatedQuestionStatus[currentQuestionIndex] = "answered";
        setQuestionStatus(updatedQuestionStatus);

        setCurrentQuestionIndex((prevIndex) =>
          prevIndex < questionData.questions.length - 1
            ? prevIndex + 1
            : prevIndex
        );

        if (decryptedParam2) {
          const userId = decryptedParam2;
          const subjectId = currentQuestion.subjectId;
          const sectionId = currentQuestion.sectionId;
          const questionId = currentQuestion.question_id.toString();

          const valueObject = {
            testCreationTableId: decryptedParam1,
            value: calculatorInputValue,
            question_id: questionId,
          };

          // Store the calculator value in local storage
          localStorage.setItem(
            `calculatorValue_${questionId}`,
            JSON.stringify(valueObject)
          );

          // Introduce a small delay before retrieving the stored value
          // This ensures that the local storage has enough time to update
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Retrieve the stored calculator value
          const storedValue = localStorage.getItem(
            `calculatorValue_${questionId}`
          );
          const storedCalculatorInputValue = storedValue
            ? JSON.parse(storedValue).value
            : null;
          console.log("hiiiiiiiiiiiiii");
          console.log("currentQuestionTypeId:", currentQuestionTypeId);

          if (calculatorInputValue === storedCalculatorInputValue) {
            const selectedOption1 =
              selectedAnswersMap1[currentQuestion.question_id];

            const selectedOption2 =
              selectedAnswersMap2[currentQuestion.question_id];

            const optionIndexes1 =
              selectedOption1 !== undefined ? [selectedOption1] : [];
            const optionIndexes2 =
              selectedOption2 !== undefined ? selectedOption2 : [];

            const hasAnswered = answeredQuestionsMap[questionId];

            const responses = {
              questionId: questionId,
              hasAnswered: hasAnswered,
              userId: userId,
              testCreationTableId: decryptedParam1,
              subjectId: subjectId,
              sectionId: sectionId,

              [questionId]: {
                optionIndexes1: optionIndexes1.map((index) => {
                  const selectedOption =
                    questionData.questions[currentQuestionIndex].options[index];
                  return selectedOption.option_id;
                }),
                optionIndexes1CharCodes: optionIndexes1.map((index) => {
                  return String.fromCharCode("a".charCodeAt(0) + index);
                }),
                optionIndexes2: optionIndexes2.map((index) => {
                  const selectedOption =
                    questionData.questions[currentQuestionIndex].options[index];
                  return selectedOption.option_id;
                }),
                optionIndexes2CharCodes: optionIndexes2.map((index) => {
                  return String.fromCharCode("a".charCodeAt(0) + index);
                }),
                calculatorInputValue: calculatorInputValue,
              },
            };

            setAnsweredQuestionsMap((prevMap) => ({
              ...prevMap,
              [questionId]: true,
            }));
            // Check if the response is cleared for the current question

            if (hasAnswered) {
              // If the question has been answered before, update the existing response with a PUT request
              console.log(
                "Making API request to update the existing response..."
              );

              const updatedResponse = {
                optionIndexes1: optionIndexes1.map((index) =>
                  String.fromCharCode("a".charCodeAt(0) + index)
                ),
                optionIndexes2: optionIndexes2.map((index) =>
                  String.fromCharCode("a".charCodeAt(0) + index)
                ),
                calculatorInputValue: calculatorInputValue,
              };

              await fetch(`${BASE_URL}/QuizPage/updateResponse/${questionId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  updatedResponse,
                  decryptedParam2,
                  decryptedParam1,
                  subjectId,
                  sectionId,
                }),
              });

              console.log("Handling the response after updating...");
            } else {
              // If the question is being answered for the first time, save a new response with a POST request
              console.log("Making API request to save a new response...");

              await fetch(`${BASE_URL}/QuizPage/response`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(responses),
              });

              console.log("Handling the response after saving...");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error handling next click:", error);
    }
  };

  //working with questiontype id
  // const handleSaveNextQuestion = async () => {
  //   try {

  //     const updatedQuestionStatus = [...questionStatus];
  //     const calculatorInputValue = value;

  //     console.log("Current Question Index:", currentQuestionIndex);
  //     console.log("Current Question:", currentQuestion);

  //     const isCurrentQuestionAnswered =
  //       selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
  //       (selectedAnswersMap2[currentQuestion.question_id] &&
  //         selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
  //       calculatorInputValue !== "";

  //     console.log("Is Current Question Answered:", isCurrentQuestionAnswered);

  //     if (!isCurrentQuestionAnswered) {
  //       window.alert("Please answer the question before proceeding.");
  //     } else {
  //       updatedQuestionStatus[currentQuestionIndex] = "answered";
  //       setQuestionStatus(updatedQuestionStatus);

  //       setCurrentQuestionIndex((prevIndex) =>
  //         prevIndex < questionData.questions.length - 1
  //           ? prevIndex + 1
  //           : prevIndex
  //       );

  //       if (userData.id) {
  //         const userId = userData.id;
  //         const subjectId = currentQuestion.subjectId;
  //         const sectionId = currentQuestion.sectionId;
  //         const questionId = currentQuestion.question_id.toString();

  //         const valueObject = {
  //           testCreationTableId: testCreationTableId,
  //           value: calculatorInputValue,
  //           question_id: questionId,
  //         };

  //         // Store the calculator value in local storage
  //         localStorage.setItem(
  //           `calculatorValue_${questionId}`,
  //           JSON.stringify(valueObject)
  //         );

  //         // Introduce a small delay before retrieving the stored value
  //         // This ensures that the local storage has enough time to update
  //         await new Promise((resolve) => setTimeout(resolve, 100));

  //         // Retrieve the stored calculator value
  //         const storedValue = localStorage.getItem(
  //           `calculatorValue_${questionId}`
  //         );
  //         const storedCalculatorInputValue = storedValue
  //           ? JSON.parse(storedValue).value
  //           : null;
  //           console.log("hiiiiiiiiiiiiii");
  //           console.log("currentQuestionTypeId:",currentQuestionTypeId);

  //         if (calculatorInputValue === storedCalculatorInputValue) {
  //           const selectedOption1 =
  //             selectedAnswersMap1[currentQuestion.question_id];

  //           const selectedOption2 =
  //             selectedAnswersMap2[currentQuestion.question_id];

  //           const optionIndexes1 =
  //             selectedOption1 !== undefined ? [selectedOption1] : [];
  //           const optionIndexes2 =
  //             selectedOption2 !== undefined ? selectedOption2 : [];

  //           const hasAnswered = answeredQuestionsMap[questionId];

  //           const responses = {
  //             questionId: questionId,
  //             hasAnswered: hasAnswered,
  //             userId: userId,
  //             testCreationTableId: testCreationTableId,
  //             subjectId: subjectId,
  //             sectionId: sectionId,
  //             currentQuestionTypeId: currentQuestionTypeId,
  //             [questionId]: {
  //               optionIndexes1: optionIndexes1,
  //               optionIndexes2: optionIndexes2,
  //               optionIndexes1CharCodes: optionIndexes1.map((index) => String.fromCharCode("a".charCodeAt(0) + index)),
  //               optionIndexes2CharCodes: optionIndexes2.map((index) => String.fromCharCode("a".charCodeAt(0) + index)),
  //               calculatorInputValue: calculatorInputValue,
  //             },
  //           };

  //           setAnsweredQuestionsMap((prevMap) => ({
  //             ...prevMap,
  //             [questionId]: true,
  //           }));
  //           // Check if the response is cleared for the current question

  //           if (hasAnswered) {
  //             // If the question has been answered before, update the existing response with a PUT request
  //             console.log(
  //               "Making API request to update the existing response..."
  //             );

  //             const updatedResponse = {
  //               optionIndexes1: optionIndexes1.map((index) =>
  //                 String.fromCharCode("a".charCodeAt(0) + index)
  //               ),
  //               optionIndexes2: optionIndexes2.map((index) =>
  //                 String.fromCharCode("a".charCodeAt(0) + index)
  //               ),
  //               calculatorInputValue: calculatorInputValue,
  //             };

  //             await fetch(
  //               `${BASE_URL}/QuizPage/updateResponse/${questionId}`,
  //               {
  //                 method: "PUT",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify({
  //                   updatedResponse,
  //                   userId,
  //                   testCreationTableId,
  //                   subjectId,
  //                   sectionId,
  //                 }),
  //               }
  //             );

  //             console.log("Handling the response after updating...");
  //           } else {
  //             // If the question is being answered for the first time, save a new response with a POST request
  //             console.log("Making API request to save a new response...");

  //             await fetch(`${BASE_URL}/QuizPage/response`, {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify(responses),
  //             });

  //             console.log("Handling the response after saving...");
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error handling next click:", error);
  //   }
  // };

  const handleNextQuestion = async () => {
    try {
      const currentQuestion = questionData.questions[currentQuestionIndex];

      // Check if the current question is answered
      const calculatorInputValue = value;
      const isCurrentQuestionAnswered =
        selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
        (selectedAnswersMap2[currentQuestion.question_id] &&
          selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
        calculatorInputValue !== "";

      if (!isCurrentQuestionAnswered || isCurrentQuestionAnswered) {
        // If the current question is not answered, update the status
        const updatedQuestionStatus = [...questionStatus];
        updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
        setQuestionStatus(updatedQuestionStatus);
        console.log(currentQuestionIndex);
        console.log(updatedQuestionStatus);

        // You may also show a message or perform other actions to indicate that the question is not answered
        console.log("Question not answered!");
      } else {
        // Log a message indicating that the question is answered
        console.log("Question answered!");
      }

      // Set the next question status to notAnswered
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questionData.questions.length) {
        const updatedQuestionStatus = [...questionStatus];
        if (
          updatedQuestionStatus[nextQuestionIndex] === "answered" ||
          updatedQuestionStatus[nextQuestionIndex] ===
            "Answered but marked for review" ||
          updatedQuestionStatus[nextQuestionIndex] === "marked"
        ) {
          setQuestionStatus(updatedQuestionStatus);
        } else {
          updatedQuestionStatus[nextQuestionIndex] = "notAnswered";
          setQuestionStatus(updatedQuestionStatus);
        }
      }

      // if (isCurrentQuestionAnswered) {
      //   // If the current question is answered, update the status
      //   const updatedQuestionStatus = [...questionStatus];
      //   updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      //   setQuestionStatus(updatedQuestionStatus);
      //   console.log(currentQuestionIndex);
      //   console.log(updatedQuestionStatus);

      //   // You may also show a message or perform other actions to indicate that the question is not answered
      //   console.log("Question not answered!");
      // } else {
      //   // Log a message indicating that the question is answered
      //   console.log("Question answered!");
      // }

      // Move to the next question index
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex < questionData.questions.length - 1
          ? prevIndex + 1
          : prevIndex
      );

      // Fetch the next set of questions
      // const response = await fetch(
      //   `${BASE_URL}/QuizPage/questionOptions/${testCreationTableId}`
      // );
      // const result = await response.json();
      // setQuestionData(result);

      // Fetch user data using the token
      const token = localStorage.getItem("token");
      const response_user = await fetch(
        `${BASE_URL}/ughomepage_banner_login/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to headers for authentication
          },
        }
      );

      if (response_user.ok) {
        const userData = await response_user.json();
        setUserData(userData);

        // Ensure userId is defined
        const userId = decryptedParam2;

        // Log relevant information
        console.log("Test Creation Table ID:", decryptedParam1);
        console.log("Current user_Id:", userId);

        // Ensure questionData is not null or undefined
        if (!questionData || !questionData.questions) {
          console.error("Data or questions are null or undefined");
          return;
        }

        // Extract information for the current question
        const currentQuestion = questionData.questions[currentQuestionIndex];
        const selectedOption1 =
          selectedAnswersMap1[currentQuestion.question_id];
        const selectedOption2 =
          selectedAnswersMap2[currentQuestion.question_id];

        // Map selected options to indexes
        const optionIndexes1 =
          selectedOption1 !== undefined ? [selectedOption1] : [];
        const optionIndexes2 =
          selectedOption2 !== undefined ? selectedOption2 : [];

        // Prepare data to be sent in the response
        const questionId = currentQuestion.question_id;
        const responses = {
          userId: decryptedParam2,
          testCreationTableId: decryptedParam1,
          [questionId]: {
            optionIndexes1: optionIndexes1.map((index) =>
              String.fromCharCode("a".charCodeAt(0) + index)
            ),
            optionIndexes2: optionIndexes2.map((index) =>
              String.fromCharCode("a".charCodeAt(0) + index)
            ),
          },
        };

        // Save the response to the server
        const saveResponse = await axios.post(`${BASE_URL}/QuizPage/response`, {
          responses,
        });

        // Log the response and update state
        console.log(saveResponse.data);
        console.log("Handle Next Click - New Response Saved");

        setAnsweredQuestionsMap((prevMap) => ({
          ...prevMap,
          [questionId]: true,
        }));

        setClickCount((prevCount) => prevCount + 1);
      } else {
        // Handle errors, e.g., if user data fetch fails
        console.error("Error fetching user data");
      }

      // Check if there are more questions, and if not, calculate the result
      if (currentQuestionIndex === questionData.questions.length - 1) {
        // setShowResult(true);
        calculateResult();
      }
    } catch (error) {
      console.error("Error handling next click:", error);
    }
  };

  //main
  const markForReview = async () => {
    try {
      setCurrentQuestionIndex((prevIndex) => {
        if (prevIndex < questionData.questions.length - 1) {
          return prevIndex + 1;
        }
        return prevIndex;
      });

      const calculatorInputValue = value;
      const currentQuestion = questionData.questions[currentQuestionIndex];
      const isCurrentQuestionAnswered =
        selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
        (selectedAnswersMap2[currentQuestion.question_id] &&
          selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
        calculatorInputValue !== "";

      const updatedQuestionStatus = [...questionStatus];
      if (isCurrentQuestionAnswered) {
        // If the question is answered
        updatedQuestionStatus[currentQuestionIndex] =
          "Answered but marked for review";

        if (userData.id) {
          const userId = userData.id;
          const subjectId = currentQuestion.subjectId;
          const sectionId = currentQuestion.sectionId;
          const questionId = currentQuestion.question_id.toString();

          // Store the calculator value in local storage
          localStorage.setItem(
            `calculatorValue_${questionId}`,
            JSON.stringify({ value: calculatorInputValue })
          );

          // Introduce a small delay before retrieving the stored value
          // This ensures that the local storage has enough time to update
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Retrieve the stored calculator value
          const storedValue = localStorage.getItem(
            `calculatorValue_${questionId}`
          );
          const storedCalculatorInputValue = storedValue
            ? JSON.parse(storedValue).value
            : null;

          if (calculatorInputValue === storedCalculatorInputValue) {
            const selectedOption1 =
              selectedAnswersMap1[currentQuestion.question_id];
            const selectedOption2 =
              selectedAnswersMap2[currentQuestion.question_id];

            const optionIndexes1 =
              selectedOption1 !== undefined ? [selectedOption1] : [];
            const optionIndexes2 =
              selectedOption2 !== undefined ? selectedOption2 : [];

            const hasAnswered = answeredQuestionsMap[questionId];

            // Construct the responses object
            const responses = {
              questionId: questionId,
              hasAnswered: hasAnswered,
              userId: decryptedParam2,
              testCreationTableId: decryptedParam1,
              subjectId: subjectId,
              sectionId: sectionId,
              [questionId]: {
                optionIndexes1: optionIndexes1.map((index) => {
                  const selectedOption =
                    questionData.questions[currentQuestionIndex].options[index];
                  return selectedOption.option_id;
                }),
                optionIndexes1CharCodes: optionIndexes1.map((index) => {
                  return String.fromCharCode("a".charCodeAt(0) + index);
                }),
                optionIndexes2: optionIndexes2.map((index) => {
                  const selectedOption =
                    questionData.questions[currentQuestionIndex].options[index];
                  return selectedOption.option_id;
                }),
                optionIndexes2CharCodes: optionIndexes2.map((index) => {
                  return String.fromCharCode("a".charCodeAt(0) + index);
                }),

                calculatorInputValue: calculatorInputValue,
              },
            };

            // Mark the question as answered
            setAnsweredQuestionsMap((prevMap) => ({
              ...prevMap,
              [questionId]: true,
            }));

            // Check if the question has been answered before
            if (hasAnswered) {
              // If the question has been answered before, update the existing response with a PUT request
              console.log(
                "Making API request to update the existing response..."
              );

              const updatedResponse = {
                optionIndexes1: optionIndexes1.map((index) =>
                  String.fromCharCode("a".charCodeAt(0) + index)
                ),
                optionIndexes2: optionIndexes2.map((index) =>
                  String.fromCharCode("a".charCodeAt(0) + index)
                ),
                calculatorInputValue: calculatorInputValue,
              };

              await fetch(`${BASE_URL}/QuizPage/updateResponse/${questionId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  updatedResponse,
                  decryptedParam2,
                  decryptedParam1,
                  subjectId,
                  sectionId,
                }),
              });

              console.log("Handling the response after updating...");
            } else {
              // If the question is being answered for the first time, save a new response with a POST request
              console.log("Making API request to save a new response...");

              await fetch(`${BASE_URL}/QuizPage/response`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(responses),
              });

              console.log("Handling the response after saving...");
            }
          }
        }
      } else {
        // If the question is not answered
        updatedQuestionStatus[currentQuestionIndex] = "marked";
      }

      setQuestionStatus(updatedQuestionStatus);
    } catch (error) {
      console.error("Error handling mark for review:", error);
    }
  };

  //working with questiontype id
  // const markForReview = async () => {
  //   try {
  //     setCurrentQuestionIndex((prevIndex) => {
  //       if (prevIndex < questionData.questions.length - 1) {
  //         return prevIndex + 1;
  //       }
  //       return prevIndex;
  //     });

  //     const calculatorInputValue = value;
  //     const currentQuestion = questionData.questions[currentQuestionIndex];
  //     const isCurrentQuestionAnswered =
  //       selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
  //       (selectedAnswersMap2[currentQuestion.question_id] &&
  //         selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
  //       calculatorInputValue !== "";

  //       console.log("currentQuestionTypeId:",currentQuestionTypeId);

  //     const updatedQuestionStatus = [...questionStatus];
  //     if (isCurrentQuestionAnswered) {
  //       // If the question is answered
  //       updatedQuestionStatus[currentQuestionIndex] =
  //         "Answered but marked for review";

  //       if (userData.id) {
  //         const userId = parseInt(userData.id); // Ensure userId is an integer
  //         const subjectId = parseInt(currentQuestion.subjectId); // Ensure subjectId is an integer
  //         const sectionId = parseInt(currentQuestion.sectionId); // Ensure sectionId is an integer
  //         const questionId = currentQuestion.question_id.toString();
  //         const quesionTypeId = parseInt(currentQuestion.quesionTypeId); // Ensure quesionTypeId is an integer

  //         // Store the calculator value in local storage
  //         localStorage.setItem(
  //           `calculatorValue_${questionId}`,
  //           JSON.stringify({ value: calculatorInputValue })
  //         );

  //         // Introduce a small delay before retrieving the stored value
  //         // This ensures that the local storage has enough time to update
  //         await new Promise((resolve) => setTimeout(resolve, 100));

  //         // Retrieve the stored calculator value
  //         const storedValue = localStorage.getItem(
  //           `calculatorValue_${questionId}`
  //         );
  //         const storedCalculatorInputValue = storedValue
  //           ? JSON.parse(storedValue).value
  //           : null;

  //         if (calculatorInputValue === storedCalculatorInputValue) {
  //           const selectedOption1 =
  //             selectedAnswersMap1[currentQuestion.question_id];
  //           const selectedOption2 =
  //             selectedAnswersMap2[currentQuestion.question_id];

  //           const optionIndexes1 =
  //             selectedOption1 !== undefined ? [selectedOption1] : [];
  //           const optionIndexes2 =
  //             selectedOption2 !== undefined ? selectedOption2 : [];

  //           const hasAnswered = answeredQuestionsMap[questionId];

  //           // Construct the responses object
  //           const responses = {
  //             questionId: questionId,
  //             hasAnswered: hasAnswered,
  //             userId: userId,
  //             testCreationTableId: parseInt(testCreationTableId), // Ensure testCreationTableId is an integer
  //             subjectId: subjectId,
  //             sectionId: sectionId,
  //             currentQuestionTypeId: currentQuestionTypeId,
  //             [questionId]: {
  //               optionIndexes1: optionIndexes1.map((index) => {
  //                 const selectedOption =
  //                   questionData.questions[currentQuestionIndex].options[index];
  //                 return selectedOption.option_id;
  //               }),
  //               optionIndexes1CharCodes: optionIndexes1.map((index) => {
  //                 return String.fromCharCode("a".charCodeAt(0) + index);
  //               }),
  //               optionIndexes2: optionIndexes2.map((index) => {
  //                 const selectedOption =
  //                   questionData.questions[currentQuestionIndex].options[index];
  //                 return selectedOption.option_id;
  //               }),
  //               optionIndexes2CharCodes: optionIndexes2.map((index) => {
  //                 return String.fromCharCode("a".charCodeAt(0) + index);
  //               }),

  //               calculatorInputValue: calculatorInputValue,
  //             },
  //           };

  //           // Mark the question as answered
  //           setAnsweredQuestionsMap((prevMap) => ({
  //             ...prevMap,
  //             [questionId]: true,
  //           }));

  //           // Check if the question has been answered before
  //           if (hasAnswered) {
  //             // If the question has been answered before, update the existing response with a PUT request
  //             console.log(
  //               "Making API request to update the existing response..."
  //             );

  //             const updatedResponse = {
  //               optionIndexes1: optionIndexes1.map((index) =>
  //                 String.fromCharCode("a".charCodeAt(0) + index)
  //               ),
  //               optionIndexes2: optionIndexes2.map((index) =>
  //                 String.fromCharCode("a".charCodeAt(0) + index)
  //               ),
  //               calculatorInputValue: calculatorInputValue,
  //             };

  //             await fetch(
  //               `${BASE_URL}/QuizPage/updateResponse/${questionId}`,
  //               {
  //                 method: "PUT",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify({
  //                   updatedResponse,
  //                   userId,
  //                   testCreationTableId: parseInt(testCreationTableId), // Ensure testCreationTableId is an integer
  //                   subjectId,
  //                   sectionId,
  //                   quesionTypeId,
  //                 }),
  //               }
  //             );

  //             console.log("Handling the response after updating...");
  //           } else {
  //             // If the question is being answered for the first time, save a new response with a POST request
  //             console.log("Making API request to save a new response...");

  //             await fetch(`${BASE_URL}/QuizPage/response`, {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify(responses),
  //             });

  //             console.log("Handling the response after saving...");
  //           }
  //         }
  //       }
  //     } else {
  //       // If the question is not answered
  //       updatedQuestionStatus[currentQuestionIndex] = "marked";
  //     }

  //     setQuestionStatus(updatedQuestionStatus);
  //   } catch (error) {
  //     console.error("Error handling mark for review:", error);
  //   }
  // };

  // const handleSubmit = async () => {
  //   try {
  //     // window.alert(
  //     //   "Your Test has been Submitted!! Click Ok to See Result.",
  //     //   calculateResult()
  //     // );
  //     console.log("hiiiiiiii");
  //     setShowExamSumary(true);
  //     setShowButtonNo(true);
  //     calculateResult();
  //     const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
  //     const counts = calculateQuestionCounts();
  //     setAnsweredCount(counts.answered);
  //     setNotAnsweredCount(counts.notAnswered);
  //     setMarkedForReviewCount(counts.markedForReview);
  //     setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
  //     setVisitedCount(counts.VisitedCount);

  //     // Assuming you have these variables in your component's state
  //     const currentQuestion = questionData.questions[currentQuestionIndex];
  //     const questionId = currentQuestion.question_id;

  //     // Format time
  //     const formattedTime = WformatTime(wtimer);
  //     const response = await fetch(`${BASE_URL}/QuizPage/saveExamSummary`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: decryptedParam2,
  //         totalUnattempted: notAnsweredCount,
  //         totalAnswered: answeredCount,
  //         NotVisitedb: NotVisitedb,
  //         testCreationTableId: decryptedParam1,
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log("Exam summary saved:", result);
  //     try {
  //       // Make a POST request to your server to submit time left
  //       const response = await fetch(`${BASE_URL}/QuizPage/submitTimeLeft`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },

  //         body: JSON.stringify({
  //           userId: decryptedParam2,
  //           testCreationTableId: decryptedParam1,
  //           timeLeft: formattedTime,
  //         }),
  //       });

  //       const result = await response.json();

  //       console.log("Time left submission result:", result);
  //     } catch (error) {
  //       console.error("Error submitting time left:", error);
  //     } finally {
  //       // Ensure that the questionId is correctly obtained
  //       if (questionId) {
  //         // Clear local storage data for the current question
  //         try {
  //           console.log(
  //             "Removing from local storage for questionId:",
  //             questionId
  //           );
  //           localStorage.removeItem(`calculatorValue_${questionId}`);
  //           console.log("Item removed successfully.");
  //         } catch (error) {
  //           console.error("Error removing item from local storage:", error);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error);
  //   }
  // };


  const handleSubmit = async () => {
    try {
      setShowExamSumary(true);
      setShowButtonNo(true);
      calculateResult();
  
      const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
      const counts = calculateQuestionCounts();
      setAnsweredCount(counts.answered);
      setNotAnsweredCount(counts.notAnswered);
      setMarkedForReviewCount(counts.markedForReview);
      setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
      setVisitedCount(counts.VisitedCount);
  
      const currentQuestion = questionData.questions[currentQuestionIndex];
      const questionId = currentQuestion.question_id;
  
      const formattedTime = WformatTime(wtimer);
  
      // Save exam summary
      const saveExamSummaryResponse = await fetch(`${BASE_URL}/QuizPage/saveExamSummary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: decryptedParam2,
          totalUnattempted: notAnsweredCount,
          totalAnswered: answeredCount,
          NotVisitedb: NotVisitedb,
          testCreationTableId: decryptedParam1,
        }),
      });
  
      const saveExamSummaryResult = await saveExamSummaryResponse.json();
      console.log("Exam summary saved:", saveExamSummaryResult);
  
      // Submit time left
      const submitTimeLeftResponse = await fetch(`${BASE_URL}/QuizPage/submitTimeLeft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: decryptedParam2,
          testCreationTableId: decryptedParam1,
          timeLeft: formattedTime,
        }),
      });
  
      const submitTimeLeftResult = await submitTimeLeftResponse.json();
      console.log("Time left submission result:", submitTimeLeftResult);
  
      // Clear local storage data for the current question
      if (questionId) {
        try {
          console.log("Removing from local storage for questionId:", questionId);
          localStorage.removeItem(`calculatorValue_${questionId}`);
          console.log("Item removed successfully.");
        } catch (error) {
          console.error("Error removing item from local storage:", error);
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };
  

  

  const handlePreviousClick = () => {
    const currentQuestion = questionData.questions[currentQuestionIndex];

    // Check if the current question is answered
    const calculatorInputValue = value;
    const isCurrentQuestionAnswered =
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      calculatorInputValue !== "";

    if (!isCurrentQuestionAnswered || isCurrentQuestionAnswered) {
      // If the current question is not answered, update the status
      const updatedQuestionStatus = [...questionStatus];
      updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      setQuestionStatus(updatedQuestionStatus);
      console.log(currentQuestionIndex);
      console.log(updatedQuestionStatus);

      // You may also show a message or perform other actions to indicate that the question is not answered
      console.log("Question not answered!");
    } else {
      // Log a message indicating that the question is answered
      console.log("Question answered!");
    }

    setCurrentQuestionIndex((prevIndex) => {
      // Save the current timer value for the question
      const updatedTimers = [...timers];
      updatedTimers[prevIndex] = timer;
      setTimers(updatedTimers);
      // Move to the previous question
      return prevIndex - 1;
    });

    // Set the previous question status to notAnswered
    const previousQuestionIndex = currentQuestionIndex - 1;
    if (previousQuestionIndex >= 0) {
      const updatedQuestionStatus = [...questionStatus];
      if (
        updatedQuestionStatus[previousQuestionIndex] === "answered" ||
        updatedQuestionStatus[previousQuestionIndex] ===
          "Answered but marked for review" ||
        updatedQuestionStatus[previousQuestionIndex] === "marked"
      ) {
        setQuestionStatus(updatedQuestionStatus);
      } else {
        updatedQuestionStatus[previousQuestionIndex] = "notAnswered";
        setQuestionStatus(updatedQuestionStatus);
      }
    }

    fetchData();
    console.log("fetchDataf", fetchData());
    setActiveQuestion((prevActiveQuestion) => prevActiveQuestion - 1);
    // Set the value to the previously selected answer if available
    if (currentQuestionIndex > 0) {
      const prevQuestion = questionData.questions[currentQuestionIndex - 1];
      const prevQuestionId = prevQuestion.question_id;

      // Retrieve the stored answer from local storage using the question ID
      const value = localStorage.getItem(`calculatorValue_${prevQuestionId}`);
      if (value) {
        const parsedValue = JSON.parse(value).value;
        setValue(parsedValue);
        // console.log(
        //   "Stored Value for previous question:",
        //   prevQuestionId,
        //   parsedValue
        // );
      } else {
        // setValue(""); // Clear the input if there is no stored answer
        // console.log("No stored value found for previous question.");
      }
    }
  };
  const clearResponse = async () => {
    //-----------------buttons functionality--------------
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const calculatorInputValue = value;
    const inputField = document.getElementById(
      `question-${currentQuestionIndex}`
    );
    const isCurrentQuestionAnswered =
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      selectedAnswersMap3[currentQuestion.question_id] ||
      inputField !== "";

    fetchData();
    if (isCurrentQuestionAnswered) {
      // If the current question is answered, update the status
      const updatedQuestionStatus = [...questionStatus];
      updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      setQuestionStatus(updatedQuestionStatus);
    }
    //-----------------buttons functionality end--------------

    try {
      const questionId =
        questionData.questions[currentQuestionIndex].question_id;

      // Clear response for radio buttons (MCQ)
      const updatedSelectedAnswersMap1 = { ...selectedAnswersMap1 };
      updatedSelectedAnswersMap1[questionId] = undefined;
      setSelectedAnswersMap1(updatedSelectedAnswersMap1);

      // Clear response for checkboxes (MSQ)
      const updatedSelectedAnswersMap2 = { ...selectedAnswersMap2 };
      updatedSelectedAnswersMap2[questionId] = [];
      setSelectedAnswersMap2(updatedSelectedAnswersMap2);

      // Clear response for input field
      const updatedSelectedAnswersMap3 = { ...selectedAnswersMap3 };
      updatedSelectedAnswersMap3[questionId] = undefined;
      setSelectedAnswersMap3(updatedSelectedAnswersMap3);
      // Clear response for input field by setting value directly in the input field
      const inputField = document.getElementById(
        `question-${currentQuestionIndex}`
      );
      if (inputField) {
        setTimeout(() => {
          inputField.value = ""; // Clear the value in the input field
        }, 0);
      }
      // Remove the stored calculator value in local storage
      localStorage.removeItem(`calculatorValue_${questionId}`);
      fetchData();
      // Additionally, you can set the value state to empty string
      setValue("");
      // Remove the stored calculator value in local storage
      // localStorage.removeItem(`calculatorValue_${questionId}`);

      // Send a request to your server to clear the user's response for the current question
      const response = await axios.put(
        `http://localhost:5001/QuizPage/clearResponse/${questionId}/${decryptedParam2}`
      );

      if (response.status === 200) {
        console.log("Response cleared successfully");
        // Update any state or perform additional actions as needed
      } else {
        console.error("Failed to clear response:", response.data);
      }
    } catch (error) {
      console.error("Error clearing response:", error);
    }
  };
  //-----------------------------------------------------HANDLE BUTTON FUNCTIONS END--------------------------

  const updateQuestionStatus = (index, status) => {
    // Update the question status in the QuestionPaper component
    const updatedQuestionStatus = [...questionStatus];
    updatedQuestionStatus[index] = status;
    setQuestionStatus(updatedQuestionStatus);
  };

  // State variable to store text answers for each question
  const [selectedTextAnswersMap3, setSelectedTextAnswersMap3] = useState({});
  const [textInputs, setTextInputs] = useState({});
  // Update function
  const onTextAnswerSelected = (questionId, answer) => {
    setSelectedTextAnswersMap3((prevMap) => ({
      ...prevMap,
      [questionId]: answer,
    }));
  };

  // Function to get the answer for the current question
  function getAnswerForCurrentQuestion() {
    const currentQuestion = questionData.questions[currentQuestionIndex];

    if (currentQuestion && currentQuestion.useranswer) {
      const { useranswer, typeofQuestion } = currentQuestion;

      // Check if typeofQuestion is defined before using includes
      if (typeofQuestion && typeofQuestion.includes) {
        // Adjust the logic based on your data structure
        if (typeofQuestion.includes("NATD")) {
          return useranswer.ans; // For questions with Decimal values
        } else if (typeofQuestion.includes("NATI")) {
          return useranswer.ans; // For questions with Integer values
        }
      }
    }

    // Add more conditions or handle the case where the question type is not recognized
    return "Answer not available";
  }

  const currentQuestionType =
    currentQuestion && currentQuestion.quesion_type
      ? currentQuestion.quesion_type.typeofQuestion
      : "";

  // console.log("Current Question Type:", currentQuestionType);

  const [testData, setTestData] = useState([]);
  const { courseCreationId, Portale_Id } = useParams();

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const responseTest = await fetch(
          `${BASE_URL}/TestPage/feachingtest/${courseCreationId}`
        );
        const testData = await responseTest.json();
        setTestData(testData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTestData();
  }, [courseCreationId]);

  const [countDown, setCountDown] = useState(180 * 60);
  const timerId = useRef();
  // useEffect(()=> {
  //   timerId.current = setInterval(()=>{
  //     setCountDown(prev => prev - 1)
  //   }, 1000)
  //    return () => clearInterval(timerId.current);
  // },[])

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  // Convert seconds to hours, minutes, and seconds
  const hours = Math.floor(countDown / 3600);
  const minutes = Math.floor((countDown % 3600) / 60);
  const seconds = countDown % 60;

  const [testDetails, setTestDetails] = useState([]);
  // const firstTestCreationTableId = testData.length > 0 ? testData[0].testCreationTableId : null;
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
        console.log(data);
        setTestDetails(data.results);
      } catch (error) {
        console.log(error);
        // setError(error.message);
      }
    };

    if (decryptedParam1) {
      fetchTestDetails();
    }
  }, [decryptedParam1]);

  const openPopup = () => {
    // Close the current window
    window.close();

    // Set studentDashbordmyresult to true and store it in localStorage
    localStorage.setItem(
      "studentDashboardState",
      JSON.stringify({
        studentDashbordmyresult: true,
        studentDashbordconatiner: false,
        studentDashbordmycourse: false,
        studentDashbordbuycurses: false,
        studentDashborddountsection: false,
        studentDashbordbookmark: false,
        studentDashbordsettings: false,
      })
    );

    // Open the desired URL in a new window
    window.open("http://localhost:3000/student_dashboard");
  };

  // State for option
  const [option, setOption] = useState({ ans: null });
  // Handler to update option state
  const handleUpdateOption = (value) => {
    setOption({ ans: value });
  };

  //   const QBPBgenerate=(Portale_Id, testCreationTableId, user_Id)=>{
  // console.log(Portale_Id, testCreationTableId, user_Id)
  //   }

  const [error, setError] = useState(false);
  const [image, setImage] = useState(null);

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Logo/image`, {
        responseType: "arraybuffer",
      });
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
      setError(true); // Set error state to true on failure
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  
  return (
    // <div className="QuestionPaper_-container"  ref={quizRef}
    // onClick={enterFullscreen}  style={{ backgroundColor: 'white', }}>
    // <div className="QuestionPaper_-container"  >
    <div
      className="QuestionPaper_-container"
      ref={quizRef}
      onClick={enterFullscreen}
      style={{ backgroundColor: "white" }}
    >
      {/* {showMalPractisePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Malpractice Attempt</h2>
            <p>You have attempted malpractice.</p>
            <Link
              // to='/student_dashboard'
              // to={`/TestResultsPage/${decryptedParam1}/${decryptedParam2}`}
              style={{ color: "red" }}
              target="_blank"
              onClick={() => {
                setShowMalPractisePopup(false);
                handleMalPractiseSubmit();
              }}
            >
              OK
            </Link>
          </div>
        </div>
      )} */}

      {showMalPractisePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Malpractice Attempt</h2>
            <p>
              "As per our examination rules, your test has been automatically
              submitted as a result of a detected violation. Switching tabs
              during the quiz is strictly prohibited."
            </p>

            <button
              onClick={handleMalPractiseSubmit}
              style={{ color: "red" }}
              target="_blank"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="quiz_exam_interface_header quiz_exam_interface_header_q_if_H">
        <div className="quiz_exam_interface_header_LOGO ">
          {/* <img src={logo} alt="" /> */}
          <img src={image} alt="Current" />
        </div>
        <p className="testname_heading_quizPage" key={testName.decryptedParam1}>
          {testName}
        </p>
        {/* {testDetails && testDetails.length > 0 && (
          <div>
            <p className="testname_heading_quizPage">
              {testDetails[0].TestName}
            </p>
            <h3>
               {testDetails[0].courseName}
            </h3>

            <p>
              <b>Exam Name:</b> {testDetails[0].examName}
            </p>
          </div>
        )} */}
      </div>
      {/* <p>Decrypted Param 1: {decryptedParam1}</p>
      <p>Decrypted Param 2: {decryptedParam2}</p> */}

    
        {!showExamSumary ? (
          <div className="quiz_exam_interface_body">
            {/* --------------- quiz examconatiner -------------------- */}
            <div className="quizPagewatermark">
            <div className="quiz_exam_interface_body_left_container">
              {/* --------------- quiz sub container -------------------- */}

              {/* <div class="quiz_exam_interface_SUBJECTS_CONTAINER">
              <div>
                <div class="subjects_BTN_container">
                  <li>
                    <h6>Time Left: {WformatTime(wtimer)}</h6>
                  </li>
                </div>
              </div>

              <div class="right-header"></div>
            </div> */}

              {/* --------------- quiz question container -------------------- */}
              <div class="quiz_exam_interface_exam_CONTAINEr">
                {questionData.questions.length > 0 && (
                  <>
                    <div className="quiz_exam_interface_exam_subCONTAINEr">
                      <div className="quiz_exam_interface_exam_qN_Q">
                        <div class="quiz_exam_interface_SUBJECTS_CONTAINER">
                          {/* <div className="qtype_div">
                          Question Type:{" "}
                          {currentQuestion.quesion_type && (
                            <p>{currentQuestion.quesion_type.typeofQuestion}</p>
                          )}
                        </div> */}
                          <div className="time_qtype_div">
                            <div class="">
                              <div>
                                <p className="time_left_tag">
                                  <span>
                                    <MdOutlineTimer />
                                  </span>
                                  {/* Time Left: {WformatTime(wtimer)} */}
                                  <div>
                                    {/* Time Left:{countDown} */}
                                    Time Left:{" "}
                                    {hours.toString().padStart(2, "0")}:
                                    {minutes.toString().padStart(2, "0")}:
                                    {seconds.toString().padStart(2, "0")}
                                  </div>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* <div>
                        Question Type:
                        {currentQuestion.quesion_type && (
                          <p>{currentQuestion.quesion_type.typeofQuestion}</p>
                        )}
                      </div> */}
                        {/* <h3>Question:{currentQuestion.sortid.sortid_text}</h3> */}
                        {/* main working code start*/}
                        <div className="question_options_div">
                          <div className="question_div">
                            <div className="pravagragh_container ">
                              {currentQuestion.paragraph &&
                                currentQuestion.paragraph.paragraphImg && (
                                  <div className="Paragraph_div ">
                                    <b>Paragraph:</b>
                                    <img
                                      src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${currentQuestion.paragraph.paragraphImg}`}
                                      alt={`ParagraphImage ${currentQuestion.paragraph.paragraph_Id}`}
                                    />
                                  </div>
                                )}
                            </div>
                          </div>
                          <b>Question</b>
                          <div className="question_number_continer">
                            <h4 id="question_number">
                              {currentQuestionIndex + 1}.
                            </h4>
                            <img
                              src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${currentQuestion.questionImgName}`}
                              alt={`Question ${currentQuestion.question_id}`}
                            />
                          </div>
                          <div className="parent-div">
                            {currentQuestionType.includes("NATD") ||
                            currentQuestionType.includes("NATI") ? (
                              <div className="quiz_exam_interface_exam_qN_Q_options_calculator_input">
                                {currentQuestion.options &&
                                  Array.isArray(currentQuestion.options) &&
                                  currentQuestion.options.filter(
                                    (opt) =>
                                      opt.question_id ===
                                      questionData.questions[
                                        currentQuestionIndex
                                      ]?.question_id
                                  ) &&
                                  currentQuestion.options.map(
                                    (option, optionIndex) => (
                                      <div
                                        className="option"
                                        key={option.option_id}
                                      >
                                        <li key={optionIndex}>
                                          {/* calculator ============ */}
                                          {currentQuestionType.includes(
                                            "NATD( Numeric Answer type of questions with Decimal values)"
                                          ) && (
                                            <div className="calculator">
                                              <div className="display">
                                                <label>Answer:</label>
                                                {/* <input
                                        type="text"
                                        name={`question-${currentQuestionIndex}`}
                                        value={value}
                                        onChange={(e) => onAnswerSelected3(e)}
                                        placeholder="Enter your answer"
                                        readOnly
                                      /> */}
                                                <input
                                                  type="text"
                                                  name={`question-${currentQuestionIndex}`}
                                                  value={
                                                    option.ans !== null
                                                      ? option.ans
                                                      : value
                                                  }
                                                  onChange={(e) =>
                                                    onAnswerSelected3(e)
                                                  }
                                                  placeholder="Enter your answer"
                                                />
                                              </div>
                                              <div>
                                                {/* <input
                                        type="button"
                                        value="DEL"
                                        onClick={(e) =>
                                          setValue(String(value).slice(0, -1))
                                        }
                                      /> */}
                                                <input
                                                  type="button"
                                                  value="DEL"
                                                  onClick={(e) => {
                                                    if (option.ans !== null) {
                                                      // If option.ans is not null, clear it
                                                      option.ans = null;
                                                    } else {
                                                      // If option.ans is null, remove the last character from value
                                                      // setValue(
                                                      //   String(value).slice(0, -1)
                                                      // );
                                                      setValue("");
                                                    }
                                                  }}
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="7"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="8"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="9"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="4"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="5"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="6"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="1"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="2"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="3"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="0"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="."
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="-"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                          )}
                                          {currentQuestionType.includes(
                                            "NATI( Numeric Answer type of questions with integer values)"
                                          ) && (
                                            <div className="calculator">
                                              <div className="display">
                                                <label>Answer:</label>
                                                {/* <input
                                        type="text"
                                        name={`question-${currentQuestionIndex}`}
                                        value={value}
                                        onChange={(e) => onAnswerSelected3(e)}
                                        placeholder="Enter your answer"
                                        readOnly
                                      /> */}
                                                <input
                                                  type="text"
                                                  name={`question-${currentQuestionIndex}`}
                                                  value={
                                                    option.ans !== null
                                                      ? option.ans
                                                      : value
                                                  }
                                                  onChange={(e) =>
                                                    onAnswerSelected3(e)
                                                  }
                                                  placeholder="Enter your answer"
                                                />
                                              </div>
                                              <div>
                                                {/* <input
                                        type="button"
                                        value="DEL"
                                        onClick={(e) =>
                                          setValue(String(value).slice(0, -1))
                                        }
                                      /> */}
                                                <input
                                                  type="button"
                                                  value="DEL"
                                                  onClick={(e) => {
                                                    if (option.ans !== null) {
                                                      // If option.ans is not null, clear it
                                                      option.ans = null;
                                                    } else {
                                                      // If option.ans is null, remove the last character from value
                                                      setValue(
                                                        String(value).slice(
                                                          0,
                                                          -1
                                                        )
                                                      );
                                                    }
                                                  }}
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="7"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="8"
                                                  onClick={(e) =>
                                                    setValue(
                                                      value + e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="9"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="4"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="5"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="6"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="1"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="2"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="3"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="0"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="."
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="button"
                                                  value="-"
                                                  // onClick={(e) =>
                                                  //   setValue(value + e.target.value)
                                                  // }
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                          )}
                                          {/* calculator ============ */}
                                        </li>
                                      </div>
                                    )
                                  )}
                              </div>
                            ) : (
                              <div className="quiz_exam_interface_exam_qN_Q_options">
                                {/* Render only if it's not NATD or NATI type question */}
                                <b>Options</b>
                                {currentQuestion.options &&
                                  Array.isArray(currentQuestion.options) &&
                                  currentQuestion.options.filter(
                                    (opt) =>
                                      opt.question_id ===
                                      questionData.questions[
                                        currentQuestionIndex
                                      ]?.question_id
                                  ) &&
                                  currentQuestion.options.map(
                                    (option, optionIndex) => (
                                      <div
                                        className="option"
                                        key={option.option_id}
                                      >
                                        <li key={optionIndex}>
                                          {currentQuestionType.includes(
                                            "MCQ4(MCQ with 4 Options)"
                                          ) && (
                                            <div>
                                              <input
                                                className="opt_btns"
                                                type="radio"
                                                name={`question-${currentQuestionIndex}-option`}
                                                value={option.ans}
                                                checked={
                                                  selectedAnswersMap1[
                                                    currentQuestion.question_id
                                                  ] === optionIndex
                                                }
                                                onChange={() =>
                                                  onAnswerSelected1(optionIndex)
                                                }
                                              />
                                              <label htmlFor="">
                                                ({option.option_index})
                                              </label>
                                              <img
                                                src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                                alt={`Option ${option.option_id}`}
                                              />
                                            </div>
                                          )}
                                          {currentQuestionType.includes(
                                            "MCQ5(MCQ with 5 Options)"
                                          ) && (
                                            <div>
                                              <input
                                                className="opt_btns"
                                                type="radio"
                                                name={`question-${currentQuestionIndex}-option`}
                                                value={String.fromCharCode(
                                                  "A".charCodeAt(0) +
                                                    optionIndex
                                                )}
                                                checked={
                                                  selectedAnswersMap1[
                                                    questionData.questions[
                                                      currentQuestionIndex
                                                    ]?.question_id
                                                  ] === optionIndex
                                                }
                                                onChange={() =>
                                                  onAnswerSelected1(optionIndex)
                                                }
                                              />
                                              (
                                              {String.fromCharCode(
                                                "a".charCodeAt(0) + optionIndex
                                              )}
                                              )
                                              <img
                                                src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                                alt={`Option ${option.option_id}`}
                                              />
                                            </div>
                                          )}
                                          {currentQuestionType.includes(
                                            "MSQN(MSQ with -ve marking)"
                                          ) && (
                                            <div>
                                              <input
                                                className="opt_btns"
                                                type="checkbox"
                                                name={`question-${currentQuestionIndex}-optionIndex`}
                                                value={String.fromCharCode(
                                                  "A".charCodeAt(0) +
                                                    optionIndex
                                                )}
                                                checked={
                                                  selectedAnswersMap2[
                                                    questionData.questions[
                                                      currentQuestionIndex
                                                    ]?.question_id
                                                  ] &&
                                                  selectedAnswersMap2[
                                                    questionData.questions[
                                                      currentQuestionIndex
                                                    ]?.question_id
                                                  ].includes(optionIndex)
                                                }
                                                onChange={() =>
                                                  onAnswerSelected2(optionIndex)
                                                }
                                              />
                                              (
                                              {String.fromCharCode(
                                                "a".charCodeAt(0) + optionIndex
                                              )}
                                              )
                                              <img
                                                src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                                alt={`Option ${option.option_id}`}
                                              />
                                            </div>
                                          )}
                                          {currentQuestionType.includes(
                                            "MSQ(MSQ without -ve marking)"
                                          ) && (
                                            <div>
                                              <input
                                                className="opt_btns"
                                                type="checkbox"
                                                name={`question-${currentQuestionIndex}-optionIndex`}
                                                value={String.fromCharCode(
                                                  "A".charCodeAt(0) +
                                                    optionIndex
                                                )}
                                                checked={
                                                  selectedAnswersMap2[
                                                    questionData.questions[
                                                      currentQuestionIndex
                                                    ]?.question_id
                                                  ] &&
                                                  selectedAnswersMap2[
                                                    questionData.questions[
                                                      currentQuestionIndex
                                                    ]?.question_id
                                                  ].includes(optionIndex)
                                                }
                                                onChange={() =>
                                                  onAnswerSelected2(optionIndex)
                                                }
                                              />
                                              (
                                              {String.fromCharCode(
                                                "a".charCodeAt(0) + optionIndex
                                              )}
                                              )
                                              <img
                                                src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                                alt={`Option ${option.option_id}`}
                                              />{" "}
                                            </div>
                                          )}
                                          {currentQuestionType.includes(
                                            "TF(True or false)"
                                          ) && (
                                            <div>
                                              <input
                                                className="opt_btns"
                                                type="radio"
                                                name={`question-${currentQuestionIndex}-option`}
                                                value={String.fromCharCode(
                                                  "A".charCodeAt(0) +
                                                    optionIndex
                                                )}
                                                checked={
                                                  selectedAnswersMap1[
                                                    questionData.questions[
                                                      currentQuestionIndex
                                                    ]?.question_id
                                                  ] === optionIndex
                                                }
                                                onChange={() =>
                                                  onAnswerSelected1(optionIndex)
                                                }
                                              />
                                              (
                                              {String.fromCharCode(
                                                "a".charCodeAt(0) + optionIndex
                                              )}
                                              )
                                              <img
                                                src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                                alt={`Option ${option.option_id}`}
                                              />
                                            </div>
                                          )}

                                          {currentQuestionType.includes(
                                            "CTQ(Comprehension type of questions )"
                                          ) && (
                                            <div>
                                              <input
                                                className="opt_btns"
                                                type="radio"
                                                name={`question-${currentQuestionIndex}-option`}
                                                value={String.fromCharCode(
                                                  "A".charCodeAt(0) +
                                                    optionIndex
                                                )}
                                                checked={
                                                  selectedAnswersMap1[
                                                    questionData.questions[
                                                      currentQuestionIndex
                                                    ]?.question_id
                                                  ] === optionIndex
                                                }
                                                onChange={() =>
                                                  onAnswerSelected1(optionIndex)
                                                }
                                              />
                                              (
                                              {String.fromCharCode(
                                                "a".charCodeAt(0) + optionIndex
                                              )}
                                              )
                                              <img
                                                src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                                alt={`Option ${option.option_id}`}
                                              />
                                            </div>
                                          )}
                                        </li>
                                      </div>
                                    )
                                  )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* main working code end */}
                      </div>
                    </div>
                    <div className="quiz_btns_contaioner">
                      <div>
                        <Tooltip
                          title="Click here to Save & Mark for Review"
                          arrow
                        >
                          <button
                            className="Quiz_Save_MarkforReview"
                            onClick={markForReview}
                          >
                            Save & Mark for Review
                          </button>
                        </Tooltip>
                        <Tooltip title="Click here to Clear Response" arrow>
                          <button
                            className="Quiz_clearResponse"
                            onClick={clearResponse}
                          >
                            Clear Response
                          </button>
                        </Tooltip>
                        <Tooltip title="Click here to Save & Next" arrow>
                          <button
                            className="quizsave_next"
                            onClick={handleSaveNextQuestion}
                          >
                            Save & Next
                          </button>
                        </Tooltip>
                      </div>
                      <div className="quiz_Next_back">
                        <Tooltip title="Click here to go Back" arrow>
                          <button
                            className="previous-btn"
                            onClick={handlePreviousClick}
                            disabled={currentQuestionIndex === 0}
                          >
                            <i className="fa-solid fa-angles-left"></i> Back
                          </button>
                        </Tooltip>
                        <Tooltip title="Click here to go Next" arrow>
                          <button onClick={handleNextQuestion}>Next</button>
                        </Tooltip>

                        <Tooltip title="Click here to Submit" arrow>
                          <button
                            style={{ background: "#f0a607da" }}
                            onClick={handleSubmit}
                            id="resume_btn"
                          >
                            Submit
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* --------------- quiz option container -------------------- */}

              {/* --------------- quiz btns container -------------------- */}
            </div>
 </div>
            <div className="quiz_exam_interface_body_right_container">
              {/* --------------- right bar -------------------- */}
              <div className="rightsidebar_container">
                <div
                  className="rightsidebar_container_btn_menubar"
                  onClick={toggleSidebar}
                >
                  <BiMenuAltLeft />
                </div>
                <div
                  className={
                    isSidebarVisible ? "rightsidebar visible" : "rightsidebar"
                  }
                >
                  <ButtonsFunctionality
                    onQuestionSelect={handleQuestionSelect}
                    questionStatus={questionStatus}
                    setQuestionStatus={setQuestionStatus}
                    answeredCount={answeredCount}
                    notAnsweredCount={notAnsweredCount}
                    answeredmarkedForReviewCount={answeredmarkedForReviewCount}
                    markedForReviewCount={markedForReviewCount}
                    VisitedCount={VisitedCount}
                    selectedSubject={selectedSubject}
                    questionData={questionData}
                    updateQuestionStatus={updateQuestionStatus}
                    // seconds={seconds}
                    seconds={600}
                    onUpdateOption={handleUpdateOption}
                    option={option}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
          <div className="examSummary_quizPagewatermark">
            <h3 className="Exam_summary_heading">Exam Summary</h3>

            <div className="Exam_summary_table">
              <table id="customers" className="exam_summary_table">
                <tr className="exam_summary_table_tr">
                  <td>Total Questions</td>
                  <td>Answered Questions</td>
                  <td>Not Answered Questions</td>
                  <td>Not Visited Count</td>
                  <td>Marked for Review Questions</td>
                  <td>Answered & Marked for Review Questions</td>
                </tr>
                <tr>
                  <td>{questionData.questions.length}</td>
                  <td>{answeredCount}</td>
                  <td>{notAnsweredCount}</td>
                  <td>{NotVisitedb}</td>
                  <td>{markedForReviewCount}</td>
                  <td>{answeredmarkedForReviewCount}</td>
                </tr>
              </table>
            </div>
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
            <div>
              {/* {showButtonNo && (
              <h2 className="Exam_summary_question_tag">
                Are you sure you want to submit ? <br />
                No changes will be allowed after submission.
              </h2>
            )} */}
              {showButtonNo === false ? (
                <h2 className="Exam_summary_question_tag">
                  Please press okay to view your result.
                </h2>
              ) : (
                <h2 className="Exam_summary_question_tag">
                  Are you sure you want to submit ? <br />
                  No changes will be allowed after submission.
                </h2>
              )}

              <div className="Exam_summary_btns">
                {showButtonNo === false ? (
                  // <Tooltip title="Yes" arrow>
                  <>
                    <Link
                      className="es_btn"
                      // to={`/TestResultsPage/${decryptedParam1}/${userData.id}`}
                      // to='/Submit_Page'
                      onClick={handleYes}
                    >
                      Okay
                    </Link>
                  </>
                ) : (
                  // {/* </Tooltip> */}
                  // <Tooltip title="Yes" arrow>
                  <>
                    <Link
                      className="es_btn"
                      // to={`/TestResultsPage/${decryptedParam1}/${userData.id}`}
                      // to='/Submit_Page'
                      onClick={handleYes}
                    >
                      Yes
                    </Link>
                  </>
                  // {/* </Tooltip> */}
                )}
                {showButtonNo && (
                  // <Tooltip title="No" arrow>
                  <button className="No_btn" onClick={handleNo}>
                    NO
                  </button>
                  // {/* </Tooltip> */}
                )}
              </div>
            </div>
          </div>
        </div>
        )}
     
    </div>
  );
};

export default QuizPage;
