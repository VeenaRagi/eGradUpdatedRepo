import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";

function Document_ImageInfo() {
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({});
  const { testCreationTableId, subjectId, sectionId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/DocumentUpload/fulldocimages/${testCreationTableId}/${subjectId}/${sectionId}`
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
  }, [testCreationTableId, subjectId, sectionId]); // Update the dependency array

  if (!questionData.questions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="otsMainPages">
      {/* Map over questions and render them */}
      <button
        type="button"
        onClick={() => navigate("/Adminpage")}
        className="ots_-createBtn"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div className="docInfoOts">
        <div>
          {[
            ...new Set(questionData.questions.map((item) => item.documen_name)),
          ].map((documen_name, index) => (
            <div key={index}>
              <h3 className="textColor">{documen_name}</h3>
            </div>
          ))}
        </div>
        
        {questionData.questions.map((question, index) => (
          <div key={index} className="question-container">
            <h3 className="docImgesTitle"> Question</h3>
            <img
              src={`http://localhost:5001/uploads/${question.documen_name}/${question.questionImgName}`}
              alt={`Question ${question.question_id}`}
            />

            {/* Display options */}
            <div>
              <h3 className="docImgesTitle"> Options</h3>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  ( {String.fromCharCode("a".charCodeAt(0) + optionIndex)})
                  <img
                    src={`http://localhost:5001/uploads/${question.documen_name}/${option.optionImgName}`}
                    alt={`Option ${option.option_id}`}
                  />
                </div>
              ))}
            </div>

            {/* Display solution */}
            {question.solution && (
              <div className="">
                <h3 className="docImgesTitle">Solution</h3>
                <img
                  src={`http://localhost:5001/uploads/${question.documen_name}/${question.solution.solutionImgName}`}
                  alt={`Solution ${question.solution.solution_id}`}
                />
              </div>
            )}

            <div style={{ display: "flex" }}>
              <div>
                {question.qtype && (
                  <div className="docInfoTitle">
                    <h3>qtype</h3>
                    {question.qtype.qtype_text}
                  </div>
                )}
              </div>
              <div>
                {question.answer && (
                  <div className="docInfoTitle">
                    <h3>ans</h3>
                    {question.answer.answer_text}
                  </div>
                )}
              </div>
              <div>
                {question.marks && (
                  <div className="docInfoTitle">
                    <h3>Marks</h3>
                    {question.marks.marks_text}
                  </div>
                )}
              </div>
              <div>
                {question.sortid && (
                  <div className="docInfoTitle">
                    <h3>sortid</h3>
                    {question.sortid.sortid_text}
                  </div>
                )}
              </div>
            </div>
            <p></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Document_ImageInfo;

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// function Document_ImageInfo() {
//   const [data, setData] = useState(null);
//   const { subjectId, testCreationTableId,sectionId } = useParams();
//   useEffect(() => {
//     fetchData();
//   }, []);
//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5001/DocumentUpload/getSubjectData/${subjectId}/${testCreationTableId}/${sectionId}`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setData(result);
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//       // Handle the error, e.g., show an error message to the user
//     }
//   };

//   if (!data) {
//     return <div>Loading...</div>;
//   }
//   const OptionLabels = ["(a)", "(b)", "(c)", "(d)"];
//   // Render your component using the fetched data
//   return (
//     <div className="Document_-images_-container otsMainPages">
//       {/* Access data as needed, for example: */}
//       <h1>
//         {data.document.documen_name} {data.document.subjectId}
//         {data.document.testCreationTableId}
//       </h1>
//       {/* Map over questions and render them */}
//       <div
//         className="q1s"
//         style={{
//           display: "flex",
//           gap: "4rem",
//           flexDirection: "column",
//           width: "81vw",
//           margin: "2rem",
//         }}
//       >
//         {data.questions.map((question, index) => (
//           <div
//             className="outColor examSubjects_-contant"
//             style={{ background: "", padding: "2rem 2rem" }}
//           >
//             <div key={question.question_id}>
//               <div className="question" key={index}>
//                 <h3 style={{ display: "flex", gap: "1rem" }}>
//                   {" "}
//                   <p>Question </p> {index + 1}
//                 </h3>

//                 <img
//                   src={`data:image/png;base64,${question.question_img}`}
//                   alt="Question"
//                 />
//               </div>

//               {data.options
//                 .filter((opt) => opt.question_id === question.question_id)
//                 .map((option, index) => (
//                   <div
//                     className="option"
//                     key={option.question_id}
//                     style={{ display: "flex", gap: "1rem" }}
//                   >
//                     <span>{OptionLabels[index]}</span>
//                     <img
//                       src={`data:image/png;base64,${option.option_img}`}
//                       alt={`Option ${OptionLabels[index]}`}
//                     />
//                   </div>
//                 ))}

//               {data.solutions
//                 .filter((sol) => sol.question_id === question.question_id)
//                 .map((solution) => (
//                   <div className="solution">
//                     <h3>solution </h3>
//                     <img
//                       key={solution.question_id}
//                       src={`data:image/png;base64,${solution.solution_img}`}
//                       alt="Solution"
//                     />
//                   </div>
//                 ))}

//               {data.answers
//                 .filter((ans) => ans.question_id === question.question_id)
//                 .map((answer) => (
//                   <div key={answer.answer_id}>
//                     <h3>Answer</h3>
//                     {answer.answer_text}
//                   </div>
//                 ))}

//               {data.marks
//                 .filter((markes) => markes.question_id === question.question_id)
//                 .map((markes) => (
//                   <div key={markes.markesId}>
//                     <h3>Marks</h3>
//                     {markes.marks_text}
//                   </div>
//                 ))}

//               {data.qtypes
//                 .filter((qtype) => qtype.question_id === question.question_id)
//                 .map((qtype) => (
//                   <div key={qtype.qtypeId}>
//                     <h3>QType</h3>
//                     {qtype.qtype_text}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Document_ImageInfo;
