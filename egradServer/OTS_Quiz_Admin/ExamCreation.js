const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');


router.get('/subjects', async (req, res) => {
    // Fetch subjects
    try {
      const [rows] = await db.query('SELECT * FROM subjects');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/branches', async (req, res) => {
    // Fetch branches
    try {
      const [rows] = await db.query('SELECT * FROM branches');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Endpoint to fetch exams based on Branch_Id
router.get('/branchesexams', async (req, res) => {
  const { Branch_Id } = req.query;

  try {
    const [rows] = await db.query('SELECT * FROM coursesportalexams WHERE Branch_Id = ?', [Branch_Id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to fetch subjects based on coursesPortalExamsId
router.get('/branchesexamssubjects', async (req, res) => {
  const { coursesPortalExamsId } = req.query;

  try {
    const [rows] = await db.query('SELECT * FROM subjects WHERE coursesPortalExamsId = ?', [coursesPortalExamsId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/create', async (req, res) => {
  const { Branch_Id, coursesPortalExamsId, startDate, endDate, selectedSubjects } = req.body;

  try {
    // Insert into exams table
    const [result] = await db.query(
      'INSERT INTO exams (Branch_Id, coursesPortalExamsId, startDate, endDate) VALUES (?, ?, ?, ?)',
      [Branch_Id, coursesPortalExamsId, startDate, endDate]
    );
    const examId = result.insertId;

    // Insert into exam_creation_table one by one
    for (const subjectId of selectedSubjects) {
      await db.query('INSERT INTO exam_creation_table (subjectId, examId) VALUES (?, ?)', [subjectId, examId]);
    }

    res.status(200).json({ message: 'Exam created successfully!' });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Error creating exam', error });
  }
});

  router.get('/feachingexams/:examId', async (req, res) => {
    const { examId } = req.params;
    try {
      // Fetch exams from the database
      const [rows] = await db.query('SELECT * FROM exams WHERE examId = ?', [examId]);
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/exams/:examId/subjects', async (req, res) => {
    const { examId } = req.params;
  
    try {
      console.log('Fetching subjects for examId:', examId);
  
      const [rows] = await db.query(
        'SELECT subjectId FROM exam_creation_table WHERE examId = ?',
        [examId]
      );
  
      const selectedSubjects = rows.map(row => row.subjectId);
      console.log('Selected subjects:', selectedSubjects);
  
      res.json(selectedSubjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.put('/update/:examId', async (req, res) => {
    const { examId } = req.params;
    const { examName, startDate, endDate, subjects } = req.body;
  
    try {
      // Update data in the exams table
      await db.query('UPDATE exams SET examName = ?, startDate = ?, endDate = ? WHERE examId = ?', [examName, startDate, endDate, examId]);
  
      // Update subjects in the exam_creation_table
      // 1. Delete existing subjects that are not in the updated list
      await db.query('DELETE FROM exam_creation_table WHERE examId = ? AND subjectId NOT IN (?)', [examId, subjects]);
  
      // 2. Insert new subjects that are not already in the table
      const existingSubjects = await db.query('SELECT subjectId FROM exam_creation_table WHERE examId = ?', [examId]);
      const existingSubjectIds = existingSubjects[0].map(row => row.subjectId);
  
      const newSubjects = subjects.filter(subjectId => !existingSubjectIds.includes(subjectId));
  
      const subjectInsertPromises = newSubjects.map(subjectId =>
        db.query('INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)', [examId, subjectId])
      );
  
      await Promise.all(subjectInsertPromises);
  
      res.json({ success: true, message: 'Exam data updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  //--------------------------------------------END--------------------------------------------------
  //---------------------------------------------inserting exam creation page data-------------------------------------------------
  
  router.post('/exams', async (req, res) => {
    // Create exams
    const { examName, startDate, endDate, selectedSubjects } = req.body;
  
    try {
      const [examResult] = await db.query(
        'INSERT INTO exams (examName, startDate, endDate) VALUES (?, ?, ?)',
        [examName, startDate, endDate]
      );
  
      const insertedExamId = examResult.insertId;
      for (const subjectId of selectedSubjects) {
        await db.query(
          'INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)',
          [insertedExamId, subjectId]
        );
      }
      res.json({ message: 'Exam created successfully', examId: insertedExamId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
    //--------------------------------------------END--------------------------------------------------
    //--------------------------------------------desplaying only selected subjects in table in ecam creation page --------------------------------------------------
   
  router.get('/exams-with-subjects', async (req, res) => {
    // Display selected subjects in table
    try {
      const query = `
        SELECT e.examId, cpe.coursesPortalExamname, e.startDate, e.endDate, GROUP_CONCAT(s.subjectName) AS subjects
        FROM exams AS e
        JOIN exam_creation_table AS ec ON e.examId = ec.examId
        JOIN subjects AS s ON ec.subjectId = s.subjectId
        JOIN coursesportalexams AS cpe ON cpe.coursesPortalExamsId=e.coursesPortalExamsId
        GROUP BY e.examId;
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
    //--------------------------------------------END--------------------------------------------------
    //--------------------------------------------Deleting exams from table(dalete button) --------------------------------------------------
    router.delete('/exams/:examId', async (req, res) => {
      const examId = req.params.examId;
    
      try {
        await db.query('DELETE FROM exams WHERE examId = ?', [examId]);
        // You might also want to delete related data in other tables (e.g., exam_creation) if necessary.
    
        res.json({ message: `Exam with ID ${examId} deleted from the database` });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  
    //--------------------------------------------END--------------------------------------------------
  
    //-------------------------------------------insertion/Deleting subjects in table --------------------------------------------------
    router.put('/exams/:examId/subjects', async (req, res) => {
      const { examId } = req.params;
      const { subjects } = req.body;
    
      try {
        // First, you can delete the existing subjects associated with the exam.
        await db.query('DELETE FROM exam_creation_table WHERE examId = ?', [examId]);
    
        // Then, insert the updated subjects into the exam_creation_table.
        for (const subjectId of subjects) {
          await db.query(
            'INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)',
            [examId, subjectId]
          );
        }
    
        res.json({ message: 'Subjects updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  //--------------------------------------------END--------------------------------------------------
  
  //--------------------------------------------updationg exam--------------------------------------------------
    router.get('/update/:examId', async (req, res) => {
      const query = 'SELECT * FROM exams WHERE examId = ?';
      const examId = req.params.examId;
      try {
        const [result] = await db.query(query, [examId]);
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    //--------------------------------------------END--------------------------------------------------
    //--------------------------------------------updation subjects--------------------------------------------------
  router.put('/updatedata/:examId', async (req, res) => {
    const updateExamQuery = "UPDATE exams SET examName=?, startDate=?, endDate=? WHERE examId=?";
    const updateSubjectsQuery = "UPDATE exam_creation_table SET subjectId=? WHERE examId=?";
  
    const examId = req.params.examId;
    const { examName, startDate, endDate, subjects } = req.body;
  
    try {
      // Update exam details
      await db.query(updateExamQuery, [examName, startDate, endDate, examId]);
  
      // Check if subjects is an array before updating
      if (Array.isArray(subjects)) {
        // Update subjects
        await Promise.all(subjects.map(subjectId => db.query(updateSubjectsQuery, [subjectId, examId])));
      }
  
      res.json({ updated: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  //--------------------------------------------END--------------------------------------------------
  //--------------------------------------------geting only selected subjects in edit page--------------------------------------------------
  // router.get('/exams/:examId/subjects', async (req, res) => {
  //     const examId = req.params.examId;
    
  //     try {
  //       const [rows] = await db.query('SELECT subjectId FROM exam_creation_table WHERE examId = ?', [examId]);
  //       const selectedSubjects = rows.map(row => row.subjectId);
  //       res.json(selectedSubjects);
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ error: 'Internal Server Error' });
  //     }
  //   });
  //--------------------------------------------END--------------------------------------------------
  //--------------------------------------------updating subjects--------------------------------------------------
    router.put('/exams/:examId/subjects', async (req, res) => {
      const { examId } = req.params;
      const { subjects } = req.body;
    
      try {
        // First, delete the existing subjects associated with the exam.
        await db.query('DELETE FROM exam_creation_table WHERE examId = ?', [examId]);
    
        // Then, insert the updated subjects into the exam_creation_table.
        for (const subjectId of subjects) {
          await db.query(
            'INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)',
            [examId, subjectId]
          );
        }
    
        res.json({ message: 'Subjects updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    //--------------------------------------------END--------------------------------------------------
  //_____________________Exam creation end__________________________
  router.put('/api/exams/update', async (req, res) => {
    const { examId, examName, startDate, endDate,  selectedSubjects } = req.body;
  
    if (!examId || !examName || !startDate || !endDate || !Array.isArray(selectedSubjects)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    try {
      await pool.query(
        `UPDATE exams 
         SET examName = $1, startDate = $2, endDate = $3, branchId = $4 
         WHERE examId = $5`,
        [examName, startDate, endDate,examId]
      );
  
      // Delete existing subjects for this exam
      await pool.query('DELETE FROM subjects WHERE examId = $1', [examId]);
  
      // Insert new subjects
      if (selectedSubjects.length > 0) {
        const subjectValues = selectedSubjects.map(subjectId => `(${examId}, ${subjectId})`).join(',');
        await pool.query(
          `INSERT INTO subjects (examId, subjectId) 
           VALUES ${subjectValues}`
        );
      }
  
      // Fetch updated exam details with joins
      const result = await pool.query(
        `SELECT e.examId, e.startDate, e.endDate, e.branchId, 
                b.branchName, 
                array_agg(s.subjectName) as subjects
         FROM exams e
         JOIN branches b ON e.branchId = b.branchId
         LEFT JOIN subjects es ON e.examId = es.examId
         LEFT JOIN subjects s ON es.subjectId = s.subjectId
         WHERE e.examId = $1
         GROUP BY e.examId, b.branchName`,
        [examId]
      );
  
      // Commit transaction
      await pool.query('COMMIT');
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      // Rollback transaction on error
      await pool.query('ROLLBACK');
      console.error('Error updating exam:', error);
      res.status(500).json({ error: 'Failed to update exam' });
    }
  });



  router.get('/ExamCreation/feachingexams/:examId', async (req, res) => {
    const { examId } = req.params;
    
    try {
      const [rows] = await db.query(
        `SELECT cpe.coursesPortalExamname, e.examId 
         FROM exams AS e 
         LEFT JOIN coursesportalexams AS cpe 
         ON cpe.coursesPortalExamsId = e.coursesPortalExamsId 
         WHERE e.examId = ?;`,
        [examId]
      );
  
      res.json(rows);
    } catch (error) {
      console.error("Error fetching exams:", error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // router.put('/exam_updation/update_exams/:examId'),async(req,res)=>{
  //   const {examId}=req.params;
  //   try{

  //   }
  // }



module.exports = router;