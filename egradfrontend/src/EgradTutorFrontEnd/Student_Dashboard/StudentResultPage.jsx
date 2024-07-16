import React, { useState, useEffect } from 'react';
import BASE_URL from "../../apiConfig";
function StudentResultPage({ userId, courseCreationId }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});


  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        fetchUserData();
      }
    };
    checkLoggedIn();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/ughomepage_banner_login/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        // Assuming you have the 'navigate' function available

        return;
      }

      if (response.ok) {
        // Token is valid, continue processing user data
        const userData = await response.json();
        setUserData(userData);
        // ... process userData
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

console.log(userData.id)


  useEffect(() => {
    const fetchTests = async () => {
        try {
        
      
          const response = await fetch(`${BASE_URL}/Myresult/user-tests/${userData.id}/4`);
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          setTests(data.tests);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching tests:', error);
          setError('Error fetching tests. Please try again later.');
          setLoading(false);
        }
      };
      

    fetchTests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Student Result Page</h1>
      {tests.length > 0 ? (
        <ul>
          {tests.map((test) => (
            <li key={test.TestName}>
              <p>Test Name: {test.TestName}</p>
              <p>Start Date: {test.testStartDate}</p>
              <p>End Date: {test.testEndDate}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tests available for the user and course.</p>
      )}
    </div>
  );
}

export default StudentResultPage;
