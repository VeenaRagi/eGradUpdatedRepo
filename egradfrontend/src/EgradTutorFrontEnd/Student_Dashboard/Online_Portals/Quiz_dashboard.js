import React, { useState, useEffect } from "react";
// import Adimheader from "../login/Adimheader";
import { nav } from "../Online_Portals/Data/Data";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Exam_portal_admin_integration from "../../Admin_Dashboard/Exam_portal_admin_integration";
// import UG_HOME from "../../UG_HOME";
import "./styles/Quiz_amain_page.css";
import BASE_URL from "../../../apiConfig";
import ThemesSection from "../../../ThemesFolder/ThemesSection/ThemesSection";

const Quiz_dashboard = () => {
  const [showQuizmobilemenu, setShowQuizmobilemenu] = useState(false);
  const QuiZ_menu = () => {
    setShowQuizmobilemenu(!showQuizmobilemenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/userlogin";
  };
  const userRole = localStorage.getItem("userRole");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        fetchUserData();
      }
    };
    checkLoggedIn();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        Navigate("/userlogin"); // Assuming you have the 'navigate' function available

        return;
      }

      if (response.ok) {
        // Token is valid, continue processing user data
        const userData = await response.json();
        setUserData(userData);
        // ... process userData
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // const [courses, setCourses] = useState([]);
  const [examsug, setExamsug] = useState([0]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/examsug`)
      .then((res) => {
        setExamsug(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="adminQuizHeader_container">
      <div className="Quiz_main_page_header">
        {nav.map((nav, index) => {
          return (
            <div key={index} className="Quiz_main_page_navbar">
              <div className="Quizzlogo">
                <img src={nav.logo} alt="" />
              </div>
              {/* <li  className={showcardactive1?"showcardactive":"showcardactivenone"}> */}

              <div
                className={
                  !showQuizmobilemenu
                    ? "Quiz_main_page_navbar_SUBpart Quiz_main_page_navbar_SUBpart_mobile"
                    : "Quiz_main_page_navbar_SUBpart_mobile"
                }
              >
                <ul>
                  <button style={{ background: "none" }}>
                    <Link to="/" className="Quiz__home">
                      Home
                    </Link>
                  </button>

                  {/* <button className="quiz_sign_UP">                   
                    Sign up
                  </button> */}
                  <div className="Quiz_main_page_login_signUp_btn">
                    {/* 
                      <Link to='/'><button onClick={Quiz_login}>
                   Login
                  </button></Link> */}
                  </div>
                  <div>
                    <button id="dropdownmenu_foradim_page_btn">
                      <img
                        title={userData.username}
                        src={userData.imageData}
                        alt={`Image ${userData.user_Id}`}
                      />
                      <div className="dropdownmenu_foradim_page">
                        {/* <Link to={`/userread/${user.id}`} className="btn btn-success mx-2">Read</Link> */}
                        {/* <Link to={`/userdeatailspage/${user.id}`} >Account-info</Link> */}
                        <Link to="/student_dashboard">My profile</Link>
                        <Link onClick={handleLogout}>Logout</Link>
                      </div>
                    </button>
                  </div>
                </ul>
              </div>

              <div className="quz_menu" onClick={QuiZ_menu}>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
              </div>
            </div>
          );
        })}
      </div>

      <Quiz_main_page_container />
    </div>
  );
};

export default Quiz_dashboard;

export const Quiz_main_page_container = () => {
  const STORAGE_KEY = "left_nav_state";
  // State management for the active cards
  const [activeCard, setActiveCard] = useState({
    card1: true,
    card2: false,
    // card3:false,
  });

  // State management for the active buttons
  const [activeButton, setActiveButton] = useState({
    button1: true,
    button2: false,
    // button3:false,
  });
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState && savedState.activeCard && savedState.activeButton) {
      setActiveCard(savedState.activeCard);
      setActiveButton(savedState.activeButton);
    }
  }, []);
  // useEffect(() => {
  //   const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
  //   if (savedState) {
  //     setActiveCard(savedState.activeCard || { card1: true, card2: false });
  //     setActiveButton(
  //       savedState.activeButton || { button1: true, button2: false }
  //     );
  //   } else {
  //     // Set the default values if no saved state is found
  //     localStorage.setItem(
  //       STORAGE_KEY,
  //       JSON.stringify({
  //         activeCard: { card1: true, card2: false },
  //         activeButton: { button1: true, button2: false },
  //       })
  //     );
  //   }
  // }, []);
  // Handle button clicks to toggle active state
  const handleButtonClick = (button) => {
    const newActiveButton = {
      button1: button === "button1",
      button2: button === "button2",
      // button3: button === "button3",
    };

    const newActiveCard = {
      card1: button === "button1",
      card2: button === "button2",
      // card3: button === "button3",
    };

    setActiveButton(newActiveButton);
    setActiveCard(newActiveCard);

    // Save the state to localStorage
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        activeCard: newActiveCard,
        activeButton: newActiveButton,
      })
    );
  };
  const userRole = localStorage.getItem("userRole");
  return (
    <>
      <div className="Quiz_main_page_container">
        <div className="Quiz_main_page_subcontainer">
          <div className="Quiz_main_page_container_btns">
            {userRole === "admin" && (
              <>
                <button
                  className={
                    activeButton.button1
                      ? "showcardactive"
                      : "showcardactivenone"
                  }
                  onClick={() => handleButtonClick("button1")} >
                  Website Admin
                </button>
                <button
                  className={
                    activeButton.button2
                      ? "showcardactive"
                      : "showcardactivenone"
                  }
                  onClick={() => handleButtonClick("button2")}
                >
                  Online Portals
                </button>
                {/* <button
                  className={
                    activeButton.button3
                      ? "showcardactive"
                      : "showcardactivenone"
                  }
                  onClick={() => handleButtonClick("button3")}
                >
                  OVL Admin
                </button> */}
              </>
            )}
          </div>

          {userRole === "admin" && (
            <>
              {activeCard.card1 ? (
                <div className="UGhomepageadmin">
                  {/* <UploadPage /> */}
{/* asdf */}
<ThemesSection/>

                </div>
              ) : null}
              {activeCard.card2 ? (
                <div className="UGQUizadmin">
                  <Exam_portal_admin_integration />
                </div>
              ) : null}
              {/* {activeCard.card3 ? (
                <div className="UGQUizadmin"> */}
              {/* <OvlvidesUpload /> */}
              {/* <OVL_Admin_integration/>
                </div>
               ) : null}  */}
            </>
          )}

          {userRole === "ugadmin" && (
            <>
              {/* <UploadPage /> */}
{/* asdf */}
<ThemesSection/>
            </>
          )}

          {userRole === "ugotsadmin" && (
            <>
              <h3>Online Test Creation Admin</h3>
              <Exam_portal_admin_integration />
            </>
          )}
          {/* {userRole === "admin" && (
            <>
              <h3>Online Video Lecture Admin</h3>
              <OvlvidesUpload />
            </>
          )} */}

          {/* Default component
          {userRole !== "admin" &&
            userRole !== "ugadmin" &&
            userRole !== "ugotsadmin" && (
              <div>
                <p>Default Component</p>
              </div>
            )} */}
        </div>
      </div>
    </>
  );
};

//------------------- ug adminpage-----------------------------

// export const UploadPage = () => {
//   // const[showselectexamsection,Setshowselectexamsection]=useState(true)
//   const [courses, setCourses] = useState([]);
//   const [exams, setExams] = useState([""]);
//   const [sections, setSections] = useState([]);

//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [selectedSection, setSelectedSection] = useState("");

//   const [enableExamsMenu, setEnableExamsMenu] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/ughomepage_banner_login/UGhomepageadimcourses`)
//       .then((res) => {
//         setCourses(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching courses:", error);
//       });
//   }, []);

//   const fetchExamsAndSections = (courseId) => {
//     axios
//       .get(
//         `${BASE_URL}/ughomepage_banner_login/UGhomepageadimsections/${courseId}`
//       )
//       .then((res) => {
//         setSections(res.data);
//         console.log(sections);
//       })
//       .catch((error) => {
//         console.error("Error fetching sections:", error);
//       });
//   };

//   const handleCourseChange = (event) => {
//     const courseId = event.target.value;
//     setSelectedCourse(courseId);
//     setSelectedSection(null);
//     setSelectedExam(null);
//     setEnableExamsMenu(false);
//     fetchExamsAndSections(courseId);
//     console.log("Selected Course:", courseId);
//   };
//   const [show1, setShow1] = useState(null);
//   const handleSectionChange = (event) => {
//     const sectionId = event.target.value;
//     setSelectedSection(sectionId);

//     // Enable the "Exams" menu only for specific section values
//     const isFirstSection = sectionId === "1";
//     const isSecondSection = sectionId === "2";
//     const isThirdSection = sectionId === "3";
//     const isFourthSection = sectionId === "4";
//     const isFiveSection = sectionId === "5";
//     const isSixthSection = sectionId === "6";

//     // Enable/disable exams menu based on the condition

//     setEnableExamsMenu(isThirdSection || isSixthSection);

//     if (isThirdSection || isSixthSection) {
//       setShow1(true);
//     } else {
//       setShow1(false);
//     }

//     if (isFirstSection || isSecondSection || isFourthSection || isFiveSection) {
//       const fetchExamsAndSections = (courseId) => {
//         axios
//           .get(
//             `${BASE_URL}/ughomepage_banner_login/UGhomepageadimsections/${courseId}`
//           )
//           .then((res) => {
//             setSections(res.data);
//             console.log("Selected section:", sectionId);
//             // console.log(sections);
//           })
//           .catch((error) => {
//             console.error("Error fetching sections:", error);
//           });
//         axios
//           .get(
//             `${BASE_URL}/ughomepage_banner_login/UGhomepageadimexams/${courseId}`
//           )
//           .then((res) => {
//             // setExams(res.data);
//             console.log(exams);
//           })
//           .catch((error) => {
//             console.error("Error fetching exams:", error);
//           });
//         fetchExamsAndSections(selectedCourse);
//       };
//     } else if (isThirdSection || isSixthSection) {
//       // Fetch exams based on the selected course and section

//       const fetchExamsAndSections = (courseId) => {
//         axios
//           .get(
//             `${BASE_URL}/ughomepage_banner_login/UGhomepageadimsections/${courseId}`
//           )
//           .then((res) => {
//             setSections(res.data);
//             console.log(sections);
//           })
//           .catch((error) => {
//             console.error("Error fetching sections:", error);
//           });

//         axios
//           .get(
//             `${BASE_URL}/ughomepage_banner_login/UGhomepageadimexams/${courseId}`
//           )
//           .then((res) => {
//             setExams(res.data);

//             console.log(exams);
//           })
//           .catch((error) => {
//             console.error("Error fetching exams:", error);
//           });
//       };
//       fetchExamsAndSections(selectedCourse);
//       setExams([]);
//       setSections([]);
//     }

//     if (
//       setExams == isFirstSection ||
//       isSecondSection ||
//       isFourthSection ||
//       isFiveSection
//     ) {
//       setSelectedExam(!exams);

//       const fetchExamsAndSections = (courseId) => {
//         axios
//           .get(
//             `${BASE_URL}/ughomepage_banner_login/UGhomepageadimsections/${courseId}`
//           )
//           .then((res) => {
//             setSections(res.data);
//             console.log(sections);
//           })
//           .catch((error) => {
//             console.error("Error fetching sections:", error);
//           });

//         axios
//           .get(
//             `${BASE_URL}/ughomepage_banner_login/UGhomepageadimexams/${courseId}`
//           )
//           .then((res) => {
//             // setExams(res.data);

//             console.log(exams);
//           })
//           .catch((error) => {
//             console.error("Error fetching exams:", error);
//           });
//       };
//       fetchExamsAndSections(selectedCourse);
//       setExams([]);
//       setSections([]);
//       // Setshowselectexamsection(false)
//       console.log("working");
//     } else if (
//       setExams == isSecondSection ||
//       isFirstSection ||
//       isFourthSection ||
//       isFiveSection
//     ) {
//       setSelectedExam(!exams);

//       const fetchExamsAndSections = (courseId) => {
//         axios
//           .get(
//             `${BASE_URL}/ughomepage_banner_login/UGhomepageadimsections/${courseId}`
//           )
//           .then((res) => {
//             setSections(res.data);
//             console.log(sections);
//           })
//           .catch((error) => {
//             console.error("Error fetching sections:", error);
//           });
//         axios
//           .get(
//             `${BASE_URL}/ughomepage_banner_login/UGhomepageadimexams/${courseId}`
//           )
//           .then((res) => {
//             // setExams(res.data);

//             console.log(exams);
//           })
//           .catch((error) => {
//             console.error("Error fetching exams:", error);
//           });
//       };
//       fetchExamsAndSections(selectedCourse);
//       setExams([]);
//       setSections([]);
//       // console.log("working")
//     }
//   };

//   const handleExamChange = (event) => {
//     const examId = event.target.value;
//     setSelectedExam(examId);
//   };

//   const [image, setImage] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//   };

//   const handleUpload = async () => {
//     if (!selectedCourse || !selectedSection || !image) {
//       setUploadStatus("error");
//       console.error(
//         "Please select course, section, and choose an image before uploading."
//       );
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", image);
//     formData.append("course_id", selectedCourse);
//     formData.append("section_id", selectedSection);

//     try {
//       // Include exam_id in the formData if selectedSection is "3" or "6"
//       if (["3", "6"].includes(selectedSection)) {
//         if (!selectedExam) {
//           console.error("Please select an exam for Course Exam Page.");
//           return;
//         }
//         formData.append("exam_id", selectedExam);
//       }

//       // Use a single route for both main page and course exam uploads
//       const response = await axios.post(
//         `${BASE_URL}/ughomepage_banner_login/upload`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             // "Authorization": "Bearer YOUR_ACCESS_TOKEN",
//           },
//         }
//       );

//       console.log(response.data);
//       setUploadStatus("success");
//       // Update UI or perform other actions on successful upload
//     } catch (error) {
//       console.error("Error uploading image", error);
//       setUploadStatus("error");
//       // Handle error, show a message, etc.
//     }
//   };

//   return (
//     <div className="Quiz_admin_page_container">
//       <div>
//         {uploadStatus === "success" && (
//           <p style={{ color: "green", fontSize: "20px" }}>
//             Successfully uploaded!
//           </p>
//         )}
//         {uploadStatus === "error" && (
//           <p style={{ color: "red", fontSize: "20px" }}>
//             Error uploading image. Please try again.
//           </p>
//         )}
//       </div>

//       <h3>Upload Images</h3>

//       <div className="UGhomepageadmin_inputs">
//         <label htmlFor="Course">Course: </label>
//         <select
//           id="CourseChange"
//           onChange={handleCourseChange}
//           value={selectedCourse}
//         >
//           <option value="">Select Course</option>
//           {courses.map((course) => (
//             <option key={course.course_id} value={course.course_id}>
//               {course.course_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="UGhomepageadmin_inputs">
//         <label htmlFor="Section">Section: </label>
//         <select
//           id="SectionChange"
//           onChange={handleSectionChange}
//           value={selectedSection}
//         >
//           <option value="">Select Section</option>
//           {sections.map((section) => (
//             <option key={section.section_id} value={section.section_id}>
//               {section.section_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         {show1 ? (
//           <div className="UGhomepageadmin_inputs">
//             <label htmlFor="state">Exam: </label>
//             <select id="state" onChange={handleExamChange} value={selectedExam}>
//               <option value="">Select Exam</option>
//               {exams.map((exam) => (
//                 <option key={exam.exam_id} value={exam.exam_id}>
//                   {exam.exam_name}
//                 </option>
//               ))}
//             </select>
//             <br />
//           </div>
//         ) : null}
//       </div>

//       <div className="UGhomepageadmin_inputs">
//         <input type="file" onChange={handleFileChange} />
//       </div>
//       <div>
//         <Link onClick={handleUpload}>Upload Image</Link>

//         <Link to={"/ImageFetching"}>Show Uploaded Files</Link>
//       </div>
//     </div>
//   );
// };

export const ImageFetching = () => {
  const [imageTitle, setImageTitle] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/ImageTitle`)
      .then((res) => {
        setImageTitle(res.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const [imageArray, setImageArray] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/ughomepage_banner_login/HomeImagesadmin`)
      .then((res) => {
        setImageArray(res.data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  const handleDeleteImage = (imageId) => {
    axios
      .delete(`${BASE_URL}/ughomepage_banner_login/HomeImages/${imageId}`)
      .then(() => {
        // Remove the deleted image from the local state
        setImageArray((prevImages) =>
          prevImages.filter((image) => image.id !== imageId)
        );
        // window.alert('Image deleted successfully!');
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  // const [updateData, setUpdateData] = useState({
  //   id: null,
  //   imageTitle: "",
  // });

  // const handleUpdate = (imageId) => {
  //   // Find the image data for the selected imageId
  //   const selectedImage = imageTitle.find(
  //     (image) => image.image_id === imageId
  //   );

  //   // Set the initial values in the update form
  //   setUpdateData({
  //     id: selectedImage.image_id,
  //     imageTitle: selectedImage.image_title,
  //   });
  // };
  return (
    <div className="UGhomepageadmin_Uploaded_Files">
      <div className="UGhomepageadmin_Uploaded_Files_header">
        <h1>Images</h1>
        <Link to="/Quiz_dashboard">Back</Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Images</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {imageTitle.map((imageName, index) => (
            <tr key={imageName.images_id}>
              <td>{index + 1}</td>
              <td>{imageName.image_title}</td>
              <td className="action">
                <Tooltip title="Delete" arrow>
                  <Button
                    onClick={() => handleDeleteImage(imageName.images_id)}
                  >
                    <span className="material-symbols-outlined">delete</span>{" "}
                  </Button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {imageArray.length > 0 ? (
        <div className="UGhomepageadmin_Uploaded_Files_img_container__">
          {imageArray.map((image) => (
            <div className=".UGhomepageadmin_Uploaded_Files_img_container">
              <img
                key={image.id}
                src={image.imageData}
                alt={`Image ${image.id}`}
                className="UGhomepageadmin_Uploaded_Files_img_container_img"
                // style={{ maxWidth: "100px", marginBottom: "10px" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No images found.</p>
      )}
    </div>
  );
};
