const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');

router.get("/BuyCourses_PQB", async (req, res) => {
    try {
      // Execute the query to fetch results
      const [results, fields] = await db.execute(
        `SELECT 
            e.examId, 
            e.examName, 
            cc.courseCreationId, 
            cc.courseName, 
            cc.courseStartDate, 
            cc.courseEndDate, 
            cc.totalPrice, 
            cc.cardImage,
            stp.Test_Pattern_Id,
            tp.Test_pattern_name,
            cd.CourseData_Id
          FROM exams e 
         LEFT JOIN course_creation_table cc ON cc.examId = e.examId
         LEFT JOIN course_data cd ON cc.courseCreationId = cd.courseCreationId
        LEFT  JOIN selected_test_pattern stp ON stp.courseCreationId = cc.courseCreationId
          JOIN test_pattern tp ON tp.Test_Pattern_Id = stp.Test_Pattern_Id
          WHERE tp.Test_Pattern_Id = 2`
      );
  
      // Map the results to the desired format
      const formattedResults = results.map((result) => {
        const base64 = result.cardImage
          ? result.cardImage.toString("base64")
          : null;
  
        return {
          CourseData_Id:result.CourseData_Id,  
          examId: result.examId,
          examName: result.examName,
          courseCreationId: result.courseCreationId,
          courseName: result.courseName,
          courseStartDate: result.courseStartDate,
          courseEndDate: result.courseEndDate,
          totalPrice: result.totalPrice,
          cardImage: base64 ? `data:image/png;base64,${base64}` : null,
        };
      });
  
      // Send the formatted results as a JSON response
      res.json(formattedResults);
  
    } catch (error) {
      // Handle errors and send an appropriate response
      console.error("Error fetching unPurchased courses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });        
  
  
module.exports = router;