import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "../../../../apiConfig";
import axios from "axios";
import Footer from "../../Footer/Footer";
import defaultImage from "../../../../assets/defaultImage.png";
import AboutUsEdit from "./AboutUsEdit";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import { Link } from "react-router-dom";
import capImg from "../../../../styles/AboutUsCapImg.png";
import ExamPageHeader from "../../ExamHomePage/ExamHomepageHeader/ExamPageHeader";
import "../../../../styles/AboutUs/Theme1AboutUs.css";
import "../../../../styles/AboutUs/Theme2AboutUs.css";
import { IoHome } from "react-icons/io5";
import Our_Vision_Img from "../../../../styles/Our_Mission_img.a4171ae2dd49cdc24875.png";
import aboutUsAP from "../../../../styles/AboutUSPic-removebg-preview.png";
const AboutUs = ({ isEditMode, userRole }) => {
  const [aboutUsData, setAboutUsData] = useState([]);
  const [aboutEgradData, setAboutEgradData] = useState([]);
  const [image, setImage] = useState(null);
  const [showAboutUsForm, setShowAboutUsForm] = useState(false);
  const [showAboutEgradForm, setShowAboutEgradForm] = useState(false);
  const themeFromContext = useContext(ThemeContext);

  const [welcomeimage, setWelcomeImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    fetchWelcomeImage();
    fetchAboutUsData();
    fetchAboutEgradData();
    fetchImage();
  }, []);

  const fetchAboutUsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/AboutUs/about_us`);
      setAboutUsData(response.data);
    } catch (error) {
      console.error("Error fetching About Us data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAboutEgradData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/AboutUs/about_egt`);
      setAboutEgradData(response.data);
      console.log(
        "About eGRAD Tutor data fetched successfully:",
        response.data
      );
    } catch (error) {
      console.error("Error fetching About eGRAD Tutor data:", error);
    }
  };
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss");
  const themeDetails = JSONClasses[themeColor] || [];
  console.log(themeDetails, "mapppping from json....");

  return (
    <div className="overlay">
      {themeColor === "Theme-2" && (
        <div
          className={`AboutUs_Main_Container ${themeDetails.themeAboutUsMainContainer}`}
        >
          {/* <div
            className={`contactUsImgDiv`}
          >
            {image ? (
              <Link to="/">
                <img src={image} alt="Current" />
              </Link>
            ) : userRole === "user" ? (
              <p>
                Unable to load the image at the moment. Please try again later.
              </p>
            ) : userRole === "admin" ? (
              <p>No image available. Please upload the necessary image.</p>
            ) : (
              <p>
                Unable to load the image. Please contact support if this issue
                persists.
              </p>
            )}

            <span>
              <Link to={`/`}>
                <IoHome />
                Home
              </Link>
            </span>

          </div> */}
          <div className="contactUsHeaderParentContainer">
            <div className="contactUsHeaderContainer">
              <div className={`contactUsImgContainer ${themeDetails.themeContactUsImgContainer}`}
              >
                <div className="contactUsImgDiv">
                  {image ? (
                    <Link to={`/`}>
                      <img src={image} alt="Current" />
                    </Link>
                  ) : userRole === "user" ? (
                    <p>
                      Unable to load the image at the moment. Please try again later.
                    </p>
                  ) : userRole === "admin" ? (
                    <p>No image available. Please upload the necessary image.</p>
                  ) : (
                    <p>
                      Unable to load the image. Please contact support if this issue
                      persists.
                    </p>
                  )}
                </div>
                <div className="contactUsHomeDiv">
                  <Link to={`/`}>
                    <IoHome />
                    Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`AboutUsContentMainContainer ${themeDetails.themeAUDataContainer}`}
          >
            <div className={`${themeDetails.themeAUSectionPC}`}>
              <div className={`${themeDetails.themeAUSection1}`}>
                <div className={`${themeDetails.themeAboutUsImgWithTextDiv}`}>
                  <div className={`${themeDetails.themeAUHeadingContainer}`}>
                    <h1>About Us</h1>
                  </div>
                  <div className={`${themeDetails.themeAUCapImgDiv}`}>
                    {welcomeimage && <img src={welcomeimage} alt="Welcome" />}
                  </div>
                  <div
                    className={`AboutUs1stContentContainer ${themeDetails.themeAUContentContainer}`}
                  >
                    {isEditMode && (
                      <div>
                        <button
                          onClick={() =>
                            setShowAboutEgradForm(!showAboutEgradForm)
                          }
                        >
                          {showAboutEgradForm
                            ? "Close AboutEGT Form"
                            : "Add AboutEGT"}
                        </button>
                        {showAboutEgradForm && (
                          <AboutUsEdit type="aboutEgrad" />
                        )}
                      </div>
                    )}
                    {aboutEgradData.length > 0 ? (
                      aboutEgradData.map((aboutEgrad) => (
                        <div
                          key={aboutEgrad.about_egt_id}
                          className={`AboutUsImgDataContentContainer ${themeDetails.themeAUImgDataContentContainer}`}
                        >
                          <p>{aboutEgrad.about_egt}</p>
                        </div>
                      ))
                    ) : userRole === "user" ? (
                      <p>
                        No information available at the moment. Please check
                        back later.
                      </p>
                    ) : userRole === "admin" ? (
                      <p>
                        No information found. Please update the details as
                        necessary.
                      </p>
                    ) : (
                      <p>
                        No information available. Please contact support if this
                        issue persists.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`AboutUsContentSubContainer ${themeDetails.themeAUSubContainer}`}
            >
              <div
                className={`AboutUs_VisionContent_Container ${themeDetails.themeAUVisionContent}`}
              >
                {isEditMode && (
                  <div>
                    <button
                      onClick={() => setShowAboutUsForm(!showAboutUsForm)}
                    >
                      {showAboutUsForm ? "Close AboutUs Form" : "Add AboutUs"}
                    </button>
                    {showAboutUsForm && <AboutUsEdit type="aboutUs" />}
                  </div>
                )}
                {/* our vision and our mission mapping goes here */}
                {aboutUsData.length > 0 ? (
                  aboutUsData.map((aboutUs) => (
                    <div
                      key={aboutUs.about_us_id}
                      className={`AboutUsImgVisionDataContentContainer ${themeDetails.themeAUVMPC}`}
                    >
                      <div className={`${themeDetails.themeVMContainer}`}>
                        <span
                          className={`${themeDetails.themeSpanLines}`}
                        ></span>
                        <h2>{aboutUs.Title}</h2>
                        <span
                          className={`${themeDetails.themeSpanLines}`}
                        ></span>
                      </div>
                      <div className={`${themeDetails.themeVMText}`}>
                        <p>{aboutUs.Description}</p>
                      </div>
                    </div>
                  ))
                ) : userRole === "user" ? (
                  <p>
                    No information available at the moment. Please check back
                    later.
                  </p>
                ) : userRole === "admin" ? (
                  <p>
                    No data available. Please add the necessary information.
                  </p>
                ) : (
                  <p>
                    No information available. Please contact support if this
                    issue persists.
                  </p>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
      {themeColor === "Theme-1" && (
        <div
          className={`AboutUs_Main_Container ${themeDetails.themeAboutUsMainsContainer}`}
        >
          <div
            className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`}
          >
            {image ? (
              <Link to="/">
                <img src={image} alt="Current" />
              </Link>
            ) : userRole === "user" ? (
              <p>
                Unable to load the image at the moment. Please try again later.
              </p>
            ) : userRole === "admin" ? (
              <p>No image available. Please upload the necessary image.</p>
            ) : (
              <p>
                Unable to load the image. Please contact support if this issue
                persists.
              </p>
            )}

            <span>
              <Link to={`/`}>
                <IoHome />
                Home
              </Link>
            </span>

          </div>


          <div
            className={`AboutUsContentMainContainer ${themeDetails.AboutUsContentMainContainer}`}
          >
            <div className={`${themeDetails.themeAUSection1}`}>
              <div className={`${themeDetails.themeAboutUsImgWithTextDiv}`}>
                <div className={`${themeDetails.themeAUHeadingContainer}`}>
                  <h1>About Us</h1>
                  <div
                    className={`AboutUs1stContentContainer ${themeDetails.AboutUs1stContentContainer}`}
                  >
                    {isEditMode && (
                      <div>
                        <button
                          onClick={() =>
                            setShowAboutEgradForm(!showAboutEgradForm)
                          }
                        >
                          {showAboutEgradForm
                            ? "Close AboutEGT Form"
                            : "Add AboutEGT"}
                        </button>
                        {showAboutEgradForm && (
                          <AboutUsEdit type="aboutEgrad" />
                        )}
                      </div>
                    )}
                    {aboutEgradData.length > 0 ? (
                      aboutEgradData.map((aboutEgrad) => (
                        <div
                          key={aboutEgrad.about_egt_id}
                          className={`AboutUsImgDataContentContainer ${themeDetails.AboutUsImgDataContentContainer}`}
                        >
                          <p>{aboutEgrad.about_egt}</p>
                        </div>
                      ))
                    ) : userRole === "user" ? (
                      <p>
                        No information available at the moment. Please check
                        back later.
                      </p>
                    ) : userRole === "admin" ? (
                      <p>No data found. Please add or update the content.</p>
                    ) : (
                      <p>
                        No information available. Please contact support if this
                        issue persists.
                      </p>
                    )}
                  </div>
                </div>
                <div className={`${themeDetails.themeAboutusFlexDiv}`}>
                  <div className={`${themeDetails.themeAboutusFlexDivForImg}`}>
                    {welcomeimage && <img src={welcomeimage} alt="Welcome" />}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`AboutUsContentSubContainer ${themeDetails.AboutUsContentSubContainer}`}
            >
              <div
                className={`AboutUs_VisionContent_Container ${themeDetails.AboutUsVisionContentContainer}`}
              >
                {isEditMode && (
                  <div className={`our_vision ${themeDetails.AboutOurVisioin}`}>
                    <button
                      onClick={() => setShowAboutUsForm(!showAboutUsForm)}
                    >
                      {showAboutUsForm ? "Close AboutUs Form" : "Add AboutUs"}
                    </button>
                    {showAboutUsForm && <AboutUsEdit type="aboutUs" />}
                  </div>
                )}

                {aboutUsData.length > 0 ? (
                  aboutUsData.map((aboutUs) => (
                    <div
                      key={aboutUs.about_us_id}
                      className={`AboutUsImgVisionDataContentContainer ${themeDetails.AboutUsImgDataContentContainer}`}
                    >
                      <div
                        className={`v-m-ission_imgs ${themeDetails.VMissionImgs}`}
                      >
                        <img src={aboutUs.About_Us_Image} alt="About Us" />
                      </div>
                      <div
                        className={`v-m-ission_imgs ${themeDetails.VMissionContainer}`}
                      >
                        <h2>{aboutUs.Title}</h2>
                        <p>{aboutUs.Description}</p>
                      </div>
                    </div>
                  ))
                ) : userRole === "user" ? (
                  <p>
                    No information available at the moment. Please check back
                    later.
                  </p>
                ) : userRole === "admin" ? (
                  <p>
                    No information available. Please add the relevant details.
                  </p>
                ) : (
                  <p>
                    No information available. Please contact support if this
                    issue persists.
                  </p>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}

      {themeColor === "Theme-default" && (
        <div
          className={`AboutUs_Main_Container ${themeDetails.AboutUsMainContainer}`}
        >
          <div
            className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`}
          >
            {image ? (
              <Link to="/">
                <img src={image} alt="Current" />
              </Link>
            ) : userRole === "user" ? (
              <p>
                Unable to load the image at the moment. Please try again later.
              </p>
            ) : userRole === "admin" ? (
              <p>No image available. Please upload the necessary image.</p>
            ) : (
              <p>
                Unable to load the image. Please contact support if this issue
                persists.
              </p>
            )}

            <span>
              <Link to={`/`}>
                <IoHome />
                Home
              </Link>
            </span>

          </div>

          <div
            className={`AboutUsContentMainContainer ${themeDetails.AboutUsContentMainContainer}`}
          >
            <h1>About Us</h1>

            <div
              className={`AboutUsContentSubContainer ${themeDetails.AboutUsContentSubContainer}`}
            >
              <div
                className={`AboutUs1stContentContainer ${themeDetails.AboutUs1stContentContainer}`}
              >
                {isEditMode && (
                  <div>
                    <button
                      onClick={() => setShowAboutEgradForm(!showAboutEgradForm)}
                    >
                      {showAboutEgradForm
                        ? "Close AboutEGT Form"
                        : "Add AboutEGT"}
                    </button>
                    {showAboutEgradForm && <AboutUsEdit type="aboutEgrad" />}
                  </div>
                )}
                <div className={`AboutUsImgDataContentContainer ${themeDetails.AboutUsImgDataContentContainer}`}>
                  {welcomeimage && <img src={welcomeimage} alt="Welcome" />}
                </div>

                {aboutEgradData.length > 0 ? (
                  aboutEgradData.map((aboutEgrad) => (
                    <div
                      key={aboutEgrad.about_egt_id}
                      className={`AboutUsImgDataContentContainer ${themeDetails.AboutUsImgDataContentContainer}`}
                    >
                      <p>{aboutEgrad.about_egt}</p>
                    </div>
                  ))
                ) : userRole === "user" ? (
                  <p>
                    No information is available at the moment. Please check back
                    later.
                  </p>
                ) : userRole === "admin" ? (
                  <p>
                    No information available. Please add the necessary details.
                  </p>
                ) : (
                  <p>
                    No information available. Please contact support if this
                    issue persists.
                  </p>
                )}
              </div>

              <div
                className={`AboutUs_VisionContent_Container ${themeDetails.AboutUsVisionContentContainer}`}
              >
                {isEditMode && (
                  <div>
                    <button
                      onClick={() => setShowAboutUsForm(!showAboutUsForm)}
                    >
                      {showAboutUsForm ? "Close AboutUs Form" : "Add AboutUs"}
                    </button>
                    {showAboutUsForm && <AboutUsEdit type="aboutUs" />}
                  </div>
                )}

                {aboutUsData.length > 0 ? (
                  aboutUsData.map((aboutUs) => (
                    <div
                      key={aboutUs.about_us_id}
                      className={`AboutUsImgVisionDataContentContainer ${themeDetails.AboutUsImgDataContentContainer}`}
                    >
                      <img src={aboutUs.About_Us_Image} alt="About Us" />
                      <h2>{aboutUs.Title}</h2>
                      <p>{aboutUs.Description}</p>
                    </div>
                  ))
                ) : userRole === "user" ? (
                  <p>
                    No information available at the moment. Please check back
                    later.
                  </p>
                ) : userRole === "admin" ? (
                  <p>No data found. Please add the necessary information.</p>
                ) : (
                  <p>
                    No information available. Please contact support if this
                    issue persists.
                  </p>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default AboutUs;
