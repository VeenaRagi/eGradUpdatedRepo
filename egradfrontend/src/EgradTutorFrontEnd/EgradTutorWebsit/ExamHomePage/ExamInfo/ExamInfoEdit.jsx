import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaRegPenToSquare } from "react-icons/fa6";
import '../../../../styles/ExamPage/DefaultThemeExamPage.css';
import '../../../../styles/Default_landingPage_styles.css'
const ExamInfoEdit = ({ type }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const { EntranceExams_Id } = useParams();
  const [existingInfo, setExistingInfo] = useState(false);
  const [newInfo, setNewInfo] = useState({
    Info_broucher: "",
    Official_Webpage: "",
    Conducting_Authority: "",
    Exam_Pattern: "",
    Eligibility: "",
    Syllabus: "",
    Important_Dates: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const handleInputChange = (e, field) => {
    setNewInfo({
      ...newInfo,
      [field]: e.target.value,
    });
  };


  useEffect(() => {
    const fetchSpecificExamInformation = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/ExamInfo/exam_info/${EntranceExams_Id}`
        );
        console.log("Specific Exam Info:", response.data);
        if (response.data && response.data.length > 0) {
          const fetchedSpecificInfo = response.data;
          const updatedInfo = fetchedSpecificInfo.reduce(
            (acc, info) => {
              if (info.Info_broucher !== null)
                acc.Info_broucher = info.Info_broucher;
              if (info.Official_Webpage !== null)
                acc.Official_Webpage = info.Official_Webpage;
              if (info.Conducting_Authority !== null)
                acc.Conducting_Authority = info.Conducting_Authority;
              if (info.Exam_Pattern !== null)
                acc.Exam_Pattern = info.Exam_Pattern;
              if (info.Eligibility !== null) acc.Eligibility = info.Eligibility;
              if (info.Syllabus !== null) acc.Syllabus = info.Syllabus;
              if (info.Important_Dates !== null)
                acc.Important_Dates = info.Important_Dates;
              return acc;
            },
            {
              Info_broucher: "",
              Official_Webpage: "",
              Conducting_Authority: "",
              Exam_Pattern: "",
              Eligibility: "",
              Syllabus: "",
              Important_Dates: "",
            }
          );
          setNewInfo(updatedInfo);
          setExistingInfo(true);
        } else {
          console.log("No specific exam info found.");
        }
      } catch (error) {
        console.error("Error fetching specific exam information:", error);
      }
    };
    fetchSpecificExamInformation();
  }, [EntranceExams_Id]);
  
  const handleSubmit = async () => {
    try {
      const dataToSend = {
        EntranceExams_Id,
        data: { ...newInfo },
      };

      if (existingInfo) {
        await axios.put(`${BASE_URL}/ExamInfoEdit/update_exam_info`, dataToSend);
        alert("Information updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/ExamInfoEdit/insert_exam_info`, dataToSend);
        alert("Information inserted successfully!");
      }
      setIsEditing(false); // Hide input fields after submission
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle editing state
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup by setting state to false
  };
  return (
    <div>
    {isPopupOpen && (
      <>
    <div className="Blur_Effect_Mode">
    <div className="handleCloseBtn">
        <button className="HCbutton" onClick={handleClosePopup}>close</button>
      </div>
      {type === "aboutUs" && (
        <div className="about_egt_popup">
          <div className="about_egt_form">
            <div className="popup_div">
              <p>Information Brochure</p>
              <textarea
                value={newInfo.Info_broucher}
                onChange={(e) => handleInputChange(e, "Info_broucher")}
                placeholder="Enter Info Brochure"
              />
              <p>Official Webpage</p>
              <textarea
                value={newInfo.Official_Webpage}
                onChange={(e) => handleInputChange(e, "Official_Webpage")}
                placeholder="Enter Official Webpage"
              />
            </div>
            <div className="popup_div">
              {" "}
              <p>Conducting Authority</p>
              <textarea
                value={newInfo.Conducting_Authority}
                onChange={(e) => handleInputChange(e, "Conducting_Authority")}
                placeholder="Enter Conducting Authority"
              />
              <p>Syllabus</p>
              <textarea
                value={newInfo.Syllabus}
                onChange={(e) => handleInputChange(e, "Syllabus")}
                placeholder="Enter Syllabus"
              />
            </div>

            <p>Exam Pattern</p>
            <textarea
              rows={10}
              coloms={50}
              value={newInfo.Exam_Pattern || ""}
              onChange={(e) => handleInputChange(e, "Exam_Pattern")}
              placeholder="Enter Exam Pattern"
            />
            <p>Eligibility</p>
            <textarea
              rows={10}
              coloms={20}
              value={newInfo.Eligibility}
              onChange={(e) => handleInputChange(e, "Eligibility")}
              placeholder="Enter Eligibility"
            />

            <p>Important Dates</p>
            <textarea
              rows={10}
              coloms={20}
              value={newInfo.Important_Dates}
              onChange={(e) => handleInputChange(e, "Important_Dates")}
              placeholder="Enter Important Dates"
            />

            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    
    </div>
    </>
    )}
    </div>
  )
}

export default ExamInfoEdit