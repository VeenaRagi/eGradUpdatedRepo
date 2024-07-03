const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

  // Update Entrance Exam
  router.put('/updateentrance_exam/:EntranceExams_Id', async (req, res) => {
    const { EntranceExams_Id } = req.params;
    const { EntranceExams_name } = req.body;
  
    try {
      const [result] = await db.query(
        'UPDATE entrance_exams SET EntranceExams_name = ? WHERE EntranceExams_Id = ?',
        [EntranceExams_name, EntranceExams_Id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Entrance Exam not found' });
      }
  
      res.json({ message: 'Entrance Exam updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete Entrance Exam
router.delete('/entrance_exam/:EntranceExams_Id', async (req, res) => {
    const { EntranceExams_Id } = req.params;
  
    try {
      const [result] = await db.query(
        'DELETE FROM entrance_exams WHERE EntranceExams_Id = ?',
        [EntranceExams_Id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Entrance Exam not found' });
      }
  
      res.json({ message: 'Entrance Exam deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/feachingentrance_exams/:Branch_Id', async (req, res) => {
    const { Branch_Id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM entrance_exams WHERE Branch_Id = ?', [Branch_Id]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




  const multer = require('multer');
  const upload = multer(); // Configure multer without any options to handle multipart/form-data
  
  router.post('/uploadExamImage', upload.single('Exam_Image'), async (req, res) => {
    try {
      const { Branch_Id } = req.body;
      const Exam_Image = req.file; // Use req.file to access the uploaded file
  
      // Ensure both Branch_Id and Exam_Image are provided
      if (!Branch_Id || !Exam_Image) {
        return res.status(400).json({ error: true, message: 'Please provide Branch_Id and Exam_Image' });
      }
  
      // Insert the new exam image into the database
      const [result] = await db.query('INSERT INTO ug_exams_images (Branch_Id, Exam_Image) VALUES (?, ?)', [Branch_Id, Exam_Image.buffer]);
      res.json({ id: result.insertId, message: 'Exam image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading exam image:', error);
      res.status(500).json({ error: true, message: 'Failed to upload exam image' });
    }
  });


  router.put('/updateExamImage/:Image_Id', upload.single('Exam_Image'), async (req, res) => {
    try {
      const { Image_Id } = req.params;
      const Exam_Image = req.file; // Use req.file to access the uploaded file
  
      // Ensure Image_Id and Exam_Image are provided
      if (!Image_Id || !Exam_Image) {
        return res.status(400).json({ error: true, message: 'Please provide Image_Id and Exam_Image' });
      }
  
      // Update the exam image in the database
      const [result] = await db.query(
        'UPDATE ug_exams_images SET Exam_Image = ? WHERE Image_Id = ?',
        [Exam_Image.buffer, Image_Id]
      );
  
      // Check if any row was updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: true, message: 'No image found with the given Image_Id' });
      }
  
      res.json({ message: 'Exam image updated successfully' });
    } catch (error) {
      console.error('Error updating exam image:', error);
      res.status(500).json({ error: true, message: 'Failed to update exam image' });
    }
  });



module.exports = router;