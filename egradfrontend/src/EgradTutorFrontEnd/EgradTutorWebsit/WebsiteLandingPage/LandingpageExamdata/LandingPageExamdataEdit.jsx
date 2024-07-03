// import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { LiaEditSolid } from "react-icons/lia";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { MdFileUpload } from "react-icons/md";
// import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
// import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
// import BASE_URL from "../../../../apiConfig";
// const LandingPageExamdataEdit = ({ enableButton, type }) => {
//   const [selectedImageId, setSelectedImageId] = useState(null);
//   const [examImageFile, setExamImageFile] = useState(null);
//   const [examBranches, setExamBranches] = useState([]);
//   const [branchId, setBranchId] = useState('');
//   const [examImage, setExamImage] = useState(null);
//   const [selectedBranchName, setSelectedBranchName] = useState('');
//   const [examImages, setExamImages] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [newExamName, setNewExamName] = useState("");
//   const [openAddExamForm, setOpenAddExamForm] = useState(false);
//   const themeFromContext = useContext(ThemeContext);
//   console.log(themeFromContext, "this is the theme from the context")
//   const handleExamImageChange = (e) => {
//     const file = e.target.files[0];
//     setExamImageFile(file);
//     setExamImage(file); // Assuming examImage is state variable set by useState
//   };
//   const handleSubmitExamImage = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('Branch_Id', branchId);
//     formData.append('Exam_Image', examImage);


//     axios.post(`${BASE_URL}/LandingPageExamEdit/uploadExamImage`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//       .then(response => {
//         console.log(response.data);
//         // Handle success
//       })
//       .catch(error => {
//         console.error('There was an error uploading the image!', error);
//         // Handle error
//       });
//   };
//   const fetchExamImages = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/LandingPageExamData/getExamImages`);
//       setExamImages(response.data.examImages);
//     } catch (error) {
//       console.error('Error fetching exam images:', error);
//     }
//   };
//   useEffect(() => {
//     fetchExamImages();
//   }, []);

//   const handleUpdateExamImage = async (selectedImageId) => {
//     console.log(selectedImageId);
//     const formData = new FormData();
//     formData.append('Exam_Image', examImageFile);
//     console.log(formData);
//     try {
//       const response = await axios.put(`${BASE_URL}/LandingPageExamEdit/updateExamImage/${selectedImageId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       alert(response.data.message);
//       fetchExamImages();
//     } catch (error) {
//       console.error('Error updating exam image:', error);
//       alert('Failed to update exam image');
//     }
//   };




//   const handleBranchIdChange = (e) => {
//     const selectedId = e.target.value;
//     setBranchId(selectedId);
//     const selectedBranch = branches.find(branch => branch.Branch_Id === selectedId);
//     if (selectedBranch) {
//       setSelectedBranchName(selectedBranch.Branch_Name);
//     } else {
//       setSelectedBranchName('');
//     }
//   };
//   const handleEditClick = (branch) => {
//     setSelectedBranch(branch);
//     setShowPopup(true);
//   };
//   const handleClosePopup = () => {
//     setShowPopup(false);
//     setOpenAddExamForm(false);
//   };
//   useEffect(() => {
//     fetchBranches();
//   }, []);

//   const fetchBranches = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/BHPNavBar/branches`);
//       const data = await response.json();
//       setBranches(data);
//     } catch (error) {
//       console.error("Error fetching branches:", error);
//     }
//   };
//   const handleSaveChanges = async () => {
//     try {
//       const updatedExams = selectedBranch.EntranceExams.map((exam) => ({
//         EntranceExams_Id: exam.EntranceExams_Id,
//         EntranceExams_name: exam.EntranceExams_name,
//       }));

//       for (const exam of updatedExams) {
//         await axios.put(
//           `${BASE_URL}/LandingPageExamEdit/updateentrance_exam/${exam.EntranceExams_Id}`,
//           {
//             EntranceExams_name: exam.EntranceExams_name,
//           }
//         );
//       }
//       alert("Entrance exams updated successfully.");
//       handleClosePopup();
//     } catch (error) {
//       console.error(error);

//       alert(
//         "An error occurred while updating entrance exams. Please try again later."
//       );
//     }
//     fetchBranches();
//   };
//   const handleDeleteExam = async (examId) => {
//     console.log(examId);
//     try {
//       await axios.delete(`${BASE_URL}/LandingPageExamEdit/entrance_exam/${examId}`);
//       alert("Entrance exam deleted successfully.");
//     } catch (error) {
//       console.error(error);
//       alert(
//         "An error occurred while deleting the entrance exam. Please try again later."
//       );
//     }
//     fetchBranches();
//   };
//   const handleInputChange = (e) => {
//     setNewExamName(e.target.value);
//   };
//   const handleAddExam = async (branchId) => {
//     try {
//       await axios.post(`${BASE_URL}/LandingPageExamEdit/addNewentrance_exam`, {
//         Branch_Id: branchId, // Corrected field name to match the backend
//         EntranceExams_name: newExamName, // Corrected field name to match the backend
//       });
//       alert("Exam added successfully.");
//       setNewExamName("");
//     } catch (error) {
//       console.error(error);
//       alert("An error occurred while adding the exam. Please try again later.");
//     }
//     fetchBranches();
//   };
//   const OpenAddExamForm = (branchBranch_Id) => {
//     console.log(branchBranch_Id);
//     setOpenAddExamForm(branchBranch_Id); // Set the state to the branch's ID
//   };
//   const [openUgExamImageUpload, setOpenUgExamImageUpload] = useState(false);
//   const OpenExamImageUplaod = () => {
//     setOpenUgExamImageUpload(true);
//   }
//   const themeColor = themeFromContext[0]?.current_theme;
//   console.log(themeColor, "this is the theme json classesssssss")
//   const themeDetails = JSONClasses[themeColor] || []
//   console.log(themeDetails, "mapppping from json....")
//   return (
//     <div>
//       {enableButton === 'Enable Edit' ?
//         <button>Editing Button..........</button>
//         : null}

//       {type === "UploadExamImage" &&
//         <div>
//           <h2>Upload Exam Image</h2>
//           <form onSubmit={handleSubmitExamImage}>
//             <div>
//               <label>Select Branch:</label>
//               <select value={branchId} onChange={handleBranchIdChange} required>
//                 <option value="">Select Branch</option>
//                 {branches.map(branch => (
//                   <option key={branch.Branch_Id} value={branch.Branch_Id}>
//                     {branch.Branch_Name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Exam Image:</label>
//               <input type="file" onChange={handleExamImageChange} required />
//             </div>
//             <button type="submit">Upload</button>
//           </form>
//           <ul>
//             {examImages.map(image => (
//               <li key={image.Image_Id}>
//                 <button onClick={() => handleUpdateExamImage(image.Image_Id)}>Update</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       }

//       {type === "Add Exams" &&
//         <div>
//           {branches.map((branch) => (
//             <>
//               {openAddExamForm === branch.Branch_Id && (
//                 <div className="enableEditcontainerinlanding ">
//                   <div className="enableEditsubcontainerinlanding">
//                     <h3> Add Exam </h3>
//                     <ul>
//                       <li>
//                         <input
//                           type="text"
//                           value={newExamName}
//                           onChange={handleInputChange}
//                           placeholder="Enter exam name"
//                         />
//                       </li>
//                     </ul>
//                     <button onClick={() => handleAddExam(branch.Branch_Id)}>
//                       <IoMdAddCircleOutline />
//                       Add Exam
//                     </button>
//                     <button
//                       className="enableEditsubcontainerinlandingclosebtn"
//                       onClick={handleClosePopup}
//                     >
//                       &times;
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           ))}
//         </div>
//       }


//       {type = "Edit Exams" &&

//         <div>
//           {showPopup && selectedBranch && (
//             <div className="enableEditcontainerinlanding">
//               <div className="enableEditsubcontainerinlanding">
//                 <h3>Entrance Exams</h3>
//                 <ul>
//                   {selectedBranch.EntranceExams.map((exam, index) => (
//                     <li key={exam.EntranceExams_Id}>
//                       <input
//                         type="text"
//                         value={exam.EntranceExams_name}
//                         onChange={(e) => {
//                           const updatedExams = [
//                             ...selectedBranch.EntranceExams,
//                           ];
//                           updatedExams[index].EntranceExams_name =
//                             e.target.value;
//                           setSelectedBranch({
//                             ...selectedBranch,
//                             EntranceExams: updatedExams,
//                           });
//                         }}
//                       />

//                       <button>
//                         {" "}
//                         <RiDeleteBin6Line
//                           onClick={() =>
//                             handleDeleteExam(exam.EntranceExams_Id)
//                           }
//                         />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button onClick={handleSaveChanges}>Update</button>
//                 <button
//                   className="enableEditsubcontainerinlandingclosebtn"
//                   onClick={handleClosePopup}
//                 >close
//                   &times;
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       }
     
//     </div>
//   )
// }
// export default LandingPageExamdataEdit

import React, { useEffect, useState } from "react";
import axios from 'axios'
import BASE_URL from '../../../../apiConfig';

const LandingPageExamdataEdit = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [examName, setExamName] = useState('');
 



  // Use useEffect to call fetchAllBranches on component mount

    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/BHPNavBar/branches`);
        console.log("Fetched branches:", response.data);
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/LandingPageExamEdit/addEntranceExam`, {
        EntranceExams_name: examName,
        Branch_Id: selectedBranch
      });
      console.log('Response:', response.data);
      alert('Entrance exam data saved successfully!');
      setExamName('');
      setSelectedBranch('');
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error);
      alert('Failed to save entrance exam data');
    }
  };

  return (
    <div>


<form onSubmit={handleSubmit}>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="">Select Branch</option>
          {branches.length > 0 ? (
            branches.map((branch) => (
              <option key={branch.Branch_Id} value={branch.Branch_Id}>
                {branch.Branch_Name}
              </option>
            ))
          ) : (
            <option value="" disabled>No branches available</option>
          )}
        </select>

        <textarea
          placeholder="Enter Exam Name"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
   


    </div>
  )
}

export default LandingPageExamdataEdit
