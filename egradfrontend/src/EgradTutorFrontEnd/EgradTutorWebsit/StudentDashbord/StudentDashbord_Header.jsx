import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { HashLink } from "react-router-hash-link";
import JSONClasses from "../../../ThemesFolder/JSONForCSS/JSONClasses";
import { ThemeContext } from "../../../ThemesFolder/ThemeContext/Context";
import defaultImage from "../../../assets/defaultImage.png";
import "./Style/StudentDashbord_Header.css";

const StudentDashbord_Header = ({ userRole, usersData, tiAuth, settiAuth }) => {
  const themeFromContext = useContext(ThemeContext);
  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];

  const [image, setImage] = useState(null);

  const [showQuizmobilemenu, setShowQuizmobilemenu] = useState(false);
  const QuiZ_menu = () => {
    setShowQuizmobilemenu(!showQuizmobilemenu);
  };

  const navigate = useNavigate();

  const handleLogOut = () => {
    settiAuth({
      ...tiAuth,
      user: null,
      token: "",
      isLoggedIn: false,
    });
    localStorage.removeItem("tiAuth");
    localStorage.clear();
    navigate("/userlogin");
  };

  const openPopup = () => {
    // Close the current window
    // window.close();

    window.location.reload();
    // Update the state and store it in localStorage
    // setStudentDashbordeditformnwithpassword(true);
    // setStudentDashbordeditformnwithpasswordbtn(true);

    localStorage.setItem(
      "studentDashbordeditformnwithpassword",
      JSON.stringify(false)
    );
    localStorage.setItem(
      "studentDashbordeditformnwithpasswordbtn",
      JSON.stringify(false)
    );

    localStorage.setItem(
      "studentDashbordeditformnwithoutpasswordbtn",
      JSON.stringify(true)
    );

    localStorage.setItem(
      "studentDashbordeditformnwithoutpassword",
      JSON.stringify(true)
    );
    window.location.reload();
    // Set studentDashbordmyresult to true and store it in localStorage
    localStorage.setItem(
      "student_dashboard_state",
      JSON.stringify({
        studentDashbordmyresult: false,
        studentDashbordconatiner: false,
        studentDashbordmycourse: false,
        studentDashbordbuycurses: false,
        studentDashborddountsection: false,
        studentDashbordbookmark: false,
        studentDashbordsettings: true,
      })
    );

    // Open the desired URL in a new window
    // window.open("http://localhost:3000/student_dashboard");
  };

  const [
    studentDashbordeditformnwithpassword,
    setStudentDashbordeditformnwithpassword,
  ] = useState(true);
  const [
    studentDashbordeditformnwithpasswordbtn,
    setStudentDashbordeditformnwithpasswordbtn,
  ] = useState(true);

  const openPopuppasword = () => {
    window.location.reload();
    // Update the state and store it in localStorage
    setStudentDashbordeditformnwithpassword(true);
    setStudentDashbordeditformnwithpasswordbtn(true);

    localStorage.setItem(
      "studentDashbordeditformnwithpassword",
      JSON.stringify(true)
    );
    localStorage.setItem(
      "studentDashbordeditformnwithpasswordbtn",
      JSON.stringify(true)
    );

    localStorage.setItem(
      "studentDashbordeditformnwithoutpasswordbtn",
      JSON.stringify(false)
    );

    localStorage.setItem(
      "studentDashbordeditformnwithoutpassword",
      JSON.stringify(false)
    );
    localStorage.setItem(
      "student_dashboard_state",
      JSON.stringify({
        studentDashbordmyresult: false,
        studentDashbordconatiner: false,
        studentDashbordmycourse: false,
        studentDashbordbuycurses: false,
        studentDashborddountsection: false,
        studentDashbordbookmark: false,
        studentDashbordsettings: true,
        studentDashbordeditformnwithpasswordbtn: true,
      })
    );
  };

  return (
    <div>
      <div className="Quiz_main_page_header">
        {usersData.users && usersData.users.length > 0 && (
          <div className="Quiz_main_page_navbar">
            <div className="Quizzlogo">
              {image ? (
                <img src={image} alt="Current" />
              ) : (
                <img src={defaultImage} alt="Current" />
              )}
            </div>
            <div
              className={
                !showQuizmobilemenu
                  ? "Quiz_main_page_navbar_SUBpart Quiz_main_page_navbar_SUBpart_mobile"
                  : "Quiz_main_page_navbar_SUBpart_mobile"
              }
            >
              <ul>
                <div className="Quiz_main_page_login_signUp_btn"></div>
              </ul>
            </div>
            <div className="quiz_app_quiz_menu_login_btn_contaioner">
              <div className="dashbordheder_container">
                <HashLink to="/home#contact" className="Quiz__home">
                  Contact Us
                </HashLink>
                {usersData.users.map((user) => (
                  <button id="dropdownmenu_foradim_page_btn">
                    <img
                      title={user.username}
                      src={user.imageData}
                      alt={`Image ${user.user_Id}`}
                    />

                    <div className="dropdownmenu_foradim_page">
                      <Link onClick={openPopup}>My profile</Link>

                      <Link onClick={openPopuppasword}>Change Password</Link>
                      <Link onClick={handleLogOut}>Logout</Link>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashbord_Header;
