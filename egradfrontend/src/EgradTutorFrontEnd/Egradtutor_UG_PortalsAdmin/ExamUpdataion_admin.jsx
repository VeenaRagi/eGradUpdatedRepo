// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import BASE_URL from "../../apiConfig";
// import AdminHeader from "./AdminHeader";
// const ExamUpdataion_admin = () => {
//   const { examId } = useParams();
//   const navigate = useNavigate();
//   const [examName, setExamName] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);

//   const [initialExamDetails, setInitialExamDetails] = useState({});

//   useEffect(() => {
//     // Fetch subjects from the API
//     fetch(`${BASE_URL}/ExamCreation/subjectS`)
//       .then((response) => response.json())
//       .then((data) => setSubjects(data))
//       .catch((error) => console.error("Error fetching subjects:", error));
//   }, []);

//   const fetchSelectedSubjects = async () => {
//     try {
//       // Fetch selected subjects for the specific exam
//       const response = await axios.get(
//         `${BASE_URL}/ExamCreation/exams/${examId}/subjects`
//       );
//       const selectedSubjectsData = response.data;

//       // Set the selected subjects in the state
//       setSelectedSubjects(selectedSubjectsData);
//     } catch (error) {
//       console.error("Error fetching selected subjects:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const examResponse = await axios.get(
//           `${BASE_URL}/ExamCreation/feachingexams/${examId}`
//         );
//         const selectedSubjectsResponse = await axios.get(
//           `${BASE_URL}/ExamCreation/exams/${examId}/subjects`
//         );

//         const examData = examResponse.data[0];
//         const selectedSubjectsData = selectedSubjectsResponse.data;

//         setExamName(examData.examName);
//         setStartDate(examData.startDate);
//         setEndDate(examData.endDate);
//         setSelectedSubjects(selectedSubjectsData);
//         setInitialExamDetails({
//           examName: examData.examName,
//           startDate: examData.startDate,
//           endDate: examData.endDate,
//           subjects: selectedSubjectsData,
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [examId]);

//   const handleSubjectChange = (subjectId) => {
//     setSelectedSubjects((prevSelectedSubjects) => {
//       const newSelectedSubjects = new Set(prevSelectedSubjects);

//       if (newSelectedSubjects.has(subjectId)) {
//         // Subject is already selected, so remove it
//         newSelectedSubjects.delete(subjectId);
//       } else {
//         // Subject is not selected, so add it
//         newSelectedSubjects.add(subjectId);
//       }
//       return Array.from(newSelectedSubjects);
//     });
//   };

//   //   const formatDate = (dateString) => {
//   //     if (!dateString) {
//   //       return '';
//   //     }
//   //     const date = new Date(dateString);
//   //     const year = date.getFullYear();
//   //     const month = String(date.getMonth() + 1).padStart(2, '0');
//   //     const day = String(date.getDate()).padStart(2, '0');

//   //     return `${year}-${month}-${day}`;
//   //   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedExamData = {
//       examName,
//       startDate,
//       endDate,
//       subjects: selectedSubjects,
//     };

//     if (
//       examName === initialExamDetails.examName &&
//       startDate === initialExamDetails.startDate &&
//       endDate === initialExamDetails.endDate &&
//       subjects.length === initialExamDetails.subjects.length &&
//       subjects.every((subject) => initialExamDetails.subjects.includes(subject))
//     ) {
//       // console.log("No changes made");
//       return;
//     }

//     // Send PUT request to update exam data
//     axios
//       .put(`${BASE_URL}/ExamCreation/update/${examId}`, updatedExamData)
//       .then((response) => {
//         // console.log(response.data);
//         // Handle success, e.g., show a success message to the user
//         navigate("/UgadminHome");
//       })
//       .catch((error) => console.error("Error updating exam data:", error));
//     // console.log("Exam Id:", examId);
//     // console.log("Exam Name:", examName);
//     // console.log("Start Date:", new Date(startDate).toLocaleDateString());
//     // console.log("End Date:", new Date(endDate).toLocaleDateString());
//     // console.log("Selected Subjects:", selectedSubjects);
//   };

//   return (
//     <>
//     <AdminHeader/>
//     <div className="examUpdate_-container ">

//       <form
//         onSubmit={handleSubmit}
//         style={{ background: "#fff" }}

//       >

//         <h2 className="textColor">update exam</h2>
//         <div className="examUpdate_-contant">
//           <label htmlFor="examName">Exam Name:</label>
//           <input
//             type="text"
//             id="examName"
//             value={examName || ""}
//             onChange={(e) => setExamName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="examUpdate_-contant">
//           <label htmlFor="startDate">Start Date:</label>
//           <input
//             type="date"
//             id="startDate"
//             value={startDate}
//             //   value={formatDate(startDate)}
//             onChange={(e) => setStartDate(e.target.value)}
//             required
//           />
//         </div>
//         <div className="examUpdate_-contant">
//           <label htmlFor="endDate">End Date:</label>
//           <input
//             type="date"
//             id="endDate"
//             value={endDate}
//             //   value={formatDate(endDate)}
//             onChange={(e) => setEndDate(e.target.value)}
//             required
//           />
//         </div>
//         <div className="exam_updation_admin_subjectDiv">
//           <label
//             style={{
//               paddingBottom: "10px",
//               display: "block",
//               textTransform: "uppercase",
//             }}
//           >
//             Subjects:
//           </label>

//           {subjects.map((subject) => (
//             <div
//               key={subject.subjectId}
//               className="examUpdate_-contant examSubjects_-contant"
//             >
//               <label htmlFor={subject.subjectId}>{subject.subjectName}</label>

//               <input
//                 className="inputLable  "
//                 type="checkbox"
//                 id={subject.subjectId}
//                 value={subject.subjectId}
//                 checked={selectedSubjects.includes(subject.subjectId)}
//                 onChange={() => handleSubjectChange(subject.subjectId)}
//               />
//             </div>
//           ))}
//         </div>

//         <div cclassName="create_exam_header">
//           <button
//             type="button"
//             onClick={() => navigate("/Adminpage")}
//             className="ots_-createBtn"
//             style={{ background: "#ff8080", color: "#fff", margin: "0 9px" }}
//           >
//             Close
//           </button>
//           <button className="ots_-createBtn" type="submit">
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//     </>
//   );
// };

// export default ExamUpdataion_admin;













import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import AdminHeader from "./AdminHeader";

const ExamUpdataion_admin = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examName, setExamName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [exams, setExams] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [initialExamDetails, setInitialExamDetails] = useState({});
  const [examFromBackend, setExamFromBackend] = useState("")
  const [branchFB, setBranchFB] = useState("")

  // Fetch branches and exams
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
            { params: { Branch_Id: branchFB } }
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
    if (examId) {
      const fetchExams = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/ExamCreation/feachingexams/${examId}`
          );
          const fetchedExams = response.data;
          setExams(fetchedExams);

          if (!selectedExam && fetchedExams.length > 0) {
            setSelectedExam(fetchedExams[0].examId);
          }
        } catch (error) {
          console.error("Error fetching exams:", error);
        }
      };

      fetchExams();
    }
  }, [examId, selectedExam]);


  useEffect(() => {
    // Fetch subjects from the API
    fetch(`${BASE_URL}/ExamCreation/subjectS`)
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examResponse = await axios.get(
          `${BASE_URL}/ExamCreation/feachingexams/${examId}`
        );
        const selectedSubjectsResponse = await axios.get(
          `${BASE_URL}/ExamCreation/exams/${examId}/subjects`
        );

        const examData = examResponse.data[0];
        const selectedSubjectsData = selectedSubjectsResponse.data;
        setSelectedBranch(examData.Branch_Id);
        console.log(selectedBranch, "sssssssssssss")

        setSelectedExam(examData.coursesPortalExamsId);
        // asdf
        console.log(selectedExam, "uuuuuuuuuuuuuuuuuuuuuuuuuuu")
        // setExamName(examData.examName);
        setExamFromBackend(examData.Branch_Id);
        setBranchFB(examData.Branch_Id)

        setSelectedExam(examData.coursesPortalExamsId)
        console.log(selectedExam, "7777777777777777")
        setStartDate(examData.startDate);

        setEndDate(examData.endDate);
        setSelectedSubjects(selectedSubjectsData);
        setInitialExamDetails({
          examName: examData.coursesPortalExamname,
          startDate: examData.startDate,
          endDate: examData.endDate,
          subjects: selectedSubjectsData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [examId]);

  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects((prevSelectedSubjects) => {
      const newSelectedSubjects = new Set(prevSelectedSubjects);

      if (newSelectedSubjects.has(subjectId)) {
        newSelectedSubjects.delete(subjectId);
      } else {
        newSelectedSubjects.add(subjectId);
      }
      return Array.from(newSelectedSubjects);
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the data to send
    const updatedExamData = {
      examId,
      examName,
      startDate,
      endDate,
      branchId: selectedBranch,
      selectedSubjects,
    };

    axios
      .put(`${BASE_URL}/api/exams/update`, updatedExamData)
      .then((response) => {
        // Handle success, e.g., show a success message to the user
        console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
        navigate("/UgadminHome");
      })
      .catch((error) => {
        console.error("Error updating exam data:", error);
        setError("Failed to update exam data. Please try again.");
      });
  };


  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    setSelectedExam("");
    setExams([]);
  };

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    console.log()
  };



  return (
    <>
      <AdminHeader />
      <div className="examUpdate_-container">

        <form
          onSubmit={handleSubmit}
          style={{ background: "#fff" }}
        >
          <h2 className="textColor">Update Exam</h2>

          {/* Display error message if there is one */}
          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </div>
          )}

          {/* Rest of your form fields */}
          <div className="examUpdate_-contant">
            <label htmlFor="branch">Select a branch</label>
            <select
              id="branch"
              value={selectedBranch}
              onChange={handleBranchChange}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.Branch_Id} value={branch.Branch_Id}>
                  {branch.Branch_Name}
                </option>
              ))}
            </select>
          </div>



          <div className="examUpdate_-contant">
            <label htmlFor="exam">Select an Exam:</label>
            <select
              id="exam"
              value={selectedExam}
              onChange={handleExamChange}
              disabled={!selectedBranch}
            >
              <option value="">Select an exam</option>
              {exams.map((exam) => (
                <option key={exam.coursesPortalExamsId} value={exam.coursesPortalExamsId}>
                  {exam.coursesPortalExamname}
                </option>
              ))}
            </select>

          </div>



          <div className="examUpdate_-contant">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
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
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>



          <div className="exam_updation_admin_subjectDiv">
            <label
              style={{
                paddingBottom: "10px",
                display: "block",
                textTransform: "uppercase",
              }}
            >
              Subjects:
            </label>

            {subjects.map((subject) => (
              <div
                key={subject.subjectId}
                className="examUpdate_-contant examSubjects_-contant"
              >
                <label htmlFor={subject.subjectId}>{subject.subjectName}</label>

                <input
                  className="inputLable"
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
            <button
              type="button"
              onClick={() => navigate("/Adminpage")}
              className="ots_-createBtn"
              style={{ background: "#ff8080", color: "#fff", margin: "0 9px" }}
            >
              Close
            </button>
            <button className="ots_-createBtn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );

};

export default ExamUpdataion_admin;















