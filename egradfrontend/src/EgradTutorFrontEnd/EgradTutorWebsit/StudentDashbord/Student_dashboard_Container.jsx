import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import "./Style/Student_dashboard_Container.css";

import Student_dashboard_Home from "./Student_dashboard_Home";
import StudentDashbord_MyCourses from "./StudentDashbord_MyCourses";
import StudentDashbord_BuyCourses from "./StudentDashbord_BuyCourses";
import StudentDashbord_MyResults from "./StudentDashbord_MyResults";
import StudentDashbord_Bookmarks from "./StudentDashbord_Bookmarks";
import StudentDashbord_Settings from "./StudentDashbord_Settings";
import StudentDashboardHeader from "./StudentDashboardHeader";
const Student_dashboard_Container = ({ usersData, decryptedUserIdState }) => {
  const [activeComponent, setActiveComponent] = useState("home");

  const handleMenuClick = (component) => {
    setActiveComponent(component);
  };

  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const handleToggleLeftMenu = () => {
    setShowLeftMenu(!showLeftMenu);
  };
  return (
    <>
      <StudentDashboardHeader usersData={usersData}
            decryptedUserIdState={decryptedUserIdState} />
      <div className="ug_quiz_dashBoard_Main_container">
        <div
          className="ugquiz_StudentDashbordconatiner_handleToggleLeftMenu"
          onClick={handleToggleLeftMenu}
        >
          <MdMenu className="hamburgMenu" />
        </div>
        <div className="ugquiz_StudentDashbordconatiner">
          <div
            className={`${showLeftMenu
                ? "ugquiz_StudentDashbordconatiner_left_mobile"
                : "ugquiz_StudentDashbordconatiner_left"
              }`}
          >
            <div className="ugquiz_StudentDashbordconatiner_left_menu">
              <button
                className={activeComponent ? "activeButton" : ""}
                onClick={() => handleMenuClick("home")}
              >
                 <span class="material-symbols-outlined">dashboard</span>
                Dashboard
              </button>
              <button
                className={activeComponent ? "activeButton" : ""}
                onClick={() => handleMenuClick("myCourses")}
              >
                   <span class="material-symbols-outlined">box</span>
                My Courses
              </button>
              <button
                className={activeComponent ? "activeButton" : ""}
                onClick={() => handleMenuClick("buyCourses")}
              >
                   <span class="material-symbols-outlined">shopping_cart</span> 
                Buy Courses
              </button>
              <button
                className={activeComponent ? "activeButton" : ""}
                onClick={() => handleMenuClick("myResults")}
              >
                     <span class="material-symbols-outlined">grading</span>
                My Results
              </button>
              <button
                className={activeComponent ? "activeButton" : ""}
                onClick={() => handleMenuClick("bookmarks")}
              >
                  <span class="material-symbols-outlined">bookmark_added</span>
                Bookmarks
              </button>
              <button
                className={activeComponent ? "activeButton" : ""}
                onClick={() => handleMenuClick("settings")}
              >
                 <span class="material-symbols-outlined">
                settings_account_box
              </span>
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="ugquiz_StudentDashbordconatiner_right_Std_MB_Course">
          {activeComponent === "home" && (
            <Student_dashboard_Home usersData={usersData}
              decryptedUserIdState={decryptedUserIdState} />
          )}
          {activeComponent === "myCourses" && (
            <StudentDashbord_MyCourses usersData={usersData} decryptedUserIdState={decryptedUserIdState} />
          )}
          {activeComponent === "buyCourses" && (
            <StudentDashbord_BuyCourses usersData={usersData} decryptedUserIdState={decryptedUserIdState} />
          )}
          {activeComponent === "myResults" && (
            <StudentDashbord_MyResults usersData={usersData} decryptedUserIdState={decryptedUserIdState} />
          )}
          {activeComponent === "bookmarks" && (
            <StudentDashbord_Bookmarks usersData={usersData} decryptedUserIdState={decryptedUserIdState} />
          )}
          {activeComponent === "settings" && (
            <StudentDashbord_Settings usersData={usersData} decryptedUserIdState={decryptedUserIdState} />
          )}
        </div>
      </div>
    </>
  );
};

export default Student_dashboard_Container;


