import { window } from "d3";
import React, { useState, useEffect } from "react";
import BASE_URL from '../../apiConfig'
const StudentDoubtSection = () => {
  const [doubtData, setDoubtData] = useState([]);
  const [selectedDoubtId, setSelectedDoubtId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const [solutionImage, setSolutionImage] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/DoubtSection/fetchData`
        );
        if (response.ok) {
          const data = await response.json();
          setDoubtData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [selectedDoubtId]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSolutionImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
const handleSendSolution = async (doubtId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/DoubtSection/sendSolution`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doubtId, solutionText, solutionImage }),
      }
    );
    // Solution email sent successfully
    if (response.status.ok) {
      const data = await response.json();
      if (data.success) {
        console.log("Message submitted successfully");
        window.location.reload();
      } else {
        console.error("Failed to submit message");
      }
    } else {
      console.error("Failed to submit message");
    }
  } catch (error) {
    console.error("Error submitting message:", error);
  }
};



  return (
    <div className="doubtsectionnodatapater">
      {/* <h2>Student Doubt Section</h2> */}
      {console.log("doubtData:", doubtData)}
      {doubtData && doubtData.questions && doubtData.questions.length > 0 ? (
        doubtData.questions.map((item, index) => (
          <div key={item.Doubt_Id} className="doubtDatacontainer">
            <div className="doubtDatacontainerName">
              <p>User Name: {item.username}</p>
              <p>Test Name: {item.TestName}</p>
              <p>Doubt Text: {item.Doubt_text}</p>
            </div>
            <div>
              <img className="dount-img" src={item.Doubt_Img} alt="dsfds" />
            </div>
            <div className="resultSolutionsQ">
              <p>{index + 1}</p>
              <img
                src={`${BASE_URL}/uploads/${item.documen_name}/${item.questionImgName}`}
                alt={`Question ${index + 1}`}
              />
            </div>

            {item.options && item.options.length > 0 && (
              <ul>
                {item.options.map((option, optionIndex) => (
                  <li key={option.option_id}>
                    {option.option_index}: {option.ans}
                    {option.optionImgName && (
                      <img
                        src={`${BASE_URL}/uploads/${item.documen_name}/${option.optionImgName}`}
                        alt={`Option ${option.option_index}`}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}

            {item.answer && (
              <img
                src={`${BASE_URL}/uploads/${item.documen_name}/${item.answer.solutionImgName}`}
                alt=""
              />
            )}
            <button
              onClick={() => {
                if (item.Doubt_Id) {
                  setSelectedDoubtId(item.Doubt_Id); // Set the selected doubtId
                  setIsPopupOpen(true);
                } else {
                  console.error("Doubt ID not available for the selected item");
                }
              }}
            >
              Send Solution
            </button>

            {isPopupOpen && (
              <div className="popup ">
                <div className="Challenge_Popup">
                  <label>
                    Solution:
                    <input
                      type="text"
                      placeholder="Enter your solution"
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                    />
                  </label>
                  <label>
                    Select Image:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <div className="handleSend_Solution">
                    <button onClick={() => handleSendSolution(item.Doubt_Id)}>
                      Send
                    </button>

                    <button onClick={() => setIsPopupOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <hr />
          </div>
        ))
      ) : (
        <div className="doubtsectionnodata">
          <p>No doubt data available.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDoubtSection;
