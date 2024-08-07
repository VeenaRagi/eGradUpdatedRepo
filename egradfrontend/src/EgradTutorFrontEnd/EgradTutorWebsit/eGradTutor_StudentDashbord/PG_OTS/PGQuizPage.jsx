import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import { useParams } from "react-router-dom";

const PGQuizPage = () => {
  const [questionOptions, setQuestionOptions] = useState({
    TestName: "",
    subjects: [],
  });
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { testCreationTableId, userId, Branch_Id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/QuizPage/PG_QuestionOptions/${testCreationTableId}/${userId}/${Branch_Id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestionOptions(data);

        // Automatically select the first section of the first subject
        if (data.subjects.length > 0 && data.subjects[0].sections.length > 0) {
          setSelectedSection(data.subjects[0].sections[0].sectionId);
        }
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };

    fetchData();
  }, [testCreationTableId, userId, Branch_Id]);

  if (!questionOptions.subjects.length) {
    return <p>Loading...</p>;
  }

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

        {/* Display Paragraph if exists */}
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

        {/* Question Options Rendering */}
        <div className="parent-div">
          {/* Handle Numeric Answer Type with Decimal Values (NATD) */}
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

          {/* Handle Numeric Answer Type with Integer Values (NATI) */}
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

          {/* Handle Multiple Choice and Other Question Types */}
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

  return (
    <div>
      <h1>{questionOptions.TestName}</h1>

      {/* Sections Display at the Top */}
      <div className="sections-container">
        {questionOptions.subjects.map((subject) => (
          <div key={subject.subjectId}>
            <h2>{subject.SubjectName}</h2>
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
          </div>
        ))}
      </div>
      {selectedSection && (
        <div>
          {questionOptions.subjects
            .flatMap((subject) => subject.sections)
            .filter((section) => section.sectionId === selectedSection)
            .map((section) => (
              <div key={section.sectionId}>
                {renderQuestions(section.questions)}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PGQuizPage;
