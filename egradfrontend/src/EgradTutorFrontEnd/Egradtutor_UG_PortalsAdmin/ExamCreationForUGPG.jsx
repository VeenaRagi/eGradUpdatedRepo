import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Examcreation_admin.css";
import BASE_URL from "../../apiConfig";

const ExamCreationForUGPG = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  // Check if all subjects are selected
  const allSelected =
    subjects.length > 0 && subjects.length === selectedSubjects.length;

  const handleSubmit = async () => {
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
      // Handle success (e.g., show a success message, reset form)
    } catch (error) {
      console.error("Error creating exam:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div>
      <h1>Branches</h1>
      <select value={selectedBranch} onChange={handleBranchChange}>
        <option value="" disabled>
          Select a branch
        </option>
        {branches.map((branch) => (
          <option key={branch.Branch_Id} value={branch.Branch_Id}>
            {branch.Branch_Name}
          </option>
        ))}
      </select>

      {selectedBranch && (
        <div>
          <h2>Exams</h2>
          <select value={selectedExam} onChange={handleExamChange}>
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
      )}

      {selectedExam && (
        <div>
          <h2>Subjects</h2>
          <div>
            <input
              type="checkbox"
              id="selectAll"
              onChange={handleSelectAll}
              checked={allSelected}
            />
            <label htmlFor="selectAll">Select All</label>
          </div>
          {subjects.map((subject) => (
            <li key={subject.subjectId}>
              <label> {subject.subjectName} </label>
              <input
                className="inputLable"
                type="checkbox"
                checked={selectedSubjects.includes(subject.subjectId)}
                onChange={() => handleCheckboxChange(subject.subjectId)}
              />
            </li>
          ))}
        </div>
      )}
      <div className="formdiv_contaniner">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="formdiv_contaniner">
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <button onClick={handleSubmit}>Create Exam</button>
    </div>
  );
};

export default ExamCreationForUGPG;
