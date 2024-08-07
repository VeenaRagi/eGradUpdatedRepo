import React, { useEffect, useState,useContext } from "react";
import BASE_URL from "../../../apiConfig";
import { MdDeleteForever } from "react-icons/md";
import { Navigate, useParams } from "react-router-dom";
import './Style/StudentDashbord_Bookmarks.css'
import UserContext from '../../../UserContext';




const StudentDashbord_Bookmarks = ({branchIdFromLS}) => {

  const { decryptedUserIdState, usersData } = useContext(UserContext);
  const { decryptedUserIdState: paramUserId } = useParams();
  // const user_Id = decryptedUserIdState;
  const  Branch_Id= branchIdFromLS;
  const { testCreationTableId, question_id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Questionbookmark, setQuestionbookmark] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/StudentDashbordbookmark_section/${decryptedUserIdState}`
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
  }, [decryptedUserIdState]);

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
    decryptedUserIdState,
    testCreationTableId,
    question_id
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/Myresult/deleteBookmarkQuestion/${decryptedUserIdState}/${testCreationTableId}/${question_id}`,
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
        <div className="bookmark_subheading">You haven't bookmarked anything yet.</div>
        <h1>Branch_Id:{Branch_Id}</h1>
      </div>
    );
  }

  console.log("Shizukaaaaaaaaaaaaaaa",decryptedUserIdState)

console.log("SHINCHANNNNNNNNNNNN",Branch_Id)

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
                      question.testCreationTableId.decryptedUserIdState,
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