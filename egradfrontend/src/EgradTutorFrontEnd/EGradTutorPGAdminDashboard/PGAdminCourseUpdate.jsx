import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import { useLocation } from "react-router-dom";
import '../EgradtutorPortalsAdmin/styles/ResponsiveForAdmin.css'
const PGAdminCourseUpdate = () => {
  const { portalId } = useParams();
  const navigate = useNavigate();
  const { courseCreationId } = useParams();
  //   ===========================================
  const [courseData, setCourseData] = useState([]);
  const [base64Image, setBase64Image] = useState(null);
  const [portals, setPortals] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedexams, setSelectedexams] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectsData, setSubjectsData] = useState([]);
  const [portaleId, setPortaleId] = useState(null);
  const [typeOfTest, setTypeOfTest] = useState([]);
  const [selectedtypeOfTest, setSelectedtypeOfTest] = useState([]);
  const [typeofQuestion, setTypeofQuestion] = useState([]);
  const [selectedtypeofQuestion, setSelectedtypeofQuestion] = useState([]);
  const [showPortalButtons, setShowPortalButtons] = useState(false);
  

  // ================================================
  const [courseName, setCourseName] = useState("");
  const [courseYear, setCourseYear] = useState("");
  const [courseStartDate, setCourseStartDate] = useState("");
  const [courseEndDate, setCourseEndDate] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [typeOfTests, setTypeOfTests] = useState([]);
  const [selectedTypeOfTests, setSelectedTypeOfTests] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
  const [paymentlink, setPaymentlink] = useState("");
  const [courseImage, setCourseImage] = useState([]);
  const handleCourseImageChange = (event) => {
    const file = event.target.files[0];
    setCourseImage(file);
  };
  

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
  // course creation useeffects
  useEffect(() => {
    axios
      .get(`${BASE_URL}/Portal_coures_creation_admin/Portal_feaching`)
      .then((response) => {
        setPortals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching portal data:", error);
      });
  }, []);
  useEffect(() => {
    fetch(`${BASE_URL}/CoureseCreation/courese-examsPg`)
      .then((response) => response.json())
      .then((data) => {
        setExams(data);
      })
      .catch((error) => console.error("Error fetching exams:", error));
  }, []);

  // useEffect(() => {
  //   const fetchTypeOfTest = async () => {
  //     try {
  //       const response = await fetch(
  //         `${BASE_URL}/CoureseCreation/type_of_PGtests`
  //       );
  //       const result = await response.json();
  //       setTypeOfTest(result);
  //     } catch (error) {
  //       console.error("Error fetching Type of questions:", error);
  //     }
  //   };

  //   fetchTypeOfTest();
  // }, []);



  useEffect(() => {
    const fetchTypeOfTest = async () => {
      try {
        const response = await fetch(`${BASE_URL}/CoureseCreation/type_of_PGtests`);
        const result = await response.json();
        setTypeOfTest(result);
      } catch (error) {
        console.error("Error fetching types of tests:", error);
      }
    };
  
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/CoureseCreation/type_of_PGtests/${portalId}/${courseCreationId}`
        );
        const courseData = await response.json();
        setSelectedTypeOfTests(courseData.type_of_test.split(","));
        console.log(selectedTypeOfTests)
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
  
    fetchTypeOfTest();
    fetchCourseData();
  }, [portalId, courseCreationId]);
  


  // useEffect(() => {
  //   const fetchTypeOfQuestion = async () => {
  //     try {
  //       const response = await fetch(
  //         `${BASE_URL}/CoureseCreation/type_of_questions`
  //       );
  //       const result = await response.json();
  //       setTypeofQuestion(result);
  //     } catch (error) {
  //       console.error("Error fetching Type of questions:", error);
  //     }
  //   };

  //   fetchTypeOfQuestion();
  // }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch types of questions
        const questionsResponse = await fetch(`${BASE_URL}/CoureseCreation/type_of_questions`);
        const questionsData = await questionsResponse.json();
        setTypeofQuestion(questionsData);
  
        // Fetch course data to get preselected question types
        const courseResponse = await fetch(
          `${BASE_URL}/CoureseCreation/courseupdate/${portalId}/${courseCreationId}`
        );
        const courseData = await courseResponse.json();
        setSelectedtypeofQuestion(courseData.question_types.split(","));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [portalId, courseCreationId]);
  

  const fetchCourseData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/course_creation_table`
      );
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
  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
  }, [selectedSubjects]);
  const handleCloseAndNavigate=()=>{
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
    })
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
    })
    
    navigate("/pgCourseAdmin")
  }
  //   impp
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/CoureseCreation/courseupdate/${portalId}/${courseCreationId}`
        );

        const courseData = response.data;
        console.log(courseData, "courseeeeeeeeeee");
        // setExams(examsResponse.data);
        if (portalId === "1") {
          setOtsFormData({
            courseName: courseData.courseName,
            courseYear: courseData.courseYear || "",
            examId: courseData.examId.toString() || "",
            typeofQuestion: courseData.question_types || "",
            courseStartDate: courseData.courseStartDate || "",
            courseEndDate: courseData.courseEndDate || "",
            cost: courseData.cost || "",
            discount: courseData.Discount || "",
            discountAmount:courseData.cost/100 * (courseData.discount)|| "",
            totalPrice: courseData.totalPrice || "",
            paymentlink: courseData.paymentlink || "",
            // cardImage: "",
          });
          console.log(otsformData)
          setBase64Image(courseData.cardImage);
          setStartDate(courseData.courseStartDate.toString());
          setEndDate(courseData.courseEndDate.toString());
          setSelectedexams(courseData.examId.toString());
          const response = await fetch(
            `${BASE_URL}/CoureseCreation/courese-exam-subjects/${courseData.examId}/pgSubjects`
          );
          const data = await response.json();
          setSubjectsData(data);
          const subArray = courseData.subjects.split(",");
       
          data.forEach((subject) => {
            if (subArray.includes(subject.subjectName)) {
            
              setSelectedSubjects((prev) => [...prev, subject.subjectId]);
              console.log(selectedSubjects)
            }
          });
          const arrayOfTypeOfTest = courseData.type_of_test.split(",");


          typeOfTest.forEach((element) => {
            if (arrayOfTypeOfTest.includes(element.typeOfTestName)) {
              setSelectedtypeOfTest((prev) => [...prev, element.typeOfTestId]);
            }
          });
          
          const typeOfQuestionsArray = courseData.question_types.split(",");
          typeOfQuestionsArray.forEach((element) => {
            if (arrayOfTypeOfTest.includes(element.typeOfTestName)) {
              setSelectedtypeOfTest((prev) => [...prev, element.typeOfTestId]);
            }
          });
          
          // asdf
        } else if (portalId === "2") {
          setPqbFormData({
            courseName: courseData.courseName || "",
            courseYear: courseData.courseYear || "",
            examId: courseData.examId.toString() || "",
            typeofQuestion: courseData.question_types || "",
            courseStartDate: courseData.courseStartDate || "",
            courseEndDate: courseData.courseEndDate || "",
            cost: courseData.cost || "",
            discount: courseData.Discount || "",
            discountAmount: "",
            totalPrice: courseData.totalPrice || "",
            paymentlink: courseData.paymentlink || "",
            // cardImage: "",
          });
          setBase64Image(courseData.cardImage);
          setSelectedexams(courseData.examId.toString());
          setStartDate(courseData.courseStartDate.toString());
          setEndDate(courseData.courseEndDate.toString());
          const response = await fetch(
            `${BASE_URL}/CoureseCreation/courese-exam-subjects/${courseData.examId}/pgSubjects`
          );
          const data = await response.json();
          setSubjectsData(data);
          setSelectedTypeOfTests(data.departmentId)
          console.log(subjectsData)
          console.log(selectedTypeOfTests)
          const subArray = courseData.subjects.split(",");
          data.forEach((subject) => {
            if (subArray.includes(subject.subjectName)) {
              setSelectedSubjects((prev) => [...prev, subject.subjectId]);
            }
          });
          const arrayOfTypeOfTest = courseData.type_of_test.split(",");
                    typeOfTest.forEach((element) => {
            if (arrayOfTypeOfTest.includes(element.typeOfTestName)) {
              setSelectedtypeOfTest((prev) => [...prev, element.typeOfTestId]);
            } else {
            }
          });

          const typeOfQuestionsArray = courseData.question_types.split(",");
          typeOfQuestionsArray.forEach((ele) => {
            if (typeOfQuestionsArray.includes(ele.typeofQuestion)) {
              setSelectedtypeofQuestion((prev) => [...prev, ele.quesionTypeId]);
              
            } else {
              // console.log(`nope ${ele.typeOfTestName} `);
            }
          });
          typeofQuestion.forEach((ele) => {
            if (typeOfQuestionsArray.includes(ele.typeofQuestion)) {
              setSelectedtypeofQuestion((prev) => [...prev, ele.quesionTypeId]);
              // console.log(
              //   `${ele.typeOfTestName} which is included in the ${ele.typeOfTestId}`
              // );
            } else {
              // console.log(`nope ${ele.typeOfTestName} `);
            }
          });
        } else if (portalId === "3") {
          setBase64Image(courseData.cardImage);
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
          setSubjects(
            courseData.subjects !== undefined ? courseData.selectedSubjects : ""
          );
        } else if (portalId === "4") {
          // handlePreFilledDataForm4();
          setCpFormData({
            courseName: courseData.courseName || "",
            courseYear: courseData.courseYear || "",
            examId: courseData.examId || "",
            courseStartDate: courseData.courseStartDate || "",
            courseEndDate: courseData.courseEndDate || "",
            cost: courseData.cost || "",
            discount: courseData.discount || "",
            discountAmount:courseData.cost-totalPrice || "",
            totalPrice: courseData.totalPrice || "",
            paymentlink: courseData.paymentlink || "",
            cardImage: "",
            topicName: courseData.topicName,
          });
          setBase64Image(courseData.cardImage);

          setStartDate(courseData.courseStartDate.toString());
          setEndDate(courseData.courseEndDate.toString());
          setSelectedexams(courseData.examId); //BITSAT OR JEE
          const response = await fetch(
            `${BASE_URL}/CoureseCreation/courese-exam-subjects/${courseData.examId}/pgSubjects`
          );
          const data = await response.json(); // GETTING CORRECTLY
          setSubjectsData(data);
          Object.values(data).forEach((value) => {
            if (courseData.subjects.includes(value.subjectName)) {
              
              setSelectedSubject([value.subjectId]);
            } else {
           
            }
          });
        } else {
         
        }
      } catch (error) {
      }
    };

    fetchData();
  }, [portalId, typeOfTest, typeofQuestion, courseCreationId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
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

      window.location.href = "/PGCourseAdmin";
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    }
  };
  // ==========form1 functions==================
  const handleSubmitots = async (e) => {
    e.preventDefault();
    otsresetFormFields();
    if (!portalId) {
      console.error("Portale_Id is missing");
      return;
    }
    const formDataObj = new FormData();
    formDataObj.append("paymentlink", otsformData.paymentlink);
    formDataObj.append("courseName", otsformData.courseName);
    formDataObj.append("courseYear", otsformData.courseYear);
    formDataObj.append("examId", selectedexams);
    formDataObj.append("courseStartDate", startDate);
    formDataObj.append("courseEndDate", endDate);
    formDataObj.append("cost", otsformData.cost);
    formDataObj.append("discount", otsformData.discount);
    formDataObj.append("totalPrice", otsformData.totalPrice);
    formDataObj.append("cardImage", courseImage); // Append image file
    formDataObj.append("typeOfTest", JSON.stringify(selectedtypeOfTest));
    formDataObj.append("subjects", JSON.stringify(selectedSubjects));
    formDataObj.append(
      "typeofQuestion",
      JSON.stringify(selectedtypeofQuestion)
    );
    try {
      const response = await axios.put(
        `${BASE_URL}/CoureseCreation/update-course-form1/${courseCreationId}/${portalId}`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = await response.data.success;
      if (response.data.success) {
        window.location.href = "/PGCourseAdmin";
      }
      const uniqueSelectedSubjects = new Set(selectedSubjects);
      const uniqueSelectedSubjectsArray = Array.from(uniqueSelectedSubjects);
      const uniqueSelectedTypeOfQuestion = new Set(selectedtypeofQuestion);
      const uniqueSelectedTypeOfQuestionArray = Array.from(
        uniqueSelectedTypeOfQuestion
      );
      const uniqueSelectedTypeOfTest = new Set(selectedtypeOfTest);
      const uniqueSelectedTypeOfTestArray = Array.from(
        uniqueSelectedTypeOfTest
      );

      if (result === true) {
        const subjectUpdating = await fetch(
          `${BASE_URL}/CoureseCreation/course_type_of_questionUpdation/${courseCreationId} `,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subjectIds: uniqueSelectedSubjectsArray,
              typeofQuestion: uniqueSelectedTypeOfQuestionArray,
              typeOfTestIds: uniqueSelectedTypeOfTestArray,
            }),
          }
        );
      }
    } catch (error) {
      console.error("Error submitting course data:", error);
    }
     };

  const [otsformData, setOtsFormData] = useState({
    courseName: "",
    courseYear: "",
    examId: "",
    typeOfTests:"",
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

  const handletypeoftest = (e, typeOfTestId) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedtypeOfTest((prev) => [...prev, typeOfTestId]);
    } else {
      setSelectedtypeOfTest((prev) => prev.filter(id => id !== typeOfTestId));
    }
  };
  
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

  const handleexams = async (event) => {
    const selectedExamId = event.target.value;
    setSelectedexams(selectedExamId);
    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/courese-exam-subjects/${selectedExamId}/pgSubjects`
      );
      const data = await response.json();
      setSubjectsData(data); // Update subjectsData state
      setSelectedSubjects([]); // Reset selected subjects
    } catch (error) {
    }

    setSelectedexams(selectedExamId);
  };

  const handleSubjectChange = (event, subjectId) => {
    const { checked } = event.target;

    setSelectedSubjects((prevSelectedSubjects) => {
      if (checked) {
        return [...new Set([...prevSelectedSubjects, subjectId])];
      } else {
        return prevSelectedSubjects.filter((id) => id !== subjectId);
      }
    });
  };
  

  const handleQuestionChange = (event, questionTypeId) => {
    const { checked } = event.target;
  
    setSelectedtypeofQuestion((prevSelectedQuestions) => {
      const updatedSelectedQuestions = checked
        ? [...prevSelectedQuestions, questionTypeId]
        : prevSelectedQuestions.filter((id) => id !== questionTypeId);
      return updatedSelectedQuestions;
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


  
  // ============================================
  







  // ============form2=============================

  const handleSubmitpqb = async (e) => {
    e.preventDefault();
    pqbresetFormFields();
    const formDataObj = new FormData();
    formDataObj.append("paymentlink", pqbformData.paymentlink);
    formDataObj.append("courseName", pqbformData.courseName);
    formDataObj.append("courseYear", pqbformData.courseYear);
    formDataObj.append("examId", selectedexams);
    formDataObj.append("courseStartDate", startDate);
    formDataObj.append("courseEndDate", endDate);
    formDataObj.append("cost", pqbformData.cost);
    formDataObj.append("discount", pqbformData.discount);
    formDataObj.append("totalPrice", pqbformData.totalPrice);
    formDataObj.append("Portale_Id", portaleId);
    formDataObj.append("cardImage", courseImage); // Append image file
    const uniqueSelectedTypeOfTest = new Set(selectedtypeOfTest);
    const uniqueSelectedTypeOfTestArray = Array.from(uniqueSelectedTypeOfTest);
    formDataObj.append(
      "typeOfTest",
      JSON.stringify(uniqueSelectedTypeOfTestArray)
    );
    const uniqueSelectedSubjects = new Set(selectedSubjects);
    const uniqueSelectedSubjectsArray = Array.from(uniqueSelectedSubjects);
    // ===================================
    formDataObj.append("subjects", JSON.stringify(uniqueSelectedSubjectsArray));
    const uniqueSelectedtypeofQuestion = new Set(selectedtypeofQuestion);
    const uniqueSelectedtypeofQuestionArray = Array.from(
      uniqueSelectedtypeofQuestion
    );
   
    formDataObj.append(
      "typeofQuestion",
      JSON.stringify(uniqueSelectedtypeofQuestionArray)
    );
    try {
      const response = await axios.put(
        `${BASE_URL}/CoureseCreation/update-course-form1/${courseCreationId}/${portalId}`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = await response.data.success;
      if (response.data.success) {
      }
      if (result === true) {
        const subjectUpdating = await fetch(
          `${BASE_URL}/CoureseCreation/course_type_of_questionUpdation/${courseCreationId}
            `,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subjectIds: uniqueSelectedSubjectsArray,
              typeofQuestion: uniqueSelectedtypeofQuestionArray,
              typeOfTestIds: uniqueSelectedTypeOfTestArray,
            }),
          }
        );
        
      }
     
      if (response.data.success) {
        
        window.location.href = "/PGCourseAdmin"; // Redirect to "/UgadminHome"
      }
    } catch (error) {
      console.error("Error submitting course data:", error);
    }
  };
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

  // ===============================================
  // =================== for form4 ====================================
  const [selectedSubject, setSelectedSubject] = useState([]);

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
    topicName: "",
  });
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
    formData.append("examId", selectedexams); //veena
    formData.append("courseStartDate", cpformData.courseStartDate);
    formData.append("courseEndDate", cpformData.courseEndDate);
    formData.append("cost", cpformData.cost);
    formData.append("discount", cpformData.discount);
    formData.append("totalPrice", cpformData.totalPrice);
    formData.append("paymentlink", cpformData.paymentlink);
    formData.append("cardImage", courseImage); // Binary image data
    // formData.append("Portale_Id", portaleId);

    // Append a single subject ID or all selected subject IDs
    formData.append("subjects", JSON.stringify(selectedSubject)); // Convert to JSON

    if (cpformData.topicName) {
      formData.append("topicName", cpformData.topicName);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/CoureseCreation/complete_course_updation/${courseCreationId}/${portalId}`,

        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        // console.log("Course created successfully:", result);
        fetchCourseData(); // Fetch updated data or redirect, as needed
        cpresetFormFields(); // Reset the form fields
        // window.history.go(-1);
        // window.location.href = '/UgadminHome';
        // asdf
      } else {
        console.error("Failed to update the  course:", await response.text());
      }
    } catch (error) {
      console.error("Error submitting course data:", error);
    }
  };
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
  const handleCloseForm = () => {
    setActiveForm(null); // Reset active form
    setShowPortalButtons(true);
  };

  const handleSubjectChangecp = (event, subjectId) => {
    const { checked } = event.target;

    setSelectedSubject((prevSelectedSubjects) => {
      if (checked) {
      } else {
        // Remove the subjectId from the array
        return prevSelectedSubjects.filter((id) => id !== subjectId);
      }
    });
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
    } else if (name === "topic") {
      setCpFormData({ ...cpformData, [name]: value, topicName: value }); // Include topicName in the state update
    } else {
      setCpFormData({ ...cpformData, [name]: value });
    }
  };

  // =====================================================

  //   asdf
  useEffect(() => {
    handleCalculateTotal();
  }, [cost, discount]);

  return (
    <div className="examUpdate_-container pgExamUpdateContainer">
      {portalId === "1" && (
        <form className="pgFormExamUpdates" onSubmit={handleSubmitots}>
          <h3 className="textColor">PG ONLINE TEST SERIES COURSE CREATION FORM</h3>

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
              <label htmlFor={`typeofTest-${typeofTest.typeOfTestId}`}>
                {typeofTest.typeOfTestName}
              </label>
              <input
                className="inputLable"
                type="checkbox"
                id={`typeofTest-${typeofTest.typeOfTestId}`}
                name={`typeofTest-${typeofTest.typeOfTestId}`}
                value={typeofTest.typeOfTestId}
                checked={selectedtypeOfTest.includes(typeofTest.typeOfTestId)}
                onChange={(e) => handletypeoftest(e, typeofTest.typeOfTestId)}
              />
            </div>
          ))}
        </div>
      </div>
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
            </div>

            <div className="testCreation_-list">
              <label>Select Subjects:</label>
              <div className="coures_-Subjects">
                {subjectsData.map((subject) => (
                  <div
                    className="course_frominput_container "
                    id="course_frominput_container_media"
                    key={subject.departmentId}
                  >
                    <label htmlFor={`subject-${subject.departmentId}`}>
                      {subject.departmentName}
                    </label>
                     <input
                      className="inputLable"
                      type="checkbox"
                      id={`subject-${subject.departmentId}`}
                      name={`subject-${subject.departmentId}`}
                      value={subject.departmentId}
                      checked={selectedSubjects.includes(subject.departmentId)}
                      onChange={(e) =>
                        handleSubjectChange(e, subject.departmentId)
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
              <label htmlFor="">Previously selected Image</label>
              <div className="image-container">
                <img
                  src={base64Image}
                  height={50}
                  alt="no imagein the course creation "
                />
              </div>
              <label>Upload Course Image:</label>
              <input
                type="file"
                accept="image/*"
                name="cardImage"
                // required
                onChange={handleCourseImageChange}
              />
            </div>
          </div>
          <div>
            <button className="ots_-createBtn" type="submit">
              Submit
            </button>
            <button
              type="button"
              onClick={
                // () => navigate("/PGCourseAdmin")
                handleCloseAndNavigate
            }
              className="ots_btnClose"
            >
              Close
            </button>
          </div>
        </form>
        // <h3>hi</h3>
      )}

      {portalId === "2" && (
        <form onSubmit={handleSubmitpqb}>
          <h3 className="textColor">
           PG PRACTICES QUESTION BANK COURSE CREATION FORM
          </h3>
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
              <label htmlFor="">Previously selected Image</label>
              <div className="image-container">
                <img
                  src={base64Image}
                  height={50}
                  alt="no imagein the course creation "
                />
              </div>
              <label>Upload Course Image:</label>
              <input
                type="file"
                accept="image/*"
                name="cardImage"
                // required
                onChange={handleCourseImageChange}
              />
            </div>
          </div>
          <div>
            <button className="ots_-createBtn" type="submit">
              Submit
            </button>
            <button
              type="button"
              onClick={
                // () => navigate("/PGCourseAdmin")
                handleCloseAndNavigate
            }
              className="ots_btnClose"
            >
              Close
            </button>
          </div>
        </form>
      )}
      {portalId === "3" && (
        <form onSubmit={handleSubmit}>
          <h3 className="textColor">PG Course Update</h3>
          <div className="courseupdate_frominput_container examSubjects_-contant"></div>
          <div className="courseupdate_frominput_container">
            <label> Course Name:</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>

          {/* <div className="courseupdate_frominput_container examSubjects_-contant"> */}
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
          {/* </div> */}
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
          {/* </div> */}
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
            <label htmlFor="">Previously selected Image</label>
            <div className="image-container">
              <img
                src={base64Image}
                height={50}
                alt="no imagein the course creation "
              />
            </div>
            <label>Upload Course Image:</label>
            <input
              type="file"
              accept="image/*"
              name="cardImage"
              // required
              onChange={handleCourseImageChange}
            />
          </div>
          {/* <img src={courseImage} alt="" /> */}
          <div>
            <button className="ots_-createBtn" type="submit">
              Submit
            </button>
            <button
              type="button"
              onClick={
                // () => navigate("/PGCourseAdmin")
                handleCloseAndNavigate
            }
              className="ots_btnClose"
            >
              Close
            </button>
          </div>
        </form>
      )}
      {portalId === "4" && (
        <div className="ONLINE_TEST_SERIES_COURSE_CREATION_FORM">
          <form onSubmit={handleSubmitCP} className="ots_-Form">
            <h3 className="textColor">PG COMPLETE PACKAGE COURSE CREATION FORM</h3>

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
                  <label htmlFor="">Previously selected Image</label>
                  <div className="image-container">
                    <img
                      src={base64Image}
                      height={50}
                      alt="no imagein the course creation "
                    />
                  </div>
                </div>
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
            <div>
              <button className="ots_-createBtn" type="submit" >
                Submit
              </button>
              <button
                type="button"
                onClick={
                    // () => navigate("/PGCourseAdmin")
                    handleCloseAndNavigate
                }
                className="ots_btnClose"
           
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PGAdminCourseUpdate;
