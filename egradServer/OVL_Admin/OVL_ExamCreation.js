const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');


router.post('/OVL_Insert_exams', async (req, res) => {
    // Create exams
    const { examName, startDate, endDate, selectedSubjects } = req.body;
  
    try {
      const [examResult] = await db.query(
        'INSERT INTO ovl_exams (OVL_Exam_Name,OVL_Exam_Startdate,OVL_exam_Enddate) VALUES (?, ?, ?)',
        [examName, startDate, endDate]
      );
  
      const insertedExamId = examResult.insertId;
      for (const subjectId of selectedSubjects) {
        await db.query(
          'INSERT INTO OVL_Exam_selected_Subjects (OVL_Exam_Id, subjectId) VALUES (?, ?)',
          [insertedExamId, subjectId]
        );
      }
      res.json({ message: 'Exam created successfully', OVL_Exam_Id: insertedExamId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/OVL_exams-with-subjects', async (req, res) => {
    // Display selected subjects in table
    try {
      const query = `
        SELECT e.OVL_Exam_Id, e.OVL_Exam_Name, e.OVL_Exam_Startdate, e.OVL_exam_Enddate, GROUP_CONCAT(s.subjectName) AS subjects
        FROM ovl_exams AS e
        JOIN ovl_exam_selected_subjects AS ec ON e.OVL_Exam_Id = ec.OVL_Exam_Id
        JOIN subjects AS s ON ec.subjectId = s.subjectId
        GROUP BY e.OVL_Exam_Id
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.delete('/OVl_Delet_exams/:OVL_Exam_Id', async (req, res) => {
    const OVL_Exam_Id = req.params.OVL_Exam_Id;
  
    try {
      await db.query(`DELETE ovl_exams, ovl_exam_selected_subjects
      FROM ovl_exams
      JOIN ovl_exam_selected_subjects ON ovl_exams.OVL_Exam_Id = ovl_exam_selected_subjects.OVL_Exam_Id
      WHERE ovl_exams.OVL_Exam_Id = ?;
      `, [OVL_Exam_Id]);
      // You might also want to delete related data in other tables (e.g., exam_creation) if necessary.
  
      res.json({ message: `Exam with ID ${OVL_Exam_Id} deleted from the database` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  router.put('/OVL_Update_ExamSubjects/:OVL_Exam_Id/subjects', async (req, res) => {
    const { OVL_Exam_Id } = req.params;
    const { subjects } = req.body;
  
    try {
      // First, you can delete the existing subjects associated with the exam.
      await db.query('DELETE FROM ovl_exam_selected_subjects WHERE OVL_Exam_Id = ?', [OVL_Exam_Id]);
  
      // Then, insert the updated subjects into the ovl_exam_selected_subjects.
      for (const subjectId of subjects) {
        await db.query(
          'INSERT INTO ovl_exam_selected_subjects (OVL_Exam_Id, subjectId) VALUES (?, ?)',
          [OVL_Exam_Id, subjectId]
        );
      }
  
      res.json({ message: 'Subjects updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


 
  router.get('/OVL_Update_ExamSubjects/:OVL_Exam_Id/subjects', async (req, res) => {
    const { OVL_Exam_Id } = req.params;
  
    try {
      console.log('Fetching subjects for OVL_Exam_Id:', OVL_Exam_Id);
  
      const [rows] = await db.query(
        'SELECT subjectId FROM ovl_exam_selected_subjects WHERE OVL_Exam_Id = ?',
        [OVL_Exam_Id]
      );
  
      const selectedSubjects = rows.map(row => row.subjectId);
      console.log('Selected subjects:', selectedSubjects);
  
      res.json(selectedSubjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/OVL_feachingexams/:OVL_Exam_Id', async (req, res) => {
    const { OVL_Exam_Id } = req.params;
    try {
      // Fetch exams from the database
      const [rows] = await db.query('SELECT * FROM ovl_exams WHERE OVL_Exam_Id = ?', [OVL_Exam_Id]);
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.put('/OVL_update_exam/:OVL_Exam_Id', async (req, res) => {
    const { OVL_Exam_Id } = req.params;
    const { examName, startDate, endDate, subjects } = req.body;
  
    try {
      // Update data in the exams table
      await db.query('UPDATE ovl_exams SET OVL_Exam_Name = ?, OVL_Exam_Startdate = ?, OVL_exam_Enddate = ? WHERE OVL_Exam_Id = ?', [examName, startDate, endDate, OVL_Exam_Id]);
  
      // Update subjects in the ovl_exam_selected_subjects
      // 1. Delete existing subjects that are not in the updated list
      await db.query('DELETE FROM ovl_exam_selected_subjects WHERE OVL_Exam_Id = ? AND subjectId NOT IN (?)', [OVL_Exam_Id, subjects]);
  
      // 2. Insert new subjects that are not already in the table
      const existingSubjects = await db.query('SELECT subjectId FROM ovl_exam_selected_subjects WHERE OVL_Exam_Id = ?', [OVL_Exam_Id]);
      const existingSubjectIds = existingSubjects[0].map(row => row.subjectId);
  
      const newSubjects = subjects.filter(subjectId => !existingSubjectIds.includes(subjectId));
  
      const subjectInsertPromises = newSubjects.map(subjectId =>
        db.query('INSERT INTO ovl_exam_selected_subjects (OVL_Exam_Id, subjectId) VALUES (?, ?)', [OVL_Exam_Id, subjectId])
      );
  
      await Promise.all(subjectInsertPromises);
  
      res.json({ success: true, message: 'Exam data updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;