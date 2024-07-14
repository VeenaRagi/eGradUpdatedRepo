import React, { useState, useEffect, useContext } from 'react';
import WhychooseUsEdit from './WhychooseUsEdit';
import BASE_URL from "../../../../apiConfig";
import '../../../../styles/WhyChooseUsStyles/ThemeDefaultWCU.css';
import '../../../../styles/WhyChooseUsStyles/Theme1WCU.css';
import '../../../../styles/WhyChooseUsStyles/Theme2WCU.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";

const WhyChooseUs = ({ isEditMode, userRole }) => {
  const [whyChooseUsItems, setWhyChooseUsItems] = useState([]);
  const [showTabButtonForm, setShowTabButtonForm] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState(null);
  const [courseTabButtonNames, setCourseTabButtonNames] = useState([]);
  const [selectedTabContent, setSelectedTabContent] = useState(null);
  const { Portale_Id } = useParams();
  const themeFromContext = useContext(ThemeContext);

  useEffect(() => {
    const fetchWhyChooseUsData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/WhychooseUsEdit/getWhyChooseUsItems`);
        const data = await response.json();
        setWhyChooseUsItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchWhyChooseUsData();
  }, []);

  useEffect(() => {
    fetchCourseTabButtonNames();
  }, [Portale_Id]);

  const fetchCourseTabButtonNames = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courseTab/getCourseTabButtonDetails/${Portale_Id}`);
      setCourseTabButtonNames(response.data);
    } catch (error) {
      console.error("Error while getting course tab names", error);
    }
  };

  const handleTabCClick = (tab) => {
    setSelectedTabId(tab.course_tab_title);
    setSelectedTabContent(tab);
  };

  // Default tab displaying
  useEffect(() => {
    if (courseTabButtonNames.length > 0) {
      const firstPortal = courseTabButtonNames[0];
      const firstTab = firstPortal.tabs[0];
      setSelectedTabId(firstTab.course_tab_title);
      setSelectedTabContent(firstTab);
    }
  }, [courseTabButtonNames]);

  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch images from the API
        const response = await axios.get(`${BASE_URL}/courseTab/getCourseTabImage`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching course tab images:', error);
      }
    };

    fetchImages();
  }, []);
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className={`${themeDetails.themeTabsDivMainContainer}`} >
      <div className={`${themeDetails.themeTabsDiv}`}>
        <div className={`${themeDetails.themeTabsSubContainer}`}>
          {isEditMode && (
            <div className={` ${themeDetails.themeTabsButtonContainer}`}>
              <button onClick={() => setShowTabButtonForm(!showTabButtonForm)}>
                {showTabButtonForm ? "Close" : "Add Tabs For Portals"}
              </button>
              {showTabButtonForm && <WhychooseUsEdit type="tabButtonForm" />}
            </div>
          )}
          <ul className={`tabButtonUl ${themeDetails.themeTabButtonUl}`}>
            {courseTabButtonNames.length > 0 ? (
              courseTabButtonNames.flatMap(portal =>
                portal.tabs.map(tab => (
                  <li key={tab.course_tab_title}>
                    <div className={`${themeDetails.themeTabsChange}`}>
                      <button
                        onClick={() => handleTabCClick(tab)}
                        className={tab.course_tab_title === selectedTabId ? 'selectedButton' : 'notSelectedButton'}
                      >
                        {tab.course_tab_title}
                      </button>
                    </div>
                  </li>
                ))
              )
            ) : userRole === 'user' ? (
              <p>No tabs are available at the moment. Please check back later.</p>
            ) : userRole === 'admin' ? (
              <p>No tabs are available. Please add the necessary tabs.</p>
            ) : (
              <p>No tabs are available. Please contact support if this issue persists.</p>
            )}
          </ul>
          {selectedTabContent && (
            <div className={`${themeDetails.themeSelectedTabContentDiv}`}>
              <div className={` ${themeDetails.themeTabDetailsDiv}`}>
                <div className={` ${themeDetails.themeTabDetailsSubDiv}`}>
                  <div className={` ${themeDetails.themeTabImageDiv}`}>
                    {images.length > 0 ? (
                      images.map((image) => (
                        <div key={image.course_tab_id}>
                          <h2>Course Tab ID: {image.course_tab_id}</h2>
                          <div style={{height:"100px" ,width:"100px"}}>
                          {image.course_tab_image ? (
                            <img src={image.course_tab_image} alt={`Course Tab ${image.course_tab_id}`} />
                          ) : (
                            <p>No image available</p>
                          )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No images found.</p>
                    )}
                    {/* <img src={`data:image/png;base64,${selectedTabContent.course_tab_image}`} alt="Tab content" /> */}
                  </div>
                  <div className={`${themeDetails.themeCardsToBeFlexed}`}>
                    <div className={`${themeDetails.themeTabContentSplittedText}`}>
                      {selectedTabContent.course_tab_text.map((text, index) => (
                        <div className={`${themeDetails.themeTabContentSplittedTextInDiv}`} key={index}>
                          <p> <span><VscDebugBreakpointLog /></span>
                            {text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
