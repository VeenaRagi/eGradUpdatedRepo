import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Examcreation_admin.css";
import BASE_URL from "../../apiConfig";
import { Link, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
const ExamCreationForUGPG = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [examsWithSubjects, setExamsWithSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    exams_with_subject();
  }, []);
  function exams_with_subject() {
    // alert("hi")
    axios
      .get(`${BASE_URL}/ExamCreation/exams-with-subjects`)
      .then((response) => {
        setExamsWithSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ExamCreation/branches`);
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      const fetchExams = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/ExamCreation/branchesexams`,
            { params: { Branch_Id: selectedBranch } }
          );
          setExams(response.data);
        } catch (error) {
          console.error("Error fetching exams:", error);
        }
      };

      fetchExams();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedExam) {
      const fetchSubjects = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/ExamCreation/branchesexamssubjects`,
            { params: { coursesPortalExamsId: selectedExam } }
          );
          setSubjects(response.data);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      };

      fetchSubjects();
    }
  }, [selectedExam]);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    setSelectedExam("");
    setExams([]);
    setSubjects([]);
    setSelectedSubjects([]);
  };

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSubjects([]);
    setSelectedSubjects([]);
  };

  const handleCheckboxChange = (subjectId) => {
    setSelectedSubjects((prevSelected) => {
      if (prevSelected.includes(subjectId)) {
        return prevSelected.filter((id) => id !== subjectId);
      } else {
        return [...prevSelected, subjectId];
      }
    });
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    if (checked) {
      const allSubjectIds = subjects.map((subject) => subject.subjectId);
      setSelectedSubjects(allSubjectIds);
    } else {
      setSelectedSubjects([]);
    }
  };

  const allSelected =
    subjects.length > 0 && subjects.length === selectedSubjects.length;

  const handleSubmit = async () => {
    if (
      !selectedBranch ||
      !selectedExam ||
      selectedSubjects.length === 0 ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const examData = {
      Branch_Id: selectedBranch,
      coursesPortalExamsId: selectedExam,
      startDate,
      endDate,
      selectedSubjects,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/ExamCreation/create`,
        examData
      );
      console.log("Exam created successfully:", response.data);
      setShowForm(false); // Show success popup
      exams_with_subject();
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedBranch("");
    setSelectedExam("");
    setExams([]);
    setSubjects([]);
    setSelectedSubjects([]);
    setStartDate("");
    setEndDate("");

  };
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
          // console.log(`Exam with ID ${examId} deleted from the database`);
        })
        .catch((error) => {
          console.error("Error deleting exam:", error);
        });
    }
  };
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset current page to 1 when search query changes
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = examsWithSubjects.filter((data) =>
    data.coursesPortalExamname.toLowerCase().includes(searchQuery.toLowerCase())
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
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="otc_-addExam">
              {" "}
              <i class="fa-solid fa-plus"></i> Add Exam
            </button>
          )}
          <div className="examContainer">
            {showForm && (
              <div className="examForm_Contant-container">
                <button
                  onClick={handleClose}
                  className="ots_btnClose"
                  style={{ background: "#ff8080", color: "#fff" }}
                >
                  Close
                </button>

                <div className="Exams_contant examSubjects_-contant examSubjects_-contant_exc">
                  <div className="formdiv_contaniner">
                    <label>Select a branch</label>
                    <select
                      value={selectedBranch}
                      onChange={handleBranchChange}
                    >
                      <option value="" disabled>
                        Select a branch
                      </option>
                      {branches.map((branch) => (
                        <option key={branch.Branch_Id} value={branch.Branch_Id}>
                          {branch.Branch_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="formdiv_contaniner">
                    <label>Select an Exam:</label>
                    <select
                      value={selectedExam}
                      onChange={handleExamChange}
                      disabled={!selectedBranch}
                    >
                      <option value="" disabled>
                        Select an exam
                      </option>
                      {exams.map((exam) => (
                        <option
                          key={exam.coursesPortalExamsId}
                          value={exam.coursesPortalExamsId}
                        >
                          {exam.coursesPortalExamname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="exam_SubjectCOnatiner examSubjects_-contant">
                    <div className="formdiv_contaniner_ch ">
                      <div className="examcreationselectAll">
                        {" "}
                        <label>Subjects</label>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input
                            type="checkbox"
                            id="selectAll"
                            onChange={handleSelectAll}
                            checked={allSelected}
                            disabled={!selectedExam}
                          />
                          <label htmlFor="selectAll">Select All</label>
                        </div>
                      </div>

                      <div className="examSubject_conten">
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
                              disabled={!selectedExam}
                            />
                          </li>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="formdiv_contaniner">
                    <label>Start Date:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      disabled={!selectedExam}
                    />
                  </div>

                  <div className="formdiv_contaniner">
                    <label>End Date:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      disabled={!selectedExam}
                    />
                  </div>
                </div>

                <div>
                  <button
                    className="ots_-createBtn"
                    onClick={handleSubmit}
                    disabled={
                      !selectedExam ||
                      selectedSubjects.length === 0 ||
                      !startDate ||
                      !endDate
                    }
                  >
                    Create Exam
                  </button>
                </div>
              </div>
            )}
          </div>
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
        <div
          className="examCreation_-createdData"
          style={{ overflowX: "scroll" }}
        >
          <h3 className="list_-otsTitels">created exams list</h3>
          <div>
            <table className="otc_-table otsAdminTable_Container">
              <thead className="otsGEt_-contantHead otc_-table_-header">
                <tr>
                  <th style={{ textAlign: "center" }}>S.no</th>
                  <th style={{ textAlign: "center" }}>Exam Name</th>
                  <th style={{ textAlign: "center" }}>Start Date</th>
                  <th style={{ textAlign: "center" }}>End Date</th>
                  <th style={{ textAlign: "center" }}>Subjects</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody className="otc_-table_-tBody">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6">No exams found.</td>
                  </tr>
                ) : (
                  currentItems.map((exam, index) => (
                    <tr
                      key={exam.examId}
                      className={index % 2 === 0 ? "color1" : "color2"}
                    >
                      <td style={{ textAlign: "center" }}>
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td style={{ padding: 10 }}>
                        {exam.coursesPortalExamname}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {formatDate(exam.startDate)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {formatDate(exam.endDate)}
                      </td>
                      <td style={{ padding: 10 }}>{exam.subjects}</td>
                      <td>
                        <div className="EditDelete_-btns">
                          <button
                            className="Ots_-edit "
                            style={{ background: "#00aff0" }}
                          >
                            <Link to={`/ExamUpdataion_admin/${exam.examId}`}>
                              <i
                                className="fa-solid fa-pencil"
                                style={{ color: "#fff" }}
                              ></i>
                            </Link>
                          </button>
                          <button
                            className="Ots_-delete"
                            onClick={() => handleDelete(exam.examId)}
                            style={{ background: "rgb(220 53 69)" }}
                          >
                            <i
                              className="fa-regular fa-trash-can"
                              style={{ color: "#fff" }}
                            ></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default ExamCreationForUGPG;
