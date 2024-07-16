import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage";
import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/BranchHomePage/BranchHomePage";
import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/ExamHomePage/ExamHomePage";
import { ThemeProvider } from "./ThemesFolder/ThemeContext/Context";
import AboutUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/AboutUsPage/AboutUs";
import ContactUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/ContactUs/ContactUs";
import LinkPage from "./EgradTutorFrontEnd/EgradTutorWebsit/Footer/LinkPage";
import FAQ from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/FAQPage/FAQ";
import CoursePage from "./EgradTutorFrontEnd/EgradTutorWebsit/CoursePages/CoursePage";
import ThemesSection from './ThemesFolder/ThemesSection/ThemesSection'
import BASE_URL from "./apiConfig.js";
import NotFound from "./NotFound.jsx";

import axios from "axios";




function App({decryptedUserIdState,usersData}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoggedIn = () => {
      const isLoggedInObjFromLS = localStorage.getItem("tiAuth");
      console.log(isLoggedInObjFromLS);
      if (isLoggedInObjFromLS) {
        try {
          const tiAuth = JSON.parse(isLoggedInObjFromLS);
          console.log(tiAuth.isLoggedIn,"this is the status")
          const role=tiAuth.role
          // setIsLoggedInFromLS(tiAuth.isLoggedIn);
          // console.log(tiAuth,"this is ssssssssssss")
          // console.log(isLoggedInFromLS, "wwwwwwwwwwwwwwwwwwwwwww");
          if (role === "admin") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.log(error, "parsing the tiauth for back button");
        }
      }
    };
    checkLoggedIn();
  }, []);




  useEffect(() => {
    // Function to check server status
    const checkServerStatus = async () => {
      try {
        // Example: Make a request to an endpoint on your server
        const response = await axios.get(`${BASE_URL}/api/server/status`);
        // If response is successful, server is running
        setServerError(false);
      } catch (error) {
        // If request fails, server is not running or there's an error
        setServerError(true);
      }
    };
 
    checkServerStatus();
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  const [serverError, setServerError] = useState(false);

  
  return (
    <ThemeProvider>
      <div>
        {isAdmin && (
        <button onClick={toggleEditMode}>
          {isEditMode ? "Disable Edit" : "Enable Edit"}
        </button>
        )}

        {serverError ? (
          <NotFound />
        ) : (
          <Router>
        
             <Routes>
              

              <Route
                path="/"
                element={<WebSiteLandingPage isEditMode={isEditMode} />}
              />
              <Route
                path="/BranchHomePage/:Branch_Id"
                element={<BranchHomePage isEditMode={isEditMode} />}
              />
              <Route
                path="/ExamHomePage/:EntranceExams_Id"
                element={<ExamHomePage isEditMode={isEditMode} />}
              />
              <Route
                path="/CoursePage/:Branch_Id/:Portale_Id"
                element={<CoursePage isEditMode={isEditMode} />}
              />
              <Route
                path="/AboutUs"
                element={<AboutUs isEditMode={isEditMode} />}
              />
              <Route path="/ContactUs" element={<ContactUs />} />
              <Route path="/Faq" element={<FAQ />} />
              <Route path="/linkpage/:Link_Id" element={<LinkPage />} />

             
     
      
            <Route
         path="/Error"
           element={<NotFound />} 
          />
          <Route path="/WebsiteAdmin" element={<ThemesSection/>}/>
   
            </Routes>
       
         
          </Router>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
