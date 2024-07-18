import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import QuestionBankQuizButtonsFunctionality from "./QuestionBankQuizButtonsFunctionality";
import Tooltip from "@mui/material/Tooltip";
import "../Style/Paper.css";
// import logo from "../egate logo 1.png";
import { MdOutlineTimer } from "react-icons/md";
import { useRef } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import BASE_URL from "../../../../apiConfig";
// import { nav } from "./Data/Data";
import { IoReloadCircle } from "react-icons/io5";
import { decryptData, encryptData } from "../utils/crypto";

const QuestionBankQuiz = () => {
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

  console.log("helloooooo shichann");
  console.log("decryptedParam1", decryptedParam1);
  console.log("decryptedParam2", decryptedParam2);

  // const [userData, setUserData] = useState({});
  const [testData, setTestData] = useState([]);
  const { courseCreationId } = useParams();
  const [testDetails, setTestDetails] = useState([]);

  const [showPopupallpb, setShowPopupallpb] = useState(false);

  // const { subjectId, testCreationTableId, userId, question_id, user_Id } =
  //   useParams();
  async function handleendthetestrestart(decryptedParam2) {
    try {
      const response = await fetch(
        `http://localhost:5001/QuizPage/clearresponseforPB/${decryptedParam2}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Include any necessary authentication headers
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ decryptedParam2 }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      } else {
        console.log("User data deleted successfully");
      }

      // Close the window
      // window.close();
      setShowPopupallpb(false);
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  }
  async function handleendthetest(userId) {
    try {
      const response = await fetch(
        `http://localhost:5001/QuizPage/clearresponseforPB/${decryptedParam2}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Include any necessary authentication headers
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ decryptedParam2 }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      } else {
        console.log("User data deleted successfully");
      }

      // Close the window
      window.close();
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  }

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
    }
  };
  useEffect(() => {
    fetchImage();
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

  async function handleMalPractiseSubmit(userId) {
    try {
      const response = await fetch(
        `http://localhost:5001/QuizPage/clearresponseforPB/${decryptedParam2}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Include any necessary authentication headers
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ decryptedParam2 }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      } else {
        console.log("User data deleted successfully");
      }

      // Close the window
      window.close();
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  }

  // const [testDetails, setTestDetails] = useState(null);
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}/${decryptedParam2}`
        );

        setTestDetails(response.data);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [courseCreationId, decryptedParam2]);

  window.addEventListener("beforeunload", async function (event) {
    // Call your delete API endpoint here
    const userId = decryptedParam2;

    console.log(decryptedParam2);
    try {
      const response = await fetch(
        `http://localhost:5001/QuizPage/clearresponseforPB/${decryptedParam2}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Include any necessary authentication headers
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ decryptedParam2 }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
    // Redirect to the new URL
    // window.location.href = `/Instructions/${testCreationTableId}/${user_Id}/${Portale_Id}`;

    // Get the specific items you want to retain
    let itemsToRetain = [
      "isLoggedIn",
      "student_dashboard_state",
      "userRole",
      "greeting",
      "token",
    ];
    let retainedItems = {};

    // Iterate over the specific items and store them in a temporary object
    itemsToRetain.forEach((item) => {
      let value = localStorage.getItem(item);
      if (value !== null) {
        retainedItems[item] = value;
      }
    });

    // Clear all items from local storage
    localStorage.clear();

    // Set back the specific items if the user is logged in
    if (retainedItems["isLoggedIn"] === "true") {
      Object.entries(retainedItems).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }
  });
  window.addEventListener("load", function () {
    if (performance.navigation.type === 1) {
      // Page reloaded
      window.history.go(-2);
    }
  });

  const [showSolution, setShowSolution] = useState(false);
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  const [buttonText, setButtonText] = useState("Submit");
  const [finalTry, setFinalTry] = useState([]);
  const [finalTry2, setFinalTry2] = useState([]);
  const [finalTry3, setFinalTry3] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState([]);
  const [finalTryMap, setFinalTryMap] = useState(new Map());
  const [finalTry2Map, setFinalTry2Map] = useState(new Map());
  const [finalTry3Map, setFinalTry3Map] = useState(new Map());

  const [userAnswers, setUserAnswers] = useState({});

  const userCAArray = [];
  const userWAArray = [];
  const missingCorrectIndices = [];
  let correctOptions = [];
  let wrongOptions = [];
  let missingOptions = [];
  const optionIndices = [];
  const [correctAnsMessage, setCorrectAnsMessage] = useState("");
  const [inCorrectAnsMessage, setInCorrectAnsMessage] = useState("");
  const [missingMessage, setmissingMessage] = useState("");
  const [calc, setCalc] = useState([]);
  const [completeButtonText, setCompleteButtonText] = useState("Next");

  const onSubmit2 = () => {
    setSubmitted(true);
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer.answer_text.trim();

    const userAnswer = value.trim();
    if (userAnswer === "") {
      // Check if the user has submitted an empty answer
      console.log("Please enter your answer!");
      return;
    }
    if (correctAnswer === userAnswer) {
      console.log("user answerrr", userAnswer);
      console.log(correctAnswer, "when the user answer is");
      console.log("Correct!");
      setShowCorrectAnswer(true);
      setCalc((prev) => [...prev, correctAnswer]);
      console.log(calc, "calccccccccc");

      // Store the answer status as true in local storage
      // localStorage.setItem(`answer_${currentQuestion.question_id}`, true);
      localStorage.setItem(
        `answer_${currentQuestion.question_id}`,
        JSON.stringify({ correct: true, correctAnswer })
      );
    } else {
      console.log("Wrong!");
      console.log("Correct Answer:", correctAnswer);
      setShowCorrectAnswer(true);
      setCalc((prev) => [...prev, correctAnswer]);
      console.log(calc, "calllllllccccccc");
      setCorrectAnswer(correctAnswer);

      // Store the answer status as false in local storage
      // localStorage.setItem(`answer_${currentQuestion.question_id}`, true);
      localStorage.setItem(
        `answer_${currentQuestion.question_id}`,
        JSON.stringify({ correct: false, correctAnswer })
      );
    }

    // Add the submitted question to the array of submitted questions
    setSubmittedQuestions((prev) => [...prev, currentQuestion.question_id]);

    // Automatically change the button text to "View Solution" after submitting
    setButtonText("View Solution");
  };

  // Function to check if the current question is submitted
  const isQuestionSubmitted = (questionId) => {
    return submittedQuestions.includes(questionId);
  };

  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // };
  const [submittedQuestions, setSubmittedQuestions] = useState([]);

  const onSubmit = () => {
    setSubmitted(true);
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const selectedOptionIndex = selectedAnswers[activeQuestion];

    if (
      selectedOptionIndex >= 0 &&
      selectedOptionIndex < currentQuestion.options.length
    ) {
      const selectedOption = currentQuestion.options[selectedOptionIndex];
      const correctAnswerText = currentQuestion.answer.answer_text.trim();

      if (selectedOption) {
        const selectedAnswerText = selectedOption.option_index.trim();

        if (selectedAnswerText === correctAnswerText) {
          console.log("Correct Answer!");
          localStorage.setItem(`answer_${currentQuestion.question_id}`, true);
          // Here you can add your logic for handling correct answer
        } else {
          console.log("Wrong Answer!");
          localStorage.setItem(`answer_${currentQuestion.question_id}`, true);
          const correctAnswerOptionIndex = currentQuestion.options.findIndex(
            (option) => option.option_index.trim() === correctAnswerText
          );
          const correctAnswerOptionId =
            currentQuestion.options[correctAnswerOptionIndex]?.option_id;
          console.log("Correct Answer Option ID:", correctAnswerOptionId);
          // Here you can add your logic for handling wrong answer
        }
      } else {
        console.error("Selected option is undefined.");
      }
    } else {
      console.error("Invalid selected option index.");
    }
    // Add the submitted question ID to the array
    setSubmittedQuestions([...submittedQuestions, currentQuestion.question_id]);
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const onNextQuestion = () => {
    setShowSolution(false);
    setSubmitted(true); // Reset the submitted state when moving to the next question

    const currentQuestion = questionData.questions[currentQuestionIndex];
    const updatedQuestionStatus = [...questionStatus];
    // Check if the current question is answered
    const calculatorInputValue = value;
    const isCurrentQuestionAnswered =
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      calculatorInputValue !== "";
    if (!isCurrentQuestionAnswered) {
      // If the current question is not answered, update the status
      const updatedQuestionStatus = [...questionStatus];
      updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      setQuestionStatus(updatedQuestionStatus);
      console.log(currentQuestionIndex);
      console.log(updatedQuestionStatus);

      // You may also show a message or perform other actions to indicate that the question is not answered
      console.log("Question not answered!");
    } else {
      updatedQuestionStatus[currentQuestionIndex] = "answered";
      setQuestionStatus(updatedQuestionStatus);
      // Log a message indicating that the question is answered
      console.log("Question answered!");
    }

    // Move to the next question index
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questionData.questions.length - 1 ? prevIndex + 1 : prevIndex
    );

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questionData.questions.length) {
      const updatedQuestionStatus = [...questionStatus];
      if (updatedQuestionStatus[nextQuestionIndex] === "answered") {
        setQuestionStatus(updatedQuestionStatus);
      } else {
        updatedQuestionStatus[nextQuestionIndex] = "notAnswered";
        setQuestionStatus(updatedQuestionStatus);
      }
    }

    // Check if the answer status is available in local storage
    const nextQuestion = questionData.questions[currentQuestionIndex + 1];
    if (nextQuestion) {
      const updatedQuestionStatus = [...questionStatus];
      const nextQuestionId = nextQuestion.question_id;
      const answerStatus = localStorage.getItem(`answer_${nextQuestionId}`);
      if (answerStatus === "true") {
        setButtonText("View Solution");
      } else {
        setButtonText("Submit");
      }
    }

    if (currentQuestionIndex + 1 === questionData.questions.length) {
      setCurrentQuestionIndex(0);
    }
  };

  const [correctAnswer, setCorrectAnswer] = useState("");

  const [userAnswer, setUserAnswer] = useState("");

  const [submittedCalcAnswers, setSubmittedCalcAnswers] = useState({});
  const onSubmitnat = () => {
    setSubmitted(true); // Update submitted state
    const currentQuestion = questionData.questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer.answer_text.trim();
    const userAnswer = value.trim();
    if (userAnswer === "") {
      // Check if the user has submitted an empty answer
      console.log("Please enter your answer!");
      return; // Exit the function if the answer is empty
    }
    if (correctAnswer === userAnswer) {
      console.log("Correct!");
      setShowCorrectAnswer(true);
      setCorrectAnswer("");
    } else {
      console.log("Wrong!");
      console.log("Correct Answer:", correctAnswer);
      setShowCorrectAnswer(true);
      setCorrectAnswer(correctAnswer);
    }
  };
  const [showMessage, setShowMessage] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handlecloseSolution() {
    setShowSolution(false);
  }

  const STORAGE_KEY = "currentQuestionIndex";

  useEffect(() => {
    // Check if there is a stored value for the current question
    const storedValue = localStorage.getItem(
      selectedQuestionId[selectedQuestionId.length - 1]
    );
    if (storedValue) {
      setValue(storedValue);
    }
  }, [selectedQuestionId]);

  useEffect(() => {
    // Retrieve the current question index from local storage
    const storedIndex = localStorage.getItem(STORAGE_KEY);
    if (storedIndex) {
      setCurrentQuestionIndex(parseInt(storedIndex));
    }
  }, []);

  async function handleQType(currentQuestionType, qid) {
    setShowSolution(false);
    if (!showSolution) {
      // setShowSolution(true);
      setButtonText("View Solution");
      if (buttonText == "View Solution") {
        setShowSolution(true);
      }
    }
    if (buttonText == "Hide Solution") {
      setButtonText("View Solution");
      setShowSolution(false);
    }

    // Check if the question is answered for NATI or NATD type
    const isNATQuestionAnswered =
      currentQuestionType.includes("NATD") ||
      currentQuestionType.includes("NATI");

    if (!isNATQuestionAnswered) {
      console.log("NATQuestion not Answered");
    } else {
      console.log("NATQuestionAnswered");
    }
    const calculatorInputValue = value;
    // const isCurrentQuestionAnswered =
    //   selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
    //   (selectedAnswersMap2[currentQuestion.question_id] &&
    //     selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
    //   calculatorInputValue !== "";
    const isQuestionAnswered =
      currentQuestionType.includes("MSQ") ||
      currentQuestionType.includes("MSQN") ||
      currentQuestionType.includes("MCQ4") ||
      currentQuestionType.includes("MCQ5") ||
      currentQuestionType.includes("CTQ");

    // Check if the question is answered in general
    const isCurrentQuestionAnswered =
      isNATQuestionAnswered ||
      isQuestionAnswered ||
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      calculatorInputValue !== "";
    setButtonText(isCurrentQuestionAnswered ? "View Solution" : "Submit");

    // handleQType(qType);
    if (!isCurrentQuestionAnswered) {
      // If the question is not answered, show the "Submit" button
      setButtonText("Submit");
    } else {
      // If the question is answered, show the "View Solution" button
      setButtonText("View Solution");
    }

    if (!isCurrentQuestionAnswered && buttonText === "Submit") {
      window.alert("Please answer the question.");
      setButtonText("Submit");
      return;
    }

    if (!isCurrentQuestionAnswered && buttonText !== "Submit") {
      setButtonText("Submit");
      return;
    } else {
      if (!selectedQuestionId.includes(qid)) {
        // If it doesn't exist, create a new array by spreading the previous state and adding the newQuestionId
        const updatedSelectedQuestionId = [...selectedQuestionId, qid];
        // Update the state with the new array
        setSelectedQuestionId(updatedSelectedQuestionId);
      }
      console.log(
        currentQuestionType,
        " from handle qtype function........current question type"
      );
      if (
        currentQuestionType.includes("MCQ4") ||
        currentQuestionType.includes("MCQ5") ||
        currentQuestionType.includes("CTQ") ||
        currentQuestionType.includes("TF")
      ) {
        console.log("returning to onsumit");
        onSubmit();
      } else if (
        currentQuestionType.includes("MSQN") ||
        currentQuestionType.includes("MSQ")
      ) {
        //  i have to add code of check boxes
        checkBoxes(qid);
      } else if (
        currentQuestionType.includes("NATD") ||
        currentQuestionType.includes("NATI")
      ) {
        console.log("retirning to on submit nat and natd ");
        // onSubmitnat()
        // localStorage.setItem(STORAGE_KEY, currentQuestionIndex);
        // localStorage.setItem(qid, calculatorInputValue);
        onSubmit2();
      }
      try {
        const updatedQuestionStatus = [...questionStatus];
        const calculatorInputValue = value;

        console.log("Current Question Index:", currentQuestionIndex);
        console.log("Current Question:", currentQuestion);

        // const isCurrentQuestionAnswered =
        //   selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
        //   (selectedAnswersMap2[currentQuestion.question_id] &&
        //     selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
        //   calculatorInputValue !== "";

        // console.log("Is Current Question Answered:", isCurrentQuestionAnswered);

        // if (!isCurrentQuestionAnswered) {
        //   window.alert("Please answer the question before proceeding.");
        // }
        // else {
        updatedQuestionStatus[currentQuestionIndex] = "answered";
        setQuestionStatus(updatedQuestionStatus);

        // setCurrentQuestionIndex((prevIndex) =>
        //   prevIndex < questionData.questions.length - 1
        //     ? prevIndex + 1
        //     : prevIndex
        // );

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
          // console.log("hiiiiiiiiiiiiii");
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
                  userId,
                  decryptedParam1,
                  subjectId,
                  sectionId,
                }),
              });

              console.log("Handling the response after updating...");
            } else {
              // If the question is being answered for the first time, save a new response with a POST request
              console.log("Making API request to save a new response...");

              await fetch(`${BASE_URL}/QuizPage/responseforPB`, {
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
        // Reset showCorrectAnswer state when a new question is selected
        setShowCorrectAnswer(false);
        setShowCorrectAnswer(true); // Set it to true after reset
        // }
      } catch (error) {
        console.error("Error handling next click:", error);
      }
    }
  }
  const [correctAnswersMap, setCorrectAnswersMap] = useState({});
  //main
  // const checkBoxes = (qid) => {
  //   setSubmitted(true);
  //   const currentQuestion = questionData.questions[currentQuestionIndex]; //current question
  //   console.log(currentQuestion);
  //   const selectedOptionIndex = selectedAnswers[activeQuestion];
  //   console.log(selectedOptionIndex, "selectedOptionIndexxxxxxxxx");
  //   const answerText = currentQuestion.answer.answer_text.trim();
  //   const array = answerText.split(",");
  //   const indexArray = array.map(
  //     (letter) => letter.charCodeAt(0) - "a".charCodeAt(0)
  //   );
  //   console.log(indexArray, "index arraayyyyyyyyy"); //answer index array
  //   indexArray.forEach((correctIndex, index) => {
  //     if (selectedOptionIndex.includes(correctIndex)) {
  //       userCAArray.push(correctIndex);
  //     } else {
  //       missingCorrectIndices.push(correctIndex);
  //     }
  //   });

  //   // Check for user selected answers not present in indexArray
  //   selectedOptionIndex.forEach((userIndex) => {
  //     if (
  //       !indexArray.includes(userIndex) &&
  //       !missingCorrectIndices.includes(userIndex)
  //     ) {
  //       userWAArray.push(userIndex);
  //     }
  //   });
  //   const answerOptions = currentQuestion.options;
  //   console.log(answerOptions, "answer ootions i am thinking of ");
  //   console.log(
  //     optionIndices.includes(answerOptions),
  //     "logging whether the current questions answer options are compared with the missing optionIndices"
  //   );

  //   console.log("Correct Veena Answers:", userCAArray);
  //   console.log("Wrong user Answers:", userWAArray);
  //   console.log("Missing Correct Indices:", missingCorrectIndices);

  //   correctOptions = userCAArray.map((index) => answerOptions[index]);
  //   wrongOptions = userWAArray.map((index) => answerOptions[index]);
  //   missingOptions = missingCorrectIndices.map((index) => answerOptions[index]);
  //   missingOptions.forEach((item) => {
  //     console.log(item.option_index, "missingoptions lo option_index");
  //   });
  //   //missing options which are correct are coming int the form of letters but we are comparing with the numbers(optionIndex) so i converted into indices and pushed them to optionIndices array
  //   // now i have to give tick mark for the indices which are in optionIndices array.

  //   missingOptions.forEach((item) => {
  //     // Convert the option_index to its corresponding index value and push it into the array
  //     const index = item.option_index.charCodeAt(0) - "a".charCodeAt(0);
  //     optionIndices.push(index);
  //     console.log(optionIndices.includes(index), "includedddddddddd");
  //   });

  //   console.log(optionIndices, "option indicesssssssss"); // Now you have all option indices in the optionIndices array
  //   console.log("Correct Options:", correctOptions);
  //   console.log("Wrong Options:", wrongOptions);
  //   console.log("Missing Options:", missingOptions);
  //   console.log(missingOptions.some((item) => item.option_index));
  //   correctOptions.forEach((option) => {
  //     console.log(option, "option in loop");
  //     console.log(option.option_index, "letme try ");
  //   });
  //   correctOptions.forEach((option) => {
  //     const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
  //     if (!finalTry.includes(newIndex)) {
  //       setFinalTry((prev) => [...prev, newIndex]);
  //     }
  //   });
  //   wrongOptions.forEach((option) => {
  //     const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
  //     if (!finalTry2.includes(newIndex)) {
  //       setFinalTry2((prev) => [...prev, newIndex]);
  //     }
  //   });
  //   missingOptions.forEach((option) => {
  //     const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
  //     if (!finalTry3.includes(newIndex)) {
  //       setFinalTry3((prev) => [...prev, newIndex]);
  //     }
  //   });

  //   console.log(finalTry, "wwwwwwwwwwwwwwwwweeeeeeeeeeee");
  //   console.log(finalTry2, "finaltry two ");
  //   // const uniquePreviousValues = [...new Set(previousValues)];
  //   const finalTryMapCopy = new Map(finalTryMap);
  //   const finalTry2MapCopy = new Map(finalTry2Map);
  //   const finalTry3MapCopy = new Map(finalTry3Map);

  //   finalTryMapCopy.set(qid, userCAArray);
  //   finalTry2MapCopy.set(qid, userWAArray);
  //   finalTry3MapCopy.set(qid, missingCorrectIndices);

  //   setFinalTryMap(finalTryMapCopy);
  //   setFinalTry2Map(finalTry2MapCopy);
  //   setFinalTry3Map(finalTry3MapCopy);

  //   if (!selectedQuestionIds.includes(qid)) {
  //     setSelectedQuestionIds([...selectedQuestionIds, qid]);
  //   }
  //   //
  // };
  //main code before includes....error
  // const checkBoxes = (qid) => {
  //   setSubmittedQuestions([...submittedQuestions, qid]);
  //   setSubmitted(true);
  //   const currentQuestion = questionData.questions[currentQuestionIndex];
  //   console.log(currentQuestion);
  //   const selectedOptionIndex = selectedAnswers[activeQuestion];
  //   console.log(selectedOptionIndex, "selectedOptionIndexxxxxxxxx");
  //   const answerText = currentQuestion.answer.answer_text.trim();
  //   const array = answerText.split(",");
  //   const indexArray = array.map(
  //     (letter) => letter.charCodeAt(0) - "a".charCodeAt(0)
  //   );
  //   console.log(indexArray, "index arraayyyyyyyyy"); //answer index array
  //   indexArray.forEach((correctIndex, index) => {
  //     if (selectedOptionIndex.includes(correctIndex)) {
  //       userCAArray.push(correctIndex);
  //     } else {
  //       missingCorrectIndices.push(correctIndex);
  //     }
  //   });

  //   // Check for user selected answers not present in indexArray
  //   selectedOptionIndex.forEach((userIndex) => {
  //     if (
  //       !indexArray.includes(userIndex) &&
  //       !missingCorrectIndices.includes(userIndex)
  //     ) {
  //       userWAArray.push(userIndex);
  //     }
  //   });
  //   const answerOptions = currentQuestion.options;
  //   console.log(answerOptions, "answer ootions i am thinking of ");
  //   console.log(
  //     optionIndices.includes(answerOptions),
  //     "logging whether the current questions answer options are compared with the missing optionIndices"
  //   );

  //   console.log("Correct Veena Answers:", userCAArray);
  //   console.log("Wrong user Answers:", userWAArray);
  //   console.log("Missing Correct Indices:", missingCorrectIndices);

  //   correctOptions = userCAArray.map((index) => answerOptions[index]);
  //   wrongOptions = userWAArray.map((index) => answerOptions[index]);
  //   missingOptions = missingCorrectIndices.map((index) => answerOptions[index]);
  //   missingOptions.forEach((item) => {
  //     console.log(item.option_index, "missingoptions lo option_index");
  //   });
  //   //missing options which are correct are coming int the form of letters but we are comparing with the numbers(optionIndex) so i converted into indices and pushed them to optionIndices array
  //   // now i have to give tick mark for the indices which are in optionIndices array.

  //   missingOptions.forEach((item) => {
  //     // Convert the option_index to its corresponding index value and push it into the array
  //     const index = item.option_index.charCodeAt(0) - "a".charCodeAt(0);
  //     optionIndices.push(index);
  //     console.log(optionIndices.includes(index), "includedddddddddd");
  //   });

  //   console.log(optionIndices, "option indicesssssssss"); // Now you have all option indices in the optionIndices array
  //   console.log("Correct Options:", correctOptions);
  //   console.log("Wrong Options:", wrongOptions);
  //   console.log("Missing Options:", missingOptions);
  //   console.log(missingOptions.some((item) => item.option_index));
  //   correctOptions.forEach((option) => {
  //     console.log(option, "option in loop");
  //     console.log(option.option_index, "letme try ");
  //   });
  //   correctOptions.forEach((option) => {
  //     const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
  //     if (!finalTry.includes(newIndex)) {
  //       setFinalTry((prev) => [...prev, newIndex]);
  //     }
  //   });
  //   wrongOptions.forEach((option) => {
  //     const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
  //     if (!finalTry2.includes(newIndex)) {
  //       setFinalTry2((prev) => [...prev, newIndex]);
  //     }
  //   });
  //   missingOptions.forEach((option) => {
  //     const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
  //     if (!finalTry3.includes(newIndex)) {
  //       setFinalTry3((prev) => [...prev, newIndex]);
  //     }
  //   });

  //   console.log(finalTry, "wwwwwwwwwwwwwwwwweeeeeeeeeeee");
  //   console.log(finalTry2, "finaltry two ");
  //   // const uniquePreviousValues = [...new Set(previousValues)];
  //   const finalTryMapCopy = new Map(finalTryMap);
  //   const finalTry2MapCopy = new Map(finalTry2Map);
  //   const finalTry3MapCopy = new Map(finalTry3Map);

  //   finalTryMapCopy.set(qid, userCAArray);
  //   finalTry2MapCopy.set(qid, userWAArray);
  //   finalTry3MapCopy.set(qid, missingCorrectIndices);

  //   setFinalTryMap(finalTryMapCopy);
  //   setFinalTry2Map(finalTry2MapCopy);
  //   setFinalTry3Map(finalTry3MapCopy);

  //   if (!selectedQuestionIds.includes(qid)) {
  //     setSelectedQuestionIds([...selectedQuestionIds, qid]);
  //   }

  //   // Store the answer status as true in local storage
  //   localStorage.setItem(`answer_${qid}`, true);

  //   //
  // };

  const checkBoxes = (qid) => {
    setSubmittedQuestions([...submittedQuestions, qid]);
    setSubmitted(true);
    const currentQuestion = questionData.questions[currentQuestionIndex];
    console.log(currentQuestion);
    const selectedOptionIndex = selectedAnswers[activeQuestion];
    console.log(selectedOptionIndex, "selectedOptionIndexxxxxxxxx");
    const answerText = currentQuestion.answer.answer_text.trim();
    const array = answerText.split(",");
    const indexArray = array.map(
      (letter) => letter.charCodeAt(0) - "a".charCodeAt(0)
    );
    console.log(indexArray, "index arraayyyyyyyyy"); //answer index array
    indexArray.forEach((correctIndex, index) => {
      // Check if selectedOptionIndex is defined before using it
      if (selectedOptionIndex && selectedOptionIndex.includes(correctIndex)) {
        userCAArray.push(correctIndex);
      } else {
        missingCorrectIndices.push(correctIndex);
      }
    });

    // Check for user selected answers not present in indexArray
    // Check if selectedOptionIndex is defined and is an array before using forEach
    if (Array.isArray(selectedOptionIndex)) {
      selectedOptionIndex.forEach((userIndex) => {
        if (
          !indexArray.includes(userIndex) &&
          !missingCorrectIndices.includes(userIndex)
        ) {
          userWAArray.push(userIndex);
        }
      });
    } else {
      console.error("selectedOptionIndex is not an array or is undefined.");
    }

    const answerOptions = currentQuestion.options;
    console.log(answerOptions, "answer ootions i am thinking of ");
    console.log(
      optionIndices.includes(answerOptions),
      "logging whether the current questions answer options are compared with the missing optionIndices"
    );

    console.log("Correct Veena Answers:", userCAArray);
    console.log("Wrong user Answers:", userWAArray);
    console.log("Missing Correct Indices:", missingCorrectIndices);

    correctOptions = userCAArray.map((index) => answerOptions[index]);
    wrongOptions = userWAArray.map((index) => answerOptions[index]);
    missingOptions = missingCorrectIndices.map((index) => answerOptions[index]);
    missingOptions.forEach((item) => {
      console.log(item.option_index, "missingoptions lo option_index");
    });
    //missing options which are correct are coming int the form of letters but we are comparing with the numbers(optionIndex) so i converted into indices and pushed them to optionIndices array
    // now i have to give tick mark for the indices which are in optionIndices array.

    missingOptions.forEach((item) => {
      // Convert the option_index to its corresponding index value and push it into the array
      const index = item.option_index.charCodeAt(0) - "a".charCodeAt(0);
      optionIndices.push(index);
      console.log(optionIndices.includes(index), "includedddddddddd");
    });

    console.log(optionIndices, "option indicesssssssss"); // Now you have all option indices in the optionIndices array
    console.log("Correct Options:", correctOptions);
    console.log("Wrong Options:", wrongOptions);
    console.log("Missing Options:", missingOptions);
    console.log(missingOptions.some((item) => item.option_index));
    correctOptions.forEach((option) => {
      console.log(option, "option in loop");
      console.log(option.option_index, "letme try ");
    });
    correctOptions.forEach((option) => {
      const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
      if (!finalTry.includes(newIndex)) {
        setFinalTry((prev) => [...prev, newIndex]);
      }
    });
    wrongOptions.forEach((option) => {
      const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
      if (!finalTry2.includes(newIndex)) {
        setFinalTry2((prev) => [...prev, newIndex]);
      }
    });
    missingOptions.forEach((option) => {
      const newIndex = option.option_index.charCodeAt(0) - "a".charCodeAt(0);
      if (!finalTry3.includes(newIndex)) {
        setFinalTry3((prev) => [...prev, newIndex]);
      }
    });

    console.log(finalTry, "wwwwwwwwwwwwwwwwweeeeeeeeeeee");
    console.log(finalTry2, "finaltry two ");
    // const uniquePreviousValues = [...new Set(previousValues)];
    const finalTryMapCopy = new Map(finalTryMap);
    const finalTry2MapCopy = new Map(finalTry2Map);
    const finalTry3MapCopy = new Map(finalTry3Map);

    finalTryMapCopy.set(qid, userCAArray);
    finalTry2MapCopy.set(qid, userWAArray);
    finalTry3MapCopy.set(qid, missingCorrectIndices);

    setFinalTryMap(finalTryMapCopy);
    setFinalTry2Map(finalTry2MapCopy);
    setFinalTry3Map(finalTry3MapCopy);

    if (!selectedQuestionIds.includes(qid)) {
      setSelectedQuestionIds([...selectedQuestionIds, qid]);
    }

    // Store the answer status as true in local storage
    localStorage.setItem(`answer_${qid}`, true);

    //
  };

  let message;
  if (showCorrectAnswer && submitted) {
    if (correctAnswer === userAnswer) {
      message = (
        <span
          style={{ marginLeft: "10px", fontWeight: "bolder", color: "Green" }}
        >
          Correct Answer!
        </span>
      );
    } else {
      message = (
        <span style={{ marginLeft: "10px", fontWeight: "bold", color: "red" }}>
          Correct Answer is: {correctAnswer}
        </span>
      );
    }
  }

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
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

  // --------------------------------------CONST VARIABLES DECLARATIONS--------------------------
  const [questionData, setQuestionData] = useState({ questions: [] });
  const [value, setValue] = useState("");

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
    let notAnswered = 1; // Set default value to 1
    let marked = 0;
    let markedForReview = 0;
    let Visited = 0;

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

    // Update notAnswered if there are actual notAnswered questions
    if (notAnswered === 1 && answered !== 0) {
      notAnswered = 0;
    }

    setAnsweredCount(answered);
    setNotAnsweredCount(notAnswered);
    setAnsweredmarkedForReviewCount(marked);
    setMarkedForReviewCount(markedForReview);
    setVisitedCount(Visited);
  };

  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questionData.length).fill("")
  );
  const handleQuestionSelect = async (questionNumber) => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/questionOptionsForPB/${decryptedParam1}/${decryptedParam2}`
      );
      setActiveIndex(questionNumber);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData(data);

      const prevQuestion = data.questions[questionNumber - 1]; // Changed here
      const prevQuestionId = prevQuestion ? prevQuestion.question_id : null; // Changed here

      // Check if the answer status is available in local storage
      const answerStatus = localStorage.getItem(`answer_${prevQuestionId}`);
      if (answerStatus === "true") {
        setShowSolution(false);
        setButtonText("View Solution");
      } else {
        setShowSolution(false);
        setButtonText("Submit");
      }

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

      // // Check if the selected question is the last question
      // if (questionNumber === data.questions.length) {
      //   // setCompleteButtonText("Completed");
      // } else {
      //   setCompleteButtonText("Next");
      // }

      // Log the useranswer value
      // Log the entire response data for debugging
      console.log(`Question ${questionNumber} - Response Data:`, data);
      console.log(`Question ${questionNumber} - User Answer:`, useranswer);
      console.log(`Question ${questionNumber} - Is Answered:`, isAnswered);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };

  // const handleQuestionSelect = async (questionNumber) => {
  //   try {
  //     const response = await fetch(
  //       `${BASE_URL}/QuizPage/questionOptions/${testCreationTableId}/${userData.id}`
  //     );
  //     // setShowSolution(false);
  //     // setButtonText("Submit");
  //     // setSubmitted(true)
  //     //   if(questionNumber === currentQuestionIndex){
  //     //     if(buttonText === "View Solution"){
  //     //         setButtonText("View Solution");
  //     //     } else {
  //     //         setButtonText("Submit");
  //     //     }
  //     // }

  //     // if (currentQuestionIndex == setButtonText("View Solution")) {
  //     //   setButtonText("View Solution")
  //     // }
  //     // else {
  //     //   setButtonText("Submit");

  //     // }
  //        // Check if the answer status is available in local storage
  //        const answerStatus = localStorage.getItem(`answer_${prevQuestionId}`);
  //        if (answerStatus === 'true') {
  //          setShowSolution(false);
  //          setButtonText("View Solution");
  //        } else {
  //          setShowSolution(false);
  //          setButtonText("Submit");
  //        }

  //     //   if(questionNumber === "View Solution"){
  //     //     setButtonText("View Solution");
  //     //     setSubmitted(true);
  //     //     // if(questionNumber === "View Solution"){
  //     //     //   setButtonText(false);
  //     //     // }
  //     // } else {
  //     //     // setButtonText("Submit");
  //     // }

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setQuestionData(data);

  //     const updatedQuestionStatus = [...questionStatus];
  //     const updatedIndex = questionNumber - 1; // Calculate the updated index

  //     setCurrentQuestionIndex(updatedIndex); // Update the current question index
  //     updatedQuestionStatus[updatedIndex] = "notAnswered"; // Update the question status at the updated index
  //     setActiveQuestion(updatedIndex); // Set the active question to the updated index

  //     // Extract the useranswer value from the response
  //     let useranswer = null;

  //     if (
  //       data.questions[questionNumber - 1].useranswer &&
  //       data.questions[questionNumber - 1].useranswer.ans !== null
  //     ) {
  //       useranswer = data.questions[questionNumber - 1].useranswer.ans;
  //     }

  //     // Check if the question is answered
  //     let isAnswered = useranswer !== null;

  //     // If useranswer is null, update isAnswered to false
  //     if (useranswer === null) {
  //       isAnswered = false;
  //     }

  //     // Log the useranswer value
  //     // Log the entire response data for debugging
  //     console.log(`Question ${questionNumber} - Response Data:`, data);
  //     console.log(`Question ${questionNumber} - User Answer:`, useranswer);
  //     console.log(`Question ${questionNumber} - Is Answered:`, isAnswered);
  //   } catch (error) {
  //     console.error("Error fetching question data:", error);
  //   }
  // };

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

  const handleAnswerSelected = (e, questionId) => {
    const answer = e.target.value.trim();
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
    setValue(answer); // Update the current answer value
  };

  //end Subjects fetching use effect code

  //users fetching use effect code
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await fetch(
  //         `${BASE_URL}/ughomepage_banner_login/user1`,
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
        `${BASE_URL}/QuizPage/questionOptionsForPB/${decryptedParam1}/${decryptedParam2}`
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

  // const [userData, setUserData] = useState({});
  // user data
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

      // Move to the next question index
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex < questionData.questions.length - 1
          ? prevIndex + 1
          : prevIndex
      );

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
        // setUserData(userData);

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

        if (decryptedParam2) {
          const userId = decryptedParam2;
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
                  userId,
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

  const handleSubmit = async () => {
    try {
      window.alert(
        "Your Test has been Submitted!! Click Ok to See Result.",
        calculateResult()
      );
      setShowExamSumary(true);
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
  // const handlePreviousClick = () => {
  //   setCurrentQuestionIndex((prevIndex) => {
  //     const updatedTimers = [...timers];
  //     updatedTimers[prevIndex] = timer;
  //     setTimers(updatedTimers);
  //     return prevIndex - 1;
  //   });

  //   fetchData();
  //   setActiveQuestion((prevActiveQuestion) => prevActiveQuestion - 1);

  //   // Update activeIndex to the next question index
  //   setActiveIndex((prevIndex) =>
  //     prevIndex < questionData.questions.length ? prevIndex - 1 : prevIndex
  //   );

  //   if (currentQuestionIndex > 0) {
  //     const prevQuestion = questionData.questions[currentQuestionIndex - 1];
  //     const prevQuestionId = prevQuestion.question_id;

  //     // Check if the answer status is available in local storage
  //     const answerStatus = localStorage.getItem(`answer_${prevQuestionId}`);
  //     if (answerStatus === "true") {
  //       setShowSolution(false);
  //       setButtonText("View Solution");
  //     } else {
  //       setShowSolution(false);
  //       setButtonText("Submit");
  //     }

  //     // Retrieve the stored answer from local storage using the question ID
  //     const value = localStorage.getItem(`calculatorValue_${prevQuestionId}`);
  //     // Retrieve the stored value from local storage using the question ID
  //     const storedValue = localStorage.getItem(prevQuestionId);

  //     // Retrieve the stored value with storage key
  //     const storedValueWithKey = localStorage.getItem(STORAGE_KEY);

  //     console.log(
  //       "Stored Value for question",
  //       prevQuestionId,
  //       ":",
  //       storedValue
  //     );
  //     console.log(
  //       "Stored Value with key",
  //       STORAGE_KEY,
  //       ":",
  //       storedValueWithKey
  //     );
  //     console.log(
  //       `Stored Value of currentQuestionIndex is: ${storedValueWithKey}   ${storedValue}`
  //     );
  //     if (value !== null) {
  //       // Parse the stored answer
  //       const parsedValue = JSON.parse(value).value;

  //       // Retrieve the user's response for the previous question
  //       const prevUserResponse = option.ans !== null ? option.ans : parsedValue;

  //       // Retrieve the correct answer for the previous question
  //       const prevCorrectAnswer = calc[currentQuestionIndex - 1]; // Assuming calc is an array of correct answers

  //       // Compare the user's response with the correct answer
  //       if (parseFloat(prevUserResponse) === parseFloat(prevCorrectAnswer)) {
  //         console.log("Correct Answer!");
  //         // Display "Correct Answer!" message
  //       } else {
  //         console.log("Correct Answer is:", prevCorrectAnswer);
  //         // Display the correct answer
  //       }
  //     } else {
  //       // Clear the input if there is no stored answer
  //       setValue("");
  //     }
  //   }
  // };
  // const isNATQuestionAnswered = currentQuestionType.includes("NATD") ||
  // currentQuestionType.includes("NATI");
  const handlePreviousClick = () => {
    setShowSolution(false);
    setButtonText("View Solution");
    setCurrentQuestionIndex((prevIndex) => {
      const updatedTimers = [...timers];
      updatedTimers[prevIndex] = timer;
      setTimers(updatedTimers);
      return prevIndex - 1;
    });

    fetchData();
    setActiveQuestion((prevActiveQuestion) => prevActiveQuestion - 1);

    const currentQuestion = questionData.questions[currentQuestionIndex];
    const updatedQuestionStatus = [...questionStatus];
    // Check if the current question is answered
    const calculatorInputValue = value;
    const isCurrentQuestionAnswered =
      selectedAnswersMap1[currentQuestion.question_id] !== undefined ||
      (selectedAnswersMap2[currentQuestion.question_id] &&
        selectedAnswersMap2[currentQuestion.question_id].length > 0) ||
      calculatorInputValue !== "";
    if (!isCurrentQuestionAnswered) {
      // If the current question is not answered, update the status
      const updatedQuestionStatus = [...questionStatus];
      updatedQuestionStatus[currentQuestionIndex] = "notAnswered";
      setQuestionStatus(updatedQuestionStatus);
      console.log(currentQuestionIndex);
      console.log(updatedQuestionStatus);

      // You may also show a message or perform other actions to indicate that the question is not answered
      console.log("Question not answered!");
    } else {
      updatedQuestionStatus[currentQuestionIndex] = "answered";
      setQuestionStatus(updatedQuestionStatus);
      // Log a message indicating that the question is answered
      console.log("Question answered!");
    }

    // Set the next question status to notAnswered
    // const nextQuestionIndex = currentQuestionIndex - 1;
    // if (nextQuestionIndex < questionData.questions.length) {
    //   const updatedQuestionStatus = [...questionStatus];
    //   updatedQuestionStatus[nextQuestionIndex] = "notAnswered";
    //   setQuestionStatus(updatedQuestionStatus);
    // }

    // Set the previous question status to notAnswered
    const previousQuestionIndex = currentQuestionIndex - 1;
    if (previousQuestionIndex >= 0) {
      const updatedQuestionStatus = [...questionStatus];
      if (updatedQuestionStatus[previousQuestionIndex] === "answered") {
        setQuestionStatus(updatedQuestionStatus);
      } else {
        updatedQuestionStatus[previousQuestionIndex] = "notAnswered";
        setQuestionStatus(updatedQuestionStatus);
      }
    }
    // -------------------------------
    const isNATQuestionAnswered =
      currentQuestionType.includes("NATD") ||
      currentQuestionType.includes("NATI");

    // if(!isNATQuestionAnswered){
    // {buttonText}
    // console.log("NATQuestion not Answered")
    // }else{
    // setButtonText(buttonText)
    // console.log("NATQuestionAnswered")
    // console.log(buttonText)
    // }

    // if (!isNATQuestionAnswered) {
    //   setButtonText("Submit");
    //   console.log("NATQuestion not Answered");
    // } else {
    //   setButtonText("View Solution"); // Set the button text to "View Solution" if the NAT question is answered
    //   console.log("NATQuestionAnswered");
    //   console.log("Button Text:", buttonText); // Log the current value of the button text
    // }

    // Check if the previous question is NATI or NATD
    // const previousQuestionIndex = currentQuestionIndex - 1;
    // if (
    //   previousQuestionIndex >= 0 &&
    //   currentQuestionType.includes("NATD") ||
    //   currentQuestionType.includes("NATI")
    // ) {
    // If the previous question is NATI or NATD and answered, set button text to "View Solution"
    // if (isNATQuestionAnswered) {
    //   setButtonText("View Solution");
    //   console.log("hiiiiiiiiiii")
    // } else {
    //   // If not answered, set button text to "Submit"
    //   setButtonText("Submit");
    //   console.log("hellooooooooooo")
    // }
    // } else {
    //   // For other question types, set button text to "View Solution" by default
    //   setButtonText("View Solution");
    // }
    // -----------------------------------------
    if (currentQuestionIndex > 0) {
      const prevQuestion = questionData.questions[currentQuestionIndex - 1];
      const prevQuestionId = prevQuestion.question_id;

      // Check if the answer status is available in local storage
      const answerStatus = localStorage.getItem(`answer_${prevQuestionId}`);
      if (
        answerStatus === "true" ||
        (isNATQuestionAnswered && answerStatus === "true")
      ) {
        setShowSolution(false);
        setButtonText("View Solution");

        // if (isNATQuestionAnswered) {
        //   setButtonText("View Solution");
        console.log("NATQuestion Answered");
        // }
      } else {
        setShowSolution(false);
        setButtonText("Submit");
      }

      // Retrieve the stored answer from local storage using the question ID
      const value = localStorage.getItem(`calculatorValue_${prevQuestionId}`);
      // Retrieve the stored value from local storage using the question ID
      const storedValue = localStorage.getItem(prevQuestionId);

      // Retrieve the stored value with storage key
      const storedValueWithKey = localStorage.getItem(STORAGE_KEY);

      console.log(
        "Stored Value for question",
        prevQuestionId,
        ":",
        storedValue
      );
      console.log(
        "Stored Value with key",
        STORAGE_KEY,
        ":",
        storedValueWithKey
      );
      console.log(
        `Stored Value of currentQuestionIndex is: ${storedValueWithKey}   ${storedValue}`
      );
      if (value !== null) {
        // Parse the stored answer
        const parsedValue = JSON.parse(value).value;

        // Retrieve the user's response for the previous question
        const prevUserResponse = option.ans !== null ? option.ans : parsedValue;

        // Retrieve the correct answer for the previous question
        const prevCorrectAnswer = calc[currentQuestionIndex - 1]; // Assuming calc is an array of correct answers

        // Compare the user's response with the correct answer
        if (parseFloat(prevUserResponse) === parseFloat(prevCorrectAnswer)) {
          console.log("Correct Answer!");
          // Display "Correct Answer!" message
        } else {
          console.log("Correct Answer is:", prevCorrectAnswer);
          // Display the correct answer
        }
      } else {
        // Clear the input if there is no stored answer
        setValue("");
      }
    }
    if (currentQuestionIndex === questionData.questions.length - 1) {
      setCompleteButtonText("Next");
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

  const isNATQuestionAnswered =
    currentQuestionType.includes("NATD") ||
    currentQuestionType.includes("NATI");
  const isQuestionAnswered =
    currentQuestionType.includes("MSQ") ||
    currentQuestionType.includes("MSQN") ||
    currentQuestionType.includes("MCQ4") ||
    currentQuestionType.includes("MCQ5") ||
    currentQuestionType.includes("CTQ");

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

  useEffect(() => {
    setShowSolution(false); // Set showSolution to true when moving to another question
  }, [currentQuestionIndex]);

  // Convert seconds to hours, minutes, and seconds
  const hours = Math.floor(countDown / 3600);
  const minutes = Math.floor((countDown % 3600) / 60);
  const seconds = countDown % 60;

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

  window.addEventListener("beforeunload", function (event) {
    // Get the specific items you want to retain
    let itemsToRetain = [
      "isLoggedIn",
      "student_dashboard_state",
      "userRole",
      "greeting",
      "token",
    ];
    let retainedItems = {};

    // Iterate over the specific items and store them in a temporary object
    itemsToRetain.forEach((item) => {
      let value = localStorage.getItem(item);
      if (value !== null) {
        retainedItems[item] = value;
      }
    });

    // Clear all items from local storage
    localStorage.clear();

    // Set back the specific items if user is logged in
    if (retainedItems["isLoggedIn"] === "true") {
      Object.entries(retainedItems).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }
  });

  return (
    <div
      className="QuestionPaper_-container"
      ref={quizRef}
      onClick={enterFullscreen}
      style={{ backgroundColor: "white" }}
    >
      {showMalPractisePopup && (
        <div className="MalPracticePopup">
          <div className="malpractice_popup_content">
            <h2>Malpractice Attempt</h2>
            <p>
              "As per our examination rules, your test has been automatically
              submitted as a result of a detected violation. Switching tabs
              during the quiz is strictly prohibited."
            </p>

            <button
              // onClick={handleMalPractiseSubmit}
              onClick={() => {
                handleMalPractiseSubmit(decryptedParam2);
              }}
              style={{ color: "red" }}
              target="_blank"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <>
        {showPopupallpb ? (
          <div className="popup">
            <button
              onClick={() => {
                handleendthetestrestart(decryptedParam2);
              }}
              style={{
                background: "green",
                color: "white",
                display: "flex",
                gap: "0.2rem",
                alignItems: "center",
              }}
            >
              Restart
              <span>
                <IoReloadCircle
                  style={{
                    fontSize: "1.8rem",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                />
              </span>
              {/* <p style={{ background: "green", color: "white", fontWeight: "bold", WebkitTextStrokeWidth: "0.5px",fontSize:"1rem"}}>
<IoReloadCircle />
</p> */}
            </button>
          </div>
        ) : null}
        {/* <button onClick={() => setShowPopup(true)}>Click me</button> */}
      </>
      <div className="quiz_exam_interface_header quiz_exam_interface_header_q_if_H">
        <div className="quiz_exam_interface_header_LOGO ">
          {/* <img src={logo} alt="" /> */}
          <img src={image} alt="Current" />
        </div>
        <p
          className="testname_heading_quizPage"
          key={testName.testCreationTableId}
        >
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
                                                <input
                                                  type="text"
                                                  name={`question-${currentQuestionIndex}`}
                                                  value={
                                                    option.ans !== null
                                                      ? option.ans
                                                      : value
                                                  }
                                                  onClick={(e) =>
                                                    handleAnswerSelected(
                                                      e,
                                                      currentQuestion.question_id
                                                    )
                                                  }
                                                  onChange={(e) =>
                                                    onAnswerSelected3(e)
                                                  }
                                                  placeholder="Enter your answer NATD"
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
                                                />
                                                {selectedQuestionId.map(
                                                  (questionId, index) => {
                                                    const storedAnswer =
                                                      localStorage.getItem(
                                                        `answer_${questionId}`
                                                      );
                                                    const {
                                                      correct,
                                                      correctAnswer,
                                                    } = storedAnswer
                                                      ? JSON.parse(storedAnswer)
                                                      : {};

                                                    return (
                                                      <div key={questionId}>
                                                        {showCorrectAnswer &&
                                                          submitted &&
                                                          questionId ===
                                                            currentQuestion.question_id && (
                                                            <>
                                                              {correct !==
                                                                undefined &&
                                                                !correct && (
                                                                  <div>
                                                                    <p
                                                                      style={{
                                                                        marginLeft:
                                                                          "10px",
                                                                        fontWeight:
                                                                          "bold",
                                                                        color:
                                                                          "red",
                                                                      }}
                                                                    >
                                                                      Wrong
                                                                      Answer!
                                                                    </p>
                                                                    <p>
                                                                      Correct
                                                                      Answer:{" "}
                                                                      {
                                                                        correctAnswer
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                )}
                                                              {correct !==
                                                                undefined &&
                                                                correct && (
                                                                  <span
                                                                    style={{
                                                                      marginLeft:
                                                                        "10px",
                                                                      fontWeight:
                                                                        "bolder",
                                                                      color:
                                                                        "green",
                                                                    }}
                                                                  >
                                                                    Correct
                                                                    Answer!
                                                                  </span>
                                                                )}
                                                            </>
                                                          )}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                              <div>
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the DEL button if submitted
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="7"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="8"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="9"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="4"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="5"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="6"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="1"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="2"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="3"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="0"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="."
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="-"
                                                  onClick={(e) =>
                                                    setValue(
                                                      (option.ans !== null
                                                        ? option.ans
                                                        : value) +
                                                        e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable number buttons if submitted
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
                                                  //  disabled={option.ans || submitted}
                                                  placeholder="Enter your answer NATI"
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
                                                />
                                                {selectedQuestionId.map(
                                                  (questionId, index) => {
                                                    const storedAnswer =
                                                      localStorage.getItem(
                                                        `answer_${questionId}`
                                                      );
                                                    const {
                                                      correct,
                                                      correctAnswer,
                                                    } = storedAnswer
                                                      ? JSON.parse(storedAnswer)
                                                      : {};

                                                    return (
                                                      <div key={questionId}>
                                                        {showCorrectAnswer &&
                                                          submitted &&
                                                          questionId ===
                                                            currentQuestion.question_id && (
                                                            <>
                                                              {correct !==
                                                                undefined &&
                                                                !correct && (
                                                                  <div>
                                                                    <p
                                                                      style={{
                                                                        marginLeft:
                                                                          "10px",
                                                                        fontWeight:
                                                                          "bold",
                                                                        color:
                                                                          "red",
                                                                      }}
                                                                    >
                                                                      Wrong
                                                                      Answer!
                                                                    </p>
                                                                    <p>
                                                                      Correct
                                                                      Answer:{" "}
                                                                      {
                                                                        correctAnswer
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                )}
                                                              {correct !==
                                                                undefined &&
                                                                correct && (
                                                                  <span
                                                                    style={{
                                                                      marginLeft:
                                                                        "10px",
                                                                      fontWeight:
                                                                        "bolder",
                                                                      color:
                                                                        "green",
                                                                    }}
                                                                  >
                                                                    Correct
                                                                    Answer!
                                                                  </span>
                                                                )}
                                                            </>
                                                          )}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                              <div>
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
                                                />
                                                <input
                                                  type="button"
                                                  value="8"
                                                  onClick={(e) =>
                                                    setValue(
                                                      value + e.target.value
                                                    )
                                                  }
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
                                                />
                                              </div>
                                              <div>
                                                <input
                                                  type="button"
                                                  value="4"
                                                  onClick={(e) => {
                                                    if (!option.ans) {
                                                      setValue(
                                                        (option.ans !== null
                                                          ? option.ans
                                                          : value) +
                                                          e.target.value
                                                      );
                                                    }
                                                  }}
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                  disabled={isQuestionSubmitted(
                                                    currentQuestion.question_id
                                                  )} // Disable the input field if submitted
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
                                                disabled={submittedQuestions.includes(
                                                  currentQuestion.question_id
                                                )}
                                                // disabled={submitted}
                                              />
                                              <label htmlFor="">
                                                ({option.option_index})
                                              </label>
                                              <img
                                                src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${option.optionImgName}`}
                                                alt={`Option ${option.option_id}`}
                                              />

                                              {submitted && (
                                                <>
                                                  {selectedQuestionId.includes(
                                                    currentQuestion.question_id
                                                  ) && (
                                                    <>
                                                      {option.option_index ===
                                                        currentQuestion.answer.answer_text.trim() && (
                                                        <span className="correct-answer-mark">
                                                          &#10004;
                                                        </span>
                                                      )}
                                                      {selectedAnswersMap1[
                                                        currentQuestion
                                                          .question_id
                                                      ] === optionIndex &&
                                                        option.option_index !==
                                                          currentQuestion.answer.answer_text.trim() && (
                                                          <span className="wrong-answer-mark">
                                                            x
                                                          </span>
                                                        )}
                                                    </>
                                                  )}
                                                </>
                                              )}
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
                                                disabled={submittedQuestions.includes(
                                                  currentQuestion.question_id
                                                )}
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
                                              {submitted && (
                                                <>
                                                  {selectedQuestionId.includes(
                                                    currentQuestion.question_id
                                                  ) && (
                                                    <>
                                                      {option.option_index ===
                                                        currentQuestion.answer.answer_text.trim() && (
                                                        <span className="correct-answer-mark">
                                                          &#10004;
                                                        </span>
                                                      )}
                                                      {selectedAnswersMap1[
                                                        currentQuestion
                                                          .question_id
                                                      ] === optionIndex &&
                                                        option.option_index !==
                                                          currentQuestion.answer.answer_text.trim() && (
                                                          <span className="wrong-answer-mark">
                                                            &#10060;
                                                          </span>
                                                        )}{" "}
                                                    </>
                                                  )}
                                                </>
                                              )}
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
                                                disabled={submittedQuestions.includes(
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                )}
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
                                              {selectedQuestionIds.includes(
                                                currentQuestion.question_id
                                              ) && (
                                                <>
                                                  {finalTryMap
                                                    .get(
                                                      currentQuestion.question_id
                                                    )
                                                    ?.map((value, index) => (
                                                      <span
                                                        key={`correct_${index}`}
                                                      >
                                                        {value ===
                                                          optionIndex && (
                                                          <span className="correct-answer-mark">
                                                            &#10004;
                                                          </span>
                                                        )}
                                                      </span>
                                                    ))}
                                                  {finalTry2Map
                                                    .get(
                                                      currentQuestion.question_id
                                                    )
                                                    ?.map((value, index) => (
                                                      <span
                                                        key={`wrong_${index}`}
                                                      >
                                                        {value ===
                                                          optionIndex && (
                                                          <span className="wrong-answer-mark">
                                                            &#10060;
                                                          </span>
                                                        )}
                                                      </span>
                                                    ))}
                                                  {finalTry3Map
                                                    .get(
                                                      currentQuestion.question_id
                                                    )
                                                    ?.map((value, index) => (
                                                      <span
                                                        key={`missing_${index}`}
                                                      >
                                                        {value ===
                                                          optionIndex && (
                                                          <span className="correct-answer-mark">
                                                            MissingCorrectOption:&#10004;
                                                          </span>
                                                        )}
                                                      </span>
                                                    ))}
                                                </>
                                              )}
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
                                                disabled={submittedQuestions.includes(
                                                  questionData.questions[
                                                    currentQuestionIndex
                                                  ]?.question_id
                                                )}
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
                                              {selectedQuestionIds.includes(
                                                currentQuestion.question_id
                                              ) && (
                                                <>
                                                  {finalTryMap
                                                    .get(
                                                      currentQuestion.question_id
                                                    )
                                                    ?.map((value, index) => (
                                                      <span
                                                        key={`correct_${index}`}
                                                      >
                                                        {value ===
                                                          optionIndex && (
                                                          <span className="correct-answer-mark">
                                                            &#10004;
                                                          </span>
                                                        )}
                                                      </span>
                                                    ))}
                                                  {finalTry2Map
                                                    .get(
                                                      currentQuestion.question_id
                                                    )
                                                    ?.map((value, index) => (
                                                      <span
                                                        key={`wrong_${index}`}
                                                      >
                                                        {value ===
                                                          optionIndex && (
                                                          <span className="wrong-answer-mark">
                                                            &#10060;
                                                          </span>
                                                        )}
                                                      </span>
                                                    ))}
                                                  {finalTry3Map
                                                    .get(
                                                      currentQuestion.question_id
                                                    )
                                                    ?.map((value, index) => (
                                                      <span
                                                        key={`missing_${index}`}
                                                      >
                                                        {value ===
                                                          optionIndex && (
                                                          <span className="correct-answer-mark">
                                                            MissingCorrectOption:&#10004;
                                                          </span>
                                                        )}
                                                      </span>
                                                    ))}
                                                </>
                                              )}
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
                                                disabled={submittedQuestions.includes(
                                                  currentQuestion.question_id
                                                )}
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
                                              {submitted && (
                                                <>
                                                  {selectedQuestionId.includes(
                                                    currentQuestion.question_id
                                                  ) && (
                                                    <>
                                                      {option.option_index ===
                                                        currentQuestion.answer.answer_text.trim() && (
                                                        <span
                                                          id="correct_mark"
                                                          className="correct-answer-mark"
                                                        >
                                                          &#10004;
                                                        </span>
                                                      )}
                                                      {selectedAnswersMap1[
                                                        currentQuestion
                                                          .question_id
                                                      ] === optionIndex &&
                                                        option.option_index !==
                                                          currentQuestion.answer.answer_text.trim() && (
                                                          <span
                                                            id="wrong_mark"
                                                            className="wrong-answer-mark"
                                                          >
                                                            &#10060;
                                                          </span>
                                                        )}{" "}
                                                    </>
                                                  )}
                                                </>
                                              )}
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
                                                disabled={submittedQuestions.includes(
                                                  currentQuestion.question_id
                                                )}
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
                                              {submitted && (
                                                <>
                                                  {selectedQuestionId.includes(
                                                    currentQuestion.question_id
                                                  ) && (
                                                    <>
                                                      {option.option_index ===
                                                        currentQuestion.answer.answer_text.trim() && (
                                                        <span className="correct-answer-mark">
                                                          &#10004;
                                                        </span>
                                                      )}
                                                      {selectedAnswersMap1[
                                                        currentQuestion
                                                          .question_id
                                                      ] === optionIndex &&
                                                        option.option_index !==
                                                          currentQuestion.answer.answer_text.trim() && (
                                                          <span className="wrong-answer-mark">
                                                            &#10060;
                                                          </span>
                                                        )}
                                                    </>
                                                  )}
                                                </>
                                              )}
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
                      </div>
                    </div>
                    <div className="quiz_btns_contaioner">
                      <div>
                        <Tooltip title="Click here to Submit answer" arrow>
                          <button
                            className="Quiz_Save_MarkforReview"
                            onClick={() => {
                              handleQType(
                                currentQuestionType,
                                questionData.questions[currentQuestionIndex]
                                  .question_id
                              );
                            }}
                            disabled={showSolution && buttonText === "Submit"}
                          >
                            {/* Check if it's a NATD or NATI question */}
                            {(currentQuestionType.includes("NATD") ||
                              currentQuestionType.includes("NATI")) &&
                              // If NATD or NATI question
                              (isNATQuestionAnswered ? (
                                // If answered, show "View Solution" button
                                <div className="view_sol_btn">{buttonText}</div>
                              ) : (
                                <div className="view_sol_btn">buttonText</div>
                              ))}

                            {(currentQuestionType.includes("MCQ4") ||
                              currentQuestionType.includes("MCQ5") ||
                              currentQuestionType.includes("MSQ") ||
                              currentQuestionType.includes("MSQN")) && (
                              // If MCQ4, MCQ5, MSQ, or MSQN question
                              <div className="view_sol_btn">
                                {isQuestionAnswered ? buttonText : buttonText}
                              </div>
                            )}
                          </button>
                        </Tooltip>

                        <Tooltip title="Click here to  End the Test" arrow>
                          <button
                            className="Quiz_Save_MarkforReview"
                            onClick={() => {
                              handleendthetest(decryptedParam2);
                            }}
                            disabled={showSolution && buttonText === "Submit"}
                          >
                            End Test
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
                          <button onClick={onNextQuestion}>
                            Next<i class="fa-solid fa-angles-right"></i>
                          </button>
                        </Tooltip>
                        {/* <Tooltip title="Click here to go Next" arrow>
                        <button onClick={handleNextQuestion}>Next</button>
                      </Tooltip> */}

                        {/* <Tooltip title="Click here to Submit" arrow>
                        <button
                          style={{ background: "#f0a607da" }}
                          onClick={handleSubmit}
                          id="resume_btn"
                        >
                          Submit
                        </button>
                      </Tooltip> */}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {showSolution && (
                <div className="solution-card ">
                  <div>
                    <h2>Solution:</h2>
                    {/* {currentQuestion.solution.solutionImgName} */}
                    {currentQuestion.solution &&
                      currentQuestion.solution.solutionImgName && (
                        <div className="solution_div">
                          <img
                            src={`${BASE_URL}/uploads/${currentQuestion.documen_name}/${currentQuestion.solution.solutionImgName}`}
                            alt={`solutionImage ${currentQuestion.solution.solution_id}`}
                          />
                          <button
                            className="card_clse_btnn"
                            onClick={handlecloseSolution}
                          >
                            x
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              )}

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
                <QuestionBankQuizButtonsFunctionality
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
                  setButtonText={setButtonText}
                  activeIndex={activeIndex}
                  userData={userData}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="result">
          <h3 id="result_header">Exam Summary</h3>
          <div className="result_page_links"></div>

          <div className="Exam_summary_table">
            <table id="customers">
              <tr>
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

          <div>
            <h2 className="Exam_summary_question_tag">
              Are you sure you want to submit ? <br />
              No changes will be allowed after submission.
            </h2>

            <div className="Exam_summary_btns">
              <Tooltip title="Yes" arrow>
                <>
                  <Link
                    className="es_btn"
                    to={`/TestResultsPage/${decryptedParam1}/${decryptedParam2}`}
                    // to='/Submit_Page'
                    onClick={handleYes}
                  >
                    Yes
                  </Link>
                </>
              </Tooltip>
              <Tooltip title="No" arrow>
                <button className="es_btn" onClick={handleNo}>
                  NO
                </button>
              </Tooltip>
              {showPopup && (
                <div className="popup">
                  <div className="popup-content">
                    {/* <span className="close" onClick={() => setShowPopup(false)}>
                      &times;
                    </span> */}
                    <div className="submit-page-container">
                      <div className="submit-page-card">
                        <h2 className="submit-page-heading">
                          Your Test has been submitted successfully.
                        </h2>
                        <h3 className="submit-page-subheading">
                          View your Test Report
                        </h3>
                        <button
                          onClick={openPopup}
                          className="submit-page-button"
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankQuiz;
