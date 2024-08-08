import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import { useParams,useNavigate,useLocation } from "react-router-dom";
import PGButtonsFunctionality from "./PGButtonsFunctionality";
import { decryptData, encryptData } from "../utils/crypto";

const PGQuizPage = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  
  const { param1, param2, param3, param4 } = useParams();
  const navigate = useNavigate();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");

  const [questionOptions, setQuestionOptions] = useState({
    TestName: "",
    subjects: [],
  });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { Branch_Id } = useParams();
  const [option, setOption] = useState({ ans: null });
  const [answeredCount, setAnsweredCount] = useState(0);
  const [notAnsweredCount, setNotAnsweredCount] = useState(0);
  const [answeredmarkedForReviewCount, setAnsweredmarkedForReviewCount] =
    useState(0);
  const [markedForReviewCount, setMarkedForReviewCount] = useState(0);
  const [VisitedCount, setVisitedCount] = useState(0);
  const [questionStatus, setQuestionStatus] = useState(() => {
    if (Array.isArray(questionOptions) && questionOptions.length > 0) {
      // Flatten the nested structure to access the questions
      const questions = questionOptions.flatMap(test => 
        test.subjects.flatMap(subject =>
          subject.sections.flatMap(section =>
            section.questions
          )
        )
      );
  
      // Initialize the status array with "notAnswered"
      return Array(questions.length).fill("notAnswered");
    } else {
      return [];
    }
  });
  
  const [activeQuestion, setActiveQuestion] = useState(0);

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
        const response = await fetch(
          `${BASE_URL}/QuizPage/PG_QuestionOptions/${decryptedParam1}/${decryptedParam2}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestionOptions(data);

        // Automatically select the first section of the first subject
        // if (data.subjects.length > 0 && data.subjects[0].sections.length > 0) {
        //   setSelectedSubject(data.subjects[0].subjectId);
        //   setSelectedSection(data.subjects[0].sections[0].sectionId);
        // }
        if (data.subjects.length > 0) {
          const firstSubjectId = data.subjects[0].subjectId;
          const firstSectionId = data.subjects[0].sections[0].sectionId;
          setSelectedSubject(firstSubjectId);
          setSelectedSection(firstSectionId);
        }
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };

    fetchData();
  }, [decryptedParam1, decryptedParam2]);

  if (!questionOptions.subjects.length) {
    return <p>Loading...</p>;
  }

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    // Automatically select the first section of the selected subject
    const subject = questionOptions.subjects.find(subject => subject.subjectId === subjectId);
    if (subject && subject.sections.length > 0) {
      setSelectedSection(subject.sections[0].sectionId);
    }
  };

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    setCurrentQuestionIndex(0); // Reset question index when section changes
  };

  const handleNextQuestion = () => {
    const sections = questionOptions.subjects
      .flatMap((subject) => subject.sections)
      .filter((section) => section.sectionId === selectedSection);

    if (sections.length > 0) {
      const currentSection = sections[0];
      const questions = currentSection.questions;
      const index = Math.max(
        0,
        Math.min(currentQuestionIndex, questions.length - 1)
      );

      if (index === questions.length - 1) {
        // Move to the next section if on the last question of the current section
        const nextSectionIndex =
          questionOptions.subjects
            .flatMap((subject) => subject.sections)
            .indexOf(currentSection) + 1;

        if (
          nextSectionIndex <
          questionOptions.subjects.flatMap((subject) => subject.sections).length
        ) {
          const nextSection = questionOptions.subjects.flatMap(
            (subject) => subject.sections
          )[nextSectionIndex];

          setSelectedSection(nextSection.sectionId);
          setCurrentQuestionIndex(0); // Reset to first question of the next section
        }
      } else {
        setCurrentQuestionIndex(index + 1);
      }
    }
  };

  const handlePreviousQuestion = () => {
    const sections = questionOptions.subjects
      .flatMap((subject) => subject.sections)
      .filter((section) => section.sectionId === selectedSection);

    if (sections.length > 0) {
      const currentSection = sections[0];
      const questions = currentSection.questions;
      const index = Math.max(
        0,
        Math.min(currentQuestionIndex, questions.length - 1)
      );

      if (index === 0) {
        // Move to the previous section if on the first question of the current section
        const prevSectionIndex =
          questionOptions.subjects
            .flatMap((subject) => subject.sections)
            .indexOf(currentSection) - 1;

        if (prevSectionIndex >= 0) {
          const prevSection = questionOptions.subjects.flatMap(
            (subject) => subject.sections
          )[prevSectionIndex];

          setSelectedSection(prevSection.sectionId);
          setCurrentQuestionIndex(prevSection.questions.length - 1); // Go to the last question of the previous section
        }
      } else {
        setCurrentQuestionIndex(index - 1);
      }
    }
  };
  const renderQuestions = (questions) => {
    if (!questions || questions.length === 0) {
      return <p>No questions available.</p>;
    }

    const index = Math.max(
      0,
      Math.min(currentQuestionIndex, questions.length - 1)
    );
    const question = questions[index];

    if (!question) {
      return <p>No question available.</p>;
    }

    const questionType =
      question.quesion_type && question.quesion_type[0]?.typeofQuestion;

    return (
      <div>
       <div key={question.question_id}>
        <div>
          <h2>Question Type: {questionType || "No answer"}</h2>
        </div>
        <div>
          <b>Question</b>
          <h4 id="question_number">{index + 1}.</h4>
          {question.questionImgName && (
            <img
              src={`${BASE_URL}/uploads/${question.documen_name}/${question.questionImgName}`}
              alt={`Question ${question.question_id}`}
            />
          )}
        </div>

        {question.paragraph && question.paragraph.length > 0 && (
          <div className="Paragraph_div">
            <p>{question.paragraph[0]?.qtype_text || "No answer"}</p>
            <b>Paragraph:</b>
            {question.paragraph[0]?.paragraphImg && (
              <img
                src={`${BASE_URL}/uploads/${question.documen_name}/${question.paragraph[0]?.paragraphImg}`}
                alt={`ParagraphImage ${question.paragraph[0]?.paragraph_Id}`}
              />
            )}
          </div>
        )}

        <div className="parent-div">
          {questionType ===
            "NATD( Numeric Answer type of questions with Decimal values)" && (
            <div className="quiz_exam_interface_exam_qN_Q_options_calculator_input">
              <div className="calculator">
                <div className="display">
                  <label>Answer:</label>
                  <input
                    type="text"
                    name={`question-${currentQuestionIndex}`}
                    placeholder="Enter your answer"
                  />
                </div>
                {/* Add calculator buttons here */}
              </div>
            </div>
          )}

          {questionType ===
            "NATI( Numeric Answer type of questions with integer values)" && (
            <div className="quiz_exam_interface_exam_qN_Q_options_calculator_input">
              <div className="calculator">
                <div className="display">
                  <label>Answer:</label>
                  <input
                    type="text"
                    name={`question-${currentQuestionIndex}`}
                    placeholder="Enter your answer"
                  />
                </div>
                {/* Add calculator buttons here */}
              </div>
            </div>
          )}

          {questionType !==
            "NATD( Numeric Answer type of questions with Decimal values)" &&
            questionType !==
              "NATI( Numeric Answer type of questions with integer values)" && (
              <div className="quiz_exam_interface_exam_qN_Q_options">
                <b>Options</b>
                {question.options &&
                  Array.isArray(question.options) &&
                  question.options.map((option, optionIndex) => (
                    <div className="option" key={option.option_id}>
                      <li key={optionIndex}>
                        {questionType === "MCQ4(MCQ with 4 Options)" && (
                          <div>
                            <input
                              type="radio"
                              id={`option-${optionIndex}`}
                              name={`question-${currentQuestionIndex}`}
                              value={optionIndex}
                            />
                            <img
                              src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                              alt={`Option ${option.option_index}`}
                            />
                          </div>
                        )}
                        {questionType === "MCQ5(MCQ with 5 Options)" && (
                          <div>
                            <input
                              type="radio"
                              id={`option-${optionIndex}`}
                              name={`question-${currentQuestionIndex}`}
                              value={optionIndex}
                            />
                            <img
                              src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                              alt={`Option ${option.option_index}`}
                            />
                          </div>
                        )}
                        {questionType === "MSQ(MSQ without -ve marking)" && (
                          <div>
                            <input
                              type="checkbox"
                              id={`option-${optionIndex}`}
                              name={`question-${currentQuestionIndex}`}
                              value={optionIndex}
                            />
                            <img
                              src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                              alt={`Option ${option.option_index}`}
                            />
                          </div>
                        )}
                        {questionType === "MSQN(MSQ with -ve marking)" && (
                          <div>
                            <input
                              type="checkbox"
                              id={`option-${optionIndex}`}
                              name={`question-${currentQuestionIndex}`}
                              value={optionIndex}
                            />
                            <img
                              src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                              alt={`Option ${option.option_index}`}
                            />
                          </div>
                        )}
                        {questionType === "TF(True or False)" && (
                          <div>
                            <input
                              type="radio"
                              id={`option-${optionIndex}`}
                              name={`question-${currentQuestionIndex}`}
                              value={optionIndex}
                            />
                            <img
                              src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                              alt={`Option ${option.option_index}`}
                            />
                          </div>
                        )}
                        {questionType ===
                          "CTQ(Comprehension type of questions)" && (
                          <div>
                            <input
                              type="radio"
                              id={`option-${optionIndex}`}
                              name={`question-${currentQuestionIndex}`}
                              value={optionIndex}
                            />
                            <img
                              src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                              alt={`Option ${option.option_index}`}
                            />
                          </div>
                        )}
                      </li>
                    </div>
                  ))}
              </div>
            )}
        </div>

        <div>
          <button
            onClick={handlePreviousQuestion}
            disabled={
              currentQuestionIndex === 0 && !isPreviousSectionAvailable()
            }
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={
              currentQuestionIndex === questions.length - 1 &&
              !isNextSectionAvailable()
            }
          >
            Next
          </button>
        </div>
      </div> 
      <div>
        <PGButtonsFunctionality
                     onQuestionSelect={handleQuestionSelect}
                     questionStatus={questionStatus}
                     setQuestionStatus={setQuestionStatus}
                     answeredCount={answeredCount}
                     notAnsweredCount={notAnsweredCount}
                     answeredmarkedForReviewCount={answeredmarkedForReviewCount}
                     markedForReviewCount={markedForReviewCount}
                     VisitedCount={VisitedCount}
                     selectedSubject={selectedSubject}
                     selectedSection={selectedSection}
                    questionOptions={questionOptions}
                     updateQuestionStatus={updateQuestionStatus}
                     seconds={600}
                     onUpdateOption={handleUpdateOption}
                     option={option}
                     users={userData?.users || []}/>
      </div>
      </div>
      
    );
  };

  const isPreviousSectionAvailable = () => {
    const sections = questionOptions.subjects.flatMap(
      (subject) => subject.sections
    );
    const currentIndex = sections.findIndex(
      (section) => section.sectionId === selectedSection
    );
    return currentIndex > 0;
  };

  const isNextSectionAvailable = () => {
    const sections = questionOptions.subjects.flatMap(
      (subject) => subject.sections
    );
    const currentIndex = sections.findIndex(
      (section) => section.sectionId === selectedSection
    );
    return currentIndex < sections.length - 1;
  };

  const remainingQuestions =
  questionOptions -
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

// Handler to update option state
const handleUpdateOption = (value) => {
  setOption({ ans: value });
};

const updateQuestionStatus = (index, status) => {
  // Update the question status in the QuestionPaper component
  const updatedQuestionStatus = [...questionStatus];
  updatedQuestionStatus[index] = status;
  setQuestionStatus(updatedQuestionStatus);
};

  const handleQuestionSelect = async (questionNumber) => {
    try {
      const response = await fetch(
        `${BASE_URL}/QuizPage/PG_QuestionOptions/${decryptedParam1}/${decryptedParam2}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestionOptions(data);

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
  const selectedSubjectData = questionOptions.subjects.find(subject => subject.subjectId === selectedSubject);
  const selectedSectionQuestions = selectedSubjectData
    ? selectedSubjectData.sections.find(section => section.sectionId === selectedSection)?.questions || []
    : [];

  return (
    <div>
    <h1>{questionOptions.TestName}</h1>
    <div className="subjects-container">
      {questionOptions.subjects.map((subject) => (
        <div key={subject.subjectId}>
          <h2
            onClick={() => handleSubjectClick(subject.subjectId)}
            style={{ cursor: "pointer", fontWeight: selectedSubject === subject.subjectId ? 'bold' : 'normal' }}
          >
            {subject.SubjectName}
          </h2>
          {selectedSubject === subject.subjectId && (
            <div className="sections-list">
              {subject.sections.map((section) => (
                <h5
                  key={section.sectionId}
                  onClick={() => handleSectionClick(section.sectionId)}
                  style={{ cursor: "pointer", margin: "5px 0" }}
                >
                  {section.SectionName}
                </h5>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
    {selectedSubject && (
      <div>
        {selectedSectionQuestions.length > 0 ? (
          <div>
            {renderQuestions(selectedSectionQuestions)}
          </div>
        ) : (
          <div>
            {/* Display subject-level questions if no section questions available */}
            {selectedSubjectData && (
              <div>
                {renderQuestions(selectedSubjectData.sections.flatMap(section => section.questions))}
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
    // <div>
    //   <h1>{questionOptions.TestName}</h1>
    //   <div className="sections-container">
    //     {questionOptions.subjects.map((subject) => (
    //       <div key={subject.subjectId}>
    //         <h2>{subject.SubjectName}</h2>
    //         <div className="sections-list">
    //           {subject.sections.map((section) => (
    //             <h5
    //               key={section.sectionId}
    //               onClick={() => handleSectionClick(section.sectionId)}
    //               style={{ cursor: "pointer", margin: "5px 0" }}
    //             >
    //               {section.SectionName}
    //             </h5>
    //           ))}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    //   {selectedSection && (
    //     <div>
    //       {questionOptions.subjects
    //         .flatMap((subject) => subject.sections)
    //         .filter((section) => section.sectionId === selectedSection)
    //         .map((section) => (
    //           <div key={section.sectionId}>
    //             {renderQuestions(section.questions)}
    //           </div>
    //         ))}
    //     </div>
    //   )}
    // </div>
  );
};

export default PGQuizPage;
