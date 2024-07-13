import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
// import { nav } from "../Exam_Portal_QuizApp/Data/Data";
import { Link, Navigate, useParams } from "react-router-dom";
import "./Style/StudentDashbord.css";

import "./Style/StudentDashbordmyresult.css";
import { TbArrowBarToUp } from "react-icons/tb";
import axios from "axios";
import Chart from "chart.js/auto";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import TrophyImage from "./Images/TrophyImage.png";
import { IoMdClose } from "react-icons/io";
import BASE_URL from "../../../apiConfig";

export const UserReport = ({decryptedUserIdState}) => {
  const [isVisible, setVisible] = useState(false);

  const handleScrole = () => {
    const scrollY = window.scrollY;
    const showThreshold = 200;

    setVisible(scrollY > showThreshold);
  };

  const ScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScrole);

    return () => {
      window.removeEventListener("scroll", handleScrole);
    };
  }, []);

  const { testCreationTableId, courseCreationId, questionId } = useParams();
  const [selectedContent, setSelectedContent] = useState(() => {
    const content = localStorage.getItem("selectedContent");
    return content ? JSON.parse(content) : "performance";
  });

  const [selectedButtonName, setSelectedButtonName] = useState(() => {
    const buttonName = localStorage.getItem("selectedButtonName");
    return buttonName ? buttonName : "Your Performance";
  });

  const [QuestionDataResult, setQuestionDataResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  // useEffect(() => {
  //   const checkLoggedIn = () => {
  //     const loggedIn = localStorage.getItem("isLoggedIn");
  //     if (loggedIn === "true") {
  //       setIsLoggedIn(true);
  //       fetchUserData();
  //     }
  //   };
  //   checkLoggedIn();
  // }, []);

  // const fetchUserData = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`${BASE_URL}/ughomepage_banner_login/user`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       // Token is expired or invalid, redirect to login page
  //       localStorage.removeItem("isLoggedIn");
  //       localStorage.removeItem("token");
  //       setIsLoggedIn(false);
  //       Navigate("/uglogin"); // Assuming you have the 'navigate' function available

  //       return;
  //     }

  //     if (response.ok) {
  //       // Token is valid, continue processing user data
  //       const userData = await response.json();
  //       setUserData(userData);
  //       // ... process userData
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  const user_Id = decryptedUserIdState;
  // useEffect(() => {
  //   const fetchTestDetails = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/TestPage/feachingAttempted_TestDetails/${user_Id}`
  //       );
  //       setTestDetails(response.data);
  //     } catch (error) {
  //       console.error("Error fetching test details:", error);
  //     }
  //   };

  //   fetchTestDetails();
  // }, [user_Id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/questionOptions_result/${testCreationTableId}/${decryptedUserIdState}`
        );

        // if (!response.ok) {
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        const data = await response.json();
        setQuestionDataResult(data.questions);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };
    fetchData();
  }, [decryptedUserIdState]);

  // const [questionDataResult, setQuestionDataResult] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState({});

  // Group questions by sectionId
  useEffect(() => {
    const grouped = QuestionDataResult.reduce((acc, question) => {
      if (!acc[question.sectionId]) {
        acc[question.sectionId] = [];
      }
      acc[question.sectionId].push(question);
      return acc;
    }, {});
    setGroupedQuestions(grouped);

    // Set the default selected section to the first sectionId
    const firstSectionId = Object.keys(grouped)[0];
    setSelectedSection(firstSectionId);
  }, [QuestionDataResult]);

  const handleSectionChange = (e) => {
    const sectionId = parseInt(e.target.value);
    setSelectedSection(sectionId);
  };

  // console.log("solution", decryptedUserIdState);
  // console.log(
  //   "solutionygfuyhyiuygtyhvbnhkiiknjhfytgvhuyfghvyguhbigkhb",
  //   courseCreationId
  // );

  // console.log({testCreationTableId})
  const handleShowAnswer = (question) => {
    if (selectedQuestion === question && showAnswer === true) {
      setShowAnswer(false); // Toggle to close the answer
    } else {
      setSelectedQuestion(question);
      setShowAnswer(true); // Toggle to show the answer
    }
  };
  // window.location.reload();

  const handleButtonClick = (content, buttonName) => {
    setSelectedContent(content);
    setSelectedButtonName(buttonName);
    if (buttonName === "Your Performance") {
      localStorage.setItem("selectedContent", JSON.stringify(content));
      localStorage.setItem("selectedButtonName", buttonName);
      window.location.reload(); // Reload the component
    }
    if (buttonName === "Solutions") {
      localStorage.setItem("selectedContent", JSON.stringify(content));
      localStorage.setItem("selectedButtonName", buttonName);
      //  window.location.reload(); // Reload the component
    }
  };

  const [testData, setTestData] = useState([]);
  const [Duration, setDuration] = useState([]);
  // console.log("Duration", Duration);
  const durationValue = testData.Duration;

  // console.log(durationValue);
  // console.log(testData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Myresult/YourPerformance_testResults/${decryptedUserIdState}/${testCreationTableId}`
        );
        setTestData(response.data);
        const Duration = response.data[0].Duration;
        const time_left = response.data[0].progress_percentage;
        const total_unattempted = response.data[0].total_unattempted;
        const totalMarks = response.data[0].totalMarks;

        const section_count = response.data[0].section_count;
        const Total_answered = response.data[0].Total_answered;
        const Total_correct = response.data[0].Total_correct;

        const TestName = response.data[0].TestName;
        setDuration({
          Duration,
          time_left,
          total_unattempted,
          totalMarks,
          Total_answered,
          section_count,
          TestName,
          Total_correct,
        });

        console.log("Duration:", response.data[0].Duration);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };
    fetchData();
  }, [decryptedUserIdState]);

  const chartRef = useRef(null);
  const [answerEvaluation, setAnswerEvaluation] = useState([]);

  // console.log(
  //   `'object object',  ${answerEvaluation.totalWrong},  ${answerEvaluation.totalCorrect},  ${answerEvaluation.totalUnattempted}`
  // );
  useEffect(() => {
    const fetchBuildChart = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/AnswerEvaluation/${decryptedUserIdState}/${testCreationTableId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setAnswerEvaluation(result);
      } catch (error) {
        console.error("Error fetching AnswerEvaluation:", error);
      }
    };

    fetchBuildChart();
  }, [decryptedUserIdState, testCreationTableId]);

  //main
  // useEffect(() => {
  //   const buildChart = () => {
  //     // if (answerEvaluation.length === 0) {
  //     //   console.error("Invalid or empty answerEvaluation data");
  //     //   return;
  //     // }

  //     const myChartRef = chartRef.current.getContext("2d");

  //     if (!myChartRef) {
  //       console.error("getContext returned null");
  //       return;
  //     }

  //     // Destroy the previous chart instance if it exists
  //     if (myChartRef.chart) {
  //       myChartRef.chart.destroy();
  //     }

  //     myChartRef.chart = new Chart(myChartRef, {
  //       type: "pie",
  //       data: {
  //         labels: [
  //           `Total Wrong  ${answerEvaluation.totalWrong}`,
  //           `Total Correct ${answerEvaluation.totalCorrect}`,
  //           `Total Unattempted  ${answerEvaluation.totalUnattempted}`,
  //         ],
  //         datasets: [
  //           {
  //             data: [
  //               answerEvaluation.totalWrong,
  //               answerEvaluation.totalCorrect,
  //               answerEvaluation.totalUnattempted,
  //             ],
  //             backgroundColor: [
  //               "rgb(230, 65, 65)",
  //               "rgb(26, 194, 90)",
  //               "#f0f0f0",
  //             ],
  //             borderWidth: 1,
  //           },
  //         ],
  //       },
  //       options: {
  //         responsive: true,
  //         maintainAspectRatio: false,

  //         plugins: {
  //           legend: {
  //             position: "bottom",
  //             labels: {
  //               font: {
  //                 size: 16,
  //               },
  //               color: "black",
  //             },
  //           },
  //           tooltip: {
  //             callbacks: {
  //               label: (context) => {
  //                 const label = context.label || "";
  //                 const value = context.parsed || 0;
  //                 return `${label}: ${value}`;
  //               },
  //             },
  //           },
  //           scales: {
  //             x: { grid: { display: false } },
  //             y: { grid: { display: false } },
  //             z: {
  //               beginAtZero: true,
  //               maxTicksLimit: 5,
  //               grid: { color: "rgba(0, 0, 0, 0.2)" },
  //             },
  //           },
  //         },
  //         legend: { display: false },
  //       },
  //     });
  //   };

  //   if (chartRef.current) {
  //     buildChart();
  //   }
  // }, [answerEvaluation, chartRef]);

  useEffect(() => {
    const buildChart = () => {
      const myChartRef = chartRef.current.getContext("2d");

      if (!myChartRef) {
        console.error("getContext returned null");
        return;
      }

      // Destroy the previous chart instance if it exists
      if (myChartRef.chart) {
        myChartRef.chart.destroy();
      }

      // Default values if answerEvaluation is not defined
      const totalWrong = answerEvaluation?.totalWrong || 0;
      const totalCorrect = answerEvaluation?.totalCorrect || 0;
      const totalUnattempted = answerEvaluation?.totalUnattempted || 0;

      myChartRef.chart = new Chart(myChartRef, {
        type: "pie",
        data: {
          labels: [
            `Total Wrong  ${totalWrong}`,
            `Total Correct ${totalCorrect}`,
            `Total Unattempted  ${totalUnattempted}`,
          ],
          datasets: [
            {
              data: [totalWrong, totalCorrect, totalUnattempted],
              backgroundColor: [
                "rgb(230, 65, 65)",
                "rgb(26, 194, 90)",
                "#f0f0f0",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  size: 16,
                },
                color: "black",
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const value = context.parsed || 0;
                  return `${label}: ${value}`;
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { display: false } },
              z: {
                beginAtZero: true,
                maxTicksLimit: 5,
                grid: { color: "rgba(0, 0, 0, 0.2)" },
              },
            },
          },
          legend: { display: false },
        },
      });
    };

    if (chartRef.current) {
      buildChart();
    }
  }, [answerEvaluation, chartRef]);

  //  tme progress

  // const TtestTime = testData[0].Duration
  const totalTestTime = Duration.Duration * Duration.Duration; // 40 minutes
  const completedTestTime = Duration.time_left * Duration.Duration; // 13 minutes

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentageCompleted = (completedTestTime / totalTestTime) * 100;
    setProgress(percentageCompleted);

    // Clear the interval when component unmounts
    return () => {};
  }, [totalTestTime, completedTestTime]);

  // its for Percentage ----------------------------------------------------
  // const totalMarks = Duration.totalMarks; // Total marks
  // const marksObtained = Duration.Total_correct; // Marks obtained

  // // Calculate percentage
  // const percentage = ((marksObtained / totalMarks) * 100).toFixed(2);
  // end -------------------------------------------------------------------------------------------------
  //key----------------------

  const [keydata, setKeyData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/Myresult/userResponses/${decryptedUserIdState}/${testCreationTableId}`
      )
      .then((response) => {
        setKeyData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [decryptedUserIdState]);

  const [score, setScoreCount] = useState({ totalMarks: 0, netMarks: 0 });

  // useEffect(() => {
  //   const fetchQuestionCount = async () => {
  //     try {
  //       const response = await fetch(
  //         // `${BASE_URL}/QuestionPaper/score/${testCreationTableId}/${decryptedUserIdState}`
  //         `${BASE_URL}/Myresult/kevin/score/${decryptedUserIdState}/${testCreationTableId}`
  //       );
  //       const data = await response.json();
  //       setScoreCount(data);
  //       console.log(setScoreCount, data);
  //     } catch (error) {
  //       console.error("Error fetching question count:", error);
  //     }
  //   };

  //   fetchQuestionCount();
  // }, [decryptedUserIdState, testCreationTableId]);

  // Function to group sections by subject ID and combine scores of sections A and B
  const groupSectionsBySubjectId = () => {
    if (!score || !score.subjects) return [];

    const subjectScores = {}; // Object to store aggregated scores for each subject

    score.subjects.forEach((subject) => {
      if (!subjectScores[subject.subjectId]) {
        subjectScores[subject.subjectId] = {
          subjectId: subject.subjectId,
          subjectName: subject.subjectName,
          totalMarks: 0,
          netMarks: 0,
          correctAnswersCount: 0,
          sections: {}, // Object to store scores for each section
        };
      }

      subject.sections.forEach((section) => {
        // Accumulate scores for sections A and B
        subjectScores[subject.subjectId].totalMarks += parseFloat(
          section.scores.totalMarks
        );
        subjectScores[subject.subjectId].netMarks += parseFloat(
          section.scores.netMarks
        );
        subjectScores[subject.subjectId].correctAnswersCount += parseFloat(
          section.scores.correctAnswersCount
        );

        // Store section-wise scores within the subject object
        if (!subjectScores[subject.subjectId].sections[section.sectionName]) {
          subjectScores[subject.subjectId].sections[section.sectionName] = {
            totalMarks: 0,
            netMarks: 0,
          };
        }

        subjectScores[subject.subjectId].sections[
          section.sectionName
        ].totalMarks += parseFloat(section.scores.totalMarks);
        subjectScores[subject.subjectId].sections[
          section.sectionName
        ].netMarks += parseFloat(section.scores.netMarks);
      });
    });

    // Convert subjectScores object into an array of subject scores
    return Object.values(subjectScores);
  };

  const [sectionWiseScores, setSectionWiseScores] = useState([]);
  const [sectionWiseTotalMarks, setSectionWiseTotalMarks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/sectionwiseScoreAndTotalMarks/${decryptedUserIdState}/${testCreationTableId}`
        );
        const data = await response.json();
        setSectionWiseScores(data.sectionWiseScores);
        setSectionWiseTotalMarks(data.sectionWiseTotalMarks);
      } catch (error) {
        console.error("Error fetching section-wise scores:", error);
      }
    };

    fetchData();
  }, [decryptedUserIdState]);

  const [rankData, setRankData] = useState([]);
  useEffect(() => {
    const fetchRankData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/toprank/${testCreationTableId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setRankData(result);
      } catch (error) {
        console.error("Error fetching rank data:", error);
      }
    };

    fetchRankData();
  }, []);

  const [userrank, setUserRank] = useState([]);

  useEffect(() => {
    const fetchiUserRankData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/rankforeachuser/${decryptedUserIdState}/${testCreationTableId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        // console.log("API Response:", result); // Log the response
        setUserRank(result);
      } catch (error) {
        console.error("Error fetching rank data:", error);
      }
    };

    fetchiUserRankData();
  }, [decryptedUserIdState]);

  const [topThreeRanks, setTopThreeRanks] = useState([]);

  useEffect(() => {
    const fetchTopThreeRanks = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/topthreeranks/${testCreationTableId}`
        ); // Replace '17' with the actual testCreationTableId

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setTopThreeRanks(result.topThreeRanks);
      } catch (error) {
        console.error("Error fetching top three ranks:", error);
      }
    };

    fetchTopThreeRanks();
  }, []);

  const [userMarks, setUserMarks] = useState([]);
  const [totalDifference, setTotalDifference] = useState(null);
  const [percentage, setPercentage] = useState(null);
  useEffect(() => {
    const fetchUserMarks = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/usermarks/${decryptedUserIdState}/${testCreationTableId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setUserMarks(result.usermarks);
        setTotalDifference(result.totalDifference);
        setPercentage(result.percentage);
      } catch (error) {
        console.error("Error fetching user marks:", error);
      }
    };

    fetchUserMarks();
  }, [decryptedUserIdState]);

  const [usercount, setUserCount] = useState([]);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/usercountforeachtest/${testCreationTableId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        // console.log("User Count Result:", result);
        setUserCount(result.usercount);
      } catch (error) {
        console.error("Error fetching user marks:", error);
      }
    };

    fetchUserCount();
  }, []);

  const [userTest, setUserTest] = useState([]);

  const fetchUserTest = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Myresult/testdataformyresultpage/${courseCreationId}/${testCreationTableId}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      // console.log("User Test Result:", result);

      // Check if the 'testdataformyresultpage' key exists in the result object
      if ("testdataformyresultpage" in result) {
        setUserTest(result.testdataformyresultpage);
      } else {
        console.error(
          "Error: 'testdataformyresultpage' key not found in the response."
        );
      }
    } catch (error) {
      console.error("Error fetching user marks:", error);
    }
  };
  useEffect(() => {
    fetchUserTest();
  }, [courseCreationId, testCreationTableId]);

  // console.log("test and course ids ", courseCreationId, testCreationTableId);

  // console.log("USER TEST", userTest);

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);

  const handleBookmark = (question) => {
    // Check if the question is already bookmarked
    const isBookmarked = bookmarkedQuestions.some(
      (bookmark) =>
        bookmark.question_id === question.question_id &&
        bookmark.testCreationTableId === question.testCreationTableId &&
        bookmark.user_Id === question.user_Id
    );

    // Toggle bookmark status
    const updatedBookmarks = isBookmarked
      ? bookmarkedQuestions.filter(
          (bookmark) =>
            bookmark.question_id !== question.question_id ||
            bookmark.testCreationTableId !== question.testCreationTableId ||
            bookmark.user_Id !== question.user_Id
        )
      : [
          ...bookmarkedQuestions,
          {
            question_id: question.question_id,
            testCreationTableId: question.testCreationTableId,
            user_Id: question.user_Id,
          },
        ];

    // Update state with the new bookmarks
    setBookmarkedQuestions(updatedBookmarks);

    // Make an API call to save the bookmark
    saveBookmarkToDatabase(question, isBookmarked);
  };

  const saveBookmarkToDatabase = (question, isBookmarked) => {
    // Make an API call to save the bookmark status to the database
    // Use fetch, axios, or your preferred method here
    const apiUrl = `${BASE_URL}/Bookmark/saveBookmark`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_id: question.question_id,
        testCreationTableId: testCreationTableId,
        user_Id: user_Id,
        isBookmarked: !isBookmarked, // Invert the bookmark status
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response if needed
        // console.log("Bookmark saved successfully:", data);
      })
      .catch((error) => {
        console.error("Error saving bookmark:", error);
      });
  };

  const isQuestionBookmarked = (question) => {
    return bookmarkedQuestions.some(
      (bookmark) =>
        bookmark.question_id === question.question_id &&
        bookmark.user_Id === question.user_Id
    );
  };

  useEffect(() => {
    fetchInitialBookmarks();
  }, [decryptedUserIdState]);

  const fetchInitialBookmarks = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Bookmark/getBookmarks/${decryptedUserIdState}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setBookmarkedQuestions(result);
    } catch (error) {
      console.error("Error fetching initial bookmarks:", error);
    }
  };

  // // Section Wise Result View
  // // const chartRef = useRef(null);
  const chartInstances = useRef([]);
  const charts = useRef({});
  const chartInstance = useRef(null);
  const [formattedData, setFormattedData] = useState([]);
  const chartRef2 = useRef(null);
  const chartInstance2 = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Myresult/sectionwiseScore/${decryptedUserIdState}/${testCreationTableId}`
        );
        const data = await response.json();

        setFormattedData(data);
      } catch (error) {
        console.error("Error fetching section-wise scores:", error);
      }
    };

    fetchData();
  }, [decryptedUserIdState]);

  // Section Wise Result View barChartsContainer  --------------------------------------------------------------------------------------------------------

  // useEffect(() => {
  //   if (formattedData && formattedData.sectionWiseScores) {
  //     // Clear previous charts before appending new ones
  //     const container = document.getElementById("barChartsContainer");
  //     container.innerHTML = "";

  //     // Group data by sectionName and subjectName
  //     const groupedData = {};
  //     formattedData.sectionWiseScores.forEach((score) => {
  //       const key = `${score.sectionName}-${score.subjectName}`;
  //       if (!groupedData[key]) {
  //         groupedData[key] = [];
  //       }
  //       groupedData[key].push(score);
  //     });

  //     // Render bar charts
  //     Object.keys(groupedData).forEach((key) => {
  //       const scores = groupedData[key];
  //       const labels = scores.map(
  //         (score) => `${scores[0].sectionName},${scores[0].subjectName}`
  //       );
  //       const wrongAnswers = scores.map((score) => score.wrong_answers);
  //       const correctAnswers = scores.map((score) => score.correct_answers);
  //       const totalMarks = scores.map((score) => parseFloat(score.total_marks));
  //       const percentages = scores.map((score) => parseFloat(score.percentage));
  //       const sectionName = scores[0].sectionName;
  //       const subjectName = scores[0].subjectName;

  //       // Create a canvas element for the chart
  //       const canvas = document.createElement("canvas");

  //       // Append canvas to the component's container
  //       container.appendChild(canvas);

  //       // Create bar chart
  //       const chartData = {
  //         labels: labels,
  //         datasets: [
  //           {
  //             label: "Wrong Answers",
  //             data: wrongAnswers,
  //             backgroundColor: "rgba(255, 99, 132, 0.5)",
  //             borderColor: "rgba(255, 99, 132, 1)",
  //             borderWidth: 1,
  //           },
  //           {
  //             label: "Correct Answers",
  //             data: correctAnswers,
  //             backgroundColor: "rgba(54, 162, 235, 0.5)",
  //             borderColor: "rgba(54, 162, 235, 1)",
  //             borderWidth: 1,
  //           },
  //           {
  //             label: "Total Marks",
  //             data: totalMarks,
  //             backgroundColor: "rgba(75, 192, 192, 0.5)",
  //             borderColor: "rgba(75, 192, 192, 1)",
  //             borderWidth: 1,
  //           },
  //           {
  //             label: "Percentage",
  //             data: percentages,
  //             backgroundColor: "rgba(255, 206, 86, 0.5)",
  //             borderColor: "rgba(255, 206, 86, 1)",
  //             borderWidth: 1,
  //           },
  //         ],
  //       };

  //       const chartOptions = {
  //         responsive: true,
  //         scales: {
  //           x: {
  //             grid: {
  //               display: true, // Display grid lines for x-axis
  //             },
  //           },
  //           y: {
  //             grid: {
  //               display: true, // Display grid lines for y-axis
  //             },
  //           },
  //         },
  //         plugins: {
  //           legend: {
  //             position: "bottom",
  //             labels: {
  //               font: {
  //                 size: 9,
  //               },
  //               color: "black",
  //             },
  //           },
  //           title: {
  //             display: true,
  //             // text: `${sectionName} - ${subjectName} Scores`,
  //           },
  //         },
  //         animation: {
  //           duration: 1000,
  //           easing: "easeInOutQuart",
  //         },
  //       };

  //       const newChart = new Chart(canvas, {
  //         type: "bar",
  //         data: chartData,
  //         options: chartOptions,
  //       });

  //       chartInstances.current.push(newChart);
  //     });
  //   }
  // }, [formattedData]);

  // end Section Wise Result View barChartsContainer  --------------------------------------------------------------------------------------------------------

  //Doubt Section
  const [isChallengeFormVisible, setChallengeFormVisible] = useState(false);

  const [challengeText, setChallengeText] = useState("");
  const [image, setImage] = useState(null);
  const [challengeQuestionId, setChallengeQuestionId] = useState(null); // Assuming null is an appropriate initial value
  const [isChallengeSubmitted, setIsChallengeSubmitted] = useState(false);
  const handleOpenChallengeForm = (questionId) => {
    setChallengeFormVisible(true);
    setChallengeQuestionId(questionId); // Assuming you have a state for question_id
  };

  const handleCloseChallengeForm = () => {
    setChallengeFormVisible(false);
  };

  // const handleChallengeSubmit = (challengeText) => {
  //   submitChallengeToServer(challengeText, image);
  //   handleCloseChallengeForm();
  //   setIsChallengeSubmitted(true);
  //   window.Location.relaod()
  // };

  // Storing the content in local storage
  // const handleChallengeSubmit = (challengeText) => {
  //   submitChallengeToServer(challengeText, image);
  //   handleCloseChallengeForm();
  //   setIsChallengeSubmitted(true);
  //   // localStorage.setItem('selectedContent', JSON.stringify(content));
  //   window.location.reload();
  // };

  // Retrieving the content from local storage
  // useEffect(() => {
  //   const storedContent = localStorage.getItem('selectedContent');
  //   if (storedContent) {
  //     setSelectedContent(JSON.parse(storedContent));
  //   }
  // }, []);
  const submitChallengeToServer = async () => {
    try {
      // Assuming you have an API endpoint for submitting challenges
      const apiUrl = `${BASE_URL}/DoubtSection/submitChallenge`;

      // const challengeData = {
      //   Doubt_text: challengeText,
      //   user_Id:decryptedUserIdState,
      //   testCreationTableId:testCreationTableId,
      //   question_id: challengeQuestionId,
      //   Doubt_Img:image,
      // };
      const formData = new FormData();
      formData.append("Doubt_text", challengeText);
      formData.append("user_Id", decryptedUserIdState);
      formData.append("testCreationTableId", testCreationTableId);
      formData.append("question_id", challengeQuestionId);
      formData.append("image", image);

      // const response = await fetch(apiUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(challengeData),
      // });
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Challenge submitted successfully");
      } else {
        console.error("Failed to submit challenge");
      }
      setIsChallengeSubmitted(false);
    } catch (error) {
      console.error("Error submitting challenge:", error.message);
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

  const formatDateTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").slice(0, 2);
    return `${hours}:${minutes}`;
  };

  const [challengeData, setChallengeData] = useState(null);

  // console.log("getChallenge");
  // console.log(testCreationTableId);
  // console.log(questionsquestionId)
  if (selectedSection && groupedQuestions[selectedSection]) {
    groupedQuestions[selectedSection].forEach((question) => {
      // console.log(question.question_id);
    });
  }
  // console.log(decryptedUserIdState);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedSection && groupedQuestions[selectedSection]) {
        for (const question of groupedQuestions[selectedSection]) {
          try {
            const response = await axios.get(
              `${BASE_URL}/DoubtSection/getChallenge`,
              {
                params: {
                  user_Id: decryptedUserIdState,
                  testCreationTableId: testCreationTableId,
                  question_id: question.question_id,
                },
              }
            );

            // Check if challenge data is found for the question
            if (response.data.data.length > 0) {
              // Set isChallengeSubmitted flag for the question based on the response
              question.isChallengeSubmitted = true;
            } else {
              question.isChallengeSubmitted = false;
            }

            // console.log(response.data.data);
          } catch (error) {
            console.error("Error fetching challenge data:", error);
          }
        }

        // Trigger re-render after updating isChallengeSubmitted flags
        setChallengeData([...groupedQuestions[selectedSection]]);
      }
    };

    fetchData();
  }, [selectedSection, groupedQuestions, decryptedUserIdState, testCreationTableId]);

  // const [messageBody, setMessageBody] = useState("");
  // const [selectedFile, setSelectedFile] = useState(null);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImage(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  //   const handleChallengeSubmit = (challengeText) => {
  //   submitChallengeToServer(challengeText, image);
  //   handleCloseChallengeForm();
  //   setIsChallengeSubmitted(true);
  //   // localStorage.setItem('selectedContent', JSON.stringify(content));
  //   window.location.reload();
  // };
  const [scrollPosition, setScrollPosition] = useState(0);

  const [messageBody, setMessageBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  ///working
  // const handleChallengeSubmit = async (questionId) => {
  //   const user_Id = decryptedUserIdState;
  //   try {
  //     const response = await fetch(`${BASE_URL}/DoubtSection/submitChallenge`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         messageBody,
  //         testCreationTableId,
  //         user_Id,
  //         questionId,
  //         selectedFile,
  //       }),
  //     });
  //     if (response.ok) {
  //       // console.log("Message submitted successfully");
  //       handleCloseChallengeForm();
  //       setIsChallengeSubmitted(true);
  //       sessionStorage.setItem("scrollPosition", window.scrollY); // Store the scroll position
  //       window.location.reload(); // Reload the page
  //     } else {
  //       console.error("Failed to submit message");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting message:", error);
  //   }
  // };
  //end
  const handleChallengeSubmit = async (questionId) => {
    const user_Id = decryptedUserIdState;
    try {
      console.log("Data being sent to server:", {
        messageBody,
        testCreationTableId,
        user_Id,
        questionId,
        selectedFile,
      });

      const response = await fetch(`${BASE_URL}/DoubtSection/submitChallenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageBody,
          testCreationTableId,
          user_Id,
          questionId,
          selectedFile,
        }),
      });
      if (response.ok) {
        // console.log("Message submitted successfully");
        handleCloseChallengeForm();
        setIsChallengeSubmitted(true);
        sessionStorage.setItem("scrollPosition", window.scrollY); // Store the scroll position
        window.location.reload(); // Reload the page
      } else {
        console.error("Failed to submit message");
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  // Inside the component where you want to restore the scroll position
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
      sessionStorage.removeItem("scrollPosition"); // Remove the stored scroll position
    }
  }, []);

  //   const handleChallengeSubmit = async () => {
  //     try {
  //       const response = await fetch("http://localhost:10000/submit-message", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ messageBody, selectedFile }),
  //       });
  //       if (response.ok) {
  //         console.log("Message submitted successfully");
  //         window.location.reload();
  //       } else {
  //         console.error("Failed to submit message");
  //       }
  //     } catch (error) {
  //       console.error("Error submitting message:", error);
  //     }
  //   };

  // const handleChallengeSubmit = async (questionId) => {
  //   try {
  //     const apiUrl = `${BASE_URL}/DoubtSection/submitChallenge`;

  //     const formData = new FormData();
  //     formData.append("Doubt_text", challengeText);
  //     formData.append("user_Id", decryptedUserIdState);
  //     formData.append("testCreationTableId", testCreationTableId);
  //     formData.append("question_id", questionId);
  //     formData.append("image", image);

  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       body: formData,
  //     });
  // console.log(formData);
  //     if (response.ok) {
  //       console.log("Challenge submitted successfully");
  //       setIsChallengeSubmitted(false);
  //       handleCloseChallengeForm();
  //       window.location.reload();
  //     } else {
  //       console.error("Failed to submit challenge");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting challenge:", error.message);
  //   }
  // };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.target.tagName.toLowerCase() !== "input") {
      event.preventDefault(); // Prevent default keyboard action
      event.stopPropagation(); // Stop event propagation
    }
  };
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!keyboardEnabled) {
        event.preventDefault(); // Prevent default keyboard action
        event.stopPropagation(); // Stop event propagation
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboardEnabled]);

  const handleFocus = () => {
    setKeyboardEnabled(true);
  };

  const handleBlur = (e) => {
    setKeyboardEnabled(false);
    setMessageBody(e.target.innerText);
  };

  // const circleStyle = {
  //   width: '20rem',
  //   height: '20rem',
  //   borderRadius: '100rem',
  //   backgroundColor: '#f0f0f0',
  // };

  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const rotate = () => {
      let degree = 0;
      const interval = setInterval(() => {
        degree += 1;
        setRotation(degree);
        if (degree >= 360) {
          clearInterval(interval);
        }
      }, 5.555); // 360 degrees in 2000ms (2 seconds) -> 2000ms/360 = 5.555ms per degree
    };

    rotate();
  }, []);

  const circleStyle = {
    width: "20rem",
    height: "20rem",
    borderRadius: "100rem",
    background: `conic-gradient(#f0f0f0 ${rotation}deg, #fff 0deg)`,
    transition: "background 0.005s linear", // Smooth transition for the background
  };

  return (
    <div className="resultContainerSection">
      <div className="StudentDashbord_Container">
        <section>
          <div className="StudentDashbord_navLocation">
            <span className="selectedButtonNameLink">{selectedButtonName}</span>{" "}
            <span>
              {" "}
              <div className="Go_back_from_test_section">
                <Link to="/student_dashboard" style={{ color: "black" }}>
                  Go Back
                </Link>
              </div>
            </span>
          </div>
        </section>

        <section className="StudentDashbord_contant">
          <div className="Your_PerformanceHeader">
            {/* {userTest && userTest.map((item) => (
            <div
              key={item.testCreationTableId}
              className="Your_PerformanceHeader_contant"
            >
              <span className="sub_PerformanceHeaderTestName">
                Test Details
              </span>
              <ul className="User_result">
                <li>
                  Test Name:{" "}
                  <b className="sub_PerformanceHeader">{item.TestName}</b>
                </li>
                <li>
                  No.of Sections:{" "}
                  <b className="sub_PerformanceHeader">{item.sectionCount}</b>
                </li>
                <li>
                  Total Marks :{" "}
                  <b className="sub_PerformanceHeader">{item.totalMarks}</b>
                </li>
                <li>
                  Duration:{" "}
                  <b className="sub_PerformanceHeader">{item.Duration}</b>
                </li>
                <li>
                  Start Time :{" "}
                  <b className="sub_PerformanceHeader">
                    {item.testStartDate} {item.formattedStartTime}
                  </b>
                </li>
                <li>
                  End Time :{" "}
                  <b className="sub_PerformanceHeader">
                    {item.testEndDate} {item.formattedEndTime}
                  </b>
                </li>
              </ul>
            </div>
          ))} */}
            {userTest.map((item) => (
              <div
                key={item.testCreationTableId}
                className="Your_PerformanceHeader_contant"
              >
                <span className="sub_PerformanceHeaderTestName">
                  Test Details
                </span>
                <ul className="User_result">
                  <li>
                    Test Name:{" "}
                    <b className="sub_PerformanceHeader">{item.TestName}</b>
                  </li>
                  <li>
                    No. of Sections:{" "}
                    <b className="sub_PerformanceHeader">{item.sectionCount}</b>
                  </li>
                  <li>
                    Total Marks:{" "}
                    <b className="sub_PerformanceHeader">{item.totalMarks}</b>
                  </li>
                  <li>
                    Duration:{" "}
                    <b className="sub_PerformanceHeader">{item.Duration}</b>
                  </li>
                  <li>
                    Start Time:{" "}
                    <b className="sub_PerformanceHeader">
                      {formatDate(item.testStartDate)}{" "}
                      {formatDateTime(item.testStartTime)}
                    </b>
                  </li>
                  <li>
                    End Time:{" "}
                    <b className="sub_PerformanceHeader">
                      {formatDate(item.testEndDate)}{" "}
                      {formatDateTime(item.testEndTime)}
                    </b>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="StudentDashbord_Container">
          <div className="StudentDashbord_navLocation2">
            <button
              className="sub_PerformanceHeader"
              onClick={() =>
                handleButtonClick("performance", "Your Performance")
              }
            >
              Your Performance
            </button>
            <button onClick={() => handleButtonClick("solutions", "Solutions")}>
              Solutions
            </button>
            {/* <button onClick={() => handleButtonClick("key", "Key")}>Key</button> */}
            {/* <button onClick={() => handleButtonClick("rankers", "Top Rankers")}>
              Top Rankers
            </button> */}
          </div>
        </section>

        <section className="StudentDashbord_Container">
          {selectedContent === "performance" && (
            <>
              <div className="StudentDashbord_Container">
                <div className="Result_container">
                  <div className="Result_contant ResultTime_contant">
                    {/* Result --------------------------------------------------------- */}
                    <div>
                      <p className="YourTextDAta sbrPageFOnt">Result</p>
                      {testData.map((item, ind) => (
                        <>
                          <ul className="sd_Result">
                            {userMarks && userMarks.length > 0 ? (
                              <li>
                                <p>
                                  {" "}
                                  Marks: <b>{userMarks[0].sumStatus1}</b>
                                </p>
                                <p>
                                  {" "}
                                  Negative Marks:{" "}
                                  <b>{userMarks[0].sumStatus0}</b>
                                </p>
                                <p>
                                  Obtained Total Marks: <b>{totalDifference}</b>
                                </p>
                              </li>
                            ) : (
                              // <p>No data available.</p>
                              <li>
                                <p> Marks: 0</p>
                                <p>
                                  {" "}
                                  Negative Marks: <b>0</b>
                                </p>
                                <p>
                                  Obtained Total Marks: <b>0</b>
                                </p>
                              </li>
                            )}

                            <li>
                              {userrank && userrank.topRank ? (
                                <div>
                                  <p className="sbrPageFOnt">
                                    {" "}
                                    AIR: <b>{userrank.topRank.rank}</b>
                                  </p>
                                  {/* Render other data as needed */}
                                </div>
                              ) : (
                                // <p>No data available.</p>
                                <div>
                                  <p className="sbrPageFOnt">
                                    {" "}
                                    AIR: <b>0</b>
                                  </p>
                                  {/* Render other data as needed */}
                                </div>
                              )}

                              {usercount && usercount.length > 0 ? (
                                <div>
                                  <p className="sbrPageFOnt">
                                    Total Attempted students (till now):{" "}
                                    <b>{usercount[0].usercount}</b>
                                  </p>
                                </div>
                              ) : (
                                // <p>No data available.</p>
                                <div>
                                  <p className="sbrPageFOnt">
                                    Total Attempted students (till now):{" "}
                                    <b>0</b>
                                  </p>
                                </div>
                              )}
                            </li>
                          </ul>
                        </>
                      ))}
                    </div>
                    {/*  end Result --------------------------------------------------------- */}
                  </div>
                  <div className="Time_containt ResultTime_contant">
                    {/* Time Progress --------------------------------------------------------- */}
                    <p>
                      <p className="YourTextDAta sbrPageFOnt">Time Progress</p>

                      <div>
                        {testData.map((item, ind) => (
                          <div className="Time_ProgressConatainer">
                            <div>
                              <p className="sbrPageFOnt">
                                <b>{item.Duration}</b> minutes
                              </p>
                              <p
                                style={{
                                  display: "flex",
                                  gap: "1rem",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {" "}
                                <span
                                  style={{
                                    width: "18px",
                                    height: "15px",
                                    background: "#6666e6",
                                    display: "block",
                                  }}
                                ></span>
                                <small>Test Duration</small>
                              </p>
                            </div>

                            <div>
                              <p className="sbrPageFOnt">
                                <b> {item.time_left_formatted}</b>
                              </p>
                              <p
                                style={{
                                  display: "flex",
                                  gap: "1rem",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {" "}
                                <span
                                  style={{
                                    width: "18px",
                                    height: "15px",
                                    background: "rgb(230 102 102)",
                                    display: "block",
                                  }}
                                ></span>{" "}
                                <small>Your Time</small>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          backgroundColor: "#ccc",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: "20px",
                            backgroundColor: "rgba(255, 0, 0, 0.5)", // Red color with 50% opacity
                            transition: "width 1s",
                          }}
                        />
                        <div
                          style={{
                            width: `${100 - progress}%`,
                            height: "20px",
                            backgroundColor: "rgba(0, 0, 255, 0.5)", // Blue color with 50% opacity
                            transition: "width 1s",
                            position: "absolute",
                            top: 0,
                            left: `${progress}%`,
                          }}
                        />
                      </div>
                    </p>
                    {/* end Time Progress --------------------------------------------------------- */}
                  </div>
                </div>

                <div className="AnswerEvaluation_contan">
                  {/* <AnswerEvaluation /> */}
                  {/* Answer Evaluation --------------------------------------------------------- */}

                  <div className="AnswerEvaluation_Container">
                    <div>
                      <p className="YourTextDAta sbrPageFOnt">
                        Answer Evaluation
                      </p>
                      <div className="AnswerEvaluation">
                        <div>
                          {" "}
                          {/* {answerEvaluation !== 0 ? 
                          <canvas ref={chartRef} id="Answer_EvaluationCHart" /> :
                          <div>
                             <div style={circleStyle}>hi</div>
                             <canvas ref={chartRef} id="Answer_EvaluationCHart" />
                             hello
                          </div>
                      
                        } */}
                          {answerEvaluation &&
                          (answerEvaluation.totalWrong ||
                            answerEvaluation.totalCorrect ||
                            answerEvaluation.totalUnattempted) ? (
                            <canvas
                              ref={chartRef}
                              id="Answer_EvaluationCHart"
                            />
                          ) : (
                            <div>
                              <div style={circleStyle}></div>
                              {/* <p>Answer Evaluation is currently empty or has zero values.</p> */}

                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "2rem",
                                }}
                              >
                                <p>
                                  <span
                                    style={{
                                      backgroundColor: "rgb(230, 65, 65)",
                                      padding: "0px 15px",
                                      borderRadius: "3px",
                                      marginRight: "5px",
                                      width: "5px",
                                    }}
                                  ></span>
                                  Total Wrong 0
                                </p>
                                <p>
                                  <span
                                    style={{
                                      backgroundColor: "rgb(26, 194, 90)",
                                      padding: "0px 15px",
                                      borderRadius: "3px",
                                      marginRight: "5px",
                                    }}
                                  ></span>
                                  Total Correct 0
                                </p>
                                <p>
                                  <span
                                    style={{
                                      backgroundColor: "#f0f0f0",
                                      padding: "0px 15px",
                                      borderRadius: "3px",
                                      marginRight: "5px",
                                    }}
                                  ></span>
                                  Total Unattempted 0
                                </p>
                              </div>
                              {/* <canvas ref={chartRef} id="Answer_EvaluationCHart" /> */}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="YourTextDAta sbrPageFOnt">
                        Total Percentage
                      </p>
                      <div className="AnswerEvaluation">
                        <div id="Answer_EvaluationCHart sdTotal_Percentage">
                          {answerEvaluation &&
                          (answerEvaluation.totalWrong ||
                            answerEvaluation.totalCorrect ||
                            answerEvaluation.totalUnattempted) ? (
                            <CircularProgressbar
                              value={parseFloat(percentage)}
                              text={`${percentage}%`}
                              strokeWidth={8}
                              styles={{
                                root: {
                                  width: "350px",
                                  height: "350px",
                                },
                                path: {
                                  stroke: `rgb(78 153 201)`,
                                  strokeLinecap: "butt",
                                  transition: "stroke-dashoffset 0.5s ease 0s",
                                  transform: `rotate(-125deg) rotate(${
                                    percentage * 3.6
                                  }deg)`,
                                  transformOrigin: "center center",
                                },
                                trail: {
                                  stroke: "rgb(255 233 233)",
                                  strokeLinecap: "butt",
                                  transform: "rotate(0.25turn)",
                                  transformOrigin: "center center",
                                },
                                text: {
                                  fill: "#3e98c7",
                                  fontSize: "16px",
                                  dominantBaseline: "middle", // Center vertically
                                  textAnchor: "middle", // Center horizontally
                                },
                                background: {
                                  fill: "#3e98c7",
                                },
                              }}
                            />
                          ) : (
                            <div>
                              <CircularProgressbar
                                value={parseFloat(percentage)}
                                text={`0%`} // Display percentage as whole number
                                strokeWidth={8}
                                styles={{
                                  root: {
                                    width: "350px",
                                    height: "350px",
                                  },
                                  path: {
                                    stroke: `#ffe9e9`, // Pink stroke color
                                    strokeLinecap: "butt",
                                    transition:
                                      "stroke-dashoffset 0.5s ease 0s",
                                    transform: `rotate(-125deg) rotate(${
                                      percentage * 3.6
                                    }deg)`,
                                    transformOrigin: "center center",
                                  },
                                  trail: {
                                    stroke: "rgb(255, 233, 233)", // Light pink trail color
                                    strokeLinecap: "butt",
                                    transform: "rotate(0.25turn)",
                                    transformOrigin: "center center",
                                  },
                                  text: {
                                    fill: "#3e98c7", // Blue text color
                                    fontSize: "16px",
                                    dominantBaseline: "middle", // Center vertically
                                    textAnchor: "middle", // Center horizontally
                                  },
                                  background: {
                                    fill: "#3e98c7",
                                  },
                                }}
                              />
                            </div>
                          )}

                          <p style={{ textAlign: "center" }}>
                            Your Total Percentage
                          </p>
                          {/* <span style={{width:'10px',height:'10px',display:'block',background:'red'}}> </span> */}
                        </div>
                        {/* <canvas ref={canvasRef1} width={450} height={450} /> */}

                        {/* <CircularProgressBar /> */}
                      </div>
                    </div>
                  </div>
                  {/*  end Answer Evaluation --------------------------------------------------------- */}
                </div>
              </div>
              {/*  PerformanceRank --------------------------------------------------------- */}

              <div className="PerformanceRank">
                <p>Performance</p>
                <div className="SD_Performance_container">
                  <div>
                    {/* {topThreeRanks.length > 0 ? (
                      <div className="Top_Three_Ranks">
                        <h2>Top Rank:</h2>
                        {topThreeRanks.map((rank) => (
                          <ul className="Top_Three_RanksList">
                            {userrank && userrank.topRank ? (
                              <li>
                                your rank:{" "}
                                <span className="Top_Three_RanksListSpn">
                                  {userrank.topRank.rank}
                                </span>
                              </li>
                            ) : (
                              <p>No data available.</p>
                            )}
                            <li>
                              {userMarks && userMarks.length > 0 ? (
                                <li>
                                  Your Total Marks:{" "}
                                  <span className="Top_Three_RanksListSpn">
                                    {totalDifference}
                                  </span>
                                </li>
                              ) : (
                                <p>No data available.</p>
                              )}
                            </li>
                            <li key={rank.user_Id}>
                              Top Rank:{" "}
                              <span className="Top_Three_RanksListSpn">
                                {rank.rank}
                              </span>
                            </li>
                            <li>
                              {" "}
                              Top Ranker Marks:{" "}
                              <span className="Top_Three_RanksListSpn">
                                {rank.totalMarks}
                              </span>
                            </li>
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <p>No data available.</p>
                    )} */}
                    {/* Solved if the student has same details with the toper details then it shows only that individual student details only */}
                    {/* {topThreeRanks.length > 0 ? (
                      <div className="Top_Three_Ranks">
                        <h2>Top Rank:</h2>
                        {topThreeRanks.map((rank, index) => (
                          <ul className="Top_Three_RanksList" key={index}>
                            {userrank && userrank.topRank ? (
                              <>
                                {index === 0 && (
                                  <>
                                    <li>
                                      Your rank:{" "}
                                      <span className="Top_Three_RanksListSpn">
                                        {userrank.topRank.rank}
                                      </span>
                                    </li>
                                    <li>
                                      Your Total Marks:{" "}
                                      <span className="Top_Three_RanksListSpn">
                                        {totalDifference}
                                      </span>
                                    </li>
                                  </>
                                )}
                                {(index === 0 ||
                                  rank.rank !== topThreeRanks[index - 1].rank ||
                                  rank.totalMarks !==
                                    topThreeRanks[index - 1].totalMarks) && (
                                  <>
                                    <li>
                                      Top Rank:{" "}
                                      <span className="Top_Three_RanksListSpn">
                                        {rank.rank}
                                      </span>
                                    </li>
                                    <li>
                                      Top Ranker Marks:{" "}
                                      <span className="Top_Three_RanksListSpn">
                                        {rank.totalMarks}
                                      </span>
                                    </li>
                                  </>
                                )}
                              </>
                            ) : (
                              <p>No data available.</p>
                            )}
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <p>No data available.</p>
                    )} */}
                    {topThreeRanks && topThreeRanks.length > 0 ? (
                      <div className="Top_Three_Ranks">
                        <h2>Top Rank:</h2>
                        {topThreeRanks.map((rank, index) => (
                          <ul className="Top_Three_RanksList" key={index}>
                            {userrank && userrank.topRank ? (
                              <>
                                {index === 0 && (
                                  <>
                                    <li>
                                      Your rank:{" "}
                                      <span className="Top_Three_RanksListSpn">
                                        {userrank.topRank.rank}
                                      </span>
                                    </li>
                                    <li>
                                      Your Total Marks:{" "}
                                      <span className="Top_Three_RanksListSpn">
                                        {totalDifference}
                                      </span>
                                    </li>
                                  </>
                                )}
                                {(index === 0 ||
                                  rank.rank !== topThreeRanks[index - 1].rank ||
                                  rank.totalMarks !==
                                    topThreeRanks[index - 1].totalMarks) && (
                                  <>
                                    <li>
                                      Top Rank:{" "}
                                      <span className="Top_Three_RanksListSpn">
                                        {rank.rank}
                                      </span>
                                    </li>
                                    <li>
                                      Top Ranker Marks:{" "}
                                      <span className="Top_Three_RanksListSpn">
                                        {rank.totalMarks}
                                      </span>
                                    </li>
                                  </>
                                )}
                              </>
                            ) : (
                              <p>No data available.</p>
                            )}
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <p>
                          You didn't attempt any questions in this test, so your
                          score is 0.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="PerformanceIMG">
                    <img src={TrophyImage} alt="image" />
                  </div>
                </div>
                {/* <div className="IoTrophyOutlineI">
                  <div className="IoTrophyOutline_container">
                    <IoTrophyOutline className="IconIoTrophyOutlineI" />
                    <span className="IoTrophyOutline_span"></span>
                  </div>
                  <div className="IoTrophyOutline_container">
                    <IoTrophyOutline className="IoTrophyOutlineI1 IconIoTrophyOutlineI" />
                    <span className="IoTrophyOutline_span IoTrophyOutline_span2"></span>
                  </div>
                  <div className="IoTrophyOutline_container">
                    <IoTrophyOutline className="IconIoTrophyOutlineI" />
                    <span className="IoTrophyOutline_span"></span>
                  </div>
                </div> */}
              </div>
              {/*  end PerformanceRank --------------------------------------------------------- */}

              {/*  Section Wise Result View barChartsContainer  --------------------------------------------------------- */}
              {/* <div className="Section_Wise_Result_View ">
                <p>Section Wise Result View</p>
                <div id="barChartsContainer"></div>
              </div> */}

              {/* <div className="score_cards_div">
              <h3 className="Total_score">
                Total Score: {score.overallNetMarks}
              </h3>
              <div className="score_cards">
                {groupSectionsBySubjectId().map((subject) => (
                  <div key={subject.subjectId} className="subject_score_card">
                    <h4>{subject.subjectName}</h4>
                    <p>Total Marks: {subject.totalMarks}</p>
                    <p>Total Marks: {subject.netMarks}</p>
                    <p>Correct Answers Count: {subject.correctAnswersCount}</p>
                    <div>
                      {Object.entries(subject.sections).map(
                        ([sectionName, sectionScores]) => (
                          <div key={sectionName}>
                            <p>{sectionName}</p>
                            <p>Total Marks: {sectionScores.totalMarks}</p>
                            <p>Marks: {sectionScores.netMarks}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

              {/*  end Section Wise Result View --------------------------------------------------------- */}
            </>
          )}

          {selectedContent === "solutions" && (
            <div>
              <div className="result_Solutions_container">
                {/* Render dropdown for each section */}

                <div className="DropdownContainersectionId">
                  <select
                    onChange={handleSectionChange}
                    value={selectedSection}
                  >
                    {/* <option value="">Select Section</option> */}
                    {/* Map through grouped questions to create dropdown options */}
                    {Object.keys(groupedQuestions).map((sectionId) => (
                      <option key={sectionId} value={sectionId}>
                        {groupedQuestions[sectionId][0].sectionName.subjectName}{" "}
                        {groupedQuestions[sectionId][0].sectionName.sectionName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Render questions for the selected section */}
                {selectedSection &&
                  groupedQuestions[selectedSection].map((question, index) => (
                    <div
                      key={index}
                      className="result_Solutions "
                      style={{ position: "relative" }}
                      // style={{ position: "relative", backgroundImage: "url('https://www.egradtutor.in/static/media/egate%20logo%201.8b1eb31347d60945925f.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain" }}
                    >
                      <span className=""></span>
                      {/* Render each question */}

                      <div>
                        <button
                          className={`BookmarkButton ${
                            isQuestionBookmarked(question) ? "bookmarked" : ""
                          }`}
                          onClick={() => handleBookmark(question)}
                        >
                          {isQuestionBookmarked(question) ? (
                            <i className="fa-solid fa-bookmark"></i>
                          ) : (
                            <i className="fa-regular fa-bookmark"></i>
                          )}
                        </button>

                        <button
                          className=" ChallengeButtonparet"
                          onClick={() =>
                            handleOpenChallengeForm(question.question_id)
                          }
                          disabled={question.isChallengeSubmitted}
                          aria-pressed={question.isChallengeSubmitted}
                        >
                          {question.isChallengeSubmitted ? (
                            <span className="ChallengeButton">
                              Your Challenge Has Been Submitted
                            </span>
                          ) : (
                            <span className="notChallengeButton">
                              Challenge This Question
                            </span>
                          )}
                        </button>
                        {isChallengeFormVisible &&
                          challengeQuestionId === question.question_id && (
                            <div className="ChallengeOverlay">
                              <div className="ChallengePopup">
                                <h3>Challenge Form</h3>
                                {/* <form encType="multipart/form-data">
                                  <textarea
                                    rows="4"
                                    cols="50"
                                    placeholder="Write your challenge here"
                                    onChange={(e) =>
                                      setChallengeText(e.target.value)
                                    }
                                    style={{
                                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.9)", // Box shadow style
                                      borderRadius: "4px", // Rounded corners
                                      padding: "10px", // Padding inside the textarea
                                      width: "100%", // Full width
                                      boxSizing: "border-box", // Make sure padding and border are included in the width
                                    }}
                                  ></textarea>
                                  <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) =>
                                      setImage(e.target.files[0])
                                    }
                                  />
                                </form> */}

                                <div className="new-message-container">
                                  <div
                                    className="message-body-section"
                                    contentEditable="true"
                                    id="message-body"
                                    name="message-body"
                                    rows="100"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    placeholder="Compose your message here..."
                                    // onBlur={(e) =>

                                    // }
                                  >
                                    {selectedFile && (
                                      <img
                                        src={selectedFile}
                                        alt="Attached Image"
                                        title="This is a batch tooltip"
                                        style={{
                                          maxWidth: "100px",
                                          height: "100px",
                                          position: "absolute",
                                          left: "0",
                                          bottom: "0",
                                        }}
                                      />
                                    )}
                                  </div>
                                  <div className="attachment-section">
                                    <button
                                      id="attach-file-button"
                                      onClick={() =>
                                        document
                                          .getElementById("file-input")
                                          .click()
                                      }
                                    >
                                      <GrAttachment />

                                      {/* <AiFillPicture /> */}
                                    </button>
                                    <input
                                      type="file"
                                      id="file-input"
                                      style={{ display: "none" }}
                                      onChange={handleFileChange}
                                    />
                                  </div>
                                  <div className="send-section">
                                    <button
                                      id="send-message-button"
                                      onClick={() =>
                                        handleChallengeSubmit(
                                          question.question_id
                                        )
                                      }
                                    >
                                      Submit Challenge
                                    </button>
                                  </div>
                                </div>
                                {/* <button
                                  onClick={() =>
                                    handleChallengeSubmit(question.question_id)
                                  }
                                ></button> */}
                                <button
                                  className="handleCloseChallengeForm"
                                  onClick={handleCloseChallengeForm}
                                >
                                  <IoMdClose />
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                      {/* Watermark */}
                      {/* <span
                        className="watermark"
                        style={{
                          fontSize: "24px",
                        }}
                      >
                        eGRADTutor
                      </span> */}

                      {/* Top Watermark */}
                      <span className="watermark top">{user_Id} </span>
                      {/* <span className="watermarktop">{user_Id}  eGRADTutor</span> */}
                      <div className="eGRADTutorWatermark">
                        <div className="resultSolutionsQ">
                          <p>{index + 1}</p>
                          <img
                            src={`${BASE_URL}/uploads/${question.documen_name}/${question.questionImgName}`}
                            alt={`Question ${index + 1}`}
                          />
                        </div>
                        <ul>
                          {(question.qtype &&
                            question.qtype.qtype_text &&
                            question.qtype.qtype_text.trim() === "NATI") ||
                          (question.qtype &&
                            question.qtype.qtype_text &&
                            question.qtype.qtype_text.trim() === "NATD") ? (
                            // If the question type is "NATI" or "NATD", display the additional list data
                            <li className="result_Solutions_Correct">
                              <span>
                                Correct Answer:
                                <b>
                                  {question.options.find(
                                    (option) => option.answer_text
                                  )?.answer_text || "N/A"}
                                </b>
                              </span>
                              {question.Uruser_answer ? (
                                <>
                                  Attempted: <b>{question.Uruser_answer}</b>
                                </>
                              ) : (
                                <>
                                  Not Attempted:
                                  <b>{question.Uruser_answer || "N/A"}</b>
                                  <HiQuestionMarkCircle
                                    style={{ color: "#f40010" }}
                                  />
                                </>
                              )}

                              <span>
                                Status :
                                <b
                                  style={{
                                    color:
                                      question.userAnswerStatus === "Correct"
                                        ? "green"
                                        : "red",
                                  }}
                                >
                                  {question.userAnswerStatus === "Correct"
                                    ? "✅"
                                    : "❌"}
                                </b>
                              </span>
                            </li>
                          ) : (
                            // If the question type is not "NATI" or "NATD", display only the options
                            question.options.map((option, optionIndex) => (
                              <li key={option.option_id}>
                                <span style={{ paddingRight: "10px" }}>
                                  ({option.option_index}){" "}
                                </span>
                                {option.optionImgName && (
                                  <>
                                    <img
                                      src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
                                      alt={`Option ${option.option_index}`}
                                    />
                                    {option.answer_text
                                      .split(",")
                                      .map((answer) => (
                                        <span key={answer}>
                                          {answer.trim() ===
                                            option.option_index.trim() && "✅"}
                                        </span>
                                      ))}

                                    {option.Uruser_answer === "N/A"
                                      ? // If Uruser_answer is "N/A", display "N/A" for all options
                                        option.option_index
                                          .split(",")
                                          .map((index) => <></>)
                                      : // If Uruser_answer is not "N/A", display the appropriate symbols
                                        option.Uruser_answer.split(",").map(
                                          (userAnswer) => (
                                            <span key={userAnswer}>
                                              {userAnswer.trim() ===
                                              option.answer_text.trim()
                                                ? ""
                                                : !option.answer_text
                                                    .split(",")
                                                    .includes(
                                                      userAnswer.trim()
                                                    ) &&
                                                  option.option_index
                                                    .split(",")
                                                    .includes(
                                                      userAnswer.trim()
                                                    ) &&
                                                  "❌"}
                                            </span>
                                          )
                                        )}
                                  </>
                                )}
                              </li>
                            ))
                          )}

                          <li className="result_Solutions_Correct"></li>
                        </ul>
                      </div>
                      <button
                        className="SolutionshandleShowAnswer"
                        onClick={() => handleShowAnswer(question)}
                      >
                        {selectedQuestion === question && showAnswer === true
                          ? `Hide Answer`
                          : `Show Answer`}
                        <IoIosArrowForward />
                      </button>

                      {showAnswer === true &&
                        selectedQuestion === question &&
                        question.solutionImgName && (
                          <div
                            className="Cr_Answer eGRADTutorWatermark"
                            style={{ position: "relative" }}
                          >
                            <span className="watermark top">{user_Id}</span>

                            <h4>Answer:</h4>

                            <img
                              src={`${BASE_URL}/uploads/${question.documen_name}/${question.solutionImgName.solutionImgName}`}
                              alt="Solution"
                            />
                          </div>
                        )}
                    </div>
                  ))}
              </div>
            </div>
          )}
          {selectedContent === "key" && (
            <div className="Question_Paper_Key">
              <div className="individual_questions">
                <h4>Question Paper Key</h4>
                <p>Check individual questions with Analysis</p>
              </div>
              {keydata.map((item, index) => (
                <div key={index} className="Question_KeyCOntainer">
                  <div className="Question_contant">
                    <ul>
                      <li className="qk_index1 qk_index">Q.No : {index + 1}</li>
                      <li className="qk_index">
                        Correct Answer : <b>{item.user_answer}</b>
                      </li>
                      <li className="qk_index">
                        Your Answer : <b>{item.answer_text}</b>
                      </li>
                      <li>{keydata.answertext ? <> not </> : <>answer</>}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedContent === "rankers" && (
            <div>
              <ul>
                {rankData.totalmarks && rankData.totalmarks.length > 0 ? (
                  rankData.totalmarks.map((data, index) => (
                    <li key={index}>
                      User ID: {data.user_Id}, Rank: {data.rank}
                    </li>
                  ))
                ) : (
                  <li>No data available</li>
                )}
              </ul>
            </div>
          )}
        </section>
      </div>
      {isVisible && (
        <span className="UpArrow" onClick={ScrollToTop}>
          <a href="#topMove">
            <TbArrowBarToUp style={{ fontSize: "30px" }} />
          </a>
        </span>
      )}
    </div>
  );
};
