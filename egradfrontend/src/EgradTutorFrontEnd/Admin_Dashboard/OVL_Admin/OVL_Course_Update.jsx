import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../src/apiConfig";
export const OVL_Course_Update = () => {
  const { OVL_Course_Id } = useParams();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  //   const [courseYear,setCourseYear] = useState("");
  const [courseStartDate, setCourseStartDate] = useState("");
  const [courseEndDate, setCourseEndDate] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  //   const generateYearOptions = () => {
  //     const currentYear = new Date().getFullYear();
  //     const startYear = 2000;
  //     const endYear = 2035;

  //     const yearOptions = [];
  //     for (let year = endYear; year >= startYear; year--) {
  //       yearOptions.push(
  //         <option key={year} value={year}>
  //           {year}
  //         </option>
  //       );
  //     }

  //     return yearOptions;
  //   };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/OVL_CourseCreation/OVL_coursedata_for_update/${OVL_Course_Id}`
        );

        const examsResponse = await axios.get(
          `${BASE_URL}/OVL_CourseCreation/OVL_examdataforupdate`
        );
        // const typeOfTestsResponse = await axios.get(
        //   "${BASE_URL}/type_of_tests"
        // );
        // setTypeOfTests(typeOfTestsResponse.data);
        const courseData = response.data[0];
        setExams(examsResponse.data);
        if (courseData) {
          setCourseName(courseData.OVL_Course_Name || "");
          setSelectedExam(
            courseData.OVL_Exam_Id !== undefined ? courseData.OVL_Exam_Id.toString() : ""
          );
          // setSelectedTypeOfTests(
          //   courseData.typeOfTestId !== undefined
          //     ? courseData.typeOfTestId.toString()
          //     : ""
          // );
          setCourseStartDate(courseData.OVL_Course_Startdate || "");
          setCourseEndDate(courseData.OVL_Course_Enddate || "");
          setCost(
            courseData.OVL_Course_Cost !== undefined ? courseData.OVL_Course_Cost.toString() : ""
          );
          setDiscount(
            courseData.OVL_Course_Discount !== undefined
              ? courseData.OVL_Course_Discount.toString()
              : ""
          );
          setTotalPrice(
            courseData.OVL_Course_Totalprice !== undefined
              ? courseData.OVL_Course_Totalprice.toString()
              : ""
          );
        } else {
          console.error("Course data not found.");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();
  }, [OVL_Course_Id]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (selectedExam) {
          const response = await axios.get(
            `${BASE_URL}/OVL_CourseCreation/feaching_subject_acordingtoexam/${selectedExam}/subjects`
          );
          setSubjects(response.data);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [selectedExam]);

  useEffect(() => {
    const fetchSelectedSubjects = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/OVL_CourseCreation/OVL_course_subjects/${OVL_Course_Id}`
        );
        const selectedSubjectIds = response.data.map(
          (subject) => subject.subjectId
        );
        setSelectedSubjects(selectedSubjectIds);
      } catch (error) {
        console.error("Error fetching selected subjects:", error);
      }
    };

    fetchSelectedSubjects();
  }, [OVL_Course_Id]);

  const handleSubjectCheckboxChange = (subjectId) => {
    const updatedSubjects = [...selectedSubjects];
    const index = updatedSubjects.indexOf(subjectId);

    if (index === -1) {
      updatedSubjects.push(subjectId);
    } else {
      updatedSubjects.splice(index, 1);
    }

    setSelectedSubjects(updatedSubjects);
  };

  // const formatDate = (dateString) => {
  //   if (!dateString) {
  //     return "";
  //   }
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");

  //   return `${year}-${month}-${day}`;
  // };

  const handleCalculateTotal = () => {
    // Assuming cost and discount are numbers
    const costValue = parseFloat(cost);
    const discountPercentage = parseFloat(discount);

    if (!isNaN(costValue) && !isNaN(discountPercentage)) {
      const discountAmount = (costValue * discountPercentage) / 100;
      const calculatedTotal = costValue - discountAmount;
      setTotalPrice(calculatedTotal.toFixed(2));
    } else {
      setTotalPrice("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${BASE_URL}/OVL_CourseCreation/update-course/${OVL_Course_Id}`,
        {
          courseName,
          //   courseYear,
          selectedExam,
          selectedSubjects,
          courseStartDate,
          courseEndDate,
          cost,
          discount,
          totalPrice,
        }
      );
      // alert("Course updated successfully");
      navigate("/UgadminHome");
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    }
  };

  return (
    <div className="examUpdate_-container">
      <form onSubmit={handleSubmit}>
        <h2 className="otsTitels">Course Update</h2>
        <div className="courseupdate_frominput_container">
          <label> Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        {/* <div className="courseupdate_frominput_container examSubjects_-contant">
          <label>Select Year:</label>
          <select
            id="year"
            name="courseYear"
            value={courseYear}
            onChange={(e) => setCourseYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {generateYearOptions()}
          </select>
        </div> */}
        <div className="courseupdate_frominput_container">
          <label>Select Exam:</label>
          <select
            name="OVL_Exam_Id"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">Select Exam</option>
            {exams.map((exam) => (
              <option key={exam.OVL_Exam_Id} value={exam.OVL_Exam_Id}>
                {exam.OVL_Exam_Name}
              </option>
            ))}
          </select>
        </div>

        <div className="courseupdate_frominput_container examSubjects_-contant">
          <label>Select Subjects:</label>

          <div className="courseupdate_frominput_container_checkbox ">
            {subjects.map((subject) => (
              <div key={subject.subjectId}>
                <input
                  className="inputLable"
                  type="checkbox"
                  id={`subject-${subject.subjectId}`}
                  value={subject.subjectId}
                  checked={selectedSubjects.includes(subject.subjectId)}
                  onChange={() =>
                    handleSubjectCheckboxChange(subject.subjectId)
                  }
                />
                <label htmlFor={`subject-${subject.subjectId}`}>
                  {subject.subjectName}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="courseupdate_frominput_container ">
          <label>Course Start Date:</label>
          <input
            type="date"
            value={courseStartDate}
            onChange={(e) => setCourseStartDate(e.target.value)}
          />
        </div>

        <div className="courseupdate_frominput_container examSubjects_-contant">
          <label>Course End Date:</label>
          <input
            type="date"
            value={courseEndDate}
            onChange={(e) => setCourseEndDate(e.target.value)}
          />
        </div>
        <div className="courseupdate_frominput_container">
          <label>Cost:</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => {
              setCost(e.target.value);
              handleCalculateTotal();
            }}
          />
        </div>
        <div className="courseupdate_frominput_container examSubjects_-contant">
          <label>Discount (%):</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => {
              setDiscount(e.target.value);
              handleCalculateTotal();
            }}
          />
        </div>
        <div className="courseupdate_frominput_container">
          <label>Total Price:</label>
          <input type="text" value={totalPrice} readOnly />
        </div>
        <button className="ots_-createBtn" type="submit">
          UPDATE COURSE
        </button>
      </form>
    </div>
  );
};
