import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from '../../src/apiConfig'
import { Link, useParams } from "react-router-dom";
import logo from "./asserts/logo.jpeg";
import { FooterData } from "./Data/Data";

const CoursePage = () => {
  const { examId, examName } = useParams();
  const [courseCard, setCourseCard] = useState([]);
  const [noOfTests, setNoOfTests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/CoursePage/feachingcourse/${examId}`
        );
        setCourseCard(response.data);
        console.log(examId);
        console.log("API Response:", response.data); // Log the API response
        const courseResponse = await fetch(
          `${BASE_URL}/CoursePage/Test/count`
        );
        if (!courseResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const courseData = await courseResponse.json();
        setNoOfTests(courseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [examId]);

  const currentDate = new Date(); // Get the current date

  // Filter exams based on start and end dates
  const filteredCourses = courseCard.filter(
    (courseDetails) =>
      new Date(courseDetails.courseStartDate) <= currentDate &&
      currentDate <= new Date(courseDetails.courseEndDate)
  );

  console.log("Exam ID:", examId); // Log the examId
  console.log("Course Card State:", courseCard); // Log the courseCard state

  return (
    <div>
      <div className="quiz_header">
        <div className="header_logo" >
        <img className="header_logo" src={logo} alt="logo" width={200} />
        </div>
        <div className="course_page_header_for_Q">
       
        {courseCard.length > 0 && (
          <h2 >
            {courseCard[0].examName}
          </h2>
        )}
      </div>
        </div>
    
 
  

      <div className="container_H100">
        <h1>Courses</h1>

        <ul className="card_container">
          {filteredCourses.map((courseDetails) => (
            <div key={courseDetails.courseCreationId} className="first_card">
              <img
                src={courseDetails.cardimeage}
                alt={courseDetails.examName}
              />

              <h3>{courseDetails.courseName}</h3>
              <div className="card_container_info">
                <li>
                  Validity: ({courseDetails.courseStartDate}) to (
                  {courseDetails.courseEndDate})
                </li>
                <li>Cost: {courseDetails.cost}</li>
              
                <li>
                  {noOfTests.map(
                    (count) =>
                      count.courseCreationId ===
                        courseDetails.courseCreationId && (
                        <p key={count.courseCreationId}>
                          No of Tests: {count.numberOfTests}
                        </p>
                      )
                  )}
                </li>
              </div>

              <br />
              <div className="start_now">
                <Link to={`/Test_List/${courseDetails.courseCreationId}`}>
                  
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </ul>
      </div>

      <Footer />
    </div>
  );
};

export default CoursePage;

export const Footer = () => {
  return (
    <div className="footer-container footerBg">
      <footer className="footer">
        {FooterData.map((footerItem, footerIndex) => {
          return (
            <div key={footerIndex} className={footerItem.footerCLass}>
              <h4 className={footerItem.footerCs}>{footerItem.fotterTitles}</h4>
              <p>{footerItem.text}</p>

              <ul>
                <a href={footerItem.PrivacyPolicy}>
                  <li>{footerItem.home}</li>
                </a>

                <a href={footerItem.TermsAndConditions}>
                  <li>{footerItem.about}</li>
                </a>

                <a href={footerItem.RefundPolicy}>
                  <li>
                    {footerItem.career}
                    {footerItem.icon}
                  </li>
                </a>
              </ul>

              <div className="icontsFooter">
                <i id="footerIcons" className={footerItem.fb}></i>
                <i id="footerIcons" className={footerItem.insta}></i>
                <i id="footerIcons" className={footerItem.linkedin}></i>
                <i id="footerIcons" className={footerItem.youtube}></i>
              </div>
            </div>
          );
        })}
      </footer>
      <div
        className=" footer-linkss"
        style={{
          textAlign: "center",
          borderTop: "1px solid #fff",
          paddingTop: "10px",
          paddingBottom: "10px",
          color: "#fff",
        }}
      >
        {" "}
        <p style={{ margin: "0 auto" }}>
          Copyright © 2023 eGradTutor All rights reserved
        </p>
      </div>
    </div>
  );
};
