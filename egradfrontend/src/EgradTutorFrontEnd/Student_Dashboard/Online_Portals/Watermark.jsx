import React from 'react';
import './styles/Watermark.css'; // Import the CSS file 
const Watermark = ({ children }) => {
  return (
    <div className="watermark-container">
      <div className="watermark">
      
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Watermark;
