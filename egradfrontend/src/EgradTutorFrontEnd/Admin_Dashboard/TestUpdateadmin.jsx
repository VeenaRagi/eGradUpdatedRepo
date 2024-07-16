import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import BASE_URL from '../../apiConfig'
const TestUpdateadmin = () => {
  const navigate = useNavigate();
  const { testCreationTableId } = useParams();
  const [courses, setCourses] = useState([]);
  const [typeOfTests, setTypeOfTests] = useState([]);
  const [instructionsData, setInstructionsData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // const [selectedSubjects, setSelectedSubjects] = useState([]);
  // const [testPatterns, setTestPatterns] = useState([]);
  // const [selectedTestPattern, setSelectedTestPattern] = useState("");
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
    // status: "Inactive",
    sectionName: "",
    noOfQuestions: "",
    QuestionLimit: "",
    selectedInstruction: "",
    selectedSubjects: "",
    // selectedTestPattern:"",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "number" ? parseFloat(value) : value;

    setTestData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
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
    fetch(`${BASE_URL}/TestCreation/instructions`)
      .then((response) => response.json())
      .then((data) => setInstructionsData(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    // Fetch courses from the API
    fetch(`${BASE_URL}/TestCreation/testcourses`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    // Fetch type of tests from the API based on the selected course
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
    // Fetch subjects based on the selected course
    if (testData.selectedCourse) {
      console.log("Fetching subjects...");
      fetch(
        `${BASE_URL}/TestCreation/course-subjects/${testData.selectedCourse}`
      )
        .then((response) => response.json())
        .then((data) => setSubjects(data))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [testData.selectedCourse]);

  useEffect(() => {
    fetch(`${BASE_URL}/TestCreation/testupdate/${testCreationTableId}`)
      .then((response) => {
        console.log("Response Status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data);
        setTestData({
          ...data,
          selectedCourse: data.courseCreationId,
          selectedTypeOfTest: data.courseTypeOfTestId,
          setSubjects: data.courseSubjectsId,
          sectionName: data.sectionName,
          noOfQuestions: data.noOfQuestions,
          QuestionLimit: data.QuestionLimit,
          selectedInstruction: data.instructionId,
        });
      })
      .catch((error) => console.error("Error fetching test data:", error));
  }, [testCreationTableId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/TestCreation/test-update/${testCreationTableId}`,
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
            // status: testData.status,
            sectionName: testData.sectionName,
            noOfQuestions: testData.noOfQuestions,
            QuestionLimit: testData.QuestionLimit,
            selectedInstruction: testData.selectedInstruction,
            selectedSubjects: testData.selectedSubjects,
            // selectedTestPattern:testData.selectedTestPattern,
          }),
        }
      );

      const data = await response.json();
      console.log("send", data);
      navigate("/UgadminHome");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };
  const handleSectionChange = (e, index) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "number" ? parseFloat(value) : value;

    setTestData((prevData) => {
      const updatedSections = [...prevData.selectedsections];
      updatedSections[index] = {
        ...updatedSections[index],
        [name]: updatedValue,
      };
      return {
        ...prevData,
        selectedsections: updatedSections,
      };
    });
  };
  // useEffect(() => {
  //   const fetchTestPatterns = async () => {
  //     try {
  //       const response = await fetch(`${BASE_URL}/TestCreation/test-patterns`); // Fetch test patterns
  //       const data = await response.json();
  //       setTestPatterns(data); // Store test patterns in state
  //     } catch (error) {
  //       console.error("Error fetching test patterns:", error);
  //     }
  //   };
  //   fetchTestPatterns();
  // }, []);
  return (
    <div className="examUpdate_-container">
      <form onSubmit={handleSubmit}>
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
                onChange={handleChange}
              />
            </div>
            <div className="testCreation_-list">
              <label>Select Course:</label>
              <select
                name="selectedCourse"
                value={testData.selectedCourse}
                onChange={handleChange}
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
                onChange={handleChange}
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
                value={testData.testStartDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Test End Date:</label>
              <input
                type="date"
                name="testEndDate"
                value={testData.testEndDate}
                onChange={handleChange}
              />
            </div>
            <div className="testCreation_-list">
              <label>Start Time:</label>
              <input
                type="time"
                name="testStartTime"
                value={formatTime(testData.testStartTime)}
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>

            <div className="testCreation_-list">
              <label>Duration (in minutes):</label>
              <input
                type="number"
                name="Duration"
                value={testData.Duration}
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>
            <div className="testCreation_-list">
              <label>Total Marks:</label>
              <input
                type="number"
                name="totalMarks"
                value={testData.totalMarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Number of Questions:</label>
              <input
                type="number"
                name="noOfQuestions"
                value={testData.noOfQuestions}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Instructions:</label>
              <select
                value={testData.selectedInstruction}
                name="selectedInstruction"
                onChange={handleChange}
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
              <label>Calculator:</label>
              <select
                name="calculator"
                value={testData.calculator}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">

              <div className="r">
                <button
                  type="button"
                  onClick={() => navigate("/UgadminHome")}
                  className="ots_btnClose"
                >
                  Cancel
                </button>
                <button type="submit" className="ots_-createBtn">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TestUpdateadmin;