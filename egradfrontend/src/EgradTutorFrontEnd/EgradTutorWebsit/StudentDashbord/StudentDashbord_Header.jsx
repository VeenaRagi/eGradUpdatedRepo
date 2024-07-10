import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";

import JSONClasses from "../../../ThemesFolder/JSONForCSS/JSONClasses";
import { ThemeContext } from "../../../ThemesFolder/ThemeContext/Context";
import defaultImage from "../../../assets/defaultImage.png";

const StudentDashbord_Header = ({ userRole, usersData,tiAuth }) => {
  const themeFromContext = useContext(ThemeContext);
  const themeColor = themeFromContext[0]?.current_theme;
  const themeDetails = JSONClasses[themeColor] || [];

  const [image, setImage] = useState(null);

  return (
    <div>
      <div
        className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`}
      >
        {image ? (
          <Link to="/">
            <img src={image} alt="Current" />
          </Link>
        ) : userRole === "user" ? (
          <p>Unable to load image at the moment. Please try again later.</p>
        ) : (
          // <p>
          //   Image could not be loaded. Please contact support if the issue
          //   persists.
          // </p>
          <img src={defaultImage} alt="Current" />
        )}


        {usersData.users && usersData.users.length > 0 && (
          <div>
            <p>
              <strong>Username:</strong>
            </p>
            <ul>
              {usersData.users.map((user) => (
                <li key={user.user_Id}>{user.username}</li>
              ))}
            </ul>
          </div>
        )}

        <span>
          <Link to={`/`}>
            <IoHome />
            Home
          </Link>
        </span>
      </div>
    </div>
  );
};

export default StudentDashbord_Header;
