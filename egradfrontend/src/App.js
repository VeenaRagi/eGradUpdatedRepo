import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route,  Navigate, useNavigate,useLocation } from "react-router-dom";
import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteLandingPage/WebSiteLandingPage";
import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/BranchHomePage/BranchHomePage";
import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsit/ExamHomePage/ExamHomePage";
import { ThemeProvider } from "./ThemesFolder/ThemeContext/Context";
import AboutUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/AboutUsPage/AboutUs";
import ContactUs from "./EgradTutorFrontEnd/EgradTutorWebsit/WebsiteSubPages/ContactUs/ContactUs";
import Login from "./Login/Login";
import AdminLogin from "./Login/AdminLogin";
import Register from "./Login/Register";
// import UgadminHome from "./Login/UgadminHome";
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
import UpdatingConrseInAdmin from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/UpdatingCourseInAdmin.jsx";
import GettingInstructions from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/GettinggInstructions.jsx";
import { UpdateInstruction } from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/UpdateInstruction.jsx";
import TestUpdateadmin from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/TestUpdateadmin.jsx";
import UG_Instructions_Page from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/UG_Instructions_Page.jsx";
import PG_Instructions_Page from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/PG_Instructions_Page.jsx";
import General_Intructions_Page from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/General_intructions_page.jsx";
import UGQuizPage from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/UG_OTS/UGQuizPage.jsx";
import PGQuizPage from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/PG_OTS/PGQuizPage.jsx";
import UGQuestionPaper from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/UG_OTS/UGQuestionPaper.jsx";
import PGQuestionPaper from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/PG_OTS/PGQuestionPaper.jsx";
import UGQuestionBankQuiz from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/UG_PQB/UGQuestionBankQuiz.jsx";
import PGQuestionBankQuiz from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/PG_PQB/PGQuestionBankQuiz.jsx";
import StudentDashbord_MyResults from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/StudentDashbord_MyResults.jsx";
import TestResultsPage from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/TestResultsPage.jsx";
import { UserReport } from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/UserReport.jsx";
import ThemesSection from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/ThemesSection.jsx";
import Leftnav from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/Leftnav.jsx";
import AdminProfile from "./EgradTutorFrontEnd/EgradtutorPortalsAdmin/AdminProfile.jsx";
import axios from "axios";
// Test
import { UserProvider } from "./UserContext";
// import PGAdminDashboard from "./EgradTutorFrontEnd/EGradTutorPGAdminDashboard/PGAdminDashboardIntegration.jsx";
import PGAdminDashboardIntegration from "./EgradTutorFrontEnd/EGradTutorPGAdminDashboard/PGAdminDashboardIntegration.jsx";
import OnlineTestSerices_pg from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/PG_OTS/OnlineTestSerices_pg.jsx";
import UG_OTSQuizPage from "./EgradTutorFrontEnd/EgradTutorWebsit/StudentDashbord/UG_OTS/UG_OTSQuizPage.jsx";
const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

function AppContent({ decryptedUserIdState, usersData,Branch_Id }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate=useNavigate()
  const location=useLocation();
  const showButtonForAdmin = isAdmin && location.pathname !== '/AdminPage';

  useEffect(() => {
    const checkLoggedIn = () => {
      const isLoggedInObjFromLS = localStorage.getItem("tiAuth");
      console.log(isLoggedInObjFromLS);
      if (isLoggedInObjFromLS) {
        try {
          const tiAuth = JSON.parse(isLoggedInObjFromLS);
          console.log(tiAuth.isLoggedIn, "this is the status");
          const role = tiAuth.role;
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

  const PrivateRoute = ({ element }) => {
    const isLoggedInObjFromLS = localStorage.getItem("tiAuth");
  
    if (isLoggedInObjFromLS) {
      try {
        const tiAuth = JSON.parse(isLoggedInObjFromLS);
        if (tiAuth.role === "User") {
          return element;
        }
      } catch (error) {
        console.log(error, "parsing the tiAuth for viewer role");
      }
    }
  
    return <Navigate to="/userlogin" />;
  };
  const navigateToAdmin=()=>{
    navigate('/AdminPage')
  }


  return (
    <ThemeProvider>
      <div>
        {isAdmin && (
          <button onClick={toggleEditMode}>
            {isEditMode ? "Disable Edit" : "Enable Edit"}
          </button>
        )}
   {showButtonForAdmin && (
          <button 
          onClick={navigateToAdmin} 
          style={{marginLeft:"20px"}}>
            {/* {isEditMode ? "Disable Edit" : "Enable Edit"} */}
            Back To Admin Page 
          </button>
        )}
        {serverError ? (
          <NotFound />
        ) : (
            <UserProvider>
              <Routes>
                <Route path="/SuperAdminLogin" element={<SuperAdminLogin />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/UserLogin" element={<UserLogin />} />
                <Route
                  path="/RegistrationForm/:Branch_Id"
                  element={<RegistrationForm />}
                />
                <Route
                  path="/CourseRegistrationForm/:courseCreationId/:Branch_Id"
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
                  element={<WebSiteLandingPage isEditMode={isEditMode}  Branch_Id={Branch_Id}/>}
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
                <Route path="/Faq" element={<FAQ isEditMode={isEditMode} />} />
                <Route path="/linkpage/:Link_Id" element={<LinkPage />} />

                {/* --------------------Student_dashboard_INTERFACE_ROUTES_START-------------------- */}

                <Route
                  path="/Student_dashboard/:userIdTesting/:encryptedBranchId"
                  element={<Student_dashboard />}
                />

                {/* --------------------Student_dashboard_INTERFACE_ROUTES_END-------------------- */}

                {/*--------------------- EgradtutorPortalsAdmin ------------- */}
                <Route
                  path="/getSubjectData/:testCreationTableId/:subjectId/:sectionId"
                  element={<Document_ImageInfo />}
                />

                <Route
                  path="/Adminpage"
                  element={
                    <Exam_portal_admin_integration
                      decryptedUserIdState={decryptedUserIdState}
                    />
                  }
                />
                <Route
                  path="/ExamUpdataion_admin/:examId"
                  element={<ExamUpdataion_admin />}
                />
                <Route
                  path="/UpdatingCourseInAdmin/:courseCreationId/:portalId"
                  element={<UpdatingConrseInAdmin />}
                />

                <Route
                  path="/Instruction/editIns/:instructionId/"
                  element={<GettingInstructions />}
                />

                <Route
                  path="/InstructionPage/editIns/:instructionId/:id"
                  element={<UpdateInstruction />}
                />
                {/* <Route
                path="/TestUpdateadmin/:testCreationTableId"
                element={<TestUpdateadmin />}
              /> */}

                <Route
                  path="/TestUpdateForm/:testCreationTableId/:TestForm_Id"
                  element={<TestUpdateadmin />}
                />
  <Route
                  path="/UG_Instructions_Page/:param1/:param2/:param3/:param4"
                  element={<PrivateRoute element={<UG_Instructions_Page />} />}
                />
                
                <Route
                  path="/PG_Instructions_Page/:param1/:param2/:param3/:param4"
                  element={<PG_Instructions_Page />}
                />
                {/* <Route
                  path="/Instructions/:param1/:param2/:param3"
                  element={<PrivateRoute element={<InstructionPage />} />}
                /> */}
   <Route
                  path="/General_intructions_page/:param1/:param2/:param3/:param4"
                  element={
                    <PrivateRoute element={<General_Intructions_Page />} />
                  }
                />
                {/* <Route
                  path="/General_intructions_page/:param1/:param2/:param3"
                  element={<PrivateRoute element={<General_Intructions_Page />} />}
                /> */}
                 <Route
                  path="/UGQuizPage/questionOptions/:param1/:param2"
                  element={
                    <PrivateRoute element={<UGQuizPage seconds={20} />} />
                  }
                />
                <Route
                  path="/UGQuestionBankQuiz/questionOptions/:param1/:param2"
                  element={<PrivateRoute element={<UGQuestionBankQuiz />} />}
                />
                <Route
                  path="/PGQuizPage/questionOptions/:param1/:param2"
                  element={
                    <PrivateRoute element={<PGQuizPage seconds={20} />} />
                  }
                />
                <Route
                  path="/PGQuestionBankQuiz/questionOptions/:param1/:param2"
                  element={<PrivateRoute element={<PGQuestionBankQuiz />} />}
                />
                <Route
                  path="/StudentDashbord_MyResults"
                  element={<StudentDashbord_MyResults />}
                />
                <Route
                  path="/TestResultsPage/:param1/:param2"
                  element={<TestResultsPage />}
                />
                {/* <Route
         path="/UserReport/:id/:testCreationTableId/:courseCreationId"
           element={<UserReport usersData={usersData} decryptedUserIdState={decryptedUserIdState}/>} 
          /> */}

                <Route
                  path="/UserReport/:decryptedUserIdState/:testCreationTableId/:courseCreationId"
                  element={<UserReport />}
                />
             
<Route
                  path="/UGQuestionPaper/:param1"
                  element={<UGQuestionPaper />}
                />
                <Route
                  path="/PGQuestionPaper/:param1"
                  element={<PGQuestionPaper />}
                />
                <Route path="/Error" element={<PrivateRoute element={<NotFound/>} />}/>
                <Route path="/WebsiteAdmin" element={<ThemesSection />} />
                <Route
                  path="/CourseAdmin"
                  element={<Exam_portal_admin_integration />}
                />
                <Route
                  path="/PGCourseAdmin"
                  element={<PGAdminDashboardIntegration/>}
                />
                {/* PGCourseAdmin */}
                <Route path="/adminProfile" element={<AdminProfile />} />
                <Route path="/ots" element={<OnlineTestSerices_pg/>}/>
                <Route path="/ugots" element={<UG_OTSQuizPage/>}/>
              </Routes>
            </UserProvider>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
