import React, { useState, useEffect } from "react";
import welcome_greeting_img from "./Images/welcome_greeting_img.png";
import './Style/Student_dashboard_Home.css'

const Student_dashboard_Home = ({ usersData }) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Get current hour
    const currentHour = new Date().getHours();

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
          <img src={welcome_greeting_img} />
        </div>
      </div>
      <div>
        <div className="testcounts_student_dashbard">
          {/* {attemptedTestCount
          .filter((item) => item.Portale_Id === 1 || item.Portale_Id === 2)
          .map(
            (item, index) =>
              (item.test_count !== 0 ||
                (item.Portale_Id !== 2 &&
                  (item.attempted_test_count !== 0 ||
                    item.unattempted_test_count !== 0))) && (
                <div key={index}>
                  <h3>{item.Portale_Name}</h3>
                  <ul>
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
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Student_dashboard_Home;