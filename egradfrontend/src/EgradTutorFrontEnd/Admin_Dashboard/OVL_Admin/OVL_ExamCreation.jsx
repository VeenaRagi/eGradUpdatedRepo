import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from '../../src/apiConfig'
import { Link, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function OVL_ExamCreation(){
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

  const validateForm = () => {
    const errors = {};

    if (!examName.trim()) {
      errors.examName = " * Required";
    }

    if (!startDate) {
      errors.startDate = "* Required";
    }

    if (!endDate) {
      errors.endDate = " * Required";
    } else if (new Date(endDate) < new Date(startDate)) {
      errors.endDate = "End Date must be after Start Date";
    }

    if (selectedSubjects.length === 0) {
      errors.subjects = "*At least one subject must be selected";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };
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
    // if (!examName || !startDate || !endDate || selectedSubjects.length === 0) {
    //   alert("Please fill in all required fields.");
    //   return;
    // }
    const examData = {
      examName,
      startDate,
      endDate,
      selectedSubjects,
    };
    if (validateForm()) {
      setSubmitting(true);
      axios
        .post(`${BASE_URL}/OVL_ExamCreation/OVL_Insert_exams`, examData)
        .then((response) => {
          console.log("Exam created:", response.data);
          // Reset form fields and state as needed
          setSubmitting(false);
          resetForm();
          exams_with_subject();

          // window.location.reload();
          // setShowSuccessPopup(true);
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
    }
  };
  useEffect(() => {
    exams_with_subject();
  }, []);

  function exams_with_subject() {
    axios
      .get(`${BASE_URL}/OVL_ExamCreation/OVL_exams-with-subjects`)
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
const filteredExams = examsWithSubjects.filter((exam) =>
  exam.OVL_Exam_Name && exam.OVL_Exam_Name.toLowerCase().includes(searchQuery.toLowerCase())
);


  // ============================END OF SEARCH BAR==========================

  //.............................Delete button handler ...................//
  const handleDelete = (OVL_Exam_Id) => {
    // Handle the "Delete" action for the given OVL_Exam_Id on the client side
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (confirmDelete) {
      setExamsWithSubjects((prevExams) =>
        prevExams.filter((exam) => exam.OVL_Exam_Id !== OVL_Exam_Id)
      );

      // Send a request to delete the exam from the server
      axios
        .delete(`${BASE_URL}/OVL_ExamCreation/OVl_Delet_exams/${OVL_Exam_Id}`)
        .then((response) => {
          console.log(`Exam with ID ${OVL_Exam_Id} deleted from the database`);
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

  return (
    <div className="create_exam_container otsMainPages">
      <h3 className="Coures_-otsTitels">Create Exam for OVL</h3>
      <div className="create_exam_content">
        <div className="create_exam_header">
          {formOpen ? (
            <div className="examContainer">
              {/* <h2>Create Exam</h2> */}
              <form onSubmit={handleSubmit}>
                <div className="examForm_Contant-container ">
                  <div onClick={() => setFormOpen(false)}>
                    <button className="ots_btnClose">
                     
                      <i class="fa-regular fa-circle-xmark "></i>
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
            placeholder="Search By Exam Name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        {/* Table of exams */}
        <div className="examCreation_-createdData">
          <h3 className="list_-otsTitels">created exams list</h3>
          <table className="otc_-table">
            <thead className="otsGEt_-contantHead otc_-table_-header">
              <tr>
                <th>Serial no</th>
                <th>Exam Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Subjects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="otc_-table_-tBody">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan="6">No exams found.</td>
                </tr>
              ) : (
                filteredExams.map((exam, index) => (
                  <tr
                    key={exam.OVL_Exam_Id}
                    className={exam.OVL_Exam_Id % 2 === 0 ? "color1" : "color2"}
                  >
                    <td>{index + 1}</td>
                    <td>{exam.OVL_Exam_Name}</td>
                    <td>{formatDate(exam.OVL_Exam_Startdate)}</td>
                    <td>{formatDate(exam.OVL_exam_Enddate)}</td>
                    <td>{exam.subjects}</td>
                    <td>
                      <div className="EditDelete_-btns">
                        <button className="Ots_-edit ">
                          <Link to={`/OVL_Exam_Update/${exam.OVL_Exam_Id}`}>
                            <i class="fa-solid fa-pencil"></i>
                          </Link>
                        </button>
                        <button
                          className="Ots_-delete"
                          onClick={() => handleDelete(exam.OVL_Exam_Id)}
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
      </div>
    </div>
  );
}

