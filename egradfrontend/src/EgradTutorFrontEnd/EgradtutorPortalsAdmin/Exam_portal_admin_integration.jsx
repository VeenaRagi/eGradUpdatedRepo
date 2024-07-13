import React from "react";
import Leftnav from "./Leftnav";
import "./styles/Exam_portal_admin_integration.css";
import ExamPageHeader from "../EgradTutorWebsit/ExamHomePage/ExamHomepageHeader/ExamPageHeader";
import AdminHeader from "./AdminHeader";
const Exam_portal_admin_integration = ({decryptedUserIdState}) => {
  return (
    <div>
      <AdminHeader/>
      <div className="Exam_portal_admin_integration_container">
        <Leftnav decryptedUserIdState={decryptedUserIdState}/>
      </div>
    </div>
  );
};

export default Exam_portal_admin_integration;

