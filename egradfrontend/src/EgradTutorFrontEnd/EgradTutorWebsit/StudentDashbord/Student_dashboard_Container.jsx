import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import "./Style/Student_dashboard_Container.css";

import Student_dashboard_Home from "./Student_dashboard_Home";
import StudentDashbord_MyCourses from "./StudentDashbord_MyCourses";
import StudentDashbord_BuyCourses from "./StudentDashbord_BuyCourses";
import StudentDashbord_MyResults from "./StudentDashbord_MyResults";
import StudentDashbord_Bookmarks from "./StudentDashbord_Bookmarks";
import StudentDashbord_Settings from "./StudentDashbord_Settings";

const Student_dashboard_Container = ({ usersData }) => {
  const [activeComponent, setActiveComponent] = useState("home");

  const handleMenuClick = (component) => {
    setActiveComponent(component);
  };

  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const handleToggleLeftMenu = () => {
    setShowLeftMenu(!showLeftMenu);
  };
  return (
    <div>
      <div
        className="ugquiz_StudentDashbordconatiner_handleToggleLeftMenu"
        onClick={handleToggleLeftMenu}
      >
        <MdMenu />
      </div>
      <div className="ugquiz_StudentDashbordconatiner">
        <div
          className={`${
            showLeftMenu
              ? "ugquiz_StudentDashbordconatiner_left_mobile"
              : "ugquiz_StudentDashbordconatiner_left"
          }`}
        >
          <div className="ugquiz_StudentDashbordconatiner_left_menu">
            <button
              className={activeComponent ? "activeButton" : ""}
              onClick={() => handleMenuClick("home")}
            >
              Dashboard
            </button>
            <button
              className={activeComponent ? "activeButton" : ""}
              onClick={() => handleMenuClick("myCourses")}
            >
              My Courses
            </button>
            <button
              className={activeComponent ? "activeButton" : ""}
              onClick={() => handleMenuClick("buyCourses")}
            >
              Buy Courses
            </button>
            <button
              className={activeComponent ? "activeButton" : ""}
              onClick={() => handleMenuClick("myResults")}
            >
              My Results
            </button>
            <button
              className={activeComponent ? "activeButton" : ""}
              onClick={() => handleMenuClick("bookmarks")}
            >
              Bookmarks
            </button>
            <button
              className={activeComponent ? "activeButton" : ""}
              onClick={() => handleMenuClick("settings")}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="ugquiz_StudentDashbordconatiner_right_Std_MB_Course">
        {activeComponent === "home" && (
          <Student_dashboard_Home usersData={usersData} />
        )}
        {activeComponent === "myCourses" && (
          <StudentDashbord_MyCourses usersData={usersData} />
        )}
        {activeComponent === "buyCourses" && (
          <StudentDashbord_BuyCourses usersData={usersData} />
        )}
        {activeComponent === "myResults" && (
          <StudentDashbord_MyResults usersData={usersData} />
        )}
        {activeComponent === "bookmarks" && (
          <StudentDashbord_Bookmarks usersData={usersData} />
        )}
        {activeComponent === "settings" && (
          <StudentDashbord_Settings usersData={usersData} />
        )}
      </div>
    </div>
  );
};

export default Student_dashboard_Container;
