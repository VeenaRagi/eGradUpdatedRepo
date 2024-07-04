const formFields = [
    {
      sectionTitle: "Personal Details",
      fields: [
        { label: "Candidate Name", name: "candidateName", type: "text", placeholder: "Please enter your full name" },
        { label: "Date of Birth", name: "dateOfBirth", type: "date", placeholder: "dd-mm-yyyy" },
        { label: "Gender", name: "Gender", type: "radio", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Others", value: "others" }
        ]},
        { label: "Category", name: "Category", type: "radio", options: [
          { label: "General", value: "general" },
          { label: "ST", value: "st" },
          { label: "SC", value: "sc" },
          { label: "OBC", value: "obc" }
        ]},
        { label: "Email ID", name: "emailId", type: "email", placeholder: "Enter your email"},
        { label: "Confirm Email ID", name: "confirmEmailId", type: "email", placeholder: "Re-enter your email" },
        { label: "Contact No", name: "contactNo", type: "text", placeholder: "Enter your mobile number"},
      ]
    },
    {
      sectionTitle: "Father's/Guardian's Details",
      fields: [
        { label: "Father's Name", name: "fatherName", type: "text", placeholder: "Enter your father's full name" },
        { label: "Occupation", name: "occupation", type: "text", placeholder: "Enter father's occupation" },
        { label: "Mobile No", name: "mobileNo", type: "text", placeholder: "Enter your father's mobile number" },
      ]
    },
    {
      sectionTitle: "Education Details",
      fields: [
        { label: "Qualification", name: "qualification", type: "dropdown", options: [
          { label: "Choose a Qualification", value: "" },
          { label: "High School", value: "highSchool" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Graduate", value: "graduate" },
        ]},
        { label: "Name of College (with city)", name: "NameOfCollege", type: "text", placeholder: "Enter your college name" },
        { label: "Passing Year", name: "passingYear", type: "text", placeholder: "Enter your passing year" },
        { label: "Marks in %", name: "marks", type: "text", placeholder: "Enter your marks" },
      ]
    },
    {
      sectionTitle: "Communication Address",
      fields: [
        { label: "Line 1", name: "line1", type: "text", placeholder: "Enter full address" },
        { label: "Select a State", name: "state", type: "dropdown", options: [
          { label: "Andhra Pradesh", value: "AP" },
          { label: "Telangana", value: "TG" },
          { label: "Karnataka", value: "KA" },
          { label: "Tamil Nadu", value: "TN" },
        ]},
        { label: "Select a districts", name: "districts", type: "dropdown", options: [
          { label: "Choose a districts", value: "" },
          { label: "Andhra Pradesh", value: "AP" },
        ]},
        { label: "Pincode", name: "pincode", type: "text", placeholder: "Enter your pin code" },
      ]
    },
    {
      sectionTitle: "Upload Image/Documents",
      fields: [
        { label: "Upload Photo", name: "photo", type: "file" },
        { label: "Upload Signature", name: "signature", type: "file" },
        { label: "Proof", name: "Proof", type: "file" },
      ]
    },
  ];

  export default formFields;