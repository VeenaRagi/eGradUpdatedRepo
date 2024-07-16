const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
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
// app.use(express.static('uploads'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Endpoint to check server status
app.get('/api/server/status', (req, res) => {
  res.send({ status: 'Server is running' });
});

const Logo = require("./EgradTutorWebsite/Logo");
app.use("/Logo", Logo);

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

// courseTab
const courseTab=require('./EgradTutorWebsite/CourseTabsAPIS/CourseTabs')
app.use('/courseTab',courseTab);

const LandingPageExamEdit = require("./EgradTutorWebsite/LandingPage/LandingPageExamEdit");
app.use("/LandingPageExamEdit", LandingPageExamEdit);

const EncrypDecryp = require("./UrlConversion/EncrypDecryp");
// require('dotenv').config();

// app.use(bodyParser.json());
app.use('/EncrypDecryp', EncrypDecryp);


//***************************************************************OTS_QUIZ APP ******************************/
const CoursePage =require("./OTS_QuizApp/CoursePage");
app.use('/CoursePage',CoursePage)

const Exam_Course_Page=require("./OTS_QuizApp/Exam_Course_Page");
app.use('/Exam_Course_Page',Exam_Course_Page);

const ExamPage=require("./OTS_QuizApp/ExamPage");
app.use('/ExamPage',ExamPage)

const InstructionPage=require("./OTS_QuizApp/InstructionPage");
app.use("/InstructionPage",InstructionPage)

const QuizPage=require("./OTS_QuizApp/QuizPage");
app.use("/QuizPage",QuizPage);

const StudentRegistationPage=require("./OTS_QuizApp/StudentRegistationPage");
app.use("/StudentRegistationPage",StudentRegistationPage);

const TestPage=require("./OTS_QuizApp/TestPage")
app.use("/TestPage",TestPage);

const TestResultPage=require("./OTS_QuizApp/TestResultPage");
app.use("/TestResultPage",TestResultPage);


//********************************************* */

const PayU=require("./PayU/PayU");
app.use("/PayU",PayU);

const CoureseCreation=require("./OTS_Quiz_Admin/CoureseCreation");
app.use("/CoureseCreation",CoureseCreation);

const Dashbord=require("./OTS_Quiz_Admin/Dashbord");
app.use("/Dashbord",Dashbord);

const DocumentUpload=require("./OTS_Quiz_Admin/DocumentUpload");
app.use("/DocumentUpload",DocumentUpload);

const ExamCreation=require("./OTS_Quiz_Admin/ExamCreation");
app.use("/ExamCreation",ExamCreation)

const ImageUpload=require("./OTS_Quiz_Admin/ImageUpload");
app.use("/ImageUpload",ImageUpload);

const InstructionCreation=require("./OTS_Quiz_Admin/InstructionCreation");
app.use("/InstructionCreation",InstructionCreation);

const Portal_coures_creation_admin=require("./OTS_Quiz_Admin/Portal_coures_creation_admin");
app.use("/Portal_coures_creation_admin",Portal_coures_creation_admin);

const TestActivationPage=require("./OTS_Quiz_Admin/TestActivationPage");
app.use("/TestActivationPage",TestActivationPage);

const TestCreation=require("./OTS_Quiz_Admin/TestCreation")
app.use("/TestCreation",TestCreation);


const OtsvidesUploads =require('./OVL_Admin/OtsvidesUploads')
app.use("/OtsvidesUploads",OtsvidesUploads)

const OVL_ExamCreation =require('./OVL_Admin/OVL_ExamCreation')
app.use("/OVL_ExamCreation",OVL_ExamCreation)
 
const OVL_CourseCreation =require('./OVL_Admin/OVL_CourseCreation')
app.use('/OVL_CourseCreation',OVL_CourseCreation)

const OVL_Landing_page=require('./OVL_Admin/OVL_Landing_page')
app.use('/OVL_Landing_page',OVL_Landing_page)


const PQB_Landing_page=require('./PracticeQuestionBank/PQB_Landing_page')
app.use('/PQB_Landing_page',PQB_Landing_page)


//___________________________________________________________________________student Dashbord_______________________________________________

const Myresult =require('./StudentDashbord/Myresult')

app.use("/Myresult",Myresult)
 

const Bookmark = require('./StudentDashbord/Bookmark')
app.use("/Bookmark", Bookmark)

const DoubtSection =require('./StudentDashbord/DoubtSection')
app.use("/DoubtSection",DoubtSection)

const Student_Portals =require('./StudentDashbord/Student_Portals')
app.use('/Student_Portals',Student_Portals)

const ughomepage_banner_login = require("./Website_Admin/ughomepage_banner_login");
app.use("/ughomepage_banner_login", ughomepage_banner_login);
 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
