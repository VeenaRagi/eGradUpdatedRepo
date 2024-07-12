const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5001;
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Endpoint to check server status
app.get('/api/server/status', (req, res) => {
  res.send({ status: 'Server is running' });
});

const Logo = require("./EgradTutorWebsite/Logo");
app.use("/Logo", Logo);

const LoginApis = require("./LoginApis");
app.use("/LoginApis", LoginApis);

const LandingPageHeader = require("./EgradTutorWebsite/LandingPage/LandingPageHeader");
app.use("/LandingPageHeader", LandingPageHeader);

const LandingPageHeaderEdit = require("./EgradTutorWebsite/LandingPage/LandingPageHeaderEdit");
app.use("/LandingPageHeaderEdit", LandingPageHeaderEdit);

const LandingPageExamData = require("./EgradTutorWebsite/LandingPage/LandingPageExamData");
app.use("/LandingPageExamData", LandingPageExamData);

const BHPNavBar = require("./EgradTutorWebsite/BranchHomePage/BHPNavBar");
app.use("/BHPNavBar", BHPNavBar);

const OueCourses = require("./EgradTutorWebsite/BranchHomePage/OueCourses");
app.use("/OueCourses", OueCourses);

const OurCourseedit = require("./EgradTutorWebsite/BranchHomePage/OurCourseedit");
app.use("/OurCourseedit", OurCourseedit);

const ExploreExam = require("./EgradTutorWebsite/BranchHomePage/ExploreExam");
app.use("/ExploreExam", ExploreExam);

const ExploreExamEdit = require("./EgradTutorWebsite/BranchHomePage/ExploreExamEdit");
app.use("/ExploreExamEdit", ExploreExamEdit);

const BHPNavBarEdit = require("./EgradTutorWebsite/BranchHomePage/BHPNavBarEdit");
app.use("/BHPNavBarEdit", BHPNavBarEdit);


const ContactUs = require("./EgradTutorWebsite/ContactUs/ContactUs");
app.use("/ContactUs", ContactUs);
const Webbanners = require("./EgradTutorWebsite/ExamPage/Webbanners");
app.use("/Webbanners", Webbanners);

const ExampagePortals = require("./EgradTutorWebsite/ExamPage/ExampagePortals");
app.use("/ExampagePortals", ExampagePortals);

const ExamInfoEdit = require("./EgradTutorWebsite/ExamPage/ExamInfoEdit");
app.use("/ExamInfoEdit", ExamInfoEdit);

const ExamInfo = require("./EgradTutorWebsite/ExamPage/ExamInfo");
app.use("/ExamInfo", ExamInfo);

const Faq = require("./EgradTutorWebsite/FAQs/Faq");
app.use("/Faq", Faq);

const FaqEdit = require("./EgradTutorWebsite/FAQs/FaqEdit");
app.use("/FaqEdit", FaqEdit);

const AboutUs = require("./EgradTutorWebsite/AboutUs/AboutUs");
app.use("/AboutUs", AboutUs);
const AboutUsEdit = require("./EgradTutorWebsite/AboutUs/AboutUsEdit");
app.use("/AboutUsEdit", AboutUsEdit);

const themesSection=require('./ThemesAPIs/ThemesAPIs')
app.use('/themesSection',themesSection);

const Footer = require("./EgradTutorWebsite/Footer/Footer");
app.use("/Footer", Footer);

const FooterEdit = require("./EgradTutorWebsite/Footer/FooterEdit");
app.use("/FooterEdit", FooterEdit);

const CoursePageHeaderEdit = require("./EgradTutorWebsite/CoursePage/CoursePageHeaderEdit");
app.use("/CoursePageHeaderEdit", CoursePageHeaderEdit);


const WhychooseUsEdit = require("./EgradTutorWebsite/CoursePage/WhychooseUsEdit");
app.use("/WhychooseUsEdit", WhychooseUsEdit);

const PoopularCourses = require("./EgradTutorWebsite/CoursePage/PoopularCourses");
app.use("/PoopularCourses", PoopularCourses);

const StudentRegistationPage = require("./EgradTutorWebsite/StudentDashbord/StudentRegistationPage");
app.use("/StudentRegistationPage", StudentRegistationPage);
// courseTab
const courseTab=require('./EgradTutorWebsite/CourseTabsAPIS/CourseTabs')
app.use('/courseTab',courseTab);

const Login = require("./EgradTutorWebsite/LoginSystem/Login");
app.use("/Login", Login);



const LandingPageExamEdit = require("./EgradTutorWebsite/LandingPage/LandingPageExamEdit");
app.use("/LandingPageExamEdit", LandingPageExamEdit);

const PayU = require("./PaymentGatway/PayU");
app.use("/PayU", PayU);




const Dashboard = require("./OTS_Quiz_Admin/Dashbord");
app.use("/Dashboard", Dashboard);

const ExamCreation = require("./OTS_Quiz_Admin/ExamCreation");
app.use("/ExamCreation", ExamCreation);

const CoureseCreation = require("./OTS_Quiz_Admin/CoureseCreation");
app.use("/CoureseCreation", CoureseCreation);

const InstructionCreation = require('./OTS_Quiz_Admin/InstructionCreation')
app.use("/InstructionCreation", InstructionCreation);


const TestCreation = require('./OTS_Quiz_Admin/TestCreation')
app.use("/TestCreation", TestCreation);

const DocumentUpload =require('./OTS_Quiz_Admin/DocumentUpload')
app.use("/DocumentUpload", DocumentUpload);

const ImageUpload =require('./OTS_Quiz_Admin/ImageUpload')
app.use("/ImageUpload", ImageUpload);

const TestActivationPage =require('./OTS_Quiz_Admin/TestActivationPage')
app.use("/TestActivationPage", TestActivationPage);

const DoubtSection =require('./eGradTutorStudentDashboard/DoubtSection')
app.use("/DoubtSection",DoubtSection)


const Portal_coures_creation_admin=require('./OTS_Quiz_Admin/Portal_coures_creation_admin')
app.use('/Portal_coures_creation_admin',Portal_coures_creation_admin)

const OtsvidesUploads =require('./OTS_Quiz_Admin/OtsvidesUploads')
app.use("/OtsvidesUploads",OtsvidesUploads)

const ughomepage_banner_login =require("./OTS_Quiz_Admin/ughomepage_banner_login")

app.use("/ughomepage_banner_login" , ughomepage_banner_login)

//================OTS_QUIZAPP_IMPORTS_START=================
const ExamPage = require("./eGradTutorStudentDashboard/ExamPage");
const Exam_Course_Page = require("./eGradTutorStudentDashboard/Exam_Course_Page");
const CoursePage = require("./eGradTutorStudentDashboard/CoursePage");
const TestPage = require("./eGradTutorStudentDashboard/TestPage");
const InstructionPage = require("./eGradTutorStudentDashboard/InstructionPage");
const QuizPage = require("./eGradTutorStudentDashboard/QuizPage");
const TestResultPage = require("./eGradTutorStudentDashboard/TestResultPage");
const Myresult =require("./eGradTutorStudentDashboard/Myresult")
const studentSettings=require('./eGradTutorStudentDashboard/StudentSettings')
//================OTS_QUIZAPP_IMPORTS_END==================
 
//================OTS_QUIZAPP_ROUTES_START==================
app.use("/ExamPage", ExamPage);
app.use("/Exam_Course_Page", Exam_Course_Page);
app.use("/CoursePage", CoursePage);
app.use("/TestPage", TestPage);
app.use("/InstructionPage", InstructionPage);
app.use("/QuizPage", QuizPage);
app.use("/TestResultPage", TestResultPage);
app.use("/Myresult",Myresult);
app.use('/studentSettings',studentSettings)
//================OTS_QUIZAPP_ROUTES_END===============

// ---------------student setting api routs------------




// ----------------------------------------------------


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
