
import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Styles/Examcreation_admin.css";
import BASE_URL from '../../apiConfig'
import { Link, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";
function Examcreation_admin() {
  const [examName, setExamName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [examsWithSubjects, setExamsWithSubjects] = useState([]);
  const { subjectId } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10; 
  // const validateForm = () => {
  //   const errors = {};

  //   if (!examName.trim()) {
  //     errors.examName = " * Required";
  //   }

  //   if (!startDate) {
  //     errors.startDate = "* Required";
  //   }

  //   if (!endDate) {
  //     errors.endDate = " * Required";
  //   } else if (new Date(endDate) < new Date(startDate)) {
  //     errors.endDate = "End Date must be after Start Date";
  //   }

  //   if (selectedSubjects.length === 0) {
  //     errors.subjects = "*At least one subject must be selected";
  //   }

  //   setFormErrors(errors);

  //   return Object.keys(errors).length === 0;
  // };
  const resetForm = () => {
    setExamName("");
    setStartDate("");
    setEndDate("");
    setSelectedSubjects([]);
  };

  //....................................FECHING SUBJECTS ...............................//
  useEffect(() => {
    // Fetch subjects from the backend when the component mounts
    axios
      .get(`${BASE_URL}/ExamCreation/subjects`)
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);
  //....................................END...............................//

  //....................................HANDLER FOR SUBJECT CHECK BOXS...............................//
  const handleCheckboxChange = (subjectId) => {
    // Toggle the selection of subjects
    setSelectedSubjects((prevSelected) => {
      if (prevSelected.includes(subjectId)) {
        return prevSelected.filter((id) => id !== subjectId);
      } else {
        return [...prevSelected, subjectId];
      }
    });
  };
  //....................................END...............................//

  //................................... handler for submit button .............................//
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const examData = {
      examName,
      startDate,
      endDate,
      selectedSubjects,
    };
    
      setSubmitting(true);
      axios
        .post(`${BASE_URL}/ExamCreation/exams`, examData)
        .then((response) => {
          console.log("Exam created:", response.data);
          setSubmitting(false);
          resetForm();
          exams_with_subject();
        })
        .catch((error) => {
          console.error("Error creating exam:", error);
          setSubmitting(false);
        });
      setExamName("");
      setStartDate("");
      setEndDate("");
      setSelectedSubjects([]);
      setFormErrors({});
      setFormOpen(false);
      setSubmitting(false);
  };

  
  useEffect(() => {
    exams_with_subject();
  }, []);


  function exams_with_subject() {
    axios
      .get(`${BASE_URL}/ExamCreation/exams-with-subjects`)
      .then((response) => {
        setExamsWithSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  //....................................END...............................//

  // ===========================SEARCH BAR==================================

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to filter exams based on search query
  const filteredExams = examsWithSubjects.filter((exam) =>
    exam.examName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================END OF SEARCH BAR==========================

  //.............................Delete button handler ...................//

  const handleDelete = (examId) => {
    // Handle the "Delete" action for the given examId on the client side
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (confirmDelete) {
      setExamsWithSubjects((prevExams) =>
        prevExams.filter((exam) => exam.examId !== examId)
      );

      // Send a request to delete the exam from the server
      axios
        .delete(`${BASE_URL}/ExamCreation/exams/${examId}`)
        .then((response) => {
          console.log(`Exam with ID ${examId} deleted from the database`);
        })
        .catch((error) => {
          console.error("Error deleting exam:", error);
        });
    }
  };

  //....................................END...............................//

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  
  const pageCount = Math.ceil(filteredExams.length / usersPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const displayData = filteredExams.slice(pagesVisited, pagesVisited + usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="create_exam_container otsMainPages">
      <h3 className="textColor">Exam creation page</h3>
      <div className="create_exam_content">
        <div className="create_exam_header">
          {formOpen ? (
            <div className="examContainer">
              {/* <h2>Create Exam</h2> */}
              <form onSubmit={handleSubmit}>
                <div className="examForm_Contant-container ">
                <div onClick={() => {setFormOpen(false); resetForm();}}>
                    <button className="ots_btnClose" style={{background:'#ff8080',color:'#fff',marginTop:"10px"}}>
                     Close
                      {/* <i class="fa-regular fa-circle-xmark "></i> */}
                    </button>
                  </div>
                  <div className="Exams_contant examSubjects_-contant examSubjects_-contant_exc">
                    <div className="formdiv_contaniner">
                      <label>Exam Name:</label>
                      <input
                        type="text"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                      />{" "}
                      {formErrors.examName && (
                        <span className="error-message">
                          {formErrors.examName}
                        </span>
                      )}
                    </div>
                    <div className="formdiv_contaniner">
                      <label>Start Date:</label>

                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {formErrors.startDate && (
                        <span className="error-message">
                          {formErrors.startDate}
                        </span>
                      )}
                    </div>

                    <div className="formdiv_contaniner">
                      <label>End Date:</label>

                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {formErrors.endDate && (
                        <span className="error-message">
                          {formErrors.endDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="exam_SubjectCOnatiner examSubjects_-contant">
                    <div className="formdiv_contaniner_ch ">
                      <ul className="examSubject_conten">
                        <label>Subjects:</label>

                        {subjects.map((subject) => (
                          <li key={subject.subjectId}>
                            <label> {subject.subjectName} </label>
                            <input
                              className="inputLable"
                              type="checkbox"
                              checked={selectedSubjects.includes(
                                subject.subjectId
                              )}
                              onChange={() =>
                                handleCheckboxChange(subject.subjectId)
                              }
                            />
                          </li>
                        ))}
                        {formErrors.subjects && (
                          <span className="error-message">
                            {formErrors.subjects}
                          </span>
                        )}
                      </ul>
                    </div>
                    <div>
                  <button
                    className="ots_-createBtn"
                    type="submit"
                    disabled={submitting}
                  >
                    Create Exam
                  </button>
                </div>
                  </div>
                
                </div>
                
              </form>
            </div>
          ) : (
            // ....................................FROM END...............................
            <button className="otc_-addExam" onClick={() => setFormOpen(true)}>
              <i class="fa-solid fa-plus"></i> Add Exam
            </button>
          )}
        </div>
        <div className="create_exam_header_SearchBar">
          {/* Search bar */}
          <FaSearch className="Adminsearchbaricon" />
          <input
            className="AdminSearchBar"
            type="text"
            placeholder="Search by exam name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        {/* Table of exams */}
        <div className="examCreation_-createdData">
          <h3 className="list_-otsTitels">created exams list</h3>
          <div className="overFlowXScroll">
          <table className="otc_-table otsAdminTable_Container">
            <thead className="otsGEt_-contantHead otc_-table_-header">
              <tr>
                <th>S.no</th>
                <th>Exam Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Subjects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="otc_-table_-tBody">
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan="6">No exams found.</td>
                </tr>
              ) : (
                displayData.map((exam, index) => (
                  <tr
                    key={exam.examId}
                    className={exam.examId % 2 === 0 ? "color1" : "color2"}
                  >
                    <td>{index + 1 + pageNumber * usersPerPage}</td>
                    <td>{exam.examName}</td>
                    <td>{formatDate(exam.startDate)}</td>
                    <td>{formatDate(exam.endDate)}</td>
                    <td>{exam.subjects}</td>
                    <td>
                      <div className="EditDelete_-btns">
                        <button className="Ots_-edit ">
                          <Link to={`/ExamUpdataion_admin/${exam.examId}`}>
                            <i class="fa-solid fa-pencil"></i>
                          </Link>
                        </button>
                        <button
                          className="Ots_-delete"
                          onClick={() => handleDelete(exam.examId)}
                        >
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
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
      </div>
    </div>
  );
}

export default Examcreation_admin;
