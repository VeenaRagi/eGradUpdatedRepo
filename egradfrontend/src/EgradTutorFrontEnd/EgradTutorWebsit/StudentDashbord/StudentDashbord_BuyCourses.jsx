import React, { useEffect, useState } from 'react'
import BASE_URL from "../../../apiConfig";
const StudentDashbord_BuyCourses = ({ usersData,decryptedUserIdState }) => {
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);

  const fetchUnPurchasedCourses = async () => {
    if (!decryptedUserIdState) {
      return; // Exit if userData.id is not defined
    }

    try {
      const response = await fetch(
        `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${decryptedUserIdState}`
      );
      if (response.ok) {
        const data = await response.json();
        setUnPurchasedCourses(data);
      } else {
        console.error("Failed to fetch unPurchased courses");
      }
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    }
  };
  useEffect(() => {
    fetchUnPurchasedCourses();
  }, [decryptedUserIdState]);
  return (
    <div>StudentDashbord_Settings
    decryptedUserIdState:{decryptedUserIdState }
    {usersData.users && usersData.users.length > 0 && (
        <ul>
          {usersData.users.map((user) => (
            <p> {user.username}</p>
          ))}
        </ul>
      )}</div>
  )
}

export default StudentDashbord_BuyCourses