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

const LandingPageHeader = ({ isEditMode, userRole }) => {
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [welcomeimage, setWelcomeImage] = useState(null);
  const [welcomeDataList, setWelcomeDataList] = useState([]);
  const [showwelcomeForm, setShowWelcomeForm] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const themeFromContext = useContext(ThemeContext);
  const [error, setError] = useState(false);

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
      setError(true); // Set error state to true on failure
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

        <div
          className={`Newlandingpage_logocontainer ${themeDetails.themeHeaderColor}`}
        >
          <div
            className={`Newlandingpage_logosubcontainer ${themeDetails.themeSubContainer}`}
          >
            <div className={`logo_Img_container ${themeDetails.themeLogoImgC}`}>
              {error ? (
                userRole === "user" ? (
                  <p>
                    Unable to load image at the moment. Please try again later.
                  </p>
                ) : userRole === "admin" ? (
                  <p>There is no data available. Please add the data.</p>
                ) : (
                  <p>Unable to load image at the moment.</p>
                )
              ) : (
                image && (
                  <Link to="/">
                    <img
                      src={image}
                      className={`${themeDetails.themeLogoImg}`}
                      alt="Current"
                    />
                  </Link>
                )
              )}

              <div className={`logoImgContainer ${themeDetails.logoC}`}></div>
            </div>
            {isEditMode && (
              <div>
                <button className="button" onClick={() => setShowImage(!showImage)}>
                  {/* {showImage ? "Close" : "Add Logo"} */}Add Logo
                </button>
                {showImage && <LandingPageHeaderEdit type="addLogo" />}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div
          className={`landing_content_div_container ${themeDetails.themeLandingParentContainer}`}
        >
          <div className={`landing_img_div ${themeDetails.themeLCapImgDiv}`}>
            {/* {welcomeimage ? (
              <img src={welcomeimage} alt="welcomeCurrent" />
            ) : (
              <Maintenance1 />
            )} */}

            {welcomeimage ? (
              <img src={welcomeimage} alt="welcomeCurrent" />
            ) : userRole === "admin" ? (
              <p>There is no data available. Please add the data.</p>
            ) : (
              <p>Unable to load image at the moment. Please try again later.</p>
            )}

          </div>
          <div
            className={`landing_heading_div_container ${themeDetails.themeCapTextContainer}`}
          >
            <div className={`${themeDetails.themeTextContainer}`}>
              {welcomeDataList.length > 0 ? (
                welcomeDataList.map((welcomeData) => (
                  <div key={welcomeData.welcome_id}>
                    <h1>{welcomeData.welcome_text}</h1>
                    <p>{welcomeData.welcome_longtext}</p>
                  </div>
                ))
              ) : (
                <div>
                  {userRole === "user" ? (
                    <p>
                      Unable to load the data at the moment. Please try again
                      later.
                    </p>
                  ) : userRole === "admin" ? (
                    <p>No data found. Please add the data to the system.</p>
                  ) : (
                    <p>There is no data available. Please add the data.</p>
                  )}
                </div>
              )}
            </div>
            {isEditMode && (
              <div>
                <button className="toggle-button-container" onClick={() => setShowWelcomeForm(!showwelcomeForm)}>
                  {/* {showwelcomeForm ? "X" : "Add Welcome info"} */}Add Welcome info
                </button>
                {showwelcomeForm && <LandingPageHeaderEdit type="WelcomeForm" />}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageHeader;
