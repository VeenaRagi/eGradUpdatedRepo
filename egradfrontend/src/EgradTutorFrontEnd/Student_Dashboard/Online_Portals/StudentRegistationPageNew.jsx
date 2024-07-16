import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import noimg from "./asserts/NoImages.jpg";
import "./styles/StudentRegistationPage.css";
import { Link } from "react-router-dom";
import BASE_URL from "../../src/apiConfig";

const StudentRegistationPageNew = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();
  const { CourseData_Id } = useParams();
  // const [userData, setUserData] = useState(null);
  //#endregion
  // useEffect(() => {
  //   const checkLoggedIn = () => {
  //     const loggedIn = localStorage.getItem("isLoggedIn");
  //     if (loggedIn === "true") {
  //       setIsLoggedIn(true);
  //       fetchUserData();
  //       redirectToPayU();
  //     }
  //   };
  //   checkLoggedIn();
  // }, []);


  const [userData, setUserData] = useState({});
  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        fetchUserData();
        redirectToPayU();
      }
    };
    checkLoggedIn();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/ughomepage_banner_login/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Token is expired or invalid, redirect to login page
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        // Navigate("/uglogin"); // Assuming you have the 'navigate' function available

        return;
      }

      if (response.ok) {
        // Token is valid, continue processing user data
        const userData = await response.json();
        setUserData(userData);
        // ... process userData
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  console.log(userData)
useEffect(() => {
  fetchUserData(); // Fetch user data when the component mounts
}, []); 

  const redirectToPayU = () => {
    navigate(`/Payu/${CourseData_Id}`); // Direct the logged-in user to the PayU page
  };


  return (
    <div>
      {isLoggedIn ? (
        <div>Redirecting to PayU...</div> // This component will not be visible due to the redirect
      ) : (
        <StudentRegistrationPagebeforelogin /> // Show the registration form for non-logged-in users
      )}
    </div>
  );
};

export default StudentRegistationPageNew;

export const DisplayFormData = ({
  formData,
  getGenderName,
  getCategoryName,
  getStateName,
  getDistrictName,
//   getBatchName,
  getQualification,
  onSubmit,
  onBack,
}) => {
  const { CourseData_Id, courseCreationId } = useParams();
  const [courseData, setCourseData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    fetchcourse();
  }, [CourseData_Id, courseCreationId]);

  const fetchcourse = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/StudentRegistationPage/coursedataSRP/${CourseData_Id}`
      );
      const data = await response.json();
      setCourseData(data);
    } catch (error) {
      setErrorMessage(errorMessage);

      console.log(errorMessage);

      console.error("Error fetching course data:", error);
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Close</button>
        </div>
      )}

      <div className="preview_continwer">
        <div className="studebtreg_from_container">
          <div>
            <h2 className="srp_heading">PERSONAL DETAILS</h2>
            <div>
              <p>CANDIDATE NAME: {formData.candidateName}</p>
              <p>DATE OF BIRTH: {formData.dateOfBirth}</p>
              <p>GENDER: {getGenderName(formData.GenderId)}</p>
              <p>CATEGORY:{getCategoryName(formData.categor)}</p>
              <p>EMAIL ID:{formData.emailId}</p>
              <p>CONTACT NO:{formData.contactNo} </p>
              <h2 className="srp_heading"> FATHER'S/GUARDIAN'S DETAILS </h2>
              <p> FATHER'S NAME:{formData.fatherName}</p>
              <p>OCCUPATION:{formData.occupation}</p>
              <p>MOBILE NO:{formData.mobileNo}</p>
              <h2 className="srp_heading">COMMUNICATION ADDRESS</h2>
              <p>LINE1:{formData.line1}</p>
              <p>SELECTED A STATE: {getStateName(formData.state_id)}</p>
              <p>
                SELECTED A DISTRICT: {getDistrictName(formData.districts_id)}
              </p>
              <p>PINCODE:{formData.pincode}</p>
            </div>
          </div>

          <div>
            <h2 className="srp_heading">COURSE DETAILS</h2>
            {courseData.map((course) => (
              <div
                className="inputContent_courseData"
                key={course.courseCreationId || course.OVL_Course_Id}
              >
                <p>EXAM: {course.examName}</p>
                <p>SESSION: {course.courseYear}</p>
                <p>COURSE: {course.courseName}</p>
                <p>SUBJECTS :{course.subjects.join(", ")}</p>
              </div>
            ))}
            {/* <p>BATCH:{getBatchName(formData.BatchId)}</p> */}
            <h2 className="srp_heading">EDUCATION DETAILS</h2>
            <p>QUALIFICATION:{getQualification(formData.edStatusId)}</p>
            <p>NAME OF COLLEGE (WITH CITY):{formData.NameOfCollege}</p>
            <p>PASSING YEAR:{formData.passingYear}</p>
            <p>MARKS IN %:{formData.marks}</p>
          </div>
        </div>
        <div className="from_submit">
          <section htmlFor="">
            <button className="btnSubmit_payNow" onClick={onSubmit}>
              Pay Now
            </button>

            <button className="btnSubmit_back" onClick={onBack}>
              Back
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};


//beforelogin
export const StudentRegistrationPagebeforelogin =() =>{
  const PAYU_BASE_URL = "https://pmny.in/XrXjh1F1ELVq";
  const navigate = useNavigate();
  const { CourseData_Id, courseCreationId } = useParams();
  const [courseData, setCourseData] = useState([]);
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedGenderId, setSelectedGenderId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selecteddistrict, setSelecteddistrict] = useState("");

  const [Qualifications, setQualifications] = useState([]);
  const [selectedQualification, setselectedQualification] = useState("");
  const [displayFormData, setDisplayFormData] = useState(null);
  const formRef = useRef(null);
  const [missingFields, setMissingFields] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //#endregion
  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        fetchUserData();
      }
    };
    checkLoggedIn();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        setIsLoggedIn(false);

        return;
      }

      if (response.ok) {
        const userData = await response.json();
        setFormData(formData);
        // ... process userData
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const [formData, setFormData] = useState({
    candidateName: "",
    dateOfBirth: "",
    emailId: "",
    confirmEmailId: "",
    contactNo: "",
    GenderId: "",
    CategoryId: "",
    fatherName: "",
    occupation: "",
    mobileNo: "",
    line1: "",
    state_id: "",
    districts_id: "",
    pincode: "",
    edStatusId: "",
    NameOfCollege: "",
    passingYear: "",
    marks: "",
  });
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFileState((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };
  const [fileState, setFileState] = useState({
    files1: "",
    filess: "",
    filess3: "",
  });

  useEffect(() => {
    fetchGenders();
    fetchCategories();
  }, []);

  const fetchGenders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/StudentRegistationPage/gender`);
      const data = await response.json();
      setGenders(data);
    } catch (error) {
      console.error("Error fetching gender data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/StudentRegistationPage/Category`
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching Category  data:", error);
    }
  };



  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/StudentRegistationPage/Qualifications`
        ); // Adjust the endpoint URL based on your backend setup
        setQualifications(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchQualifications();
  }, []);
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/StudentRegistationPage/states`
        ); // Adjust the endpoint URL based on your backend setup
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchState();
  }, []);

  const handleStateChange = async (event) => {
    const state_id = event.target.value;
    setSelectedState(state_id);

    try {
      const response = await axios.get(
        `${BASE_URL}/StudentRegistationPage/districts/${state_id}`
      );
      setDistricts(response.data);
      setSelecteddistrict("");
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handledistrictChange = (event) => {
    const value = event.target.value;
    setSelecteddistrict(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      districts_id: value,
    }));
  };



  const handleQualificationChange = (event) => {
    const value = event.target.value;
    console.log("Selected Qualification:", value);
    setselectedQualification(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      edStatusId: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "gender") {
      console.log("Selected Gender:", value);
      setSelectedGenderId(value);
    } else if (name === "category") {
      console.log("Selected Category:", value);
      setSelectedCategoryId(value);
    } else if (name === "state_id") {
      console.log("Selected State:", value);
      setSelectedState(value);
    } else if (name === "districts_id") {
      console.log("Selected District:", value);
      setSelecteddistrict(value);
    } else if (name === "edStatusId") {
      console.log("Selected Qualification:", value);
      setselectedQualification(value, () => {
        // Ensure that formData.edStatusId is also set
        setFormData((prevFormData) => ({
          ...prevFormData,
          edStatusId: value,
        }));
      });
    }

    // Additional field validations

    if (name === "passingYear") {
        const yearRegex = /^\d{4}$/; // Ensure it only accepts four digits
        if (value.length > 4) {
          alert("Passing Year must be a four-digit number.");
          return; // Prevent invalid state update
        }
        if (value.length === 4 && !yearRegex.test(value)) {
          alert("Passing Year must be a four-digit number.");
          return;
        }
      }

      if (name === "marks") {
        const marksRegex = /^(100|[1-9]?[0-9])$/;
        if (value && !marksRegex.test(value)) {
          alert("Marks must be a number between 0 and 100.");
          return;
        }
      }

    if (name === "pincode") {
      const pincodeRegex = /^\d{0,6}$/; // Up to six digits

      if (!pincodeRegex.test(value)) {
        alert("Pincode must be a six-digit number.");
      }
    }

    // Always update the formData with the new value
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchcourse();
  }, [CourseData_Id, courseCreationId]);

  const fetchcourse = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/StudentRegistationPage/coursedataSRP/${CourseData_Id}`
      );
      const data = await response.json();
      setCourseData(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const [buttonClicked, setButtonClicked] = useState(false);
  const handleDisplayData = async (e) => {
    e.preventDefault();
    setButtonClicked(true);

    const missingFieldsList = Object.keys(formData).filter(
      (key) =>
        formData[key] === "" && formRef.current[key]?.hasAttribute("required")
    );

    if (missingFieldsList.length === 0) {
      try {
        const response = await axios.get(
          `http://localhost:5001/StudentRegistationPage/data/${CourseData_Id}/${formData.emailId}`
        );

        setData(response.data);

        const allFilesChosen = Object.values(fileState).every((file) => file);

        const isEmailValid = /^[^@]+@\w+(\.\w+)+\w$/.test(
          formData.emailId,
          formData.confirmEmailId
        );
        if (!isEmailValid) {
          alert('Email should not contain "@" character.');
          return;
        }
        if (formData.emailId !== formData.confirmEmailId) {
          alert("Email and Confirm Email should be the same.");
          return;
        }

        const isIndianMobileNumber = (number) => {
          // Regular expression for Indian mobile numbers
          const regex = /^[6-9]\d{9}$/;
          return regex.test(number);
        };
        if (!isIndianMobileNumber(formData.mobileNo)) {
          alert("Please enter a valid  mobile number.");
          return;
        }
        if (!isIndianMobileNumber(formData.contactNo)) {
          alert("Please enter a valid  contact number.");
          return;
        }

        if (!allFilesChosen) {
          alert("UPLOAD IMAGE DOCUMENTS.");
          return;
        }
        if (!selectedState) {
          alert("Please select a STATE.");
          return;
        }
        if (!selecteddistrict) {
          alert("Please select a DISTRICT.");
          return;
        }
      
        if (!selectedQualification) {
          alert("Please select a QUALIFICATION.");
          return;
        }
        if (!selectedGenderId) {
          alert("Please select a GENDER.");
          return;
        }
        if (!selectedCategoryId) {
          alert("Please select a CATEGORY.");
          return;
        } else {
          setDisplayFormData(
            formData,
            getCategoryName,
            getStateName,
            getDistrictName,
            getGenderName,
           
          );

          console.log(displayFormData);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error === "Try another email"
        ) {
          setErrorMessage(
            <div className="error-message-container">
              <div className="error-message">
                <p>Course is already registered by this email</p>
                <div className="errorbtns">
                  <Link to="/uglogin">Login</Link>
                  <Link onClick={handleDisplayDataopen}>Try other Email</Link>
                </div>
              </div>
            </div>
          );
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.error === "Proceed with the payment"
        ) {
          setErrorMessage(
            <div className="error-message-container">
              <div className="error-message">
                <p>
                  Course is already registered by this email payment is pending
                </p>
                <div className="errorbtns">
                  <Link to={`/PayU/${CourseData_Id}`}>Pay</Link>
                  <Link onClick={handleDisplayDataopen}>Try other Email</Link>
                </div>
              </div>
            </div>
          );
        } else {
          setDisplayFormData(formData);
          console.error("Error fetching data:", error);
        }
      }
    } else {
      setMissingFields(missingFieldsList);
      alert("Please fill out all required fields before proceeding.");
      missingFieldsList.forEach((field) => {
        const input = formRef.current[field];
        input.classList.add("error");
      });
    }
  };

  const handleBack = () => {
    // Clear the displayed data and go back to the form
    setDisplayFormData(null);
  };
  const [errorMessage, setErrorMessage] = useState("");
  // console.log(courseCreationId);
  const [data, setData] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected State:", selectedState);
    console.log("Selected District:", selecteddistrict);

    const contactNo = parseInt(formData.contactNo, 10);
    if (formData.emailId !== formData.confirmEmailId) {
      alert("Email and Confirm Email must match");
      return;
    }
    const dataToSend = {
      ...formData,
      GenderId: selectedGenderId,
      CategoryId: selectedCategoryId,
      contactNo: contactNo,
      state_id: selectedState,
      districts_id: selecteddistrict,
   
      edStatusId: selectedQualification,
    };
    console.log("Data to send:", dataToSend);
    const formDataToSend = new FormData();

    Object.entries(dataToSend).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    Object.entries(fileState).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    const displayData = {
      ...formData,
      Gander: getGenderName(selectedGenderId),
      category: getCategoryName(selectedCategoryId),
      state_id: getStateName(selectedState),
      districts_id: getDistrictName(selecteddistrict),
      edStatusId: getQualification(selectedQualification),
    };
    setDisplayFormData(displayData);
  

    try {
      const response = await fetch(
        `${BASE_URL}/StudentRegistationPage/StudentRegistrationPagebeforelogin/${CourseData_Id}`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      console.log("sindhu", CourseData_Id);
      if (response.ok) {
        console.log("Form submitted successfully");
        navigate(`/Payu/${CourseData_Id}`);
      }
      if (response.status == 400) {
        const errorMessage = await response.text();
        console.error("Failed to submit form");
        setErrorMessage("Failed to submit form: " + errorMessage); //
      } else {
      }
      setFormData({
        candidateName: "",
        dateOfBirth: "",
        emailId: "",
        confirmEmailId: "",
        contactNo: "",
        GenderId: "",
        CategoryId: "",
        fatherName: "",
        occupation: "",
        mobileNo: "",
        line1: "",
        state_id: "",
        districts_id: "",
        pincode: "",
        edStatusId: "",
        NameOfCollege: "",
        passingYear: "",
        marks: "",
      });
    } catch (error) {
      console.error("Error saving form data:", error);
      alert("Failed to submit form. Please try again later.");
    }
  };

//   const [transactionId, setTransactionId] = useState(null);
//   const handleChange = (e) => {
//     if (e.target.name === "amount") {
//       setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   function generateTransactionID() {
//     const timeStamp = Date.now();
//     const randomNum = Math.floor(Math.random() * 1000000);
//     const merchantPrefix = "T";
//     const transactionId = `${merchantPrefix}${timeStamp}${randomNum}`;
//     setTransactionId(transactionId);
//   }
  const getGenderName = (GenderId) => {
    const Gander = genders.find((g) => g.GenderId === parseInt(GenderId));
    console.log(Gander);
    return Gander ? Gander.Gander : "";
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (c) => c.CategoryId === parseInt(categoryId)
    );
    return category ? category.Category : "";
  };

  const getStateName = (state_id) => {
    const state = states.find((s) => s.state_id === parseInt(state_id));
    return state ? state.name : "";
  };

  const getDistrictName = (districts_id) => {
    const district = districts.find(
      (d) => d.districts_id === parseInt(districts_id)
    );
    return district ? district.districts_name : "";
  };


  const [image, setImage] = useState(null);

  const getQualification = (edStatusId) => {
    console.log("edStatusId in getQualification:", edStatusId);
    const Qualification = Qualifications.find(
      (q) => q.edStatusId === parseInt(edStatusId)
    );
    console.log("Selected Qualification:", Qualification);
    return Qualification ? Qualification.educationStatus : "";
  };

  if (displayFormData) {
    return (
      <DisplayFormData
        formData={displayFormData}
        getGenderName={getGenderName}
        getCategoryName={getCategoryName}
        getStateName={getStateName}
        getDistrictName={getDistrictName}
        getQualification={getQualification}
        onSubmit={handleFormSubmit}
        onBack={handleBack}
      />
    );
  }
  const handleDisplayDataopen = () => {
    setFormData(formData);
    setErrorMessage(!errorMessage);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="srp-container">
      {errorMessage && <div>{errorMessage}</div>}
      <div className="studebtreg_from">
        <h2 className="page_heading">STUDENT REGISTRATION PAGE</h2>
        <form ref={formRef} onSubmit={handleFormSubmit}>
          <div className="studebtreg_from_container">
            <div>
              {/* ------------------- PERSONAL_DETAILs-------------- */}

              <div className="PERSONAL_DETAILs">
                <h2 className="srp_heading">PERSONAL DETAILS</h2>
                <div className="PERSONAL_DETAILs_conatiner">
                  <div className="inputContent_from">
                    <label htmlFor="candidateName">
                      CANDIDATE NAME<span>* </span>:<br />{" "}
                      <small>(According to X Standard)</small>
                    </label>
                    <input
                      type="text"
                      id="candidateName"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleInputChange}
                      placeholder="Please enter your full name*"
                      required
                    />
                  </div>

                  <div className="inputContent_from">
                    <label htmlFor="dateOfBirth">
                      DATE OF BIRTH<span>* </span>:
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("GenderId") ? "missing-field" : ""
                    }`}
                  >
                    <label>
                      GENDER<span>* </span>:
                    </label>
                    <div className="inputContent_from_radio">
                      {genders.map((gender) => (
                        <div
                          className="inputContent_from_radio"
                          key={gender.GenderId}
                        >
                          <input
                            type="radio"
                            id={gender.GenderId}
                            name="gender"
                            value={gender.GenderId}
                            checked={
                              parseInt(selectedGenderId) === gender.GenderId
                            }
                            onChange={handleInputChange}
                            required
                          />
                          <label>{gender.Gander}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CATEGORY: */}
                  <div
                    className={`inputContent_from ${
                      missingFields.includes("CategoryId")
                        ? "missing-field"
                        : ""
                    }`}
                  >
                    <label>
                      CATEGORY<span>* </span>:
                    </label>
                    <div className="inputContent_from_radio">
                      {categories.map((category) => (
                        <div
                          className="inputContent_from_radio"
                          key={category.CategoryId}
                        >
                          <input
                            type="radio"
                            id={category.CategoryId}
                            name="category"
                            value={category.CategoryId}
                            checked={
                              parseInt(selectedCategoryId) ===
                              category.CategoryId
                            }
                            onChange={handleInputChange}
                            required
                          />
                          <label>{category.Category}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`inputContent_from ${
                      !missingFields.includes("emailId") ? "missing-field" : ""
                    }`}
                  >
                    <label htmlFor="emailId">
                      EMAIL ID<span>* </span>:
                    </label>
                    <input
                      className="inputContent_input"
                      type="email"
                      id="emailId"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleInputChange}
                      placeholder="Enter your e-mail"
                      required
                    />
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("confirmEmailId")
                        ? "missing-field"
                        : ""
                    }`}
                  >
                    <label htmlFor="confirmEmailId">
                      CONFIRM EMAIL ID<span>* </span>:
                    </label>
                    <input
                      className="inputContent_input"
                      type="email"
                      id="confirmEmailId"
                      name="confirmEmailId"
                      value={formData.confirmEmailId}
                      onChange={handleInputChange}
                      placeholder="Re-enter your e-mail"
                      required
                    />
                  </div>
                  <div
                    className={`inputContent_from ${
                      missingFields.includes("contactNo") ? "missing-field" : ""
                    }`}
                  >
                    <label htmlFor="contactNo">
                      CONTACT NO<span>* </span>:
                    </label>
                    <input
                      type="number"
                      id="contactNo"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      placeholder="Enter your mobile number"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* ------------------- FATHER'S/GUARDIAN'S DETAILS-------------- */}

              <div>
                <h2 className="srp_heading">FATHER'S/GUARDIAN'S DETAILS</h2>
                <div className="PERSONAL_DETAILs_conatiner">
                  <div
                    className={`inputContent_from ${
                      missingFields.includes("fatherName")
                        ? "missing-field"
                        : ""
                    }`}
                  >
                    <label htmlFor="fatherName">
                      FATHER'S NAME<span>* </span>:
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      placeholder="Enter your father full name"
                      required
                    />
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("occupation")
                        ? "missing-field"
                        : ""
                    }`}
                  >
                    <label htmlFor="occupation">
                      OCCUPATION<span>* </span>:
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="Enter father occupation"
                      required
                    />
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("mobileNo") ? "missing-field" : ""
                    }`}
                  >
                    <label htmlFor="mobileNo">
                      MOBILE NO<span>* </span>:
                    </label>
                    <input
                      type="number"
                      id="mobileNo"
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleInputChange}
                      placeholder="Enter your father mobile No"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ------------------- COMMUNICATION ADDRESS-------------- */}
              <div>
                <h2 className="srp_heading">COMMUNICATION ADDRESS</h2>
                <div className="PERSONAL_DETAILs_conatiner">
                  <div
                    className={`inputContent_from ${
                      missingFields.includes("line1") ? "missing-field" : ""
                    }`}
                  >
                    <label htmlFor="line1">
                      LINE1<span>* </span>:
                    </label>
                    <input
                      placeholder="Enter full address "
                      type="text"
                      id="line1"
                      name="line1"
                      value={formData.line1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("state_id") ? "missing-field" : ""
                    }`}
                  >
                    <h2>
                      SELECT A STATE<span>* </span>:
                    </h2>
                    <select
                      onChange={handleStateChange}
                      value={selectedState}
                      required
                    >
                      <option value="" disabled>
                        Choose a state
                      </option>
                      {states.map((state) => (
                        <option key={state.state_id} value={state.state_id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {selectedState && (
                      <div
                        className={`inputContent_from ${
                          missingFields.includes("districts_id")
                            ? "missing-field"
                            : ""
                        }`}
                      >
                        <h2>
                          SELECT A DISTRICT<span>* </span>:
                        </h2>
                        <select
                          onChange={handledistrictChange}
                          value={selecteddistrict}
                          required
                        >
                          <option value="" disabled>
                            Choose a district
                          </option>
                          {districts.map((district) => (
                            <option
                              key={district.districts_id}
                              value={district.districts_id}
                            >
                              {district.districts_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("pincode") ? "missing-field" : ""
                    }`}
                  >
                    <label htmlFor="pincode">
                      PINCODE<span>* </span>:
                    </label>
                    <input
                      type="number"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter your pin code"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* ------------------- COURSE DETAILS-------------- */}

              <div>
                <h2 className="srp_heading">COURSE DETAILS</h2>
                <div className="PERSONAL_DETAILs_conatiner">
                  {courseData.map((course) => (
                    <div
                      className="PERSONAL_DETAILs_conatiner_coursedata"
                      key={course.courseCreationId}
                    >
                      <div className="inputContent_from_course">
                        <p>EXAM: {course.examName}</p>
                        <p>SESSION: {course.courseYear}</p>
                        <p>COURSE: {course.courseName}</p>
                        <p>SUBJECTS :{course.subjects.join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* ------------------- EDUCATION DETAILS-------------- */}
              <div>
                <h2 className="srp_heading">EDUCATION DETAILS</h2>
                <div className="PERSONAL_DETAILs_conatiner">
                  <div
                    className={`inputContent_from ${
                      missingFields.includes("edStatusId")
                        ? "missing-field"
                        : ""
                    }`}
                  >
                    <h2>
                      QUALIFICATION<span>* </span>:
                    </h2>
                    <select
                      onChange={handleQualificationChange}
                      value={selectedQualification}
                      required
                    >
                      <option value="" disabled>
                        Choose a Qualification
                      </option>
                      {Qualifications.map((Qualification) => (
                        <option
                          key={Qualification.edStatusId}
                          value={Qualification.edStatusId}
                        >
                          {Qualification.educationStatus}
                        </option>
                      ))}
                    </select>{" "}
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("NameOfCollege")
                        ? "missing-field"
                        : ""
                    }`}
                  >
                    <label htmlFor="NameOfCollege">
                      NAME OF COLLEGE (WITH CITY)<span>* </span>:
                    </label>
                    <input
                      type="text"
                      id="NameOfCollege"
                      name="NameOfCollege"
                      value={formData.NameOfCollege}
                      onChange={handleInputChange}
                      placeholder="Enter your college name"
                      required
                    />
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("passingYear")
                        ? "missing-field"
                        : ""
                    }`}
                  >
                    <label htmlFor="passingYear">
                      PASSING YEAR<span>* </span>:
                    </label>
                    <input
                      type="text"
                      id="passingYear"
                      name="passingYear"
                      value={formData.passingYear}
                      onChange={handleInputChange}
                      placeholder="Enter your passing year"
                      required
                    />
                  </div>

                  <div
                    className={`inputContent_from ${
                      missingFields.includes("marks") ? "missing-field" : ""
                    }`}
                  >
                    <label htmlFor="marks">
                      MARKS IN %<span>* </span>:
                    </label>
                    <input
                      type="text"
                      id="marks"
                      name="marks"
                      value={formData.marks}
                      onChange={handleInputChange}
                      placeholder="Enter your marks"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ------------------- UPLOAD IMAGE / DOCUMENTS-------------- */}

              <div>
                <h2 className="srp_heading">UPLOAD IMAGE / DOCUMENTS</h2>
                <div className="content_reg_img">
                  {/* UPLOAD PHOTO  -----------*/}
                  <div className="imgSection">
                    <h3>
                      UPLOAD PHOTO <span>*</span>{" "}
                    </h3>
                    <img
                      src={
                        fileState.files1
                          ? URL.createObjectURL(fileState.files1)
                          : noimg
                      }
                      width={120}
                      height={120}
                      alt="asaS"
                    />
                    <div className="input-filde">
                      <input
                        required
                        type="file"
                        name="files1"
                        onChange={handleFileChange}
                      />
                      {/* <span className="errorText">{formErrors.files1}</span> */}
                    </div>
                  </div>
                  {/* UPLOAD SIGNATURE   -----------*/}
                  <div className="imgSection">
                    <h3>
                      UPLOAD SIGNATURE <span>*</span>{" "}
                    </h3>
                    <img
                      src={
                        fileState.filess
                          ? URL.createObjectURL(fileState.filess)
                          : noimg
                      }
                      width={120}
                      height={120}
                      alt="asaS"
                    />
                    <div className="input-filde">
                      <input
                        type="file"
                        name="filess"
                        onChange={handleFileChange}
                      />
                      {/* <span className="errorText">{formErrors.filess}</span> */}
                    </div>
                  </div>
                  {/* UPLOAD ID PROOF   -----------*/}
                  <div className="imgSection">
                    <h3>
                      UPLOAD ID PROOF <span>*</span>{" "}
                    </h3>
                    <img
                      src={
                        fileState.filess3
                          ? URL.createObjectURL(fileState.filess3)
                          : noimg
                      }
                      width={120}
                      height={120}
                      alt="asaS"
                    />
                    <div className="input-filde">
                      <input
                        type="file"
                        name="filess3"
                        onChange={handleFileChange}
                      />
                      {/* <span className="errorText">{formErrors.filess3}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="from_submit">
            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              The details provided above are mine.
            </label>
            <div className="">
              {isChecked ? (
                <div className="submitBTn">
                  <button
                    type="button"
                    className="btnSubmit"
                    onClick={handleDisplayData}
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="submitBTn">
                  <button
                    type="button"
                    className="btnSubmit  btnSubmit_disable"
                    disabled={!isChecked}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
          <div></div>
        </form>
      </div>

      {displayFormData && (
        <DisplayFormData
          formData={displayFormData}
          getGenderName={getGenderName}
          getCategoryName={getCategoryName}
          getStateName={getStateName}
          getDistrictName={getDistrictName}
        //   getBatchName={getBatchName}
          getQualification={getQualification}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
          errorMessage
        />
      )}
    </div>
  );
};
