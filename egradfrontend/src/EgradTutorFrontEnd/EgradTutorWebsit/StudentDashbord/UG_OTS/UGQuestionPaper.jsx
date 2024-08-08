

import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import { decryptData } from "../utils/crypto";
import { useParams, useNavigate } from "react-router-dom";
import "../Style/QuestionPaper.css";
import axios from "axios";
 
const QuestionPaper = ({ onClose }) => {
  const [questionData, setQuestionData] = useState({ questions: [] });
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [testName, setTestName] = useState("");
  const navigate = useNavigate();
  const { param1 } = useParams();
 
  useEffect(() => {
    const token = sessionStorage.getItem("navigationToken");
    if (!token) {
      navigate("/Error");
      return;
    }
 
    const decryptParams = async () => {
      try {
        const decrypted1 = await decryptData(param1);
        if (!decrypted1 || isNaN(parseInt(decrypted1))) {
          navigate("/Error");
          return;
        }
        setDecryptedParam1(decrypted1);
      } catch (error) {
        console.error("Error decrypting data:", error);
        navigate("/Error");
      }
    };
    decryptParams();
  }, [param1, navigate]);
 
  useEffect(() => {
    if (decryptedParam1) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/QuizPage/questionpaper/${decryptedParam1}`
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
      fetchData();
    }
  }, [decryptedParam1]);
 
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
    <div className="popupQuestionPaper">
      <div className="popup-contentQuestionPaper">
        <div className="questionPaperLogoWithP">
          <div className="questionPaper_headerImgPContainer">
            <div className="questionPaper_header">
              <img src={image} alt="Current" />
            </div>
            <div>
              <p
                className="questionPaper_header_testName"
                key={testName.decryptedParam1}
              >
                {testName}
              </p>
            </div>
            <div>
              <button onClick={onClose} className="close-popupQuestionPaper">
                {/* &times; */}
                 Close
              </button>
            </div>
          </div>
        </div>
        <div>
          {questionData.questions.length > 0 ? (
            questionData.questions.map((question, index) => (
              <div
                key={question.question_id}
                className="question-containerQuestionPaper"
              >
                <div className="question_divQuestionPaper">
                  <div className="pravagragh_containerQuestionPaper">
                    {question.paragraph && question.paragraph.paragraphImg && (
                      <div className="Paragraph_divQuestionPaper">
                        <b>Paragraph:</b>
                        <img
                          id="questionPaper_logo"
                          src={`${BASE_URL}/uploads/${question.documen_name}/${question.paragraph.paragraphImg}`}
                          alt={`ParagraphImage ${question.paragraph.paragraph_Id}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="questionAndQNumber">
                  <b>Question</b>
                  <h4 id="question_numberQuestionPaper">{index + 1}.</h4>
                </div>
 
                <div className="question_number_containerQuestionPaper">
                  <img
                    src={`${BASE_URL}/uploads/${question.documen_name}/${question.questionImgName}`}
                    alt={`Question ${question.question_id}`}
                  />
                </div>
                <hr className="question-dividerQuestionPaper" />
              </div>
            ))
          ) : (
            <p>No questions available</p>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default QuestionPaper;
 
 