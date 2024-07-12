import React, { useState, useEffect } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
const AboutUsEdit = ({ type }) => {
  const [showAboutUsForm, setShowAboutUsForm] = useState(false);
  const [showAboutEgtForm, setShowAboutEgtForm] = useState(false);
  const [aboutUsTitle, setAboutUsTitle] = useState("");
  const [aboutUsDescription, setAboutUsDescription] = useState("");
  const [editAboutUsId, setEditAboutUsId] = useState(null);
  const [aboutegrad, setAboutegrad] = useState("");
  const [aboutEgradData, setAboutEgradData] = useState([]);
  const [aboutUsData, setAboutUsData] = useState([]);
  const [aboutUsImage, setAboutUsImage] = useState(null);
const [editingId, setEditingId] = useState("");
 
 
const handleSubmitAboutEgrad = async (e) => {
  e.preventDefault();
 
  try {
    if (editingId) {
      console.log('Updating record with ID:', editingId);
      await axios.put(`${BASE_URL}/AboutUsEdit/about_egt/${editingId}`, { aboutegrad });
 
      setAboutEgradData(prevData =>
        prevData.map(item =>
          item.about_egt_id === editingId ? { ...item, about_egt: aboutegrad } : item
        )
      );
      setEditingId(null); // Clear the editing ID after update
    } else {
      const response = await axios.post(`${BASE_URL}/AboutUsEdit/about_egt`, { aboutegrad });
      setAboutEgradData(prevData => [
        ...prevData,
        { about_egt_id: response.data.insertId, about_egt: aboutegrad }
      ]);
    }
 
    setAboutegrad(""); // Clear the input field
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    let formData = new FormData();
    formData.append('Title', aboutUsTitle);
    formData.append('Description', aboutUsDescription);
 
    if (aboutUsImage) {
      formData.append('About_Us_Image', aboutUsImage); // Ensure this is a File object
    }
 
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
 
    try {
      let url;
      let method;
     
      if (editAboutUsId) {
        // Updating existing record
        url = `${BASE_URL}/AboutUsEdit/about_us/${editAboutUsId}`;
        method = 'put';
      } else {
        // Creating new record
        url = `${BASE_URL}/AboutUsEdit/about_us`;
        method = 'post';
      }
 
      const response = await axios({ url, method, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
      console.log("Response data:", response.data);
 
      alert(editAboutUsId ? "About Us data updated successfully!" : "About Us data saved successfully!");
 
      // Reset form fields
      setAboutUsTitle("");
      setAboutUsDescription("");
      setAboutUsImage(null);
      setShowAboutUsForm(false);
 
      // Fetch updated data to reflect changes
      fetchAboutUsData();
    } catch (error) {
      console.error("Error handling About Us data:", error.message);
      console.error("Error details:", error.response?.data || error);
    }
  };
 
  const handleImageUpload = (file) => {
    setAboutUsImage(file); // Store the File object
  };
 
 
const handleEditAboutegrad = (about_egt_id) => {
  console.log('Editing ID:', about_egt_id); // Verify if ID is logged correctly
  const aboutEgradToEdit = aboutEgradData.find(item => item.about_egt_id === about_egt_id);
  if (aboutEgradToEdit) {
    setEditingId(aboutEgradToEdit.about_egt_id);
    setAboutegrad(aboutEgradToEdit.about_egt);
    setShowAboutEgtForm(true);
  } else {
    console.error('No item found for ID:', about_egt_id);
  }
};
 
 
  const handleEditAboutUs = (aboutUs) => {
    setEditAboutUsId(aboutUs.about_us_id);
    setAboutUsTitle(aboutUs.Title);
    setAboutUsDescription(aboutUs.Description);
    setAboutUsImage(null); // Reset the image state first
 
    if (aboutUs.About_Us_Image) {
      // Convert base64 to blob
      const byteString = atob(aboutUs.About_Us_Image.split(',')[1]);
      const mimeString = aboutUs.About_Us_Image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "image.jpg", { type: mimeString });
      setAboutUsImage(file);
    }
 
    setShowAboutUsForm(true);
  };
 
  const handleDeleteAboutegrad = async (about_egt_id) => {
    try {
      await axios.delete(`${BASE_URL}/AboutUsEdit/about_egt`);
      alert("About eGRAD Tutor data deleted successfully!");
      fetchAboutEgradData();
    } catch (error) {
      console.error("Error deleting About eGRAD Tutor data:", error);
    }
  };
 
  const handleDeleteAboutUs = async (about_us_id) => {
    try {
      await axios.delete(`${BASE_URL}/AboutUsEdit/about_us/${about_us_id}`);
      alert("About Us data deleted successfully!");
      fetchAboutUsData();
    } catch (error) {
      console.error("Error deleting About Us data:", error);
    }
  };
  const fetchAboutEgradData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/AboutUs/about_egt`);
      setAboutEgradData(response.data);
      console.log(
        "About eGRAD Tutor data fetched successfully:",
        response.data
      );
    } catch (error) {
      console.error("Error fetching About eGRAD Tutor data:", error);
    }
  };
 
  const fetchAboutUsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/AboutUs/about_us`);
      setAboutUsData(response.data);
    } catch (error) {
      console.error("Error fetching About Us data:", error);
    }
  };
 
  useEffect(() => {
    fetchAboutUsData();
    fetchAboutEgradData();
  }, []);
 
  useEffect(() => {
    if (type === "aboutUs") {
      fetchAboutUsData();
    } else if (type === "aboutEgrad") {
      fetchAboutEgradData();
    }
  }, [type]);
 
  return (
    <div>
     
 
{type === "aboutUs" && (
        <div className="about_egt_popup">
          <div className="about_egt_form">
            <form onSubmit={(e) => handleSubmit(e, "aboutUs")} encType="multipart/form-data">
              <label htmlFor="aboutUsTitle">Title:</label>
              <input
                id="aboutUsTitle"
                value={aboutUsTitle}
                onChange={(e) => setAboutUsTitle(e.target.value)}
              />
              <label htmlFor="aboutUsDescription">Description:</label>
              <textarea
                id="aboutUsDescription"
                value={aboutUsDescription}
                onChange={(e) => setAboutUsDescription(e.target.value)}
                placeholder="Description"
                rows={10}
                cols={20}
              />
              <label htmlFor="aboutUsImage">Image:</label>
              <input
                id="aboutUsImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])} // Handle image upload
              />
              <button type="submit">Save About Us</button>
            </form>
          </div>
          {aboutUsData.map((aboutUs) => (
  <div key={aboutUs.about_us_id}>
    <h2>{aboutUs.Title}</h2>
    <p>{aboutUs.Description}</p>
    {aboutUs.About_Us_Image && (
      <img
        src={aboutUs.About_Us_Image}
        alt="About Us"
        style={{ width: '100px', height: 'auto' }}
      />
    )}
    <div>
      <button
        onClick={() => handleEditAboutUs(aboutUs)}
        className="popup_edit_btn"
      >
        <BiSolidEditAlt />
      </button>
      <button
        onClick={() => handleDeleteAboutUs(aboutUs.about_us_id)}
        className="popup_delete_btn"
      >
        <MdDelete />
      </button>
    </div>
  </div>
))}
 
 
        </div>
      )}
 
   
 
{type === "aboutEgrad" && (
  <div className="about_egt_popup">
    <div className="about_egt_form">
      <form onSubmit={handleSubmitAboutEgrad}>
        <label htmlFor="aboutegradtutor">About eGRAD Tutor</label>
        <textarea
          id="aboutegradtutor"
          value={aboutegrad}
          onChange={(e) => setAboutegrad(e.target.value)}
          placeholder="About eGRAD Tutor"
          rows={10}
          cols={20}
        />
        <button type="submit">
          {editingId ? "Update" : "Save About eGRAD Tutor"}
        </button>
      </form>
    </div>
    {aboutEgradData.map((aboutEgrad) => (
  <div key={aboutEgrad.about_egt_id}>
    <p>{aboutEgrad.about_egt}</p>
    <button
      onClick={() => handleEditAboutegrad(aboutEgrad.about_egt_id)}
      className="popup_edit_btn"
    >
      <BiSolidEditAlt />
    </button>
    <button
      onClick={() => handleDeleteAboutegrad(aboutEgrad.about_egt_id)}
      className="popup_delete_btn"
    >
      <MdDelete />
    </button>
  </div>
))}
 
 
  </div>
)}
 
 
    </div>
  );
};
 
export default AboutUsEdit;