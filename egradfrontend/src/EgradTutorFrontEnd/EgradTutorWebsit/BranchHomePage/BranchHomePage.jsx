import React,{useState} from 'react'
import { Link } from "react-router-dom";
import BHPHeading from "./BHPHeading/BHPHeading";
import BHPNavBar from "./BHPHeading/BHPNavBar";
import BHBanners from "./BranchHomeBanners/BHBanners";
import ExploreExam from "./BHPExploreExams/ExploreExam";
import OurCourses from "./OurCourses/OurCourses";
import Footer from "../Footer/Footer";
import FooterEdit from "../Footer/FooterEdit";
import { Element } from "react-scroll";
const BranchHomePage = ({ isEditMode,Branch_Id }) => {
  const [branches] = useState([]);
  return (
    <div>
      <BHPHeading isEditMode={isEditMode} />
      <BHPNavBar  isEditMode={isEditMode}  Branch_Id={Branch_Id}/>
      <BHBanners  isEditMode={isEditMode}/>
      <h2>{Branch_Id}</h2>
      {branches && branches.length > 0 && (
  branches.map((branch) => (
    <div
      
      key={branch.Branch_Id}
    >
      <p>{branch.Branch_Id}</p>
      <button>
        <Link to={{ pathname: `/BranchHomePage/${branch.Branch_Id}` }}>
          {branch.Branch_Name}
        </Link>
      </button>
    </div>
  ))
)}

      <Element id="ExploreExam">
        <ExploreExam  isEditMode={isEditMode}/>
      </Element>
      <Element id="OurCourses">
        <OurCourses  isEditMode={isEditMode}/>
      </Element>
      <Footer isEditMode={isEditMode}/>
      <FooterEdit isEditMode={isEditMode} />
    </div>
  );
};

export default BranchHomePage;
