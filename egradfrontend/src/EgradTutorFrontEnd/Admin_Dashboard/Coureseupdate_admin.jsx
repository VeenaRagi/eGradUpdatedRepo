import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from '../../apiConfig'
const Coureseupdate_admin = () => {
  const { courseCreationId } = useParams();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [courseYear,setCourseYear] = useState("");
  const [courseStartDate, setCourseStartDate] = useState("");
  const [courseEndDate, setCourseEndDate] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [typeOfTests, setTypeOfTests] = useState([]);
  const [selectedTypeOfTests, setSelectedTypeOfTests] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
  // const [testpattern, setTestpattern] = useState([]);
  // const [selectedTestpattern, setSelectedTestpattern] = useState([]);
  const [paymentlink, setPaymentlink] = useState("");
  const [courseImage, setCourseImage] = useState([]);

   const  handleCourseImageChange = (event) => {
     const file = event.target.files[0];
     setCourseImage(file);
    //  console.log(courseImage)
   };
   console.log(paymentlink);
   console.log(courseImage);
  const generateYearOptions = () => {
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
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/CoureseCreation/courseupdate/${courseCreationId}`
        );

        const examsResponse = await axios.get(
          `${BASE_URL}/CoureseCreation/courese-exams`
        );
       
        const courseData = response.data[0];
        setExams(examsResponse.data);
        if (courseData) {
          setCourseName(courseData.courseName || "");
          setSelectedExam(
            courseData.examId !== undefined ? courseData.examId.toString() : ""
          );
         
          setCourseStartDate(courseData.courseStartDate || "");
          setCourseEndDate(courseData.courseEndDate || "");
          setCost(
            courseData.cost !== undefined ? courseData.cost.toString() : ""
          );
          setDiscount(
            courseData.Discount !== undefined
              ? courseData.Discount.toString()
              : ""
          );
          setTotalPrice(
            courseData.totalPrice !== undefined
              ? courseData.totalPrice.toString()
              : ""
          );
          
          setPaymentlink(
            courseData.paymentlink !== undefined
              ? courseData.paymentlink.toString()
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
  }, [courseCreationId]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (selectedExam) {
          const response = await axios.get(
            `${BASE_URL}/CoureseCreation/courese-exam-subjects/${selectedExam}/subjects`
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
          `${BASE_URL}/CoureseCreation/course_subjects/${courseCreationId}`
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
  }, [courseCreationId]);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/CoureseCreation/type_of_questions`
        );
        setQuestionTypes(response.data);
      } catch (error) {
        console.error("Error fetching question types:", error);
      }
    };

    fetchQuestionTypes();
  }, []);

  useEffect(() => {
    const fetchSelectedQuestionTypes = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/CoureseCreation/course-type-of-questions/${courseCreationId}`
        );
        const selectedTypes = response.data.map((type) => type.quesionTypeId);
        setSelectedQuestionTypes(selectedTypes);
      } catch (error) {
        console.error("Error fetching selected question types:", error);
      }
    };
    if (courseCreationId) {
      fetchSelectedQuestionTypes();
    }
  }, [courseCreationId]);

  const handleQuestionTypeCheckboxChange = (quesionTypeId) => {
    const updatedSelectedTypes = [...selectedQuestionTypes];
    const index = updatedSelectedTypes.indexOf(quesionTypeId);

    if (index === -1) {
      updatedSelectedTypes.push(quesionTypeId);
    } else {
      updatedSelectedTypes.splice(index, 1);
    }

    setSelectedQuestionTypes(updatedSelectedTypes);
  };

  //type of test
  useEffect(() => {
    const fetchtypeOfTests = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/CoureseCreation/type_of_tests`);
        setTypeOfTests(response.data);
      } catch (error) {
        console.error("Error fetching  type of test:", error);
      }
    };

    fetchtypeOfTests();
  }, []);

  useEffect(() => {
    const fetchSelectedtypeOftests = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/CoureseCreation/course-type-of-test/${courseCreationId}`
        );
        const selectedTypeOfTests = response.data.map(
          (typeOfTest) => typeOfTest.typeOfTestId
        );
        setSelectedTypeOfTests(selectedTypeOfTests);
      } catch (error) {
        console.error("Error fetching selected question types:", error);
      }
    };
    if (courseCreationId) {
      fetchSelectedtypeOftests();
    }
  }, [courseCreationId]);

  const handletypeOfTestsCheckboxChange = (typeOfTestId) => {
    const updatedSelectedTypeOfTests = [...selectedTypeOfTests];
    const index = updatedSelectedTypeOfTests.indexOf(typeOfTestId);

    if (index === -1) {
      updatedSelectedTypeOfTests.push(typeOfTestId);
    } else {
      updatedSelectedTypeOfTests.splice(index, 1);
    }

    setSelectedTypeOfTests(updatedSelectedTypeOfTests);
  };

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
 const [formData, setFormData] = useState({ cardImage: "" });
 const handleSubmit = async (e) => {
   e.preventDefault();

   const formDataObj = new FormData();
  //  formDataObj.append("selectedTestpattern", selectedTestpattern);
   formDataObj.append("courseName", courseName);
   formDataObj.append("courseYear", courseYear);
   formDataObj.append("selectedTypeOfTests", selectedTypeOfTests);
   formDataObj.append("selectedExam", selectedExam);
   formDataObj.append("selectedSubjects", selectedSubjects);
   formDataObj.append("selectedQuestionTypes", selectedQuestionTypes);
   formDataObj.append("courseStartDate", courseStartDate);
   formDataObj.append("courseEndDate", courseEndDate);
   formDataObj.append("cost", cost);
   formDataObj.append("discount", discount);
   formDataObj.append("totalPrice", totalPrice);
   formDataObj.append("paymentlink", paymentlink);
   formDataObj.append("cardImage", courseImage);

   try {
     await axios.put(
       `${BASE_URL}/CoureseCreation/update-course/${courseCreationId}`,
       formDataObj,
       {
         headers: {
           "Content-Type": "multipart/form-data",
         },
       }
     );

     console.log(courseImage); // Assuming courseImage is defined elsewhere
     navigate("/UgadminHome");
   } catch (error) {
     console.error("Error updating course:", error);
     alert("Failed to update course. Please try again.");
   }
 };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  // const formDataObj = new FormData();
  //   try {
  //     await axios.put(
  //       `${BASE_URL}/CoureseCreation/update-course/${courseCreationId}`,

  //       {
  //         selectedTestpattern,
  //         courseName,
  //         courseYear,
  //         selectedTypeOfTests,
  //         selectedExam,
  //         selectedSubjects,
  //         selectedQuestionTypes,
  //         courseStartDate,
  //         courseEndDate,
  //         cost,
  //         discount,
  //         totalPrice,
  //         paymentlink,
         
  //       }, formDataObj.append("cardImage", courseImage)
  //     );
  //     console.log(cardImage);
  //     navigate("/UgadminHome");
  //   } catch (error) {
  //     console.error("Error updating course:", error);
  //     alert("Failed to update course. Please try again.");
  //   }
  // };



  // useEffect(() => {
  //   const fetchTestpattern = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/CoureseCreation/testpattern`
  //       );
  //       setTestpattern(response.data);
  //     } catch (error) {
  //       console.error("Error fetching question types:", error);
  //     }
  //   };

  //   fetchTestpattern();
  // }, []);

  // useEffect(() => {
  //   const fetchSelectedTestpattern = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/CoureseCreation/selected_test_pattern/${courseCreationId}`
  //       );
  //       const selectedTypes = response.data.map((pattern) => pattern.Test_Pattern_Id);
  //       setSelectedTestpattern(selectedTypes);
  //     } catch (error) {
  //       console.error("Error fetching selected question types:", error);
  //     }
  //   };
  //   if (courseCreationId) {
  //     fetchSelectedTestpattern();
  //   }
  // }, [courseCreationId]);

  // const handleTestpatternCheckboxChange = (Test_Pattern_Id) => {
  //   const updatedSelectedTypes = [...selectedTestpattern];
  //   const index = updatedSelectedTypes.indexOf(Test_Pattern_Id);

  //   if (index === -1) {
  //     updatedSelectedTypes.push(Test_Pattern_Id);
  //   } else {
  //     updatedSelectedTypes.splice(index, 1);
  //   }

  //   setSelectedTestpattern(updatedSelectedTypes);
  // };
  return (
    <div className="examUpdate_-container">
      <form onSubmit={handleSubmit}>
        <h2 className="otsTitels">Course Update</h2>
        <div className="courseupdate_frominput_container examSubjects_-contant">
          {/* <label>Test Patteren:</label> */}
          {/* <div className="courseupdate_frominput_container_checkbox">
            {testpattern.map((pattern) => (
              <div key={pattern.Test_Pattern_Id}>
                <input
                  className="inputLable"
                  type="checkbox"
                  id={`testpattern-type-${pattern.Test_Pattern_Id}`}
                  value={pattern.Test_Pattern_Id}
                  checked={selectedTestpattern.includes(
                    pattern.Test_Pattern_Id
                  )}
                  onChange={() =>
                    handleTestpatternCheckboxChange(pattern.Test_Pattern_Id)
                  }
                />
                <label htmlFor={`testpattern-type-${pattern.Test_Pattern_Id}`}>
                  {pattern.Test_pattern_name}
                </label>
              </div>
            ))}
          </div> */}
        </div>
        <div className="courseupdate_frominput_container">
          <label> Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <div className="courseupdate_frominput_container examSubjects_-contant">
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
        </div>
        <div className="courseupdate_frominput_container examSubjects_-contant">
          <label>Select Type of Test:</label>
          <div className="courseupdate_frominput_container_checkbox ">
            {typeOfTests.map((typeOfTest) => (
              <div key={typeOfTest.typeOfTestId}>
                <input
                  className="inputLable"
                  type="checkbox"
                  id={`typeOfTestes-${typeOfTest.typeOfTestId}`}
                  value={typeOfTest.typeOfTestId}
                  checked={selectedTypeOfTests.includes(
                    typeOfTest.typeOfTestId
                  )}
                  onChange={() =>
                    handletypeOfTestsCheckboxChange(typeOfTest.typeOfTestId)
                  }
                />
                <label htmlFor={`question-type-${typeOfTest.typeOfTestId}`}>
                  {typeOfTest.typeOfTestName}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="courseupdate_frominput_container">
          <label>Select Exam:</label>
          <select
            name="examId"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">Select Exam</option>
            {exams.map((exam) => (
              <option key={exam.examId} value={exam.examId}>
                {exam.examName}
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
        <div className="courseupdate_frominput_container examSubjects_-contant">
          <label>Select Type of Questions:</label>

          <div className="courseupdate_frominput_container_checkbox">
            {questionTypes.map((type) => (
              <div key={type.quesionTypeId}>
                <input
                  className="inputLable"
                  type="checkbox"
                  id={`question-type-${type.quesionTypeId}`}
                  value={type.quesionTypeId}
                  checked={selectedQuestionTypes.includes(type.quesionTypeId)}
                  onChange={() =>
                    handleQuestionTypeCheckboxChange(type.quesionTypeId)
                  }
                />
                <label htmlFor={`question-type-${type.quesionTypeId}`}>
                  {type.typeofQuestion}
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
        <div className="courseupdate_frominput_container">
          <label> Payment Link:</label>
          <input
            type="text"
            value={paymentlink}
            onChange={(e) => setPaymentlink(e.target.value)}
          />
        </div>
        <div className="courseupdate_frominput_container">
          <label>Upload Course Image:</label>
          <input
            type="file"
            accept="image/*"
            name="cardImage"
            onChange={handleCourseImageChange}
          />
        </div>
        {/* <img src={courseImage} alt="" /> */}
    

        <button className="ots_-createBtn" type="submit">
          UPDATE COURSE
        </button>
        <button
            type="button"
            onClick={() => navigate("/UgadminHome")}
            className="ots_-createBtn"
          >
            Cancel
          </button>
      </form>
    </div>
  );
};

export default Coureseupdate_admin;