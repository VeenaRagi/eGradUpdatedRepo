
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// // import "./styles/Examcreation_admin.css";
// import BASE_URL from '../../apiConfig'
// import { Link, useParams } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";

// function PgAdminExamCreation() {
//   const [examName, setExamName] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [formOpen, setFormOpen] = useState(false);
//   const [examsWithSubjects, setExamsWithSubjects] = useState([]);
//   const { subjectId } = useParams();
//   const [formErrors, setFormErrors] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [pgExams,setPgExams]=useState('')

//   const validateForm = () => {
//     const errors = {};

//     if (!examName.trim()) {
//       errors.examName = " * Required";
//     }

//     if (!startDate) {
//       errors.startDate = "* Required";
//     }

//     if (!endDate) {
//       errors.endDate = " * Required";
//     } else if (new Date(endDate) < new Date(startDate)) {
//       errors.endDate = "End Date must be after Start Date";
//     }

//     if (selectedSubjects.length === 0) {
//       errors.subjects = "*At least one subject must be selected";
//     }

//     setFormErrors(errors);

//     return Object.keys(errors).length === 0;
//   };
//   const resetForm = () => {
//     setExamName("");
//     setStartDate("");
//     setEndDate("");
//     setSelectedSubjects([]);
//   };
//   //....................................FECHING PG EXAMS BAESD ON BRANCH ID ...............................//
//   useEffect(() => {
//     // Fetch pg exams from the backend when the component mounts
//     axios
//       .get(`${BASE_URL}/ExamCreation/subjects`)
//       .then((response) => {
//         setPgExams(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching subjects:", error);
//       });
//   }, []);


//   //....................................FECHING SUBJECTS ...............................//
//   useEffect(() => {
//     // Fetch subjects from the backend when the component mounts
//     axios
//       .get(`${BASE_URL}/ExamCreation/subjects`)
//       .then((response) => {
//         setSubjects(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching subjects:", error);
//       });
//   }, []);
//   //....................................END...............................//

//   //....................................HANDLER FOR SUBJECT CHECK BOXS...............................//
//   const handleCheckboxChange = (subjectId) => {
//     // Toggle the selection of subjects
//     setSelectedSubjects((prevSelected) => {
//       if (prevSelected.includes(subjectId)) {
//         return prevSelected.filter((id) => id !== subjectId);
//       } else {
//         return [...prevSelected, subjectId];
//       }
//     });
//   };
//   //....................................END...............................//

//   //................................... handler for submit button .............................//
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     // if (!examName || !startDate || !endDate || selectedSubjects.length === 0) {
//     //   alert("Please fill in all required fields.");
//     //   return;
//     // }
//     const examData = {
//       examName,
//       startDate,
//       endDate,
//       selectedSubjects,
//     };
//     if (validateForm()) {
//       setSubmitting(true);
//       axios
//         .post(`${BASE_URL}/ExamCreation/exams`, examData)
//         .then((response) => {
//           // console.log("Exam created:", response.data);
//           // Reset form fields and state as needed
//           setSubmitting(false);
//           resetForm();
//           exams_with_subject();

//           // window.location.reload();
//           // setShowSuccessPopup(true);
//         })
//         .catch((error) => {
//           console.error("Error creating exam:", error);
//           setSubmitting(false);
//         });
//       setExamName("");
//       setStartDate("");
//       setEndDate("");
//       setSelectedSubjects([]);
//       setFormErrors({});
//       setFormOpen(false);
//       setSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     exams_with_subject();
//   }, []);


//   function exams_with_subject() {
//     // alert("hi")
//     axios
//       .get(`${BASE_URL}/ExamCreation/exams-with-subjects`)
//       .then((response) => {
//         setExamsWithSubjects(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }
//   //....................................END...............................//

//   // ===========================SEARCH BAR==================================
//   // Handle search input change to update search query state
//   const handleSearchInputChange = (event) => {
//     setSearchQuery(event.target.value);
//     setCurrentPage(1); // Reset current page to 1 when search query changes
//   };
//   // Function to filter exams based on search query

//   // ============================END OF SEARCH BAR==========================

//   //.............................Delete button handler ...................//

//   const handleDelete = (examId) => {
//     // Handle the "Delete" action for the given examId on the client side
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this data?"
//     );
//     if (confirmDelete) {
//       setExamsWithSubjects((prevExams) =>
//         prevExams.filter((exam) => exam.examId !== examId)
//       );

//       // Send a request to delete the exam from the server
//       axios
//         .delete(`${BASE_URL}/ExamCreation/exams/${examId}`)
//         .then((response) => {
//           // console.log(`Exam with ID ${examId} deleted from the database`);
//         })
//         .catch((error) => {
//           console.error("Error deleting exam:", error);
//         });
//     }
//   };

//   //....................................END...............................//

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const filteredData = examsWithSubjects.filter((data) =>
//     data.examName.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   return (
//     <div className="create_exam_container otsMainPages">
//       <h3 className="textColor">Exam creation page</h3>
//       <div className="create_exam_content">
//         <div className="create_exam_header">
//           {formOpen ? (
//             <div className="examContainer">
//               {/* <h2>Create Exam</h2> */}
//               <form onSubmit={handleSubmit} className="examcreation_from">
//                 <div className="examForm_Contant-container ">
//                   <div onClick={() => setFormOpen(false)}>
//                     <button
//                       className="ots_btnClose"
//                       style={{ background: "#ff8080", color: "#fff" }}
//                     >
//                       Close
//                       {/* <i class="fa-regular fa-circle-xmark "></i> */}
//                     </button>
//                   </div>
//                   <div className="Exams_contant examSubjects_-contant examSubjects_-contant_exc">
//                     <div className="formdiv_contaniner">
//                       <label>Exam Name:</label>
//                       <input
//                         type="text"
//                         value={examName}
//                         onChange={(e) => setExamName(e.target.value)}
//                       />{" "}
//                       {formErrors.examName && (
//                         <span className="error-message">
//                           {formErrors.examName}
//                         </span>
//                       )}
//                     </div>
//                     <div className="formdiv_contaniner">
//                       <label>Start Date:</label>

//                       <input
//                         type="date"
//                         value={startDate}
//                         onChange={(e) => setStartDate(e.target.value)}
//                         min={new Date().toISOString().split("T")[0]}
//                       />
//                       {formErrors.startDate && (
//                         <span className="error-message">
//                           {formErrors.startDate}
//                         </span>
//                       )}
//                     </div>

//                     <div className="formdiv_contaniner">
//                       <label>End Date:</label>

//                       <input
//                         type="date"
//                         value={endDate}
//                         onChange={(e) => setEndDate(e.target.value)}
//                         min={new Date().toISOString().split("T")[0]}
//                       />
//                       {formErrors.endDate && (
//                         <span className="error-message">
//                           {formErrors.endDate}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="exam_SubjectCOnatiner examSubjects_-contant">
//                     <div className="formdiv_contaniner_ch ">
//                       <ul className="examSubject_conten">
//                         <label>Subjects:</label>

//                         {subjects.map((subject) => (
//                           <li key={subject.subjectId}>
//                             <label> {subject.subjectName} </label>
//                             <input
//                               className="inputLable"
//                               type="checkbox"
//                               checked={selectedSubjects.includes(
//                                 subject.subjectId
//                               )}
//                               onChange={() =>
//                                 handleCheckboxChange(subject.subjectId)
//                               }
//                             />
//                           </li>
//                         ))}
//                         {formErrors.subjects && (
//                           <span className="error-message">
//                             {formErrors.subjects}
//                           </span>
//                         )}
//                       </ul>
//                     </div>
//                     <div>
//                       <button
//                         className="ots_-createBtn"
//                         type="submit"
//                         disabled={submitting}
//                       >
//                         Create Exam
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           ) : (
//             // ....................................FROM END...............................
//             <button className="otc_-addExam" onClick={() => setFormOpen(true)}>
//               <i class="fa-solid fa-plus"></i> Add Exam
//             </button>
//           )}
//         </div>
//         <div className="create_exam_header_SearchBar">
//           {/* Search bar */}
//           <FaSearch className="Adminsearchbaricon" />
//           <input
//             className="AdminSearchBar"
//             type="text"
//             placeholder="Search by exam name"
//             value={searchQuery}
//             onChange={handleSearchInputChange}
//           />
//         </div>
//         {/* Table of exams */}
//         <div className="examCreation_-createdData" style={{overflowX:"scroll"}}>
//           <h3 className="list_-otsTitels">created exams list</h3>
//           <div>
//             <table className="otc_-table otsAdminTable_Container">
//               <thead className="otsGEt_-contantHead otc_-table_-header">
//                 <tr>
//                   <th style={{ textAlign: "center" }}>S.no</th>
//                   <th style={{ textAlign: "center" }}>Exam Name</th>
//                   <th style={{ textAlign: "center" }}>Start Date</th>
//                   <th style={{ textAlign: "center" }}>End Date</th>
//                   <th style={{ textAlign: "center" }}>Subjects</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="otc_-table_-tBody">
//                 {currentItems.length === 0 ? (
//                   <tr>
//                     <td colSpan="6">No exams found.</td>
//                   </tr>
//                 ) : (
//                   currentItems.map((exam, index) => (
//                     <tr
//                       key={exam.examId}
//                       className={index % 2 === 0 ? "color1" : "color2"}
//                     >
//                       <td style={{ textAlign: "center" }}>
//                         {indexOfFirstItem + index + 1}
//                       </td>
//                       <td style={{ padding: 10 }}>{exam.examName}</td>
//                       <td style={{ textAlign: "center" }}>
//                         {formatDate(exam.startDate)}
//                       </td>
//                       <td style={{ textAlign: "center" }}>
//                         {formatDate(exam.endDate)}
//                       </td>
//                       <td style={{ padding: 10 }}>{exam.subjects}</td>
//                       <td>
//                         <div className="EditDelete_-btns">
//                           <button
//                             className="Ots_-edit "
//                             style={{ background: "#00aff0" }}
//                           >
//                             <Link to={`/ExamUpdataion_admin/${exam.examId}`}>
//                               <i
//                                 className="fa-solid fa-pencil"
//                                 style={{ color: "#fff" }}
//                               ></i>
//                             </Link>
//                           </button>
//                           <button
//                             className="Ots_-delete"
//                             onClick={() => handleDelete(exam.examId)}
//                             style={{ background: "rgb(220 53 69)" }}
//                           >
//                             <i
//                               className="fa-regular fa-trash-can"
//                               style={{ color: "#fff" }}
//                             ></i>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>

//             <div style={{ textAlign: "center", marginTop: "1rem" }}>
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index + 1}
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PgAdminExamCreation;






















import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from '../../apiConfig';
import { Link, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function PgAdminExamCreation() {
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
  const [pgExams, setPgExams] = useState([]);
  const [selectedExamName, setSelectedExamName] = useState("");

  const validateForm = () => {
    const errors = {};

    if (!selectedExamName.trim()) {
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
    setSelectedExamName("");
    setStartDate("");
    setEndDate("");
    setSelectedSubjects([]);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/ExamCreation/pgExams`)
      .then((response) => {
        setPgExams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pg exams:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/ExamCreation/subjects`)
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  const handleCheckboxChange = (subjectId) => {
    setSelectedSubjects((prevSelected) => {
      if (prevSelected.includes(subjectId)) {
        return prevSelected.filter((id) => id !== subjectId);
      } else {
        return [...prevSelected, subjectId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const examData = {
      examName: selectedExamName,
      startDate,
      endDate,
      selectedSubjects,
    };

    if (validateForm()) {
      setSubmitting(true);
      axios
        .post(`${BASE_URL}/ExamCreation/exams`, examData)
        .then((response) => {
          setSubmitting(false);
          resetForm();
          exams_with_subject();
        })
        .catch((error) => {
          console.error("Error creating exam:", error);
          setSubmitting(false);
        });
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
      .get(`${BASE_URL}/ExamCreation/exams-with-subjects`)
      .then((response) => {
        setExamsWithSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (examId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (confirmDelete) {
      setExamsWithSubjects((prevExams) =>
        prevExams.filter((exam) => exam.examId !== examId)
      );

      axios
        .delete(`${BASE_URL}/ExamCreation/exams/${examId}`)
        .then((response) => { })
        .catch((error) => {
          console.error("Error deleting exam:", error);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = examsWithSubjects.filter((data) =>
    data.examName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="create_exam_container otsMainPages">
      <h3 className="textColor">Exam creation page</h3>
      <div className="create_exam_content">
        <div className="create_exam_header">
          {formOpen ? (
            <div className="examContainer">
              <form onSubmit={handleSubmit} className="examcreation_from">
                <div className="examForm_Contant-container ">
                  <div onClick={() => setFormOpen(false)}>
                    <button
                      className="ots_btnClose"
                      style={{ background: "#ff8080", color: "#fff" }}
                    >
                      Close
                    </button>
                  </div>
                  <div className="Exams_contant examSubjects_-contant examSubjects_-contant_exc">
                    <div className="formdiv_contaniner">
                      <label>Exam Name:</label>
                      <select
                        value={selectedExamName}
                        onChange={(e) => setSelectedExamName(e.target.value)}
                      >
                        <option value="">Select Exam</option>
                        {pgExams.map((exam) => (
                          <option key={exam.examId} value={exam.examName}>
                            {exam.EntranceExams_name}
                          </option>
                        ))}
                      </select>
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
                            <label>{subject.subjectName}</label>
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
                  </div>

                  <div className="btn_container">
                    <button
                      type="submit"
                      className="ots_btn"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="examContainer">
              <div className="examHeader_btnCont">
                <button
                  className="ots_btn"
                  onClick={() => setFormOpen(true)}
                  style={{
                    display: formOpen ? "none" : "inline-block",
                    background: "#66b3ff",
                  }}
                >
                  Create Exam
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="table-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Exam Name"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
          <table className="examcreation_table">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Subjects</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((data) => (
                <tr key={data.examId}>
                  <td>{data.examName}</td>
                  <td>{formatDate(data.startDate)}</td>
                  <td>{formatDate(data.endDate)}</td>
                  <td>
                    <ul>
                      {Array.isArray(data.subjects) ? (
                        data.subjects.map((subject) => (
                          <li key={subject.subjectId}>{subject.subjectName}</li>
                        ))
                      ) : (
                        <li>No subjects available</li>
                      )}
                    </ul>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(data.examId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={currentPage === pageNumber ? "active" : ""}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PgAdminExamCreation;
