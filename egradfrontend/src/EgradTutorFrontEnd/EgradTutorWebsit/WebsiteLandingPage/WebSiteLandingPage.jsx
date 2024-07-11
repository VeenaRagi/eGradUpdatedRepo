import React, { useState, useEffect } from "react";
import axios from "axios";
import LandingPageHeader from "./LandingPageHeader/LandingPageHeader";
import LandingPageExamdata from "./LandingpageExamdata/LandingPageExamdata";
import Footer from "../Footer/Footer";
import { useTIAuth } from "../../../TechInfoContext/AuthContext";

const WebSiteLandingPage = ({ isEditMode }) => {
  const [tiAuth, settiAuth] = useTIAuth();

  return (
    <div>
      {/* <pre>
        {JSON.stringify(tiAuth, null, 4)}
      </pre> */}
      <LandingPageHeader isEditMode={isEditMode} />
      <LandingPageExamdata isEditMode={isEditMode} />
      <Footer isEditMode={isEditMode} />
    </div>
  );
};

export default WebSiteLandingPage;
