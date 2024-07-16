const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });


router.get("/examsfor_courseCreation", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT  OVL_Exam_Id ,OVL_Exam_Name FROM ovl_exams");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/OVL_CourseData", async (req, res) => {
  try {
    const query = `
      SELECT
    cc.*,
    subjects.subjects AS subjects,
    e.OVL_Exam_Name
FROM
    ovl_course cc
LEFT JOIN (
    SELECT
        cs.OVL_Course_Id,
        GROUP_CONCAT(s.subjectName) AS subjects
    FROM
        ovl_course_selected_subjects cs
    LEFT JOIN subjects s ON
        cs.subjectId = s.subjectId
    GROUP BY
        cs.OVL_Course_Id
) AS subjects ON cc.OVL_Course_Id = subjects.OVL_Course_Id
JOIN ovl_exams AS e ON cc.OVL_Exam_Id = e.OVL_Exam_Id;
         `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/OVL_feaching_exams", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT OVL_Exam_Id,OVL_Exam_Name FROM ovl_exams");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/feaching_subject_acordingtoexam/:OVL_Exam_Id/subjects", async (req, res) => {
  const OVL_Exam_Id = req.params.OVL_Exam_Id;

  try {
    const query = `
          SELECT s.subjectId, s.subjectName
          FROM subjects AS s
          JOIN ovl_exam_selected_subjects AS ec ON s.subjectId = ec.subjectId
          WHERE ec.OVL_Exam_Id = ?
        `;
    const [rows] = await db.query(query, [OVL_Exam_Id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/OVL_coursecreation", upload.single('cardImage'), async (req, res) => {
  const {
    courseName,
    OVL_Exam_Id,
    courseStartDate,
    courseEndDate,
    cost,
    discount,
    totalPrice,
  } = req.body;

  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Insert the course data into the ovl_course table
    const [result] = await db.query(
      "INSERT INTO ovl_course (OVL_Course_Name, OVL_Exam_Id, OVL_Course_Startdate, OVL_Course_Enddate, OVL_Course_Cost, OVL_Course_Discount, OVL_Course_Totalprice, OVL_cardImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        courseName,
        OVL_Exam_Id,
        courseStartDate,
        courseEndDate,
        cost,
        discount,
        totalPrice,
        req.file.buffer,
      ]
    );

    // Check if the course creation was successful
    if (result && result.insertId) {
      const OVL_Course_Id = result.insertId;

      await db.query(
        "INSERT INTO course_data (OVL_Course_Id, Portal) VALUES (?, ?)",
        [OVL_Course_Id, 'OVL']
      );
      return res.json({ message: "Course created successfully", OVL_Course_Id });
    }
    // If the course creation was not successful, return an error
    return res.status(500).json({ error: "Course creation failed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/OVL_course_subjects", async (req, res) => {
  try {
    // Extract data from the request body
    const { OVL_Course_Id, subjectIds } =
      req.body;
    // console.log('Received request to add subjects and question types for OVL_Course_Id:', OVL_Course_Id);

    console.log("Received data:", req.body);


    // Insert subjects into the course_subjects table
    console.log("Received data:", req.body);
    for (const subjectId of subjectIds) {
      const query =
        "INSERT INTO ovl_course_selected_subjects (OVL_Course_Id, subjectId) VALUES (?, ?)";
      const values = [OVL_Course_Id, subjectId];
      console.log("Executing query:", db.format(query, values));
      await db.query(query, values);
    }


    // Respond with success message
    res.json({
      success: true,
      message: "Subjects and question types added successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.delete(
  "/OVL_Delete_CourseData/:OVL_Course_Id",
  async (req, res) => {
    const OVL_Course_Id = req.params.OVL_Course_Id;

    try {
      await db.query(
        `DELETE ovl_course, ovl_course_selected_subjects,course_data
        FROM ovl_course
        LEFT JOIN ovl_course_selected_subjects ON ovl_course.OVL_Course_Id = ovl_course_selected_subjects.OVL_Course_Id
        LEFT JOIN course_data ON ovl_course.OVL_Course_Id = course_data.OVL_Course_Id
        WHERE ovl_course.OVL_Course_Id = ?;
        `,
        [OVL_Course_Id]
      );

      res.json({
        message: `course with ID ${OVL_Course_Id} deleted from the database`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);




router.get("/OVL_coursedata_for_update/:OVL_Course_Id", async (req, res) => {
  const OVL_Course_Id = req.params.OVL_Course_Id;

  try {
    const query = `
      SELECT
        cc.*,
        subjects.subjects AS subjects,
        e.OVL_Exam_Name
      FROM
        ovl_course cc
      LEFT JOIN (
        SELECT 
          cs.OVL_Course_Id,
          GROUP_CONCAT(s.subjectName) AS subjects
        FROM
          ovl_course_selected_subjects cs
        LEFT JOIN subjects s ON
          cs.subjectId = s.subjectId
        GROUP BY
          cs.OVL_Course_Id
      ) AS subjects ON cc.OVL_Course_Id = subjects.OVL_Course_Id
      JOIN ovl_exams AS e ON cc.OVL_Exam_Id = e.OVL_Exam_Id
      WHERE
        cc.OVL_Course_Id = ?;
    `;

    const [course] = await db.query(query, [OVL_Course_Id]);

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/OVL_examdataforupdate", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT  OVL_Exam_Id,OVL_Exam_Name FROM ovl_exams");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/OVL_course_subjects/:OVL_Course_Id", async (req, res) => {
  const OVL_Course_Id = req.params.OVL_Course_Id;

  try {
    // Query the database to get selected subjects for the specified OVL_Course_Id
    const query = `
          SELECT cs.subjectId
          FROM ovl_course_selected_subjects AS cs
          WHERE cs.OVL_Course_Id = ?
        `;
    const [rows] = await db.query(query, [OVL_Course_Id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/update-course/:OVL_Course_Id", async (req, res) => {
  const OVL_Course_Id = req.params.OVL_Course_Id;

  const {
    courseName,
    selectedExam,
    courseStartDate,
    courseEndDate,
    cost,
    discount,
    totalPrice,
    selectedSubjects,
  } = req.body;

  const updateQuery = `
    UPDATE ovl_course
    SET
    OVL_Course_Name = ?,
    OVL_Exam_Id = ?,
      OVL_Course_Startdate = ?,
      OVL_Course_Enddate = ?,
      OVL_Course_Cost = ?,
      OVL_Course_Discount = ?,       
      OVL_Course_Totalprice = ?
    WHERE OVL_Course_Id = ?;
  `;

  try {
    await db.query(updateQuery, [
      courseName,
      selectedExam,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      OVL_Course_Id,
    ]);
    // Handle subjects update (assuming course_subjects table has columns OVL_Course_Id and subjectId)
    const deleteSubjectsQuery =
      "DELETE FROM ovl_course_selected_subjects WHERE OVL_Course_Id = ?";
    await db.query(deleteSubjectsQuery, [OVL_Course_Id]);

    const insertSubjectsQuery =
      "INSERT INTO ovl_course_selected_subjects (OVL_Course_Id, subjectId) VALUES (?, ?)";
    for (const subjectId of selectedSubjects) {
      await db.query(insertSubjectsQuery, [OVL_Course_Id, subjectId]);
    }

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;