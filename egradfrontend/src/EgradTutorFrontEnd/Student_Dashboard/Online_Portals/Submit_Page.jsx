// import React from 'react'

// const Submit_Page = () => {
//     const openPopup = () => {
//         // Close the current window
//         window.close();

//         // Set studentDashbordmyresult to true and store it in localStorage
//         localStorage.setItem(
//           "studentDashboardState",
//           JSON.stringify({
//             studentDashbordmyresult: true,
//             studentDashbordconatiner: false,
//             studentDashbordmycourse: false,
//             studentDashbordbuycurses: false,
//             studentDashborddountsection: false,
//             studentDashbordbookmark: false,
//             studentDashbordsettings: false,
//           })
//         );

//         // Open the desired URL in a new window
//         window.open("http://localhost:3000/student_dashboard");
//       };

//   return (
//     <div>
//         <div className="popup">
//                   <div className="popup-content">
//                     {/* <span className="close" onClick={() => setShowPopup(false)}>
//                       &times;
//                     </span> */}
//                     <div className="submit-page-container">
//                       <div className="submit-page-card">
//                         <h2 className="submit-page-heading">
//                           Your Test has been submitted successfully.
//                         </h2>
//                         <h3 className="submit-page-subheading">
//                           View your Test Report
//                         </h3>
//                         <button
//                           onClick={openPopup}
//                           className="submit-page-button"
//                         >
//                           View Report
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//     </div>
//   )
// }

// export default Submit_Page

import React from "react";
import { Link } from "react-router-dom";
import "./styles/Submit_Page.css"; // Import CSS file for styling
import BASE_URL from "../../src/apiConfig";
const Submit_Page = () => {
  const openPopup = () => {
    // Close the current window
    window.close();

    // Set studentDashbordmyresult to true and store it in localStorage
    localStorage.setItem(
      "studentDashboardState",
      JSON.stringify({
        studentDashbordmyresult: true,
        studentDashbordconatiner: false,
        studentDashbordmycourse: false,
        studentDashbordbuycurses: false,
        studentDashborddountsection: false,
        studentDashbordbookmark: false,
        studentDashbordsettings: false,
      })
    );

    // Open the desired URL in a new window
    window.open(`${BASE_URL}/student_dashboard`);
  };
  return (
    <div className="submit-page-container">
      <h2 className="submit-page-heading">
        Your Test has been submitted successfully.
      </h2>
      <h3 className="submit-page-subheading">View your Test Report</h3>
      <button className="submit-page-button">
        {/* <Link to='/test_report' className="submit-page-link">View Report</Link> */}
        <button onClick={openPopup} className="submit-page-button">
          View Report
        </button>
      </button>
    </div>
  );
};

export default Submit_Page;
