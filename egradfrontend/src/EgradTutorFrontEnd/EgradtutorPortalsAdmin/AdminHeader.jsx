import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
// import axios from '../../api/axios';
import BASE_URL from '../../apiConfig';
import { IoHome } from "react-icons/io5";
import { ThemeContext } from '../../ThemesFolder/ThemeContext/Context';
import JSONClasses from '../../ThemesFolder/JSONForCSS/JSONClasses';
import axios from 'axios';
const AdminHeader = ({userRole}) => {
    const { EntranceExams_Id } = useParams();
    const [entranceExam, setEntranceExam] = useState([]);
    const [image, setImage] = useState(null);
    const themeFromContext = useContext(ThemeContext);
  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")
    useEffect(() => {
      const fetchEntranceExam = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/ExamInfo/feachingentrance_exams/${EntranceExams_Id}`
          );
          console.log("Entrance Exam Data:", response.data);
          setEntranceExam(response.data);
        } catch (error) {
          console.error("Error fetching entrance exam:", error);
        }
      };
      fetchEntranceExam();
    }, [EntranceExams_Id]);
  
    const fetchImage = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Logo/image`, {
          responseType: "arraybuffer",
        });
        const imageBlob = new Blob([response.data], { type: "image/png" });
        const imageUrl = URL.createObjectURL(imageBlob);
        setImage(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    useEffect(() => {
      fetchImage();
    }, []);
  
  return (
    <div>
        <div className={`Ug_examsPage_Main_Container ${themeDetails.themeExamPageHeaderMainContainer}`}>
      <div className={`Ug_examsPage_Container ${themeDetails.themeExamPageHeaderContainer}`}>
      {themeColor==='Theme-2' ? 
       <>
         {image ? (
        <Link to="/" className='t2LinkToLandingPage'>
          <img
            src={image}
            className={`${themeDetails.themeLogoImg}`}
            alt="Current"
          />
        </Link>
      ) : userRole === 'user' ? (
        <p>Unable to load the image at the moment. Please try again later.</p>
      ) : userRole === 'admin' ? (
        <p>No image available. Please upload an image to be displayed.</p>
      ) : (
        <p>Image could not be loaded. Please contact support if this issue persists.</p>
      )}
       </>
      :
      <>
      {image ? (
        <Link to="/">
          <img
            src={image}
            className={`${themeDetails.themeLogoImg}`}
            alt="Current"
          />
        </Link>
      ) : userRole === 'user' ? (
        <p>Unable to load image at the moment. Please try again later.</p>
      ) : userRole === 'admin' ? (
        <p>No image available. Please upload an image.</p>
      ) : (
        <p>No image available. Please contact support if this issue persists.</p>
      )}
        </>
        }
        {entranceExam.length > 0 &&
        entranceExam.map((exam) => (
          <div key={exam.EntranceExams_Id} className={`exampage_heading JEEHeading ${themeDetails.themeExamPageHeaderHeading}`}>
          <Link to={`/BranchHomePage/${exam.Branch_Id}`}><IoHome />Home</Link>
          </div>
        ))}
        
      </div>
    {/* <div className={`total_exam_page ${themeDetails.themeTotalExamContainer}`}>
    {entranceExam.length > 0 ? (
        entranceExam.map((exam) => (
          <div
            key={exam.EntranceExams_Id}
            className={`exampage_heading JEEHeading ${themeDetails.themeExamPageHeaderHeading}`}
          >
            <h1>{exam.EntranceExams_name} EXAM</h1>
          </div>
        ))
      ) : userRole === 'user' ? (
        <p>No entrance exam information available at the moment. Please check back later.</p>
      ) : userRole === 'admin' ? (
        <p>No entrance exams found. Please add the necessary exam details.</p>
      ) : (
        <p>No entrance exam information available. Please contact support if this issue persists.</p>
      )}
    </div> */}
    </div>
    </div>
  )
}

export default AdminHeader