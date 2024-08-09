const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");

// router.get('/testcourses', async (req, res) => {
//     try {
//       const [ rows ] = await db.query('SELECT courseCreationId,courseName FROM course_creation_table');
//       res.json(rows);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

router.get("/testcourses", async (req, res) => {
  try {
    // const query = `SELECT courseCreationId,courseName FROM  course_creation_table WHERE  Portale_Id IN (1, 2)`;
    const  query=`SELECT * FROM course_creation_table as cct LEFT JOIN exams as e ON e.examId=cct.examId WHERE e.branchId=1;`
    const [rows] = await db.query(query);
    // Execute the query// Check if there are results
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for Portale_Id 1 or 2" });
    }
    res.json(rows);
    // Return the fetched rows as JSON
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Log the error for debugging
    res.status(500).json({
      error: "Internal Server Error",
    });

  }
});


router.get("/completetestcourses", async (req, res) => {
  try {
    const query = `SELECT courseCreationId,courseName FROM  course_creation_table WHERE  Portale_Id IN (4)`;
    const [rows] = await db.query(query);
    // Execute the query// Check if there are results
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for Portale_Id 1 or 2" });
    }
    res.json(rows);
    // Return the fetched rows as JSON
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Log the error for debugging
    res.status(500).json({
      error: "Internal Server Error",
    });

  }
});


router.get("/options_pattern", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT opt_pattern_id,opt_pattern_name FROM options_pattern"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching options_pattern:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/testpattern", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT Test_Pattern_Id,Test_pattern_name FROM test_pattern"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching test_pattern:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/course-subjects/:courseCreationId", async (req, res) => {
  const { courseCreationId } = req.params;

  try {
    const [subjects] = await db.query(
      "SELECT s.subjectId, s.subjectName FROM subjects s JOIN course_subjects cs ON s.subjectId = cs.subjectId WHERE cs.courseCreationId = ?",
      [courseCreationId]
    );

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send("Error fetching subjects.");
  }
});

router.post("/create_test_form1", async (req, res) => {
  const {
    testName,
    selectedCourse,
    selectedtypeOfTest,
    startDate,
    startTime,
    endDate,
    endTime,
    duration,
    totalQuestions,
    totalMarks,
    sectionsData,
    selectedInstruction,
    selectedoptions,
    selectedFormId
  } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO test_creation_table (TestName, courseCreationId, courseTypeOfTestId, testStartDate, testEndDate, testStartTime, testEndTime, Duration, TotalQuestions, totalMarks, instructionId,opt_pattern_id,TestForm_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
      [
        testName,
        selectedCourse,
        selectedtypeOfTest,
        startDate,
        endDate,
        startTime,
        endTime,
        duration,
        totalQuestions,
        totalMarks,
        selectedInstruction,
        selectedoptions,
        selectedFormId
      ]
    );

    if (result && result.insertId) {
      const testCreationTableId = result.insertId;

      // Process sectionsData and insert into sections table
      const results = await Promise.all(
        sectionsData.map(async (section) => {
          const subjectId = section.selectedSubjects || 0;

          const [sectionResult] = await db.query(
            "INSERT INTO sections (testCreationTableId, sectionName, noOfQuestions, QuestionLimit, subjectId) VALUES (?, ?, ?, ?, ?)",
            [
              testCreationTableId,
              section.sectionName || null,
              section.noOfQuestions,
              section.QuestionLimit || null,
              subjectId,
            ]
          );
          return sectionResult;
        })
      );
      console.log(results,"ppppppppppppppppppppppppppppppppp")
      res.json({
        success: true,
        testCreationTableId,
        results,
        message: "Test created successfully",
      });
    } else {
      console.log(result,"result objjjjjjjj ")
      res.status(400).json({ success: false, error: "Unable to create test" });
    }
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/create_test_form2", async (req, res) => {
  const {
    testName,
    selectedCompleteCourse,
    startDate,
    startTime,
    endDate,
    endTime,
    duration,
    totalQuestions,
    totalMarks,
    selectedInstruction,
    selectedoptions,
    selectedFormId,
    selectedTestPattern,
  } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO test_creation_table (TestName, courseCreationId, testStartDate, testEndDate, testStartTime, testEndTime, Duration, TotalQuestions, totalMarks, instructionId, opt_pattern_id,TestForm_Id,Test_Pattern_Id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        testName,
        selectedCompleteCourse,
        startDate,
        endDate,
        startTime,
        endTime,
        duration,
        totalQuestions,
        totalMarks,
        selectedInstruction,
        selectedoptions,
        selectedFormId,
        selectedTestPattern,
      ]
    );

    const testCreationTableId = result.insertId; // Get the ID of the inserted record

    res.json({
      success: true,
      testCreationTableId,
      message: "Test created successfully",
    });
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/create-test", async (req, res) => {
  const {
    testName,
    selectedCourse,
    selectedtypeOfTest,
    startDate,
    startTime,
    endDate,
    endTime,
    duration,
    totalQuestions,
    totalMarks,
    calculator,
    sectionsData,
    selectedInstruction,
    selectedoptions,
  } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO test_creation_table (TestName, courseCreationId, courseTypeOfTestId, testStartDate, testEndDate, testStartTime, testEndTime, Duration, TotalQuestions, totalMarks, calculator, instructionId,opt_pattern_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        testName,
        selectedCourse,
        selectedtypeOfTest,
        startDate,
        endDate,
        startTime,
        endTime,
        duration,
        totalQuestions,
        totalMarks,
        calculator,
        selectedInstruction,
        selectedoptions,
      ]
    );

    if (result && result.insertId) {
      const testCreationTableId = result.insertId;

      // Process sectionsData and insert into sections table
      const results = await Promise.all(
        sectionsData.map(async (section) => {
          const subjectId = section.selectedSubjects || 0;

          const [sectionResult] = await db.query(
            "INSERT INTO sections (testCreationTableId, sectionName, noOfQuestions, QuestionLimit, subjectId) VALUES (?, ?, ?, ?, ?)",
            [
              testCreationTableId,
              section.sectionName || null,
              section.noOfQuestions,
              section.QuestionLimit || null,
              subjectId,
            ]
          );
          return sectionResult;
        })
      );

      res.json({
        success: true,
        testCreationTableId,
        results,
        message: "Test created successfully",
      });
    } else {
      res.status(400).json({ success: false, error: "Unable to create test" });
    }
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/instructions", async (req, res) => {
  try {
    const [instructions] = await db.query(
      "SELECT instructionId, instructionHeading FROM instruction"
    );
    res.json(instructions);
  } catch (error) {
    console.error("Error fetching instructions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Add this new API endpoint
router.get("/course-typeoftests/:courseCreationId", async (req, res) => {
  const { courseCreationId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT type_of_test.TypeOfTestId, type_of_test.TypeOfTestName,course_typeoftests.courseTypeOfTestId " +
      "FROM course_typeoftests " +
      "INNER JOIN type_of_test ON course_typeoftests.TypeOfTestId = type_of_test.TypeOfTestId " +
      "WHERE course_typeoftests.courseCreationId = ?",
      [courseCreationId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching course_typeoftests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/test_creation_table", async (req, res) => {
  try {
    const query = ` SELECT tt.testCreationTableId,tt.TestName,cc.courseName,cc.Portale_Id,tt.testStartDate,tt.testEndDate,tt.testStartTime,tt.testEndTime,tt.status,tt.TotalQuestions,tt.opt_pattern_id,TT.TestForm_Id FROM test_creation_table tt JOIN  course_creation_table cc ON tt.courseCreationId=cc.courseCreationId `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error creating sections:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.delete(
  "/test_table_data_delete/:testCreationTableId",
  async (req, res) => {
    const testCreationTableId = req.params.testCreationTableId;

    try {
      await db.query(
        "DELETE test_creation_table, sections FROM test_creation_table LEFT JOIN sections ON test_creation_table.testCreationTableId = sections.testCreationTableId WHERE test_creation_table.testCreationTableId = ?",
        [testCreationTableId]
      );
      res.json({
        message: `course with ID ${testCreationTableId} deleted from the database`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// router.get("/testupdate/:TestForm_Id/:testCreationTableId", async (req, res) => {
//   const { testCreationTableId,TestForm_Id } = req.params;

//   try {
//     const [rows] = await db.query(
//       `
//       SELECT
//       tc.testCreationTableId,
//       tc.TestForm_Id,
//       tc.TestName,
//       tc.testStartDate,
//       tc.testEndDate,
//       tc.testStartTime,
//       tc.testEndTime,
//       tc.Duration,
//       tc.TotalQuestions,
//       tc.totalMarks,
//       tc.calculator,
//       cc.courseCreationId,
//       cc.courseName,
//       ctt.courseTypeOfTestId,
//       tt.TypeOfTestName,
//       i.instructionId,
//       i.instructionHeading,
//       s.sectionName,
//       s.noOfQuestions,
//       s.QuestionLimit
//   FROM
//       test_creation_table AS tc
//   INNER JOIN course_creation_table AS cc
//   ON
//       tc.courseCreationId = cc.courseCreationId
//   INNER JOIN course_typeoftests AS ctt
//   ON
//       tc.courseCreationId = ctt.courseCreationId
//   INNER JOIN type_of_test AS tt
//   ON
//       ctt.TypeOfTestId = tt.TypeOfTestId
//   INNER JOIN instruction AS i
//   ON
//       tc.instructionId = i.instructionId
//        INNER JOIN
//           sections AS s ON tc.testCreationTableId = s.testCreationTableId
//   WHERE
//       tc.testCreationTableId = ? and TestForm_Id=?
//       `,
//       [testCreationTableId,TestForm_Id]
//     );

//     if (rows.length > 0) {
//       res.json(rows[0]);
//     } else {
//       res.status(404).json({ error: "Test not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching test data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });









// SELECT * 
// FROM test_creation_table AS tc
//   WHERE
//       tc.testCreationTableId = 17 AND courseTypeOfTestId = 0;


router.get("/testupdate/:TestForm_Id/:testCreationTableId", async (req, res) => {
  const { testCreationTableId, TestForm_Id } = req.params;

  try {
    let query;
    let queryParams;

    if (TestForm_Id === '1') {
      query = `
        SELECT
            tc.testCreationTableId,
            tc.TestForm_Id,
            tc.TestName,
            tc.testStartDate,
            tc.testEndDate,
            tc.testStartTime,
            tc.testEndTime,
            tc.Duration,
            tc.TotalQuestions,
            tc.totalMarks,
            tc.calculator,
            cc.courseCreationId,
            cc.courseName,
            ctt.courseTypeOfTestId,
            tt.TypeOfTestName,
            i.instructionId,
            i.instructionHeading,
            s.sectionName,
            s.noOfQuestions,
            s.QuestionLimit
        FROM
            test_creation_table AS tc
        INNER JOIN course_creation_table AS cc ON tc.courseCreationId = cc.courseCreationId
        INNER JOIN course_typeoftests AS ctt ON tc.courseCreationId = ctt.courseCreationId
        INNER JOIN type_of_test AS tt ON ctt.TypeOfTestId = tt.TypeOfTestId
        INNER JOIN instruction AS i ON tc.instructionId = i.instructionId
        INNER JOIN sections AS s ON tc.testCreationTableId = s.testCreationTableId
        WHERE
            tc.testCreationTableId = ? AND tc.TestForm_Id = ?
      `;
      queryParams = [testCreationTableId, TestForm_Id];
    } else if (TestForm_Id === '2') {
      query = `
        SELECT
            tc.testCreationTableId,
            tc.TestForm_Id,
            tc.TestName,
            tc.testStartDate,
            tc.testEndDate,
            tc.testStartTime,
            tc.testEndTime,
            tc.Duration,
            tc.TotalQuestions,
            tc.totalMarks,
            tc.calculator,
            cc.courseCreationId,
            cc.courseName,
            i.instructionId,
            i.instructionHeading
        FROM
            test_creation_table AS tc
        INNER JOIN course_creation_table AS cc ON tc.courseCreationId = cc.courseCreationId
        INNER JOIN instruction AS i ON tc.instructionId = i.instructionId
        WHERE
            tc.testCreationTableId = ? AND tc.TestForm_Id = ?
      `;
      queryParams = [testCreationTableId, TestForm_Id];
    } else {
      return res.status(400).json({ error: "Invalid TestForm_Id" });
    }

    const [rows] = await db.query(query, queryParams);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Test not found" });
    }
  } catch (error) {
    console.error("Error fetching test data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





router.put("/test-update/:testCreationTableId/:TestForm_Id", async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;
  const TestForm_Id = req.params.TestForm_Id; // Use req.params.TestForm_Id instead of req.params.portalId
  const {
    TestName,
    selectedCourse,
    selectedTypeOfTests,
    testStartDate,
    testEndDate,
    testStartTime,
    testEndTime,
    Duration,
    TotalQuestions,
    totalMarks,
    calculator,
    sectionId,
    sectionName,
    noOfQuestions,
    QuestionLimit,
    selectedInstruction,
  } = req.body;

  const updateQuery = `UPDATE test_creation_table
                         SET TestName=?, courseCreationId=?, courseTypeOfTestId=?,
                             testStartDate=?, testEndDate=?, testStartTime=?,
                             testEndTime=?, Duration=?, TotalQuestions=?,
                             totalMarks=?, calculator=?, instructionId=?
                             
                         WHERE testCreationTableId=? and TestForm_Id =?`;

  try {
    await db.query(updateQuery, [
      TestName,
      selectedCourse,
      selectedTypeOfTests,
      testStartDate,
      testEndDate,
      testStartTime,
      testEndTime,
      Duration,
      TotalQuestions,
      totalMarks,
      calculator,
      selectedInstruction,
      testCreationTableId,
      TestForm_Id,
    ]);

    // Log the update result
    const updateResult = await db.query(
      "SELECT * FROM test_creation_table WHERE testCreationTableId = ?",
      [testCreationTableId]
    );
    console.log("Update Result:", updateResult);

    // Update section
    const updateSectionQuery = `UPDATE sections
                                  SET sectionName=?, noOfQuestions=?, QuestionLimit=?
                                  WHERE testCreationTableId=? AND sectionId=?`;

    await db.query(updateSectionQuery, [
      sectionName,
      noOfQuestions,
      QuestionLimit,
      testCreationTableId,
      sectionId,
    ]);

    res.status(200).json({ message: "Test and section updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// router.put("/test-update/:testCreationTableId/:TestForm_Id", async (req, res) => {
//   const testCreationTableId = req.params.testCreationTableId;
//   const TestForm_Id=req.params.TestForm_Id;
//   const {
//     TestName,
//     selectedCourse,
//     selectedTypeOfTests,
//     testStartDate,
//     testEndDate,
//     testStartTime,
//     testEndTime,
//     Duration,
//     TotalQuestions,
//     totalMarks,
//     calculator,
//     sectionId,
//     sectionName,
//     noOfQuestions,
//     QuestionLimit,
//     selectedInstruction,
//   } = req.body;

//   const updateQuery = `UPDATE test_creation_table
//                          SET TestName=?, courseCreationId=?, courseTypeOfTestId=?,
//                              testStartDate=?, testEndDate=?, testStartTime=?,
//                              testEndTime=?, Duration=?, TotalQuestions=?,
//                              totalMarks=?, calculator=?, instructionId=?
                             
//                          WHERE testCreationTableId=? and TestForm_Id =?`;

//   try {
//     await db.query(updateQuery, [
//       TestName,
//       selectedCourse,
//       selectedTypeOfTests,
//       testStartDate,
//       testEndDate,
//       testStartTime,
//       testEndTime,
//       Duration,
//       TotalQuestions,
//       totalMarks,
//       calculator,
//       selectedInstruction,
//       TestForm_Id,
//       testCreationTableId,
//     ]);

//     // Log the update result
//     const updateResult = await db.query(
//       "SELECT * FROM test_creation_table WHERE testCreationTableId = ?",
//       [testCreationTableId]
//     );
//     console.log("Update Result:", updateResult);

//     // Update section
//     const updateSectionQuery = `UPDATE sections
//                                   SET sectionName=?, noOfQuestions=?, QuestionLimit=?
//                                   WHERE testCreationTableId=? AND sectionId=?`;

//     await db.query(updateSectionQuery, [
//       sectionName,
//       noOfQuestions,
//       QuestionLimit,
//       testCreationTableId,
//       sectionId,
//     ]);

//     res.json({ message: "Test and section updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// router.put("/CP_test-update/:testCreationTableId/:TestForm_Id", async (req, res) => {
//   const testCreationTableId = req.params.testCreationTableId;
//   const TestForm_Id=req.params.TestForm_Id;
//   const {
//     TestName,
//     selectedCourse,
//     testStartDate,
//     testEndDate,
//     testStartTime,
//     testEndTime,
//     Duration,
//     TotalQuestions,
//     totalMarks,
//     calculator,
//     selectedInstruction,
//   } = req.body;

//   const updateQuery = `UPDATE test_creation_table
//                          SET TestName=?, courseCreationId=?,
//                              testStartDate=?, testEndDate=?, testStartTime=?,
//                              testEndTime=?, Duration=?, TotalQuestions=?,
//                              totalMarks=?, calculator=?, instructionId=?
                             
//                          WHERE testCreationTableId=? and TestForm_Id =?`;

//   try {
//     await db.query(updateQuery, [
//       TestName,
//       selectedCourse,
//       testStartDate,
//       testEndDate,
//       testStartTime,
//       testEndTime,
//       Duration,
//       TotalQuestions,
//       totalMarks,
//       calculator,
//       selectedInstruction,
//       TestForm_Id,
//       testCreationTableId,
//     ]);

//     // Log the update result
//     const updateResult = await db.query(
//       "SELECT * FROM test_creation_table WHERE testCreationTableId = ?",
//       [testCreationTableId]
//     );
//     console.log("Update Result:", updateResult);

   

//     res.json({ message: "Test and section updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.put("/CP_test-update/:testCreationTableId/:TestForm_Id", async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;
  const TestForm_Id = req.params.TestForm_Id;
  const {
    TestName,
    selectedCourse,
    testStartDate,
    testEndDate,
    testStartTime,
    testEndTime,
    Duration,
    TotalQuestions,
    totalMarks,
    calculator,
    selectedInstruction,
  } = req.body;

  const updateQuery = `UPDATE test_creation_table
                         SET TestName=?, courseCreationId=?,
                             testStartDate=?, testEndDate=?, testStartTime=?,
                             testEndTime=?, Duration=?, TotalQuestions=?,
                             totalMarks=?, calculator=?, instructionId=?
                             
                         WHERE testCreationTableId=? and TestForm_Id =?`;

  try {
    await db.query(updateQuery, [
      TestName,
      selectedCourse,
      testStartDate,
      testEndDate,
      testStartTime,
      testEndTime,
      Duration,
      TotalQuestions,
      totalMarks,
      calculator,
      selectedInstruction,
      testCreationTableId,
      TestForm_Id,
    ]);

    // Log the update result
    const updateResult = await db.query(
      "SELECT * FROM test_creation_table WHERE testCreationTableId = ?",
      [testCreationTableId]
    );
    console.log("Update Result:", updateResult);

    res.json({ message: "Test and section updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get('/TestActivation', async (req, res) => {
//   // Fetch subjects
//   try {
//     const [rows] = await db.query(`SELECT
//     t.testCreationTableId,
//     t.TestName,
//     t.TotalQuestions,
//     s.subjectId,
//     s.subjectName,
//     sc.sectionId,
//     sc.sectionName,
//     sc.noOfQuestions AS numberOfQuestionsInSection,
//     subquery.numberOfQuestionsInSubject
// FROM
//     test_creation_table AS t
// LEFT JOIN course_subjects AS cs ON t.courseCreationId = cs.courseCreationId
// LEFT JOIN subjects AS s ON s.subjectId = cs.subjectId
// LEFT JOIN sections AS sc ON sc.subjectId = s.subjectId
// LEFT JOIN (
//     SELECT
//         q.subjectId,
//         COUNT(q.question_id) AS numberOfQuestionsInSubject
//     FROM
//         questions AS q
//     GROUP BY
//         q.subjectId
// ) AS subquery ON s.subjectId = subquery.subjectId
// LEFT JOIN questions AS q ON t.testCreationTableId = q.testCreationTableId
//                       AND sc.sectionId = q.sectionId
//                       AND s.subjectId = q.subjectId
// WHERE
//     t.testCreationTableId = ?
// GROUP BY
//     t.testCreationTableId,
//     t.TestName,
//     t.TotalQuestions,
//     s.subjectId,
//     s.subjectName,
//     sc.sectionId,
//     sc.sectionName,
//     sc.noOfQuestions,
//     subquery.numberOfQuestionsInSubject`);
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get("/TestActivation", async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT
          t.testCreationTableId,
          t.TestName,
          t.TotalQuestions,
          s.subjectId,
          s.subjectName,
          sc.sectionId,
          sc.sectionName,
          sc.noOfQuestions AS numberOfQuestionsInSection,
          subquery.numberOfQuestionsInSubject
        FROM
          test_creation_table AS t
        LEFT JOIN course_subjects AS cs ON t.courseCreationId = cs.courseCreationId
        LEFT JOIN subjects AS s ON s.subjectId = cs.subjectId
        LEFT JOIN sections AS sc ON sc.subjectId = s.subjectId
        LEFT JOIN (
          SELECT
            q.subjectId,
            COUNT(q.question_id) AS numberOfQuestionsInSubject
          FROM
            questions AS q
          GROUP BY
            q.subjectId
        ) AS subquery ON s.subjectId = subquery.subjectId
        LEFT JOIN questions AS q ON t.testCreationTableId = q.testCreationTableId
                                AND sc.sectionId = q.sectionId
                                AND s.subjectId = q.subjectId
        WHERE
          t.testCreationTableId = ?
        GROUP BY
          t.testCreationTableId,
          t.TestName,
          t.TotalQuestions,
          s.subjectId,
          s.subjectName,
          sc.sectionId,
          sc.sectionName,
          sc.noOfQuestions,
          subquery.numberOfQuestionsInSubject
      `);

    // Organize the data into a structured JSON response
    const tests = rows.map((row) => {
      const existingTest = tests.find(
        (test) => test.testCreationTableId === row.testCreationTableId
      );
      if (existingTest) {
        // Test already exists, add subject and section to existing test
        const existingSubject = existingTest.subjects.find(
          (subject) => subject.subjectId === row.subjectId
        );
        if (existingSubject) {
          // Subject already exists, add section to existing subject
          existingSubject.sections.push({
            sectionId: row.sectionId,
            sectionName: row.sectionName,
            numberOfQuestions: row.numberOfQuestionsInSection,
          });
        } else {
          // Subject does not exist, create a new subject
          existingTest.subjects.push({
            subjectId: row.subjectId,
            subjectName: row.subjectName,
            sections: [
              {
                sectionId: row.sectionId,
                sectionName: row.sectionName,
                numberOfQuestions: row.numberOfQuestionsInSection,
              },
            ],
          });
        }
      } else {
        // Test does not exist, create a new test with subject and section
        tests.push({
          testCreationTableId: row.testCreationTableId,
          TestName: row.TestName,
          TotalQuestions: row.TotalQuestions,
          subjects: [
            {
              subjectId: row.subjectId,
              subjectName: row.subjectName,
              sections: [
                {
                  sectionId: row.sectionId,
                  sectionName: row.sectionName,
                  numberOfQuestions: row.numberOfQuestionsInSection,
                },
              ],
            },
          ],
        });
      }
    });

    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// In your server code
router.get(
  "/getQuestionCountForTest/:testCreationTableId",
  async (req, res) => {
    const { testCreationTableId } = req.params;

    try {
      const [rows] = await db.query(
        `
        SELECT COUNT(*) AS count
        FROM questions
        WHERE testCreationTableId = ?
      `,
        [testCreationTableId]
      );

      const questionCount = rows[0].count;

      res.json({ count: questionCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Assuming you're using Express
// app.get('/TestCreation/test-sections/:testCreationTableId/:subjectId', async (req, res) => {
//   const testCreationTableId = req.params.testCreationTableId;
//   const subjectId = req.params.subjectId;

//   SELECT * FROM sections WHERE testCreationTableId = testCreationTableId AND subjectId =subjectId

//   try {
//     const sections = await SectionModel.find({ testCreationTableId, subjectId });
//     res.json(sections);
//   } catch (error) {
//     console.error("Error fetching sections:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get(
  "/test-sections/:testCreationTableId/:subjectId",
  async (req, res) => {
    const { testCreationTableId, subjectId } = req.params;

    try {
      const [rows] = await db.query(
        `
    SELECT * FROM sections WHERE testCreationTableId = ? AND subjectId =?
    `,
        [testCreationTableId, subjectId]
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// router.put('/activate/:testCreationTableId', async (req, res) => {
//   const { testCreationTableId } = req.params;

//   try {
//     // Check if the test is already activated or deactivated
//     const [rows] = await db.query('SELECT tt.*, COUNT(q.question_id) AS question_count FROM test_creation_table AS tt JOIN questions AS q ON q.testCreationTableId = tt.testCreationTableId WHERE tt.testCreationTableId = 21 GROUP BY tt.testCreationTableId;', [testCreationTableId]);
//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Test not found' });
//     }

//     const currentStatus = rows[0].status;

//     // Update the status based on the current status
//     let newStatus;
//     if (currentStatus === 'active') {
//       newStatus = 'inactive';
//     } else {
//       newStatus = 'active';
//     }

//     // Update the status in the database
//     await db.query('UPDATE test_creation_table SET status = ? WHERE testCreationTableId = ?', [newStatus, testCreationTableId]);

//     // Send response with the updated status
//     res.json({ status: newStatus });
//   } catch (error) {
//     console.error('Error toggling test status:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.put("/activate/:testCreationTableId", async (req, res) => {
  const { testCreationTableId } = req.params;

  try {
    // Retrieve the test details along with the question count
    const [rows] = await db.query(
      `SELECT tt.*, COUNT(q.question_id) AS question_count 
    FROM test_creation_table AS tt 
    LEFT JOIN questions AS q ON q.testCreationTableId = tt.testCreationTableId 
    WHERE tt.testCreationTableId = ? 
    GROUP BY tt.testCreationTableId`,
      [testCreationTableId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Test not found" });
    }

    const { status, TotalQuestions } = rows[0];
    const questionCount = rows[0].question_count;

    // Check if the test is already activated or deactivated
    let newStatus;
    if (status === "active") {
      newStatus = "inactive";
    } else {
      newStatus = TotalQuestions === questionCount ? "active" : "inactive";
    }

    // Update the status in the database
    await db.query(
      "UPDATE test_creation_table SET status = ? WHERE testCreationTableId = ?",
      [newStatus, testCreationTableId]
    );

    // Send response with the updated status
    res.json({ status: newStatus });
  } catch (error) {
    console.error("Error toggling test status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get("/testformname_feaching", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT  TestForm_Id,TestForm_name FROM testform_types");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// for pg
// ========================To get the details of test created table ================================================
router.get("/testCoursesForPG", async (req, res) => {
  try {
    // const query = `SELECT courseCreationId,courseName FROM  course_creation_table WHERE  Portale_Id IN (1, 2)`;
    const  query=`SELECT * FROM course_creation_table as cct LEFT JOIN exams as e ON e.examId=cct.examId WHERE e.branchId=2;`
    const [rows] = await db.query(query);
    // Execute the query// Check if there are results
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for Portale_Id 1 or 2" });
    }
    res.json(rows);
    // Return the fetched rows as JSON
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Log the error for debugging
    res.status(500).json({
      error: "Internal Server Error",
    });

  }
});

router.get('/pgSubjects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pg_departments');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
