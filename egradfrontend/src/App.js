import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./assets/actions/store";
import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage";
import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/BranchHomePage/BranchHomePage";
import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/ExamHomePage/ExamHomePage";
import { ThemeProvider } from "./ThemesFolder/ThemeContext/Context";
import AboutUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/AboutUsPage/AboutUs";
import ContactUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/ContactUs/ContactUs";
import Login from "./Login/Login";
import AdminLogin from "./Login/AdminLogin";
import Register from "./Login/Register";
import UgadminHome from "./Login/UgadminHome";
import LinkPage from "./EgradTutorFrontEnd/EgradTutorWebsit/Footer/LinkPage";
import FAQ from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/FAQPage/FAQ";
import CoursePage from "./EgradTutorFrontEnd/EgradTutorWebsit/CoursePages/CoursePage";
import UserLogin from "./Login/UserLogin";
import PasswordChangeForm from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/PasswordChangeForm";
import SuperAdminLogin from "./Login/SuperAdminLogin";
import PrivateRoute from "./Login/PrivateRoute";
import ForgotPassword from "./Login/ForgotPassword";

import axios from "./api/axios.js";
import BASE_URL from "./apiConfig.js";
import NotFound from "./NotFound.jsx";
import RegistrationForm from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/RegistrationForm.jsx";
import Student_dashboard from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/Student_dashboard.jsx";
import Payu from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/Payu.jsx";

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  const [serverError, setServerError] = useState(false);

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

  return (
    <ThemeProvider>
      <Provider store={store}>
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
                <Route path="/SuperAdminLogin" element={<SuperAdminLogin />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/UserLogin" element={<UserLogin />} />
                <Route
                  path="/RegistrationForm/:courseCreationId"
                  element={<RegistrationForm />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/PasswordChangeForm/:user_Id"
                  element={<PasswordChangeForm />}
                />
                <Route path="/PayU/:courseCreationId" element={<Payu />} />


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

{/* --------------------Student_dashboard_INTERFACE_ROUTES_START-------------------- */}
                <Route element={<PrivateRoute />}>
                  <Route
                    path="/Student_dashboard/:userIdTesting"
                    element={<Student_dashboard />}
                  />
                </Route>
{/* --------------------Student_dashboard_INTERFACE_ROUTES_END-------------------- */}

              </Routes>
            </Router>
          )}
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
