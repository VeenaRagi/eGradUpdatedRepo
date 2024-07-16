
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import BASE_URL from '../../src/apiConfig'
import './Styles/ResponsiveForAdmin.css'


const TestUpdateForm = () => {
  const { TestForm_Id } = useParams();
  const navigate = useNavigate();
  const { testCreationTableId, portalId } = useParams();

  const [courses, setCourses] = useState([]);
  const [completeCourses, setCompleteCourses] = useState([]);
  const [typeOfTests, setTypeOfTests] = useState([]);
  const [instructionsData, setInstructionsData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [testpattern, setTestpattern] = useState([]);
  const [testData, setTestData] = useState({
    TestName: "",
    selectedCourse: "",
    selectedTypeOfTest: "",
    testStartDate: "",
    testEndDate: "",
    testStartTime: "",
    testEndTime: "",
    Duration: "",
    TotalQuestions: "",
    totalMarks: "",
    calculator: "No",
    sectionName: "",
    noOfQuestions: "",
    QuestionLimit: "",
    selectedInstruction: "",
    selectedSubjects: "",
  });

  const [cpTestData, setCPTestData] = useState({
    TestName: "",
    selectedCourse: "",
    selectedTestPattern:"",
    testStartDate: "",
    testEndDate: "",
    testStartTime: "",
    testEndTime: "",
    Duration: "",
    TotalQuestions: "",
    totalMarks: "",
    calculator: "No",
    selectedInstruction: "",
  });

  useEffect(() => {
    fetch(`${BASE_URL}/TestCreation/instructions`)
      .then((response) => response.json())
      .then((data) => setInstructionsData(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/TestCreation/testcourses`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/TestCreation/completetestcourses`)
      .then((response) => response.json())
      .then((data) => setCompleteCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    if (testData.selectedCourse) {
      fetch(
        `${BASE_URL}/TestCreation/course-typeoftests/${testData.selectedCourse}`
      )
        .then((response) => response.json())
        .then((data) => setTypeOfTests(data))
        .catch((error) =>
          console.error("Error fetching type of tests:", error)
        );
    }
  }, [testData.selectedCourse]);

  useEffect(() => {
    if (testData.selectedCourse) {
      fetch(
        `${BASE_URL}/TestCreation/course-subjects/${testData.selectedCourse}`
      )
        .then((response) => response.json())
        .then((data) => setSubjects(data))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [testData.selectedCourse]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestCreation/testupdate/${TestForm_Id}/${testCreationTableId}`
        );
        const data = await response.json();

        if (TestForm_Id === "1") {
          setTestData({
            ...data,
            selectedCourse: data.courseCreationId,
            selectedTypeOfTest: data.courseTypeOfTestId,
            selectedSubjects: data.courseSubjectsId,
            sectionName: data.sectionName,
            noOfQuestions: data.noOfQuestions,
            QuestionLimit: data.QuestionLimit,
            selectedInstruction: data.instructionId,
          });
        } else if (TestForm_Id === "2") {
          setCPTestData({
            ...data,
            selectedCourse: data.courseCreationId,
            selectedTestPattern:data.Test_Pattern_Id,
            noOfQuestions: data.noOfQuestions,
            selectedInstruction: data.instructionId,
          });
        }
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    fetchData();
  }, [portalId, testCreationTableId, TestForm_Id]);

  const handleChangeOTS_PQB = (e) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "number" ? parseFloat(value) : value;

    setTestData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleChangeCP = (e) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "number" ? parseFloat(value) : value;

    setCPTestData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };
  const [completeSubjects, setCompleteSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("YOUR_API_ENDPOINT_TO_FETCH_SUBJECTS");
        const data = await response.json();
        setCompleteSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
  
    fetchSubjects();
  }, []);
  
  const handleSubmitOTS_PQB = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/TestCreation/test-update/${testCreationTableId}/${TestForm_Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TestName: testData.TestName,
            selectedCourse: testData.selectedCourse,
            selectedTypeOfTest: testData.selectedTypeOfTest,
            testStartDate: testData.testStartDate,
            testEndDate: testData.testEndDate,
            testStartTime: testData.testStartTime,
            testEndTime: testData.testEndTime,
            Duration: testData.Duration,
            TotalQuestions: testData.TotalQuestions,
            totalMarks: testData.totalMarks,
            calculator: testData.calculator,
            sectionName: testData.sectionName,
            noOfQuestions: testData.noOfQuestions,
            QuestionLimit: testData.QuestionLimit,
            selectedInstruction: testData.selectedInstruction,
            selectedSubjects: testData.selectedSubjects,
          }),
        }
      );

      const data = await response.json();
      console.log("send", data);
      navigate("/UgadminHome");
      console.log("successfully updated TEST");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleSubmitCP = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/TestCreation/CP_test-update/${testCreationTableId}/${TestForm_Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TestName: cpTestData.TestName,
            selectedCourse: cpTestData.selectedCourse,
            selectedTestPattern:cpTestData.selectedTestPattern,
            testStartDate: cpTestData.testStartDate,
            testEndDate: cpTestData.testEndDate,
            testStartTime: cpTestData.testStartTime,
            testEndTime: cpTestData.testEndTime,
            Duration: cpTestData.Duration,
            TotalQuestions: cpTestData.TotalQuestions,
            totalMarks: cpTestData.totalMarks,
            calculator: cpTestData.calculator,
            selectedInstruction: cpTestData.selectedInstruction,
          }),
        }
      );

      const data = await response.json();
      console.log("send", data);
      navigate("/UgadminHome");
      console.log("successfully updated TEST");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

    function formatTime(dateTimeString) {
    if (dateTimeString === "Invalid Time") {
      return "00:00"; // or any other default time you prefer
    }

    const formattedTime = moment(dateTimeString, "HH:mm:ss.SSSSSS").format(
      "HH:mm:ss"
    );
    return formattedTime !== "Invalid date" ? formattedTime : "Invalid Time";
  }

  
  useEffect(() => {
    const fetchtestpattern = async () => {
      try {
        const response = await fetch(`${BASE_URL}/TestCreation/testpattern`);
        const result = await response.json();
        setTestpattern(result);
      } catch (error) {
        console.error("Error fetching testpattern:", error);
      }
    };

    fetchtestpattern();
  }, []);

  return (
    <div className="examUpdate_-container">
    
        {TestForm_Id === "1" ? (
         <form onSubmit={handleSubmitOTS_PQB}>
         <div className="testCreation_-contant">
           <h3 className="textColor">Test Update Form</h3>
           <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
             {/* <div className="testCreation_-list">
             <label>Test Pattern:</label>
                 {testPatterns.map((pattern) => (
                   <div key={pattern.Test_Pattern_Id}>
                     <input
                       type="radio"
                       id={`pattern-${pattern.Test_Pattern_Id}`}
                       name="selectedTestPattern"
                       value={testData.selectedTestPattern}
                       // onChange={handleSelectPattern}
                       onChange={handleChange}
                     />
                     <label htmlFor={`pattern-${pattern.Test_Pattern_Id}`}>
                       {pattern.Test_pattern_name}
                     </label>
                   </div>
                 ))}
             </div> */}
             <div className="testCreation_-list">
               <label>Test Name:</label>
               <input
                 type="text"
                 name="TestName"
                 value={testData.TestName}
                 onChange={handleChangeOTS_PQB}
               />
             </div>
       
             <div className="testCreation_-list">
               <label>Select Course:</label>
               <select
                 name="selectedCourse"
                 value={testData.selectedCourse}
                 onChange={handleChangeOTS_PQB}
               >
                 <option value="">Select a Course</option>
                 {courses.map((course) => (
                   <option
                     key={course.courseCreationId}
                     value={course.courseCreationId}
                   >
                     {course.courseName}
                   </option>
                 ))}
               </select>
             </div>
           </div>
 
           <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
             <div className="testCreation_-list">
               <label>Type of Tests:</label>
               <select
                 name="selectedTypeOfTest"
                 value={testData.selectedTypeOfTest}
                 onChange={handleChangeOTS_PQB}
               >
                 <option value="">Select a Type of Test</option>
                 {typeOfTests.map((typeOfTest) => (
                   <option
                     key={typeOfTest.TypeOfTestId}
                     value={typeOfTest.TypeOfTestId}
                   >
                     {typeOfTest.TypeOfTestName}
                   </option>
                 ))}
               </select>
             </div>
 
             <div className="testCreation_-list">
               <label>Test Start Date:</label>
               <input
                type="date"
                name="testStartDate"
                value={moment(testData.testStartDate).format("YYYY-MM-DD")}
                onChange={handleChangeOTS_PQB}
                className="form-control"
              />
             </div>
           </div>
 
           <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
             <div className="testCreation_-list">
               <label>Test End Date:</label>
               <input
                type="date"
                name="testEndDate"
                value={moment(testData.testEndDate).format("YYYY-MM-DD")}
                onChange={handleChangeOTS_PQB}
                className="form-control"
              />
             </div>
             <div className="testCreation_-list">
               <label>Start Time:</label>
               <input
                 type="time"
                 name="testStartTime"
                 value={formatTime(testData.testStartTime)}
                 onChange={handleChangeOTS_PQB}
               />
             </div>
           </div>
 
           <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
             <div className="testCreation_-list">
               <label>End Time:</label>
               <input
                 type="time"
                 name="testEndTime"
                 value={formatTime(testData.testEndTime)}
                 onChange={handleChangeOTS_PQB}
               />
             </div>
 
             <div className="testCreation_-list">
               <label>Duration (in minutes):</label>
               <input
                 type="number"
                 name="Duration"
                 value={testData.Duration}
                 onChange={handleChangeOTS_PQB}
               />
             </div>
           </div>
 
           <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
             <div className="testCreation_-list">
               <label>Total Questions:</label>
               <input
                 type="number"
                 name="TotalQuestions"
                 value={testData.TotalQuestions}
                 onChange={handleChangeOTS_PQB}
               />
             </div>
             <div className="testCreation_-list">
               <label>Total Marks:</label>
               <input
                 type="number"
                 name="totalMarks"
                 value={testData.totalMarks}
                 onChange={handleChangeOTS_PQB}
               />
             </div>
           </div>
           <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
             <div className="testCreation_-list">
               <label>Instructions:</label>
               <select
                 value={testData.selectedInstruction}
                 name="selectedInstruction"
                 onChange={handleChangeOTS_PQB}
               >
                 <option value="">Select an instruction</option>
                 {instructionsData.map((instruction) => (
                   <option
                     key={instruction.instructionId}
                     value={instruction.instructionId}
                   >
                     {instruction.instructionHeading}
                   </option>
                 ))}
               </select>
             </div>
             <div className="testCreation_-list">
               {/* <label>Calculator:</label>
               <select
                 name="calculator"
                 value={testData.calculator}
                 onChange={handleChangeOTS_PQB}
               >
                 <option value="Yes">Yes</option>
                 <option value="No">No</option>
               </select> */}
             </div>
           </div>
           <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
        
             <div className="testCreation_-list">
         
              <div className="create_exam_header">
                  <button
             type="button"
             onClick={() => navigate("/UgadminHome")}
             className="ots_-createBtn"
           >
             Cancel
           </button> 
           <button type="submit"  className="ots_-createBtn">Submit</button>
           
           </div>
             </div>
           </div>
         </div>
       </form>

        ) : (
          <form onSubmit={handleSubmitCP}>
            <div className="testCreation_-contant">
            <h3 className="textColor">COMPLETE PACKAGE TEST UPDATE FORM</h3>
              <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            
                <div className="testCreation_-list">
                  <label>Test Name:</label>
                  <input
                    type="text"
                    name="TestName"
                    value={cpTestData.TestName}
                    onChange={handleChangeCP}
                  />
                </div>
                <div className="testCreation_-list">
                  <label>Select Test Pattern:</label>
                  <select
                    name="selectedTestPattern"
                    value={cpTestData.selectedTestPattern}
                    onChange={handleChangeCP}
                  >
                    <option value="">Select a Pattern</option>
                      {testpattern.map((type) => (
                    <option
                      key={type.Test_Pattern_Id}
                      value={type.Test_Pattern_Id}
                    >
                      {type.Test_pattern_name}
                    </option>
                  ))}
                  </select>
                </div>
                <div className="testCreation_-list">
                  <label>Select Course:</label>
                  <select
                    name="selectedCourse"
                    value={cpTestData.selectedCourse}
                    onChange={handleChangeCP}
                  >
                    <option value="">Select a Course</option>
                    {completeCourses.map((course) => (
                      <option
                        key={course.courseCreationId}
                        value={course.courseCreationId}
                      >
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
    
              <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
                {/* <div className="testCreation_-list">
                  <label>Type of Tests:</label>
                  <select
                    name="selectedTypeOfTest"
                    value={cpTestData.selectedTypeOfTest}
                    onChange={handleChangeCP}
                  >
                    <option value="">Select a Type of Test</option>
                    {typeOfTests.map((typeOfTest) => (
                      <option
                        key={typeOfTest.TypeOfTestId}
                        value={typeOfTest.TypeOfTestId}
                      >
                        {typeOfTest.TypeOfTestName}
                      </option>
                    ))}
                  </select>
                </div> */}
    
                <div className="testCreation_-list">
                  <label>Test Start Date:</label>
                  <input
                    type="date"
                    name="testStartDate"
                    value={moment(cpTestData.testStartDate).format("YYYY-MM-DD")}
                    onChange={handleChangeCP}
                  />
                </div>
                <div className="testCreation_-list">
                  <label>Test End Date:</label>
                  <input
                    type="date"
                    name="testEndDate"
                    value={moment(cpTestData.testEndDate).format("YYYY-MM-DD")}
                    onChange={handleChangeCP}
                  />
                </div>
              </div>
    
              <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Start Time:</label>
                  <input
                    type="time"
                    name="testStartTime"
                    value={formatTime(cpTestData.testStartTime)}
                    onChange={handleChangeCP}
                  />
                </div>
                <div className="testCreation_-list">
                  <label>End Time:</label>
                  <input
                    type="time"
                    name="testEndTime"
                    value={formatTime(cpTestData.testEndTime)}
                    onChange={handleChangeCP}
                  />
                </div>
              </div>
    
              <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Duration (in minutes):</label>
                  <input
                    type="number"
                    name="Duration"
                    value={cpTestData.Duration}
                    onChange={handleChangeCP}
                  />
                </div>
                <div className="testCreation_-list">
                  <label>Total Questions:</label>
                  <input
                    type="number"
                    name="TotalQuestions"
                    value={cpTestData.TotalQuestions}
                    onChange={handleChangeCP}
                  />
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Instructions:</label>
                  <select
                    value={cpTestData.selectedInstruction}
                    name="selectedInstruction"
                    onChange={handleChangeCP}
                  >
                    <option value="">Select an instruction</option>
                    {instructionsData.map((instruction) => (
                      <option
                        key={instruction.instructionId}
                        value={instruction.instructionId}
                      >
                        {instruction.instructionHeading}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="testCreation_-list">
                  {/* <label>Calculator:</label>
                  <select
                    name="calculator"
                    value={cpTestData.calculator}
                    onChange={handleChangeCP}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select> */}
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
           
                <div className="testCreation_-list">
                  <div></div>
                 <div className="create_exam_header">
                     <button
                type="button"
                onClick={() => navigate("/UgadminHome")}
                className="ots_-createBtn"
              >
                Cancel
              </button> 
              <button type="submit"  className="ots_-createBtn">Submit</button>
              
              </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
  
  
  );
};

export default TestUpdateForm;




