import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
// import axios from '../../api/axios';
import BASE_URL from '../../apiConfig';
import { IoHome } from "react-icons/io5";
import { ThemeContext } from '../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../ThemesFolder/JSONForCSS/JSONClasses';
import './styles/AdminHeader.css'
import { RxHamburgerMenu } from "react-icons/rx";
import axios from 'axios';
import AdminLogin from '../../Login/AdminLogin';
const AdminHeader = ({ userRole }) => {
  const { EntranceExams_Id } = useParams();
  const [entranceExam, setEntranceExam] = useState([]);
  const [image, setImage] = useState(null);
  const themeFromContext = useContext(ThemeContext);
  const [showLinks, setShowLinks] = useState(false);
const navigate=useNavigate();
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const adminHeaderNavRef=useRef(null);
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
  useEffect(() => {
    const fetchEntranceExam = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/ExamInfo/feachingentrance_exams/${EntranceExams_Id}`
        );
        console.log("Entrance Exam Data:", response.data);
        setEntranceExam(response.data);
      } catch (error) {
        console.error("Error fetching entrance exam:", error);
      }
    };
    fetchEntranceExam();
  }, [EntranceExams_Id]);

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
const handleLogOut=()=>{
  localStorage.removeItem("tiAuth")
  navigate("/adminLogin")
}
const showAdminNavBar=()=>{
  adminHeaderNavRef.current.classList.toggle("navHeaderAdmin");

}
  return (
    // <div>
    //   <div className={`adminHeaderParentContainer _dFlex`} ref={adminHeaderNavRef}>
    //     <div className={`adminHeaderSubContainer _dFlex _fBetween`}>
    //       {/* <div></div> */}
    //       <div className='adminHeaderLogoImgContainer'>
    //         {image ? (
    //           <Link to="/">
    //             <img
    //               src={image}
    //               className={``}
    //               alt="Current"
    //             />
    //           </Link>
    //         ) : userRole === 'user' ? (
    //           <p>Unable to load image at the moment. Please try again later.</p>
    //         ) : userRole === 'admin' ? (
    //           <p>No image available. Please upload an image.</p>
    //         ) : (
    //           <p>No image available. Please contact support if this issue persists.</p>
    //         )}</div>
    //       <div className={` _fBetween adminHeaderNavLinks ${showLinks? "menu-link mobileMenuLink " : "menu-link "}`}>
    //         <Link to='/WebsiteAdmin'>Website Admin</Link>
    //         <Link to='/CourseAdmin'>Course Admin</Link>
    //         <Link to='/adminProfile'>Profile</Link>
    //         <Link to={`/`}><IoHome />Home</Link>
    //         <button onClick={handleLogOut}> LogOut</button>
    //       </div>
    //       <button 
    //           className="adminHeaderNavBtn  adminHeaderhamburgerMenu"
    //           // onClick={() => {
    //           //   setShowLinks(!showLinks);
    //           //   console.log(showLinks, "this is from onclick of hMenu");
    //           // }}
    //           onClick={showAdminNavBar}
    //         >
    //           {" "}
    //           <RxHamburgerMenu />
    //         </button>

    //     </div>
    //   </div>
    // </div>
    <div className='adminWithW80 _fBetween'>
    <div className={`adminHeaderPC _dFlex`} >
      <div className={`adminHeaderSC _dFlex _fBetween`}>
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
          )}</div>
        <div  ref={adminHeaderNavRef} className='adminHeaderNavToToggle'>
          <Link to='/WebsiteAdmin'>Website Admin</Link>
          <Link to='/CourseAdmin'>Course Admin</Link>
          <Link to='/adminProfile'>Profile</Link>
          <Link to={`/`} className='homeWithIconAH'><IoHome />Home</Link>
          <button onClick={handleLogOut} className='logOutButton'> LogOut</button>
        </div>
        <button 
            className="adminHeaderNavRefBtn  adminHeaderNavRefBtnClose"
            onClick={showAdminNavBar}
          >
            {" "}
            <RxHamburgerMenu />
          </button>

      </div>
    </div>
  </div>
  )
}

export default AdminHeader