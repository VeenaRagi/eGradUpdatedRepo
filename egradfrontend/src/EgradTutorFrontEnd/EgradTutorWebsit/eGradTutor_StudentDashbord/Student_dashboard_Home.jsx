import React, { useEffect, useState } from 'react'
import BASE_URL from '../../../apiConfig';
import axios from 'axios';
import '../../EgradTutorWebsit/eGradTutor_StudentDashbord/Style/Student_dashboard.css'
import welcome_greeting_img from './Images/welcome_greeting_img.png'
import { useLocation, useNavigate } from 'react-router-dom';
// import welcome_greeting_img from './Images/welcome_greeting_img.png'
// import welcome_greeting_img from './Images/welcome_greeting_img.png'
const Student_dashboard_Home = ({ usersData,decryptedUserIdState }) => {
  const [roleOfLoggedIn, setRoleOfLoggedIn] = useState("");
  // const roleOfTheUser=usersData.users&&usersData.length>0?(

  // ):null;
  // console.log(usersData.users[0].role, "this is the user data from the props in the student dashboard home.jsx")
  // setRoleOfLoggedIn(usersData.users[0].role);
  const [showLogOutContent, setShowLogOutContent] = useState(false)
  const user_Id = usersData.users && usersData.users.length > 0 ? (
    usersData.users.map((user) => user.username)

  ) : null;
  const [greeting, setGreeting] = useState("");
  // useEffect(()=>{
  //   const handlePopState=()=>{
  //     setShowLogOutContent(true)
  //   }
  //   window.addEventListener("popstate",handlePopState);
  //   return ()=>{
  //     window.removeEventListener("popstate",handlePopState)
  //   }
  // },[])
  useEffect(() => {
    // Get current hour
    const currentHour = new Date().getHours();
    // setRoleOfLoggedIn(usersData.users[0].role);
    // Determine greeting based on time
    let newGreeting;
    if (currentHour < 12) {
      newGreeting = "Good Morning";
    } else if (currentHour < 18) {
      newGreeting = "Good Afternoon";
    } else {
      newGreeting = "Good Evening";
    }

    setGreeting(newGreeting);
  }, []);

  const [attemptedTestCount, setAttemptedTestCount] = useState([]);
  useEffect(() => {
    const fetchAttemptedTestCount = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Myresult/attempted_test_count/${decryptedUserIdState}`
        );
        setAttemptedTestCount(response.data);
      } catch (error) {
        console.error("Error fetching attempted test count:", error);
      }
    };

    fetchAttemptedTestCount();
  }, [decryptedUserIdState]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      const handlePopState = () => {
          alert('You clicked the back arrow or navigated back!');
      };

      // Add popstate event listener
      window.addEventListener('popstate', handlePopState);

      return () => {
          window.removeEventListener('popstate', handlePopState);
      };
  }, [location.key]);
  return (
    <div className="dashboard_body_container">
      <div className="dashboard_welcome_section">
        {usersData.users && usersData.users.length > 0 && (
          <ul>
            {usersData.users.map((user) => (
              <div className="greeting_section">
                <h2 className="dashboard_greeting_container">
                  {greeting}, {user.username}
                </h2>
                <p className="greeting_sub_text">
                  "Welcome back, {user.username}! Your eGradTutor journey to
                  academic success begins here. Explore, learn, and thrive on
                  your educational path."
                </p>
              </div>
            ))}
          </ul>
        )}
        <div className="dashboard_welcome_img_section">
          <img className='dashboard_img' src={welcome_greeting_img} />
        </div>
      </div>
      <div>
        <div className="testcounts_student_dashbard">
          {attemptedTestCount
            .filter((item) => item.Portale_Id === 1 || item.Portale_Id === 2)
            .map(
              (item, index) =>
                (item.test_count !== 0 ||
                  (item.Portale_Id !== 2 &&
                    (item.attempted_test_count !== 0 ||
                      item.unattempted_test_count !== 0))) && (
                  <div className='test_counts_dashboard_tests_status' key={index}>
                    <h3 className='dashboard_tests_status_portal_name'>{item.Portale_Name}</h3>
                    <ul className='dashboard_tests_status_ul'>
                      {item.test_count !== 0 && (
                        <li className="total_count_container">
                          Total Tests: {item.test_count}
                        </li>
                      )}
                      {item.Portale_Id !== 2 &&
                        item.attempted_test_count !== 0 && (
                          <li className="total_count_container">
                            Total Attempted Tests: {item.attempted_test_count}
                          </li>
                        )}
                      {item.Portale_Id !== 2 &&
                        item.unattempted_test_count !== 0 && (
                          <li className="total_count_container">
                            Total Unattempted Tests:{" "}
                            {item.unattempted_test_count}
                          </li>
                        )}
                    </ul>
                  </div>
                )
            )}
        </div>
      </div>
      {/* {showLogOutContent && (
                <div className="back-button-content">
                    <p>Content to display when back button is clicked</p>
                </div>
            )} */}
    </div>
  );
};
export default Student_dashboard_Home;