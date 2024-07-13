import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { decryptData, encryptData } from "./utils/crypto"; // Assuming these are your encryption utilities
import BASE_URL from "../../../apiConfig";
import "./Style/Instructions.scss"
import { AiOutlineArrowRight } from "react-icons/ai";
// import { Header } from "./Header";

const General_intructions_page_container = () => {
  const { param1, param2, param3 } = useParams();
  const navigate = useNavigate();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");
  const [decryptedParam3, setDecryptedParam3] = useState("");
  const [instructionsData, setInstructionsData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [userData, setUserData] = useState({});
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

  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        fetchUserData();
      }
    };
    checkLoggedIn();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/ughomepage_banner_login/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        navigate("/Login"); // Redirect to login page if not authenticated
        return;
      }

      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
        navigate(url1);
      } else if (decryptedParam3 == 2) {
        navigate(url2);
      }
   
    } catch (error) {
      console.error("Error encrypting data:", error);
    }
  };



  return (
    <>
      {/* <Header /> */}
      <div className="Instructions_container">
        <h1>General Instructions</h1>
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