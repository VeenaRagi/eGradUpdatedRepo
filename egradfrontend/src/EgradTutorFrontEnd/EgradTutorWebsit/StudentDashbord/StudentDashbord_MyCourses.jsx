import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../../../apiConfig";

const StudentDashbord_MyCourses = ({ usersData, decryptedUserIdState }) => {
  const [testData, setTestData] = useState(null); // State to hold fetched data
  let courseCreationId = 1;

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/TestPage/feachingOveralltest/${courseCreationId}/${decryptedUserIdState}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTestData(data);
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTestDetails();
  }, [courseCreationId, decryptedUserIdState]);

  console.log("courseCreationId:", courseCreationId, "decryptedUserIdState:", decryptedUserIdState);
  console.log("testData:", testData);

  // Render logic for displaying fetched data
  return (
    <div>
      <h2>Test Details</h2>
      {testData ? (
        <ul>
          {testData.map((test) => (
            <li key={test.testCreationTableId}>
              <strong>Test Name:</strong> {test.TestName},{" "}
              <strong>Status:</strong> {test.test_status}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StudentDashbord_MyCourses;
