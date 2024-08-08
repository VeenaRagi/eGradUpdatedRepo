import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../../../apiConfig';
import axios from 'axios';
import { RxHamburgerMenu } from "react-icons/rx";
import '../../../../styles/WhyChooseUsStyles/Theme2WCU.css'
import { Link as ScrollLink } from 'react-scroll';
// import { ThemeContext } from '@emotion/react';
import { Link } from 'react-router-dom';
// import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';

import CoursePageHeaderEdit from './CoursePageHeaderEdit';
import '../../../../styles/CoursesPageStyles/CoursePageResponsiveHeader.css'
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
const CourseHeader2 = ({ isEditMode, userRole,Branch_Id }) => {
    const [image, setImage] = useState(null);
    const [showLinks, setShowLinks] = useState(false);
    const navigate = useNavigate();
    const navRef = useRef();
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
    const showNavBar = () => {
        navRef.current.classList.toggle("responsiveCourseNav")
    }



    // const renderNavItemInCoursePage = (headeritem) => {
    //     // Check if the link should scroll or redirect
    //     const isInternalLink = headeritem.HeaderItemLink.startsWith('PoopularCourses') || headeritem.HeaderItemLink.startsWith('WhyChooseUs');

    //     if (isInternalLink) {
    //         // Internal link for scrolling
    //         return (
    //             <ScrollLink to={headeritem.HeaderItemLink} smooth={true} duration={100}>
    //                 {headeritem.HeaderItemName}
    //             </ScrollLink>
    //         );
    //     } else {
    //         // External link for navigation
    //         return (
    //             <span onClick={() => navigate(headeritem.HeaderItemLink)}>
    //                 {headeritem.HeaderItemName}
    //             </span>
    //         );
    //     }
    // };


    const renderNavItemInCoursePage = (headeritem, Branch_Id) => {
        const isInternalLink = headeritem.HeaderItemLink.startsWith('PoopularCourses') || headeritem.HeaderItemLink.startsWith('WhyChooseUs');
    
        if (isInternalLink) {
            return (
                <ScrollLink to={headeritem.HeaderItemLink} smooth={true} duration={100}>
                    {headeritem.HeaderItemName}
                </ScrollLink>
            );
        } else {
            const externalLink = Branch_Id ? `${headeritem.HeaderItemLink}?Branch_Id=${Branch_Id}` : headeritem.HeaderItemLink;
            return (
                <span onClick={() => navigate(externalLink)}>
                    {headeritem.HeaderItemName}
                </span>
            );
        }
    };

    const themeFromContext = useContext(ThemeContext);

    const themeColor = themeFromContext[0]?.current_theme;
    const themeDetails = JSONClasses[themeColor] || [];
    return (
        <div className={` ${themeDetails.themeCourseNavHeader}`}>
            {/* logo to be shown in all devices */}
            <div className={` ${themeDetails.themeCPLogoImgC}`}>
                <div className={`${themeDetails.themeCPLogoSubContainer}`}>
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
                    <p>There is no data available. Please add the data.</p>
                ) : (
                    <p>No image available. Please contact support if this issue persists.</p>
                )}
                </div>
            </div>
            {/* ------------------- */}
            {/* for editing the data  */}
            <div>
                {isEditMode && (
                    <div>
                        <button onClick={() => setShowHeaderMenuForm(!showHeaderMenuForm)}>
                            Add Menu
                        </button>
                        {showHeaderMenuForm && <CoursePageHeaderEdit type="HeaderMenu" />}
                    </div>
                )}
            </div>
            {/* this should be hidden at mobile width and should be shown upon click  */}
            <nav className={`navDiv`} ref={navRef}>
            <p>{Branch_Id}</p>
                <ul className={`ulDiv ${themeDetails.themeulCPDiv}`}>
                    {headers.length > 0 ? (
                        headers.map((headeritem) => (
                            <li key={headeritem.HeaderItem_Id}>
                                {renderNavItemInCoursePage(headeritem,Branch_Id)}
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
                {/* <button className='navButton navButtonClose' onClick={showNavBar}><IoMdClose /></button> */}
            </nav>
            <button className='navButton' onClick={showNavBar}>
                <IoMenu />
            </button>

        </div>
    );
};
export default CourseHeader2