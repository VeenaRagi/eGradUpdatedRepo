import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import axios from "axios";
import BASE_URL from "../../../../apiConfig";
import "../../../../styles/UGHomePage/ugHomePageTheme1.css";
import "../../../../styles/UGHomePage/ugHomePageTheme2.css";
import { RxHamburgerMenu } from "react-icons/rx";
import "../../../../styles/UGHomePage/UgHomePage_Default_Theme.css";

const BHPHeading = ({ userRole }) => {
  const [image, setImage] = useState(null);
  const [showLinks, setShowLinks] = useState(false);
  const [portales, setPortales] = useState([]);
  const { Branch_Id } = useParams();
  // setting an image
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
    fetchPortales();
  }, []);

  const fetchPortales = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ExploreExam/portales`);
      setPortales(response.data);
    } catch (error) {
      console.error("Error fetching portales:", error);
    }
  };


  const themeFromContext = useContext(ThemeContext);
  const refreshChannel = new BroadcastChannel("refresh_channel");
  // Listen for messages from other pages
  refreshChannel.onmessage = function (event) {
    if (event.data === "refresh_page") {
      window.location.reload(); // Reload the page
    }
  };
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss");
  const themeDetails = JSONClasses[themeColor] || [];
  console.log(themeDetails, "mapppping from json....");
  // fetching for navitems
  return (
    <div
      className={`Ug_Home_Page_First_Container${themeDetails.themeUgHomePageFirstContainer}`}
    >
      {/* {header with logooo} */}
      <div
        className={`Ug_Home_Container  ${themeDetails.themeUgHomeContainer}`}
      >
        <div className={`Ug_HeaderSection ${themeDetails.themeUgHeaderSec}`}>
          <div
            className={`"Ug_header_Container main-nav ${themeDetails.themeUgHeaderContainer}`}
          >
            <div
              className={`Ug_header_logoIMG ${themeDetails.themeUgHeaderLogoImg}`}
            >
              {image ? (
                <img src={image} alt="Current" />
              ) : userRole === 'user' ? (
                <p>Unable to load image at the moment. Please try again later.</p>
              ) : userRole === 'admin' ? (
                <p>There is no data available. Please add the data.</p>
              ) : (
                <p>No image available. Please contact support if this issue persists.</p>
              )}
            </div>
            <div
              className={`${showLinks ? "menu-link mobileMenuLink" : "menu-link"
                } ${themeDetails.themeUgDivLinksOfHeader}`}
            >

              {portales.length > 0 ? (
                portales.map((portale) => (
                  <li key={portale.Portale_Id}>
                    <Link to={`/CoursePage/${Branch_Id}/${portale.Portale_Id}`} target="_blank">
                      {portale.Portale_Name}
                    </Link>
                  </li>
                ))
              ) : userRole === 'user' ? (
                <p>No portals available at the moment. Please check back later.</p>
              ) : userRole === 'admin' ? (
                <p>No portals found. Please add the necessary portals.</p>
              ) : (
                <p>No portals available. Please contact support if this issue persists.</p>
              )}
            </div>
            <div
              className="hamburgerMenu"
              onClick={() => {
                setShowLinks(!showLinks);
                console.log(showLinks, "this is from onclick of hMenu");
              }}
            >
              {" "}
              <RxHamburgerMenu />
            </div>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
};

export default BHPHeading;
