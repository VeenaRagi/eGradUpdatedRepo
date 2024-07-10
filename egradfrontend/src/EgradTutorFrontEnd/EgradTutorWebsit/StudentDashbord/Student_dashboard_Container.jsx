import React, { useState } from "react";
import Student_dashboard_Home from "./Student_dashboard_Home";
import StudentDashbord_MyCourses from "./StudentDashbord_MyCourses";
import StudentDashbord_BuyCourses from "./StudentDashbord_BuyCourses";
import StudentDashbord_MyResults from "./StudentDashbord_MyResults";
import StudentDashbord_Bookmarks from "./StudentDashbord_Bookmarks";
import StudentDashbord_Settings from "./StudentDashbord_Settings";

const Student_dashboard_Container = ({usersData}) => {
  const [activeComponent, setActiveComponent] = useState("home");

  const handleMenuClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
           {usersData.users && usersData.users.length > 0 && (
          <div>
            <p>
              <strong>Username:</strong>
            </p>
            <ul>
              {usersData.users.map((user) => (
                <li key={user.user_Id}>{user.username}</li>
              ))}
            </ul>
          </div>
        )}
      <div>
        <button onClick={() => handleMenuClick("home")}>Dashboard</button>
        <button onClick={() => handleMenuClick("myCourses")}>My Courses</button>
        <button onClick={() => handleMenuClick("buyCourses")}>
          Buy Courses
        </button>
        <button onClick={() => handleMenuClick("myResults")}>My Results</button>
        <button onClick={() => handleMenuClick("bookmarks")}>Bookmarks</button>
        <button onClick={() => handleMenuClick("settings")}>Settings</button>
      </div>
      <div>
        {activeComponent === "home" && <Student_dashboard_Home usersData={usersData}/>}
        {activeComponent === "myCourses" && <StudentDashbord_MyCourses usersData={usersData}/>}
        {activeComponent === "buyCourses" && <StudentDashbord_BuyCourses usersData={usersData}/>}
        {activeComponent === "myResults" && <StudentDashbord_MyResults usersData={usersData}/>}
        {activeComponent === "bookmarks" && <StudentDashbord_Bookmarks usersData={usersData}/>}
        {activeComponent === "settings" && <StudentDashbord_Settings usersData={usersData}/>}
      </div>
    </div>
  );
};

export default Student_dashboard_Container;
