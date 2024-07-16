import React, { useEffect, useState } from "react";
import "../Exam_Portal_QuizAdmin/styles/Exam_portal_admin_integration.css";
import "../Exam_Portal_QuizAdmin/styles/otcCss.css";
import { Link } from "react-router-dom";
import "../Exam_Portal_QuizAdmin/styles/Leftnav.css";
import OvlvidesUpload from "./OvlvidesUpload";
import OVL_ExamCreation from "./OVL_ExamCreation";
import OVL_CourseCreation from "./OVL_CourseCreation";
const STORAGE_KEY = "left_nav_state_admin_oVlc";
function OVL_Admin_LeftNav() {
  const [showMenu, setshowMenu] = useState(0);

  const [showCreateExam, setShowCreateExam] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState) {
      setShowCreateExam(savedState.showCreateExam);
      setShowCreateCourse(savedState.showCreateCourse);
      setShowVideoUpload(savedState.showVideoUpload);
    } else {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          showCreateExam: true,
          showCreateCourse:false,
          showVideoUpload: false,
        })
      );
    }
  }, []);

  const handleSectionClick = (setState) => {
    setShowCreateExam(false);
    setShowCreateCourse(false)
    setShowVideoUpload(false);
    setState(true);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        showCreateExam: setState === setShowCreateExam,
        showCreateCourse:setState === setShowCreateCourse,
        showVideoUpload: setState === setShowVideoUpload,
      })
    );
  };
  return (
    <>
      <div className="left_nav_bar_container">
        <div
          className={
            showMenu
              ? "mobile_menu mobile_menu_non  "
              : "mobile_menu_non_black "
          }
          onClick={() => setshowMenu(!showMenu)}
        >
          <div className="quz_menu">
            <div className="lines"></div>
            <div className="lines"></div>
            <div className="lines"></div>
          </div>
        </div>
        <div
          className={showMenu ? "left-nav-bar left-nav-bar_" : "left-nav-bar"}
        >
          <ul className="left-nav-bar-ul">
            <li>
              <Link
                onClick={() => handleSectionClick(setShowCreateExam)}
                className="LeftnavLinks"
              >
                <p>
                <i class="fa-solid fa-note-sticky"></i>Create Exam
                </p>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => handleSectionClick(setShowCreateCourse)}
                className="LeftnavLinks"
              >
                <p>
                <i class="fa-solid fa-pen-to-square"></i> Create Course
                </p>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => handleSectionClick(setShowVideoUpload)}
                className="LeftnavLinks"
              >
                <p>
                <i class="fa-solid fa-video"></i> Upload
                  videos
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {showCreateExam ? <OVL_ExamCreation/> :null}
      {showCreateCourse ? <OVL_CourseCreation/> :null}
      {showVideoUpload ? <OvlvidesUpload /> : null}
    </>
  );
}

export default OVL_Admin_LeftNav;
