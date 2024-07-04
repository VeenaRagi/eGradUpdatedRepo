import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig.js";
import axios from "axios";
import defaultImage from "../../../../assets/defaultImage.png";
import defaultLogoImage from "../../../../assets/egradtutor_logo.png";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context.js";
import LandingPageHeaderEdit from "./LandingPageHeaderEdit";
import "../../../../styles/Default_landingPage_styles.css";
import "../../../../styles/Theme1_landingPage_styles.css";
import "../../../../styles/Theme2_landingPage_styles.css";
import "../../../../styles/LandingPage_main.css";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses.js";
import { Link } from "react-router-dom";
import Maintenance1 from "../../../MaintenanceMode/Maintenance1.js";

const LandingPageHeader = ({ isEditMode }) => {
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [welcomeimage, setWelcomeImage] = useState(null);
  const [welcomeDataList, setWelcomeDataList] = useState([]);
  const [showwelcomeForm, setShowWelcomeForm] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const themeFromContext = useContext(ThemeContext);

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

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageHeader/welcome`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWelcomeDataList([data]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(true);
    }
  };

  const fetchWelcomeImage = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/LandingPageHeader/welcomeimage`,
        {
          responseType: "arraybuffer",
        }
      );
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setWelcomeImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchImage();
    fetchData();
    fetchWelcomeImage();
  }, []);

  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];

  return (
    <div className="Newlandingpage">
      <div>
        {isEditMode && (
          <div>
            <button onClick={() => setShowImage(!showImage)}>
              {showImage ? "Close" : "Add Logo"}
            </button>
            {showImage && <LandingPageHeaderEdit type="addLogo" />}
          </div>
        )}
        <div
          className={`Newlandingpage_logocontainer ${themeDetails.themeHeaderColor}`}
        >
          <div
            className={`Newlandingpage_logosubcontainer ${themeDetails.themeSubContainer}`}
          >
            <div className={`logo_Img_container ${themeDetails.themeLogoImgC}`}>
            {image ? (
  <Link to="/">
    <img
      src={image}
      className={`${themeDetails.themeLogoImg}`}
      alt="Current"
    />
  </Link>
) : null}

              <div className={`logoImgContainer ${themeDetails.logoC}`}></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {isEditMode && (
          <div>
            <button onClick={() => setShowWelcomeForm(!showwelcomeForm)}>
              {showwelcomeForm ? "Close" : "Add Welcome info"}
            </button>
            {showwelcomeForm && <LandingPageHeaderEdit type="WelcomeForm" />}
          </div>
        )}
        <div
          className={`landing_content_div_container ${themeDetails.themeLandingParentContainer}`}
        >
          <div className={`landing_img_div ${themeDetails.themeLCapImgDiv}`}>
            {welcomeimage ? (
              <img src={welcomeimage} alt="welcomeCurrent" />
            ) : (
              <Maintenance1 />
            )}
          </div>
          <div
            className={`landing_heading_div_container ${themeDetails.themeCapTextContainer}`}
          >
            <div className={`${themeDetails.themeTextContainer}`}>
              {fetchError ? (
                <div>
                  {/* <h1>Error fetching welcome data.</h1>
                  <p>Please try again later.</p> */}
                </div>
              ) : welcomeDataList.length > 0 ? (
                welcomeDataList.map((welcomeData) => (
                  <div key={welcomeData.welcome_id}>
                    <h1>{welcomeData.welcome_text}</h1>
                    <p>{welcomeData.welcome_longtext}</p>
                  </div>
                ))
              ) : (
                <div>
                  {/* <h1>No welcome data available.</h1>
                  <p>Please add welcome information.</p> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageHeader;
