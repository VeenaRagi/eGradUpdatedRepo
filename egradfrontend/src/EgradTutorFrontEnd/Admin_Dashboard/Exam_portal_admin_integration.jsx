import React from "react";
import Leftnav from "./Leftnav";
import "./Styles/Exam_portal_admin_integration.css";
import Exam_portal_admin_Dashboard from "./Exam_portal_admin_Dashboard";

const Exam_portal_admin_integration = () => {
  return (
    <div>
      <div className="Exam_portal_admin_integration_container">
        <Leftnav />
        {/* <Exam_portal_admin_Dashboard /> */}
      </div>
    </div>
  );
};

export default Exam_portal_admin_integration;


// export const Exam_portal_admin_Dashboard_com = () => {

//     return(
//         <>
        
//         <div className="Exam_portal_admin_integration_container">
//         <Leftnav />
//       </div>
//         </>
//     )
// }