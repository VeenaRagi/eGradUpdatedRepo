import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Style/OnlineTestSerices_pg.css";
import { useParams, Link, useNavigate,useLocation } from "react-router-dom";
import { decryptData, encryptData } from "../utils/crypto";
// Import your images
import greenBox from "../asserts/greenBox.png";
import orangeBox from "../asserts/orangeBox.png";
import purpleBox from "../asserts/purpleBox.png";
import purpleTickBox from "../asserts/purpleTickBox.png";
import BASE_URL from "../../../../apiConfig";

const PG_OTSQuizPage = () => {
  const [testData, setTestData] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [markedForReview, setMarkedForReview] = useState([]);
  const [responses, setResponses] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/QuizPage/UG_QuestionOptions/${decryptedParam1}/${decryptedParam2}`
        );
        const data = response.data;
  
        // Set default subject, section, and question
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

  const handleSectionClick = (sectionId) => {
    setSelectedSectionId(sectionId);
    const selectedSection = testData.subjects
      .find((subject) => subject.subjectId === selectedSubjectId)
      .sections.find((section) => section.sectionId === sectionId);
    setSelectedQuestionId(selectedSection.questions[0].question_id);
  };

  const handleQuestionClick = (questionId) => {
    setSelectedQuestionId(questionId);
    if (!visitedQuestions.includes(questionId)) {
      setVisitedQuestions([...visitedQuestions, questionId]);
    }
  };

  const handleNextClick = () => {
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
      const nextQuestionId =
        selectedSection.questions[questionIndex + 1].question_id;
      setSelectedQuestionId(nextQuestionId);
      if (!visitedQuestions.includes(nextQuestionId)) {
        setVisitedQuestions([...visitedQuestions, nextQuestionId]);
      }
    } else if (sectionIndex < selectedSubject.sections.length - 1) {
      const nextSection = selectedSubject.sections[sectionIndex + 1];
      setSelectedSectionId(nextSection.sectionId);
      const nextQuestionId = nextSection.questions[0].question_id;
      setSelectedQuestionId(nextQuestionId);
      if (!visitedQuestions.includes(nextQuestionId)) {
        setVisitedQuestions([...visitedQuestions, nextQuestionId]);
      }
    } else if (subjectIndex < testData.subjects.length - 1) {
      const nextSubject = testData.subjects[subjectIndex + 1];
      setSelectedSubjectId(nextSubject.subjectId);
      const nextSubjectFirstSection = nextSubject.sections[0];
      setSelectedSectionId(nextSubjectFirstSection.sectionId);
      const nextQuestionId = nextSubjectFirstSection.questions[0].question_id;
      setSelectedQuestionId(nextQuestionId);
      if (!visitedQuestions.includes(nextQuestionId)) {
        setVisitedQuestions([...visitedQuestions, nextQuestionId]);
      }
    }
  };

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

    if (questionIndex > 0) {
      const prevQuestionId =
        selectedSection.questions[questionIndex - 1].question_id;
      setSelectedQuestionId(prevQuestionId);
      if (!visitedQuestions.includes(prevQuestionId)) {
        setVisitedQuestions([...visitedQuestions, prevQuestionId]);
      }
    } else if (sectionIndex > 0) {
      const previousSection = selectedSubject.sections[sectionIndex - 1];
      setSelectedSectionId(previousSection.sectionId);
      const prevQuestionId =
        previousSection.questions[previousSection.questions.length - 1]
          .question_id;
      setSelectedQuestionId(prevQuestionId);
      if (!visitedQuestions.includes(prevQuestionId)) {
        setVisitedQuestions([...visitedQuestions, prevQuestionId]);
      }
    } else if (subjectIndex > 0) {
      const previousSubject = testData.subjects[subjectIndex - 1];
      setSelectedSubjectId(previousSubject.subjectId);
      const previousSubjectLastSection =
        previousSubject.sections[previousSubject.sections.length - 1];
      setSelectedSectionId(previousSubjectLastSection.sectionId);
      const prevQuestionId =
        previousSubjectLastSection.questions[
          previousSubjectLastSection.questions.length - 1
        ].question_id;
      setSelectedQuestionId(prevQuestionId);
      if (!visitedQuestions.includes(prevQuestionId)) {
        setVisitedQuestions([...visitedQuestions, prevQuestionId]);
      }
    }
  };

  const handleInput = (value) => {
    setInputValue((prev) => {
      if (value === "backspace") {
        return prev.slice(0, -1);
      }
      return prev + value;
    });
  };

  const handleMarkForReview = () => {
    // Check if the question is answered
    if (responses[selectedQuestionId]) {
      // If answered, mark for review with purple tick box
      if (!markedForReview.includes(selectedQuestionId)) {
        setMarkedForReview([...markedForReview, selectedQuestionId]);
      }
    } else {
      // If not answered, just mark for review with purple box
      if (!markedForReview.includes(selectedQuestionId)) {
        setMarkedForReview([...markedForReview, selectedQuestionId]);
      } else {
        setMarkedForReview(
          markedForReview.filter((id) => id !== selectedQuestionId)
        );
      }
    }
  };

  const handleClearResponse = () => {
    setResponses((prev) => ({
      ...prev,
      [selectedQuestionId]: undefined,
    }));
    setInputValue("");
    setSavedQuestions(savedQuestions.filter((id) => id !== selectedQuestionId));
  };

  const handleSubmit = () => {
    const allQuestions = testData.subjects.flatMap((subject) =>
      subject.sections.flatMap((section) => section.questions)
    );
    const allAnswered = allQuestions.every(
      (question) => responses[question.question_id] !== undefined
    );

    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Submit logic here (e.g., POST request)
    alert("Quiz submitted successfully!");
  };

  const handleSaveAndNext = () => {
    if (selectedQuestion) {
      const questionType = selectedQuestion.quesion_type[0].quesionTypeId;
      if (
        [1, 2, 7, 8].includes(questionType) &&
        !responses[selectedQuestionId]
      ) {
        alert("Please select an option before proceeding.");
        return;
      }
      if ([5, 6].includes(questionType) && inputValue === "") {
        alert("Please enter a response before proceeding.");
        return;
      }
      // Remove the question from the marked for review list if saving and next is clicked
      if (markedForReview.includes(selectedQuestionId)) {
        setMarkedForReview(
          markedForReview.filter((id) => id !== selectedQuestionId)
        );
      }
      setSavedQuestions([...savedQuestions, selectedQuestionId]);
      handleNextClick();
    }
  };
  const getButtonStyle = (questionId) => {
    if (
      savedQuestions.includes(questionId) &&
      markedForReview.includes(questionId)
    ) {
      return { backgroundImage: `url(${purpleTickBox})` };
    }
    if (savedQuestions.includes(questionId)) {
      return { backgroundImage: `url(${greenBox})` };
    }
    if (markedForReview.includes(questionId)) {
      return { backgroundImage: `url(${purpleBox})` };
    }
    if (visitedQuestions.includes(questionId)) {
      return { backgroundImage: `url(${orangeBox})` };
    }
    return {};
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

  return (
    <div>
      <div className="Pg_OtsLogo">
        <img src={image} alt="Current" />
      </div>
      <div className="Pg_otsheadin1">
        <p className="Pg_TestName">{testData.TestName}</p>
        <div>
          <p>
            <i class="fa-solid fa-align-justify Pg_justify"></i>Question Paper
          </p>
          <p>
            <i class="fa-solid fa-info pg_info"></i>View Instructions
          </p>
        </div>
      </div>
      <div className="pg_otsMaindiv">
        <div style={{ width: "95%" }}>
          <div className="containerpg">
            {testData.subjects.map((subject) => {
              const isSelected = selectedSubjectId === subject.subjectId;
              return isSelected ? (
                <div key={subject.subjectId} className="message-body">
                  <div className="arrowpg"></div>
                  <h2 className="subject-title1 selected">
                    {subject.SubjectName}
                  </h2>
                </div>
              ) : (
                <h2
                  key={subject.subjectId}
                  onClick={() => handleSubjectClick(subject.subjectId)}
                  className="subject-title"
                >
                  {subject.SubjectName}
                </h2>
              );
            })}
          </div>
          <div className="pg_Sectionsdiv">
            <p>Sections</p>
            <p>Time Left:000:00</p>
          </div>
          <div>
            {" "}
            {selectedSubject && (
              <div className="Pg_sectiondiv">
                {selectedSubject.sections.length > 0 ? (
                  selectedSubject.sections.map((section) => (
                    <p
                      key={section.sectionId}
                      onClick={() => handleSectionClick(section.sectionId)}
                      className={`Pg_section ${
                        selectedSectionId === section.sectionId
                          ? "selected"
                          : " "
                      }`}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {section.SectionName}
                    </p>
                  ))
                ) : (
                  <div>
                    {selectedSubject.questions.map((question, index) => (
                      <button
                        key={question.question_id}
                        onClick={() =>
                          handleQuestionClick(question.question_id)
                        }
                        style={{
                          backgroundColor:
                            selectedQuestionId === question.question_id
                              ? "blue"
                              : "white",
                          color:
                            selectedQuestionId === question.question_id
                              ? "white"
                              : "black",
                        }}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="pg_Questiontypediv">
            <p>Question Type:MCQ</p>
            <div className="pg_markingdiv">
              <p>Marks for correct answer:1</p>
              <p>Nagative Marks:1/3</p>
            </div>
          </div>
          <div className="pg_Questionnodiv">
            <p>Question No.1</p>
          </div>
          <div>
            {selectedQuestion && (
              <div className="pg_quizpageots">
                <div className="pg_quizotsQuestion">
                  <img
                    src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${selectedQuestion.questionImgName}`}
                    alt={`Question ${selectedQuestion.question_id}`}
                  />
                </div>
                <div className="pg_quizotsoptions">
                  {selectedQuestion.quesion_type.some((type) =>
                    [1, 2, 7, 8].includes(type.quesionTypeId)
                  ) && (
                    <div>
                      {selectedQuestion.options.map((option) => (
                        <div key={option.option_id}>
                          <input
                            type="radio"
                            name={`question_${selectedQuestion.question_id}`}
                            value={option.option_id}
                            checked={
                              responses[selectedQuestionId] === option.option_id
                            }
                            onChange={() =>
                              setResponses({
                                ...responses,
                                [selectedQuestionId]: option.option_id,
                              })
                            }
                          />
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
                    <div>
                      {selectedQuestion.options.map((option) => (
                        <div key={option.option_id}>
                          <input
                            type="checkbox"
                            name={`question_${selectedQuestion.question_id}`}
                            value={option.option_id}
                            checked={responses[selectedQuestionId]?.includes(
                              option.option_id
                            )}
                            onChange={(e) => {
                              const updatedResponse =
                                responses[selectedQuestionId] || [];
                              if (e.target.checked) {
                                updatedResponse.push(option.option_id);
                              } else {
                                updatedResponse.splice(
                                  updatedResponse.indexOf(option.option_id),
                                  1
                                );
                              }
                              setResponses({
                                ...responses,
                                [selectedQuestionId]: updatedResponse,
                              });
                            }}
                          />
                          <img
                            src={`http://localhost:5001/uploads/${selectedQuestion.documen_name}/${option.optionImgName}`}
                            alt={`Option ${option.option_index}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedQuestion.quesion_type.some((type) =>
                    [5, 6].includes(type.quesionTypeId)
                  ) && (
                    <div>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setResponses({
                            ...responses,
                            [selectedQuestionId]: e.target.value,
                          });
                        }}
                        maxLength={1}
                      />
                      <button onClick={() => handleInput("backspace")}>
                        Backspace
                      </button>
                      <button onClick={() => handleInput("0")}>0</button>
                      <button onClick={() => handleInput("1")}>1</button>
                      <button onClick={() => handleInput("2")}>2</button>
                      <button onClick={() => handleInput("3")}>3</button>
                      <button onClick={() => handleInput("4")}>4</button>
                      <button onClick={() => handleInput("5")}>5</button>
                      <button onClick={() => handleInput("6")}>6</button>
                      <button onClick={() => handleInput("7")}>7</button>
                      <button onClick={() => handleInput("8")}>8</button>
                      <button onClick={() => handleInput("9")}>9</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="pg_handlebuttons">
            <div className="pg_handleReview">
              <button onClick={handleMarkForReview}>
                {markedForReview.includes(selectedQuestionId)
                  ? "Unmark for Review"
                  : "Mark for Review"}
              </button>
              <button onClick={handleClearResponse}>Clear Response</button>
            </div>
            <div className="pg_saveprevious">
              <div className="pg_handleReview">
                <button onClick={handlePreviousClick}>Previous</button>
              </div>
              <button onClick={handleSaveAndNext} className="pg_saveandnextots">Save and Next</button>
            </div>

            {/* <button onClick={handleNextClick}>Next</button> */}
          </div>
        </div>

        <div className="pg_norightdiv">
          {selectedSection && (
            <div>
              {selectedSection.questions.map((question, index) => (
                <button
                  key={question.question_id}
                  onClick={() => handleQuestionClick(question.question_id)}
                  style={{
                    ...getButtonStyle(question.question_id),
                    backgroundSize: "cover",
                    color: "black",
                    width: "50px",
                    height: "50px",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default PG_OTSQuizPage;
