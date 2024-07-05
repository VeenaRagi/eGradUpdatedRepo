import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import BASE_URL from "../../../../apiConfig";
import { useParams, Link } from 'react-router-dom'
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses.js";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context.js";
import { FaArrowRight } from "react-icons/fa6";
import '../../../../styles/UGHomePage/ugHomePageTheme1.css'
import girl_img from'../../../../styles/Girl.png'
const ExamCourse = ({userRole}) => {
  const { EntranceExams_Id,Branch_Id } = useParams();
  const [portaldata, setPortalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const themeFromContext = useContext(ThemeContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ExampagePortals/examPortal/${EntranceExams_Id}`);
        setPortalData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [EntranceExams_Id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];
  return (
    <div className={`exam_courses_container ${themeDetails.themeExamCoursesContainer}`}>
     
      <div className={`exam_courses_sub_container ${themeDetails.themeExamCoursesSubContainer}`}>
      {/* <h1 className={`exam_courses_name_heading ${themeDetails.themeExamCoursesNameHeading}`}></h1> */}
      <ul>
      {portaldata.length > 0 ? (
        portaldata.map(item => (
          <div key={item.Portale_Id} className={`portal_names ${themeDetails.themePortalNames}`}>
            <li>
              <h2>{item.Portale_Name}</h2>
              {themeColor === "Theme-1" ? <hr /> : null}
              <div className={` ${themeDetails.themeExamPortalImgDivInCard}`}>
                <img src={girl_img} alt="Portal" />
              </div>
              <div className={`exam_portal_btn ${themeDetails.themeExamPortalBtn}`}>
                <Link to={`/CoursePage/${item.Branch_Id}/${item.Portale_Id}`} target="_blank">
                  {item.button} Explore <FaArrowRight />
                </Link>
              </div>
            </li>
          </div>
        ))
      ) : userRole === 'user' ? (
        <p>No portal data available at the moment. Please check back later.</p>
      ) : userRole === 'admin' ? (
        <p>No portal data available. Please add the required portal information.</p>
      ) : (
        <p>No portal data available. Please contact support if this issue persists.</p>
      )}
      </ul>
      </div>
    </div>
  )
}

export default ExamCourse