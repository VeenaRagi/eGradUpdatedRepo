const formFields = [
    {
      sectionTitle: "Personal Details",
      fields: [
        { name: "candidateName", label: "Candidate Name", type: "text", placeholder: "Enter Candidate Name" },
        { name: "dateOfBirth", label: "Date of Birth", type: "date" },
        {
          name: "Gender", label: "Gender", type: "select", options: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" }
          ]
        },
        { name: "Category", label: "Category", type: "text", placeholder: "Enter Category" },
        { name: "emailId", label: "Email ID", type: "email", placeholder: "Enter Email ID" },
        { name: "confirmEmailId", label: "Confirm Email ID", type: "email", placeholder: "Confirm Email ID" },
        { name: "contactNo", label: "Contact Number", type: "text", placeholder: "Enter Contact Number" }
      ]
    },
    {
      sectionTitle: "Parental Details",
      fields: [
        { name: "fatherName", label: "Father's Name", type: "text", placeholder: "Enter Father's Name" },
        { name: "occupation", label: "Occupation", type: "text", placeholder: "Enter Occupation" },
        { name: "mobileNo", label: "Mobile Number", type: "text", placeholder: "Enter Mobile Number" }
      ]
    },
    {
      sectionTitle: "Address",
      fields: [
        { name: "line1", label: "Line 1", type: "text", placeholder: "Enter Address Line 1" },
        { name: "state", label: "State", type: "text", placeholder: "Enter State" },
        { name: "districts", label: "Districts", type: "text", placeholder: "Enter Districts" },
        { name: "pincode", label: "Pincode", type: "text", placeholder: "Enter Pincode" }
      ]
    },
    {
      sectionTitle: "Educational Details",
      fields: [
        { name: "qualification", label: "Qualification", type: "text", placeholder: "Enter Qualification" },
        { name: "NameOfCollege", label: "Name of College", type: "text", placeholder: "Enter Name of College" },
        { name: "passingYear", label: "Passing Year", type: "text", placeholder: "Enter Passing Year" },
        { name: "marks", label: "Marks", type: "text", placeholder: "Enter Marks" }
      ]
    },
    {
      sectionTitle: "Documents",
      fields: [
        { name: "photo", label: "Upload Photo", type: "file" },
        { name: "signature", label: "Upload Signature", type: "file" },
        { name: "Proof", label: "Upload Proof of Address", type: "file" }
      ]
    }
  ];
  
  export default formFields;
  