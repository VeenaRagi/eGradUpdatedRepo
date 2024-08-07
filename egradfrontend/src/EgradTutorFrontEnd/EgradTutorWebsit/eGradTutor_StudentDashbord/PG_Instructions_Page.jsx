// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import BASE_URL from "../../../apiConfig";
// import { decryptData, encryptData } from "./utils/crypto";
// import { Navbar, Intro_content } from "./Data/Introduction_Page_Data";
// import { AiOutlineArrowRight } from "react-icons/ai";
// // import "./styles/Instructions.scss";
// import axios from "axios";

// const InstructionPage = () => {
//   const { param1, param2, param3 } = useParams();
//   const navigate = useNavigate();
//   const [decryptedParam1, setDecryptedParam1] = useState("");
//   const [decryptedParam2, setDecryptedParam2] = useState("");
//   const [decryptedParam3, setDecryptedParam3] = useState("");
//   const [userData, setUserData] = useState(null);
//   useEffect(() => {
//     const token = sessionStorage.getItem("navigationToken");

//     if (!token) {
//       navigate("/Error");
//       return;
//     }

//     const decryptParams = async () => {
//       try {
//         const decrypted1 = await decryptData(param1);
//         const decrypted2 = await decryptData(param2);
//         const decrypted3 = await decryptData(param3);

//         if (
//           !decrypted1 ||
//           !decrypted2 ||
//           !decrypted3 ||
//           isNaN(parseInt(decrypted1)) ||
//           isNaN(parseInt(decrypted2)) ||
//           isNaN(parseInt(decrypted3))
//         ) {
//           navigate("/Error");
//           return;
//         }

//         setDecryptedParam1(decrypted1);
//         setDecryptedParam2(decrypted2);
//         setDecryptedParam3(decrypted3);
//       } catch (error) {
//         console.error("Error decrypting data:", error);
//         navigate("/Error");
//       }
//     };

//     decryptParams();
//   }, [param1, param2, param3, navigate]);

//   const Header = () => {
//     const [testDetails, setTestDetails] = useState([]);
//     useEffect(() => {
//       const fetchTestDetails = async () => {
//         try {
//           const response = await fetch(
//             `${BASE_URL}/TestResultPage/testDetails/${decryptedParam1}`
//           );

//           if (!response.ok) {
//             throw new Error("Failed to fetch test details");
//           }

//           const data = await response.json();
//           setTestDetails(data.results);
//         } catch (error) {
//           console.error("Error fetching test details:", error);
//         }
//       };

//       if (decryptedParam1) {
//         fetchTestDetails();
//       }
//     }, [decryptedParam1]);

//     const [image, setImage] = useState(null);
//     const fetchImage = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/Logo/image`, {
//           responseType: "arraybuffer",
//         });
//         const imageBlob = new Blob([response.data], { type: "image/png" });
//         const imageUrl = URL.createObjectURL(imageBlob);
//         setImage(imageUrl);
//       } catch (error) {
//         console.error("Error fetching image:", error);
//       }
//     };
//     useEffect(() => {
//       fetchImage();
//     }, []);

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//       // Function to handle message event
//       const handleMessage = (event) => {
//         // Verify if the message is from a trusted source if necessary
//         const { usersData } = event.data;
//         console.log("Received usersData:", usersData);

//         // Ensure usersData is valid before updating state
//         if (
//           usersData &&
//           typeof usersData === "object" &&
//           usersData.users &&
//           usersData.users.length > 0
//         ) {
//           setUserData(usersData); // Store usersData in component state
//           setLoading(false); // Turn off loading indicator once data is received
//         } else {
//           console.warn("Received undefined or invalid usersData:", usersData);
//         }
//       };

//       // Listen for messages from the parent window
//       window.addEventListener("message", handleMessage);

//       return () => {
//         window.removeEventListener("message", handleMessage);
//       };
//     }, []);

//     return (
//       <>
//         <div className="Quiz_header">
//           {/* <div className="Q_logo">
//             <img src={image} alt="Current" />
//           </div>
//           <div className="Q_title">
//             {testDetails && testDetails.length > 0 && (
//               <div>
//                 <p className="testname_heading">{testDetails[0].TestName}</p>
//               </div>
//             )}
//           </div>
//           */}

//         </div>
//       </>
//     );
//   };

//   const Intro_container = ({
//     decryptedParam1,
//     decryptedParam2,
//     decryptedParam3,
//   }) => {
//     const { user_Id } = useParams();

//     const handleEndTheTest = async (userId) => {
//       try {
//         const response = await fetch(
//           `http://localhost:5001/QuizPage/clearresponseforPB/${userId}`,
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: "Bearer yourAccessToken",
//             },
//             body: JSON.stringify({ userId }),
//           }
//         );

//         if (!response.ok) {
//           console.error("Failed to delete user data");
//         } else {
//           console.log("User data deleted successfully");
//         }
//       } catch (error) {
//         console.error("Error deleting user data:", error);
//       }
//     };

//     const openGenInstPopup = async (
//       decryptedParam1,
//       decryptedParam2,
//       decryptedParam3
//     ) => {
//       try {
//         const encryptedParam1 = await encryptData(decryptedParam1.toString());
//         const encryptedParam2 = await encryptData(decryptedParam2.toString());
//         const encryptedParam3 = await encryptData(decryptedParam3.toString());

//         const token = new Date().getTime().toString();
//         sessionStorage.setItem("navigationToken", token);

//         const url = `/General_intructions_page/${encodeURIComponent(
//           encryptedParam1
//         )}/${encodeURIComponent(encryptedParam2)}/${encodeURIComponent(
//           encryptedParam3
//         )}`;

//         navigate(url,{ state: { userData } });
//       } catch (error) {
//         console.error("Error encrypting data:", error);
//       }
//     };

//     return (
//       <>
//          <div> Instructions</div>
//           <div>
//             <div>Please read the instructions carefully</div>
//             <p><u>General Instructions:</u></p>
// <div>
//   <ul>
//   <li>1.Total duration of examination is 180 minutes.</li>
//   <li>2.The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</li>
//   <li>3.The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</li>
//   <ul>
//     <li><img/>	You have not visited the question yet.</li>
//     <li><img/>	You have not answered the question.</li>
//     <li><img/>You have answered the question.</li>
//     <li><img/>	You have NOT answered the question, but have marked the question for review.</li>
//     <li><img/>	The question(s) "Answered and Marked for Review" will be considered for evaluation.</li>
//     <li>The Marked for Review status for a question simply indicates that you would like to look at that question again.</li>
//   </ul>
//   <li>You can click on the  arrow which appears to the left of question palette to collapse the question palette thereby maximizing the question window. To view the question palette again, you can click on  which appears on the right side of question window.</li>
//   <li>
//   You can click on your "Profile" image on top right corner of your screen to change the language during the exam for entire question paper. On clicking of Profile image you will get a drop-down to change the question content to the desired language.
//   </li>
//   <li>
//   You can click on Scroll Down to navigate to the bottom and Scroll Upto navigate to the top of the question area, without scrolling.
//   </li>
//   <p><u>Navigating to a Question:</u></p>
//   <li>To answer a question, do the following:
//     <ul>
//       <li>a.Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
//       <li>
//       b.Click on Save & Next to save your answer for the current question and then go to the next question.
//       </li>
//       <li>
//       c.Click on Mark for Review & Next to save your answer for the current question, mark it for review, and then go to the next question.
//       </li>
//     </ul>
//   </li>
//   <p><u>Answering a Question :</u></p>
//   <li>Procedure for answering a multiple choice type question
//     <ul>
//       <li>To select your answer, click on the button of one of the options</li>
//       <li>
//       To deselect your chosen answer, click on the button of the chosen option again or click on the Clear Response button
//       </li>
//       <li>To change your chosen answer, click on the button of another option
//         </li>
//         <li>To save your answer, you MUST click on the Save & Next button
//           </li>
//           <li>To mark the question for review, click on the Mark for Review & Next button.</li>
//     </ul>

//   </li>
//   <li>To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question.</li>
//   <p><u>Navigating through sections:</u></p>
//   <li>Sections in this question paper are displayed on the top bar of the screen. Questions in a section can be viewed by clicking on the section name. The section you are currently viewing is highlighted.
//     </li>
//     <li>After clicking the Save & Next button on the last question for a section, you will automatically be taken to the first question of the next section.</li>
//     <li>
//     You can shuffle between sections and questions anytime during the examination as per your convenience only during the time stipulated.
//     </li>
//     <li>Candidate can view the corresponding section summary as part of the legend that appears in every section above the question palette.</li>
//     <li>To zoom the image provided in the question roll over it.</li>
//   </ul>

// </div>

//           </div>
//         <div className="intro_next_btn_container">
//           <button
//             onClick={() => {
//               handleEndTheTest(user_Id);
//               openGenInstPopup(
//                 decryptedParam1,
//                 decryptedParam2,
//                 decryptedParam3
//               );
//             }}
//             className="intro_next_btn"
//           >
//             NEXT <AiOutlineArrowRight />
//           </button>
//         </div>
//       </>
//     );
//   };

//   return (
//     <>
//       <Header />
//       <Intro_container
//         decryptedParam1={decryptedParam1}
//         decryptedParam2={decryptedParam2}
//         decryptedParam3={decryptedParam3}
//       />
//     </>
//   );
// };

// export default InstructionPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../../apiConfig";
import { decryptData, encryptData } from "./utils/crypto";
import "./Style/PG_Instructions_Page.css";
import grayBox from "./asserts/grayBox.png"
import greenBox from "./asserts/greenBox.png"
import orangeBox from "./asserts/orangeBox.png"
import purpleBox from "./asserts/purpleBox.png"
import purpleTickBox from "./asserts/purpleTickBox.png"
import { AiOutlineArrowRight } from "react-icons/ai";

const PG_Instructions_Page = () => {

  const { param1, param2, param3,param4 } = useParams();
  const navigate = useNavigate();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");
  const [decryptedParam3, setDecryptedParam3] = useState("");
  const [decryptedParam4, setDecryptedParam4] = useState("");
  const [userData, setUserData] = useState(null);
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
        const decrypted3 = await decryptData(param3);
        const decrypted4 = await decryptData(param4);

        if (
          !decrypted1 ||
          !decrypted2 ||
          !decrypted3 ||
          !decrypted4 ||
          isNaN(parseInt(decrypted1)) ||
          isNaN(parseInt(decrypted2)) ||
          isNaN(parseInt(decrypted3)) ||
          isNaN(parseInt(decrypted4))
        ) {
          navigate("/Error");
          return;
        }

        setDecryptedParam1(decrypted1);
        setDecryptedParam2(decrypted2);
        setDecryptedParam3(decrypted3);
        setDecryptedParam4(decrypted4);
      } catch (error) {
        console.error("Error decrypting data:", error);
        navigate("/Error");
      }
    };

    decryptParams();
  }, [param1, param2, param3,param4, navigate]);

  const { user_Id } = useParams();


  const handleEndTheTest = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/QuizPage/clearresponseforPB/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer yourAccessToken",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete user data");
      } else {
        console.log("User data deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  };

  const openGenInstPopup = async (
    decryptedParam1,
    decryptedParam2,
    decryptedParam3,
    decryptedParam4
  ) => {
    try {
      const encryptedParam1 = await encryptData(decryptedParam1.toString());
      const encryptedParam2 = await encryptData(decryptedParam2.toString());
      const encryptedParam3 = await encryptData(decryptedParam3.toString());
      const encryptedParam4 = await encryptData(decryptedParam4.toString());

      const token = new Date().getTime().toString();
      sessionStorage.setItem("navigationToken", token);

      const url = `/General_intructions_page/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}/${encodeURIComponent(
        encryptedParam3
      )}/${encodeURIComponent(
        encryptedParam4
      )}`;

      navigate(url,{ state: { userData } });
    } catch (error) {
      console.error("Error encrypting data:", error);
    }
  };

  return (
    <div>
      <div className="pg_Instructionspage">
        <div className="pg_Instructions"> Instructions</div>

        <div className="pg_readinstructions">
          Please read the instructions carefully
        </div>

        <ul>
          <p className="pg_siteheding">General Instructions:</p>
          <li  value="100">1.Total duration of examination is 180 minutes.</li>
          <li>
            2.The clock will be set at the server. The countdown timer in the
            top right corner of screen will display the remaining time available
            for you to complete the examination. When the timer reaches zero,
            the examination will end by itself. You will not be required to end
            or submit your examination.
          </li>
          <li>
            3.The Question Palette displayed on the right side of screen will
            show the status of each question using one of the following symbols:
          </li>
          <ul>
            <li>
              <img src={grayBox} /> You have not visited the question yet.
            </li>
            <li>
            <img src={orangeBox} />  You have not answered the question.
            </li>
            <li>
            <img src={greenBox} /> 
              You have answered the question.
            </li>
            <li>
            <img src={purpleBox} />  You have NOT answered the question, but have marked the
              question for review.
            </li>
            <li>
            <img src={purpleTickBox} />  The question(s) "Answered and Marked for Review" will be
              considered for evaluation.
            </li>
            <li>
              The Marked for Review status for a question simply indicates that
              you would like to look at that question again.
            </li>
          </ul>
          <li>
            4.You can click on the arrow which appears to the left of question
            palette to collapse the question palette thereby maximizing the
            question window. To view the question palette again, you can click
            on which appears on the right side of question window.
          </li>
          <li>
            5.You can click on your "Profile" image on top right corner of your
            screen to change the language during the exam for entire question
            paper. On clicking of Profile image you will get a drop-down to
            change the question content to the desired language.
          </li>
          <li>
            6.You can click on <i class="fa-solid fa-circle-down"></i> to navigate to the bottom and <i class="fa-solid fa-circle-up"></i> navigate to the top of the question area, without scrolling.
          </li>
          <p className="pg_siteheding">Navigating to a Question:</p>
          <li>
            7.To answer a question, do the following:
            <ul>
              <li>
                a.Click on the question number in the Question Palette at the
                right of your screen to go to that numbered question directly.
                Note that using this option does NOT save your answer to the
                current question.
              </li>
              <li>
                b.Click on Save & Next to save your answer for the current
                question and then go to the next question.
              </li>
              <li>
                c.Click on Mark for Review & Next to save your answer for the
                current question, mark it for review, and then go to the next
                question.
              </li>
            </ul>
          </li>
          <p className="pg_siteheding">Answering a Question :</p>
          <li>
            8.Procedure for answering a multiple choice type question
            <ul>
              <li>
                To select your answer, click on the button of one of the options
              </li>
              <li>
                To deselect your chosen answer, click on the button of the
                chosen option again or click on the Clear Response button
              </li>
              <li>
                To change your chosen answer, click on the button of another
                option
              </li>
              <li>
                To save your answer, you MUST click on the Save & Next button
              </li>
              <li>
                To mark the question for review, click on the Mark for Review &
                Next button.
              </li>
            </ul>
          </li>
          <li>
            9.To change your answer to a question that has already been answered,
            first select that question for answering and then follow the
            procedure for answering that type of question.
          </li>
          <p className="pg_siteheding">Navigating through sections:</p>
          <li>
           10.Sections in this question paper are displayed on the top bar of the
            screen. Questions in a section can be viewed by clicking on the
            section name. The section you are currently viewing is highlighted.
          </li>
          <li>
            11.After clicking the Save & Next button on the last question for a
            section, you will automatically be taken to the first question of
            the next section.
          </li>
          <li>
            12.You can shuffle between sections and questions anytime during the
            examination as per your convenience only during the time stipulated.
          </li>
          <li>
            13.Candidate can view the corresponding section summary as part of the
            legend that appears in every section above the question palette.
          </li>
          <li>14.To zoom the image provided in the question roll over it.</li>
        </ul>
        
      </div>
      <div className="intro_next_btn_container">
          <button
            onClick={() => {
              handleEndTheTest(user_Id);
              openGenInstPopup(
                decryptedParam1,
                decryptedParam2,
                decryptedParam3,
                decryptedParam4
              );
            }}
            className="intro_next_btn"
          >
            NEXT <AiOutlineArrowRight />
          </button>
        </div>
    </div>
  );
};

export default PG_Instructions_Page;
