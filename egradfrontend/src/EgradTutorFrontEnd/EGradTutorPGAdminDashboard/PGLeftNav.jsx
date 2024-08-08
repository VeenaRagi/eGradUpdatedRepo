import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaUserAlt, FaImage } from "react-icons/fa";
import PGAdminDashBoardInLeftNav from "./PGAdminDashBoardInLeftNav.jsx";
import PgAdminExamCreation from "./PgAdminExamCreation.jsx";
import PGAdminPortalCourseCreation from "./PGAdminPortalCourseCreation.jsx";
import PGAdminInstructionPage from "./PGAdminInstructionPage.jsx";
import PGAdminTestCreationForms from "./PGAdminTestCreationForms.jsx";
// import PGDocumentUpload_admin from "./PGDocumentUploadAdmin.jsx";
import PGDocumentUploadAdmin from "./PGDocumentUploadAdmin.jsx";
import PGOvlVideosUpload from "./PGOvlVideosUpload.jsx";
import PGAccountInfo from "./PGAccountInfo.jsx";
import PGStudentDoubtSection from "./PGStudentDoubtSection.jsx";
// import ThemesSection from "./ThemesSection.jsx";
const STORAGE_KEY = "left_nav_state_adminPG";

const PGLeftNav = ({ decryptedUserIdState }) => {
    const [showMenu, setshowMenu] = useState(0);

    const [showdashboardPG, setShowdashboardPG] = useState(true);
    const [showExamcreation_adminPG, setShowExamcreation_adminPG] = useState(false);
    const [showInstructionPage_adminPG, setInstructionPage_adminPG] = useState(false);
    const [showCoursecreation_adminPG, setshowCoursecreation_adminPG] =
        useState(false);
    const [showTestcreationadminPG, setTestcreationadminPG] = useState(false);
    const [showDocumentUpload_adminPG, setDocumentUpload_adminPG] = useState(false);
    const [showOVLvideosUpload_adminPG, setShowOVLvideosUpload_adminPG] = useState(false);
    const [showregisteredstudentPG, setShowregisteredstudentPG] = useState(false);
    const [showImage_Upload_for_Ac, setShowImage_Upload_for_Ac] = useState(false);
    const [showStudentDoubtSectionPG, setshowStudentDoubtSectionPG] = useState(false);
    // Themes section
    // const[showThemesSectionn,setShowThemesSectionn]=useState(false)
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (savedState) {
            setShowdashboardPG(savedState.showdashboardPG);
            setShowExamcreation_adminPG(savedState.showExamcreation_adminPG);
            setshowCoursecreation_adminPG(savedState.showCoursecreation_adminPG);
            setInstructionPage_adminPG(savedState.showInstructionPage_adminPG);
            setTestcreationadminPG(savedState.showTestcreationadminPG);
            setDocumentUpload_adminPG(savedState.showDocumentUpload_adminPG);
            setShowOVLvideosUpload_adminPG(savedState.showTestActivation_admin);
            setShowregisteredstudentPG(savedState.showregisteredstudentPG);
            setShowImage_Upload_for_Ac(savedState.showImage_Upload_for_Ac);
            setshowStudentDoubtSectionPG(savedState.showStudentDoubtSectionPG);
            // setShowThemesSectionn(savedState.showThemesSectionn)
        } else {
            // Set the default values if no saved state is found
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    showdashboardPG: true,
                    showExamcreation_adminPG: false,
                    showInstructionPage_adminPG: false,
                    showCoursecreation_adminPG: false,
                    showTestcreationadminPG: false,
                    showDocumentUpload_adminPG: false,
                    showTestActivation_admin: false,
                    showregisteredstudentPG: false,
                    showImage_Upload_for_Ac: false,
                    showStudentDoubtSectionPG: false,
                    // ShowThemesSectionn:false,

                })
            );
        }
    }, []);

    const handleSectionClick = (setState) => {
        setShowdashboardPG(false);
        setShowExamcreation_adminPG(false);
        setshowCoursecreation_adminPG(false);
        setInstructionPage_adminPG(false);
        setTestcreationadminPG(false);
        setDocumentUpload_adminPG(false);
        setShowOVLvideosUpload_adminPG(false);
        setShowregisteredstudentPG(false);
        setShowImage_Upload_for_Ac(false);
        setshowStudentDoubtSectionPG(false);
        //  setShowThemesSectionn(false)

        setState(true); // Set the clicked section to true
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                showdashboardPG: setState === setShowdashboardPG,
                showExamcreation_adminPG: setState === setShowExamcreation_adminPG,
                showInstructionPage_adminPG: setState === setInstructionPage_adminPG,
                showCoursecreation_adminPG: setState === setshowCoursecreation_adminPG,
                showTestcreationadminPG: setState === setTestcreationadminPG,
                showDocumentUpload_adminPG: setState === setDocumentUpload_adminPG,
                showOVLvideosUpload_adminPG: setState === setShowOVLvideosUpload_adminPG,
                showregisteredstudentPG: setState === setShowregisteredstudentPG,
                showImage_Upload_for_Ac: setState === setShowImage_Upload_for_Ac,
                showStudentDoubtSectionPG: setState === setshowStudentDoubtSectionPG,
                // showThemesSectionn:setState===setShowThemesSectionn,
            })
        );
    };

    return (
        <>
        <h1>PG Dashboarddd</h1>
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
                    <div className={showMenu ? "quz_menu" : "quz_menu2"}>
                        <div className="lines"></div>
                        <div className="lines"></div>
                        <div className="lines"></div>
                    </div>
                </div>
                <div
                    className={showMenu ? "left-nav-bar left-nav-bar_" : "left-nav-bar"}
                >
                    <ul className="left-nav-bar-ul">
                        <li className={showdashboardPG ? "activeSD" : ""}>
                            <Link
                                onClick={() => handleSectionClick(setShowdashboardPG)}
                                className="LeftnavLinks"
                            >
                                <p>
                                    <i className="fa-solid fa-database logo_-clr"></i> Dashboard
                                </p>
                            </Link>
                        </li>
                        <li className={showExamcreation_adminPG ? "activeSD" : ""}>
                            <Link
                                onClick={() => handleSectionClick(setShowExamcreation_adminPG)}
                                className="LeftnavLinks"
                            >
                                <p>
                                    <i className="fa-solid fa-user-pen logo_-clr"></i>
                                    Exam Creation
                                </p>
                            </Link>
                        </li>
                        <li className={showCoursecreation_adminPG ? "activeSD" : ""}>
                            <Link
                                onClick={() => handleSectionClick(setshowCoursecreation_adminPG)}
                                className="LeftnavLinks"
                            >
                                <p>
                                    <i className="fa-solid fa-pen-nib logo_-clr"></i>
                                    Course Creation
                                </p>
                            </Link>
                        </li>
                        <li className={showInstructionPage_adminPG ? "activeSD" : ""}>
                            <Link
                                onClick={() => handleSectionClick(setInstructionPage_adminPG)}
                                className="LeftnavLinks"
                            >
                                <p>
                                    <i className="fa-solid fa-person-chalkboard logo_-clr"></i>
                                    Instruction
                                </p>
                            </Link>
                        </li>
                        <li className={showTestcreationadminPG ? "activeSD" : ""}>
                            <Link
                                onClick={() => handleSectionClick(setTestcreationadminPG)}
                                className="LeftnavLinks"
                            >
                                <p>
                                    <i className="fa-solid fa-file-lines logo_-clr"></i>
                                    Test Creation
                                </p>
                            </Link>
                        </li>
                        <li className={showDocumentUpload_adminPG ? "activeSD" : ""}>
                            <Link
                                onClick={() => handleSectionClick(setDocumentUpload_adminPG)}
                                className="LeftnavLinks"
                            >
                                <p>
                                    <i className="fa-solid fa-folder-open logo_-clr"></i>
                                    Document Upload
                                </p>
                            </Link>
                        </li>

                        <li className={showOVLvideosUpload_adminPG ? "activeSD" : ""}>
                            <Link
                                onClick={() => handleSectionClick(setShowOVLvideosUpload_adminPG)}
                                className="LeftnavLinks"
                            >
                                <p>
                                    <i class="fa-solid fa-video"></i>
                                    Upload Videos
                                </p>
                            </Link>
                        </li>
                        <li className={showregisteredstudentPG ? "activeSD" : ""}>
                            <Link
                                className="LeftnavLinks"
                                onClick={() => handleSectionClick(setShowregisteredstudentPG)}
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
                        <li className={showStudentDoubtSectionPG ? "activeSD" : ""}>
                            <Link
                                className="LeftnavLinks"
                                onClick={() => handleSectionClick(setshowStudentDoubtSectionPG)}
                            >
                                <p>
                                    <i className="fa-solid fa-question"></i>
                                    Student Doubt Section
                                </p>
                            </Link>
                        </li>
                        {/* <li className={showThemesSectionn?"activeSD":""}>
              <Link
                className="LeftnavLinks"
                onClick={() => handleSectionClick(setShowThemesSectionn)}
              >
                <p>
                <i class="fa-sharp fa-solid fa-palette"></i>
                 Themes Section
                </p>
              </Link>
            </li> */}
                    </ul>
                </div>
            </div>

            {showdashboardPG ? <PGAdminDashBoardInLeftNav /> : null}

            {showExamcreation_adminPG ? <PgAdminExamCreation /> : null}

            {/* {showCoursecreation_adminPG ? <Coursecreation_admin /> : null} */}
            {showCoursecreation_adminPG ? <PGAdminPortalCourseCreation /> : null}
            {showInstructionPage_adminPG ? <PGAdminInstructionPage /> : null}

            {showTestcreationadminPG ? <PGAdminTestCreationForms /> : null}

            {showDocumentUpload_adminPG ? <PGDocumentUploadAdmin /> : null}

            {showOVLvideosUpload_adminPG ? <PGOvlVideosUpload /> : null}

            {showregisteredstudentPG ? (
                <div className="admin_S_R_INfo">
                    <PGAccountInfo decryptedUserIdState={decryptedUserIdState} />
                </div>
            ) : null}

            {/* {showImage_Upload_for_Ac ? <Image_Upload_for_Ac_ADMIN /> : null} */}

            {showStudentDoubtSectionPG ? <PGStudentDoubtSection /> : null}
            {/* {showThemesSectionn ? <ThemesSection/> : null} */}

        </>
    );
};

export default PGLeftNav;
