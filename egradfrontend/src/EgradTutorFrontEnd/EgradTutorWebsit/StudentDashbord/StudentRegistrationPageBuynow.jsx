import React, { useEffect, useState } from "react";
import BASE_URL from "../../../apiConfig";
import { useParams } from "react-router-dom";
import StudentRegistationPage from "./StudentRegistationPage";

const StudentRegistrationPageBuynow = () => {
  const { courseCreationId } = useParams();
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);

  const fetchUnPurchasedCourses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/PoopularCourses/unPurchasedCoursesBuyNow/${courseCreationId}`
      );
      const data = await response.json();
      setUnPurchasedCourses(data);
    } catch (error) {
      console.error("Error fetching unpurchased courses:", error);
    }
  };

  useEffect(() => {
    fetchUnPurchasedCourses();
  }, []);

  const coursesByPortalAndExam = unPurchasedCourses.reduce(
    (portals, course) => {
      const portal = course.portal || "Unknown Portal";
      const examName = course.examName || "Unknown Exam";
      if (!portals[portal]) {
        portals[portal] = {};
      }
      if (!portals[portal][examName]) {
        portals[portal][examName] = [];
      }
      portals[portal][examName].push(course);
      return portals;
    },
    {}
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      {Object.entries(coursesByPortalAndExam).map(([portal, exams]) => (
        <div key={portal}>
        
          {Object.entries(exams).map(([examName, courses]) => (
            <div key={examName}>
              <h2>{examName}</h2>
              <div>
                {courses.map((courseExamsDetails) => (
                  <div key={courseExamsDetails.courseCreationId}>
                    <div className="purpleCardHeading">
                      {courseExamsDetails.courseName}
                    </div>
                    <p>
                      <span className={"durationBeforeHover"}> Duration: </span>
                      {formatDate(courseExamsDetails.courseStartDate)}
                      <small
                        style={{
                          textTransform: "capitalize",
                          padding: "0 1px",
                        }}
                      >
                        {" "}
                        to{" "}
                      </small>
                      {formatDate(courseExamsDetails.courseEndDate)}
                    </p>
                    <p>Subject:{courseExamsDetails.subjectNames}</p>
                    <p>Number of Test/Videos avilable:{courseExamsDetails.count}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
   
    </div>
  );
};

export default StudentRegistrationPageBuynow;
