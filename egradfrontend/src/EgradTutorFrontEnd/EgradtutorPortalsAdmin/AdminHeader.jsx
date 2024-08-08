// import React, { useContext, useEffect, useState } from 'react'
// import { Link, useNavigate, useParams } from 'react-router-dom';
// // import axios from '../../api/axios';
// import BASE_URL from '../../apiConfig';
// import { IoHome } from "react-icons/io5";
// import { ThemeContext } from '../../ThemesFolder/ThemeContext/Context';
// import JSONClasses from '../../ThemesFolder/JSONForCSS/JSONClasses';
// import './styles/AdminHeader.css'
// import { RxHamburgerMenu } from "react-icons/rx";
// import axios from 'axios';
// import AdminLogin from '../../Login/AdminLogin';
// const AdminHeader = ({ userRole }) => {
//   const { EntranceExams_Id } = useParams();
//   const [entranceExam, setEntranceExam] = useState([]);
//   const [image, setImage] = useState(null);
//   const themeFromContext = useContext(ThemeContext);
//   const [showLinks, setShowLinks] = useState(false);
// const navigate=useNavigate();
//   const themeColor = themeFromContext[0]?.current_theme;
//   console.log(themeColor, "this is the theme json classesssssss")
//   const themeDetails = JSONClasses[themeColor] || []
//   console.log(themeDetails, "mapppping from json....")
//   useEffect(() => {
//     const fetchEntranceExam = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/ExamInfo/feachingentrance_exams/${EntranceExams_Id}`
//         );
//         console.log("Entrance Exam Data:", response.data);
//         setEntranceExam(response.data);
//       } catch (error) {
//         console.error("Error fetching entrance exam:", error);
//       }
//     };
//     fetchEntranceExam();
//   }, [EntranceExams_Id]);

//   const fetchImage = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/Logo/image`, {
//         responseType: "arraybuffer",
//       });
//       const imageBlob = new Blob([response.data], { type: "image/png" });
//       const imageUrl = URL.createObjectURL(imageBlob);
//       setImage(imageUrl);
//     } catch (error) {
//       console.error("Error fetching image:", error);
//     }
//   };
//   useEffect(() => {
//     fetchImage();
//   }, []);
// const handleLogOut=()=>{
//   localStorage.removeItem("tiAuth")
//   navigate("/adminLogin")
// }
//   return (
//     <div>
//       <div className={`adminHeaderParentContainer _dFlex`}>
//         <div className={`adminHeaderSubContainer _dFlex _fBetween`}>
//           {/* <div></div> */}
//           <div className='adminHeaderLogoImgContainer'>
//             {image ? (
//               <Link to="/">
//                 <img
//                   src={image}
//                   className={``}
//                   alt="Current"
//                 />
//               </Link>
//             ) : userRole === 'user' ? (
//               <p>Unable to load image at the moment. Please try again later.</p>
//             ) : userRole === 'admin' ? (
//               <p>No image available. Please upload an image.</p>
//             ) : (
//               <p>No image available. Please contact support if this issue persists.</p>
//             )}</div>
//           <div className={` _fBetween adminHeaderNavLinks ${showLinks? "menu-link mobileMenuLink " : "menu-link "}`}>
//             <Link to='/WebsiteAdmin'>Website Admin</Link>
//             <Link to='/CourseAdmin'>UG Course Admin</Link>
//             <Link to='/PGCourseAdmin'>PG Course Admin</Link>
//             <Link to='/adminProfile'>Profile</Link>
//             <Link to={`/`}><IoHome />Home</Link>
//             <button onClick={handleLogOut}> LogOut</button>
//           </div>
//           <div
//               className="hamburgerMenu adminHeaderhamburgerMenu"
//               onClick={() => {
//                 setShowLinks(!showLinks);
//                 console.log(showLinks, "this is from onclick of hMenu");
//               }}
//             >
//               {" "}
//               <RxHamburgerMenu />
//             </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminHeader






















import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import BASE_URL from '../../apiConfig';
import { IoHome } from "react-icons/io5";
import { ThemeContext } from '../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../ThemesFolder/JSONForCSS/JSONClasses';
import './styles/AdminHeader.css'
import { RxHamburgerMenu } from "react-icons/rx";
import axios from 'axios';

const AdminHeader = ({ userRole }) => {
  const { EntranceExams_Id } = useParams();
  const [entranceExam, setEntranceExam] = useState([]);
  const [image, setImage] = useState(null);
  const themeFromContext = useContext(ThemeContext);
  const [showLinks, setShowLinks] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];

  useEffect(() => {
    const fetchEntranceExam = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ExamInfo/feachingentrance_exams/${EntranceExams_Id}`);
        setEntranceExam(response.data);
      } catch (error) {
        console.error("Error fetching entrance exam:", error);
      }
    };
    fetchEntranceExam();
  }, [EntranceExams_Id]);

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Logo/image`, { responseType: "arraybuffer" });
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

  const handleLogOut = () => {
    localStorage.removeItem("tiAuth");
    navigate("/adminLogin");
  };

  // Determine active link based on current location
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div>
      <div className={`adminHeaderParentContainer _dFlex`}>
        <div className={`adminHeaderSubContainer _dFlex _fBetween`}>
          <div className='adminHeaderLogoImgContainer'>
            {image ? (
              <Link to="/">
                <img
                  src={image}
                  className={``}
                  alt="Current"
                />
              </Link>
            ) : userRole === 'user' ? (
              <p>Unable to load image at the moment. Please try again later.</p>
            ) : userRole === 'admin' ? (
              <p>No image available. Please upload an image.</p>
            ) : (
              <p>No image available. Please contact support if this issue persists.</p>
            )}
          </div>
          <div className={` _fBetween adminHeaderNavLinks ${showLinks ? "menu-link mobileMenuLink " : "menu-link "}`}>
            <Link to='/WebsiteAdmin' className={isActive('/WebsiteAdmin')}>
              Website Admin
              <span className="dot"></span>
            </Link>
            <Link to='/CourseAdmin' className={isActive('/CourseAdmin')}>
              UG Course Admin
              <span className="dot"></span>
            </Link>
            <Link to='/PGCourseAdmin' className={isActive('/PGCourseAdmin')}>
              PG Course Admin
              <span className="dot"></span>
            </Link>
            <Link to='/adminProfile' className={isActive('/adminProfile')}>
              Profile
              <span className="dot"></span>
            </Link>
            <Link to={`/`} className={isActive('/')}>
              <IoHome />Home
              <span className="dot"></span>
            </Link>
            <button onClick={handleLogOut}>LogOut</button>
          </div>
          <div
            className="hamburgerMenu adminHeaderhamburgerMenu"
            onClick={() => {
              setShowLinks(!showLinks);
            }}
          >
            <RxHamburgerMenu />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader;
