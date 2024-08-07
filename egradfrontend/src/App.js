import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
import RegistrationForm from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/RegistrationForm.jsx";
import Student_dashboard from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/Student_dashboard.jsx";
import Payu from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/Payu.jsx";
import Document_ImageInfo from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/Document_ImageInfo.jsx";
import Exam_portal_admin_integration from "../src/EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/Exam_portal_admin_integration.jsx";
import ExamUpdataion_admin from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/ExamUpdataion_admin.jsx";
import UpdatingConrseInAdmin from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/UpdatingCourseInAdmin.jsx";
import GettingInstructions from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/GettinggInstructions.jsx";
import { UpdateInstruction } from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/UpdateInstruction.jsx";
import TestUpdateadmin from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/TestUpdateadmin.jsx";
import UG_Instructions_Page from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/UG_Instructions_Page.jsx";
import General_Intructions_Page from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/General_intructions_page.jsx";
import UGQuizPage from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/UG_OTS/UGQuizPage.jsx";
import PGQuizPage from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/PG_OTS/PGQuizPage.jsx";
import UGQuestionPaper from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/UG_OTS/UGQuestionPaper.jsx";
import PGQuestionPaper from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/PG_OTS/PGQuestionPaper.jsx";
import PG_PopUpInstructionsView from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/PG_OTS/PG_PopUpInstructionsView.jsx";
import QuestionBankQuiz from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/UG_PQB/UGQuestionBankQuiz.jsx";
import StudentDashbord_MyResults from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/StudentDashbord_MyResults.jsx";
import TestResultsPage from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/TestResultsPage.jsx";
import { UserReport } from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/UserReport.jsx";
import ThemesSection from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/ThemesSection.jsx";
import Leftnav from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/Leftnav.jsx";
import AdminProfile from "./EgradTutorFrontEnd/Egradtutor_UG_PortalsAdmin/AdminProfile.jsx";
import axios from "axios";
// Test
import { UserProvider } from "./UserContext";
import ScientificCalculator from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/PG_OTS/ScientificCalculator.jsx";
import PG_Instructions_Page from "./EgradTutorFrontEnd/EgradTutorWebsit/eGradTutor_StudentDashbord/PG_Instructions_Page.jsx";
import { TIAuthProvider } from "./TechInfoContext/AuthContext.js";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};
function AppContent({ decryptedUserIdState, usersData, Branch_Id }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate=useNavigate()
  const location=useLocation();
  const showAdminPageButton=location.pathname==='/';
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
        {showButtonForAdmin && (
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
          // <Router>
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
                  element={
                    <WebSiteLandingPage
                      isEditMode={isEditMode}
                      Branch_Id={Branch_Id}
                    />
                  }
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

                {/*--------------------- Egradtutor_UG_PortalsAdmin ------------- */}
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
                  path="/General_intructions_page/:param1/:param2/:param3/:param4"
                  element={
                    <PrivateRoute element={<General_Intructions_Page />} />
                  }
                />
                <Route
                  path="/UGQuizPage/questionOptions/:param1/:param2"
                  element={
                    <PrivateRoute element={<UGQuizPage seconds={20} />} />
                  }
                />
                <Route
                  path="/UGQuestionBankQuiz/questionOptions/:param1/:param2"
                  element={<PrivateRoute element={<UGQuestionPaper />} />}
                />
                <Route
                  path="/PGQuizPage/questionOptions/:param1/:param2"
                  element={
                    <PrivateRoute element={<PGQuizPage seconds={20} />} />
                  }
                />
                 {/* <Route
                  path="/PGQuizPage"
              element={<PGQuizPage seconds={20} />}
                /> */}
                <Route
                  path="/PGQuestionBankQuiz/questionOptions/:param1/:param2"
                  element={<PrivateRoute element={<PGQuestionPaper />} />}
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
                <Route
                  path="/Instructions"
                  element={<PG_PopUpInstructionsView />}
                />
                <Route
                  path="/Error"
                  element={<PrivateRoute element={<NotFound />} />}
                />
                <Route path="/WebsiteAdmin" element={<ThemesSection />} />
                <Route
                  path="/CourseAdmin"
                  element={<Exam_portal_admin_integration />}
                />
                <Route path="/adminProfile" element={<AdminProfile />} />

                <Route
                  path="/ScientificCalculator"
                  element={<ScientificCalculator />}
                />

                <Route
                  path="/PG_Instructions_Page/:param1/:param2/:param3/:param4"
                  element={<PG_Instructions_Page />}
                />
              </Routes>
            </UserProvider>
          // </Router>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
