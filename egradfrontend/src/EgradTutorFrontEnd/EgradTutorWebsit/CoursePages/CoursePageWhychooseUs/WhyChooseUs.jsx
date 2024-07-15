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
  const [uniqueTitles, setUniqueTitles] = useState([]);

  useEffect(() => {
    if (courseTabButtonNames.length > 0) {
      // Extract unique course_tab_title values
      const titlesSet = new Set(courseTabButtonNames.map(tab => tab.course_tab_title));
      setUniqueTitles(Array.from(titlesSet));
    }
  }, [courseTabButtonNames]);

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
      console.log(courseTabButtonNames, "eeeeeeeeee")
    } catch (error) {
      console.error("Error while getting course tab names", error);
    }
  };



  // Default tab displaying
  useEffect(() => {
    if (courseTabButtonNames.length > 0) {
      console.log(courseTabButtonNames, "buttton names")
      // const firstPortal = courseTabButtonNames[0];
      // const firstTab = firstPortal.tabs[0];
      // setSelectedTabId(firstTab.course_tab_title);
      // setSelectedTabContent(firstTab);
    }
    // Find the tab with the course_tab_title_id of 1
    const defaultTab = courseTabButtonNames.find(tab => tab.course_tab_title_id === 1);

    if (defaultTab) {
      setSelectedTabId(defaultTab.course_tab_title_id);
      setSelectedTabContent(defaultTab);
      console.log(selectedTabContent, selectedTabId)
    } else {
      // Handle the case where tab with course_tab_title_id 1 is not found
      console.error("Tab with course_tab_title_id 1 not found");
    }
  }, [courseTabButtonNames]);

  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTabData, setSelectedTabData] = useState(null);
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
  useEffect(() => {
    console.log("Selected Tab Data Updated:", selectedTabData);
  }, [selectedTabData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleButtonClick = (title) => {
    // Find the data related to the clicked title
    const relatedData = courseTabButtonNames.filter(tab => tab.course_tab_title === title);
    setSelectedTabData(relatedData);
    console.log(selectedTabData)
  };
  const handleTabCClick = (tab) => {
    setSelectedTabId(tab.course_tab_title);
    setSelectedTabContent(tab);
    // console.log(selectedTabContent,"Vvvvvvvvvvvvvvvvv")
  };
  
  return (
    <div id="WhyChooseUs" className={`${themeDetails.themeTabsDivMainContainer}`} >
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
            {uniqueTitles.map((title, index) => (
               <li key={title.course_tab_title}>
              <button key={index} onClick={() => handleButtonClick(title)}>
                {title}
              </button>
              </li>
            ))}
          </ul>
          {selectedTabContent && (
            <div className={`${themeDetails.themeSelectedTabContentDiv}`}>
              <div className={` ${themeDetails.themeTabDetailsDiv}`}>
                <div className={` ${themeDetails.themeTabDetailsSubDiv}`}>
                  <div className={` ${themeDetails.themeTabImageDiv}`}>
                    {images.length > 0 ? (
                      images.map((image) => (
                        // image.course_tab_id === selectedTabData.course_tab_title_id
                        //  &&
                          (
                          <div key={image.course_tab_id}>
                            <h2>Course Tab ID: {image.course_tab_id}and {selectedTabId}</h2>
                            <div style={{ height: "100px", width: "100px" }}>
                              {image.course_tab_image ? (
                                <img src={image.course_tab_image} alt={`Course Tab ${image.course_tab_id}`} />
                              ) : (
                                <p>No image available</p>
                              )}
                            </div>
                          </div>
                        )
                      ))
                    ) : (
                      <p>No images found.</p>
                    )}
                  </div>
                  <div className={`${themeDetails.themeCardsToBeFlexed}`}>
                    <div className={`${themeDetails.themeTabContentSplittedText}`}>
                    {selectedTabData && (
                      <>
                        {selectedTabData.map((tab, index) => (
                          <div key={index}>
                            {/* <h3>{tab.course_tab_title}</h3> */}
                            <p>{tab.course_tab_text}</p>
                            {/* <a href={tab.portalLink}>Go to Portal</a> */}
                          </div>
                        ))}
                      </>
                    )}
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
