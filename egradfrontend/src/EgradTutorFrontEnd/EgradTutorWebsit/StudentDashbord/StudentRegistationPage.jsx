import React, { useState } from 'react';
import StudentRegistrationFormFields from './StudentRegistationFormFileds';
import './Style/Registrationform.css';
import formFields from './formFields';
const StudentRegistationPage = () => {
  const [formState, setFormState] = useState({
    emailExists: false,
    contactExists: false,
    emailChecked: false,
    contactChecked: false,
    showModal: false,
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userId, setUserId] = useState(null); // New state to store user ID

  const checkUserExistence = async (field, value) => {
    try {
      const response = await fetch('http://localhost:5001/StudentRegistationPage/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setFormState((prevState) => ({
          ...prevState,
          emailExists: exists,
          emailChecked: true,
        }));
        if (exists) {
          alert('Email ID already exists. Please log in.');
        }
      } else if (name === 'contactNo') {
        setFormState((prevState) => ({
          ...prevState,
          contactExists: exists,
          contactChecked: true,
        }));
        if (exists) {
          alert('Contact number already exists. Please log in.');
        }
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const requiredFields = [
      'candidateName', 'dateOfBirth', 'Gender', 'Category', 'emailId', 'confirmEmailId', 'contactNo',
      'fatherName', 'occupation', 'mobileNo', 'line1', 'state', 'districts', 'pincode',
      'qualification', 'NameOfCollege', 'passingYear', 'marks', 'photo', 'signature','Proof'
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
        const result = await response.json(); // Parse JSON response
        setUserId(result.userId); // Store user ID in state
        alert(result.message);
        setIsPopupVisible(true); // Show popup on successful submission
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving data');
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };



  return (
    <div className="container mt-4">
      <h1>Student Registration Page</h1>
      <form onSubmit={handleFormSubmit}>
        {formFields.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3>{section.sectionTitle}</h3>
            {section.fields.map((field, fieldIndex) => (
              <div key={fieldIndex}>
                <label>{field.label}</label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    onBlur={handleBlur}
                  />
                )}
                {field.type === 'date' && (
                  <input
                    type="date"
                    name={field.name}
                    placeholder={field.placeholder}
                  />
                )}
                {field.type === 'radio' && field.options && (
                  <div>
                    {field.options.map((option, optionIndex) => (
                      <label key={optionIndex}>
                        <input
                          type="radio"
                          name={field.name}
                          value={option.value}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === 'email' && (
                  <input
                    type="email"
                    name={field.name}
                    placeholder={field.placeholder}
                    onBlur={handleBlur}
                  />
                )}
                {field.type === 'dropdown' && field.options && (
                  <select name={field.name}>
                    {field.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit Without Course ID</button>
      </form>
      {/* <StudentRegistrationFormFields onSubmit={handleFormSubmit} fields={formFields} /> */}

      {isPopupVisible && (
        <div className="popup show">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Registration Successful</h2>
              <span className="popup-close" onClick={handleClosePopup}>&times;</span>
            </div>
            <div className="popup-body">
              <p>You have successfully registered!</p>
              <p>Plase reset your password with code what you got in registerd mail id </p>
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

export default StudentRegistationPage;
