import React, { useEffect, useState } from 'react'
import BASE_URL from '../../src/apiConfig'
const Student_Settings = () => {

    const [userData, setUserData] = useState({});
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${BASE_URL}/ughomepage_banner_login/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Attach token to headers for authentication
              },
            }
          );
  
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
            console.log(userData);
          } else {
            // Handle errors, e.g., if user data fetch fails
          }
        } catch (error) {
          // Handle other errors
        }
      };
  
      fetchUserData();
    }, []);
  return (
    <div>
         <div className='student_DB_Details'>
     <img src={userData.imageData} alt={userData.sername} />
     <p>{userData.username}</p>
     </div>
     
       
    </div>
  )
}

export default Student_Settings