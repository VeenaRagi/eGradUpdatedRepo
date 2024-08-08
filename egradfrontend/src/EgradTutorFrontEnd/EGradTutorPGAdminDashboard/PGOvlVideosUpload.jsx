
import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../apiConfig"
import ReactPaginate from "react-paginate";
import { FaSearch } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import '../../EgradTutorFrontEnd/EgradtutorPortalsAdmin/styles/Ovlvidesupload.css'
// import '../../EgradTutorFrontEnd/'
function PGOvlVideosUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [ovlData, setOvlData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [pageNumber, setPageNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [lectureName, setLectureName] = useState("");
  const [lectureOrder, setLectureOrder] = useState(0);

  const usersPerPage = 15;

  useEffect(() => {
    fetchCourses();
    fetchOvlData();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/OtsvidesUploads/OVL_courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  // ************** FORMDATA UPLOAD AND GET ****************

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCourse || !lectureName || lectureOrder === null) {
      alert("Please select a file, course, enter lecture name, and order.");
      return;
    }
    console.log("hiiiiiiiiiii");
    console.log(selectedFile,selectedCourse,lectureName,lectureOrder);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("courseCreationId", selectedCourse);
    formData.append("lectureName", lectureName);
    formData.append("lectureOrder", lectureOrder);

    try {
      const response = await axios.post(
        `${BASE_URL}/OtsvidesUploads/videoUpload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully:", response.data);
      window.alert("File uploaded successfully.");
      setLectureName("");
      setLectureOrder(0);
      fetchOvlData(); // Refresh the data after upload
      
    } catch (error) {
      console.error("Error uploading file:", error);
      window.alert("Error uploading file. Please try again.");
    }
  };

  const fetchOvlData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/OtsvidesUploads/videos`);
      console.log(response)
      console.log("Fetched OVL data:", response.data); // Debug statement
      setOvlData(response.data);
    } catch (error) {
      console.error("Error fetching OVL data:", error);
    }
  };


   // ************** FORMDATA UPLOAD AND GET END ****************
  const handleDelete = async (OVL_Linke_Id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this video link?");
    if (!isConfirmed) {
      return; // Exit the function if the user cancels
    }

    try {
      await axios.delete(`${BASE_URL}/OtsvidesUploads/videslink_delete/${OVL_Linke_Id}`);
      fetchOvlData(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting video link:", error);
      alert("Failed to delete the video link.");
    }
  };

  const handleDeleteSelected = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete all selected video links?");
    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/OtsvidesUploads/videslink_delete`, {
        data: { ids: selectedIds },
      });
      fetchOvlData();
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected video links:", error);
      alert("Failed to delete selected video links.");
    }
  };

  const handleUpdate = (data) => {
    setUpdateData(data);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/OtsvidesUploads/videslink_update/${updateData.OVL_Linke_Id}`, updateData);
      fetchOvlData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating video link:", error);
      alert("Failed to update the video link.");
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCourse = ovlData.filter(
    (ovlData) =>
      ovlData.Lectures_name &&
      ovlData.Lectures_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(ovlData.length / usersPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const displayData = filteredCourse.slice(
    pagesVisited,
    pagesVisited + usersPerPage
  );

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const ids = filteredCourse.map((data) => data.OVL_Linke_Id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSingleCheckboxChange = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedIds = [...selectedIds];

    if (selectedIndex === -1) {
      newSelectedIds.push(id);
    } else {
      newSelectedIds.splice(selectedIndex, 1);
    }

    setSelectedIds(newSelectedIds);
  };

  return (
    <div className="create_exam_container otsMainPages">
      <div>
        <h3 className="textColor">Upload video links</h3>
      </div>

      
      <div
        className="uploadedDocumentFilds examSubjects_-contant ovl_Container overFlowX"
        style={{ marginTop: "1rem" }} 
      >
        <label>Select a course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option
              key={course.courseCreationId}
              value={course.courseCreationId}
            >
              {course.courseName}
            </option>
          ))}
        </select>
        <label>Upload video file:</label>
        <div className="ovl_upload_file">
          <input
            type="file"
            onChange={handleFileChange}
            accept="video/mp4"
            id="uploadInputFile_ovl_upload_file"
          />
        </div>
        <label>Lecture Name:</label>
        <input
          type="text"
          value={lectureName}
          onChange={(e) => setLectureName(e.target.value)}
        />
        <label>Lecture Order:</label>
        <input
          type="number"
          value={lectureOrder}
          onChange={(e) => setLectureOrder(parseInt(e.target.value))}
        />
        <button onClick={handleFileUpload}>Upload</button>
      </div>


      <div className="videoLink_table_main_container">
        <div className="create_exam_header_SearchBar">
          <FaSearch className="Adminsearchbaricon" />
          <input
            className="AdminSearchBar"
            type="text"
            placeholder="Search By Lecture Name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <h2 className="vlTable">Video Link Table</h2>
        <table className="otc_-table otsAdminTable_Container">
          <thead className="otsGEt_-contantHead otc_-table_-header">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>S.no</th>
              <th>Course Name</th>
              <th>Lecture Name</th>
              <th>Lecture Order</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((data, index) => (
              <tr
                key={data.OVL_Linke_Id}
                className={data.OVL_Linke_Id % 2 === 0 ? "color1" : "color2"}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(data.OVL_Linke_Id)}
                    onChange={() =>
                      handleSingleCheckboxChange(data.OVL_Linke_Id)
                    }
                  />
                </td>
                <td>{index + 1 + pageNumber * usersPerPage}</td>
                <td>{data.courseName}</td>
                <td>{data.Lectures_name}</td>
                <td>{data.Lecture_order}</td> 
                <td>
                  <button
                    className="Ots_-edit"
                    onClick={() => handleUpdate(data)}
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    className="Ots_-delete"
                    onClick={() => handleDelete(data.OVL_Linke_Id)}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedIds.length > 0 && (
          <div>
            <button onClick={handleDeleteSelected}>Delete Selected</button>
          </div>
        )}

        <ReactPaginate
          previousLabel={<i className="fa-solid fa-angles-left"></i>}
          nextLabel={<i className="fa-solid fa-angles-right"></i>}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      </div>
      {isModalOpen && (
        <div className="modal_Contant">
          <div className="modalContent">
            <div className="DriveLink">
              <label>Lecture Name:</label>
              <input
                type="text"
                value={updateData.Lectures_name}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    Lectures_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="DriveLink">
              <label>Lecture Order:</label>
              <input
                type="number"
                value={updateData.Lecture_order}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    Lecture_order: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="DriveLinkBtns">
              <button className="ots_-createBtn" onClick={handleSave}>
                Save
              </button>
              <button
                className="ots_btnClose"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PGOvlVideosUpload;
