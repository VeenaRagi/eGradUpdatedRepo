



import React, { useState, useEffect } from "react";
import axios from "axios";

const Userdeatailedpage = () => {
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    // Fetch user details after component mounts
    const fetchUserDetails = async () => {
      try {
        // Assuming you have the email stored in localStorage
        const email = localStorage.getItem("loggedInUserEmail");

        if (email) {
          const response = await axios.get(`http://localhost:5001/ughomepage_banner_login/userdetails?email=${email}`);
          setUserData(response.data.user); // Set user data in state
        } else {
          // Handle case where email is not found in localStorage
          console.log("Email not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        // Handle error while fetching user details
      }
    };

    fetchUserDetails();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  return (
    <div>
      <h2>User Details</h2>
      {userData ? (
        <div>
          <p>ID: {userData.id}</p>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
          {/* Display other user details as needed */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Userdeatailedpage;
