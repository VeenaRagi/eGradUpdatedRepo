import React, { useEffect, useState } from "react";
import "./styles/Exam_portal_admin_integration.css";
import "./styles/otcCss.css";

import { Link } from "react-router-dom";

import "./styles/Leftnav.css";
import Exam_portal_admin_Dashboard from "./Exam_portal_admin_Dashboard.jsx";
import Examcreation_admin from "./Examcreation_admin";
// import Coursecreation_admin from "./Coursecreation_admin";
import InstructionPage_admin from "./InstructionPage_admin";
import Testcreationadmin from "./Testcreationadmin";
import DocumentUpload_admin from "./DocumentUpload_admin";

import Account_info from "./Account_info.js";

import { FaLock, FaUserAlt, FaImage } from "react-icons/fa";
import Image_Upload_for_Ac_ADMIN from "./Image_Upload_for_Ac_ADMIN";
// import { StudentDashborddountsection } from "../UGadmin/eaxm_portal_/StudentDashboard/Student_dashboard";
import TestActivation_admin from "./TestActivation_admin";
// import { StudentDashborddountsection } from "../StudentDashboard/Student_dashboard.js";
import StudentDoubtSection from "./StudentDoubtSection.jsx";
import Portal_coures_creation_admin from "./Portal_coures_creation_admin.jsx";
import OvlvidesUpload from "./OvlvidesUpload.jsx";
import Testcreationadminforms from "./Testcreationadminforms.jsx";
import ThemesSection from "./ThemesSection.jsx";
const STORAGE_KEY = "left_nav_state_admin";

const Leftnav = ({decryptedUserIdState}) => {
  const [showMenu, setshowMenu] = useState(0);

  const [showdashboard, setShowdashboard] = useState(true);
  const [showExamcreation_admin, setShowExamcreation_admin] = useState(false);
  const [showInstructionPage_admin, setInstructionPage_admin] = useState(false);
  const [showCoursecreation_admin, setshowCoursecreation_admin] =
    useState(false);
  const [showTestcreationadmin, setTestcreationadmin] = useState(false);
  const [showDocumentUpload_admin, setDocumentUpload_admin] = useState(false);
  const [showOVLvideosUpload_admin, setShowOVLvideosUpload_admin] =
    useState(false);
  const [showregisteredstudent, setShowregisteredstudent] = useState(false);
  const [showImage_Upload_for_Ac, setShowImage_Upload_for_Ac] = useState(false);
  const [showStudentDoubtSection, setshowStudentDoubtSection] = useState(false);
// Themes section
const[showThemesSectionn,setShowThemesSectionn]=useState(false)
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState) {
      setShowdashboard(savedState.showdashboard);
      setShowExamcreation_admin(savedState.showExamcreation_admin);
      setshowCoursecreation_admin(savedState.showCoursecreation_admin);
      setInstructionPage_admin(savedState.showInstructionPage_admin);
      setTestcreationadmin(savedState.showTestcreationadmin);
      setDocumentUpload_admin(savedState.showDocumentUpload_admin);
      setShowOVLvideosUpload_admin(savedState.showTestActivation_admin);
      setShowregisteredstudent(savedState.showregisteredstudent);
      setShowImage_Upload_for_Ac(savedState.showImage_Upload_for_Ac);
      setshowStudentDoubtSection(savedState.showStudentDoubtSection);
      setShowThemesSectionn(savedState.showThemesSectionn)
    } else {
      // Set the default values if no saved state is found
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          showdashboard: true,
          showExamcreation_admin: false,
          showInstructionPage_admin: false,
          showCoursecreation_admin: false,
          showTestcreationadmin: false,
          showDocumentUpload_admin: false,
          showTestActivation_admin: false,
          showregisteredstudent: false,
          showImage_Upload_for_Ac: false,
          showStudentDoubtSection: false,
          ShowThemesSectionn:false,

        })
      );
    }
  }, []);

  const handleSectionClick = (setState) => {
    setShowdashboard(false);
    setShowExamcreation_admin(false);
    setshowCoursecreation_admin(false);
    setInstructionPage_admin(false);
    setTestcreationadmin(false);
    setDocumentUpload_admin(false);
    setShowOVLvideosUpload_admin(false);
    setShowregisteredstudent(false);
    setShowImage_Upload_for_Ac(false);
    setshowStudentDoubtSection(false);
   setShowThemesSectionn(false)

    setState(true); // Set the clicked section to true
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        showdashboard: setState === setShowdashboard,
        showExamcreation_admin: setState === setShowExamcreation_admin,
        showInstructionPage_admin: setState === setInstructionPage_admin,
        showCoursecreation_admin: setState === setshowCoursecreation_admin,
        showTestcreationadmin: setState === setTestcreationadmin,
        showDocumentUpload_admin: setState === setDocumentUpload_admin,
        showOVLvideosUpload_admin: setState === setShowOVLvideosUpload_admin,
        showregisteredstudent: setState === setShowregisteredstudent,
        showImage_Upload_for_Ac: setState === setShowImage_Upload_for_Ac,
        showStudentDoubtSection: setState === setshowStudentDoubtSection,
        showThemesSectionn:setState===setShowThemesSectionn,
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
          {/* <div className="quz_menu"> */}
          <div className={showMenu?"quz_menu":"quz_menu2"}>
            <div className="lines"></div>
            <div className="lines"></div>
            <div className="lines"></div>
          </div>
        </div>
        <div
          className={showMenu ? "left-nav-bar left-nav-bar_" : "left-nav-bar"}
        >
          <ul className="left-nav-bar-ul">
            <li className={showdashboard ? "activeSD" : ""}>
              <Link
                onClick={() => handleSectionClick(setShowdashboard)}
                className="LeftnavLinks"
              >
                <p>
                  <i className="fa-solid fa-database logo_-clr"></i> Dashboard
                </p>
              </Link>
            </li>
            <li className={showExamcreation_admin ? "activeSD" : ""}>
              <Link
                onClick={() => handleSectionClick(setShowExamcreation_admin)}
                className="LeftnavLinks"
              >
                <p>
                  <i className="fa-solid fa-user-pen logo_-clr"></i>
                  Exam Creation
                </p>
              </Link>
            </li>
            <li className={showCoursecreation_admin ? "activeSD" : ""}>
              <Link
                onClick={() => handleSectionClick(setshowCoursecreation_admin)}
                className="LeftnavLinks"
              >
                <p>
                  <i className="fa-solid fa-pen-nib logo_-clr"></i>
                  Course Creation
                </p>
              </Link>
            </li>
            <li className={showInstructionPage_admin ? "activeSD" : ""}>
              <Link
                onClick={() => handleSectionClick(setInstructionPage_admin)}
                className="LeftnavLinks"
              >
                <p>
                  <i className="fa-solid fa-person-chalkboard logo_-clr"></i>
                  Instruction
                </p>
              </Link>
            </li>
            <li className={showTestcreationadmin ? "activeSD" : ""}>
              <Link
                onClick={() => handleSectionClick(setTestcreationadmin)}
                className="LeftnavLinks"
              >
                <p>
                  <i className="fa-solid fa-file-lines logo_-clr"></i>
                  Test Creation
                </p>
              </Link>
            </li>
            <li className={showDocumentUpload_admin ? "activeSD" : ""}>
              <Link
                onClick={() => handleSectionClick(setDocumentUpload_admin)}
                className="LeftnavLinks"
              >
                <p>
                  <i className="fa-solid fa-folder-open logo_-clr"></i>
                  Document Upload
                </p>
              </Link>
            </li>

            <li className={showOVLvideosUpload_admin ? "activeSD" : ""}>
              <Link
                onClick={() => handleSectionClick(setShowOVLvideosUpload_admin)}
                className="LeftnavLinks"
              >
                <p>
                  <i class="fa-solid fa-video"></i>
                  Upload Videos
                </p>
              </Link>
            </li>
            <li className={showregisteredstudent ? "activeSD" : ""}>
              <Link
                className="LeftnavLinks"
                onClick={() => handleSectionClick(setShowregisteredstudent)}
              >
                <p>
                  <i>
                    <FaUserAlt />
                  </i>
                  Registered Students Info
                </p>
              </Link>
            </li>
            
            {/* <li>
              <Link
                className="LeftnavLinks"
                onClick={() => handleSectionClick(setShowImage_Upload_for_Ac)}
              >
                <p>
                  <i className="fa-regular fa-image"></i>
                  Image Upload
                </p>
              </Link>
            </li> */}
            <li className={showStudentDoubtSection ? "activeSD" : ""}>
              <Link
                className="LeftnavLinks"
                onClick={() => handleSectionClick(setshowStudentDoubtSection)}
              >
                <p>
                  <i className="fa-solid fa-question"></i>
                  Student Doubt Section
                </p>
              </Link>
            </li>
            <li className={showThemesSectionn?"activeSD":""}>
              <Link
                className="LeftnavLinks"
                onClick={() => handleSectionClick(setShowThemesSectionn)}
              >
                <p>
                <i class="fa-sharp fa-solid fa-palette"></i>
                 Themes Section
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {showdashboard ? <Exam_portal_admin_Dashboard /> : null}

      {showExamcreation_admin ? <Examcreation_admin /> : null}

      {/* {showCoursecreation_admin ? <Coursecreation_admin /> : null} */}
      {showCoursecreation_admin ? <Portal_coures_creation_admin /> : null}
      {showInstructionPage_admin ? <InstructionPage_admin /> : null}

      {showTestcreationadmin ? <Testcreationadminforms /> : null}

      {showDocumentUpload_admin ? <DocumentUpload_admin /> : null}

      {showOVLvideosUpload_admin ? <OvlvidesUpload /> : null}

      {showregisteredstudent ? (
        <div className="admin_S_R_INfo">
          <Account_info decryptedUserIdState={decryptedUserIdState} />
        </div>
      ) : null}

      {showImage_Upload_for_Ac ? <Image_Upload_for_Ac_ADMIN /> : null}

      {showStudentDoubtSection ? <StudentDoubtSection /> : null}
      {showThemesSectionn ? <ThemesSection/> : null}

    </>
  );
};

export default Leftnav;
