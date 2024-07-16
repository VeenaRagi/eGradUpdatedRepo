import React, { useState, useEffect } from "react";
import BASE_URL from "../../src/apiConfig";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const OVL_CourseCreation = () => {
  const [exams, setExams] = useState([]);
  const [selectedexams, setSelectedexams] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectsData, setSubjectsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [courseImage, setCourseImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const resetFormFields = () => {
    setFormData({
      courseName: "",
      courseYear: "",
      OVL_Exam_Id: "",
      courseStartDate: "",
      courseEndDate: "",
      cost: "",
      discount: "",
      discountAmount: "",
      totalPrice: "",
      cardImage: "",
    });
    setSelectedSubjects([]);
    setIsFormOpen(false);
  };

  const [formData, setFormData] = useState({
    courseName: "",
    courseYear: "",
    OVL_Exam_Id: "",
    courseStartDate: "",
    courseEndDate: "",
    cost: "",
    discount: "",
    discountAmount: "",
    totalPrice: "",
    cardImage: "",
  });

  useEffect(() => {
    const fetchSelectedExam = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/OVL_CourseCreation/examsfor_courseCreation/${selectedexams}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Selected Exam Data:", data); 
      } catch (error) {
        console.error("Error fetching selected exam:", error);
      }
    };

    fetchSelectedExam();
  }, [selectedexams]);

  useEffect(() => {
  

    fetchCourseData();
  }, []);
  const fetchCourseData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/OVL_CourseCreation/OVL_CourseData`
      );
      const result = await response.json();
      const coursesWithArrays = result.map((course) => ({
        ...course,

        subjects: course.subjects ? course.subjects.split(", ") : [],
      }));
      setCourseData(coursesWithArrays);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };
  useEffect(() => {
    fetch(`${BASE_URL}/OVL_CourseCreation/OVL_feaching_exams`)
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
        `${BASE_URL}/OVL_CourseCreation/feaching_subject_acordingtoexam/${selectedExamId}/subjects`
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

  const handleStartDateChange = (e) => {
    const formattedDate = e.target.value;
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (e) => {
    const formattedDate = e.target.value;
    setEndDate(formattedDate);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cost" || name === "discount") {
      const cost = name === "cost" ? parseFloat(value) : formData.cost;
      const discount =
        name === "discount" ? parseFloat(value) : formData.discount;
      const discountAmount =
        !isNaN(cost) && !isNaN(discount) ? (cost * discount) / 100 : "";
      const totalPrice =
        !isNaN(cost) && !isNaN(discountAmount) ? cost - discountAmount : "";
      setFormData({
        ...formData,
        // courseYear:courseYear,
        OVL_Exam_Id: selectedexams,
        subjects: selectedSubjects,
        courseStartDate: startDate,
        courseEndDate: endDate,
        cost: cost,
        discount: discount,
        discountAmount: discountAmount,
        totalPrice: totalPrice,
      });
    } else if (name === "courseStartDate" || name === "courseEndDate") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFormFields();

    const formDataObj = new FormData();
    formDataObj.append("courseName", formData.courseName);
    formDataObj.append("courseYear", formData.courseYear);
    formDataObj.append("OVL_Exam_Id", formData.OVL_Exam_Id);
    formDataObj.append("courseStartDate", formData.courseStartDate);
    formDataObj.append("courseEndDate", formData.courseEndDate);
    formDataObj.append("cost", formData.cost);
    formDataObj.append("discount", formData.discount);
    formDataObj.append("totalPrice", formData.totalPrice);
    formDataObj.append("cardImage", courseImage); // Append image file
    formDataObj.append("subjects", JSON.stringify(selectedSubjects));

    console.log(formDataObj);
    try {
      const response = await fetch(
        `${BASE_URL}/OVL_CourseCreation/OVL_coursecreation`,
        {
          method: "POST",
          body: formDataObj, // Use FormData object directly
        }
      );

      const result = await response.json();
      if (result && result.OVL_Course_Id ) {
        const OVL_Course_Id  = result.OVL_Course_Id ;
        const subjectsResponse = await fetch(
          `${BASE_URL}/OVL_CourseCreation/OVL_course_subjects`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              OVL_Course_Id ,
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
    } catch (error) {
      console.error("Error submitting course data:", error);
      // Handle error or show an error message to the user
    }
  };

  const handleCourseImageChange = (event) => {
    const file = event.target.files[0];
    setCourseImage(file);
  };

  const handleDelete = async (OVL_Course_Id ) => {
    // Display a confirmation dialog before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `${BASE_URL}/OVL_CourseCreation/OVL_Delete_CourseData/${OVL_Course_Id }`,
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
          (course) => course.OVL_Course_Id  !== OVL_Course_Id 
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

  const openForm = () => {
    setIsFormOpen(true);
    if (isFormOpen) {
      resetFormFields();
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    if (isFormOpen) {
      resetFormFields();
    }
  };

  // Function to format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
const filteredCourses = courseData.filter((courseData) =>
  courseData.OVL_Course_Name && courseData.OVL_Course_Name.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="otsMainPages">
      <div className="">
        <h3 className="Coures_-otsTitels">Courses page</h3>

        {isFormOpen ? (
          <>
            <form onSubmit={handleSubmit}>
              <div
                className="create_exam_header"
                style={{ display: "flex", gap: "1rem" }}
              >
                <button
                  className="ots_btnClose "
                  type="button"
                  onClick={closeForm}
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
                      value={formData.courseName}
                      onChange={handleChange}
                    />
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
                        <option key={exams.OVL_Exam_Id} value={exams.OVL_Exam_Id}>
                          {exams.OVL_Exam_Name}
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
                            checked={selectedSubjects.includes(
                              subject.subjectId
                            )}
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
                      value={formData.cost}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="testCreation_-list">
                    <label htmlFor="discount">Discount (%):</label>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
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
                      value={formData.discountAmount}
                      readOnly
                    />
                  </div>
                  <div className="testCreation_-list">
                    <label htmlFor="totalPrice">Total Price:</label>
                    <input
                      type="number"
                      id="totalPrice"
                      name="totalPrice"
                      value={formData.totalPrice}
                      readOnly
                    />
                  </div>

                  <div className="formdiv_contaniner">
                    <label>Upload Course Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      name="cardImage"
                      onChange={handleCourseImageChange}
                    />
                  </div>
                </div>
                <div className="create_exam_header">
                  <button className="ots_-createBtn" type="submit">
                    Create Course
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="create_exam_header">
            <button className="otc_-addExam" type="button" onClick={openForm}>
              <i class="fa-solid fa-plus"></i>
              Add course
            </button>
          </div>
        )}
      </div>
      
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
              <th>s.no</th>
              <th>Course</th>
              <th>Exam</th>
              <th>Subjects</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Cost</th>
              <th>Discount</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="couresotc_-table_-tBody">
            {filteredCourses.length === 0 ? (
              <tr>
<td colSpan="6" >NO Courses Found.</td>
              </tr>
            ):( 
              filteredCourses.map((course, index) => (
                <tr
                  key={course.OVL_Course_Id }
                  className={
                    course.OVL_Course_Id  % 2 === 0 ? "color1" : "color2"
                  }
                >
                  <td>{index + 1}</td>
                  <td>{course.OVL_Course_Name}</td>
  
                  <td>{course.OVL_Exam_Name}</td>
                  <td>
                    {Array.isArray(course.subjects) && course.subjects.length > 0
                      ? course.subjects.join(", ")
                      : "N/A"}
                  </td>
  
                  <td>{formatDate(course.OVL_Course_Startdate)}</td>
                  <td>{formatDate(course.OVL_Course_Enddate)}</td>
                  <td>
                    <i class="fa-solid fa-indian-rupee-sign"></i>
                    {course.OVL_Course_Cost}
                  </td>
                  <td>{course.OVL_Course_Discount}%</td>
                  <td>
                    <i class="fa-solid fa-indian-rupee-sign"></i>
                    {course.OVL_Course_Totalprice}
                  </td>
                  <td>
                    <div className="EditDelete_-btns">
                      <Link
                        className="Ots_-edit"
                        to={`/OVL_Course_Update/${course.OVL_Course_Id }`}
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </Link>
                      <button
                        className="Ots_-delete"
                        onClick={() => handleDelete(course.OVL_Course_Id )}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            {/* {courseData.map((course, index) => (
              <tr
                key={course.OVL_Course_Id }
                className={
                  course.OVL_Course_Id  % 2 === 0 ? "color1" : "color2"
                }
              >
                <td>{index + 1}</td>
                <td>{course.OVL_Course_Name}</td>

                <td>{course.OVL_Exam_Name}</td>
                <td>
                  {Array.isArray(course.subjects) && course.subjects.length > 0
                    ? course.subjects.join(", ")
                    : "N/A"}
                </td>

                <td>{formatDate(course.OVL_Course_Startdate)}</td>
                <td>{formatDate(course.OVL_Course_Enddate)}</td>
                <td>
                  <i class="fa-solid fa-indian-rupee-sign"></i>
                  {course.OVL_Course_Cost}
                </td>
                <td>{course.OVL_Course_Discount}%</td>
                <td>
                  <i class="fa-solid fa-indian-rupee-sign"></i>
                  {course.OVL_Course_Totalprice}
                </td>
                <td>
                  <div className="EditDelete_-btns">
                    <Link
                      className="Ots_-edit"
                      to={`/OVL_Course_Update/${course.OVL_Course_Id }`}
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </Link>
                    <button
                      className="Ots_-delete"
                      onClick={() => handleDelete(course.OVL_Course_Id )}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OVL_CourseCreation;
