const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.get('/branches', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT b.Branch_Id, b.Branch_Name, ee.EntranceExams_Id, ee.EntranceExams_name 
        FROM branches AS b 
        JOIN entrance_exams AS ee ON ee.Branch_Id = b.Branch_Id
      `);
  
      // Organize the data
      const branches = rows.reduce((acc, row) => {
        const { Branch_Id, Branch_Name, EntranceExams_Id, EntranceExams_name } = row;
        
        if (!acc[Branch_Id]) {
          acc[Branch_Id] = {
            Branch_Id,
            Branch_Name,
            EntranceExams: []
          };
        }
  
        acc[Branch_Id].EntranceExams.push({
          EntranceExams_Id,
          EntranceExams_name
        });
  
        return acc;
      }, {});
  
      res.json(Object.values(branches));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
  router.get('/getExamImages', async (req, res) => {
    try {
      // Query database to fetch all exam images
      const [rows] = await db.query('SELECT * FROM ug_exams_images LIMIT 1');
  
      // Check if rows are present
      if (rows.length > 0) {
        const images = rows.map(row => {
          // Convert row to an object and set Exam_Image to base64 string if it exists
          const image = { ...row };
          if (row.Exam_Image) {
            image.Exam_Image = row.Exam_Image.toString('base64');
          } else {
            image.Exam_Image = null;
          }
          return image;
        });
  
        res.json({ examImages: images });
      } else {
        res.status(404).json({ message: 'No images found' });
      }
    } catch (error) {
      console.error('Error fetching exam images:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch exam images' });
    }
  });


  

module.exports = router;