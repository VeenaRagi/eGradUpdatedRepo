import React from 'react';
// import "../EgradTutorWebsit/StudentDashbord/Style/StudentDashbord_MyCourses.css"
const ProgressPieChart = ({ videoProgress, onClick}) => {
  // Calculate the watched percentage
  const watchedPercentage = (videoProgress.watched / videoProgress.total) * 100;
  console.log((watchedPercentage))

  // Create a conic-gradient background to represent the progress
  const backgroundStyle = {
    background: `conic-gradient(#00007f ${watchedPercentage}%, white ${watchedPercentage}%)`,
  };

  return (
    <div className="progress-button-container" style={backgroundStyle}>
      <button className="view-video-button" onClick={onClick}>
        <i className="fa-solid fa-play"></i>
      </button>
    </div>
  );
};

export default ProgressPieChart;