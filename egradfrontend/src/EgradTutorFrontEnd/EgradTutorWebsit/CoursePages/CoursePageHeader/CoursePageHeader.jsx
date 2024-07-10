import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../../apiConfig";
import defaultImage from "../../../../assets/defaultImage.png";
import { Link } from "react-router-dom";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses.js";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context.js";
import CoursePageHeaderEdit from "./CoursePageHeaderEdit.jsx";
import '../../../../styles/CoursePage/CoursePageDefault.css'
import '../../../../styles/CoursesPageStyles/themeWhite.css';
import { RiLoginBoxLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import '../../../../styles/WhyChooseUsStyles/Theme2WCU.css'

const CoursePageHeader = ({ isEditMode, userRole}) => {
  const [image, setImage] = useState(null);
  const [showLinks, setShowLinks] = useState(false);

  const [showHeaderMenuForm, setShowHeaderMenuForm] = useState(false);
  const [headers, setHeaders] = useState([]);
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
    fetchHeaderData();
  }, []);

  const fetchHeaderData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/CoursePageHeaderEdit/getHeaderItems`
      );
      const data = await response.json();
      setHeaders(data);
    } catch (error) {
      console.error("Error fetching header items:", error);
    }
  };

  const themeFromContext = useContext(ThemeContext);
  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];
  return (
    <div className={`CoursePage_header_Container ${themeDetails.CoursePageHeaderContainer}`}>
      <div className={`logo_Img_container ${themeDetails.themeLogoImgC}`}>
       {image ? (
        <Link to="/">
          <img
            src={image}
            className={`${themeDetails.themeLogoImg}`}
            alt="Current"
          />
        </Link>
      ) : userRole === 'user' ? (
        <p>Unable to load image at the moment. Please try again later.</p>
      ) : userRole === 'admin' ? (
        <p>There is no data available. Please add the data.</p>
      ) : (
        <p>No image available. Please contact support if this issue persists.</p>
      )}
        <div 
        className={`logoImgContainer ${themeDetails.logoC}`}
        
        ></div>
      </div>
      <div>
        {isEditMode && (
          <div>
            <button onClick={() => setShowHeaderMenuForm(!showHeaderMenuForm)}>
              {showHeaderMenuForm ? "Close" : "Add Menu"}
            </button>
            {showHeaderMenuForm && <CoursePageHeaderEdit type="HeaderMenu" />}
          </div>
        )}
      </div>
      <div 
      className={`${showLinks?"menu-link mobileMenuLink":"menu-link"} CoursePageItemsContainer ${themeDetails.themeCoursePageHeaderContainer} `}>
        <ul className={`courseHeaderUl ${themeDetails.themeCPHeaderUl} `}>
        {headers.length > 0 ? (
        headers.map((headeritem) => (
          <li key={headeritem.HeaderItem_Id}>
            <Link to={headeritem.HeaderItemLink}>
              {headeritem.HeaderItemName}
            </Link>
          </li>
        ))
      ) : userRole === 'user' ? (
        <p>No items available at the moment. Please check back later.</p>
      ) : userRole === 'admin' ? (
        <p>No items available. Please add the required items.</p>
      ) : (
        <p>No items available. Please contact support if this issue persists.</p>
      )}

        </ul>
      </div>
      <div
        className="hamburgerMenu courseHMenu"
        onClick={() => {
          setShowLinks(!showLinks);
          console.log(showLinks, "this is from onclick of hMenu");
        }}
      >
        <RxHamburgerMenu />
      </div>
    </div>
  );
};
export default CoursePageHeader;
