

import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
// import { NavData } from "../components/ug_homepage/components/Header/NavData";

// ------------------ icons -----------------------
import { MdAlternateEmail } from "react-icons/md";
import { FaLock, FaUserAlt, FaImage } from "react-icons/fa";
import UploadexcelsheetStudents from "./UploadexcelsheetStudents";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [smessage, setSMessage] = useState("");

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length >= 6;
  };

  const isUsernameValid = (username) => {
    return username.length >= 3;
  };

const handleRegister = async (e) => {
  e.preventDefault();
  


  if (!isEmailValid(email)) {
    setMessage("Please enter a valid email address.");
    return;
  }

  // if (!isPasswordValid(password)) {
  //   setMessage("Password should be at least 6 characters long.");
  //   return;
  // }

  if (!isUsernameValid(username)) {
    setMessage("Username should be at least 3 characters long.");
    return;
  }

  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  if (profileImage) {
    formData.append("profileImage", profileImage, profileImage.name); // Append the image file with its name
  }

 try {
   const response = await axios.post(
     "http://localhost:5001/ughomepage_banner_login/register",
     formData,
     {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     }
   );

   console.log("123");
   console.log(formData);

   if (response.status === 201) {
     // Check for successful registration status
     setSMessage("User registered successfully. Login details sent to email.");
     setMessage("");
     setUsername("");
     setEmail("");
     setPassword("");
     setProfileImage(null);
     window.location.href = "/userlogin";
   }
 } catch (error) {
   setMessage(error.response?.data?.error || "Error registering user");
   console.error("Error:", error);
 }
};



  return (
    <>
      <div>
        <div>
          <div className="Quiz_main_page_header">
            {/* {NavData.map((NavData, index) => {
              return (
                <>
                  <div key={index} className="Quiz_main_page_navbar">
                    <div className="Quizzlogo">
                      <img src={NavData.logo} alt="" />
                    </div>

                    <div className="quiz_app_quiz_menu_login_btn_contaioner">
                      <button style={{ background: "none" }}>
                        <Link
                          to="/Exam_portal_home_page"
                          className="Quiz__home"
                        >
                          Home
                        </Link>
                      </button>
                      <div>
                        <a class="ugQUIz_login_btn" href="/uglogin">
                          Login
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              );
            })} */}
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="ug_logincontainer">
        <div className="ug_logincontainer_box">
          <h2>Register</h2>
          <div className="login_from_continer">
            <form onSubmit={handleRegister}>
              <label>
                <FaUserAlt />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </label>

              <label>
                <MdAlternateEmail />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </label>

              {/* <label>
                <FaLock />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </label> */}

              {/* Input for profile image */}
              <label>
                <FaImage />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </label>

              {message && <p style={{ color: "red" }}>{message}</p>}
              {smessage && <p style={{ color: "green" }}>{smessage}</p>}

              <button type="submit">Register</button>
            </form>
            <p>
              Already have an account? <Link to="/userlogin">Login here</Link>
            </p>
          </div>
        </div>

        {/* <UploadexcelsheetStudents /> */}
      </div>
    </>
  );
};

export default Register;



// export const UploadForm = () => {
//   const [file, setFile] = useState(null);

//   const handleFileUpload = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await axios.post(
//         "http://localhost:500/ughomepage_banner_login/studentexelsheet",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       alert("File uploaded successfully");
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="file" onChange={handleFileUpload} />
//       <button type="submit">Upload</button>
//     </form>
//   );
// };

 

// import React, { useState, useEffect } from "react";
// import { Link, Navigate } from "react-router-dom";
// import axios from "axios";
// import { NavData } from "../components/ug_homepage/components/Header/NavData";
// // StudentRegistationPage
// // ------------------ icons -----------------------
// import { MdAlternateEmail } from "react-icons/md";
// import { FaLock, FaUserAlt, FaImage } from "react-icons/fa";
// import UploadexcelsheetStudents from "./UploadexcelsheetStudents";
// import StudentRegistationPage from "../Exam_Portal_QuizApp/StudentRegistationPage";
// import noimg from "./asserts/NoImages.jpg";

// const Register = () => {
//   // "http://localhost:5001/ughomepage_banner_login/register",
//   const [genders, setGenders] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [states, setStates] = useState([]);
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelecteddistrict] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [missingFields, setMissingFields] = useState([]);
//   const [isChecked, setIsChecked] = useState(false);

//   const [formData, setFormData] = useState({
//     candidateName: "",
//     dateOfBirth: "",
//     email: "",
//     confirmEmail: "",
//     contactNo: "",
//     gender: "",
//     category: "",
//   });

//   const [photoImage, setPhotoImage] = useState(null);
//   const [signatureImage, setSignatureImage] = useState(null);
//   const [idProofImage, setIdProofImage] = useState(null);

//   const [selectedGenderId, setSelectedGenderId] = useState("");
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [educationDetails, setEducationDetails] = useState({
//     qualification: "",
//     collegeName: "",
//     passingYear: "",
//     marksPercentage: "",
//   });

//   const [communicationAddress, setCommunicationAddress] = useState({
//     line1: "",
//     state: "",
//     district: "",
//     pincode: "",
//   });

//   const [fatherDetails, setFatherDetails] = useState({
//     fatherName: "",
//     occupation: "",
//     mobileNo: "",
//   });

//   useEffect(() => {
//     fetchGenders();
//     fetchCategories();
//   }, []);

//   const fetchGenders = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5001/StudentRegistationPage/gender"
//       );
//       const data = await response.json();
//       setGenders(data);
//     } catch (error) {
//       console.error("Error fetching gender data:", error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5001/StudentRegistationPage/Category"
//       );
//       const data = await response.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching Category  data:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchState = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5001/StudentRegistationPage/states"
//         );
//         setStates(response.data);
//       } catch (error) {
//         console.error("Error fetching states:", error);
//       }
//     };

//     fetchState();
//   }, []);

//   // const handleStateChange = async (event) => {
//   //   const state_id = event.target.value;
//   //   setSelectedState(state_id);

//   //   try {
//   //     const response = await axios.get(
//   //       `http://localhost:5001/StudentRegistationPage/districts/${state_id}`
//   //     );
//   //     setDistricts(response.data);
//   //     setSelectedDistrict("");
//   //   } catch (error) {
//   //     console.error("Error fetching districts:", error);
//   //   }
//   // };
//   const handleStateChange = async (event) => {
//     const state_id = event.target.value;
//     setSelectedState(state_id);

//     try {
//       const response = await axios.get(
//         `http://localhost:5001/StudentRegistationPage/districts/${state_id}`
//       );
//       setDistricts(response.data);
//       setSelecteddistrict(""); // Reset selected district
//     } catch (error) {
//       console.error("Error fetching districts:", error);
//     }
//   };


//   const handleCheckboxChange = () => {
//     setIsChecked(!isChecked);
//   };

// const handleInputChange = (e) => {
//   const { name, value } = e.target;
//   switch (name) {
//     case "gender":
//       setSelectedGenderId(value);
//       break;
//     case "category":
//       setSelectedCategoryId(value);
//       break;
//     case "qualification":
//     case "collegeName":
//     case "passingYear":
//     case "marksPercentage":
//       setEducationDetails((prevEducationDetails) => ({
//         ...prevEducationDetails,
//         [name]: value,
//       }));
//       break;
//     case "line1":
//     case "state":
//     case "district":
//     case "pincode":
//       setCommunicationAddress((prevCommunicationAddress) => ({
//         ...prevCommunicationAddress,
//         [name]: value,
//       }));
//       break;
//     case "fatherName":
//     case "occupation":
//     case "mobileNo":
//       setFatherDetails((prevFatherDetails) => ({
//         ...prevFatherDetails,
//         [name]: value,
//       }));
//       break;
//     default:
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//   }
// };


//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     switch (e.target.id) {
//       case "uploadPhoto":
//         setPhotoImage(file);
//         break;
//       case "uploadSignature":
//         setSignatureImage(file);
//         break;
//       case "uploadIdProof":
//         setIdProofImage(file);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleregister = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5001/ughomepage_banner_login/newregister",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             formData,
//             selectedGenderId,
//             selectedCategoryId,
//             educationDetails,
//             communicationAddress,
//             fatherDetails,
//           }),
//         }
//       );
//       const data = await response.json();
//       console.log("Form data submitted successfully:", data);
//       // Reset form state or show success message
//     } catch (error) {
//       console.error("Error submitting form data:", error);
//       // Handle error, show error message, etc.
//     }
//   };

//   return (
//     <>
//       <div className="student_regiterfrom">
//         REGISTRATION
//         <div className="student_regitersubfrom">
//           <div className="strbox">
//             <div className="strs strs_1">
//               <h1>PERSONAL DETAILS</h1>

//               <div className="box_content">
//                 <label htmlFor="">CANDIDATE NAME(accoding to 10th memo):</label>
//                 <input
//                   type="text"
//                   name="candidateName"
//                   value={formData.candidateName}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="box_content">
//                 <label htmlFor="">DATE OF BIRTH:</label>
//                 <input
//                   type="date"
//                   name="dateOfBirth"
//                   value={formData.dateOfBirth}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div className="box_content_radio">
//                 <label htmlFor="">GENDER:</label>
//                 {/* <input type="radio" /> */}
//                 <div className="inputContent_from_radio">
//                   {genders.map((gender) => (
//                     <div
//                       className="inputContent_from_radio"
//                       key={gender.GenderId}
//                     >
//                       <input
//                         type="radio"
//                         id={gender.GenderId}
//                         name="gender"
//                         value={gender.GenderId}
//                         checked={parseInt(selectedGenderId) === gender.GenderId}
//                         onChange={handleInputChange}
//                         required
//                       />
//                       <label htmlFor={gender.GenderId}>{gender.Gander}</label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="box_content_radio">
//                 <label htmlFor="">CATEGORY:</label>
//                 <div className="inputContent_from_radio">
//                   {categories.map((category) => (
//                     <div
//                       className="inputContent_from_radio"
//                       key={category.CategoryId}
//                     >
//                       <input
//                         type="radio"
//                         id={category.CategoryId}
//                         name="category"
//                         value={category.CategoryId}
//                         checked={
//                           parseInt(selectedCategoryId) === category.CategoryId
//                         }
//                         onChange={handleInputChange}
//                         // required
//                       />
//                       <label htmlFor={category.CategoryId}>
//                         {category.Category}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//                 {/* <input type="radio" /> */}
//               </div>

//               <div className="box_content">
//                 <label htmlFor="">EMAIL ID:</label>
//                 <input
//                 name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div className="box_content">
//                 <label htmlFor="">CONFIRM EMAIL ID:</label>
//                 <input
//                   type="email"
//                   name="confirmEmail"
//                   value={formData.confirmEmail}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="box_content">
//                 <label htmlFor="">CONTACT NO:</label>
//                 <input
//                   type="number"
//                   name="contactNo"
//                   value={formData.contactNo}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>
//             <div className="strs strs_4">
//               <h1>EDUCATION DETAILS</h1>
//               <div className="box_content">
//                 <label htmlFor="qualification">QUALIFICATION:</label>
//                 <input
//                   type="text"
//                   name="qualification"
//                   value={educationDetails.qualification}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="box_content">
//                 <label htmlFor="collegeName">
//                   NAME OF COLLEGE (WITH CITY):
//                 </label>
//                 <input
//                   type="text"
//                   name="collegeName"
//                   value={educationDetails.collegeName}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="box_content">
//                 <label htmlFor="passingYear">PASSING YEAR:</label>
//                 <input
//                   type="text"
//                   name="passingYear"
//                   value={educationDetails.passingYear}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div className="box_content">
//                 <label htmlFor="marksPercentage">MARKS IN %:</label>
//                 <input
//                   type="text"
//                   name="marksPercentage"
//                   value={educationDetails.marksPercentage}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>

//             <div className="strs strs_3">
//               <h1>COMMUNICATION ADDRESS</h1>
//               <div className="box_content">
//                 <label htmlFor="line1">LINE1:</label>
//                 <input
//                   type="text"
//                   name="line1"
//                   value={communicationAddress.line1}
//                   onChange={handleInputChange}
//                 />
//               </div>{" "}
//               <div className="box_content">
//                 <label htmlFor="state">SELECT A STATE:</label>
//                 <select
//                   name="state"
//                   onChange={handleStateChange}
//                   value={communicationAddress.state}
//                   required
//                 >
//                   <option value="" disabled>
//                     Choose a state
//                   </option>
//                   {states.map((state) => (
//                     <option key={state.state_id} value={state.state_id}>
//                       {state.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {selectedState && (
//                 <div className="box_content">
//                   <label>SELECT A DISTRICT:</label>

//                   <div
//                     className={`       
//  ${missingFields.includes("districts_id") ? "missing-field" : ""}`}
//                   >
//                     <select
//                       name="district"
//                       onChange={handleInputChange}
//                       value={communicationAddress.district}
//                       required
//                     >
//                       <option value="" disabled>
//                         Choose a district
//                       </option>
//                       {districts.map((district) => (
//                         <option
//                           key={district.districts_id}
//                           value={district.districts_id}
//                         >
//                           {district.districts_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               )}
//               <div className="box_content">
//                 <label htmlFor="pincode">PINCODE:</label>
//                 <input
//                   type="number"
//                   name="pincode"
//                   value={communicationAddress.pincode}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>
//             <div className="strs strs_2">
//               <h1>FATHER'S/GUARDIAN'S DETAILS</h1>
//               <div className="box_content">
//                 <label htmlFor="fatherName">FATHER'S NAME:</label>
//                 <input
//                   type="text"
//                   name="fatherName"
//                   value={fatherDetails.fatherName}
//                   onChange={handleInputChange}
//                 />
//               </div>{" "}
//               <div className="box_content">
//                 <label htmlFor="occupation">OCCUPATION:</label>
//                 <input
//                   type="text"
//                   name="occupation"
//                   value={fatherDetails.occupation}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="box_content">
//                 <label htmlFor="mobileNo">MOBILE NO:</label>
//                 <input
//                   type="number"
//                   name="mobileNo"
//                   value={fatherDetails.mobileNo}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>

//             <div className="strs  strs_5">
//               <h1>UPLOAD IMAGE / DOCUMENTS</h1>
//               <div>
//                 <div className="box_contentIMG">
//                   <label htmlFor="uploadPhoto">UPLOAD PHOTO *</label>
//                   {!photoImage && (
//                     <div>
//                       <img
//                         src={noimg}
//                         alt="No Image"
//                         style={{ maxWidth: "100%", maxHeight: "100px" }}
//                       />
//                     </div>
//                   )}
//                   {photoImage && (
//                     <div>
//                       <img
//                         src={URL.createObjectURL(photoImage)}
//                         alt="Uploaded Photo"
//                         style={{ maxWidth: "100%", maxHeight: "100px" }}
//                       />
//                     </div>
//                   )}
//                   <input
//                     type="file"
//                     id="uploadPhoto"
//                     onChange={handleFileChange}
//                     accept="image/*"
//                   />
//                 </div>
//                 <div className="box_contentIMG">
//                   <label htmlFor="uploadSignature">UPLOAD SIGNATURE *</label>
//                   {!signatureImage && (
//                     <div>
//                       <img
//                         src={noimg}
//                         alt="No Image"
//                         style={{ maxWidth: "100%", maxHeight: "100px" }}
//                       />
//                     </div>
//                   )}
//                   {signatureImage && (
//                     <div>
//                       <img
//                         src={URL.createObjectURL(signatureImage)}
//                         alt="Uploaded Signature"
//                         style={{ maxWidth: "100%", maxHeight: "100px" }}
//                       />
//                     </div>
//                   )}
//                   <input
//                     type="file"
//                     id="uploadSignature"
//                     onChange={handleFileChange}
//                     accept="image/*"
//                   />
//                 </div>
//                 <div className="box_contentIMG">
//                   <label htmlFor="uploadIdProof">UPLOAD ID PROOF *</label>
//                   {!idProofImage && (
//                     <div>
//                       <img
//                         src={noimg}
//                         alt="No Image"
//                         style={{ maxWidth: "100%", maxHeight: "100px" }}
//                       />
//                     </div>
//                   )}

//                   {idProofImage && (
//                     <div>
//                       <img
//                         src={URL.createObjectURL(idProofImage)}
//                         alt="Uploaded ID Proof"
//                         style={{ maxWidth: "100%", maxHeight: "100px" }}
//                       />
//                     </div>
//                   )}

//                   <input
//                     type="file"
//                     id="uploadIdProof"
//                     onChange={handleFileChange}
//                     accept="image/*"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="from_submit">
//           <label>
//             <input
//               type="checkbox"
//               checked={isChecked}
//               onChange={handleCheckboxChange}
//             />
//             The details provided above are mine.
//           </label>
//         </div>
//         <div className="">
//           {isChecked ? (
//             <div className="submitBTn">
//               <button
//                 type="button"
//                 className="btnSubmit"
//                 onClick={handleregister}
//               >
//                 Submit
//               </button>
//             </div>
//           ) : (
//             <div className="submitBTn">
//               <button
//                 type="button"
//                 className="btnSubmit  btnSubmit_disable"
//                 disabled={!isChecked}
//               >
//                 Submit
//               </button>
//             </div>
//           )}
//         </div>
//         {/* <StudentRegistationPage /> */}
//       </div>
//     </>
//   );
// };

// export default Register;