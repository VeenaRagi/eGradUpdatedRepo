
import React, { useEffect, useState } from "react";
import formFields from "./formFields";
import { useParams } from "react-router-dom";
import BASE_URL from "../../../apiConfig";


const StudentRegistrationForm = () => {
  const { courseCreationId } = useParams(); // Get courseCreationId from URL
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [courseId, setCourseId] = useState("");
  const [formState, setFormState] = useState({
    emailChecked: false,
    emailExists: false,
    contactChecked: false,
    contactExists: false,
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUnPurchasedCourses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/PoopularCourses/unPurchasedCoursesBuyNow/${courseCreationId}`);
        const data = await response.json();
        setUnPurchasedCourses(data);
        if (data.length > 0) {
          setCourseId(data[0].courseCreationId); // Set courseId from fetched data
        }
      } catch (error) {
        console.error("Error fetching unpurchased courses:", error);
      }
    };

    if (courseCreationId) {
      fetchUnPurchasedCourses();
    }
  }, [courseCreationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles({ ...files, [name]: files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('courseCreationId', courseCreationId);

    for (let field in formData) {
      formDataToSend.append(field, formData[field]);
    }

    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/register', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.status === 409) {
        alert('User with this email ID or contact number already exists. Please log in.');
      } else if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        const result = await response.json();
        setUserId(result.userId);
        alert(result.message);
        setIsPopupVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving data');
    }
  };
  const coursesByPortalAndExam = unPurchasedCourses.reduce((portals, course) => {
    const portal = course.portal || "Unknown Portal";
    const examName = course.examName || "Unknown Exam";
    if (!portals[portal]) portals[portal] = {};
    if (!portals[portal][examName]) portals[portal][examName] = [];
    portals[portal][examName].push(course);
    return portals;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  return (
    <div>
      {courseCreationId && unPurchasedCourses.length > 0 && (
        <div>
          <h2>Course Details</h2>
          {Object.entries(coursesByPortalAndExam).map(([portal, exams]) => (
            <div key={portal}>
              {Object.entries(exams).map(([examName, courses]) => (
                <div key={examName}>
                  <h2>{examName}</h2>
                  <div>
                    {courses.map((courseExamsDetails) => (
                      <div key={courseExamsDetails.courseCreationId}>
                        <div className="purpleCardHeading">{courseExamsDetails.courseName}</div>
                        <p>
                          <span className="durationBeforeHover"> Duration: </span>
                          {formatDate(courseExamsDetails.courseStartDate)}
                          <small style={{ textTransform: "capitalize", padding: "0 1px" }}> to </small>
                          {formatDate(courseExamsDetails.courseEndDate)}
                        </p>
                        <p>Subject: {courseExamsDetails.subjectNames}</p>
                        <p>Number of Test/Videos available: {courseExamsDetails.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
       <form onSubmit={handleFormSubmit}>
        {formFields.map((section, index) => (
          <div key={index}>
            <h3>{section.sectionTitle}</h3>
            {section.fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === "select" ? (
                  <select name={field.name} onChange={handleChange}>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <button type="submit">
          {courseCreationId ? "Submit and Buy Now" : "Register"}
        </button>
      </form>
      {isPopupVisible && (
        <div className="popup">
          <h2>Registration Successful!</h2>
          <button onClick={() => window.location.href = "/buy-courses"}>Buy Courses</button>
          <button onClick={() => window.location.href = "/login"}>Login</button>
        </div>
      )}
    </div>
  );
};

export default StudentRegistrationForm;