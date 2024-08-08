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
  
  // router.get('/exams/:examId/subjects', async (req, res) => {
  //   const { examId } = req.params;
  
  //   try {
  //     console.log('Fetching subjects for examId:', examId);
  
  //     const [rows] = await db.query(
  //       'SELECT subjectId FROM exam_creation_table WHERE examId = ?',
  //       [examId]
  //     );
  
  //     const selectedSubjects = rows.map(row => row.subjectId);
  //     console.log('Selected subjects:', selectedSubjects);
  
  //     res.json(selectedSubjects);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  
  
  // router.put('/update/:examId', async (req, res) => {
  //   const { examId } = req.params;
  //   const { examName, startDate, endDate, subjects } = req.body;
  
  //   try {
  //     // Update data in the exams table
  //     await db.query('UPDATE exams SET examName = ?, startDate = ?, endDate = ? WHERE examId = ?', [examName, startDate, endDate, examId]);
  
  //     // Update subjects in the exam_creation_table
  //     // 1. Delete existing subjects that are not in the updated list
  //     await db.query('DELETE FROM exam_creation_table WHERE examId = ? AND subjectId NOT IN (?)', [examId, subjects]);
  
  //     // 2. Insert new subjects that are not already in the table
  //     const existingSubjects = await db.query('SELECT subjectId FROM exam_creation_table WHERE examId = ?', [examId]);
  //     const existingSubjectIds = existingSubjects[0].map(row => row.subjectId);
  
  //     const newSubjects = subjects.filter(subjectId => !existingSubjectIds.includes(subjectId));
  
  //     const subjectInsertPromises = newSubjects.map(subjectId =>
  //       db.query('INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)', [examId, subjectId])
  //     );
  
  //     await Promise.all(subjectInsertPromises);
  
  //     res.json({ success: true, message: 'Exam data updated successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  
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

// ################################################################################################################################################//
  
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



  router.get('/exams/:examId/subjects', async (req, res) => {
    const { examId } = req.params;
    
    try {
      const query = `
       SELECT s.*, 
       CASE 
         WHEN ec.subjectId IS NOT NULL THEN 1
         ELSE 0
       END AS isSelected
FROM subjects AS s
LEFT JOIN exam_creation_table AS ec 
  ON s.subjectId = ec.subjectId AND ec.examId = ?

      `;
      
      const [rows] = await db.query(query, [examId]);
      
      res.json(rows);
    } catch (error) {
      console.error('Error fetching subjects for exam:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
// Endpoint to get unselected subjects for a specific exam
router.get('/ExamCreation/exams/;examId/unselected-subjects', async (req, res) => {
  const { examId } = req.params;

  try {
    // Query to get all subjects that are not selected for the specific exam
    const query = `
      SELECT s.subjectId, s.subjectName
      FROM subjects AS s
      LEFT JOIN exam_creation_table AS ec
        ON s.subjectId = ec.subjectId AND ec.examId = ?
      WHERE ec.examId IS NULL
    `;
    const [rows] = await db.query(query, [examId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching unselected subjects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/update/:examId', async (req, res) => {
  const { examId } = req.params;
  const { startDate, endDate, BranchId, selectedSubjects } = req.body;

  try {
    // Update exam details
    await db.query(
      'UPDATE exams SET startDate = ?, endDate = ?, Branch_Id = ? WHERE examId = ?',
      [startDate, endDate, BranchId, examId]
    );

    // Delete existing subjects for the exam
    await db.query(
      'DELETE FROM exam_creation_table WHERE examId = ?',
      [examId]
    );
    

    // Insert new subjects for the exam
    const subjectValues = selectedSubjects.map(subjectId => [subjectId, examId]);

    // Insert new subjects for the exam
    if (subjectValues.length > 0) {
      await db.query(
        'INSERT INTO exam_creation_table (subjectId, examId) VALUES ?',
        [subjectValues]
      );
    }

    // Commit transaction
    await db.query('COMMIT');
    res.send('Exam updated successfully');
  } catch (err) {
    // Rollback transaction on error
    await db.query('ROLLBACK');
    console.error('Error updating exam:', err);
    res.status(500).send('Server error');
  
  }
});


module.exports = router;