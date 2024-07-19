import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { decryptData, encryptData } from "./utils/crypto"; // Assuming these are your encryption utilities
import BASE_URL from "../../../apiConfig";
import "./Style/Instructions.scss";
import { AiOutlineArrowRight } from "react-icons/ai";
import axios from "axios";
import { useLocation } from 'react-router-dom';

const General_intructions_page_container = () => {

  const location = useLocation();
  const { userData } = location.state || {}; 

  const { param1, param2, param3 } = useParams();
  const navigate = useNavigate();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");
  const [decryptedParam3, setDecryptedParam3] = useState("");
  const [instructionsData, setInstructionsData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  // const [userData, setUserData] = useState({});
  // const user_Id = decryptedUserIdState;

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

        if (
          !decrypted1 ||
          !decrypted2 ||
          !decrypted3 ||
          isNaN(parseInt(decrypted1)) ||
          isNaN(parseInt(decrypted2)) ||
          isNaN(parseInt(decrypted3))
        ) {
          navigate("/Error");
          return;
        }

        setDecryptedParam1(decrypted1);
        setDecryptedParam2(decrypted2);
        setDecryptedParam3(decrypted3);
      } catch (error) {
        console.error("Error decrypting data:", error);
        navigate("/Error");
      }
    };

    decryptParams();
  }, [param1, param2, param3, navigate]);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/InstructionPage/fetchinstructions/${decryptedParam1}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch instructions");
        }
        const data = await response.json();
        setInstructionsData(data);
      } catch (error) {
        console.error("Error fetching instructions:", error);
      }
    };

    if (decryptedParam1) {
      fetchInstructions();
    }
  }, [decryptedParam1]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const openQuizPage = async () => {
    try {
      const encryptedParam1 = await encryptData(decryptedParam1.toString());
      const encryptedParam2 = await encryptData(decryptedParam2.toString());

      const token = new Date().getTime().toString();
      sessionStorage.setItem("navigationToken", token);

      const url1 = `/QuizPage/questionOptions/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}`;

      const url2 = `/QuestionBankQuiz/questionOptions/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}`;

      if (decryptedParam3 == 1) {
        // navigate(url1);
        navigate(url1, { state: { userData } });
      } else if (decryptedParam3 == 2) {
        // navigate(url2);
        navigate(url2, { state: { userData } });
      }
    } catch (error) {
      console.error("Error encrypting data:", error);
    }
  };

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

  return (
    <>
      {/* <Header /> */}
      <div className="Quiz_header">
        <div className="Q_logo">
          <img src={image} alt="Current" />
        </div>
        <h1 className="general_instruction_page_heading">General Instructions</h1>
      </div>
      {/* <h1>hellooooo</h1>
          {userData.users && userData.users.length > 0 && (
            <ul>
              {userData.users.map((user) => (
                <div className="greeting_section">
                  <h2 className="dashboard_greeting_container">
                    {user.username}
                  </h2>
                </div>
              ))}
            </ul>
          )} */}
      <div className="Instructions_container">
   
        <ul className="Instructions_points">
          {instructionsData.map((instruction, index) => (
            <React.Fragment key={index}>
              {index === 0 && <h2>{instruction.instructionHeading}</h2>}
              <li className="Instructions_points_list">{instruction.points}</li>
            </React.Fragment>
          ))}
        </ul>
      </div>

      <div>
        <div className="gn_checkbox">
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            className="checkbox"
          />
          <p>
            I agree to these <b>instructions.</b>
          </p>
        </div>
      </div>

      <div className="gn_next_btn_container">
        {isChecked ? (
          <Link className="gn_next_btn" onClick={openQuizPage}>
            I am ready to begin <AiOutlineArrowRight />
          </Link>
        ) : (
          <div>
            <span className="disabled-link gn_next_btn_bull">
              I am ready to begin <AiOutlineArrowRight />
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default General_intructions_page_container;






