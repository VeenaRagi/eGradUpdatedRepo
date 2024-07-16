const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const db = require("../../DataBase/db2");
router.get("/getCourseTabNames", async (req, res) => {
  try {
    const [rows] = await db.query("select * from course_tab_titles");
    // console.log(rows);
    res.json(rows);
  } catch (error) {
    console.log(error, "error happened while fetching course tab names");
  }
});
// router.post(
//   "/courseTabFormData",
//   upload.single("courseTabImage"),
//   async (req, res) => {
//     const { coursePortaleId, courseTabId, courseTabDescription } = req.body;
//     console.log(
//       coursePortaleId,
//       courseTabId,
//       courseTabDescription,
//       "from the course tab form data which is first api "
//     );
//     const tabImage = req.file ? req.file.buffer : null;

//     try {
//       // Check if the entry already exists
//       const [existingEntries] = await db.query(
//         `SELECT * FROM course_tab_details WHERE course_portale_id = ? AND course_tab_title_id = ?`,
//         [coursePortaleId, courseTabId]
//       );

//       if (existingEntries.length > 0) {
//         // If entry exists, return the response and stop further execution
//         return res
//           .status(200)
//           .json({ msg: "Data already exists", exists: true });
//       } else {
//         // Entry does not exist, proceed with insertion
//         let response;
//         if (tabImage) {
//           response = await db.query(
//             "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text, course_tab_image) VALUES (?, ?, ?, ?)",
//             [coursePortaleId, courseTabId, courseTabDescription, tabImage]
//           );
//         } else {
//           response = await db.query(
//             "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text) VALUES (?, ?, ?)",
//             [coursePortaleId, courseTabId, courseTabDescription]
//           );
//         }
//         console.log(response);
//         res.status(200).json({ msg: "Sent successfully" });
//       }
//     } catch (error) {
//       console.log(
//         error,
//         "Error happened while inserting the data into course_tab_details content"
//       );
//       res.status(500).json({ msg: "Internal server error" });
//     }
//   }
// );

// router.post(
//   "/courseTabFormData",
//   upload.single("courseTabImage"),
//   async (req, res) => {
//     const { coursePortaleId, courseTabId, courseTabDescription } = req.body;
//     console.log(
//       coursePortaleId,
//       courseTabId,
//       courseTabDescription,
//       "from the course tab form data which is first API"
//     );
//     const tabImage = req.file ? req.file.buffer : null;

//     try {
//       // Check if the entry already exists
//       const [existingEntries] = await db.query(
//         `SELECT * FROM course_tab_details WHERE course_portale_id = ? AND course_tab_title_id = ?`,
//         [coursePortaleId, courseTabId]
//       );

//       if (existingEntries.length > 0) {
//         // If entry exists, return the response and stop further execution
//         return res
//           .status(200)
//           .json({ msg: "Data already exists", exists: true });
//       } else {
//         // Entry does not exist, proceed with insertion
//         let response;
//         if (tabImage) {
//           response = await db.query(
//             "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text, course_tab_image) VALUES (?, ?, ?, ?)",
//             [coursePortaleId, courseTabId, courseTabDescription, tabImage]
//           );
//         } else {
//           response = await db.query(
//             "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text) VALUES (?, ?, ?)",
//             [coursePortaleId, courseTabId, courseTabDescription]
//           );
//         }
//         console.log(response);
//         res.status(200).json({ msg: "Data inserted successfully" });
//       }
//     } catch (error) {
//       console.log(
//         error,
//         "Error happened while inserting the data into course_tab_details content"
//       );
//       res.status(500).json({ msg: "Internal server error" });
//     }
//   }
// );
// router.get('/getCourseTabImage',async(req,res)=>{
//   try {
//     const sql='select * from course_tab_images';
//     const [result]=await db.query(sql);
//     console.log(result)
//     res.json(result)
//   } catch (error) {
//     console.log(error ,"error happend")
//   }
// })
// router.get('/getCourseTabImage', async (req, res) => {
//   try {
//     // Define the SQL query to select all rows from course_tab_images
//     const sql = 'SELECT * FROM course_tab_images';

//     // Execute the SQL query
//     const [rows] = await db.query(sql);

//     // Log the result for debugging purposes
//     console.log(rows);

//     // Send the result as JSON
//     res.json(rows);
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error('Error fetching course tab images:', error);

//     // Send an error response
//     res.status(500).json({ error: 'An error occurred while retrieving data' });
//   }
// });
// router.get('/getCourseTabImage', async (req, res) => {
//   try {
//     // Define the SQL query to select all rows from course_tab_images
//     const sql = 'SELECT * FROM course_tab_images';
//     // Execute the SQL query
//     const [rows] = await db.query(sql);
//     // Convert each image to Base64 and update the rows
//     const base64Images = rows.map(row => {
//       if (row.image) {
//         // Convert buffer to base64 string
//         row.image = row.image.toString('base64');
//       }
//       return row;
//     });
//     // Log the result for debugging purposes
//     console.log(base64Images);
//     // Send the result as JSON
//     res.json(base64Images);
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error('Error fetching course tab images:', error);
//     // Send an error response
//     res.status(500).json({ error: 'An error occurred while retrieving data' });
//   }
// });
router.get("/getCourseTabImage", async (req, res) => {
  try {
    const sql = "SELECT * FROM course_tab_images";
    const [rows] = await db.query(sql);

    const base64Images = rows.map((row) => {
      if (row.course_tab_image) {
        // Convert buffer to base64 string
        row.course_tab_image = `data:image/jpeg;base64,${row.course_tab_image.toString(
          "base64"
        )}`;
      }
      return row;
    });

    console.log(base64Images);
    res.json(base64Images);
  } catch (error) {
    console.error("Error fetching course tab images:", error);
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
});

router.post(
  "/courseTabFormData",
  upload.single("courseTabImage"),
  async (req, res) => {
    let response;
    const tabImage = req.file ? req.file.buffer : null;
    const { coursePortaleId, courseTabId, courseTabDescription } = req.body;
    console.log(courseTabId, "this is the course tab id from the front end");
    if (tabImage) {
      // Check if an image already exists for the given courseTabId
      const [existingImage] = await db.query(
        "SELECT * FROM course_tab_images WHERE course_tab_title_id = ?",
        [courseTabId]
      );

      if (existingImage.length > 0) {
        // Update the existing record if found
        await db.query(
          "UPDATE course_tab_images SET course_tab_image = ? WHERE course_tab_title_id = ?",
          [tabImage, courseTabId]
        );
      } else {
        // Insert a new record if not found
        await db.query(
          "INSERT INTO course_tab_images (course_tab_title_id, course_tab_image) VALUES (?, ?)",
          [courseTabId, tabImage]
        );
      }
      response = await db.query(
        "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text) VALUES (?, ?, ?)",
        [coursePortaleId, courseTabId, courseTabDescription]
      );
    console.log(response, "This is the response ");
    } else {
      response = await db.query(
        "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text) VALUES (?, ?, ?)",
        [coursePortaleId, courseTabId, courseTabDescription]
      );
    }
    console.log(response, "This is the response ");
    res.status(200).json({ msg: "Data inserted successfully" });
  }
);

router.post(
  "/overwriteCourseTabData",
  upload.single("courseTabImage"),
  async (req, res) => {
    const { coursePortaleId, courseTabId, courseTabDescription } = req.body;
    console.log(
      coursePortaleId,
      courseTabId,
      courseTabDescription,
      "from over write api "
    );
    const tabImage = req.file ? req.file.buffer : null;
    try {
      // Delete existing entry with the same coursePortaleId and courseTabId
      await db.query(
        "DELETE FROM course_tab_details WHERE course_portale_id = ? AND course_tab_title_id = ?",
        [coursePortaleId, courseTabId]
      );
      //   if the image is given by the user
      if (tabImage) {
        // Insert the new entry
        await db.query(
          "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text, course_tab_image) VALUES (?, ?, ?, ?)",
          [coursePortaleId, courseTabId, courseTabDescription, tabImage]
        );
      }
      //   if the image is not given by the user
      else {
        response = await db.query(
          "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text) VALUES (?, ?, ?)",
          [coursePortaleId, courseTabId, courseTabDescription]
        );
        console.log("without the image in overwrite form ");
        res.join({ msg: "without the image" });
      }

      res.status(200).json({ msg: "overwritten successfully" });
    } catch (error) {
      console.log(
        error,
        "error happened while overwriting the data in course_tab_details content"
      );
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);
// router.put(
//   "/courseTabEditData",
//   upload.single("courseTabImage"),
//   async (req, res) => {
//     const { coursePortaleId, courseTabId, courseTabDescription } = req.body;
//     console.log(coursePortaleId, courseTabDescription, courseTabId);
//     const tabImage = req.file ? req.file.buffer : null;
//     try {
//       if (tabImage) {
//         // Update query with image
//         const [result] = await db.query(
//           `UPDATE course_tab_details
//                  SET course_tab_text = ?, course_tab_image = ?
//                  WHERE course_portale_id = ? AND course_tab_title_id = ?`,
//           [courseTabDescription, tabImage, coursePortaleId, courseTabId]
//         );
//         // res.json(result);
//       } else {
//         // Update query without image
//         const [result] = await db.query(
//           `UPDATE course_tab_details
//                  SET course_tab_text = ?
//                  WHERE course_portale_id = ? AND course_tab_title_id = ?`,
//           [courseTabDescription, coursePortaleId, courseTabId]
//         );
//         // res.json(result);
//       }
//       if (result.affectedRows > 0) {
//         res.status(200).json({ success: true, message: "Tab updated successfully" });
//       } else {
//         res.status(404).json({ success: false, message: "Tab not found" });
//       }
//     } catch (error) {
//       console.error("Error updating course tab details:", error);
//       res
//         .status(500)
//         .json({
//           error: "An error occurred while updating the course tab details",
//         });
//     }
//   }
// );

router.put(
  "/courseTabEditData",
  upload.single("courseTabImage"),
  async (req, res) => {
    const {
      coursePortaleId,
      courseTabId,
      courseTabDescription,
      courseTabUniqueId,
    } = req.body;
    console.log(
      coursePortaleId,
      courseTabDescription,
      courseTabId,
      courseTabUniqueId
    );
    const tabImage = req.file ? req.file.buffer : null;
    let result;

    try {
      if (tabImage) {
        // Update query with image
        [result] = await db.query(
          `INSERT INTO course_tab_images (course_tab_id, course_tab_images)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE course_tab_image = VALUES(course_tab_image)`,
          [courseTabId, tabImage]
        );
      } else {
        // Update query without image
        [result] = await db.query(
          `UPDATE course_tab_details
           SET course_tab_text = ?
           WHERE course_portale_id = ? AND course_tab_title_id = ? AND tab_id=?`,
          [
            courseTabDescription,
            coursePortaleId,
            courseTabId,
            courseTabUniqueId,
          ]
        );
      }

      if (result.affectedRows > 0) {
        res
          .status(200)
          .json({ success: true, message: "Tab updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Tab not found" });
      }
    } catch (error) {
      console.error("Error updating course tab details:", error);
      res.status(500).json({
        error: "An error occurred while updating the course tab details",
      });
    }
  }
);

router.get("/getCourseTabButtonDetails/:Portale_Id", async (req, res) => {
  const { Portale_Id } = req.params;
  console.log(Portale_Id, "portal id ");
  try {
    const [rows] = await db.query(
      "select * from course_tab_details c LEFT JOIN course_tab_titles ctt on c.course_tab_title_id=ctt.course_tab_id  LEFT JOIN portales p on p.Portale_Id=c.course_portale_id where c.course_portale_id =?",
      [Portale_Id]
    );
    console.log(rows);
    const result = rows.map((row) => {
      if (row.course_tab_image) {
        const base64Image = row.course_tab_image.toString("base64");
        return {
          ...row,
          course_tab_image: base64Image,
        };
      }
      return row;
    });
    res.json(result);
  } catch (error) {
    console.log(error, "error happened while getting course tab names");
  }
});

// router.get("/getCourseTabButtonDetails/:Portale_Id", async (req, res) => {
//   const { Portale_Id } = req.params;
//   console.log(Portale_Id, "portal id ");
//   try {
//     const [rows] = await db.query(
//       "SELECT p.Portale_Name, ctt.course_tab_title, c.course_tab_text, c.course_tab_image " +
//       "FROM course_tab_details c " +
//       "LEFT JOIN course_tab_titles ctt ON c.course_tab_title_id = ctt.course_tab_id " +
//       "LEFT JOIN portales p ON p.Portale_Id = c.course_portale_id " +
//       "WHERE c.course_portale_id = ?",
//       [Portale_Id]
//     );

//     console.log(rows);

//     // Organize data
//     const result = rows.reduce((acc, row) => {
//       // Initialize portal if it doesn't exist
//       if (!acc[row.Portale_Name]) {
//         acc[row.Portale_Name] = { Portale_Name: row.Portale_Name, tabs: [] };
//       }

//       // Find existing tab or create new one
//       let existingTab = acc[row.Portale_Name].tabs.find(tab => tab.course_tab_title === row.course_tab_title);
//       if (!existingTab) {
//         existingTab = {
//           course_tab_title: row.course_tab_title,
//           course_tab_text: [],
//           course_tab_image: row.course_tab_image ? row.course_tab_image.toString("base64") : null,
//         };
//         acc[row.Portale_Name].tabs.push(existingTab);
//       }

//       // Add course_tab_text to the existing tab
//       existingTab.course_tab_text.push(row.course_tab_text);

//       return acc;
//     }, {});

//     // Convert object to array
//     const organizedResult = Object.values(result);

//     res.json(organizedResult);
//   } catch (error) {
//     console.log(error, "error happened while getting course tab names");
//     res.status(500).json({ error: "An error occurred while retrieving data" });
//   }
// });
// router.get("/getCourseTabButtonDetails/:Portale_Id", async (req, res) => {
//   const { Portale_Id } = req.params;
//   console.log(Portale_Id, "portal id ");
//   try {
//     const [rows] = await db.query(
//       "SELECT * " +
//         "FROM course_tab_details c " +
//         "LEFT JOIN course_tab_titles ctt ON c.course_tab_title_id = ctt.course_tab_id " +
//         "LEFT JOIN portales p ON p.Portale_Id = c.course_portale_id " +
//         "WHERE c.course_portale_id = ?",
//       [Portale_Id]
//     );

//     console.log(rows,"rows from http://localhost:5001/courseTab/getCourseTabButtonDetails/1");

//     // Organize data
//     const result = rows.reduce((acc, row) => {
//       // Initialize portal if it doesn't exist
//       if (!acc[row.Portale_Name]) {
//         acc[row.Portale_Name] = { Portale_Name: row.Portale_Name, tabs: [] };
//       }

//       // Find existing tab or create new one
//       let existingTab = acc[row.Portale_Name].tabs.find(
//         (tab) => tab.course_tab_title === row.course_tab_title
//       );
//       if (!existingTab) {
//         existingTab = {
//           course_tab_title: row.course_tab_title,
//           course_tab_text: [],
//         };
//         acc[row.Portale_Name].tabs.push(existingTab);
//       }

//       // Add course_tab_text to the existing tab
//       existingTab.course_tab_text.push(row.course_tab_text);

//       return acc;
//     }, {});

//     // Convert object to array
//     const organizedResult = Object.values(result);

//     res.json(organizedResult);
//   } catch (error) {
//     console.log(error, "error happened while getting course tab names");
//     res.status(500).json({ error: "An error occurred while retrieving data" });
//   }
// });

router.delete("/courseTabDelete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id, "This is the tab id ");
  try {
    const [result] = await db.query(
      `delete from course_tab_details where tab_id=?`,
      id
    );

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ sucess: true, message: "Tab deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Tab not found" });
    }
    console.log(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the tab",
    });
  }
});

router.get("/fetchTabDetailsForEdit/:portaleId", async (req, res) => {
  const { portaleId } = req.params;
  console.log(portaleId);

  // const sql = "select * from  course_tab_details where course_portale_id= ?";
  // const sql=`select * from  course_tab_details ctd LEFT JOIN course_tab_titles ctt ON ctt.course_tab_id=ctd.course_tab_title_id AND course_tab_id=?`
  // const sql='select * from  course_tab_details ctd LEFT JOIN course_tab_titles ctt ON ctd.course_tab_title_id=ctt.course_tab_id AND ctd.course_portale_id=?'
  const sql = `SELECT * 
FROM course_tab_details ctd 
LEFT JOIN course_tab_titles ctt 
ON ctd.course_tab_title_id = ctt.course_tab_id 
WHERE ctd.course_portale_id = ?
`;
  try {
    const [results] = await db.query(sql, [portaleId]);
    const formattedResults = results.map((item) => ({
      ...item,
      // course_tab_image: item.course_tab_image.toString("base64"),
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Failed to fetch items");
  }
});
module.exports = router;
