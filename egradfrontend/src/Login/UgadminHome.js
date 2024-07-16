

import React from "react";
// import Exam_Portal_Home_Page from "../../Exam_Portal_QuizApp/Exam_Portal_Home_Page";
import Quiz_dashboard from "../EgradTutorFrontEnd/Student_Dashboard/Online_Portals/Quiz_dashboard";
import Student_dashboard from "../EgradTutorFrontEnd/Student_Dashboard/Student_dashboard";

const UgadminHome = () => {
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/uglogin";
  };

  return (
    <div>
      {userRole === "admin" && (
        <div>
          {/* <p>admin View: Show limited features</p> */}

          {/* <p>admin View: Show limited features</p> */}

          <Quiz_dashboard />

          {/* Viewer-specific content goes here */}
        </div>
      )}

      {userRole === "ugotsadmin" && (
        <div>
          {/* <p>ugotsadmin View: Show limited features</p> */}

          <Quiz_dashboard />

          {/* Viewer-specific content goes here */}
        </div>
      )}

      {userRole === "ugadmin" && (
        <div>
          {/* <p>ugadmin View: Show limited features</p> */}

          <Quiz_dashboard />

          {/* Viewer-specific content goes here */}
        </div>
      )}

      {userRole === "viewer" && (
        <div>
          {/* <p>Viewer View: Show limited features</p> */}

          <Student_dashboard />
          {/* Viewer-specific content goes here */}
        </div>
      )}

      {/* <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
};

export default UgadminHome;
