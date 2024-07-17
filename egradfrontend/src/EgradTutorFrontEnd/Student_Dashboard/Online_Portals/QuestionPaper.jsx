// import React, { useState, useEffect } from "react";
// import BASE_URL from "../../../apiConfig";
// import { decryptData } from "../utils/crypto";
// import { useParams, useNavigate } from "react-router-dom";

// const QuestionPaper = () => {
//   const [questionData, setQuestionData] = useState({ questions: [] });
//   const [decryptedParam1, setDecryptedParam1] = useState("");
//   const navigate = useNavigate();
//   const { param1 } = useParams();

//   useEffect(() => {
//     const token = sessionStorage.getItem("navigationToken");
//     if (!token) {
//       navigate("/Error");
//       return;
//     }

//     const decryptParams = async () => {
//       try {
//         const decrypted1 = await decryptData(param1);
//         if (!decrypted1 || isNaN(parseInt(decrypted1)) ) {
//           navigate("/Error");
//           return;
//         }
//         setDecryptedParam1(decrypted1);
//       } catch (error) {
//         console.error("Error decrypting data:", error);
//         navigate("/Error");
//       }
//     };
//     decryptParams();
//   }, [param1, navigate]);

//   useEffect(() => {
//     if (decryptedParam1 ) {
//       const fetchData = async () => {
//         try {
//           const response = await fetch(
//             `${BASE_URL}/QuizPage/questionpaper/${decryptedParam1}`
//           );
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           const data = await response.json();
//           setQuestionData(data);
//         } catch (error) {
//           console.error("Error fetching question data:", error);
//         }
//       };
//       fetchData();
//     }
//   }, [decryptedParam1]);

//   const openQuestionPaper = async () => {
//     try {
//       const encryptedParam1 = await encryptData(decryptedParam1.toString());
//       const encryptedParam2 = await encryptData(decryptedParam2.toString());

//       const token = new Date().getTime().toString();
//       sessionStorage.setItem("navigationToken", token);
   
//       const url = `/QuestionPaper/${encodeURIComponent(
//         encryptedParam1
//       )}`;

//       navigate(url);
//     } catch (error) {
//       console.error("Error encrypting data:", error);
//     }
//   };v
//   return (
//     <div>
//         <div>
//             <button onClick={handleGoBack}>Go Back</button>
//         </div>
//       {questionData.questions.length > 0 ? (
//         questionData.questions.map((question, index) => (
//           <div key={question.question_id}>
//             <div className="question_div">
//               <div className="pravagragh_container">
//                 {question.paragraph && question.paragraph.paragraphImg && (
//                   <div className="Paragraph_div">
//                     <b>Paragraph:</b>
//                     <img
//                       src={`${BASE_URL}/uploads/${question.documen_name}/${question.paragraph.paragraphImg}`}
//                       alt={`ParagraphImage ${question.paragraph.paragraph_Id}`}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//             <b>Question</b>
//             <div className="question_number_continer">
//               <h4 id="question_number">{index + 1}.</h4>
//               <img
//                 src={`${BASE_URL}/uploads/${question.documen_name}/${question.questionImgName}`}
//                 alt={`Question ${question.question_id}`}
//               />
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No questions available</p>
//       )}
//     </div>
//   );
// };

// export default QuestionPaper;



import React, { useState, useEffect } from "react";
import BASE_URL from "../../../apiConfig";
import { decryptData } from "../utils/crypto";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/QuestionPaper.css";

const QuestionPaper = ({ onClose }) => {
  const [questionData, setQuestionData] = useState({ questions: [] });
  const [decryptedParam1, setDecryptedParam1] = useState("");
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
        } catch (error) {
          console.error("Error fetching question data:", error);
        }
      };
      fetchData();
    }
  }, [decryptedParam1]);

  return (
    <div className="popupQuestionPaper">
      <div className="popup-contentQuestionPaper">
        <button onClick={onClose} className="close-popupQuestionPaper">
          &times; Close
        </button>
        {questionData.questions.length > 0 ? (
          questionData.questions.map((question, index) => (
            <div key={question.question_id} className="question-containerQuestionPaper">
              <div className="question_divQuestionPaper">
                <div className="pravagragh_containerQuestionPaper">
                  {question.paragraph && question.paragraph.paragraphImg && (
                    <div className="Paragraph_divQuestionPaper">
                      <b>Paragraph:</b>
                      <img
                        src={`${BASE_URL}/uploads/${question.documen_name}/${question.paragraph.paragraphImg}`}
                        alt={`ParagraphImage ${question.paragraph.paragraph_Id}`}
                      />
                    </div>
                  )}
                </div>
              </div>
              <b>Question</b>
              <div className="question_number_containerQuestionPaper">
                <h4 id="question_numberQuestionPaper">{index + 1}.</h4>
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
  );
};

export default QuestionPaper;
