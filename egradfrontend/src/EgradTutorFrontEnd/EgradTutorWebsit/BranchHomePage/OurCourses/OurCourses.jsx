import React, { useState, useEffect, useContext } from 'react'
import OurCoursesEdit from './OurCoursesEdit'
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import BASE_URL from '../../../../apiConfig';
import { ThemeContext } from '../../../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../../../ThemesFolder/JSONForCSS/JSONClasses';
import { FaArrowRight } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import '../BranchHomeStyles/BranchHomePages.css'
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { TiPin } from "react-icons/ti";
const OueCourses = ({ isEditMode }) => {
  const { Branch_Id } = useParams();
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [courseFeatures, setCourseFeatures] = useState([]);
  const themeFromContext = useContext(ThemeContext);
  const refreshChannel = new BroadcastChannel("refresh_channel");
  // Listen for messages from other pages
  refreshChannel.onmessage = function (event) {
    if (event.data === "refresh_page") {
      window.location.reload(); // Reload the page
    }
  };
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")


  const handleAddFeaturesClick = () => {
    setShowFeatureForm(!showFeatureForm);
  };

  useEffect(() => {
    fetchCourseFeatures();
  }, []);
  const fetchCourseFeatures = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/OueCourses/course_features_with_images/${Branch_Id}`
      );

      // Map over each feature and create image URLs
      const featuresWithImages = response.data.map((feature) => {
        if (feature.image) {
          // Set image URL if available
          return {
            ...feature,
            image: feature.image,
          };
        } else {
          return feature;
        }
      });

      // Set the features with image URLs
      setCourseFeatures(featuresWithImages);
    } catch (error) {
      console.error("Error fetching course features:", error);
      // setError(error.message);
    }
  };
  return (

    <div className={`${themeDetails.themeOurCoursesContainer}`}>
      <div>
        {isEditMode && (
          <div>
            <button onClick={handleAddFeaturesClick}>
              {showFeatureForm ? "Close Feature Form" : "Add Features"}
            </button>
            {showFeatureForm && <OurCoursesEdit type="AddFeatures" />}
          </div>
        )}
      </div>
      {themeColor === 'Theme-1' ? <div className={`${themeDetails.themeCoursesHeaddings}`}>
        <div>
          {isEditMode && (
            <div>
              <button onClick={handleAddFeaturesClick}>
                {showFeatureForm ? "Close Feature Form" : "Add Features"}
              </button>
              {showFeatureForm && <OurCoursesEdit type="AddFeatures" />}
            </div>
          )}
        </div>
        <div class="wrapper ten">
        <div>
            <h3 class="bounce">
                <span>O</span>
                <span>U</span>
                <span>R</span>
                <span className='SPAN'> </span>
                <span>C</span>
                <span>O</span>
                <span>U</span>
                <span>R</span>
                <span>S</span>
                <span>E</span>
                <span>S</span>
            </h3>
        </div>
    </div>
        {/* <h2 id="Our_Courses_heading">OurCourses</h2> */}
        <div className={`${themeDetails.themeCoursesSubContainers}`}>
          <ul className={`${themeDetails.themeCoursesUls}`} >
            {courseFeatures.map((feature, index) => (
              <li key={index} className={`${themeDetails.themeCourseLis}`}>
                <div className={`${themeDetails.themeCourseNamess}`}>
                  <strong className={`${themeDetails.themePortalNamess}`}>{feature.Portale_Name}</strong>
                </div>
                <div className={`${themeDetails.themeExtraPCForFeaturess}`}>
                  <div className={`${themeDetails.themeFeaturesContainers}`}>
                    <h3 className={`${themeDetails.themeFeaturesHeadings}`}><FaArrowRightFromBracket />
                      Features</h3>
                    {feature.Features.map((feature, index) => (
                      <div className={`${themeDetails.themeArrowWithFeaturess}`}>

                        <li key={index} className={`${themeDetails.themeFeaturess}`}> <TiPin />{feature}</li>
                      </div>
                    ))}
                  </div>
                  <div className={`${themeDetails.themeExamsNamess}`}>
                    {feature.EntranceExams_name.map((item, index) => (
                      <Link key={index}
                        to={`/ExamHomePage/${feature.EntranceExams_Id}`}
                      > {item}</Link>
                    ))}
                  </div>

                  <div className={`${themeDetails.themeFeaturesSecondContainers}`}>
                    {feature.image && (
                      <div className={`${themeDetails.themeFeatureImgCs}`}>
                        <img src={feature.image} alt={`${feature.Portale_Name}`} />
                      </div>
                    )}
                  </div>


                </div>
              </li>
            ))}
          </ul>
        </div>

      </div> :
        <div className={`${themeDetails.themeCoursesHeadding}`}>
          {themeColor === 'Theme-2' ?
            <h2 id="Our_Courses_heading" className="ribbon-2">OurCourses</h2>
            :
            <h2 id="Our_Courses_heading">OurCourses</h2>
          }
          <div className={`${themeDetails.themeCoursesSubContainer}`}>
            {/* <h3 >Course Features:</h3> */}
            <ul className={`${themeDetails.themeCoursesUl}`} >
              {courseFeatures.map((feature, index) => (

                <li key={index} className={`${themeDetails.themeCourseLi}`}>
                  <div className={`${themeDetails.themeCoursePortalNameImageContainer}`}>

                    <div className={`${themeDetails.themeCourseName}`}>
                      <strong className={`${themeDetails.themePortalName}`}>{feature.Portale_Name}</strong>
                    </div>
                    {/* for buttons of exams names */}
                    <div className={`${themeDetails.themeFeaturesSecondContainer}`}>
                      {/* Render image if available */}
                      {feature.image && (
                        <div className={`${themeDetails.themeFeatureImgC}`}>
                          <img src={feature.image} alt={`${feature.Portale_Name}`} />
                        </div>
                      )}
                    </div>
                  </div>
                  {themeColor === 'Theme-1' ?
                    <div className={`${themeDetails.themeExtraPCForFeatures}`}>

                      <div className={`${themeDetails.themeFeaturesContainer}`}>
                        <h3 className={`${themeDetails.themeFeaturesHeading}`}>Features</h3>
                        {feature.Features.map((feature, index) => (
                          <div className={`${themeDetails.themeArrowWithFeatures}`}>
                            {themeColor === 'Theme-2' &&
                              <div className='arrow'><TiTick /> </div>}
                            <li key={index} className={`${themeDetails.themeFeatures}`}> {feature}</li>
                          </div>
                        ))}
                      </div>
                      <div className={`${themeDetails.themeExamsNames}`}>
                        {feature.EntranceExams_name.map((item, index) => (
                          <Link key={index}
                            to={`/ExamHomePage/${feature.EntranceExams_Id}`}
                          > {item}</Link>
                        ))}
                      </div>
                    </div>
                    :
                    <><div className={`${themeDetails.themeFeaturesContainer}`}>
                      <h3 className={`${themeDetails.themeFeaturesHeading}`}>Features</h3>
                      {feature.Features.map((feature, index) => (
                        <div className={`${themeDetails.themeArrowWithFeatures}`}>
                          {themeColor === 'Theme-2' &&
                            <div className='arrow'><TiTick /> </div>}
                          <li key={index} className={`${themeDetails.themeFeatures}`}> {feature}</li>
                        </div>
                      ))}
                    </div>
                      <div className={`${themeDetails.themeExamsNames}`}>
                        {feature.EntranceExams_name.map((item, index) => (
                          <Link key={index}
                            to={`/ExamHomePage/${feature.EntranceExams_Id}`}
                          > {item}</Link>
                        ))}
                      </div>
                    </>


                  }
                </li>
              ))}
            </ul>
          </div>

        </div>
      }
    </div>

  )
}

export default OueCourses