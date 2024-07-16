const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');

router.get("/OVL_courses", async (req, res) => {
    try {
        const query = "SELECT OVL_Course_Name,OVL_Course_Id FROM ovl_course";
        const [results] = await db.query(query);
        console.log("Retrieved data from test table:");
        console.log(results);
        res.json(results);
    } catch (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).send("Error retrieving data from the database.");
    }
});

router.get("/OVL_courses", async (req, res) => {
    try {
        const query = "SELECT OVL_Course_Name FROM ovl_course WHERE OVL_Course_Id = ( SELECT Min(OVL_Course_Id)  FROM ovl_course  );";
        const [results] = await db.query(query);
        console.log("Retrieved data from test table:");
        console.log(results);
        res.json(results);
    } catch (error) {
        console.error("Error executing query: " + error.stack);
        res.status(500).send("Error retrieving data from database.");
    }
});

router.get("/OVL_examsug", async (req, res) => {
    try {
        const sql = "SELECT OVL_Exam_Name FROM ovl_exams WHERE OVL_Exam_Id = ( SELECT MIN(OVL_Exam_Id)  FROM ovl_exams  );";
        const [result] = await db.query(sql);
        res.json(result);
    } catch (error) {
        console.error("Error querying the database: " + error.message);
        res.status(500).json({ error: "Error fetching exams" });
    }
});




router.get("/examData", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT e.OVL_Exam_Name, e.OVL_Exam_Startdate, e.OVL_exam_Enddate, e.OVL_Exam_Id , ci.OVL_cardImage FROM ovl_exams AS e JOIN ovl_course AS ci ON e.OVL_Exam_Id =ci.OVL_Exam_Id ");
  
      if (rows.length === 0) {
        // If no data is found
        return res.status(404).json({ error: "No data found" });
      }
  
      // Loop through each row and convert cardimeage to base64
      rows.forEach((row) => {
        const base64CardImage = row.OVL_cardImage.toString("base64");
        row.OVL_cardImage = `data:image/png;base64,${base64CardImage}`;
      });
  
      // Return the response
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get('/courses/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT OVL_Exam_Id , COUNT(*) AS numberOfCourses FROM ovl_course GROUP BY OVL_Exam_Id ;'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching course count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get("/OVL_ExamCourses", async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        `SELECT e.OVL_Exam_Id , e.OVL_Exam_Name, cc.OVL_Course_Id , cc.OVL_Course_Name, cc.OVL_Course_Startdate, cc.OVL_Course_Enddate, cc.OVL_Course_Totalprice FROM ovl_exams e JOIN ovl_course cc ON e.OVL_Exam_Id  = cc.OVL_Exam_Id  `
      );
  
      // Map the results to the desired format
      const formattedResults = results.map((result) => {
        // Assuming cardImage is in base64 format
        // const base64 = result.cardImage
        //   ? result.cardImage.toString("base64")
        //   : null;
  
        return {
          OVL_Exam_Id : result.OVL_Exam_Id ,
          OVL_Exam_Name: result.OVL_Exam_Name,
          OVL_Course_Id : result.OVL_Course_Id ,
          OVL_Course_Name: result.OVL_Course_Name,
          OVL_Course_Startdate: result.OVL_Course_Startdate,
          OVL_Course_Enddate: result.OVL_Course_Enddate,
          OVL_Course_Totalprice: result.OVL_Course_Totalprice,
          // cardImage: base64 ? `data:image/png;base64,${base64}` : null,
        };
      });
  
      // Send the formatted results as a JSON response
      res.json(formattedResults);
    } catch (error) {
      console.error("Error fetching Exam Courses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });




  router.get("/unPurchasedCourses/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log("userId:", userId); // Log the userId to the console
  
    try {
      if (!userId) {
        throw new Error("userId is required");
      }
  
      const [results, fields] = await db.execute(
        `SELECT 
          e.OVL_Exam_Id , 
          e.OVL_Exam_Name, 
          cc.OVL_Course_Id , 
          cc.OVL_Course_Name, 
          cc.OVL_Course_Startdate, 
          cc.OVL_Course_Enddate, 
          cc.OVL_Course_Totalprice, 
          cc.OVL_cardImage,
          cd.CourseData_Id
        FROM 
          ovl_exams e 
          JOIN ovl_course cc ON e.OVL_Exam_Id  = cc.OVL_Exam_Id  
          JOIN course_data cd ON
      cd.OVL_Course_Id = cc.OVL_Course_Id
        WHERE 
          cc.OVL_Course_Id  NOT IN (
            SELECT 
              sb.OVL_Course_Id 
            FROM 
              student_buy_courses sb
            WHERE 
              sb.user_Id = ? 
              AND sb.payment_status = 1
          )
      `,
        [userId]
      );
  
      // Map the results to the desired format
      const formattedResults = results.map((result) => {
        // Assuming OVL_cardImage is in base64 format
        const base64 = result.OVL_cardImage
          ? result.OVL_cardImage.toString("base64")
          : null;
  
        return {
          OVL_Exam_Id : result.OVL_Exam_Id ,
          OVL_Exam_Name: result.OVL_Exam_Name,
          OVL_Course_Id : result.OVL_Course_Id ,
          OVL_Course_Name: result.OVL_Course_Name,
          OVL_Course_Startdate: result.OVL_Course_Startdate,
          OVL_Course_Enddate: result.OVL_Course_Enddate,
          OVL_Course_Totalprice: result.OVL_Course_Totalprice,
          OVL_cardImage: base64 ? `data:image/png;base64,${base64}` : null,
          CourseData_Id:result.CourseData_Id,
        };
      });
  
      res.json(formattedResults);
    } catch (error) {
      console.error("Error fetching unPurchased courses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.get("/purchasedCourses/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log("userId:", userId); // Log the userId to the console
  
    try {
      if (!userId) {
        throw new Error("userId is required");
      }
  
      const [results, fields] = await db.execute(
        `SELECT
        sb.user_Id,
        cc.OVL_Course_Id,
        cc.OVL_Course_Name,
        cc.OVL_Course_Startdate,
        cc.OVL_Course_Enddate,
        cc.OVL_Course_Totalprice,
        cc.OVL_Exam_Id,
        e.OVL_Exam_Name,
        cc.OVL_cardImage AS courseCardImage,
        cd.CourseData_Id
    FROM
        student_buy_courses sb
    JOIN course_data cd ON
        sb.CourseData_Id = cd.CourseData_Id
    JOIN ovl_course cc ON
        cc.OVL_Course_Id = cd.OVL_Course_Id
    JOIN ovl_exams e ON
        cc.OVL_Exam_Id = e.OVL_Exam_Id
    WHERE
        sb.user_Id = ? AND sb.payment_status = 1`, // Added condition for payment_status = 1
        [userId]
      );
  
      // Map the results to the desired format
      const formattedResults = results.map((result) => {
        // Assuming cardImage is in base64 format
        const base64 = result.courseCardImage
          ? result.courseCardImage.toString("base64")
          : null;
  
        return {
          OVL_Exam_Id : result.OVL_Exam_Id ,
          OVL_Exam_Name: result.OVL_Exam_Name,
          OVL_Course_Id : result.OVL_Course_Id ,
          OVL_Course_Name: result.OVL_Course_Name,
          OVL_Course_Startdate: result.OVL_Course_Startdate,
          OVL_Course_Enddate: result.OVL_Course_Enddate,
          OVL_Course_Totalprice: result.OVL_Course_Totalprice,
          courseCardImage: base64 ? `data:image/png;base64,${base64}` : null,
          CourseData_Id:result.CourseData_Id,
        };
      });
  
      // Log the formatted results to the console
      console.log("Formatted Results:", formattedResults);
      res.json(formattedResults);
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


module.exports = router;
