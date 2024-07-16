import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import "./Styles/Testcreationadmin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from '../../apiConfig'
import { FaSearch } from "react-icons/fa";
const Testcreationadmin = ({
  testCreationTableId,
  currentStatus,
  onUpdateStatus,
}) => {
  const navigate = useNavigate();
  const [testName, setTestName] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [calculator, setCalculator] = useState("no");
  const [typeOfTests, setTypeOfTests] = useState([]);
  const [selectedtypeOfTest, setSelectedtypeOfTest] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState("");
  const [numberOfSections, setNumberOfSections] = useState(1);
  const [QuestionLimitChecked, setQuestionLimitChecked] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [activatedTests, setActivatedTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedoptions, setSelectedoptions] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionsData, setSectionsData] = useState([
    {
      selectedSubjects: "",
      sectionName: "",
      noOfQuestions: "",
      QuestionLimit: "",
    },
  ]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [testData, setTestData] = useState([]);
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const [instructionsData, setInstructionsData] = useState([]);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/TestCreation/instructions`);
        const data = await response.json();
        setInstructionsData(data);
      } catch (error) {
        console.error("Error fetching instructions:", error);
      }
    };
    fetchInstructions();
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/TestCreation/testcourses`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetch(`${BASE_URL}/TestCreation/course-typeoftests/${selectedCourse}`)
        .then((response) => response.json())
        .then((data) => setTypeOfTests(data))
        .catch((error) =>
          console.error("Error fetching course_typeoftests:", error)
        );
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse) {
      fetch(`${BASE_URL}/TestCreation/course-subjects/${selectedCourse}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched subjects:", data);
          setSubjects(data);
        })
        .catch((error) =>
          console.error("Error fetching course-subjects:", error)
        );
    }
  }, [selectedCourse]);

  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleSelectChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleSelectOption = (e) => {
    setSelectedoptions(e.target.value);
  };
 

  const handleSelectTypeOfTest = (e) => {
    setSelectedtypeOfTest(e.target.value);
  };

  const handleSelectSubjects = (e) => {
    setSelectedSubjects(e.target.value);
  };
  const handleInputChange = (e) => {
    setTestName(e.target.value);
  };
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleTotalQuestionsChange = (e) => {
    setTotalQuestions(e.target.value);
  };

  const handleTotalMarksChange = (e) => {
    setTotalMarks(e.target.value);
  };
  const handleInstructionChange = (e) => {
    setSelectedInstruction(e.target.value);
  };
  const handleCalculatorChange = (e) => {
    setCalculator(e.target.value);
  };

  const handleQuestionLimitChange = (e) => {
    setQuestionLimitChecked(e.target.checked);
  };

  const handleSectionChange = (e, index, field) => {
    // Create a copy of the sectionsData array
    const updatedSectionsData = [...sectionsData];

    // Ensure that the array at the given index is initialized
    if (!updatedSectionsData[index]) {
      updatedSectionsData[index] = {};
    }

    // Update the specified field in the copied array
    updatedSectionsData[index][field] = e.target.value;

    // Set the updated array to the state
    setSectionsData(updatedSectionsData);
  };

  const addSection = () => {
    setNumberOfSections((prevSections) => prevSections + 1);
  };

  const removeSection = () => {
    setNumberOfSections((prevSections) => prevSections - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (validateForm()) {
    let isValid = true;

    setSubmitting(true);
    try {
      console.log("Sections Data Before Request:", sectionsData);
      const response = await fetch(`${BASE_URL}/TestCreation/create-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testName,
          selectedCourse,
          selectedtypeOfTest,
          startDate,
          startTime,
          endDate,
          endTime,
          duration,
          totalQuestions,
          totalMarks,
          calculator,
          sectionsData,
          selectedInstruction,
          selectedoptions,
        }),
      });

      const data = await response.json();
      console.log(data);
      setIsFormVisible(false);
      fetchTestData();
      setSubmitting(false);
      navigate("/UgadminHome");
    } catch (error) {
      console.error("Error submitting form:", error);
      isValid = false;
    }
    console.log("Validation Result:", isValid);

    return isValid;
    setIsFormVisible(false);
    setSubmitting(false);
    //   }
  };
  const fetchTestData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/TestCreation/test_creation_table`
      );
      setTestData(response.data);

      // Fetch question count for each test
      response.data.forEach(async (test) => {
        const questionCountResult = await axios.get(
          `${BASE_URL}/TestCreation/getQuestionCountForTest/${test.testCreationTableId}`
        );
        const questionCount = questionCountResult.data.count;
        updateTestData(test.testCreationTableId, questionCount);
      });

      // Extract testCreationTableIds of active tests from the fetched data
      const activeTestIds = response.data
        .filter((test) => test.status === "active")
        .map((test) => test.testCreationTableId);
      setActivatedTests(activeTestIds);
    } catch (error) {
      console.error("Error fetching test data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  const updateTestData = (testId, questionCount) => {
    setTestData((prevTestData) => {
      const updatedTestData = prevTestData.map((test) => {
        if (test.testCreationTableId === testId) {
          return { ...test, question_count: questionCount };
        }
        return test;
      });
      return updatedTestData;
    });
  };

  function formatTime(dateTimeString) {
    const formattedTime = moment(dateTimeString, "HH:mm:ss.SSSSSS").format(
      "HH:mm"
    );
    return formattedTime !== "Invalid date" ? formattedTime : "Invalid Time";
  }

  const handleDelete = async (testCreationTableId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${BASE_URL}/TestCreation/test_table_data_delete/${testCreationTableId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message);
        const updatedtestData = testData.filter(
          (test) => test.testCreationTableId !== testCreationTableId
        );
        console.log("Before:", testData);
        console.log("After:", updatedtestData);
        setTestData(updatedtestData);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    } else {
      // The user canceled the deletion
      console.log("Deletion canceled.");
    }
  };

  const handleShowTotalSectionsChange = () => {
    setShowTotalSections(!showTotalSections);
  };
  const [showTotalSections, setShowTotalSections] = useState(false);

  // Function to format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleActivationToggle = async (testCreationTableId) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/TestCreation/activate/${testCreationTableId}`
      );
      const { status } = response.data;
      const currentDate = new Date();
      const startTime = new Date(
        testData.find(
          (test) => test.testCreationTableId === testCreationTableId
        ).testStartDate +
          "T" +
          testData.find(
            (test) => test.testCreationTableId === testCreationTableId
          ).testStartTime
      );
      const endTime = new Date(
        testData.find(
          (test) => test.testCreationTableId === testCreationTableId
        ).testEndDate +
          "T" +
          testData.find(
            (test) => test.testCreationTableId === testCreationTableId
          ).testEndTime
      );
      const TotalQuestions = testData.find(
        (test) => test.testCreationTableId === testCreationTableId
      ).TotalQuestions;

      // Fetch question count for the test
      const questionCountResponse = await axios.get(
        `${BASE_URL}/TestCreation/getQuestionCountForTest/${testCreationTableId}`
      );
      const questionCount = questionCountResponse.data.count;

      // Check if the test is within the time frame
      if (currentDate >= startTime && currentDate <= endTime) {
        // Check if the question count matches the total questions
        if (questionCount === TotalQuestions) {
          handleTestActivation(testCreationTableId);
        } else {
          window.alert(
            "Please ensure all required questions are uploaded before activating the test. Activation is not allowed until all questions are uploaded."
          );
        }
      } else {
        handleTestDeactivation(testCreationTableId);
      }
    } catch (error) {
      console.error("Error toggling test status:", error);
      window.alert(
        "An error occurred while toggling test status. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestActivation = (testCreationTableId) => {
    const newActivatedTests = activatedTests.includes(testCreationTableId)
      ? activatedTests.filter((id) => id !== testCreationTableId)
      : [...activatedTests, testCreationTableId];
    console.log(`Test ${testCreationTableId} is now activated`);
    setActivatedTests(newActivatedTests);
  };

  const handleTestDeactivation = (testCreationTableId) => {
    const newActivatedTests = activatedTests.filter(
      (id) => id !== testCreationTableId
    );
    console.log(`Test ${testCreationTableId} is now deactivated`);
    setActivatedTests(newActivatedTests);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredTest = testData.filter(
    (testData) =>
      testData.TestName &&
      testData.TestName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Fetch the options pattern data when the component mounts
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestCreation/options_pattern`
        ); // Adjust the URL if needed
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // Parse JSON response
        setOptions(data); // Store the fetched data in state
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions(); // Call the function to fetch data
  }, []);

  return (
    <div className="otsMainPages testCreation_-container">
      <div className="TestCreation_-container">
        <div>
          <h3 className="textColor">Test Creation PAGE</h3>
        </div>
        <br />
        {!isFormVisible && (
          <div className="">
            <button
              className="otc_-addExam"
              type="button"
              onClick={handleOpenForm}
            >
              <i class="fa-solid fa-plus"></i>
              Add Test
            </button>
          </div>
        )}
        {isFormVisible && (
          <form onSubmit={handleSubmit}>
            <div className="testCreation_-contant ">
              <div>
                <button
                  className="ots_btnClose"
                  type="button"
                  onClick={handleCloseForm}
                >
                  Close Form
                </button>
              </div>
              <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Test Name:</label>
                  <input
                  className="testCreation_-list_input_test_name"
                    type="text"
                    value={testName}
                    onChange={handleInputChange}
                  />
                  {formErrors.testName && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.testName}
                    </span>
                  )}
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label  className="testCreation_-list_label">Select Course:</label>
                  <select className="testCreation_-list_select" value={selectedCourse} onChange={handleSelectChange}>
                    <option className="testCreation_-list_select_option_test_name" value="" disabled>
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option
                      className="testCreation_-list_select_option_test_name" 
                        key={course.courseCreationId}
                        value={course.courseCreationId}
                      >
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedCourse && (
                    <span className="error-message">
                      {formErrors.selectedCourse}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Type of Tests:</label>
                  <select
                  className="testCreation_-list_select"
                    value={selectedtypeOfTest}
                    onChange={handleSelectTypeOfTest}
                  >
                    <option value="" disabled>
                      Select a type of test
                    </option>
                    {typeOfTests.map((typeOfTest) => (
                      <option
                        key={typeOfTest.TypeOfTestId}
                        value={typeOfTest.TypeOfTestId}
                      >
                        {typeOfTest.TypeOfTestName}
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedtypeOfTest && (
                    <span className="error-message">
                      {formErrors.selectedtypeOfTest}
                    </span>
                  )}
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant ">
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Test Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                  {formErrors.startDate && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.startDate}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Start Time:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                  {formErrors.startTime && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.startTime}
                    </span>
                  )}
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Test End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                  {formErrors.endDate && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.endDate}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">End Time:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                  {formErrors.endTime && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.endTime}
                    </span>
                  )}
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Instructions:</label>
                  <select
                   className="testCreation_-list_select"
                    value={selectedInstruction}
                    onChange={handleInstructionChange}
                  >
                    <option value="" disabled>
                      Select an instruction
                    </option>
                    {instructionsData.map((instruction) => (
                      <option
                        key={instruction.instructionId}
                        value={instruction.instructionId}
                      >
                        {instruction.instructionHeading}
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedInstruction && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.selectedInstruction}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Calculator:</label>
                  <select  className="testCreation_-list_select" value={calculator} onChange={handleCalculatorChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Duration (in minutes):</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={handleDurationChange}
                    min="1"
                  />
                </div>
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Total Questions:</label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={handleTotalQuestionsChange}
                    min="1"
                  />
                  {formErrors.totalQuestions && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.totalQuestions}
                    </span>
                  )}
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Total Marks:</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={handleTotalMarksChange}
                    min="1"
                  />
                  {formErrors.totalMarks && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.totalMarks}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label className="testCreation_-list_label">Select Option Pattern:</label>
                  <select  className="testCreation_-list_select" value={selectedoptions} onChange={handleSelectOption}>
                    <option value="" disabled>
                      Select a Pattern
                    </option>
                    {options.map((options) => (
                      <option
                        key={options.opt_pattern_id}
                        value={options.opt_pattern_id}
                      >
                        {options.opt_pattern_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedoptions && (
                    <span className="error-message">
                      {formErrors.selectedoptions}
                    </span>
                  )}
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  {/* <label>SECTION</label> */}
                  <label className="testCreation_-list_label">Any sections in the test click here</label>
                  <input
                    className="inputLable"
                    type="checkbox"
                    checked={showTotalSections}
                    onChange={handleShowTotalSectionsChange}
                  />
                </div>
                <div></div>
              </div>
              <div>
                {showTotalSections && (
                  <div>
                    <label className="testCreation_-list_label">
                      <input
                        className="inputLable"
                        type="checkbox"
                        checked={QuestionLimitChecked}
                        onChange={handleQuestionLimitChange}
                      />
                      Question Limit:
                    </label>

                    <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                      <table style={{ textAlign: "justify" }}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Subjects:</th>
                            <th>Section</th>
                            <th>No of Question</th>
                            {QuestionLimitChecked && <th>Question Limit</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from(
                            { length: numberOfSections },
                            (_, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div>
                                    <select
                                      value={
                                        sectionsData[index]?.selectedSubjects ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleSectionChange(
                                          e,
                                          index,
                                          "selectedSubjects"
                                        )
                                      }
                                    >
                                      <option value="" disabled>
                                        Select a Subject
                                      </option>
                                      {subjects.map((Subject) => (
                                        <option
                                          key={Subject.subjectId}
                                          value={Subject.subjectId}
                                        >
                                          {Subject.subjectName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={
                                      sectionsData[index]?.sectionName || ""
                                    }
                                    onChange={(e) =>
                                      handleSectionChange(
                                        e,
                                        index,
                                        "sectionName"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    value={
                                      sectionsData[index]?.noOfQuestions || ""
                                    }
                                    onChange={(e) =>
                                      handleSectionChange(
                                        e,
                                        index,
                                        "noOfQuestions"
                                      )
                                    }
                                  />
                                </td>
                                {QuestionLimitChecked && (
                                  <td>
                                    <input
                                      type="number"
                                      value={
                                        sectionsData[index]?.QuestionLimit || ""
                                      }
                                      onChange={(e) =>
                                        handleSectionChange(
                                          e,
                                          index,
                                          "QuestionLimit"
                                        )
                                      }
                                    />
                                  </td>
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    <button
                      className="instructionBTN"
                      type="button"
                      onClick={addSection}
                    >
                      +
                    </button>
                    <button
                      className="instructionBTN"
                      type="button"
                      onClick={removeSection}
                    >
                      -
                    </button>
                  </div>
                )}
              </div>{" "}
              <div>
                <button className="instructionBTN" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <div className="create_exam_header_SearchBar">
        {/* Search bar */}
        <FaSearch className="Adminsearchbaricon" />
        <input
          className="AdminSearchBar"
          type="text"
          placeholder="Search By Test Name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <h3 className="list_-otsTitels">Created test Details</h3>
      <div className="testCreation_-GettingDAta_-container">
        <table className="otc_-table" style={{ textAlign: "center" }}>
          <thead className="otsGEt_-contantHead otc_-table_-header">
            <tr>
              <th>S.no</th>
              {/* <th>Test Pattern</th> */}
              <th>Test Name</th>
              <th>Selected Course</th>
              <th>Test Start Date</th>
              <th>Test End Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Number of Questions</th>
              <th>Number of Questions Uploaded</th>
              <th>Action</th>
              <th>Test Activation</th>
            </tr>
          </thead>
          <tbody className="otc_-table_-tBody">
            {filteredTest.length === 0 ? (
              <tr>
                <td colSpan="6">No Test found.</td>
              </tr>
            ) : (
              filteredTest.map((test, index) => (
                <tr
                  key={test.testCreationTableId}
                  className={
                    test.testCreationTableId % 2 === 0 ? "color1" : "color2"
                  }
                >
                  <td>{index + 1}</td>
                  {/* <td>{test.Test_pattern_name}</td> */}
                  <td>{test.TestName}</td>
                  <td>{test.courseName}</td>
                  <td>{formatDate(test.testStartDate)}</td>
                  <td>{formatDate(test.testEndDate)}</td>
                  <td>{formatTime(test.testStartTime)}</td>
                  <td>{formatTime(test.testEndTime)}</td>
                  <td>{test.TotalQuestions}</td>
                  <td>{test.question_count}</td>
                  <td>
                    <div className="EditDelete_-btns">
                      <Link
                        className="Ots_-edit "
                        to={`/TestUpdateadmin/${test.testCreationTableId}`}
                      >
                        {" "}
                        <i className="fa-solid fa-pencil"></i>
                      </Link>
                      <button
                        className="Ots_-delete"
                        onClick={() => handleDelete(test.testCreationTableId)}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className={`ActivateTestButton ${
                        activatedTests.includes(test.testCreationTableId)
                          ? "activated"
                          : "deactivated"
                      }`}
                      onClick={() =>
                        handleActivationToggle(test.testCreationTableId)
                      }
                    >
                      {activatedTests.includes(test.testCreationTableId)
                        ? "Activate Test"
                        : "Deactivate Test"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Testcreationadmin;
