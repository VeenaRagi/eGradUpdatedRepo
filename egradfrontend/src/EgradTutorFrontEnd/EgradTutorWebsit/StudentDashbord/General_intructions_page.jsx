import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { decryptData, encryptData } from "./utils/crypto";
import BASE_URL from "../../../apiConfig";
import "./Style/Instructions.scss";
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";
import axios from "axios";

const General_intructions_page_container = () => {
  const location = useLocation();
  const { userData } = location.state || {}; 

  const { param1, param2, param3, param4 } = useParams();
  const navigate = useNavigate();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");
  const [decryptedParam3, setDecryptedParam3] = useState("");
  const [decryptedParam4, setDecryptedParam4] = useState("");
  const [instructionsData, setInstructionsData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
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
      const encryptedParam4 = await encryptData(decryptedParam4.toString());
      const token = new Date().getTime().toString();
      sessionStorage.setItem("navigationToken", token);

      const url1 = `/UG_OTSQuizPage/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}`;

      const url2 = `/UGQuestionBankQuiz/questionOptions/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}`;

      const url3 = `/PG_OTSQuizPage/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}`;

      const url4 = `/PGQuestionBankQuiz/questionOptions/${encodeURIComponent(
        encryptedParam1
      )}/${encodeURIComponent(encryptedParam2)}`;

      if (decryptedParam4 == 1) {
        if (decryptedParam3 == 1) {
          navigate(url1, { state: { userData } });
        } else if (decryptedParam3 == 2) {
          navigate(url2, { state: { userData } });
        }
      } else if (decryptedParam4 == 2) {
        if (decryptedParam3 == 1) {
          navigate(url3, { state: { userData } });
        } else if (decryptedParam3 == 2) {
          navigate(url4, { state: { userData } });
        }
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
    <>
      <div className="Quiz_header">
        <div className="Q_logo">
          <img src={image} alt="Current" />
        </div>
        <h1 className="general_instruction_page_heading">General Instructions</h1>
      </div>
      <div className="Instructions_containerdiv ">
        <div className="Instructions_container">
          <ul className="Instructions_points pg_Instructionsdiv2">
            {instructionsData.map((instruction, index) => (
              <React.Fragment key={index}>
                {index === 0 && <h2>{instruction.instructionHeading}</h2>}
                <li className="Instructions_points_list">{instruction.points}</li>
              </React.Fragment>
            ))}
          </ul>

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
          <div className="gn_next_btn_container1">
        <button
          className="gn_prev_btn"
          onClick={() => navigate(-1)}
        >
          <AiOutlineArrowLeft />Previous
        </button>
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
       
      </div>
        </div>
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

    
    </>
  );
};

export default General_intructions_page_container;
