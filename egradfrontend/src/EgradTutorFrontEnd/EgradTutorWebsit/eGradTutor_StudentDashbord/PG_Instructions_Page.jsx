import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../../apiConfig";
import { decryptData, encryptData } from "./utils/crypto";
import "./Style/PG_Instructions_Page.css";
import grayBox from "./asserts/grayBox.png";
import greenBox from "./asserts/greenBox.png";
import orangeBox from "./asserts/orangeBox.png";
import purpleBox from "./asserts/purpleBox.png";
import purpleTickBox from "./asserts/purpleTickBox.png";
import { AiOutlineArrowRight } from "react-icons/ai";
import axios from "axios";

const PG_Instructions_Page = () => {
  // const { user_Id } = useParams();
  // console.log("PG_Instructions_Page",user_Id)
  const { param1, param2, param3, param4 } = useParams();
  const navigate = useNavigate();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");
  const [decryptedParam3, setDecryptedParam3] = useState("");
  const [decryptedParam4, setDecryptedParam4] = useState("");
  const [userData, setUserData] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [error, setError] = useState(null);
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
  }, [param1, param2, param3, param4, navigate]);

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
      )}/${encodeURIComponent(encryptedParam4)}`;

      navigate(url, { state: { userData } });
    } catch (error) {
      console.error("Error encrypting data:", error);
    }
  };

  const user_Id = decryptedParam2;
  console.log("fetchStudentDetailstest", decryptedParam2);

  useEffect(() => {
    if (decryptedParam2) {
      const fetchStudentDetails = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/StudentSettings/fetchStudentDetailstest/${decryptedParam2}`
          );
          setStudentDetails(response.data);
        } catch (err) {
          setError("Error fetching student details");
          console.error(err);
        }
      };
      fetchStudentDetails();
    }
  }, [decryptedParam2]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!studentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="pg_Instructionspage">
        <div>
        <div className="pg_Instructionsdiv1">
          <div className="pg_Instructions"> Instructions</div>
          <div className="pg_readinstructionsdiv">
            <div className="pg_readinstructions">
              Please read the instructions carefully
            </div>

            <ul>
              <p className="pg_siteheding">General Instructions:</p>
              <li value="100">
                1.Total duration of examination is 180 minutes.
              </li>
              <li>
                2.The clock will be set at the server. The countdown timer in
                the top right corner of screen will display the remaining time
                available for you to complete the examination. When the timer
                reaches zero, the examination will end by itself. You will not
                be required to end or submit your examination.
              </li>
              <li>
                3.The Question Palette displayed on the right side of screen
                will show the status of each question using one of the following
                symbols:
              </li>
              <ul>
                <li>
                  <img src={grayBox} /> You have not visited the question yet.
                </li>
                <li>
                  <img src={orangeBox} /> You have not answered the question.
                </li>
                <li>
                  <img src={greenBox} />
                  You have answered the question.
                </li>
                <li>
                  <img src={purpleBox} /> You have NOT answered the question,
                  but have marked the question for review.
                </li>
                <li>
                  <img src={purpleTickBox} /> The question(s) "Answered and
                  Marked for Review" will be considered for evaluation.
                </li>
                <li>
                  The Marked for Review status for a question simply indicates
                  that you would like to look at that question again.
                </li>
              </ul>
              <li>
                4.You can click on the arrow which appears to the left of
                question palette to collapse the question palette thereby
                maximizing the question window. To view the question palette
                again, you can click on which appears on the right side of
                question window.
              </li>
              <li>
                5.You can click on your "Profile" image on top right corner of
                your screen to change the language during the exam for entire
                question paper. On clicking of Profile image you will get a
                drop-down to change the question content to the desired
                language.
              </li>
              <li>
                6.You can click on <i class="fa-solid fa-circle-down"></i> to
                navigate to the bottom and <i class="fa-solid fa-circle-up"></i>{" "}
                navigate to the top of the question area, without scrolling.
              </li>
              <p className="pg_siteheding">Navigating to a Question:</p>
              <li>
                7.To answer a question, do the following:
                <ul>
                  <li>
                    a.Click on the question number in the Question Palette at
                    the right of your screen to go to that numbered question
                    directly. Note that using this option does NOT save your
                    answer to the current question.
                  </li>
                  <li>
                    b.Click on Save & Next to save your answer for the current
                    question and then go to the next question.
                  </li>
                  <li>
                    c.Click on Mark for Review & Next to save your answer for
                    the current question, mark it for review, and then go to the
                    next question.
                  </li>
                </ul>
              </li>
              <p className="pg_siteheding">Answering a Question :</p>
              <li>
                8.Procedure for answering a multiple choice type question
                <ul>
                  <li>
                    To select your answer, click on the button of one of the
                    options
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
                    To save your answer, you MUST click on the Save & Next
                    button
                  </li>
                  <li>
                    To mark the question for review, click on the Mark for
                    Review & Next button.
                  </li>
                </ul>
              </li>
              <li>
                9.To change your answer to a question that has already been
                answered, first select that question for answering and then
                follow the procedure for answering that type of question.
              </li>
              <p className="pg_siteheding">Navigating through sections:</p>
              <li>
                10.Sections in this question paper are displayed on the top bar
                of the screen. Questions in a section can be viewed by clicking
                on the section name. The section you are currently viewing is
                highlighted.
              </li>
              <li>
                11.After clicking the Save & Next button on the last question
                for a section, you will automatically be taken to the first
                question of the next section.
              </li>
              <li>
                12.You can shuffle between sections and questions anytime during
                the examination as per your convenience only during the time
                stipulated.
              </li>
              <li>
                13.Candidate can view the corresponding section summary as part
                of the legend that appears in every section above the question
                palette.
              </li>
              <li>
                14.To zoom the image provided in the question roll over it.
              </li>
            </ul>
          </div>

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
      </div></div>
        <div className="pg_StudentDetails">
          {" "}
          {studentDetails.map((student, index) => (
            <div key={index}>
              <img
                className="users_profile_img"
                src={`${BASE_URL}/uploads/studentinfoimeages/${student.UplodadPhto}`}
                alt={`no img${student.UplodadPhto}`}
              />
              <p>{student.candidateName}</p>
            </div>
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default PG_Instructions_Page;
