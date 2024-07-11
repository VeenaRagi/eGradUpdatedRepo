// import React, { useState, useEffect } from "react";
// import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
// import axios from "axios";
// import BASE_URL from '../../../apiConfig'

// const StudentDashbord_BuyCourses = ({usersData}) => {

//   const user_Id = usersData.users && usersData.users.length > 0 ? (
//     usersData.users.map((user) => user.username)
//   ) : null;

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState({});
//   const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);
//   const navigate = useNavigate(); // Use this for navigation
//   const [popupContent, setPopupContent] = useState(null);
//   useEffect(() => {
//     const checkLoggedIn = () => {
//       const loggedIn = localStorage.getItem("isLoggedIn");
//       if (loggedIn === "true") {
//         setIsLoggedIn(true);
//         fetchUserData();
//       }
//     };
//     checkLoggedIn();
//   }, []); // Dependency array is empty since we only need to check on initial mount

//   const fetchUserData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setIsLoggedIn(false);
//         navigate("/uglogin"); // Navigate to login if no token
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         // Token is expired or invalid, redirect to login page
//         localStorage.removeItem("isLoggedIn");
//         localStorage.removeItem("token");
//         setIsLoggedIn(false);
//         navigate("/uglogin");
//         return;
//       }

//       const data = await response.json();
//       setUserData(data);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       navigate("/uglogin"); // Redirect on error
//     }
//   };

//   const fetchUnPurchasedCourses = async () => {
//     if (!userData.id) {
//       return; // Exit if userData.id is not defined
//     }

//     try {
//       const response = await fetch(
//         `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${userData.id}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setUnPurchasedCourses(data);
//       } else {
//         console.error("Failed to fetch unPurchased courses");
//       }
//     } catch (error) {
//       console.error("Error fetching purchased courses:", error);
//     }
//   };
//   console.log("hiiiiiiiiiiiiiiiiiiiiiiii");
//   console.log(unPurchasedCourses);
//   useEffect(() => {
//     fetchUnPurchasedCourses();
//   }, [userData.id]); // Fetch only when userData.id is defined

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const coursesByPortalAndExam = unPurchasedCourses.reduce(
//     (portals, course) => {
//       const portal = course.portal || "Unknown Portal"; // Default value
//       const examName = course.examName || "Unknown Exam"; // Default value

//       if (!portals[portal]) {
//         portals[portal] = {}; // Initialize portal if not present
//       }

//       if (!portals[portal][examName]) {
//         portals[portal][examName] = []; // Initialize exam group if not present
//       }

//       portals[portal][examName].push(course); // Group courses by portal and exam name
//       return portals;
//     },
//     {}
//   );

//   // function studentbuynowbtnuserboughtcoursecheck(courseCreationId, userId) {
//   //   // Make a GET request to your backend endpoint
//   //   fetch(`http://localhost:5001/StudentRegistationPage/getotsregistrationdata/${courseCreationId}/${userId}`)
//   //     .then((response) => {
//   //       if (response.ok) {
//   //         // Handle successful response
//   //         return response.json();
//   //       } else {
//   //         // Handle errors
//   //         console.error("Failed to send IDs to backend");
//   //         return { message: "Failed to send IDs to backend" };
//   //       }
//   //     })
//   //     .then((data) => {
//   //       // Log the message received from the backend
//   //       console.log(data.message);

//   //       // Check if data is found or not
//   //       if (data.message === "Data found") {
//   //         fetch(`http://localhost:5001/StudentRegistationPage/insertthedatainstbtable/${courseCreationId}/${userId}`, {
//   //           method: "POST",
//   //           headers: {
//   //             "Content-Type": "application/json"
//   //           },
//   //           body: JSON.stringify({ courseCreationId, userId }) // Assuming data contains the data you want to write
//   //         })
//   //         .then(response => response.json())
//   //         .then(responseData => {
//   //           console.log(courseCreationId, userId);
//   //           console.log(responseData.message);

//   //           // Redirect to the found page
//   //           // /PayU/:courseCreationId
//   //           window.location.href = `/PayU/${courseCreationId}`;
//   //         })
//   //         .catch(error => {
//   //           console.error("Error writing data:", error);
//   //         });
//   //       } else {
//   //         window.location.href = `/coursedataSRP/${courseCreationId}`; // Redirect to not found page
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error:", error);
//   //     });
//   // }

//   function studentbuynowbtnuserboughtcoursecheck(courseCreationId, userId) {
//     // Make a GET request to your backend endpoint
//     fetch(
//       `http://localhost:5001/StudentRegistationPage/getotsregistrationdata/${courseCreationId}/${userId}`
//     )
//       .then((response) => {
//         if (response.ok) {
//           // Handle successful response
//           return response.json();
//         } else {
//           // Handle errors
//           console.error("Failed to send IDs to backend");
//           return { message: "Failed to send IDs to backend" };
//         }
//       })
//       .then((data) => {
//         // Log the message received from the backend
//         console.log(data.message);

//         // Check if data is found or not
//         if (data.message === "Data found") {
//           fetch(
//             `http://localhost:5001/StudentRegistationPage/insertthedatainstbtable/${courseCreationId}/${userId}`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ courseCreationId, userId }), // Assuming data contains the data you want to write
//             }
//           )
//             .then((response) => response.json())
//             .then((responseData) => {
//               console.log(courseCreationId, userId);
//               console.log(responseData.message);

//               // Redirect to the found page
//               // /PayU/:courseCreationId
//               window.location.href = `/PayU/${courseCreationId}`;
//             })
//             .catch((error) => {
//               console.error("Error writing data:", error);
//             });
//         } else {
//           window.location.href = `/coursedataSRP/${courseCreationId}`; // Redirect to not found page
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }
//   const [selectedPortal, setSelectedPortal] = useState("");
//   function getPortalColorClass(portal) {
//     if (selectedPortal === portal) {
//       return "selectedPortal";
//     } else {
//       switch (portal) {
//         case "Online Test Series":
//           return "portal1";
//         case "Practices Question Bank":
//           return "portal2";
//         case "Online Video Lecture":
//           return "portal3";
//         default:
//           return "defaultPortal";
//       }
//     }
//   }
//   const handlemoreinfo = async (userId, Portale_Id, courseCreationId) => {
//     // setPopupbeforelogin(true);
//     try {
//       const response = await fetch(
//         `${BASE_URL}/Exam_Course_Page/unPurchasedCourses/${userId}`
//       );
//       const data = await response.json();

//       // Filter the data based on Portale_Id and courseCreationId
//       const filteredData = data.filter(
//         (item) =>
//           item.Portale_Id === Portale_Id &&
//           item.courseCreationId === courseCreationId
//       );

//       // Display the filtered data in the popup
//       const popupContent = filteredData.map((item) => (
//         <div key={item.id} className="popupbeforelogin">
//           <button onClick={handleClosePopup} className="closeButton">
//             x
//           </button>
//           <div className="popupbeforeloginbox">
//             <div className="popupbeforeloginboxleft">
//               <img src={item.courseCardImage} alt="" />
//             </div>
//             <div className="popupbeforeloginboxright">
//               <p>{item.portal}</p>
//               <p>
//                 <b>Exam Name:</b> {item.examName}
//               </p>

//               <p>
//                 <b>Course Name:</b> {item.courseName}
//               </p>
//               <p>
//                 <b> Duration:</b>
//                 {formatDate(item.courseStartDate)}to
//                 {formatDate(item.courseEndDate)}
//               </p>

//               <p>
//                 <b>Price:</b>
//                 {item.totalPrice}
//               </p>

//               <p>
//                 <b>No of Tests:</b> {item.testCount}
//               </p>
//               <p>
//                 <b> Subject:</b>
//                 {item.subjectNames}
//                 {item.topicName}
//               </p>
//             </div>
//           </div>

//           {/* <img src={item.courseCardImage} alt="" /> */}

//           {/* Add other data fields as needed */}
//         </div>
//       ));

//       // Update state or set a variable to show the popup content
//       setPopupContent(popupContent);
//     } catch (error) {
//       console.error("Error fetching purchased courses:", error);
//     }
//   };
//   const handleClosePopup = () => {
//     setPopupContent(false);
//   };

//   return (
//     <div>
//     {/* <div
//       className="before_login_courses_btn_continer_dashbord"
//       id="QuizCourses"
//     >
//       <div className="courseheader_continer">
//         <h2>BUY COURSES</h2>
//         <span>Choose your course and get started.</span>

//         {Object.entries(coursesByPortalAndExam).map(([portal, exams]) => (
//           <div key={portal} className="portal_group">
//             <h2>{portal}</h2> 
//             {Object.entries(exams).map(([examName, courses]) => (
//               <div key={examName} className="exam_group">
//                 <h2 className="subheading">{examName}</h2>
//                 <div className="courses_container">
//                   {courses.map((courseExamsDetails) => (
//                     <div
//                       key={courseExamsDetails.courseCreationId}
//                       className="before_login_first_card"
//                     >
//                       <img
//                         src={courseExamsDetails.courseCardImage}
//                         alt={courseExamsDetails.courseName}
//                       />
//                       <p>
//                         <b>{courseExamsDetails.courseName}</b>
//                       </p>
//                       <p>
//                         <b>Duration:</b>
//                         {formatDate(courseExamsDetails.courseStartDate)}
//                         to {formatDate(courseExamsDetails.courseEndDate)}
//                       </p>
//                       <p>
//                         <b> Price:</b>₹ {courseExamsDetails.totalPrice}
//                       </p>
//                       <div className="before_start_now">
//                         <Link
                        
//                           onClick={() =>
//                             studentbuynowbtnuserboughtcoursecheck(
//                               courseExamsDetails.courseCreationId,
//                               userData.id
//                             )
//                           }
//                         >
//                           <span style={{ fontWeight: 900 }}>
//                             <PiHandTapBold
//                               style={{
//                                 fontWeight: "bold",
//                                 fontSize: 22,
//                                 color: "#fff",
//                               }}
//                             />
//                           </span>{" "}
//                           Buy Now
//                         </Link>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div> */}
//     <div className="QuizBUy_courses QuizBUy_coursesinstudentdB">
//       {popupContent}
//       <div className="QuizBUy_coursessub_conatiner QuizBUy_coursessub_conatinerinstudentdB">
//         <div className="QuizBUy_coursesheaderwithfilteringcontainer">
//           <div className="QuizBUy_coursesheaderwithfilteringcontainerwithtagline">
//             <h2>BUY COURSES</h2>
//             <span>Choose your course and get started.</span>
//           </div>

//           {/* <span>Choose your course and get started.</span> */}
//           <div>
//             <select
//               value={selectedPortal}
//               onChange={(e) => setSelectedPortal(e.target.value)}
//             >
//               <option value="">All Portals</option>
//               {Object.keys(coursesByPortalAndExam).map((portal) => (
//                 <option key={portal} value={portal}>
//                   {portal}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="QuizBUy_coursescontainerwithfilteringcontainer">
//           {Object.entries(coursesByPortalAndExam)
//             .filter(
//               ([portal, exams]) =>
//                 !selectedPortal || portal === selectedPortal
//             )
//             .map(([portal, exams]) => (
//               <div
//                 key={portal}
//                 className={`portal_groupbuycourse ${getPortalColorClass(
//                   portal
//                 )}`}
//               >
//                 <h2 className="portal_group_h2">{portal}</h2>
//                 {/* Display portal name */}
//                 {Object.entries(exams).map(([examName, courses]) => (
//                   <div key={examName} className="exam_group">
//                     <h2 className="subheadingbuycourse">{examName}</h2>
//                     <div className="courses_boxcontainer">
//                       {courses.map((courseExamsDetails) => (
//                         <div
//                           key={courseExamsDetails.courseCreationId}
//                           className="QuizBUy_coursescontainerwithfilteringcoursebox"
//                         >
//                           <img
//                             src={courseExamsDetails.courseCardImage}
//                             alt={courseExamsDetails.courseName}
//                           />
//                           <div className="QuizBUy_coursescontainerwithfilteringcoursebox_info">
//                             <p>{courseExamsDetails.courseName}</p>
//                             <p>
//                               <b> Duration: </b>
//                               {formatDate(
//                                 courseExamsDetails.courseStartDate
//                               )}{" "}
//                               to{" "}
//                               {formatDate(courseExamsDetails.courseEndDate)}
//                             </p>

//                             <p>
//                               <b>{courseExamsDetails.topicName} </b>
//                             </p>
//                             <p>
//                               <a
//                                 style={{ color: "blue", cursor: "pointer" }}
//                                 onClick={() =>
//                                   handlemoreinfo(
//                                     userData.id,
//                                     courseExamsDetails.Portale_Id,
//                                     courseExamsDetails.courseCreationId
//                                   )
//                                 }
//                                 // onClick={() =>
//                                 //   handlemoreinfo(
//                                 //     userData.userId,

//                                 //   )
//                                 // }
//                               >
//                                 More Info...
//                               </a>
//                             </p>

//                             <div className="QuizBUy_coursescontainerwithfilteringcoursebox_info_buynoeprice">
//                               {/* <label>
//                                 Price: ₹ {courseExamsDetails.totalPrice}
//                               </label>{" "} */}
//                               <label>
//                                 Price:
//                                 <span>
//                                   ₹{courseExamsDetails.ActualtotalPrice}
//                                 </span>
//                                 <span>{courseExamsDetails.discount}%</span>
//                                 <span>₹{courseExamsDetails.totalPrice}</span>
//                                 {/* {courseExamsDetails.ActualtotalPrice}/
                                     
//                                       {courseExamsDetails.discount}%/
//                                       {courseExamsDetails.totalPrice}/ */}
//                               </label>{" "}
//                               <Link
//                                 // to={`/coursedataSRP/${courseExamsDetails.courseCreationId}`}
//                                 onClick={() =>
//                                   studentbuynowbtnuserboughtcoursecheck(
//                                     courseExamsDetails.courseCreationId,
//                                     userData.id
//                                   )
//                                 }
//                               >
//                                 Buy Now{" "}
//                                 <span style={{ fontWeight: 900 }}>
//                                   <PiHandTapBold
//                                     style={{
//                                       fontWeight: "bold",
//                                       fontSize: 22,
//                                       color: "#fff",
//                                     }}
//                                   />
//                                 </span>{" "}
//                               </Link>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   </div>
//   )
// }

// export default StudentDashbord_BuyCourses
