import React, { useState } from "react";
import quizlogo from "./asserts/logo.jpeg";
import "./styles/Exam_Portal_Home_Page.css";
import { Link, Navigate, useParams } from "react-router-dom";

import { FaBars } from "react-icons/fa6";

const Exam_Portal_Home_Page = () => {
  return (
    <>
      <Exam_Portal_Home_Pageheader />
    </>
  );
};

export default Exam_Portal_Home_Page;

// --------------------------------------  Exam_Portal_Home_Pageheader --------------------------

export const Exam_Portal_Home_Pageheader = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <div className="Exam_Portal_Home_Pageheader">
        <div className="Exam_Portal_Home_Pageheader_nav_bar">
          <div className="Exam_Portal_Home_Pageheader_nav_bar_logo">
            <img src={quizlogo} alt="egradtutor" />
          </div>
          <div className="Exam_Portal_Home_Pageheader_nav_bar_menu_list_withlogin_btn">
            <ul
              className={
                showMenu
                  ? "Exam_Portal_Home_Pageheader_nav_bar_menu_list"
                  : "Exam_Portal_Home_Pageheader_nav_bar_menu_list_show"
              }
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/">Buy Courses</Link>
              </li>
            </ul>
            <div className="Exam_Portal_Home_Pageheader_nav_bar_menu_list_login_btn">
              <button onClick={toggleMenu}>
                <FaBars />
              </button>
              <div className="Exam_Portal_Home_Pageheader_nav_bar_menu_list_login_container"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
