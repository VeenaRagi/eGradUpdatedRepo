import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BASE_URL from '../../apiConfig'
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";
function Portal_coures_creation_admin() {
  const [courseData, setCourseData] = useState([]);
  const [portals, setPortals] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedexams, setSelectedexams] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectsData, setSubjectsData] = useState([]);
  const [courseImage, setCourseImage] = useState(null);
  const [portaleId, setPortaleId] = useState(null);
  const [typeOfTest, setTypeOfTest] = useState([]);
  const [selectedtypeOfTest, setSelectedtypeOfTest] = useState([]);
  const [typeofQuestion, setTypeofQuestion] = useState([]);
  const [selectedtypeofQuestion, setSelectedtypeofQuestion] = useState([]);
  const [showPortalButtons, setShowPortalButtons] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10; 
  //-------------------------------buttons code-------------------------
  useEffect(() => {
    axios
      .get(`${BASE_URL}/Portal_coures_creation_admin/Portal_feaching`)
      .then((response) => {
        console.log("Fetched portals:", response.data);
        setPortals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching portal data:", error);
      });
  }, []);

  const handlePortalButtonClick = (portalId) => {
    console.log("Portal button clicked, ID:", portalId);
    setPortaleId(portalId); // Set the portal ID
    const formMapping = {
      1: "form1",
      2: "form2",
      3: "form3",
      4: "form4",
    };
    const formToShow = formMapping[portalId];
    setActiveForm(formToShow);
    setShowPortalButtons(false); // Hide portal buttons when a form is active
  };

  const handleShowPortalButtons = () => {
    console.log("Show All button clicked");
    setShowPortalButtons((prevState) => !prevState); // Toggle portal button visibility
    if (showPortalButtons) {
      setActiveForm(null); // Reset active form when hiding
    }
  };
  const handleCloseForm = () => {
    console.log("Closing form"); // Log when closing a form
    setActiveForm(null); // Reset active form
    setShowPortalButtons(true);
    // setPortaleId(null);
  };
  //--------------------------------end------------------------------------------
  //-------------------------------------constant apis ----------------------
  useEffect(() => {
    fetch(`${BASE_URL}/CoureseCreation/courese-exams`)
      .then((response) => response.json())
      .then((data) => {
        setExams(data);
      })
      .catch((error) => console.error("Error fetching exams:", error));
  }, []);

  const handleexams = async (event) => {
    const selectedExamId = event.target.value;
    console.log("Selected Exam ID:", selectedExamId);
    setSelectedexams(selectedExamId);
    console.log("Selected Exam ID (after setting):", selectedexams);
    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/courese-exam-subjects/${selectedExamId}/subjects`
      );
      const data = await response.json();
      console.log("Subjects Data:", data); // Log the fetched data
      setSubjectsData(data); // Update subjectsData state
      setSelectedSubjects([]); // Reset selected subjects
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }

    setSelectedexams(selectedExamId);
  };

  const handleSubjectChange = (event, subjectId) => {
    const { checked } = event.target;

    setSelectedSubjects((prevSelectedSubjects) => {
      if (checked) {
        // Add the subjectId to the array if it's not already present
        return [...new Set([...prevSelectedSubjects, subjectId])];
      } else {
        // Remove the subjectId from the array
        return prevSelectedSubjects.filter((id) => id !== subjectId);
      }
    });
  };

  useEffect(() => {
    const fetchTypeOfTest = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/CoureseCreation/type_of_tests`
        );
        const result = await response.json();
        setTypeOfTest(result);
      } catch (error) {
        console.error("Error fetching Type of questions:", error);
      }
    };

    fetchTypeOfTest();
  }, []);

  useEffect(() => {
    const fetchTypeOfQuestion = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/CoureseCreation/type_of_questions`
        );
        const result = await response.json();
        // console.log("Type of Questions Data:", result); // Add this line to log the data
        setTypeofQuestion(result);
      } catch (error) {
        console.error("Error fetching Type of questions:", error);
      }
    };

    fetchTypeOfQuestion();
  }, []);

  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = 2000;
    const endYear = 2035;

    const yearOptions = [];
    for (let year = endYear; year >= startYear; year--) {
      yearOptions.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }

    return yearOptions;
  }

  const handletypeoftest = (event, typeOfTestId) => {
    const { checked } = event.target;

    setSelectedtypeOfTest((prevSelectedTest) => {
      const updatedSelectedTest = checked
        ? [...prevSelectedTest, typeOfTestId]
        : prevSelectedTest.filter((id) => id !== typeOfTestId);

      console.log("Selected Type of Test:", updatedSelectedTest);
      return updatedSelectedTest;
    });
  };

  const handleQuestionChange = (event, questionTypeId) => {
    const { checked } = event.target;

    setSelectedtypeofQuestion((prevSelectedQuestions) => {
      const updatedSelectedQuestions = checked
        ? [...prevSelectedQuestions, questionTypeId]
        : prevSelectedQuestions.filter((id) => id !== questionTypeId);

      console.log("Selected Type of Questions:", updatedSelectedQuestions);
      return updatedSelectedQuestions;
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredCourse = courseData.filter(
    (courseData) =>
      courseData.courseName &&
      courseData.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchCourseData();
  }, []);
  const fetchCourseData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/course_creation_table`
      ); // api for getting the data to display on the table
      const result = await response.json();
      const coursesWithArrays = result.map((course) => ({
        ...course,
        typeOfTestName: course.type_of_test
          ? course.type_of_test.split(", ")
          : [],
        subjects: course.subjects ? course.subjects.split(", ") : [],
        typeofQuestion: course.question_types
          ? course.question_types.split(", ")
          : [],
      }));
      setCourseData(coursesWithArrays);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleDelete = async (courseCreationId) => {
    // Display a confirmation dialog before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `${BASE_URL}/CoureseCreation/course_creation_table_Delete/${courseCreationId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message);
        const updatedCourseData = courseData.filter(
          (course) => course.courseCreationId !== courseCreationId
        );
        console.log("Before:", courseData);
        console.log("After:", updatedCourseData);
        setCourseData(updatedCourseData);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    } else {
      // The user canceled the deletion
      console.log("Deletion canceled.");
    }
  };
  //---------------------------------------end-------------------------------
  //------------------------------------OTS-------------------------------------
  const [otsformData, setOtsFormData] = useState({
    courseName: "",
    courseYear: "",
    examId: "",
    typeofQuestion: "",
    courseStartDate: "",
    courseEndDate: "",
    cost: "",
    discount: "",
    discountAmount: "",
    totalPrice: "",
    paymentlink: "",
    cardImage: "",
  });
  const otsresetFormFields = () => {
    setOtsFormData({
      courseName: "",
      courseYear: "",
      examId: "",
      typeofQuestion: "",
      courseStartDate: "",
      courseEndDate: "",
      cost: "",
      discount: "",
      discountAmount: "",
      totalPrice: "",
      paymentlink: "",
      cardImage: "",
    });
    setSelectedSubjects([]);
    setSelectedtypeofQuestion([]);
    setSelectedtypeOfTest([]);
  };

  const handleChangeots = (e) => {
    const { name, value } = e.target;
    if (name === "cost" || name === "discount") {
      const cost = name === "cost" ? parseFloat(value) : otsformData.cost;
      const discount =
        name === "discount" ? parseFloat(value) : otsformData.discount;
      const discountAmount =
        !isNaN(cost) && !isNaN(discount) ? (cost * discount) / 100 : "";
      const totalPrice =
        !isNaN(cost) && !isNaN(discountAmount) ? cost - discountAmount : "";
      setOtsFormData({
        ...otsformData,
        // courseYear:courseYear,

        typeOfTest: selectedtypeOfTest,
        examId: selectedexams,
        subjects: selectedSubjects,
        typeofQuestion: selectedtypeofQuestion,
        courseStartDate: startDate,
        courseEndDate: endDate,
        cost: cost,
        discount: discount,
        discountAmount: discountAmount,
        totalPrice: totalPrice,
      });
    } else if (name === "courseStartDate" || name === "courseEndDate") {
      setOtsFormData({ ...otsformData, [name]: value });
    } else {
      setOtsFormData({ ...otsformData, [name]: value });
    }
  };

  const handleSubmitots = async (e) => {
    e.preventDefault();
    otsresetFormFields();
    if (!portaleId) {
      console.error("Portale_Id is missing");
      return;
    }
    const formDataObj = new FormData();
    formDataObj.append("paymentlink", otsformData.paymentlink);
    formDataObj.append("courseName", otsformData.courseName);
    formDataObj.append("courseYear", otsformData.courseYear);
    formDataObj.append("examId", otsformData.examId);
    formDataObj.append("courseStartDate", otsformData.courseStartDate);
    formDataObj.append("courseEndDate", otsformData.courseEndDate);
    formDataObj.append("cost", otsformData.cost);
    formDataObj.append("discount", otsformData.discount);
    formDataObj.append("totalPrice", otsformData.totalPrice);
    formDataObj.append("Portale_Id", portaleId);
    formDataObj.append("cardImage", courseImage); // Append image file

    // Append selected arrays
    formDataObj.append("typeOfTest", JSON.stringify(selectedtypeOfTest));

    formDataObj.append("subjects", JSON.stringify(selectedSubjects));
    formDataObj.append(
      "typeofQuestion",
      JSON.stringify(selectedtypeofQuestion)
    );

    console.log(formDataObj);
    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/course-creation`,
        {
          method: "POST",
          body: formDataObj, // Use FormData object directly
        }
      );

      const result = await response.json();
      if (result && result.courseCreationId) {
        const courseCreationId = result.courseCreationId;
        const subjectsResponse = await fetch(
          `${BASE_URL}/CoureseCreation/course_type_of_question`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseCreationId,
              subjectIds: selectedSubjects,
              typeofQuestion: selectedtypeofQuestion,
              typeOfTestIds: selectedtypeOfTest,
            }),
          }
        );
        const subjectsResult = await subjectsResponse.json();
        console.log("Subjects Result:", subjectsResult);
        console.log(result);
        if (result.success) {
          console.log("Course created successfully");
        } else {
          console.log("Failed to create course:", result.error);
        }
      } else {
        console.log("Failed to create course. Unexpected response:", result);
      }
      fetchCourseData();
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting course data:", error);
      // Handle error or show an error message to the user
    }
  };
  //----------------------------------------------------------------------END-----------------------------------
  //-----------------------------------------PQB-----------------------------------

  const [pqbformData, setPqbFormData] = useState({
    courseName: "",
    courseYear: "",
    examId: "",
    typeofQuestion: "",
    courseStartDate: "",
    courseEndDate: "",
    cost: "",
    discount: "",
    discountAmount: "",
    totalPrice: "",
    paymentlink: "",
    cardImage: "",
  });
  const pqbresetFormFields = () => {
    setPqbFormData({
      courseName: "",
      courseYear: "",
      examId: "",
      typeofQuestion: "",
      courseStartDate: "",
      courseEndDate: "",
      cost: "",
      discount: "",
      discountAmount: "",
      totalPrice: "",
      paymentlink: "",
      cardImage: "",
    });
    setSelectedSubjects([]);
    setSelectedtypeofQuestion([]);
    setSelectedtypeOfTest([]);
  };

  const handleChangepqb = (e) => {
    const { name, value } = e.target;
    if (name === "cost" || name === "discount") {
      const cost = name === "cost" ? parseFloat(value) : pqbformData.cost;
      const discount =
        name === "discount" ? parseFloat(value) : pqbformData.discount;
      const discountAmount =
        !isNaN(cost) && !isNaN(discount) ? (cost * discount) / 100 : "";
      const totalPrice =
        !isNaN(cost) && !isNaN(discountAmount) ? cost - discountAmount : "";
      setPqbFormData({
        ...pqbformData,
        // courseYear:courseYear,

        typeOfTest: selectedtypeOfTest,
        examId: selectedexams,
        subjects: selectedSubjects,
        typeofQuestion: selectedtypeofQuestion,
        courseStartDate: startDate,
        courseEndDate: endDate,
        cost: cost,
        discount: discount,
        discountAmount: discountAmount,
        totalPrice: totalPrice,
      });
    } else if (name === "courseStartDate" || name === "courseEndDate") {
      setPqbFormData({ ...pqbformData, [name]: value });
    } else {
      setPqbFormData({ ...pqbformData, [name]: value });
    }
  };

  const handleSubmitpqb = async (e) => {
    e.preventDefault();
    pqbresetFormFields();
    if (!portaleId) {
      console.error("Portale_Id is missing");
      return;
    }
    const formDataObj = new FormData();
    formDataObj.append("paymentlink", pqbformData.paymentlink);
    formDataObj.append("courseName", pqbformData.courseName);
    formDataObj.append("courseYear", pqbformData.courseYear);
    formDataObj.append("examId", pqbformData.examId);
    formDataObj.append("courseStartDate", pqbformData.courseStartDate);
    formDataObj.append("courseEndDate", pqbformData.courseEndDate);
    formDataObj.append("cost", pqbformData.cost);
    formDataObj.append("discount", pqbformData.discount);
    formDataObj.append("totalPrice", pqbformData.totalPrice);
    formDataObj.append("Portale_Id", portaleId);
    formDataObj.append("cardImage", courseImage); // Append image file

    // Append selected arrays
    formDataObj.append("typeOfTest", JSON.stringify(selectedtypeOfTest));

    formDataObj.append("subjects", JSON.stringify(selectedSubjects));
    formDataObj.append(
      "typeofQuestion",
      JSON.stringify(selectedtypeofQuestion)
    );

    console.log(formDataObj);
    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/course-creation`,
        {
          method: "POST",
          body: formDataObj, // Use FormData object directly
        }
      );

      const result = await response.json();
      if (result && result.courseCreationId) {
        const courseCreationId = result.courseCreationId;
        const subjectsResponse = await fetch(
          `${BASE_URL}/CoureseCreation/course_type_of_question`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseCreationId,
              subjectIds: selectedSubjects,
              typeofQuestion: selectedtypeofQuestion,
              typeOfTestIds: selectedtypeOfTest,
            }),
          }
        );
        const subjectsResult = await subjectsResponse.json();
        console.log("Subjects Result:", subjectsResult);
        console.log(result);
        if (result.success) {
          console.log("Course created successfully");
        } else {
          console.log("Failed to create course:", result.error);
        }
      } else {
        console.log("Failed to create course. Unexpected response:", result);
      }
      fetchCourseData();
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting course data:", error);
      // Handle error or show an error message to the user
    }
  };

  //----------------------------------------PQB---------------------END

  //------------------------------------ONLINE VIDEO LECTURE COURSE CREATION FORM------------------------------------------------------------------------------//
  const [ovlformData, setOvlFormData] = useState({
    courseName: "",
    courseYear: "",
    examId: "",
    courseStartDate: "",
    courseEndDate: "",
    cost: "",
    discount: "",
    discountAmount: "",
    totalPrice: "",
    paymentlink: "",
    cardImage: "",
  });
  const resetFormFields = () => {
    setOvlFormData({
      courseName: "",
      courseYear: "",
      examId: "",
      courseStartDate: "",
      courseEndDate: "",
      cost: "",
      discount: "",
      discountAmount: "",
      totalPrice: "",
      paymentlink: "",
      cardImage: "",
    });
    setSelectedSubjects([]);
  };
  const handleStartDateChange = (e) => {
    const formattedDate = e.target.value;
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (e) => {
    const formattedDate = e.target.value;
    setEndDate(formattedDate);
  };
  const handleCourseImageChange = (event) => {
    const file = event.target.files[0];
    setCourseImage(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cost" || name === "discount") {
      const cost = name === "cost" ? parseFloat(value) : ovlformData.cost;
      const discount =
        name === "discount" ? parseFloat(value) : ovlformData.discount;
      const discountAmount =
        !isNaN(cost) && !isNaN(discount) ? (cost * discount) / 100 : "";
      const totalPrice =
        !isNaN(cost) && !isNaN(discountAmount) ? cost - discountAmount : "";
      setOvlFormData({
        ...ovlformData,
        // courseYear:courseYear,
        examId: selectedexams,
        subjects: selectedSubjects,
        courseStartDate: startDate,
        courseEndDate: endDate,
        cost: cost,
        discount: discount,
        discountAmount: discountAmount,
        totalPrice: totalPrice,
      });
    } else if (name === "courseStartDate" || name === "courseEndDate") {
      setOvlFormData({ ...ovlformData, [name]: value });
    } else {
      setOvlFormData({ ...ovlformData, [name]: value });
    }
  };

  const OVLhandleSubmit = async (e) => {
    e.preventDefault();
    resetFormFields();
    if (!portaleId) {
      console.error("Portale_Id is missing");
      return;
    }
    const formDataObj = new FormData();
    formDataObj.append("courseName", ovlformData.courseName);
    formDataObj.append("courseYear", ovlformData.courseYear);
    formDataObj.append("examId", ovlformData.examId);
    formDataObj.append("courseStartDate", ovlformData.courseStartDate);
    formDataObj.append("courseEndDate", ovlformData.courseEndDate);
    formDataObj.append("cost", ovlformData.cost);
    formDataObj.append("discount", ovlformData.discount);
    formDataObj.append("totalPrice", ovlformData.totalPrice);
    formDataObj.append("paymentlink", ovlformData.paymentlink);
    formDataObj.append("Portale_Id", portaleId);
    formDataObj.append("cardImage", courseImage);
    formDataObj.append("subjects", JSON.stringify(selectedSubjects));

    console.log(formDataObj);
    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/course-creation`,
        {
          method: "POST",
          body: formDataObj,
        }
      );

      const result = await response.json();
      if (result && result.courseCreationId) {
        const courseCreationId = result.courseCreationId;
        const subjectsResponse = await fetch(
          `${BASE_URL}/Portal_coures_creation_admin/course_subjects`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseCreationId,
              subjectIds: selectedSubjects,
            }),
          }
        );

        const subjectsResult = await subjectsResponse.json();
        console.log("Subjects Result:", subjectsResult);
        console.log(result);
        if (result.success) {
          console.log("Course created successfully");
        } else {
          console.log("Failed to create course:", result.error);
        }
      } else {
        console.log("Failed to create course. Unexpected response:", result);
      }

      fetchCourseData();
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting course data:", error);
      // Handle error or show an error message to the user
    }
  };

  //-----------------------------------ONLINE VIDEO LECTURE COURSE CREATION FORM---------------------------------------END---------------------------------------------//

  //-------------------------------------------COMPLETE PACKAGE--------------------------------

  // const handleSubjectChangecp = (e) => {
  //   setSelectedSubject(e.target.value); // Correctly update the state
  // };

  const handleSubjectChangecp = (event, subjectId) => {
    const { checked } = event.target;

    setSelectedSubject((prevSelectedSubjects) => {
      if (checked) {
        // Add the subjectId to the array if it's not already present
        return [...new Set([...prevSelectedSubjects, subjectId])];
      } else {
        // Remove the subjectId from the array
        return prevSelectedSubjects.filter((id) => id !== subjectId);
      }
    });
  };

  const [cpformData, setCpFormData] = useState({
    courseName: "",
    courseYear: "",
    examId: "",
    courseStartDate: "",
    courseEndDate: "",
    cost: "",
    discount: "",
    discountAmount: "",
    totalPrice: "",
    paymentlink: "",
    cardImage: "",
  });
  const cpresetFormFields = () => {
    setCpFormData({
      courseName: "",
      courseYear: "",
      examId: "",
      courseStartDate: "",
      courseEndDate: "",
      cost: "",
      discount: "",
      discountAmount: "",
      totalPrice: "",
      paymentlink: "",
      cardImage: "",
    });
    setSelectedSubjects([]);
  };

  const handleChangecp = (e) => {
    const { name, value } = e.target;
    if (name === "cost" || name === "discount") {
      const cost = name === "cost" ? parseFloat(value) : cpformData.cost;
      const discount =
        name === "discount" ? parseFloat(value) : cpformData.discount;
      const discountAmount =
        !isNaN(cost) && !isNaN(discount) ? (cost * discount) / 100 : "";
      const totalPrice =
        !isNaN(cost) && !isNaN(discountAmount) ? cost - discountAmount : "";
      setCpFormData({
        ...cpformData,

        examId: selectedexams,
        subjects: selectedSubject,
        courseStartDate: startDate,
        courseEndDate: endDate,
        cost: cost,
        discount: discount,
        discountAmount: discountAmount,
        totalPrice: totalPrice,
      });
    } else if (name === "courseStartDate" || name === "courseEndDate") {
      setCpFormData({ ...cpformData, [name]: value });
    } else {
      setCpFormData({ ...cpformData, [name]: value });
    }
  };

  const handleSubmitCP = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Ensure `selectedSubjects` has at least one valid subject ID
    if (!selectedSubject || selectedSubject.length === 0) {
      console.error("No subject selected.");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("courseName", cpformData.courseName);
    formData.append("courseYear", cpformData.courseYear);
    formData.append("examId", cpformData.examId);
    formData.append("courseStartDate", cpformData.courseStartDate);
    formData.append("courseEndDate", cpformData.courseEndDate);
    formData.append("cost", cpformData.cost);
    formData.append("discount", cpformData.discount);
    formData.append("totalPrice", cpformData.totalPrice);
    formData.append("paymentlink", cpformData.paymentlink);
    formData.append("cardImage", courseImage); // Binary image data
    formData.append("Portale_Id", portaleId);

    // Append a single subject ID or all selected subject IDs
    formData.append("subjects", JSON.stringify(selectedSubject)); // Convert to JSON

    if (cpformData.topicName) {
      formData.append("topicName", cpformData.topicName);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/courseCreation_Complete_package`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Course created successfully:", result);
        fetchCourseData(); // Fetch updated data or redirect, as needed
        cpresetFormFields(); // Reset the form fields
      } else {
        console.error("Failed to create course:", await response.text());
      }
      fetchCourseData();
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting course data:", error);
    }
  };

  //----------------------------------------END-----------------------------------

  const pageCount = Math.ceil(filteredCourse.length / usersPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const displayData = filteredCourse.slice(pagesVisited, pagesVisited + usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (
    <div className="create_exam_container otsMainPages">
      <h3 className="textColor">COURSE CREATION PAGE</h3>
      <div className="create_exam_header">
        <button
          className="otc_-addExam"
          onClick={handleShowPortalButtons}
          disabled={activeForm !== null}
        >
          <i className="fa-solid fa-plus"></i> Add Course
        </button>
      </div>

      {showPortalButtons && (
        <div className="courseOtsPqbOvl_Btns">
          <ul>
            {portals.map((portal) => (
              <li key={portal.Portale_Id}>
                <button
                  onClick={() => handlePortalButtonClick(portal.Portale_Id)}
                >
                  {portal.Portale_Name}
                </button>
              </li>
            ))}
          </ul>

          {/* Close button to hide the list */}
          <button
            className="courseOtsPqbOvl_CloseBtns"
            onClick={handleShowPortalButtons}
          >
            {/* <i className="fa-solid fa-times"></i> */}
          </button>
        </div>
      )}

      {/* ots */}
      {activeForm === "form1" && (
        <div className="ONLINE_TEST_SERIES_COURSE_CREATION_FORM">
          <form onSubmit={handleSubmitots} className="ots_-Form">
            <h2 className="ots_courseTitle_text">
              ONLINE TEST SERIES COURSE CREATION FORM
            </h2>
            <div className="otsCloseBtn_Mar">
              <button
                type="button"
                className="ots_btnClose"
                onClick={handleCloseForm}
              >
                Close
              </button>
            </div>
            <div>
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="courseName">Course Name:</label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={otsformData.courseName}
                    onChange={handleChangeots}
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="year">Select Year:</label>
                  <select
                    id="year"
                    name="courseYear"
                    value={otsformData.courseYear}
                    onChange={handleChangeots}
                  >
                    <option value="">Select Year</option>
                    {generateYearOptions()}
                  </select>
                </div>
              </div>
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_list">
                  <label>Type of test:</label>
                  <div className="coures_-typeOfTest">
                    {typeOfTest.map((typeofTest) => (
                      <div
                        className="course_checkbox_continer course_frominput_container_media"
                        key={typeofTest.typeOfTestId}
                      >
                        <label htmlFor={`question-${typeofTest.typeOfTestId}`}>
                          {typeofTest.typeOfTestName}
                        </label>
                        <input
                          className="inputLable"
                          type="checkbox"
                          id={`typeofTest-${typeofTest.typeOfTestId}`}
                          name={`typeofTest-${typeofTest.typeOfTestId}`}
                          value={typeofTest.typeOfTestId}
                          checked={selectedtypeOfTest.includes(
                            typeofTest.typeOfTestId
                          )}
                          onChange={(e) =>
                            handletypeoftest(e, typeofTest.typeOfTestId)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>{" "}
              </div>
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="exams">Select Exam:</label>
                  <select
                    id="exams"
                    value={selectedexams}
                    onChange={handleexams}
                  >
                    <option value="">Select exams</option>
                    {exams.map((exams) => (
                      <option key={exams.examId} value={exams.examId}>
                        {exams.examName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="testCreation_-list">
                  <label>Select Subjects:</label>
                  <div className="coures_-Subjects">
                    {subjectsData.map((subject) => (
                      <div
                        className="course_frominput_container "
                        id="course_frominput_container_media"
                        key={subject.subjectId}
                      >
                        <label htmlFor={`subject-${subject.subjectId}`}>
                          {subject.subjectName}
                        </label>
                        <input
                          className="inputLable"
                          type="checkbox"
                          id={`subject-${subject.subjectId}`}
                          name={`subject-${subject.subjectId}`}
                          value={subject.subjectId}
                          checked={selectedSubjects.includes(subject.subjectId)}
                          onChange={(e) =>
                            handleSubjectChange(e, subject.subjectId)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_list">
                  <label>Type of Questions:</label>
                  <div className="course_checkbox_continer_content">
                    {typeofQuestion.map((type) => (
                      <div
                        className="course_checkbox_continer course_frominput_container_media"
                        key={type.quesionTypeId}
                      >
                        <i class="fa-solid fa-caret-right"></i>
                        <label htmlFor={`question-${type.quesionTypeId}`}>
                          {type.typeofQuestion}
                        </label>
                        <input
                          className="inputLable"
                          type="checkbox"
                          id={`question-${type.quesionTypeId}`}
                          name={`question-${type.quesionTypeId}`}
                          value={type.quesionTypeId}
                          checked={selectedtypeofQuestion.includes(
                            type.quesionTypeId
                          )}
                          onChange={(e) =>
                            handleQuestionChange(e, type.quesionTypeId)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="courseStartDate">Course Start Date:</label>
                  <input
                    type="date"
                    id="courseStartDate"
                    name="courseStartDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="testCreation_-list">
                  <label htmlFor="courseEndDate">Course End Date:</label>
                  <input
                    type="date"
                    id="courseEndDate"
                    name="courseEndDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="cost">Cost:</label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={otsformData.cost}
                    onChange={handleChangeots}
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="discount">Discount (%):</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={otsformData.discount}
                    onChange={handleChangeots}
                  />
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="discountAmount">Discount Amount:</label>
                  <input
                    type="number"
                    id="discountAmount"
                    name="discountAmount"
                    value={otsformData.discountAmount}
                    readOnly
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="totalPrice">Total Price:</label>
                  <input
                    type="number"
                    id="totalPrice"
                    name="totalPrice"
                    value={otsformData.totalPrice}
                    readOnly
                  />
                </div>
              </div>
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="paymentlink">Payment link:</label>
                  <input
                    type="text"
                    id="paymentlink"
                    name="paymentlink"
                    value={otsformData.paymentlink}
                    onChange={handleChangeots}
                  />
                </div>
                <div className="formdiv_contaniner">
                  <label>Upload Course Image: </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="cardImage"
                    onChange={handleCourseImageChange}
                    id="uploadInputFile_ovl_upload_file"
                  />
                </div>
              </div>
            </div>

            <div className="ccform_btnbs">
              <button className="ots_-createBtn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {/* pqb */}
      {activeForm === "form2" && (
        <div className="ONLINE_TEST_SERIES_COURSE_CREATION_FORM">
          <form onSubmit={handleSubmitpqb} className="ots_-Form">
            <h2 className="ots_courseTitle_text">
              PRACTICES QUESTION BANK COURSE CREATION FORM
            </h2>
            <div className="otsCloseBtn_Mar">
              <button
                className="ots_btnClose"
                type="button"
                onClick={handleCloseForm}
              >
                Close
              </button>
            </div>

            <div className="coures-contant_-flexCOntantc examSubjects_-contant">
              <div className="testCreation_-list">
                <label htmlFor="courseName">Course Name:</label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={pqbformData.courseName}
                  onChange={handleChangepqb}
                />
                {/* <div className="error-message">
                      {validationMessages.courseName}
                    </div> */}
              </div>
              <div className="testCreation_-list">
                <label htmlFor="year">Select Year:</label>
                <select
                  id="year"
                  name="courseYear"
                  value={pqbformData.courseYear}
                  onChange={handleChangepqb}
                >
                  <option value="">Select Year</option>
                  {generateYearOptions()}
                </select>
              </div>
            </div>
            <div className="coures-contant_-flexCOntantc examSubjects_-contant">
              <div className="testCreation_list">
                <label>Type of test:</label>
                <div className="coures_-typeOfTest">
                  {typeOfTest.map((typeofTest) => (
                    <div
                      className="course_checkbox_continer course_frominput_container_media"
                      key={typeofTest.typeOfTestId}
                    >
                      <label htmlFor={`question-${typeofTest.typeOfTestId}`}>
                        {typeofTest.typeOfTestName}
                      </label>
                      <input
                        className="inputLable"
                        type="checkbox"
                        id={`typeofTest-${typeofTest.typeOfTestId}`}
                        name={`typeofTest-${typeofTest.typeOfTestId}`}
                        value={typeofTest.typeOfTestId}
                        checked={selectedtypeOfTest.includes(
                          typeofTest.typeOfTestId
                        )}
                        onChange={(e) =>
                          handletypeoftest(e, typeofTest.typeOfTestId)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>{" "}
            </div>
            <div className="coures-contant_-flexCOntantc examSubjects_-contant">
              <div className="testCreation_-list">
                <label htmlFor="exams">Select Exam:</label>
                <select id="exams" value={selectedexams} onChange={handleexams}>
                  <option value="">Select exams</option>
                  {exams.map((exams) => (
                    <option key={exams.examId} value={exams.examId}>
                      {exams.examName}
                    </option>
                  ))}
                </select>
                {/* <div className="error-message">
                      {validationMessages.exam}
                    </div> */}
              </div>

              <div className="testCreation_-list">
                <label>Select Subjects:</label>
                <div className="coures_-Subjects">
                  {subjectsData.map((subject) => (
                    <div
                      className="course_frominput_container "
                      id="course_frominput_container_media"
                      key={subject.subjectId}
                    >
                      <label htmlFor={`subject-${subject.subjectId}`}>
                        {subject.subjectName}
                      </label>
                      <input
                        className="inputLable"
                        type="checkbox"
                        id={`subject-${subject.subjectId}`}
                        name={`subject-${subject.subjectId}`}
                        value={subject.subjectId}
                        checked={selectedSubjects.includes(subject.subjectId)}
                        onChange={(e) =>
                          handleSubjectChange(e, subject.subjectId)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="coures-contant_-flexCOntantc examSubjects_-contant">
              <div className="testCreation_list">
                <label>Type of Questions:</label>
                <div className="course_checkbox_continer_content">
                  {typeofQuestion.map((type) => (
                    <div
                      className="course_checkbox_continer course_frominput_container_media"
                      key={type.quesionTypeId}
                    >
                      <i class="fa-solid fa-caret-right"></i>
                      <label htmlFor={`question-${type.quesionTypeId}`}>
                        {type.typeofQuestion}
                      </label>
                      <input
                        className="inputLable"
                        type="checkbox"
                        id={`question-${type.quesionTypeId}`}
                        name={`question-${type.quesionTypeId}`}
                        value={type.quesionTypeId}
                        checked={selectedtypeofQuestion.includes(
                          type.quesionTypeId
                        )}
                        onChange={(e) =>
                          handleQuestionChange(e, type.quesionTypeId)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="coures-contant_-flexCOntantc examSubjects_-contant">
              <div className="testCreation_-list">
                <label htmlFor="courseStartDate">Course Start Date:</label>
                <input
                  type="date"
                  id="courseStartDate"
                  name="courseStartDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="testCreation_-list">
                <label htmlFor="courseEndDate">Course End Date:</label>
                <input
                  type="date"
                  id="courseEndDate"
                  name="courseEndDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="coures-contant_-flexCOntantc examSubjects_-contant">
              <div className="testCreation_-list">
                <label htmlFor="cost">Cost:</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={pqbformData.cost}
                  onChange={handleChangepqb}
                />
                {/* <div className="error-message">
                    {validationMessages.cost}
                  </div> */}
              </div>
              <div className="testCreation_-list">
                <label htmlFor="discount">Discount (%):</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={pqbformData.discount}
                  onChange={handleChangepqb}
                />
              </div>
            </div>

            <div className="coures-contant_-flexCOntantc examSubjects_-contant">
              <div className="testCreation_-list">
                <label htmlFor="discountAmount">Discount Amount:</label>
                <input
                  type="number"
                  id="discountAmount"
                  name="discountAmount"
                  value={pqbformData.discountAmount}
                  readOnly
                />
              </div>
              <div className="testCreation_-list">
                <label htmlFor="totalPrice">Total Price:</label>
                <input
                  type="number"
                  id="totalPrice"
                  name="totalPrice"
                  value={pqbformData.totalPrice}
                  readOnly
                />
              </div>
            </div>
            <div className="coures-contant_-flexCOntantc examSubjects_-contant">
              <div className="testCreation_-list">
                <label htmlFor="paymentlink">Payment link:</label>
                <input
                  type="text"
                  id="paymentlink"
                  name="paymentlink"
                  value={pqbformData.paymentlink}
                  onChange={handleChangepqb}
                />
              </div>
              <div className="formdiv_contaniner">
                <label>Upload Course Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  name="cardImage"
                  id="uploadInputFile_ovl_upload_file"
                  onChange={handleCourseImageChange}
                />
              </div>
            </div>
            <div className="ccform_btnbs">
              <button className="ots_-createBtn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {/* ovl */}
      {activeForm === "form3" && (
        <div className="ONLINE_TEST_SERIES_COURSE_CREATION_FORM">
          <form onSubmit={OVLhandleSubmit} className="ots_-Form">
            <h2 className="ots_courseTitle_text">
              ONLINE VIDEO LECTURE COURSE CREATION FORM
            </h2>

            <div
              className="otsCloseBtn_Mar"
              style={{ marginTop: "2rem", marginBottom: "6rem" }}
            >
              <button
                className="ots_btnClose"
                type="button"
                onClick={handleCloseForm}
              >
                Close
              </button>
            </div>

            <div className="coures_-container">
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="courseName">Course Name:</label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={ovlformData.courseName}
                    onChange={handleChange}
                  />
                </div>

                <div className="testCreation_-list">
                  <label htmlFor="exams">Select Exam:</label>
                  <select
                    id="exams"
                    value={selectedexams}
                    onChange={handleexams}
                  >
                    <option value="">Select exams</option>
                    {exams.map((exams) => (
                      <option key={exams.examId} value={exams.examId}>
                        {exams.examName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Select Subjects:</label>
                  <div className="coures_-Subjects">
                    {subjectsData.map((subject) => (
                      <div
                        className="course_frominput_container "
                        id="course_frominput_container_media"
                        key={subject.subjectId}
                      >
                        <label htmlFor={`subject-${subject.subjectId}`}>
                          {subject.subjectName}
                        </label>
                        <input
                          className="inputLable"
                          type="checkbox"
                          id={`subject-${subject.subjectId}`}
                          name={`subject-${subject.subjectId}`}
                          value={subject.subjectId}
                          checked={selectedSubjects.includes(subject.subjectId)}
                          onChange={(e) =>
                            handleSubjectChange(e, subject.subjectId)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="courseStartDate">Course Start Date:</label>
                  <input
                    type="date"
                    id="courseStartDate"
                    name="courseStartDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="testCreation_-list">
                  <label htmlFor="courseEndDate">Course End Date:</label>
                  <input
                    type="date"
                    id="courseEndDate"
                    name="courseEndDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="cost">Cost:</label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={ovlformData.cost}
                    onChange={handleChange}
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="discount">Discount (%):</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={ovlformData.discount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="discountAmount">Discount Amount:</label>
                  <input
                    type="number"
                    id="discountAmount"
                    name="discountAmount"
                    value={ovlformData.discountAmount}
                    readOnly
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="totalPrice">Total Price:</label>
                  <input
                    type="number"
                    id="totalPrice"
                    name="totalPrice"
                    value={ovlformData.totalPrice}
                    readOnly
                  />
                </div>
              </div>

              {/*  */}
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="paymentlink">Payment link:</label>
                  <input
                    type="text"
                    id="paymentlink"
                    name="paymentlink"
                    value={ovlformData.paymentlink}
                    onChange={handleChange}
                  />
                </div>

                <div className="testCreation_-list">
                  <label>Upload Course Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    name="cardImage"
                    onChange={handleCourseImageChange}
                    id="uploadInputFile_ovl_upload_file"
                  />
                </div>
              </div>

              <div className="ccform_btnbs">
                <button className="ots_-createBtn" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {activeForm === "form4" && (
        <div className="ONLINE_TEST_SERIES_COURSE_CREATION_FORM">
          <form onSubmit={handleSubmitCP} className="ots_-Form">
            <h2 className="ots_courseTitle_text">
              COMPLETE PACKAGE COURSE CREATION FORM
            </h2>
            <div className="otsCloseBtn_Mar">
              <button
                type="button"
                className="ots_btnClose"
                onClick={handleCloseForm}
              >
                Close
              </button>
            </div>
            <div>
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="courseName">Course Name:</label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={cpformData.courseName}
                    onChange={handleChangecp}
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="year">Select Year:</label>
                  <select
                    id="year"
                    name="courseYear"
                    value={cpformData.courseYear}
                    onChange={handleChangecp}
                  >
                    <option value="">Select Year</option>
                    {generateYearOptions()}
                  </select>
                </div>
              </div>
              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="exams">Select Exam:</label>
                  <select
                    id="exams"
                    value={selectedexams}
                    onChange={handleexams}
                  >
                    <option value="">Select exams</option>
                    {exams.map((exams) => (
                      <option key={exams.examId} value={exams.examId}>
                        {exams.examName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="testCreation_-list">
                  <label>Select Subjects:</label>
                  <div className="coures_-Subjects">
                    {subjectsData.map((subject) => (
                      <div
                        className="course_frominput_container"
                        id="course_frominput_container_media"
                        key={subject.subjectId}
                      >
                        <label htmlFor={`subject-${subject.subjectId}`}>
                          {subject.subjectName}
                        </label>
                        <input
                          className="inputLable"
                          type="radio" // Change from "checkbox" to "radio"
                          id={`subject-${subject.subjectId}`}
                          name="subject" // Ensure all radio buttons share the same name
                          value={subject.subjectId}
                          checked={selectedSubject.includes(subject.subjectId)}
                          onChange={(e) =>
                            handleSubjectChangecp(e, subject.subjectId)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="topicName">Topic Name:</label>
                  <input
                    type="text"
                    id="topicName"
                    name="topicName"
                    value={cpformData.topicName}
                    onChange={handleChangecp}
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="courseStartDate">Course Start Date:</label>
                  <input
                    type="date"
                    id="courseStartDate"
                    name="courseStartDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="courseEndDate">Course End Date:</label>
                  <input
                    type="date"
                    id="courseEndDate"
                    name="courseEndDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="cost">Cost:</label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={cpformData.cost}
                    onChange={handleChangecp}
                  />
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="discount">Discount (%):</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={cpformData.discount}
                    onChange={handleChangecp}
                  />
                </div>
                <div className="testCreation_-list">
                  <label htmlFor="discountAmount">Discount Amount:</label>
                  <input
                    type="number"
                    id="discountAmount"
                    name="discountAmount"
                    value={cpformData.discountAmount}
                    readOnly
                  />
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label htmlFor="totalPrice">Total Price:</label>
                  <input
                    type="number"
                    id="totalPrice"
                    name="totalPrice"
                    value={cpformData.totalPrice}
                    readOnly
                  />
                </div>

                <div className="testCreation_-list">
                  <label htmlFor="paymentlink">Payment link:</label>
                  <input
                    type="text"
                    id="paymentlink"
                    name="paymentlink"
                    value={cpformData.paymentlink}
                    onChange={handleChangecp}
                  />
                </div>
              </div>

              <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Upload Course Image: </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="cardImage"
                    onChange={handleCourseImageChange}
                    id="uploadInputFile_ovl_upload_file"
                  />
                </div>
              </div>
            </div>

            <div className="ccform_btnbs">
              <button className="ots_-createBtn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="" style={{ marginTop: "4rem" }}>
        <div className="create_exam_header_SearchBar">
          {/* Search bar */}
          <FaSearch className="Adminsearchbaricon" />
          <input
            className="AdminSearchBar"
            type="text"
            placeholder="Search By Course Name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <h3 className="list_-otsTitels">created COURSES list</h3>
        <table className="couresCreation_-table">
          <thead className="otsGEt_-contantHead couresotc_-table">
            <tr>
              <th>S.no</th>
              <th>Portal</th>
              <th> Exam</th>
              <th>Course</th>
              <th>Subjects</th>
              {/* <th>Type of Test</th> */}
              {/* <th>Type of Questions</th> */}
              <th>Start Date</th>
              <th>End Date</th>
              <th>Cost</th>
              <th>Discount</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="couresotc_-table_-tBody">
            {displayData.length === 0 ? (
              <tr>
                <td colSpan="6">No Create found.</td>
              </tr>
            ) : (
              displayData.map((course, index) => (
                <tr
                  key={course.courseCreationId}
                  className={
                    course.courseCreationId % 2 === 0 ? "color1" : "color2"
                  }
                >
                  <td>{index + 1 + pageNumber * usersPerPage}</td>
                  <td>{course.Portale_Name}</td>
                  <td>{course.examName}</td>
                  <td>{course.courseName}</td>
                  <td>
                    {Array.isArray(course.subjects) &&
                    course.subjects.length > 0
                      ? course.subjects.join(", ")
                      : "N/A"}
                  </td>
                  {/* <td>
                      {Array.isArray(course.typeOfTestName) &&
                      course.typeOfTestName.length > 0
                        ? course.typeOfTestName.join(", ")
                        : "N/A"}
                    </td> */}
                  {/* <td>
                      {Array.isArray(course.typeofQuestion) &&
                      course.typeofQuestion.length > 0
                        ? course.typeofQuestion.join(", ")
                        : "N/A"}
                    </td> */}
                  <td>{formatDate(course.courseStartDate)}</td>
                  <td>{formatDate(course.courseEndDate)}</td>
                  <td>
                    <i
                      class="fa-solid fa-indian-rupee-sign"
                      id="rupee-sign"
                    ></i>
                    {course.cost}
                  </td>
                  <td>{course.Discount}%</td>
                  <td>
                    <i
                      class="fa-solid fa-indian-rupee-sign"
                      id="rupee-sign"
                    ></i>
                    {course.totalPrice}
                  </td>
                  <td>
                    <div className="EditDelete_-btns">
                      <Link
                        className="Ots_-edit"
                        to={`/UpdatingCourseInAdmin/${course.courseCreationId}/${course.Portale_Id}`}
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </Link>
                      <button
                        className="Ots_-delete"
                        onClick={() => handleDelete(course.courseCreationId)}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ReactPaginate
  previousLabel={<i className="fa-solid fa-angles-left"></i>}
  nextLabel={<i className="fa-solid fa-angles-right"></i>}
  pageCount={pageCount}
  onPageChange={changePage}
  containerClassName={"paginationBttns"}
  previousLinkClassName={"previousBttn"}
  nextLinkClassName={"nextBttn"}
  disabledClassName={"paginationDisabled"}
  activeClassName={"paginationActive"}
/>
      </div>
    </div>
  );
}

export default Portal_coures_creation_admin;
