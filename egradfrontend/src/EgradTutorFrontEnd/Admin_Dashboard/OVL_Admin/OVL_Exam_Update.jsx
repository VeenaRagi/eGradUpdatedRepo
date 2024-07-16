import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from '../../src/apiConfig'

const OVL_Exam_Update = () => {
  const { OVL_Exam_Id } = useParams();
  const navigate = useNavigate();
  const [examName, setExamName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [initialExamDetails, setInitialExamDetails] = useState({});

  useEffect(() => {
    // Fetch subjects from the API
    fetch(`${BASE_URL}/ExamCreation/subjects`)
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const fetchSelectedSubjects = async () => {
    try {
      // Fetch selected subjects for the specific exam
      const response = await axios.get(
        `${BASE_URL}OVL_ExamCreation/OVL_Update_ExamSubjects/${OVL_Exam_Id}/subjects`
      );
      const selectedSubjectsData = response.data;

      // Set the selected subjects in the state
      setSelectedSubjects(selectedSubjectsData);
    } catch (error) {
      console.error("Error fetching selected subjects:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examResponse = await axios.get(
          `${BASE_URL}/OVL_ExamCreation/OVL_feachingexams/${OVL_Exam_Id}`
        );
        const selectedSubjectsResponse = await axios.get(
          `${BASE_URL}/OVL_ExamCreation/OVL_Update_ExamSubjects/${OVL_Exam_Id}/subjects`
        );
  
        let examData; // Declare examData variable here
  
        // Check if examResponse.data exists and contains elements
        if (examResponse.data && examResponse.data.length > 0) {
          examData = examResponse.data[0]; // Assign value if data exists
          setExamName(examData.OVL_Exam_Name);
          setStartDate(examData.OVL_Exam_Startdate);
          setEndDate(examData.OVL_exam_Enddate);
        }
  
        const selectedSubjectsData = selectedSubjectsResponse.data;
        setSelectedSubjects(selectedSubjectsData);
        setInitialExamDetails({
          examName: examData ? examData.OVL_Exam_Name : "",
          startDate: examData ? examData.OVL_Exam_Startdate : "",
          endDate: examData ? examData.OVL_exam_Enddate : "",
          subjects: selectedSubjectsData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [OVL_Exam_Id]);
  
  

  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects((prevSelectedSubjects) => {
      const newSelectedSubjects = new Set(prevSelectedSubjects);

      if (newSelectedSubjects.has(subjectId)) {
        // Subject is already selected, so remove it
        newSelectedSubjects.delete(subjectId);
      } else {
        // Subject is not selected, so add it
        newSelectedSubjects.add(subjectId);
      }
      return Array.from(newSelectedSubjects);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedExamData = {
      examName,
      startDate,
      endDate,
      subjects: selectedSubjects,
    };

    if (
      examName === initialExamDetails.examName &&
      startDate === initialExamDetails.startDate &&
      endDate === initialExamDetails.endDate &&
      subjects.length === initialExamDetails.subjects.length &&
      subjects.every((subject) => initialExamDetails.subjects.includes(subject))
    ) {
      console.log("No changes made");
      return;
    }

    // Send PUT request to update exam data
    axios
      .put(`${BASE_URL}/OVL_ExamCreation/OVL_update_exam/${OVL_Exam_Id}`, updatedExamData)
      .then((response) => {
        console.log(response.data);
        // Handle success, e.g., show a success message to the user
        navigate("/UgadminHome");
      })
      .catch((error) => console.error("Error updating exam data:", error));
  };

  return (
    <div className="examUpdate_-container">
      <form onSubmit={handleSubmit}>
        <h2 className="textColor">update exam</h2>
        <div className="examUpdate_-contant">
          <label htmlFor="examName">Exam Name:</label>
          <input
            type="text"
            id="examName"
            value={examName || ""}
            onChange={(e) => setExamName(e.target.value)}
            required
          />
        </div>
        <div className="examUpdate_-contant">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            //   value={formatDate(startDate)}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="examUpdate_-contant">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            //   value={formatDate(endDate)}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div >
          <label style={{paddingBottom:'10px',display:'block',textTransform:'uppercase'}}>Subjects:</label>
          
          {subjects.map((subject) => (
            <div key={subject.subjectId} className="examUpdate_-contant examSubjects_-contant">
              <label htmlFor={subject.subjectId}>{subject.subjectName}</label>

              <input
                className="inputLable  "
                type="checkbox"
                id={subject.subjectId}
                value={subject.subjectId}
                checked={selectedSubjects.includes(subject.subjectId)}
                onChange={() => handleSubjectChange(subject.subjectId)}
              />
            </div>
          ))}
        </div>

      <div className="create_exam_header">
      <button className="ots_-createBtn" type="submit"  style={{float:'right',textTransform:'uppercase'}}>Submit</button>
      </div>
      </form>
    </div>
  );
};

export default OVL_Exam_Update;
