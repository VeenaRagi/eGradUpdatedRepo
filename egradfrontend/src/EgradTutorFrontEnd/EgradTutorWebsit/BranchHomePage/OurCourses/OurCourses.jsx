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
const OueCourses = ({ isEditMode, userRole}) => {
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
          {courseFeatures.length > 0 ? (
        courseFeatures.map((feature, index) => (
          <li key={index} className={`${themeDetails.themeCourseLis}`}>
            <div className={`${themeDetails.themeCourseNamess}`}>
              <strong className={`${themeDetails.themePortalNamess}`}>
                {feature.Portale_Name}
              </strong>
            </div>
            <div className={`${themeDetails.themeExtraPCForFeaturess}`}>
              <div className={`${themeDetails.themeFeaturesContainers}`}>
                <h3 className={`${themeDetails.themeFeaturesHeadings}`}>
                  <FaArrowRightFromBracket />
                  Features
                </h3>
                {feature.Features.map((featureItem, featureIndex) => (
                  <div key={featureIndex} className={`${themeDetails.themeArrowWithFeaturess}`}>
                    <li className={`${themeDetails.themeFeaturess}`}>
                      <TiPin />
                      {featureItem}
                    </li>
                  </div>
                ))}
              </div>
              <div className={`${themeDetails.themeExamsNamess}`}>
                {feature.EntranceExams_name.map((item, examIndex) => (
                  <Link key={examIndex} to={`/ExamHomePage/${feature.EntranceExams_Id}`}>
                    {item}
                  </Link>
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
        ))
      ) : userRole === 'user' ? (
        <p>No course features available at the moment. Please check back later.</p>
      ) : userRole === 'admin' ? (
        <p>There are no course features available. Please add the necessary features.</p>
      ) : (
        <p>No course features available. Please contact support if this issue persists.</p>
      )}
          </ul>
        </div>

      </div> :
        <div className={`${themeDetails.themeCoursesHeadding}`}>
          {themeColor === 'Theme-2' ?
            <h2 id="Our_Courses_heading" className="ribbon-2">OUR COURSES</h2>
            :
            <h2 id="Our_Courses_heading">OUR COURSES</h2>
          }
          <div className={`${themeDetails.themeCoursesSubContainer}`}>
            {/* <h3 >Course Features:</h3> */}
            <ul className={`${themeDetails.themeCoursesUl}`} >
            {courseFeatures.length > 0 ? (
        courseFeatures.map((feature, index) => (
          <li key={index} className={`${themeDetails.themeCourseLi}`}>
            <div className={`${themeDetails.themeCoursePortalNameImageContainer}`}>
              <div className={`${themeDetails.themeCourseName}`}>
                <strong className={`${themeDetails.themePortalName}`}>
                  {feature.Portale_Name}
                </strong>
              </div>
              {/* Render image if available */}
              {feature.image && (
                <div className={`${themeDetails.themeFeatureImgC}`}>
                  <img src={feature.image} alt={`${feature.Portale_Name}`} />
                </div>
              )}
            </div>
            {themeColor === 'Theme-1' ? (
              <div className={`${themeDetails.themeExtraPCForFeatures}`}>
                <div className={`${themeDetails.themeFeaturesContainer}`}>
                  <h3 className={`${themeDetails.themeFeaturesHeading}`}>Features</h3>
                  {feature.Features.map((featureItem, index) => (
                    <div key={index} className={`${themeDetails.themeArrowWithFeatures}`}>
                      {themeColor === 'Theme-2' && <div className='arrow'><TiTick /> </div>}
                      <li className={`${themeDetails.themeFeatures}`}>{featureItem}</li>
                    </div>
                  ))}
                </div>
                <div className={`${themeDetails.themeExamsNames}`}>
                  {feature.EntranceExams_name.map((item, index) => (
                    <Link key={index} to={`/ExamHomePage/${feature.EntranceExams_Id}`}>
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className={`${themeDetails.themeFeaturesContainer}`}>
                  <h3 className={`${themeDetails.themeFeaturesHeading}`}>Features</h3>
                  {feature.Features.map((featureItem, index) => (
                    <div key={index} className={`${themeDetails.themeArrowWithFeatures}`}>
                      {themeColor === 'Theme-2' && <div className='arrow'><TiTick /> </div>}
                      <li className={`${themeDetails.themeFeatures}`}>{featureItem}</li>
                    </div>
                  ))}
                </div>
                <div className={`${themeDetails.themeExamsNames}`}>
                  {feature.EntranceExams_name.map((item, index) => (
                    <Link key={index} to={`/ExamHomePage/${feature.EntranceExams_Id}`}>
                      {item}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </li>
        ))
      ) : userRole === 'user' ? (
        <p>No course features are available at the moment. Please check back later.</p>
      ) : userRole === 'admin' ? (
        <p>No course features found. Please add the necessary course features.</p>
      ) : (
        <p>No course features available. Please contact support if this issue persists.</p>
      )}
            </ul>
          </div>

        </div>
      }
    </div>

  )
}

export default OueCourses