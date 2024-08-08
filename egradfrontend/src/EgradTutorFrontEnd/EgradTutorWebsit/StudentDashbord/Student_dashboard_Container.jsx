// import React, { useState,useEffect } from "react";
// import { MdMenu } from "react-icons/md";
// import "./Style/Student_dashboard_Container.css";
// import { useParams  } from "react-router-dom";
// import BASE_URL from "../../../apiConfig";

// import Student_dashboard_Home from "./Student_dashboard_Home";
// import StudentDashbord_MyCourses from "./StudentDashbord_MyCourses";
// import StudentDashbord_BuyCourses from "./StudentDashbord_BuyCourses";
// import StudentDashbord_MyResults from "./StudentDashbord_MyResults";
// import StudentDashbord_Bookmarks from "./StudentDashbord_Bookmarks";
// import StudentDashbord_Settings from "./StudentDashbord_Settings";
// import StudentDashboardHeader from "./StudentDashboardHeader";

// const Student_dashboard_Container = ({ usersData, decryptedUserIdState }) => {
//   const [activeComponent, setActiveComponent] = useState("home");

//   const handleMenuClick = (component) => {
//     setActiveComponent(component);
//   };

//   const [showLeftMenu, setShowLeftMenu] = useState(false);
//   const handleToggleLeftMenu = () => {
//     setShowLeftMenu(!showLeftMenu);
//   };

//   return (
//     <>
//       <StudentDashboardHeader usersData={usersData} decryptedUserIdState={decryptedUserIdState} branchIdFromLS={branchIdFromLS}  setActiveComponent={setActiveComponent} />
//       <div className="ug_quiz_dashBoard_Main_container">
//         <div
//           className="ugquiz_StudentDashbordconatiner_handleToggleLeftMenu"
//           onClick={handleToggleLeftMenu}
//         >
//           <MdMenu className="hamburgMenu" />
//         </div>
//         <div className="ugquiz_StudentDashbordconatiner">
//           <div
//             className={`${showLeftMenu
//               ? "ugquiz_StudentDashbordconatiner_left_mobile"
//               : "ugquiz_StudentDashbordconatiner_left"
//             }`}
//           >
//             <div className="ugquiz_StudentDashbordconatiner_left_menu">
//               <button
//                 className={activeComponent === "home" ? "activeButton" : ""}
//                 onClick={() => handleMenuClick("home")}
//               >
//                 <span className="material-symbols-outlined">dashboard</span>
//                 Dashboard
//               </button>
//               <button
//                 className={activeComponent === "myCourses" ? "activeButton" : ""}
//                 onClick={() => handleMenuClick("myCourses")}
//               >
//                 <span className="material-symbols-outlined">box</span>
//                 My Courses
//               </button>
//               <button
//                 className={activeComponent === "buyCourses" ? "activeButton" : ""}
//                 onClick={() => handleMenuClick("buyCourses")}
//               >
//                 <span className="material-symbols-outlined">shopping_cart</span>
//                 Buy Courses
//               </button>
//               <button
//                 className={activeComponent === "myResults" ? "activeButton" : ""}
//                 onClick={() => handleMenuClick("myResults")}
//               >
//                 <span className="material-symbols-outlined">grading</span>
//                 My Results
//               </button>
//               <button
//                 className={activeComponent === "bookmarks" ? "activeButton" : ""}
//                 onClick={() => handleMenuClick("bookmarks")}
//               >
//                 <span className="material-symbols-outlined">bookmark_added</span>
//                 Bookmarks
//               </button>
//               <button
//                 className={activeComponent === "settings" ? "activeButton" : ""}
//                 onClick={() => handleMenuClick("settings")}
//               >
//                 <span className="material-symbols-outlined">settings_account_box</span>
//                 Settings
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="ugquiz_StudentDashbordconatiner_right_Std_MB_Course">
//           {activeComponent === "home" && (
//             <Student_dashboard_Home usersData={usersData} decryptedUserIdState={decryptedUserIdState} branchIdFromLS={branchIdFromLS} />
//           )}
//           {activeComponent === "myCourses" && (
//             <StudentDashbord_MyCourses usersData={usersData} decryptedUserIdState={decryptedUserIdState} Branch_Id={Branch_Id}/>
//           )}
//           {activeComponent === "buyCourses" && (
//             <StudentDashbord_BuyCourses usersData={usersData} decryptedUserIdState={decryptedUserIdState} Branch_Id={Branch_Id}/>
//           )}
//           {activeComponent === "myResults" && (
//             <StudentDashbord_MyResults usersData={usersData} decryptedUserIdState={decryptedUserIdState}/>
//           )}
//           {activeComponent === "bookmarks" && (
//             <StudentDashbord_Bookmarks usersData={usersData} decryptedUserIdState={decryptedUserIdState} />
//           )}
//           {activeComponent === "settings" && (
//             <StudentDashbord_Settings usersData={usersData} decryptedUserIdState={decryptedUserIdState} />
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Student_dashboard_Container;

import React, { useState, useEffect } from "react";
import { MdMenu } from "react-icons/md";
import "./Style/Student_dashboard_Container.css";
import { useParams } from "react-router-dom";

import BASE_URL from "../../../apiConfig";

import Student_dashboard_Home from "./Student_dashboard_Home";
import StudentDashbord_MyCourses from "./StudentDashbord_MyCourses";
import StudentDashbord_BuyCourses from "./StudentDashbord_BuyCourses";
import StudentDashbord_MyResults from "./StudentDashbord_MyResults";
import StudentDashbord_Bookmarks from "./StudentDashbord_Bookmarks";
import StudentDashbord_Settings from "./StudentDashbord_Settings";
import StudentDashboardHeader from "./StudentDashboardHeader";

const Student_dashboard_Container = ({
  usersData,
  decryptedUserIdState,
  branchIdFromLS,
}) => {
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
      <StudentDashboardHeader
        usersData={usersData}
        decryptedUserIdState={decryptedUserIdState}
        branchIdFromLS={branchIdFromLS}
        setActiveComponent={setActiveComponent}
      />

      <div className="ug_quiz_dashBoard_Main_container">
        <div
          className="ugquiz_StudentDashbordconatiner_handleToggleLeftMenu"
          onClick={handleToggleLeftMenu}
        >
          <MdMenu className="hamburgMenu" />
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
                className={activeComponent === "home" ? "activeButton" : ""}
                onClick={() => handleMenuClick("home")}
              >
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </button>

              <button
                className={
                  activeComponent === "myCourses" ? "activeButton" : ""
                }
                onClick={() => handleMenuClick("myCourses")}
              >
                <span className="material-symbols-outlined">box</span>
                My Courses
              </button>

              <button
                className={
                  activeComponent === "buyCourses" ? "activeButton" : ""
                }
                onClick={() => handleMenuClick("buyCourses")}
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Buy Courses
              </button>

              <button
                className={
                  activeComponent === "myResults" ? "activeButton" : ""
                }
                onClick={() => handleMenuClick("myResults")}
              >
                <span className="material-symbols-outlined">grading</span>
                My Results
              </button>

              <button
                className={
                  activeComponent === "bookmarks" ? "activeButton" : ""
                }
                onClick={() => handleMenuClick("bookmarks")}
              >
                <span className="material-symbols-outlined">
                  bookmark_added
                </span>
                Bookmarks
              </button>

              <button
                className={activeComponent === "settings" ? "activeButton" : ""}
                onClick={() => handleMenuClick("settings")}
              >
                <span className="material-symbols-outlined">
                  settings_account_box
                </span>
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="ugquiz_StudentDashbordconatiner_right_Std_MB_Course">
          {activeComponent === "home" && (
            <Student_dashboard_Home
              usersData={usersData}
              decryptedUserIdState={decryptedUserIdState}
              branchIdFromLS={branchIdFromLS}
            />
          )}

          {activeComponent === "myCourses" && (
            <StudentDashbord_MyCourses
              usersData={usersData}
              decryptedUserIdState={decryptedUserIdState}
              branchIdFromLS={branchIdFromLS}
            />
          )}

          {activeComponent === "buyCourses" && (
            <StudentDashbord_BuyCourses
              usersData={usersData}
              decryptedUserIdState={decryptedUserIdState}
              branchIdFromLS={branchIdFromLS}
            />
          )}

          {activeComponent === "myResults" && (
            <StudentDashbord_MyResults
              usersData={usersData}
              decryptedUserIdState={decryptedUserIdState}
              branchIdFromLS={branchIdFromLS}
            />
          )}

          {activeComponent === "bookmarks" && (
            <StudentDashbord_Bookmarks
              usersData={usersData}
              decryptedUserIdState={decryptedUserIdState}
              branchIdFromLS={branchIdFromLS}
            />
          )}

          {activeComponent === "settings" && (
            <StudentDashbord_Settings
              usersData={usersData}
              decryptedUserIdState={decryptedUserIdState}
              branchIdFromLS={branchIdFromLS}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Student_dashboard_Container;
