import React from "react";
import "./ErrorPage.css"; // Corrected import statement for CSS file
import NotFoundImage from "./NotFound.png"; // Import the image file

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src={NotFoundImage} alt="Page Not Found" /> {/* Use alt text for accessibility */}
      <h2 className="not-found-heading">Page Not Found</h2>
      <p className="not-found-paragraph">
        The page you are looking for does not exist.
      </p>
    </div>
  );
};
export default NotFound;