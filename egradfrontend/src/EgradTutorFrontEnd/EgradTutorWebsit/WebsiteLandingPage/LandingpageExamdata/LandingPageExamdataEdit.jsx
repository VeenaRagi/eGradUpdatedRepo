import React, { useEffect, useState } from "react";
import axios from 'axios'
import BASE_URL from '../../../../apiConfig';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import '../../../../styles/Default_landingPage_styles.css'

const LandingPageExamdataEdit = ({ type }) => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [examName, setExamName] = useState('');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [examImage, setExamImage] = useState(null);
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [examImages, setExamImages] = useState([]);
  const [examImageFile, setExamImageFile] = useState(null);
  const [editingExamId, setEditingExamId] = useState(null);
  const [editedExamName, setEditedExamName] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(true);


  const fetchExamImages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/LandingPageExamData/getExamImages`);
      setExamImages(response.data.examImages);
    } catch (error) {
      console.error('Error fetching exam images:', error);
    }
  };
  useEffect(() => {
    fetchExamImages();
  }, []);

  const fetchBranchesExams = async () => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageExamData/branches`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBranches(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setError("Error fetching branches");
      setLoading(false);
    }
  };
  const handleExamImageChange = (e) => {
    const file = e.target.files[0];
    setExamImageFile(file);
    setExamImage(file); // Assuming examImage is state variable set by useState
  };
  const handleUpdateExamImage = async (selectedImageId) => {
    console.log(selectedImageId);
    const formData = new FormData();
    formData.append('Exam_Image', examImageFile);
    console.log(formData);
    try {
      const response = await axios.put(`${BASE_URL}/LandingPageExamEdit/updateExamImage/${selectedImageId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      fetchExamImages();
    } catch (error) {
      console.error('Error updating exam image:', error);
      alert('Failed to update exam image');
    }
  };


  const handleBranchIdChange = (e) => {
    const selectedId = e.target.value;
    setBranchId(selectedId);
    const selectedBranch = branches.find(branch => branch.Branch_Id === selectedId);
    if (selectedBranch) {
      setSelectedBranchName(selectedBranch.Branch_Name);
    } else {
      setSelectedBranchName('');
    }
  };

  const handleSubmitExamImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Branch_Id', branchId);
    formData.append('Exam_Image', examImage);
    axios.post(`${BASE_URL}/LandingPageExamEdit/uploadExamImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error uploading the image!', error);
      });
  };


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

  const fetchExamsData = async (branchId) => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageExamData/branches/${branchId}/exams`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error("Error fetching exams:", error);
      setError("Error fetching exams");
    } finally {
      setLoading(false);  // Ensure loading state is turned off
    }
  };

  useEffect(() => {
    fetchBranchesExams();
  }, []);
  useEffect(() => {
    if (branches.length > 0) {
      // Assuming you want to fetch exams for the first branch for demonstration
      fetchExamsData(branches[0].id);
    }
  }, [branches]);


  const handleEditClick = (examId, examName) => {
    setEditingExamId(examId);
    setEditedExamName(examName);
  };

  const handleInputChange = (event) => {
    setEditedExamName(event.target.value);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageExamEdit/updateEntranceExam`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EntranceExams_Id: editingExamId,
          EntranceExams_name: editedExamName,
          Branch_Id: branches.find(branch =>
            branch.EntranceExams.some(exam => exam.EntranceExams_Id === editingExamId)
          ).Branch_Id,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.message === 'Entrance exam data updated successfully') {
        const updatedBranches = branches.map(branch => ({
          ...branch,
          EntranceExams: branch.EntranceExams.map(exam =>
            exam.EntranceExams_Id === editingExamId ? { ...exam, EntranceExams_name: editedExamName } : exam
          ),
        }));
        setBranches(updatedBranches);
        setEditingExamId(null);
        setEditedExamName('');
      } else {
        console.error('Failed to update exam:', result.error);
        setError('Failed to update exam');
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      setError('Error updating exam');
    }
  };

  const handleCancelClick = () => {
    setEditingExamId(null);
    setEditedExamName('');
  };

  const handleDelete = async (examId) => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageExamEdit/deleteEntranceExam/${examId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.message === 'Entrance exam deleted successfully') {
        // Update the frontend state to remove the deleted exam
        const updatedBranches = branches.map(branch => ({
          ...branch,
          EntranceExams: branch.EntranceExams.filter(exam => exam.EntranceExams_Id !== examId)
        }));
        setBranches(updatedBranches);
      } else {
        console.error('Failed to delete exam:', result.error);
        setError('Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      setError('Error deleting exam');
    }
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
            {type === "UploadExamImage" && (
              <div className="UploadPopups_Container">
                <h2>Upload Exam Image</h2>
                <form onSubmit={handleSubmitExamImage}>
                  <div>
                    <label>Select Branch:</label>
                    <select value={branchId} onChange={handleBranchIdChange} required>
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch.Branch_Id} value={branch.Branch_Id}>
                          {branch.Branch_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Exam Image:</label>
                    <input type="file" onChange={handleExamImageChange} required />
                  </div>
                  <button type="submit">Upload</button>
                </form>
                <ul>
                  {examImages.map(image => (
                    <li key={image.Image_Id}>
                      <button onClick={() => handleUpdateExamImage(image.Image_Id)}>Update</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}


            {type === "Upload/EditExams" && (
              <div className="UploadPopups_Container">

                {/* Section for Adding Exam */}
                <div>
                  <h2>Add Exam</h2>
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

                {/* Section for Updating/Editing Exams */}
                <div>
                  <h2>Update Exams</h2>
                  {branches.map(branch => (
                    <div key={branch.Branch_Id}>
                      <ul>
                        {branch.EntranceExams.map(exam => (
                          <li key={exam.EntranceExams_Id}>
                            {editingExamId === exam.EntranceExams_Id ? (
                              <div>
                                <input
                                  type="text"
                                  value={editedExamName}
                                  onChange={handleInputChange}
                                />
                                <button onClick={handleSaveClick}>Save</button>
                                <button onClick={handleCancelClick}>Cancel</button>
                              </div>
                            ) : (
                              <div className="Exams_Container">
                                <div className="Exam_Item">
                                  {exam.EntranceExams_name}
                                  <div className="Icons_container">
                                    <button className="Edit_button" onClick={() => handleEditClick(exam.EntranceExams_Id, exam.EntranceExams_name)}>
                                      <CiEdit />
                                    </button>
                                    <button className="Delete_button" onClick={() => handleDelete(exam.EntranceExams_Id)}>
                                      <MdDelete />
                                    </button>
                                  </div>

                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default LandingPageExamdataEdit
