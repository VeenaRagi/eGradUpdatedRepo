// src/components/RegistrationForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const formDataObj = new FormData();
    for (let key in formData) {
      formDataObj.append(key, formData[key]);
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
      alert(response.data.message);
      navigate("/PasswordChangeForm");
    } catch (error) {
      console.error(error);
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
    if (formData.marks !== "" && (isNaN(formData.marks) || formData.marks < 0 || formData.marks > 100)) {
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
    <div>
      {courseDetails && (
        <div>
          <h3>Course Details</h3>
          <p>
            <strong>Course Name:</strong> {courseDetails.courseName}
          </p>
          <p>
            <strong>Course Start Date:</strong> {courseDetails.courseStartDate}
          </p>
          <p>
            <strong>Course End Date:</strong> {courseDetails.courseEndDate}
          </p>
          <p>
            <strong>Total Price:</strong> {courseDetails.totalPrice}
          </p>
          <p>
            <strong>Available count</strong> {courseDetails.count}
          </p>
        </div>
      )}
      {emailExists && (
        <div>
          <p style={{ color: "red" }}>
            An account with this email already exists.
          </p>
          <button onClick={() => navigate("/UserLogin")}>Login</button>
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Candidate Name:</label>
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
          <label>Date of Birth:</label>
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
          Gender:
          <label>
            <input
              type="radio"
              name="Gender"
              value="Male"
              onChange={handleChange}
              required
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="Gender"
              value="Female"
              onChange={handleChange}
              required
            />{" "}
            Female
          </label>
          <label>
            <input
              type="radio"
              name="Gender"
              value="Other"
              onChange={handleChange}
              required
            />{" "}
            Other
          </label>
          {formErrors["Gender"] && (
            <span style={{ color: "red" }}>{formErrors["Gender"]}</span>
          )}
        </div>

        <div>
          Category:
          <label>
            <input
              type="radio"
              name="Category"
              value="General"
              onChange={handleChange}
              required
            />{" "}
            General
          </label>
          <label>
            <input
              type="radio"
              name="Category"
              value="OBC"
              onChange={handleChange}
              required
            />{" "}
            OBC
          </label>
          <label>
            <input
              type="radio"
              name="Category"
              value="SC/ST"
              onChange={handleChange}
              required
            />{" "}
            SC/ST
          </label>
          {formErrors["Category"] && (
            <span style={{ color: "red" }}>{formErrors["Category"]}</span>
          )}
        </div>

        <div>
          <label>Email ID:</label>
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
          <label>Confirm Email ID:</label>
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
          <label>Contact No:</label>
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

        <div>
          <label>Father Name:</label>
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
          <label>Occupation:</label>
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
          <label>Mobile No:</label>
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

        <div>
          <label>Line1:</label>
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
          <label>State:</label>
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
          <label>Districts:</label>
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
          <label>Pincode:</label>
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

        <div>
          Qualifications:
          <label>
            <input
              type="radio"
              name="qualifications"
              value="High School"
              onChange={handleChange}
              required
            />{" "}
            High School
          </label>
          <label>
            <input
              type="radio"
              name="qualifications"
              value="Intermediate"
              onChange={handleChange}
              required
            />{" "}
            Intermediate
          </label>
          {formErrors["qualifications"] && (
            <span style={{ color: "red" }}>{formErrors["qualifications"]}</span>
          )}
        </div>

        <div>
          <label>Name of College:</label>
          <input
            type="text"
            name="NameOfCollege"
            value={formData.NameOfCollege}
            onChange={handleChange}
            placeholder="Name of College"
            required
          />
          {formErrors["NameOfCollege"] && (
            <span style={{ color: "red" }}>
              {formErrors["NameOfCollege"]}
            </span>
          )}
        </div>

        <div>
          <label>Passing Year:</label>
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
          <label>Marks:</label>
          <input
            type="text"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            placeholder="Marks"
            required
          />
          {formErrors["marks"] && (
            <span style={{ color: "red" }}>{formErrors["marks"]}</span>
          )}
        </div>

        <div>
          <label>Upload Photo:</label>
          <input
            type="file"
            name="UplodadPhto"
            onChange={handleChange}
            required
          />
          {formErrors["UplodadPhto"] && (
            <span style={{ color: "red" }}>{formErrors["UplodadPhto"]}</span>
          )}
        </div>

        <div>
          <label>Signature:</label>
          <input type="file" name="Signature" onChange={handleChange} />
        </div>

        <div>
          <label>Proof:</label>
          <input type="file" name="Proof" onChange={handleChange} />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
