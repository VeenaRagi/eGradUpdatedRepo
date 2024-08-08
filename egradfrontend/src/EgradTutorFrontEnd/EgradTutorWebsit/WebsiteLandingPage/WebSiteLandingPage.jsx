import React, { useState, useEffect } from "react";
import axios from "axios";
import LandingPageHeader from "./LandingPageHeader/LandingPageHeader";
import LandingPageExamdata from "./LandingpageExamdata/LandingPageExamdata";
import Footer from "../Footer/Footer";
import { useTIAuth } from "../../../TechInfoContext/AuthContext";
import BASE_URL from "../../../apiConfig";
import { useParams } from "react-router-dom";

const WebSiteLandingPage = ({ isEditMode }) => {
  const [tiAuth, settiAuth] = useTIAuth();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const{Branch_Id} = useParams();
  
  const fetchBranches = async () => {
    try {
      const response = await fetch(`${BASE_URL}/LandingPageExamData/branch/${Branch_Id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBranches(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, [Branch_Id]);
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
