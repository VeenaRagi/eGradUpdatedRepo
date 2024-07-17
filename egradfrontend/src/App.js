
// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsite/WebsiteLandingPage/WebSiteLandingPage";
// import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsite/BranchHomePage/BranchHomePage";
// import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsite/ExamHomePage/ExamHomePage";
// import { ThemeProvider } from "./ThemesFolder/ThemeContext/Context";
// import AboutUs from "./EgradTutorFrontEnd/EgradTutorWebsite/WebsiteSubPages/AboutUsPage/AboutUs";
// import ContactUs from "./EgradTutorFrontEnd/EgradTutorWebsite/WebsiteSubPages/ContactUs/ContactUs";
// import LinkPage from "./EgradTutorFrontEnd/EgradTutorWebsite/Footer/LinkPage";
// import FAQ from "./EgradTutorFrontEnd/EgradTutorWebsite/WebsiteSubPages/FAQPage/FAQ";
// import CoursePage from "./EgradTutorFrontEnd/EgradTutorWebsite/CoursePages/CoursePage";
// import ThemesSection from "./ThemesFolder/ThemesSection/ThemesSection";
// import BASE_URL from "./apiConfig.js";
// import NotFound from "./NotFound.jsx";
// import axios from "axios";
 
// import { State } from "./EgradTutorFrontEnd/context/State";
// import Login from "./Login/Login";
// import Register from "./Login/Register";
// import Account_info from "./Login/Account_info";
// import UserRead from "./Login/UserRead";
// import Userupdate from "./Login/Userupdate";
// import Userdeatailedpage from "./Login/Userdeatailedpage";
// import QUiZ_ForgotPassword from "./Login/QUiZ_ForgotPassword";
// import QUIZ_ResetPassword from "./Login/QUIZ_ResetPassword";
// import UgadminHome from "./Login/UgadminHome.js";
 
// import Student_dashboard from "./EgradTutorFrontEnd/Student_Dashboard/Student_dashboard";
// import Student_profileUpdate from "./EgradTutorFrontEnd/Student_Dashboard/Student_profileUpdate";
// import StudentRegistationPage from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/StudentRegistationPage";
// import Payu from "./EgradTutorFrontEnd/Student_Dashboard/Payu/Payu.jsx";
 
// import InstructionPage from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/InstructionPage";
// import General_Intructions_Page from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/General_Intructions_Page";
// import QuizPage from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/QuizPage";
// import QuestionBankQuiz from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/QuestionBankQuiz";
// import TestResultsPage from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/TestResultsPage";
// import Quiz_dashboard from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/Quiz_dashboard";
// import {UserReport} from './EgradTutorFrontEnd/Student_Dashboard/UserReport'
// import ExamUpdataion_admin from "./EgradTutorFrontEnd/Admin_Dashboard/ExamUpdataion_admin";
// import UpdatingCourseInAdmin from "./EgradTutorFrontEnd/Admin_Dashboard/UpdatingCourseInAdmin";
// import TestUpdateadmin from "./EgradTutorFrontEnd/Admin_Dashboard/TestUpdateadmin";
// import TestUpdateForm from "./EgradTutorFrontEnd/Admin_Dashboard/TestUpdateForm";
// import Document_ImageInfo from "./EgradTutorFrontEnd/Admin_Dashboard/Document_ImageInfo";
// import GettinggInstructions from "./EgradTutorFrontEnd/Admin_Dashboard/GettinggInstructions";
// import UpdateInstruction from "./EgradTutorFrontEnd/Admin_Dashboard/ExamUpdataion_admin";
 
// const PrivateRoute = ({ element }) => {
//   const isAuthenticated = localStorage.getItem("isLoggedIn");
//   return isAuthenticated ? element : <Navigate to="/userlogin" />;
// };
 
// const App = () => {
//   const [isEditMode, setIsEditMode] = useState(false);
 
//   useEffect(() => {
//     const checkServerStatus = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/server/status`);
 
//         setServerError(false);
//       } catch (error) {
//         setServerError(true);
//       }
//     };
 
//     checkServerStatus();
//   }, []);
 
 
//   const userRole = localStorage.getItem("userRole");
 
 
//   const toggleEditMode = () => {
//     setIsEditMode(!isEditMode);
//   };
//   const [serverError, setServerError] = useState(false);
//   return (
//     <State>
//       <ThemeProvider>
//         <div>
//           {userRole === "admin" && (
//             <div>
//               <button onClick={toggleEditMode}>
//                 {isEditMode ? "Disable Edit" : "Enable Edit"}
//               </button>
//             </div>
//           )}
//           {/* <ScrollToTop /> */}
//           {serverError ? (
//             <NotFound />
//           ) : (
//             <Router>
//               <Routes>
//                 <Route
//                   path="/"
//                   element={<WebSiteLandingPage isEditMode={isEditMode} />}
//                 />
//                 <Route
//                   path="/BranchHomePage/:Branch_Id"
//                   element={<BranchHomePage isEditMode={isEditMode} />}
//                 />
//                 <Route
//                   path="/ExamHomePage/:EntranceExams_Id"
//                   element={<ExamHomePage isEditMode={isEditMode} />}
//                 />
//                 <Route
//                   path="/CoursePage/:Branch_Id/:Portale_Id"
//                   element={<CoursePage isEditMode={isEditMode} />}
//                 />
//                 <Route
//                   path="/AboutUs"
//                   element={<AboutUs isEditMode={isEditMode} />}
//                 />
//                 <Route path="/ContactUs" element={<ContactUs />} />
//                 <Route path="/Faq" element={<FAQ />} />
//                 <Route path="/linkpage/:Link_Id" element={<LinkPage />} />
 
//                 <Route path="/Error" element={<NotFound />} />
//                 <Route path="/WebsiteAdmin" element={<ThemesSection />} />
 
//                 {/* ==================LOGIN SYSTEM ROUTES START================== */}
//                 <Route path="/Register" element={<Register />} />
//                 <Route path="/Register" element={<Register />} />
//                 <Route path="/userlogin" element={<Login />} />
//                 <Route
//                   path="/Account_info"
//                   element={<PrivateRoute element={<Account_info />} />}
//                 />
//                 <Route
//                   path="/userread/:id"
//                   element={<PrivateRoute element={<UserRead />} />}
//                 />
//                 <Route
//                   path="/Userupdate/:id"
//                   element={<PrivateRoute element={<Userupdate />} />}
//                 />
//                 <Route
//                   path="/userdetails"
//                   element={<PrivateRoute element={<Userdeatailedpage />} />}
//                 />
 
//                 <Route
//                   path="/OTS_ForgotPassword"
//                   element={<QUiZ_ForgotPassword />}
//                 />
//                 <Route
//                   path="/OTS_reset_password/:id/:token"
//                   element={<QUIZ_ResetPassword />}
//                 ></Route>
//                 <Route
//                   path="/UgadminHome"
//                   element={<PrivateRoute element={<UgadminHome />} />}
//                 />
//                 <Route
//                   path="/coursedataSRP/:courseCreationId"
//                   element={<StudentRegistationPage />}
//                 />
//                 <Route path="/PayU/:courseCreationId" element={<Payu />} />
//                 {/* ==================LOGIN SYSTEM ROUTES END================== */}
 
//                 {/* =====================STUDENT DASHBOARD ROUTES START================= */}
//                 <Route
//                   path="/Quiz_dashboard"
//                   element={<PrivateRoute element={<Quiz_dashboard />} />}
//                 />
//                 <Route
//                   path="/Student_dashboard"
//                   element={<PrivateRoute element={<Student_dashboard />} />}
//                 />
//                 <Route
//                   path="/Student_profileUpdate"
//                   element={<PrivateRoute element={<Student_profileUpdate />} />}
//                 />
//                 <Route
//                   path="/feachingcourse/:examId"
//                   element={<PrivateRoute element={<CoursePage />} />}
//                 />
//                 <Route
//                   path="/Instructions/:param1/:param2/:param3"
//                   element={<PrivateRoute element={<InstructionPage />} />}
//                 />
 
//                 <Route
//                   path="/General_intructions_page/:param1/:param2/:param3"
//                   element={
//                     <PrivateRoute element={<General_Intructions_Page />} />
//                   }
//                 />
//                 <Route
//                   path="/QuizPage/questionOptions/:param1/:param2"
//                   element={<PrivateRoute element={<QuizPage seconds={20} />} />}
//                 />
 
//                 <Route
//                   path="/QuestionBankQuiz/questionOptions/:param1/:param2"
//                   element={<PrivateRoute element={<QuestionBankQuiz />} />}
//                 />
//                 <Route
//                   path="/TestResultsPage/:param1/:param2"
//                   element={<PrivateRoute element={<TestResultsPage />} />}
//                 />
//                   <Route
//             path="/UserReport/:id/:testCreationTableId/:courseCreationId"
//             element={<PrivateRoute element={<UserReport />} />}
//           />
//                 <Route
//                   path="/Error"
//                   element={<PrivateRoute element={<NotFound />} />}
//                 />
//                 {/* =====================STUDENT DASHBOARD ROUTES END================= */}
 
//                 {/* =========================ADMIN DASHBOARD ROUTES START=========================== */}
//                 <Route
//                   path="/ExamUpdataion_admin/:examId"
//                   element={<PrivateRoute element={<ExamUpdataion_admin />} />}
//                 />
//                 <Route
//                   path="/UpdatingCourseInAdmin/:courseCreationId/:portalId"
//                   element={<PrivateRoute element={<UpdatingCourseInAdmin />} />}
//                 />
//                 <Route
//                   path="/TestUpdateadmin/:testCreationTableId"
//                   element={<PrivateRoute element={<TestUpdateadmin />} />}
//                 />
//                 <Route
//                   path="/TestUpdateForm/:testCreationTableId/:TestForm_Id"
//                   element={<PrivateRoute element={<TestUpdateForm />} />}
//                 />
//                 <Route
//                   path="/getSubjectData/:testCreationTableId/:subjectId/:sectionId"
//                   element={<PrivateRoute element={<Document_ImageInfo />} />}
//                 />
//                 <Route
//                   path="/Instruction/editIns/:instructionId/"
//                   element={<PrivateRoute element={<GettinggInstructions />} />}
//                 />
//                 <Route
//                   path="/InstructionPage/editIns/:instructionId/:id"
//                   element={<PrivateRoute element={<UpdateInstruction />} />}
//                 />
//                 {/* =========================ADMIN DASHBOARD ROUTES END=========================== */}
//               </Routes>
//             </Router>
//           )}
//         </div>
//       </ThemeProvider>
//     </State>
//   );
// };
 
// export default App;
 
 

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import WebSiteLandingPage from "./EgradTutorFrontEnd/EgradTutorWebsite/WebsiteLandingPage/WebSiteLandingPage";
import BranchHomePage from "./EgradTutorFrontEnd/EgradTutorWebsite/BranchHomePage/BranchHomePage";
import ExamHomePage from "./EgradTutorFrontEnd/EgradTutorWebsite/ExamHomePage/ExamHomePage";
import { ThemeProvider } from "./ThemesFolder/ThemeContext/Context";
import AboutUs from "./EgradTutorFrontEnd/EgradTutorWebsite/WebsiteSubPages/AboutUsPage/AboutUs";
import ContactUs from "./EgradTutorFrontEnd/EgradTutorWebsite/WebsiteSubPages/ContactUs/ContactUs";
import LinkPage from "./EgradTutorFrontEnd/EgradTutorWebsite/Footer/LinkPage";
import FAQ from "./EgradTutorFrontEnd/EgradTutorWebsite/WebsiteSubPages/FAQPage/FAQ";
import CoursePage from "./EgradTutorFrontEnd/EgradTutorWebsite/CoursePages/CoursePage";
import ThemesSection from "./ThemesFolder/ThemesSection/ThemesSection";
import BASE_URL from "./apiConfig.js";
import NotFound from "./NotFound.jsx";
import axios from "axios";
 
import { State } from "./EgradTutorFrontEnd/context/State";
import Login from "./Login/Login";
import Register from "./Login/Register";
import Account_info from "./Login/Account_info";
import UserRead from "./Login/UserRead";
import Userupdate from "./Login/Userupdate";
import Userdeatailedpage from "./Login/Userdeatailedpage";
import QUiZ_ForgotPassword from "./Login/QUiZ_ForgotPassword";
import QUIZ_ResetPassword from "./Login/QUIZ_ResetPassword";
import UgadminHome from "./Login/UgadminHome.js";
 
import Student_dashboard from "./EgradTutorFrontEnd/Student_Dashboard/Student_dashboard";
import Student_profileUpdate from "./EgradTutorFrontEnd/Student_Dashboard/Student_profileUpdate";
import StudentRegistationPage from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/StudentRegistationPage";
import Payu from "./EgradTutorFrontEnd/Student_Dashboard/Payu/Payu.jsx";
 
import InstructionPage from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/InstructionPage";
import General_Intructions_Page from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/General_Intructions_Page";
import QuizPage from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/QuizPage";
import QuestionBankQuiz from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/QuestionBankQuiz";
import TestResultsPage from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/TestResultsPage";
import Quiz_dashboard from "./EgradTutorFrontEnd/Student_Dashboard/Online_Portals/Quiz_dashboard";
import {UserReport} from './EgradTutorFrontEnd/Student_Dashboard/UserReport'
import ExamUpdataion_admin from "./EgradTutorFrontEnd/Admin_Dashboard/ExamUpdataion_admin";
import UpdatingCourseInAdmin from "./EgradTutorFrontEnd/Admin_Dashboard/UpdatingCourseInAdmin";
import TestUpdateadmin from "./EgradTutorFrontEnd/Admin_Dashboard/TestUpdateadmin";
import TestUpdateForm from "./EgradTutorFrontEnd/Admin_Dashboard/TestUpdateForm";
import Document_ImageInfo from "./EgradTutorFrontEnd/Admin_Dashboard/Document_ImageInfo";
import GettinggInstructions from "./EgradTutorFrontEnd/Admin_Dashboard/GettinggInstructions";
import UpdateInstruction from "./EgradTutorFrontEnd/Admin_Dashboard/ExamUpdataion_admin";
 
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn");
  return isAuthenticated ? element : <Navigate to="/userlogin" />;
};
 
const App = () => {
  const [isEditMode, setIsEditMode] = useState(false);
 
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/server/status`);
 
        setServerError(false);
      } catch (error) {
        setServerError(true);
      }
    };
 
    checkServerStatus();
  }, []);
 
 
  const userRole = localStorage.getItem("userRole");
 
 
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  const [serverError, setServerError] = useState(false);
  return (
    <State>
      <ThemeProvider>
        <div>
          {userRole === "admin" && (
            <div>
              <button onClick={toggleEditMode}>
                {isEditMode ? "Disable Edit" : "Enable Edit"}
              </button>
            </div>
          )}
          {/* <ScrollToTop /> */}
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
 
                <Route path="/Error" element={<NotFound />} />
                <Route path="/WebsiteAdmin" element={<ThemesSection />} />
 
                {/* ==================LOGIN SYSTEM ROUTES START================== */}
                <Route path="/Register" element={<Register />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/userlogin" element={<Login />} />
                <Route
                  path="/Account_info"
                  element={<PrivateRoute element={<Account_info />} />}
                />
                <Route
                  path="/userread/:id"
                  element={<PrivateRoute element={<UserRead />} />}
                />
                <Route
                  path="/Userupdate/:id"
                  element={<PrivateRoute element={<Userupdate />} />}
                />
                <Route
                  path="/userdetails"
                  element={<PrivateRoute element={<Userdeatailedpage />} />}
                />
 
                <Route
                  path="/OTS_ForgotPassword"
                  element={<QUiZ_ForgotPassword />}
                />
                <Route
                  path="/OTS_reset_password/:id/:token"
                  element={<QUIZ_ResetPassword />}
                ></Route>
                <Route
                  path="/UgadminHome"
                  element={<PrivateRoute element={<UgadminHome />} />}
                />
                <Route
                  path="/coursedataSRP/:courseCreationId"
                  element={<StudentRegistationPage />}
                />
                <Route path="/PayU/:courseCreationId" element={<Payu />} />
                {/* ==================LOGIN SYSTEM ROUTES END================== */}
 
                {/* =====================STUDENT DASHBOARD ROUTES START================= */}
                <Route
                  path="/Quiz_dashboard"
                  element={<PrivateRoute element={<Quiz_dashboard />} />}
                />
                <Route
                  path="/Student_dashboard"
                  element={<PrivateRoute element={<Student_dashboard />} />}
                />
                <Route
                  path="/Student_profileUpdate"
                  element={<PrivateRoute element={<Student_profileUpdate />} />}
                />
                <Route
                  path="/feachingcourse/:examId"
                  element={<PrivateRoute element={<CoursePage />} />}
                />
                <Route
                  path="/Instructions/:param1/:param2/:param3"
                  element={<PrivateRoute element={<InstructionPage />} />}
                />
 
                <Route
                  path="/General_intructions_page/:param1/:param2/:param3"
                  element={
                    <PrivateRoute element={<General_Intructions_Page />} />
                  }
                />
                <Route
                  path="/QuizPage/questionOptions/:param1/:param2"
                  element={<PrivateRoute element={<QuizPage seconds={20} />} />}
                />
 
                <Route
                  path="/QuestionBankQuiz/questionOptions/:param1/:param2"
                  element={<PrivateRoute element={<QuestionBankQuiz />} />}
                />
                <Route
                  path="/TestResultsPage/:param1/:param2"
                  element={<PrivateRoute element={<TestResultsPage />} />}
                />
                  <Route
            path="/UserReport/:id/:testCreationTableId/:courseCreationId"
            element={<PrivateRoute element={<UserReport />} />}
          />
                <Route
                  path="/Error"
                  element={<PrivateRoute element={<NotFound />} />}
                />
                {/* =====================STUDENT DASHBOARD ROUTES END================= */}
 
                {/* =========================ADMIN DASHBOARD ROUTES START=========================== */}
                <Route
                  path="/ExamUpdataion_admin/:examId"
                  element={<PrivateRoute element={<ExamUpdataion_admin />} />}
                />
                <Route
                  path="/UpdatingCourseInAdmin/:courseCreationId/:portalId"
                  element={<PrivateRoute element={<UpdatingCourseInAdmin />} />}
                />
                <Route
                  path="/TestUpdateadmin/:testCreationTableId"
                  element={<PrivateRoute element={<TestUpdateadmin />} />}
                />
                <Route
                  path="/TestUpdateForm/:testCreationTableId/:TestForm_Id"
                  element={<PrivateRoute element={<TestUpdateForm />} />}
                />
                <Route
                  path="/getSubjectData/:testCreationTableId/:subjectId/:sectionId"
                  element={<PrivateRoute element={<Document_ImageInfo />} />}
                />
                <Route
                  path="/Instruction/editIns/:instructionId/"
                  element={<PrivateRoute element={<GettinggInstructions />} />}
                />
                <Route
                  path="/InstructionPage/editIns/:instructionId/:id"
                  element={<PrivateRoute element={<UpdateInstruction />} />}
                />
                {/* =========================ADMIN DASHBOARD ROUTES END=========================== */}
              </Routes>
            </Router>
          )}
        </div>
      </ThemeProvider>
    </State>
  );
};
 
export default App;
 
 