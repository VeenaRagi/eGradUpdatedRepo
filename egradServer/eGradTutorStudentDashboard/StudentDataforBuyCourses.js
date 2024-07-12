const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");

router.get("/getotsregistrationdata/:courseCreationId/:decryptedUserIdState ", (req, res) => {
    const { courseCreationId, decryptedUserIdState  } = req.params;
    console.log(
      `Received courseCreationId: ${courseCreationId}, userId: ${decryptedUserIdState }`
    );
  
    // Execute the SQL query to fetch data from the otsstudentregistation table
    db.query(
      `SELECT o.*
       FROM log l
       JOIN otsstudentregistation o ON l.email = o.emailId
       WHERE l.user_Id = ?`,
      [decryptedUserIdState ],
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          res.status(500).json({ message: "Internal server error" });
        } else {
          if (results.length > 0) {
            console.log("Data found:", results);
            res.status(200).json({ message: "Data found", data: results });
          } else {
            console.log("Data not found");
            res.status(404).json({ message: "Data not found" });
          }
        }
      }
    );
  });
  

  router.post(
    "/insertthedatainstbtable/:courseCreationId/:v",
    async (req, res) => {
      const { decryptedUserIdState , courseCreationId } = req.params;
      console.log(
        `Received user_Id: ${decryptedUserIdState}, courseCreationId: ${courseCreationId}`
      );
  
      try {
        // Get studentregistationId from log table
        const [logData] = await db.query(
          `SELECT studentregistationId FROM log WHERE user_Id = ?`,
          [decryptedUserIdState ]
        );
  
        if (logData.length === 0) {
          console.log("StudentregistationId not found for user_Id:", decryptedUserIdState );
          res.status(404).json({ message: "StudentregistationId not found" });
          return;
        }
  
        const studentregistationId = logData[0].studentregistationId;
  
        // Check if data already exists in student_buy_courses table for the given courseCreationId
        const [existingData] = await db.query(
          `SELECT * FROM student_buy_courses WHERE courseCreationId = ?`,
          [courseCreationId]
        );
  
        if (existingData.length === 0) {
          // No data found, insert the data
          await db.query(
            `INSERT INTO student_buy_courses (user_Id, studentregistationId, courseCreationId) VALUES (?, ?, ?)`,
            [decryptedUserIdState , studentregistationId, courseCreationId]
          );
  
          console.log("Data inserted successfully");
          res.status(200).json({ message: "Data inserted successfully" });
        } else {
          // Data already exists, do not insert
          console.log(
            "Data already exists for courseCreationId:",
            courseCreationId
          );
          res
            .status(409)
            .json({ message: "Data already exists for courseCreationId" });
        }
      } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

module.exports = router;
