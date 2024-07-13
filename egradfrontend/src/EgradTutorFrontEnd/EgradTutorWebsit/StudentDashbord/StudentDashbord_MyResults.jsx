import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import BASE_URL from "../../../apiConfig";
import axios from "axios";
import { FaBookOpenReader } from "react-icons/fa6";
import './Style/StudentDashbord_MyResults.css'

export const StudentDashbord_MyResults = ({ usersData,decryptedUserIdState }) => {
  const [testDetails, setTestDetails] = useState([]);
  const [selectedTypeOfTest, setSelectedTypeOfTest] = useState("");
  const [filteredTestData, setFilteredTestData] = useState([]);
  const [testPageHeading, setTestPageHeading] = useState([]);
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/TestPage/feachingAttempted_TestDetails/${decryptedUserIdState}`
        );
        setTestDetails(response.data);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [decryptedUserIdState]);
  function getBackgroundColor(type, test) {
    switch (type) {
      case "Chapter Wise Test":
        return "#e6f7e0"; // light green
      case "Full Test":
        return "#ffebee"; // very light pink
      case "Mock Test":
        return "#fff9c4"; // very light yellow
      case "Part Test":
        return "#dcedc8"; // light green
      case "Previous Year Test":
        return "#f5f5dc"; // beige
      case "Subject Wise Test":
        return "#e0f7fa"; // light cyan
      case "Topic Wise Test":
        return "#dcedc8"; // light green (same as Part Test)
      default:
        return "#f5f5f5"; // light gray
    }
  }
  const openPopup = (decryptedUserIdState, testCreationTableId, courseCreationId) => {
    const newWinRef = window.open(
      `/Instructions/${decryptedUserIdState}/${testCreationTableId}/${courseCreationId}`,
      "_blank",
      "width=1000,height=1000"
    );

    if (newWinRef && !newWinRef.closed) {
      newWinRef.focus();
    }
  };
  useEffect(() => {
    if (selectedTypeOfTest === "") {
      setFilteredTestData(testDetails);
    } else {
      const filteredData = testDetails.filter(
        (test) => test.typeOfTestName === selectedTypeOfTest
      );
      setFilteredTestData(filteredData);
    }
  }, [testDetails, selectedTypeOfTest]);

  const handleTypeOfTestClick = (typeOfTestName) => {
    setSelectedTypeOfTest(typeOfTestName);
  };

  const handleReset = () => {
    setSelectedTypeOfTest("");
  };
  const firstTestCreationTableId =
    testDetails.length > 0 ? testDetails[0].testCreationTableId : null;
 
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestResultPage/testDetails/${firstTestCreationTableId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch test details");
        }

        const data = await response.json();

        setTestPageHeading(data.results);
      } catch (error) {
        console.log(error);
        // setError(error.message);
      }
    };

    if (firstTestCreationTableId) {
      fetchTestDetails();
    }
  }, [firstTestCreationTableId]);

  // Function to format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="card_container_dashbordflowtest">
      <div className="test_card_subcontainer">
        {" "}
        <div className="Types_of_Tests">
          <ul>
            <div>
              {testPageHeading &&
                testPageHeading.length > 0 &&
                testPageHeading[0].courseName && (
                  <div className="testPageHeading">
                    <h3>{testPageHeading[0].courseName}</h3>
                  </div>
                )}
            </div>
          </ul>
        </div>
        <div>
          {selectedTypeOfTest ? (
            <></>
          ) : (
            <div className="by_default">
              <div className="test_card_container">
                {filteredTestData.map((test, index) => (
                  <div key={index} className="test_card">
                    <ul
                      // className="testcard_inline"
                      className="testcard_inline"
                      style={{
                        backgroundColor: index === 0 ? "#f0f0f0" : "#ffffff",
                      }}
                    >
                      <li>
                        <span>
                          {" "}
                          <FaBookOpenReader />{" "}
                        </span>

                        {test.TestName}
                      </li>
                      <li> Total Marks: {test.totalMarks} Marks</li>
                      <li>Test Duration: {test.Duration} Minutes</li>
                      <li>
                        {" "}
                        {test.test_status === "Completed" && (
                          <ul>
                            {" "}
                            <li>{formatDate(test.test_end_time)} </li>
                          </ul>
                        )}
                      </li>
                      <li>
                        {test.test_status === "Completed" ? (
                          <Link
                            className="Result_Analysis"
                            to={`/UserReport/${decryptedUserIdState}/${test.testCreationTableId}/${test.courseCreationId}`}
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              padding: "3.9px",
                              textDecoration: "none",
                            }}
                          >
                            Result Analysis{" "}
                            <span class="material-symbols-outlined">
                              navigate_next
                            </span>
                          </Link>
                        ) : (
                          <Link
                            className="test_start_button"
                            to="#"
                            onClick={() =>
                              openPopup(
                                test.decryptedUserIdState,
                                test.testCreationTableId,
                                test.courseCreationId
                              )
                            }
                          >
                            {test.test_status === "incomplete"
                              ? "Resume"
                              : "Start Test"}
                          </Link>
                        )}
                      </li>
                    </ul>
                  </div>
                ))}
                {testDetails.length === 0 && (
                  <div>
                    <p className="no_tests_message">
                      You have not attempted any tests yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashbord_MyResults