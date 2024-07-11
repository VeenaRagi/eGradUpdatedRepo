import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import { MdDeleteForever } from "react-icons/md";
import "./Style/StudentDashbord_Bookmarks.css";

const StudentDashbord_Bookmarks = ({ usersData }) => {
  const user_Id =
    usersData.users && usersData.users.length > 0
      ? usersData.users.map((user) => user.username)
      : null;
  const { testCreationTableId, question_id } = useParams();

  const [Questionbookmark, setQuestionbookmark] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/StudentDashbordbookmark_section/${user_Id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQuestionbookmark(data.questions);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };
    fetchData();
  }, [user_Id]);

  let previousTestName = null;

  // its fron onclik for solustion
  const [showAnswers, setShowAnswers] = useState(false);

  const toggleAnswer = (questionId) => {
    setShowAnswers((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  const deleteBookmarkQuestion = async (
    user_Id,
    testCreationTableId,
    question_id
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/Myresult/deleteBookmarkQuestion/${user_Id}/${testCreationTableId}/${question_id}`,
        {
          method: "DELETE",
        }
      );
      window.location.reload();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting bookmarked question:", error);
    }
  };

  if (Questionbookmark.length === 0) {
    return (
      <div className="container">
        <div className="subheading">You haven't bookmarked anything yet.</div>
      </div>
    );
  }

  return (
    <div className="Questionbookmark_container">
      <ul className="Questionbookmark_contant">
        {Questionbookmark.map((question, index) => {
          const questionId = question.question_id;
          const isAnswerVisible = showAnswers[questionId];

          const showTestName = question.TestName !== previousTestName;

          previousTestName = question.TestName;

          return (
            <li key={questionId} className="QuestionbookmarkDAta">
              {showTestName && (
                <p className="qbmTitle ">Test Name: {question.TestName} </p>
              )}
              <p className="qbm_QuestionImage">Question:{index + 1} </p>
              {question.paragraph.paragraphImg && (
                <div>
                  <p className="qbm_QuestionImage">Paragraph:</p>
                  <img
                    className="qbm_Image"
                    src={`${BASE_URL}/uploads/${question.documen_name}/${question.paragraph.paragraphImg}`}
                    alt="Paragraph Image"
                  />
                </div>
              )}

              <div className="eGRADTutorWatermark">
                <div>
                  <img
                    className="qbm_Image"
                    src={`${BASE_URL}/uploads/${question.documen_name}/${question.questionImgName}`}
                    alt=""
                  />
                </div>

                <ul className="dbq_options">
                  {question.options.map((option, index) => (
                    <li key={option.option_id}>
                      <span>{String.fromCharCode(97 + index)}:</span>{" "}
                      <img
                        src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                        alt=""
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {isAnswerVisible && (
                <div className="eGRADTutorWatermark">
                  <div className="bdqSolution">
                    <p className="qbm_QuestionImage">Solution: </p>
                    <img
                      className="qbm_Image"
                      src={`${BASE_URL}/uploads/${question.documen_name}/${question.solution.solutionImgName}`}
                      alt=""
                    />
                  </div>
                </div>
              )}

              <div className="toggleAnswerMdDeleteForever">
                <button
                  onClick={() => toggleAnswer(questionId)}
                  className="dbq_Answer_sh"
                >
                  {isAnswerVisible ? "Hide Answer" : "Show Answer"}
                </button>

                <button
                  onClick={() =>
                    deleteBookmarkQuestion(
                      question.testCreationTableId.user_Id,
                      question.testCreationTableId.testCreationTableId,
                      question.question_id
                    )
                  }
                >
                  <MdDeleteForever />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StudentDashbord_Bookmarks;
