import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../../apiConfig";
import { decryptData, encryptData } from "./utils/crypto";
import { Navbar, Intro_content } from "./Data/Introduction_Page_Data";
import { AiOutlineArrowRight } from "react-icons/ai";
// import "./styles/Instructions.scss";
import axios from "axios";

const InstructionPage = () => {
  const { param1, param2, param3 } = useParams();
  const navigate = useNavigate();
  const [decryptedParam1, setDecryptedParam1] = useState("");
  const [decryptedParam2, setDecryptedParam2] = useState("");
  const [decryptedParam3, setDecryptedParam3] = useState("");

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

  const Header = () => {
    const [testDetails, setTestDetails] = useState([]);
    useEffect(() => {
      const fetchTestDetails = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/TestResultPage/testDetails/${decryptedParam1}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch test details");
          }

          const data = await response.json();
          setTestDetails(data.results);
        } catch (error) {
          console.error("Error fetching test details:", error);
        }
      };

      if (decryptedParam1) {
        fetchTestDetails();
      }
    }, [decryptedParam1]);

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
        <div className="Quiz_header">
          <div className="Q_logo">
            <img src={image} alt="Current" />
          </div>
          <div className="Q_title">
            {testDetails && testDetails.length > 0 && (
              <div>
                <p className="testname_heading">{testDetails[0].TestName}</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const Intro_container = ({
    decryptedParam1,
    decryptedParam2,
    decryptedParam3,
  }) => {
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
      decryptedParam3
    ) => {
      try {
        const encryptedParam1 = await encryptData(decryptedParam1.toString());
        const encryptedParam2 = await encryptData(decryptedParam2.toString());
        const encryptedParam3 = await encryptData(decryptedParam3.toString());

        const token = new Date().getTime().toString();
        sessionStorage.setItem("navigationToken", token);

        const url = `/General_intructions_page/${encodeURIComponent(
          encryptedParam1
        )}/${encodeURIComponent(encryptedParam2)}/${encodeURIComponent(
          encryptedParam3
        )}`;

        navigate(url);
      } catch (error) {
        console.error("Error encrypting data:", error);
      }
    };

    return (
      <>
        {Intro_content.map((Intro_content, index) => (
          <div key={index} className="Q_container">
            <h2>{Intro_content.Intro_content_text_center}</h2>
            <h3>{Intro_content.Intro_content_text_subheading_1}</h3>
            <ol>
              <li>{Intro_content.Intro_content_points_1}</li>
              <li>{Intro_content.Intro_content_points_2}</li>
              <li>{Intro_content.Intro_content_points_3}</li>
              <div className="img_container">
                <p>
                  <div className="intro_img intro_img1">1</div>
                  {Intro_content.Intro_content_points_p1}
                </p>
                <p>
                  <div className="intro_img intro_img2">3</div>
                  {Intro_content.Intro_content_points_p2}
                </p>
                <p>
                  <div className="intro_img intro_img3">5</div>
                  {Intro_content.Intro_content_points_p3}
                </p>
                <p>
                  <div className="intro_img intro_img4">7</div>
                  {Intro_content.Intro_content_points_p4}
                </p>
                <p>
                  <div className="intro_img intro_img5">9</div>
                  {Intro_content.Intro_content_points_p5}
                </p>
              </div>
              <p>{Intro_content.Intro_content_points_p}</p>
              <h3>{Intro_content.Intro_content_text_subheading_2}</h3>
              <li>
                {Intro_content.Intro_content_points_4}
                <ol>
                  <li>{Intro_content.Intro_content_points_4_a}</li>
                  <li>{Intro_content.Intro_content_points_4_b}</li>
                  <li>{Intro_content.Intro_content_points_4_c}</li>
                </ol>
              </li>
              <li>
                {Intro_content.Intro_content_points_5}
                <span> {Intro_content.span_1}</span>
                {Intro_content.Intro_content_points_5__}
              </li>
              <h3>{Intro_content.Intro_content_text_subheading_3}</h3>
              <li>
                {Intro_content.Intro_content_points_6}
                <ol>
                  <li>{Intro_content.Intro_content_points_6_a}</li>
                  <li>{Intro_content.Intro_content_points_6_b}</li>
                  <li>
                    {Intro_content.Intro_content_points_6_c}
                    <span> {Intro_content.span_2}</span>
                  </li>
                  <li>
                    {Intro_content.Intro_content_points_6_d}
                    <span> {Intro_content.span_3}</span>
                    {Intro_content.Intro_content_points_6_d__}
                  </li>
                  <li>{Intro_content.Intro_content_points_6_e}</li>
                </ol>
              </li>
              <li>
                {Intro_content.Intro_content_points_7}
                <ol>
                  <li>{Intro_content.Intro_content_points_7_a}</li>
                  <li>{Intro_content.Intro_content_points_7_b}</li>
                  <li>{Intro_content.Intro_content_points_7_c}</li>
                </ol>
              </li>
              <li>{Intro_content.Intro_content_points_8}</li>
              <h3>{Intro_content.Intro_content_text_subheading_4}</h3>
              <li>{Intro_content.Intro_content_points_9}</li>
              <li>{Intro_content.Intro_content_points_10}</li>
              <li>{Intro_content.Intro_content_points_11}</li>
              <li>{Intro_content.Intro_content_points_12}</li>
            </ol>
          </div>
        ))}
        <div className="intro_next_btn_container">
          <button
            onClick={() => {
              handleEndTheTest(user_Id);
              openGenInstPopup(
                decryptedParam1,
                decryptedParam2,
                decryptedParam3
              );
            }}
            className="intro_next_btn"
          >
            NEXT <AiOutlineArrowRight />
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <Intro_container
        decryptedParam1={decryptedParam1}
        decryptedParam2={decryptedParam2}
        decryptedParam3={decryptedParam3}
      />
    </>
  );
};

export default InstructionPage;
