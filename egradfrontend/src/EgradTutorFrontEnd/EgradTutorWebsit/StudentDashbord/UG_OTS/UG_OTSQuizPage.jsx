import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation,Link } from "react-router-dom";
import "./UG_OTSQuizPage.css";
import BASE_URL from "../../../../apiConfig";
import { decryptData,encryptData } from "../utils/crypto";
import { BiMenuAltLeft } from "react-icons/bi";
import { MdOutlineTimer } from "react-icons/md";
import "../Style/Watermark.css";

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
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [markedForReviewQuestions, setMarkedForReviewQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [showExamSumary, setShowExamSumary] = useState(false);
  const location = useLocation();
  const { userData } = location.state || {};
  const [testName, setTestName] = useState("");
  const navigate = useNavigate();
  const { param1, param2 } = useParams();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");
  const [image, setImage] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [countDown, setCountDown] = useState(180 * 60);
  const timerId = useRef();
  const [showButtonNo, setShowButtonNo] = useState(false);
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
        // Set the test name
        if (data && data.length > 0) {
          setTestName(data[0].TestName);
        }

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

  useEffect(() => {
    if (decryptedParam2) {
      const fetchStudentDetails = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/StudentSettings/fetchStudentDetailstest/${decryptedParam2}`
          );
          setStudentDetails(response.data);
        } catch (err) {
          setError("Error fetching student details");
          console.error(err);
        }
      };
      fetchStudentDetails();
    }
  }, [decryptedParam2]);
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

  const handleSectionClick = (sectionId) => {
    setSelectedSectionId(sectionId);
    const selectedSection = testData.subjects
      .find((subject) => subject.subjectId === selectedSubjectId)
      .sections.find((section) => section.sectionId === sectionId);
    setSelectedQuestionId(selectedSection.questions[0].question_id);
  };

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
  // const handleSubmit = () => {
  //   const allQuestions = testData.subjects.flatMap((subject) =>
  //     subject.sections.flatMap((section) => section.questions)
  //   );
  //   const allAnswered = allQuestions.every((question) => {
  //     if (
  //       question.quesion_type.some((type) =>
  //         [1, 2, 7, 8].includes(type.quesionTypeId)
  //       )
  //     ) {
  //       return radioResponses[question.question_id] !== undefined;
  //     }
  //     if (
  //       question.quesion_type.some((type) =>
  //         [3, 4].includes(type.quesionTypeId)
  //       )
  //     ) {
  //       return (checkboxResponses[question.question_id] || []).length > 0;
  //     }
  //     if (
  //       question.quesion_type.some((type) =>
  //         [5, 6].includes(type.quesionTypeId)
  //       )
  //     ) {
  //       return textResponses[question.question_id] !== undefined;
  //     }
  //     return false;
  //   });

  //   if (!allAnswered) {
  //     alert("Please answer all questions before submitting.");
  //     return;
  //   }

  //   // Submit logic here (e.g., POST request)
  //   alert("Quiz submitted successfully!");
  // };

  const handleSubmit = async () => {
    try {
      setShowExamSumary(true);
      // setShowButtonNo(true);
      // calculateResult();

      // const NotVisitedb = remainingQuestions < 0 ? 0 : remainingQuestions;
      // const counts = calculateQuestionCounts();
      // setAnsweredCount(counts.answered);
      // setNotAnsweredCount(counts.notAnswered);
      // setMarkedForReviewCount(counts.markedForReview);
      // setAnsweredmarkedForReviewCount(counts.answeredmarkedForReviewCount);
      // setVisitedCount(counts.VisitedCount);

      // const currentQuestion = questionData.questions[currentQuestionIndex];
      // const questionId = currentQuestion.question_id;

      // const formattedTime = WformatTime(wtimer);

      // // Save exam summary
      // const saveExamSummaryResponse = await fetch(
      //   `${BASE_URL}/QuizPage/saveExamSummary`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       userId: decryptedParam2,
      //       totalUnattempted: notAnsweredCount,
      //       totalAnswered: answeredCount,
      //       NotVisitedb: NotVisitedb,
      //       testCreationTableId: decryptedParam1,
      //     }),
      //   }
      // );

      // const saveExamSummaryResult = await saveExamSummaryResponse.json();
      // console.log("Exam summary saved:", saveExamSummaryResult);

      // // Submit time left
      // const submitTimeLeftResponse = await fetch(
      //   `${BASE_URL}/QuizPage/submitTimeLeft`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       userId: decryptedParam2,
      //       testCreationTableId: decryptedParam1,
      //       timeLeft: formattedTime,
      //     }),
      //   }
      // );

      // const submitTimeLeftResult = await submitTimeLeftResponse.json();
      // console.log("Time left submission result:", submitTimeLeftResult);

      // // Clear local storage data for the current question
      // if (questionId) {
      //   try {
      //     console.log(
      //       "Removing from local storage for questionId:",
      //       questionId
      //     );
      //     localStorage.removeItem(`calculatorValue_${questionId}`);
      //     console.log("Item removed successfully.");
      //   } catch (error) {
      //     console.error("Error removing item from local storage:", error);
      //   }
      // }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
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
  // const handleSaveAndNext = async () => {
  //   try {
  //     console.log("radioResponses", radioResponses);
  //     console.log("checkboxResponses", checkboxResponses);

  //     // Flatten all questions from the testData
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

  //     // Prepare response data only if there is an actual response
  //     if (answered) {
  //       const selectedOption1 = radioResponses[selectedQuestionId];
  //       const selectedOption2 = checkboxResponses[selectedQuestionId];

  //       // Extract optionIndex values
  //       const optionIndexes1 = selectedOption1
  //         ? [selectedOption1.optionIndex]
  //         : [];
  //       const optionIndexes2 = selectedOption2
  //         ? selectedOption2.map((item) => item.optionIndex)
  //         : [];

  //       // Convert option indexes to characters
  //       const optionIndexes1CharCodes = optionIndexes1.map((index) =>
  //         String.fromCharCode("a".charCodeAt(0) + index)
  //       );
  //       const optionIndexes2CharCodes = optionIndexes2.map((index) =>
  //         String.fromCharCode("a".charCodeAt(0) + index)
  //       );

  //       // Construct response object
  //       const response = {
  //         userId: decryptedParam2,
  //         questionId: selectedQuestionId,
  //         testCreationTableId: decryptedParam1,
  //         subjectId: selectedSubjectId,
  //         sectionId: selectedSectionId,
  //         [selectedQuestionId]: {
  //           optionIndexes1: selectedOption1 ? selectedOption1.optionId : "",
  //           optionIndexes2: (checkboxResponses[selectedQuestionId] || [])
  //             .map((item) => item.optionId)
  //             .join(","),
  //           optionIndexes1CharCodes,
  //           optionIndexes2CharCodes,
  //           calculatorInputValue: textResponses[selectedQuestionId] || "",
  //         },
  //       };

  //       console.log("response saving:", response);

  //       // Store response data only if there is an actual response
  //       await fetch(`${BASE_URL}/QuizPage/response`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(response),
  //       });
  //     }

  //     // Determine the next question to display
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
  //       nextQuestionId =
  //         selectedSection.questions[questionIndex + 1].question_id;
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
  //       setVisitedQuestions((prev) => {
  //         if (!prev.includes(nextQuestionId)) {
  //           return [...prev, nextQuestionId];
  //         }
  //         return prev;
  //       });

  //       // Handle the case where the next question is not visited, not answered, and not marked for review
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
  //   } catch (error) {
  //     console.error("Error handling save and next:", error);
  //   }
  // };

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

  //-----------------Over all counts
  // const visitedCount = visitedQuestions.length;
  // const totalQuestions = testData?.subjects.flatMap((subject) =>
  //   subject.sections.flatMap((section) => section.questions)
  // ).length;

  // // Calculate Answered and Marked for Review count
  // const answeredAndMarkForReviewCount = answeredQuestions.filter((id) =>
  //   markedForReviewQuestions.includes(id)
  // ).length;

  // // Calculate counts excluding the Answered and Marked for Review count
  // const answeredOnlyCount =
  //   answeredQuestions.length - answeredAndMarkForReviewCount;
  // const markForReviewOnlyCount =
  //   markedForReviewQuestions.length - answeredAndMarkForReviewCount;

  // // Calculate Not Answered but Visited count
  // const notAnsweredButVisitedCount = visitedQuestions.filter(
  //   (id) =>
  //     !answeredQuestions.includes(id) && !markedForReviewQuestions.includes(id)
  // ).length;

  // const notVisitedCount = totalQuestions - visitedQuestions.length;

  // const getCountsBySubjectAndSection = (subjects) => {
  //   // Initialize objects to hold counts
  //   const subjectCounts = {};
  //   const sectionCounts = {};

  //   // Iterate through subjects and their sections
  //   subjects.forEach((subject) => {
  //     subjectCounts[subject.subjectId] = {
  //       totalQuestions: subject.sections.flatMap((section) => section.questions)
  //         .length,
  //       answeredQuestions: answeredQuestions.filter((id) =>
  //         subject.sections
  //           .flatMap((section) =>
  //             section.questions.map((question) => question.question_id)
  //           )
  //           .includes(id)
  //       ).length,
  //       markedForReviewQuestions: markedForReviewQuestions.filter((id) =>
  //         subject.sections
  //           .flatMap((section) =>
  //             section.questions.map((question) => question.question_id)
  //           )
  //           .includes(id)
  //       ).length,
  //       notAnsweredButVisited: visitedQuestions.filter(
  //         (id) =>
  //           !answeredQuestions.includes(id) &&
  //           !markedForReviewQuestions.includes(id) &&
  //           subject.sections
  //             .flatMap((section) =>
  //               section.questions.map((question) => question.question_id)
  //             )
  //             .includes(id)
  //       ).length,
  //       notVisited:
  //         subject.sections.flatMap((section) => section.questions).length -
  //         visitedQuestions.filter((id) =>
  //           subject.sections
  //             .flatMap((section) =>
  //               section.questions.map((question) => question.question_id)
  //             )
  //             .includes(id)
  //         ).length,
  //     };

  //     subject.sections.forEach((section) => {
  //       sectionCounts[section.sectionId] = {
  //         totalQuestions: section.questions.length,
  //         answeredQuestions: answeredQuestions.filter((id) =>
  //           section.questions
  //             .map((question) => question.question_id)
  //             .includes(id)
  //         ).length,
  //         markedForReviewQuestions: markedForReviewQuestions.filter((id) =>
  //           section.questions
  //             .map((question) => question.question_id)
  //             .includes(id)
  //         ).length,
  //         notAnsweredButVisited: visitedQuestions.filter(
  //           (id) =>
  //             !answeredQuestions.includes(id) &&
  //             !markedForReviewQuestions.includes(id) &&
  //             section.questions
  //               .map((question) => question.question_id)
  //               .includes(id)
  //         ).length,
  //         notVisited:
  //           section.questions.length -
  //           visitedQuestions.filter((id) =>
  //             section.questions
  //               .map((question) => question.question_id)
  //               .includes(id)
  //           ).length,
  //       };
  //     });
  //   });

  //   return { subjectCounts, sectionCounts };
  // };

  // const { subjectCounts, sectionCounts } = getCountsBySubjectAndSection(
  //   testData?.subjects || []
  // );

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  // Find the selected subject
  const selectedSubjectName = testData.subjects.find(
    (subject) => subject.subjectId === selectedSubjectId
  );

  // Find the selected section within the selected subject
  const selectedSectionName = selectedSubject
    ? selectedSubject.sections.find(
        (section) => section.sectionId === selectedSectionId
      )
    : null;

    
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

      navigate(url, { state: { userData } });
    } catch (error) {
      console.error("Error encrypting data:", error);
    }
    // try {
    //   // const userId = decryptedParam2;
    //   console.log("sddvfnjdxnvjkncmvncx");
    //   console.log(decryptedParam2);
    //   const courseCreationId = testDetails?.[0]?.courseCreationId;
    //   console.log(
    //     courseCreationId ? courseCreationId : "Course creation ID not available"
    //   );
    //   console.log(decryptedParam1);

    //   // Prepare data for the POST request
    //   const postData = {
    //     userId: decryptedParam2,
    //     courseCreationId: courseCreationId,
    //     testCreationTableId: decryptedParam1,
    //     test_status: "Completed",
    //   };

    //   // Make the POST request
    //   const response = await fetch(
    //     `${BASE_URL}/QuizPage/insertTestAttemptStatus`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(postData),
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error("Failed to insert test attempt status");
    //   }
    //   console.log("Test attempt status inserted successfully");
    //   // await fetchQuestionCount();
    //   // Navigate to the test results page
    //   // navigate(`/Submit_Page`);
    // } catch (error) {
    //   console.error("Error:", error.message);
    // }
  };
  
  const handleNo = () => {
    setShowExamSumary(false);
  };
  return (
    <div>
      <div className="quiz_exam_interface_header quiz_exam_interface_header_q_if_H">
        <div className="quiz_exam_interface_header_LOGO ">
          <img src={image} alt="Current" />
        </div>
        <p className="ots_quiz_testname" key={testName.decryptedParam1}>
          {testData.TestName}
        </p>
      </div>
      {!showExamSumary ? (
        <div className="quiz_exam_interface_body">
          <div className="quizPagewatermark">
            <div className="quiz_exam_interface_body_left_container">
              <div className="quiz_exam_interface_exam_subCONTAINEr">
                <div className="quiz_exam_interface_exam_qN_Q">
                  <div class="SUBJECTS_CONTAINER">
                    <div className="subject_container">
                      {testData.subjects.map((subject) => (
                        <button
                          key={subject.subjectId}
                          onClick={() => handleSubjectClick(subject.subjectId)}
                          className={`sidebar-button ${
                            subject.subjectId === selectedSubjectId
                              ? "active"
                              : ""
                          }`}
                        >
                          {subject.SubjectName}
                        </button>
                      ))}
                    </div>
                    <div className="sections_conatiner">
                      {selectedSubjectId && (
                        <div className="child_sections_conatiner">
                          {testData.subjects
                            .find(
                              (subject) =>
                                subject.subjectId === selectedSubjectId
                            )
                            .sections.map((section) => (
                              <button
                                key={section.sectionId}
                                onClick={() =>
                                  handleSectionClick(section.sectionId)
                                }
                                // className={
                                //   selectedSectionId === section.sectionId ? "selected" : ""
                                // }
                                className={`sidebar-button ${
                                  section.sectionId === selectedSectionId
                                    ? "active"
                                    : ""
                                }`}
                              >
                                {section.SectionName}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="time_qtype_div">
                      <div className="qtype_timer">
                        <p className="qtype">
                          {selectedQuestion.quesion_type.map((type) => (
                            <div key={type.quesionTypeId}>
                              {type.typeofQuestion}
                            </div>
                          ))}
                        </p>
                        <p className="time_left_tag">
                          <span id="time_left_icon">
                            <MdOutlineTimer />
                          </span>
                          <div>
                            Time Left: {hours.toString().padStart(2, "0")}:
                            {minutes.toString().padStart(2, "0")}:
                            {seconds.toString().padStart(2, "0")}
                          </div>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedQuestion && (
                  <div className="question_options_div">
                    <div className="paragraphQuestion_div">
                      <div className="pravagragh_container ">
                        {selectedQuestion.paragraph &&
                          selectedQuestion.paragraph.paragraphImg && (
                            <div className="Paragraph_div ">
                              <b>Paragraph:</b>
                              <img
                                src={`${BASE_URL}/uploads/${selectedQuestion.documen_name}/${selectedQuestion.paragraph.paragraphImg}`}
                                alt={`ParagraphImage ${selectedQuestion.paragraph.paragraph_Id}`}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="question_number_continer">
                      <div id="question_number_div">
                        <b>Question</b>
                        <h4 id="question_number_tag">
                          {currentQuestionIndex}.
                        </h4>
                      </div>
                      <div>
                        <img
                          className="question_image"
                          src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${selectedQuestion.questionImgName}`}
                          alt={`Question ${selectedQuestion.question_id}`}
                        />
                      </div>
                    </div>
                    <div className="parent_div">
                      {selectedQuestion.quesion_type.some((type) =>
                        [1, 2, 7, 8].includes(type.quesionTypeId)
                      ) && (
                        <div className="options">
                          {selectedQuestion.options.map(
                            (option, optionIndex) => (
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
                                    radioResponses[selectedQuestion.question_id]
                                      ?.optionId === option.option_id
                                  }
                                  onChange={() =>
                                    handleRadioChange(
                                      selectedQuestion.question_id,
                                      option.option_id,
                                      optionIndex
                                    )
                                  }
                                />
                                (
                                {String.fromCharCode(
                                  "a".charCodeAt(0) + optionIndex
                                )}
                                )
                                <img
                                  src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${option.optionImgName}`}
                                  alt={`Option ${option.option_index}`}
                                />
                              </div>
                            )
                          )}
                        </div>
                      )}
                      {selectedQuestion.quesion_type.some((type) =>
                        [3, 4].includes(type.quesionTypeId)
                      ) && (
                        <div className="options">
                          {selectedQuestion.options.map(
                            (option, optionIndex) => (
                              <div key={option.option_id}>
                                <input
                                  type="checkbox"
                                  name={`question_${selectedQuestion.question_id}`}
                                  value={option.option_id}
                                  checked={checkboxResponses[
                                    selectedQuestion.question_id
                                  ]?.some(
                                    (resp) => resp.optionId === option.option_id
                                  )}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      selectedQuestion.question_id,
                                      option.option_id,
                                      e.target.checked,
                                      optionIndex
                                    )
                                  }
                                />
                                (
                                {String.fromCharCode(
                                  "a".charCodeAt(0) + optionIndex
                                )}
                                )
                                <img
                                  src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${option.optionImgName}`}
                                  alt={`Option ${option.option_index}`}
                                />
                              </div>
                            )
                          )}
                        </div>
                      )}
                      <div className="quiz_exam_interface_exam_qN_Q_options_calculator_input">
                        {selectedQuestion.quesion_type.some((type) =>
                          [5].includes(type.quesionTypeId)
                        ) && (
                          <>
                            <div className="calculator">
                              <div className="display">
                                <label>Answer:</label>
                                <input
                                  type="number"
                                  id="input_number_text_box"
                                  value={
                                    textResponses[
                                      selectedQuestion.question_id
                                    ] || ""
                                  }
                                  placeholder="Enter your answer"
                                  onChange={(e) =>
                                    handleTextChange(
                                      selectedQuestion.question_id,
                                      e.target.value
                                    )
                                  }
                                  // onClick={() => handleClickInput(selectedQuestion.question_id)}
                                />
                                <div className="input_numbers_div">
                                  {[
                                    "DEL",
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
                                    "-",
                                  ].map((key) => (
                                    <button
                                      key={key}
                                      onClick={() => handleKeypadClick(key)}
                                      className={
                                        key === "DEL"
                                          ? "del_button"
                                          : "number_btn"
                                      }
                                    >
                                      {key}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {selectedQuestion.quesion_type.some((type) =>
                          [6].includes(type.quesionTypeId)
                        ) && (
                          <>
                            <div className="calculator">
                              <div className="display">
                                <label>Answer:</label>
                                <input
                                  type="number"
                                  id="input_number_text_box"
                                  value={
                                    textResponses[
                                      selectedQuestion.question_id
                                    ] || ""
                                  }
                                  placeholder="Enter your answer"
                                  onChange={(e) =>
                                    handleTextChange(
                                      selectedQuestion.question_id,
                                      e.target.value
                                    )
                                  }
                                  // onClick={() => handleClickInput(selectedQuestion.question_id)}
                                />
                                <div className="input_numbers_div">
                                  {[
                                    "DEL",
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
                                    "-",
                                    ".",
                                  ].map((key) => (
                                    <button
                                      key={key}
                                      onClick={() => handleKeypadClick(key)}
                                      className={
                                        key === "DEL"
                                          ? "del_button"
                                          : "number_btn"
                                      }
                                    >
                                      {key}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="quiz_btns_contaioner">
                <div>
                  <button
                    className="Quiz_Save_MarkforReview"
                    onClick={handleMarkForReview}
                    title="Click here to Save & Mark for Review"
                  >
                    Save & Mark for Review
                  </button>
                  <button
                    className="Quiz_clearResponse"
                    onClick={handleClearResponse}
                    title="Click here to Clear Response"
                  >
                    Clear Response
                  </button>
                  <button
                    title="Click here to Save & Next"
                    className="quizsave_next"
                    onClick={handleSaveAndNext}
                  >
                    Save & Next
                  </button>
                </div>
                <div className="quiz_Next_back">
                  <button
                    className="previous-btn"
                    onClick={handlePreviousClick}
                    // disabled={currentQuestionIndex === 0}
                    title="Click here to go Back"
                  >
                    <i className="fa-solid fa-angles-left"></i> Back
                  </button>
                  <button
                    style={{ background: "#f0a607da" }}
                    onClick={handleSubmit}
                    id="submit_btn"
                    title="Click here to Submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="quiz_exam_interface_body_right_container">
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
                <div className="right-side-bar">
                  <div className="rightSidebar-topHeader">
                    {studentDetails.map((student, index) => (
                      <div key={index}>
                        <img
                          className="users_profile_img"
                          src={`${BASE_URL}/uploads/studentinfoimeages/${student.UplodadPhto}`}
                          alt={`no img${student.UplodadPhto}`}
                        />
                        <p>Candidate Name:{student.candidateName}</p>
                      </div>
                    ))}
                    <p key={testName.testCreationTableId}>
                      Test Name: {testData.TestName}
                    </p>
                  </div>
                  <div className="buttons_container">
                    <p className="abt_Question_Palette">
                      Your viewing{" "}
                      {selectedSubjectName && (
                        <p className="sub_section">
                          {selectedSubject.SubjectName}
                        </p>
                      )}{" "}
                      -{" "}
                      {selectedSectionName && (
                        <p className="sub_section">
                          {selectedSection.SectionName}
                        </p>
                      )}{" "}
                      Question Palette
                    </p>

                    <div className="ques-btn">
                      <ul className="btn-ul quesAns-btn">
                        {questions.map((question, index) => {
                          let buttonClass = "question_button";

                          const isAnswered = answeredQuestions.includes(
                            question.question_id
                          );
                          const isNotAnswered = notAnsweredQuestions.includes(
                            question.question_id
                          );
                          const isMarkedForReview =
                            markedForReviewQuestions.includes(
                              question.question_id
                            );
                          const isVisited = visitedQuestions.includes(
                            question.question_id
                          );
                          const isActive =
                            selectedQuestionId === question.question_id;
                          // Single if-else statement to determine the button class
                          if (isMarkedForReview) {
                            buttonClass += isAnswered
                              ? " purpleBox"
                              : " blueBox"; // Marked for review
                          }
                          if (isAnswered) {
                            buttonClass += " answered"; // Answered question
                          } else if (isNotAnswered) {
                            buttonClass += " notAnswered"; // Visited but not answered
                          } else if (isVisited) {
                            buttonClass += " question_button"; // Visited but not interacted with
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
                              onClick={() =>
                                handleQuestionClick(question.question_id)
                              }
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="sidebar-footer">
                    <h4 className="sidebar-footer-header">Legend:</h4>
                    <div className="footer-btns">
                      <div className="inst-btns">
                        {" "}
                        <p className="question_button" title="VisitedCount">
                          {notVisitedCount}
                        </p>
                        <span>Not Visited</span>
                      </div>
                      <div className="inst-btns">
                        <p
                          className="instruction-btn1 r_S_B_BTNS"
                          title="answeredCount"
                        >
                          {answeredOnlyCount}
                        </p>
                        <span>Answered</span>
                      </div>
                      <div className="inst-btns">
                        <p
                          className="instruction-btn2 r_S_B_BTNS"
                          title="notAnsweredCount"
                        >
                          {notAnsweredButVisitedCount}
                        </p>
                        <span>Not Answered</span>
                      </div>
                      <div className="inst-btns">
                        <p
                          className="instruction-btn3 r_S_B_BTNS"
                          title="answeredmarkedForReviewCount"
                        >
                          {answeredAndMarkForReviewCount}
                        </p>
                        <span>Marked for Review</span>
                      </div>
                      <div className="inst-btns">
                        <p
                          className="instruction-btn4 r_S_B_BTNS"
                          title="markedForReviewCount"
                        >
                          {markForReviewOnlyCount}
                        </p>
                        <span>
                          Answered & Marked for Review (will be considered for
                          evaluation)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
              <td>{notVisitedCount}</td>
              <td>{answeredOnlyCount}</td>
              <td>{notAnsweredButVisitedCount}</td>
              <td>{notVisitedCount}</td>
              <td>{markForReviewOnlyCount}</td>
              <td>{answeredAndMarkForReviewCount}</td>
            </tr>
          </table>
        </div>

          <div>
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
              <>
                <Link
                  className="es_btn"
                  onClick={handleYes}
                  title="Click here to go Next"
                >
                  Okay
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="es_btn"
                  // to={`/TestResultsPage/${decryptedParam1}/${userData.id}`}
                  // to='/Submit_Page'
                  onClick={handleYes}
                  title="Click here to go Next"
                >
                  Yes
                </Link>
              </>
            )}
            {showButtonNo && (
              <button
                className="es_btn"
                title="Click here to go Back"
                onClick={handleNo}
              >
                NO
              </button>
            )}
          </div>
        </div>
        </div>
      )}

      {/* <div className="counts">
        <h3>Over all Counts</h3>
        <p>Visited: {visitedCount}</p>
        <p>Not Visited: {notVisitedCount}</p>
        <p>Answered: {answeredOnlyCount}</p>
        <p>Not Answered: {notAnsweredButVisitedCount}</p>
        <p>Marked for Review: {markForReviewOnlyCount}</p>
        <p>Answered and Marked for Review: {answeredAndMarkForReviewCount}</p>
      </div>
      <div>
        <h2>Subject-wise Counts</h2>
        {testData?.subjects.map((subject) => (
          <div key={subject.subjectId}>
            <h3>{subject.SubjectName}</h3>
            <p>
              Total Questions:{" "}
              {subjectCounts[subject.subjectId]?.totalQuestions}
            </p>
            <p>
              Answered: {subjectCounts[subject.subjectId]?.answeredQuestions}
            </p>
            <p>
              Marked for Review:{" "}
              {subjectCounts[subject.subjectId]?.markedForReviewQuestions}
            </p>
            <p>
              Not Answered but Visited:{" "}
              {subjectCounts[subject.subjectId]?.notAnsweredButVisited}
            </p>
            <p>Not Visited: {subjectCounts[subject.subjectId]?.notVisited}</p>
          </div>
        ))}

        <h2>Section-wise Counts</h2>
        {testData?.subjects
          .flatMap((subject) => subject.sections)
          .map((section) => (
            <div key={section.sectionId}>
              <h3>{section.SectionName}</h3>
              <p>
                Total Questions:{" "}
                {sectionCounts[section.sectionId]?.totalQuestions}
              </p>
              <p>
                Answered: {sectionCounts[section.sectionId]?.answeredQuestions}
              </p>
              <p>
                Marked for Review:{" "}
                {sectionCounts[section.sectionId]?.markedForReviewQuestions}
              </p>
              <p>
                Not Answered but Visited:{" "}
                {sectionCounts[section.sectionId]?.notAnsweredButVisited}
              </p>
              <p>Not Visited: {sectionCounts[section.sectionId]?.notVisited}</p>
            </div>
          ))}
      </div> */}
    </div>
  );
};

export default UG_OTSQuizPage;
