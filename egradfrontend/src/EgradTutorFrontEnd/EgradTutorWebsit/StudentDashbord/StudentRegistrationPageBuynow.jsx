import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../../../apiConfig";
import formFields from './formFields';
import StudentRegistrationFormFields from './StudentRegistationFormFileds';
import './Style/Registrationform.css';

const StudentRegistrationPageBuynow = () => {
  const { courseCreationId } = useParams();
  const [unPurchasedCourses, setUnPurchasedCourses] = useState([]);
  const [formState, setFormState] = useState({
    emailExists: false,
    contactExists: false,
    emailChecked: false,
    contactChecked: false,
    showModal: false,
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
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

    fetchUnPurchasedCourses();
  }, [courseCreationId]);

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

  const checkUserExistence = async (field, value) => {
    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (name === 'emailId' || name === 'contactNo') {
      const exists = await checkUserExistence(name, value);
      if (name === 'emailId') {
        setFormState((prevState) => ({ ...prevState, emailExists: exists, emailChecked: true }));
        if (exists) alert('Email ID already exists. Please log in.');
      } else if (name === 'contactNo') {
        setFormState((prevState) => ({ ...prevState, contactExists: exists, contactChecked: true }));
        if (exists) alert('Contact number already exists. Please log in.');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const requiredFields = [
      'candidateName', 'dateOfBirth', 'Gender', 'Category', 'emailId', 'confirmEmailId', 'contactNo',
      'fatherName', 'occupation', 'mobileNo', 'line1', 'state', 'districts', 'pincode',
      'qualification', 'NameOfCollege', 'passingYear', 'marks', 'photo', 'signature', 'Proof'
    ];

    for (let field of requiredFields) {
      if (!formData.get(field)) {
        alert(`Please fill the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return;
      }
    }

    const emailId = formData.get('emailId');
    const confirmEmailId = formData.get('confirmEmailId');
    if (emailId.toLowerCase() !== confirmEmailId.toLowerCase()) {
      alert('Email and Confirm Email fields do not match');
      return;
    }

    if (formState.emailChecked && formState.emailExists) {
      alert('Email ID already exists. Please log in.');
      return;
    }
    if (formState.contactChecked && formState.contactExists) {
      alert('Contact number already exists. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/register', {
        method: 'POST',
        body: formData,
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

  const handleClosePopup = () => setIsPopupVisible(false);

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
      <form onSubmit={handleFormSubmit}>
        <StudentRegistrationFormFields onBlur={handleBlur} fields={formFields} />
        <button type="submit" onClick={() => setFormState({ ...formState, showModal: true })}>
          Submit With Course ID
        </button>
      </form>
      {isPopupVisible && (
        <div className="popup show">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Registration Successful</h2>
              <span className="popup-close" onClick={handleClosePopup}>&times;</span>
            </div>
            <div className="popup-body">
              <p>You have successfully registered!</p>
              <p>Please reset your password with the code sent to your registered email ID.</p>
            </div>
            <div className="popup-footer">
              <button className="popup-button" onClick={() => window.location.href = `/login/${userId}`}>Login</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRegistrationPageBuynow;
