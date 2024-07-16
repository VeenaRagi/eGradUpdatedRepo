import React, { useState } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import '../../../../styles/Default_landingPage_styles.css'
import '../../../../styles/AdminPopups.css';
const LandingPageHeaderEdit = ({ type }) => {
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [welcomeLongText, setWelcomeLongText] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const [welcomeimage, setWelcomeImage] = useState(null);

  const handlewelcomeImageChange = (e) => {
    setWelcomeImage(e.target.files[0]);
  };

  const handleWelcomeUpload = async () => {
    const formData = new FormData();
    formData.append("image", welcomeimage);

    try {
      const response = await axios.post(
        `${BASE_URL}/LandingPageHeaderEdit/welcomeimgupload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(`Image uploaded/updated with ID: ${response.data.id}`);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleWelcomeSubmit = async () => {
    const data = {
      welcome_text: welcomeText,
      welcome_longtext: welcomeLongText,
    };

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/LandingPageHeaderEdit/welcome/${editingId}`, data);
        alert("Data updated successfully");
      } else {
        await axios.post(`${BASE_URL}/LandingPageHeaderEdit/welcome`, data);
        alert("Data added successfully");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please choose a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${BASE_URL}/LandingPageHeaderEdit/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(`Image uploaded/updated with ID: ${response.data.id}`);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="Blur_Effect_Mode">
      {type === "addLogo" && (
        <div className="UploadPopups_Logo_Container">
          <h2>Upload Image</h2>
          <input type="file" onChange={handleImageChange} />
          <button onClick={handleUpload}>Submit</button>
        </div>
      )}
      <div className="UploadPopups_Container">
      {type === "WelcomeForm" && ( <div>
          <h2>Upload Image</h2>
          <input type="file" onChange={handlewelcomeImageChange} />
          <button onClick={handleWelcomeUpload}>Submit</button>

          <h2>Add/Edit Welcome Text</h2>
          <input
            type="text"
            placeholder="Welcome Text"
            value={welcomeText}
            onChange={(e) => setWelcomeText(e.target.value)}
          />
          <textarea
            placeholder="Welcome Long Text"
            value={welcomeLongText}
            onChange={(e) => setWelcomeLongText(e.target.value)}
          />
          <button onClick={handleWelcomeSubmit}>
            {editingId ? "Update" : "Submit"}
          </button>
        </div>)}
       
      </div>
      
    </div>
  );
};

export default LandingPageHeaderEdit;
