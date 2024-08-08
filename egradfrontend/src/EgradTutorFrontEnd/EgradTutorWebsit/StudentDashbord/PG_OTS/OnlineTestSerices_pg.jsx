import React, { useEffect, useState } from "react";
import axios from "axios";

const OnlineTestSerices_pg = () => {
  const [testData, setTestData] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/QuizPage/PG_QuestionOptions/2/55`
        ); // Replace with actual IDs
        const data = response.data;

        // Set default subject, section, and question
        if (data.subjects.length > 0) {
          setSelectedSubjectId(data.subjects[0].subjectId);
          if (data.subjects[0].sections.length > 0) {
            setSelectedSectionId(data.subjects[0].sections[0].sectionId);
            setSelectedQuestionId(data.subjects[0].sections[0].questions[0].question_id);
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
  }, []);

  const handleSubjectClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
    const selectedSubject = testData.subjects.find(subject => subject.subjectId === subjectId);
    if (selectedSubject.sections.length > 0) {
      setSelectedSectionId(selectedSubject.sections[0].sectionId);
      setSelectedQuestionId(selectedSubject.sections[0].questions[0].question_id);
    } else {
      setSelectedSectionId(null);
      setSelectedQuestionId(selectedSubject.questions[0].question_id);
    }
  };

  const handleSectionClick = (sectionId) => {
    setSelectedSectionId(sectionId);
    const selectedSection = testData.subjects.find(subject => subject.subjectId === selectedSubjectId)
      .sections.find(section => section.sectionId === sectionId);
    setSelectedQuestionId(selectedSection.questions[0].question_id);
  };

  const handleQuestionClick = (questionId) => {
    setSelectedQuestionId(questionId);
  };

  const handleNextClick = () => {
    const selectedSubject = testData.subjects.find(subject => subject.subjectId === selectedSubjectId);
    const selectedSection = selectedSubject.sections.find(section => section.sectionId === selectedSectionId);
    const questionIndex = selectedSection.questions.findIndex(question => question.question_id === selectedQuestionId);
    const sectionIndex = selectedSubject.sections.findIndex(section => section.sectionId === selectedSectionId);
    const subjectIndex = testData.subjects.findIndex(subject => subject.subjectId === selectedSubjectId);

    if (questionIndex < selectedSection.questions.length - 1) {
      setSelectedQuestionId(selectedSection.questions[questionIndex + 1].question_id);
    } else if (sectionIndex < selectedSubject.sections.length - 1) {
      const nextSection = selectedSubject.sections[sectionIndex + 1];
      setSelectedSectionId(nextSection.sectionId);
      setSelectedQuestionId(nextSection.questions[0].question_id);
    } else if (subjectIndex < testData.subjects.length - 1) {
      const nextSubject = testData.subjects[subjectIndex + 1];
      setSelectedSubjectId(nextSubject.subjectId);
      const nextSubjectFirstSection = nextSubject.sections[0];
      setSelectedSectionId(nextSubjectFirstSection.sectionId);
      setSelectedQuestionId(nextSubjectFirstSection.questions[0].question_id);
    }
  };

  const handlePreviousClick = () => {
    const selectedSubject = testData.subjects.find(subject => subject.subjectId === selectedSubjectId);
    const selectedSection = selectedSubject.sections.find(section => section.sectionId === selectedSectionId);
    const questionIndex = selectedSection.questions.findIndex(question => question.question_id === selectedQuestionId);
    const sectionIndex = selectedSubject.sections.findIndex(section => section.sectionId === selectedSectionId);
    const subjectIndex = testData.subjects.findIndex(subject => subject.subjectId === selectedSubjectId);

    if (questionIndex > 0) {
      setSelectedQuestionId(selectedSection.questions[questionIndex - 1].question_id);
    } else if (sectionIndex > 0) {
      const previousSection = selectedSubject.sections[sectionIndex - 1];
      setSelectedSectionId(previousSection.sectionId);
      setSelectedQuestionId(previousSection.questions[previousSection.questions.length - 1].question_id);
    } else if (subjectIndex > 0) {
      const previousSubject = testData.subjects[subjectIndex - 1];
      setSelectedSubjectId(previousSubject.subjectId);
      const previousSubjectLastSection = previousSubject.sections[previousSubject.sections.length - 1];
      setSelectedSectionId(previousSubjectLastSection.sectionId);
      setSelectedQuestionId(previousSubjectLastSection.questions[previousSubjectLastSection.questions.length - 1].question_id);
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
    ? selectedSection.questions.find((question) => question.question_id === selectedQuestionId)
    : selectedSubject.questions.find((question) => question.question_id === selectedQuestionId);

  return (
    <div>
      <h1>{testData.TestName}</h1>
      <div>
        {testData.subjects.map((subject) => (
          <h2
            key={subject.subjectId}
            onClick={() => handleSubjectClick(subject.subjectId)}
            style={{
              cursor: "pointer",
              color: selectedSubjectId === subject.subjectId ? "blue" : "black",
            }}
          >
            {subject.SubjectName}
          </h2>
        ))}
      </div>
      {selectedSubject && (
        <div>
          {selectedSubject.sections.length > 0 ? (
            selectedSubject.sections.map((section) => (
              <h3
                key={section.sectionId}
                onClick={() => handleSectionClick(section.sectionId)}
                style={{
                  cursor: "pointer",
                  color: selectedSectionId === section.sectionId ? "blue" : "black",
                }}
              >
                {section.SectionName}
              </h3>
            ))
          ) : (
            <div>
              {selectedSubject.questions.map((question, index) => (
                <button
                  key={question.question_id}
                  onClick={() => handleQuestionClick(question.question_id)}
                  style={{
                    backgroundColor: selectedQuestionId === question.question_id ? "blue" : "white",
                    color: selectedQuestionId === question.question_id ? "white" : "black",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {selectedSection && (
        <div>
          {selectedSection.questions.map((question, index) => (
            <button
              key={question.question_id}
              onClick={() => handleQuestionClick(question.question_id)}
              style={{
                backgroundColor: selectedQuestionId === question.question_id ? "blue" : "white",
                color: selectedQuestionId === question.question_id ? "white" : "black",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
      {selectedQuestion && (
        <div>
          <img
            src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${selectedQuestion.questionImgName}`}
            alt={`Question ${selectedQuestion.question_id}`}
          />
          {selectedQuestion.options.map((option) => (
            <div key={option.option_id}>
              <img
                src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${option.optionImgName}`}
                alt={`Option ${option.option_index}`}
              />
            </div>
          ))}
        </div>
      )}
      <div>
        <button onClick={handlePreviousClick}>Previous</button>
        <button onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};

export default OnlineTestSerices_pg;
