// src/components/RegistrationForm.js
import React, { useState, useEffect} from "react";
import axios from "axios";
import { useParams, useNavigate,Link,useLocation  } from "react-router-dom";
import './Style/Registrationform.css'
import uploadPicImg from './Images/NoImages.jpg'
import BASE_URL from "../../../apiConfig";
import { SiCarlsberggroup } from "react-icons/si";

const RegistrationForm = () => {
  const { courseCreationId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateName: "",
    dateOfBirth: "",
    Gender: "",
    Category: "",
    emailId: "",
    confirmEmailId: "",
    contactNo: "",
    fatherName: "",
    occupation: "",
    mobileNo: "",
    line1: "",
    state: "",
    districts: "",
    pincode: "",
    qualifications: "",
    NameOfCollege: "",
    passingYear: "",
    marks: "",
    UplodadPhto: null,
    Signature: null,
    Proof: null,
    courseCreationId: courseCreationId || null,
  });

  const [courseDetails, setCourseDetails] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [emailExists, setEmailExists] = useState(false);
  const [submitType, setSubmitType] = useState("");

  const handleeBack = () => {
    navigate('/CoursePage/1/1'); // This navigates to the home page
  };

  useEffect(() => {
    if (courseCreationId) {
      axios
        .get(
          `http://localhost:5001/PoopularCourses/unPurchasedCoursesBuyNow/${courseCreationId}`
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setCourseDetails(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching course details:", error);
        });
    }
  }, [courseCreationId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === "emailId") {
        checkEmailExists(value);
      }
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/StudentRegistationPage/checkEmail",
        { email }
      );
      if (response.data.exists) {
        setEmailExists(true);
      } else {
        setEmailExists(false);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
    
  };

  const { Branch_Id: Branch_Id_from_pattern1 } = useParams(); // Pattern 1
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Branch_Id_from_pattern2 = queryParams.get('Branch_Id'); // Pattern 2
  
  // const{Branch_Id} = useParams();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${BASE_URL}/LandingPageExamData/branch/${Branch_Id_from_pattern1}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBranches(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching branches:', error);
        setLoading(false);
      }
    };

    fetchBranches();
  }, [Branch_Id_from_pattern1]);

  console.log('Branch_Id', Branch_Id_from_pattern1);

  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const branchId = queryParams.get('Branch_Id');

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log("shinchannnnn");
    console.log("Branch_Id for registration:", Branch_Id_from_pattern1 || Branch_Id_from_pattern2);

 // Determine the correct Branch_Id based on submitType
 const Branch_Id = submitType === "register" ? Branch_Id_from_pattern1 : Branch_Id_from_pattern2;


    // Add Branch_Id to the formData object
    const formDataWithBranchId = { ...formData, Branch_Id, submitType };
console.log("shizukaaaaaaaaa")
console.log("Branch_Id:",Branch_Id)
    const errors = validateForm(formDataWithBranchId);
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    console.log('Form data is valid');

    const formDataObj = new FormData();
    for (let key in formDataWithBranchId) {
      formDataObj.append(key, formDataWithBranchId[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/StudentRegistationPage/register",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log('Server response:', response.data);
      alert(response.data.message);

      if (response.data.success) {
        const user_Id = response.data.user_Id;
        console.log('Registration successful, user ID:', user_Id);

        // Fetch the user data from the log table using the user ID
        const userResponse = await axios.get(
          `http://localhost:5001/StudentRegistationPage/getUserById/${user_Id}`
        );

        console.log('User data response:', userResponse.data);
        if (userResponse.data) {
          // Navigate based on submit type
          if (submitType === "register") {
            navigate(`/PasswordChangeForm/${user_Id}`);
          } else if (submitType === "buyNow") {
            navigate(`/PayU/${courseCreationId}`);
          }
        }
      } else {
        console.log('Registration failed:', response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert("Registration failed");
    }
  };

  const validateForm = (formData) => {
    let errors = {};

    // Validate required fields
    for (let key in formData) {
      if (formData[key] === "" && key !== "Signature" && key !== "Proof") {
        errors[key] = `${key} is required`;
      }
    }

    // Validate numeric inputs
    if (!/^\d+$/.test(formData.contactNo)) {
      errors["contactNo"] = "Contact No should contain only numbers";
    }
    if (!/^\d+$/.test(formData.mobileNo)) {
      errors["mobileNo"] = "Mobile No should contain only numbers";
    }
    if (
      formData.marks !== "" &&
      (isNaN(formData.marks) || formData.marks < 0 || formData.marks > 100)
    ) {
      errors["marks"] = "Marks should be a number between 0 and 100";
    }

    // Validate email and confirm email
    if (formData.emailId !== formData.confirmEmailId) {
      errors["confirmEmailId"] = "Confirm Email should match Email";
    }

    return errors;
  };

  const handleConfirmEmailPaste = (e) => {
    e.preventDefault();
    alert("Please manually enter the Confirm Email.");
  };



  return (
    <div className="registrationFormParentDiv">
      <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>Student Registration Page</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        branches.map((branch) => (
          <div key={branch.Branch_Id}>
            <p>{branch.Branch_Id}</p>
          </div>
        ))
      )}
     <h1>{Branch_Id_from_pattern2}</h1>

      {courseDetails && (
        <div className="courseDetailsPC">
          <div className="courseDetailsSubContainer">
            <div className="courseDetailsh2Div">
              <h2 style={{textTransform:"uppercase"}}>Course Details</h2>
            </div>
            <div className="courseDetailsDiv" >
              <div>
                <strong>Course Name:</strong>
                <p>
                  {courseDetails.courseName}
                </p>
              </div>
              <div>
                <strong>Course Duration:</strong>
                <p>
                  {courseDetails.courseStartDate} to {courseDetails.courseEndDate}
                </p>
              </div>
              <div>
                <strong>Available count:</strong>
                <p>
                  {courseDetails.count}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

  {emailExists && (
  <div className="popup-overlay">
    <div className="popup-content">
      <button className="close-button" onClick={() => setEmailExists(false)}>X</button>
      <p>An account with this email already exists.</p>
      <button onClick={() => navigate("/UserLogin")}>Login</button>
    </div>
  </div>
)}


      <form onSubmit={handleSubmit} className="registrationForm" encType="multipart/form-data">
        <div className="">
         <div className="">
          <button className="" onClick={handleeBack}>Back</button>
         </div>
          <div className="fieldsToBeGrid">
            <h1>PersonalDetails</h1>
            <div>
              <label>Candidate Name:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                placeholder="Candidate Name"
                required
              />
              {formErrors["candidateName"] && (
                <span style={{ color: "red" }}>{formErrors["candidateName"]}</span>
              )}
            </div>

            <div>
              <label>Date of Birth:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
              {formErrors["dateOfBirth"] && (
                <span style={{ color: "red" }}>{formErrors["dateOfBirth"]}</span>
              )}
            </div>

            <div>
              <label>
                Gender:
                <span className="mandatoryIndicator">*</span>

              </label>
              <div className="radioGroup">
                {/* <label>
              <input
                type="radio"
                name="Gender"
                value="Male"
                onChange={handleChange}
                required
              />
              Male
            </label> */}
                <div>
                  <input
                    type="radio"
                    name="Gender"
                    value="Male"
                    onChange={handleChange}
                    required
                  />
                  <label for="male">
                    Male
                  </label>

                </div>

                <div>
                  <input
                    type="radio"
                    name="Gender"
                    value="Female"
                    onChange={handleChange}
                    required
                  />
                  <label> Female
                  </label>

                </div>
                <div>
                  <input
                    type="radio"
                    name="Gender"
                    value="Other"
                    onChange={handleChange}
                    required
                  />
                  <label> Other
                  </label>

                </div>
              </div>
              {formErrors["Gender"] && (
                <span style={{ color: "red" }}>{formErrors["Gender"]}</span>
              )}
            </div>

            <div>
              <label htmlFor="">
                Category:
                <span className="mandatoryIndicator">*</span>

              </label>
              <div className="radioGroup">
                <div>
                  <input
                    type="radio"
                    name="Category"
                    value="General"
                    onChange={handleChange}
                    required
                  />
                  <label>
                    General
                  </label>

                </div>
                <div>
                  <input
                    type="radio"
                    name="Category"
                    value="OBC"
                    onChange={handleChange}
                    required
                  />{" "}
                  <label>

                    OBC
                  </label>

                </div>
                <div>
                  <input
                    type="radio"
                    name="Category"
                    value="SC/ST"
                    onChange={handleChange}
                    required
                  />{" "}
                  <label>
                    SC/ST
                  </label>
                </div>
              </div>
              {formErrors["Category"] && (
                <span style={{ color: "red" }}>{formErrors["Category"]}</span>
              )}
            </div>

            <div>
              <label>Email ID:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                placeholder="Email ID"
                required
              />
              {formErrors["emailId"] && (
                <span style={{ color: "red" }}>{formErrors["emailId"]}</span>
              )}
            </div>

            <div>
              <label>Confirm Email ID:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="email"
                name="confirmEmailId"
                value={formData.confirmEmailId}
                onChange={handleChange}
                onPaste={handleConfirmEmailPaste}
                placeholder="Confirm Email ID"
                required
              />
              {formErrors["confirmEmailId"] && (
                <span style={{ color: "red" }}>{formErrors["confirmEmailId"]}</span>
              )}
            </div>

            <div>
              <label>Contact No:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="Contact No"
                required
              />
              {formErrors["contactNo"] && (
                <span style={{ color: "red" }}>{formErrors["contactNo"]}</span>
              )}
            </div>
          </div>
          <div className="fieldsToBeGrid">
            <h1>Father's/ Guardian's Details</h1>
            <div>
              <label>Father Name:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Father Name"
                required
              />
              {formErrors["fatherName"] && (
                <span style={{ color: "red" }}>{formErrors["fatherName"]}</span>
              )}
            </div>

            <div>
              <label>Occupation:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Occupation"
                required
              />
              {formErrors["occupation"] && (
                <span style={{ color: "red" }}>{formErrors["occupation"]}</span>
              )}
            </div>

            <div>
              <label>Mobile No:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Mobile No"
                required
              />
              {formErrors["mobileNo"] && (
                <span style={{ color: "red" }}>{formErrors["mobileNo"]}</span>
              )}
            </div>
          </div>
          <div className="fieldsToBeGrid">
            <h1>Communication Details</h1>

            <div>
              <label>Line1:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="line1"
                value={formData.line1}
                onChange={handleChange}
                placeholder="Line1"
                required
              />
              {formErrors["line1"] && (
                <span style={{ color: "red" }}>{formErrors["line1"]}</span>
              )}
            </div>

            <div>
              <label>State:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
              {formErrors["state"] && (
                <span style={{ color: "red" }}>{formErrors["state"]}</span>
              )}
            </div>

            <div>
              <label>Districts:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="districts"
                value={formData.districts}
                onChange={handleChange}
                placeholder="Districts"
                required
              />
              {formErrors["districts"] && (
                <span style={{ color: "red" }}>{formErrors["districts"]}</span>
              )}
            </div>

            <div>
              <label>Pincode:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
              />
              {formErrors["pincode"] && (
                <span style={{ color: "red" }}>{formErrors["pincode"]}</span>
              )}
            </div>
          </div>
        </div>
        <div >
          <div className="fieldsToBeGrid">
            <h1>Education Details</h1>
            <div >
              <label htmlFor="">
                Qualifications:
                <span className="mandatoryIndicator">*</span>

              </label>
              <div className="radioGroup2">
                <div className="qualificationRBDiv" >
                  <div >
                    <input
                      type="radio"
                      name="qualifications"
                      value="Appearing"
                      onChange={handleChange}
                      required
                    />{" "}
                    <label>
                   Appearing XII
                    </label>

                  </div>
                  <div>
                    <input
                      type="radio"
                      name="qualifications"
                      value="Passsed"
                      onChange={handleChange}
                      required
                    />{" "}
                    <label>
                     Passsed XII
                    </label>

                  </div>
                </div>
              </div>
              {formErrors["qualifications"] && (
                <span style={{ color: "red" }}>{formErrors["qualifications"]}</span>
              )}

            </div>

            <div>
              <label>Name of College:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="NameOfCollege"
                value={formData.NameOfCollege}
                onChange={handleChange}
                placeholder="Name of College"
                required
              />
              {formErrors["NameOfCollege"] && (
                <span style={{ color: "red" }}>{formErrors["NameOfCollege"]}</span>
              )}
            </div>

            <div>
              <label>Passing Year:
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleChange}
                placeholder="Passing Year"
                required
              />
              {formErrors["passingYear"] && (
                <span style={{ color: "red" }}>{formErrors["passingYear"]}</span>
              )}
            </div>

            <div>
              <label>Marks(%):
                <span className="mandatoryIndicator">*</span>

              </label>
              <input
                type="text"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                placeholder="Marks (%)"
                required
              />
              {formErrors["marks"] && (
                <span style={{ color: "red" }}>{formErrors["marks"]}</span>
              )}
            </div>
          </div>
          <div className="fieldsToBeGrid2">
            <h1>Upload Image/Documents</h1>
            <div className="fieldsToBeFlex" >
              <div>
                <label>Upload Photo:
                  <span className="mandatoryIndicator">*</span>

                </label>
                {/* <div> */}
                <div className="uploadPicDiv">
                  <img src={uploadPicImg} alt="no img" />
                </div>
                <input
                  type="file"
                  name="UplodadPhto"
                  onChange={handleChange}
                  required
                />
                {formErrors["UplodadPhto"] && (
                  <span style={{ color: "red" }}>{formErrors["UplodadPhto"]}</span>
                )}
                {/* </div> */}
              </div>

              <div>
                <label>Signature:
                  <span className="mandatoryIndicator">*</span>
                </label>
                {/* <div> */}
                <div className="uploadPicDiv">
                  <img src={uploadPicImg} alt="no img" />
                </div>
                <input type="file" name="Signature" onChange={handleChange} />
              </div>
              {/* </div> */}

              <div>
                <label>Proof:
                  <span className="mandatoryIndicator">*</span>

                </label>
                {/* <div> */}
                <div className="uploadPicDiv">
                  <img src={uploadPicImg} alt="no img" />
                </div>
                <input type="file" name="Proof" onChange={handleChange} />
              </div>
              {/* </div> */}
            </div>
          </div>
          <div className="registerOrCousesButtonDiv">
            {courseDetails ? (
              <button
                type="submit"
                onClick={() => setSubmitType("buyNow")}
                disabled={emailExists}
              >
                Pay Now
              </button>
            ) : (
              <button
                type="submit"
                onClick={() => setSubmitType("register")}
                disabled={emailExists}
              >
                Register
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
};

export default RegistrationForm;
