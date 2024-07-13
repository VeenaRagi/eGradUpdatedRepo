import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import PasswordChangeForm from "./Login/PasswordChangeForm.jsx";
import SuperAdminLogin from "./Login/SuperAdminLogin";
import ForgotPassword from "./Login/ForgotPassword";
import BASE_URL from "./apiConfig.js";
import NotFound from "./NotFound.jsx";
import RegistrationForm from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/RegistrationForm.jsx";
import Student_dashboard from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/Student_dashboard.jsx";
import Payu from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/Payu.jsx";
import Document_ImageInfo from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/Document_ImageInfo.jsx";
import Exam_portal_admin_integration from "../src/EgradTutorFrontEnd/EgradtutorPortalsAdmin/Exam_portal_admin_integration.jsx";
import ExamUpdataion_admin from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/ExamUpdataion_admin.jsx";
import UpdatingConrseInAdmin from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/UpdatingCourseInAdmin.jsx"
import GettingInstructions from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/GettinggInstructions.jsx"
import { UpdateInstruction } from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/UpdateInstruction.jsx"
import TestUpdateadmin from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/TestUpdateadmin.jsx";
import InstructionPage from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/InstructionPage.jsx'
import General_Intructions_Page from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/General_intructions_page_container.jsx'
import QuizPage from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/OTS/QuizPage.jsx'
import QuestionBankQuiz from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/PQB/QuestionBankQuiz.jsx'
import StudentDashbord_MyResults from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/StudentDashbord_MyResults.jsx'
import TestResultsPage from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/TestResultsPage.jsx'
import {UserReport} from './EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/UserReport.jsx'
import ThemesSection from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/ThemesSection.jsx";
import Leftnav from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/Leftnav.jsx";
import AdminProfile from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/AdminProfile.jsx";

function App({decryptedUserIdState}) {
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

              <Route
                path="/Student_dashboard/:userIdTesting"
                element={<Student_dashboard />}
              />

              {/* --------------------Student_dashboard_INTERFACE_ROUTES_END-------------------- */}

              {/*--------------------- EgradtutorPortalsAdmin ------------- */}
              <Route path="/getSubjectData/:testCreationTableId/:subjectId/:sectionId" element={<Document_ImageInfo />} />

              <Route path="/Adminpage" element={<Exam_portal_admin_integration decryptedUserIdState={decryptedUserIdState}/>} />
              <Route path="/ExamUpdataion_admin/:examId" element={<ExamUpdataion_admin />} />
              <Route path="/UpdatingCourseInAdmin/:courseCreationId/:portalId" element={<UpdatingConrseInAdmin />} />

              <Route path="/Instruction/editIns/:instructionId/" element={<GettingInstructions />} />

              <Route path="/InstructionPage/editIns/:instructionId/:id" element={<UpdateInstruction />} />
              <Route
                path="/TestUpdateadmin/:testCreationTableId"
                element={<TestUpdateadmin />}
              />


              <Route
                path="/Instructions/:param1/:param2/:param3"
                element={<InstructionPage />}
              />

             <Route
            path="/General_intructions_page/:param1/:param2/:param3"
            element={<General_Intructions_Page/>} 
          />
    <Route
            path="/QuizPage/questionOptions/:param1/:param2"
           element={<QuizPage seconds={20} />} 
          />
              <Route
            path="/QuestionBankQuiz/questionOptions/:param1/:param2"
          element={<QuestionBankQuiz />} 
          />
            <Route
            path="/StudentDashbord_MyResults"
           element={<StudentDashbord_MyResults />} 
          />
             <Route
            path="/TestResultsPage/:param1/:param2"
           element={<TestResultsPage />} 
          />
            <Route
         path="/UserReport/:id/:testCreationTableId/:courseCreationId"
           element={<UserReport />} 
          />
            <Route
         path="/Error"
           element={<NotFound />} 
          />
          <Route path="/WebsiteAdmin" element={<ThemesSection/>}/>
          <Route path="/CourseAdmin" element={<Exam_portal_admin_integration/>}/>
          <Route path="/adminProfile" element={<AdminProfile/>}/>
            </Routes>
          </Router>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
