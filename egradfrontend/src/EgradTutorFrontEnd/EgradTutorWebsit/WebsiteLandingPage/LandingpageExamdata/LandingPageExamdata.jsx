import React, { useContext, useState, useEffect } from "react";
import LandingPageExamdataEdit from "./LandingPageExamdataEdit";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../../../styles/Theme2_landingPage_styles.css";
import "../../../../styles/Theme1_landingPage_styles.css";
import "../../../../styles/Default_landingPage_styles.css";
import { FcGraduationCap } from "react-icons/fc";
import ugImg from'../../../../styles/Girl.png'
import { MdFileUpload } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { IoMdAddCircleOutline } from "react-icons/io";

const LandingPageExamdata = ({ enableEditFromP, isEditMode, userRole }) => {
  const [image, setImage] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const themeFromContext = useContext(ThemeContext);
  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];
  const [openAddExamForm, setOpenAddExamForm] = useState(false);
  const [examImages, setExamImages] = useState([]);

  const OpenAddExamForm = (branchBranch_Id) => {
    console.log(branchBranch_Id);
    setOpenAddExamForm(branchBranch_Id); // Set the state to the branch's ID
  };

  const refreshChannel = new BroadcastChannel("refresh_channel");
  refreshChannel.onmessage = function (event) {
    if (event.data === "refresh_page") {
      window.location.reload(); // Reload the page
    }
  };

  const [openUgExamImageUpload, setOpenUgExamImageUpload] = useState(false);
  const OpenExamImageUplaod = () => {
    setOpenUgExamImageUpload(true);
  };

  const handleEditClick = (branch) => {
    setSelectedBranch(branch);
    setShowPopup(true);
  };

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Logo/image`, {
        responseType: "arraybuffer",
      });
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageExamData/branches`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBranches(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setLoading(false);
    }
  };

  const fetchExamImages = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/LandingPageExamData/getExamImages`
      );
      setExamImages(response.data.examImages || []);
    } catch (error) {
      console.error("Error fetching exam images:", error);
    }
  };

  useEffect(() => {
    fetchExamImages();
  }, []);

  useEffect(() => {
    fetchBranches();
    fetchExamImages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (branches.length === 0) {
    return (
      <div>
        {userRole === 'user' ? (
          <p>No data available at the moment. Please check back later.</p>
        ) : userRole === 'admin' ? (
          <p>No data available. Please add the necessary data.</p>
        ) : (
          <p>No data available. Please contact support if this issue persists.</p>
        )}
      </div>
    );
  }


  return (
    <>
      {themeColor === "Theme-1" ? (
        <div className={`${themeDetails.theme1welcomecontainer}`}>
          <div className={`${themeDetails.theme1UGEntranceExamsContainer}`}>
            {branches && branches.length > 0 ? (
              branches.map((branch) => (
                <div
                  className={`Newlandingpage_branch_box ${themeDetails.themeBranchBox}`}
                  key={branch.Branch_Id}
                >
                  <div className={`${themeDetails.themeInBranchBox}`}>
                    <button className={`${themeDetails.themeUgAndPgButtons}`}>
                      <Link
                        to={{ pathname: `/BranchHomePage/${branch.Branch_Id}` }}
                      >
                        <FcGraduationCap style={{ fontSize: "30px" }} />
                        {branch.Branch_Name}
                      </Link>
                    </button>
                    <div
                      className={`NewlandingPage_exams_image ${themeDetails.themeExamImageBox}`}
                    >
                      {themeColor === "Theme-1" &&
                        examImages?.map((image, index) => (
                          <div key={index} className="image-item">
                            {image.Exam_Image && (
                              <img
                                src={`data:image/jpeg;base64,${image.Exam_Image}`} // Adjust the MIME type if necessary
                                alt={`Exam ${index + 1}`}
                                style={{ width: "200px", height: "auto" }}
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div
                    className={`Newlandingpage_exams_button_box ${themeDetails.themeExamButtonsBox}`}
                  >
                    <div
                      className={`${themeDetails.themeLanding_branch_box_btns}`}
                    >
                      <ul>
                        {branch.EntranceExams.slice(0, 4).map((exam) => (
                          <li
                            key={exam.EntranceExams_Id}
                            className={`${themeDetails.themeLanding_branch_box_li_buttons}`}
                          >
                            <Link to={`/ExamHomePage/${exam.EntranceExams_Id}`}>
                              {exam.EntranceExams_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No branches available</p>
            )}
          </div>
        </div>
      ) : (
        <div className="Newlandingpage">
          <div
            className={`Newlandingpage_branchescontainer ${themeDetails.themeBranchesContainer}`}
          >
            <div
              className={`Newlandingpage_branchessubcontainer ${themeDetails.themeBranchesSubContainer}`}
            >
              {branches && branches.length > 0 ? (
                branches.map((branch) => (
                  <div
                    className={`Newlandingpage_branch_box ${themeDetails.themeBranchBox}`}
                    key={branch.Branch_Id}
                  >
                    <button className={`${themeDetails.themeUgAndPgButtons}`}>
                      <Link
                        to={{ pathname: `/BranchHomePage/${branch.Branch_Id}` }}
                      >
                        {branch.Branch_Name}
                      </Link>
                    </button>
                

                    <div
                      className={`Newlandingpage_exams_button_box ${themeDetails.themeExamButtonsBox}`}
                    >
                      <div
                        className={`NewlandingPage_exams_image ${themeDetails.themeExamImageBox}`}
                      >
                        {themeColor === "Theme-2" &&
                          // examImages?.map((image, index) => (
                          //   <div key={index} className="image-item">
                          //     {image.Exam_Image && (
                          //       <img
                          //         // src={`data:image/jpeg;base64,${image.Exam_Image}`} 
                          //         src={ugImg}
                          //         alt={`Exam ${index + 1}`}
                          //         style={{ width: "200px", height: "auto" }}
                          //       />
                          //     )}
                          //   </div>
                          // )
                          // )
                         <img src={ugImg}/>
                          }
                      </div>
                      <div
                        className={`${themeDetails.themeLanding_branch_box_btns}`}
                      >
                        <ul>
                          {branch.EntranceExams.slice(0, 4).map((exam) => (
                            <li
                              key={exam.EntranceExams_Id}
                              className={`${themeDetails.themeLanding_branch_box_li_buttons}`}
                            >
                              <Link
                                to={`/ExamHomePage/${exam.EntranceExams_Id}`}
                              >
                                {exam.EntranceExams_name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No branches available</p>
              )}
            </div>
          </div>

          {isEditMode && (
            <div>
              <button
                onClick={() => setOpenUgExamImageUpload(!openUgExamImageUpload)}
              >
             {openUgExamImageUpload ?   "Close Form" : "Exam/Image Uplaod" }
              </button>

              {openUgExamImageUpload && (
                <LandingPageExamdataEdit type="UploadExamImage" />
              )}


            </div>

          
          )}
        </div>
      )}
    </>
  );
};

export default LandingPageExamdata;
