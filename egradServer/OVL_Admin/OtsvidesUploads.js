const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');
const multer = require('multer');
const ExcelJS = require('exceljs');
const fetch = require('node-fetch');
const { google } = require('googleapis');
const fs = require("fs");
const path = require('path');

const SCOPE = ["https://www.googleapis.com/auth/drive"];
const KEYFILEPATH = path.join(__dirname, "./credentials.json");
const credentials = require('./credentials.json');
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scope: SCOPE
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// router.post('/excelupload', upload.single('file'), async (req, res) => {
//     try {
//         const { courseCreationId } = req.body; // Extract courseCreationId from request body

//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.load(req.file.buffer);

//         const worksheet = workbook.worksheets[0];

//         // Extract data from the worksheet
//         const data = worksheet.getSheetValues();

//         // console.log('Received data from Excel:', data);

//         // Ensure there is data in the worksheet
//         if (!data.length) {
//             throw new Error('Worksheet is empty.');
//         }

//         // Extract the heading row from the data
//         let headingRow = data[1]; // Assuming the heading row is at index 1

//         // Filter out empty items from the heading row
//         headingRow = headingRow.filter(item => !!item);

//         // console.log('Heading row:', headingRow);

//         // Ensure the heading row is an array and contains at least two elements
//         if (!Array.isArray(headingRow) || headingRow.length < 2) {
//             throw new Error('Heading row is not valid.');
//         }

//         // Extract the column headings
//         const [Lectures_name_heading, driveLink_heading] = headingRow;

//         // console.log('Lectures_name_heading:', Lectures_name_heading);
//         // console.log('driveLink_heading:', driveLink_heading);

//         // Check if the required column headings are present
//         if (Lectures_name_heading !== 'Lectures_name_heading' || driveLink_heading !== 'driveLink_heading') {
//             throw new Error('Missing required column headings.');
//         }

//         // Remove the heading row from the data
//         data.splice(0, 2); // Remove two rows: the first empty row and the heading row

//         // Insert data into the database
//         for (const row of data) {
//             // Filter out empty items from the row
//             const rowData = row.filter(item => !!item);

//             // Extract the values for Lectures_name and Drive_Link
//             const [Lectures_name, Drive_Link] = rowData;

//             // console.log('Inserting row into database:', Lectures_name, Drive_Link, courseCreationId);

//             // Insert each row into the database
//             await db.query('INSERT INTO ovl_links (Lectures_name, Drive_Link, courseCreationId) VALUES (?, ?, ?)', [Lectures_name, Drive_Link, courseCreationId]);
//         }

//         res.status(200).json({ message: 'File uploaded and data saved successfully.' });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.post('/videoUpload', upload.single('file'), async (req, res) => {
    try {
        const { courseCreationId, lectureName, lectureOrder } = req.body;

        if (!req.file || !req.file.mimetype.includes('mp4')) {
            return res.status(400).json({ error: 'Only MP4 files are allowed.' });
        }
        const videoBlob = req.file.buffer;

        const [result] = await db.query(
            'INSERT INTO ovl_links (Lectures_name, Drive_Link, courseCreationId, Lecture_order) VALUES (?, ?, ?, ?)',
            [lectureName, videoBlob, courseCreationId, lectureOrder]
        );

        const insertedId = result.insertId;

        res.status(200).json({ message: 'File uploaded and data saved successfully.', Linke_id: insertedId });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/videos', async (req, res) => {
   

    // SQL query to select data
    const query = `SELECT 
        ol.OVL_Linke_Id, 
        ol.Lectures_name, 
        ol.Drive_Link, 
        ol.Lecture_order,
        cc.courseName,
        cc.courseCreationId
    FROM 
        ovl_links ol 
    JOIN 
        course_creation_table cc ON cc.courseCreationId = ol.courseCreationId`;

    try {
        const [results] = await db.query(query); 

        // Check if results are empty
        if (results.length === 0) {
            return res.status(404).json({ error: 'No videos found for the given courseCreationId' });
        }

        // Convert BLOB to Base64
        const resultWithBase64 = results.map(record => {
            if (record.Drive_Link) {
                // Convert buffer to Base64 string
                const base64Data = Buffer.from(record.Drive_Link).toString('base64');
                // Format it as a data URL
                return {
                    ...record,
                    Drive_Link: `data:video/mp4;base64,${base64Data}` // Add MIME type prefix
                };
            }
            return record;
        });

        res.json(resultWithBase64);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});


router.get('/videos/:courseCreationId', async (req, res) => {
    const { courseCreationId } = req.params;

    const query = `SELECT 
        ol.OVL_Linke_Id, 
        ol.Lectures_name, 
        ol.Drive_Link, 
        ol.Lecture_order,
        cc.courseName,
        cc.courseCreationId
    FROM 
        ovl_links ol 
    JOIN 
        course_creation_table cc ON cc.courseCreationId = ol.courseCreationId WHERE 
    cc.courseCreationId = ?`;

    try {
        const [results] = await db.query(query, [courseCreationId]); 

        // Check if results are empty
        if (results.length === 0) {
            return res.status(404).json({ error: 'No videos found for the given courseCreationId' });
        }

        // Convert BLOB to Base64
        const resultWithBase64 = results.map(record => {
            if (record.Drive_Link) {
                // Convert buffer to Base64 string
                const base64Data = Buffer.from(record.Drive_Link).toString('base64');
                // Format it as a data URL
                return {
                    ...record,
                    Drive_Link: `data:video/mp4;base64,${base64Data}` 
                };
            }
            return record;
        });

        res.json(resultWithBase64);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});


router.get('/OVL_courses', async (req, res) => {
    const query =`SELECT courseCreationId, courseName, Portale_Id 
    FROM course_creation_table 
    WHERE Portale_Id IN (3, 4)`;
    try {
        const [result] = await db.query(query);
        res.json(result);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});





const axios = require('axios');

router.get('/videos/:courseCreationId', async (req, res) => {
    const { courseCreationId } = req.params; // Get the courseCreationId from URL params
    const query = `SELECT 
    ol.OVL_Linke_Id, 
    ol.Lectures_name, 
    ol.Drive_Link, 
    cc.courseName,
    cc.courseCreationId
FROM 
    ovl_links ol 
JOIN 
course_creation_table cc ON cc.courseCreationId = ol.courseCreationId
WHERE 
    cc.courseCreationId = ?`;
    try {
        const [result] = await db.query(query, [courseCreationId]); // Pass the courseCreationId as parameter
        res.json(result);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});
// SELECT ol.OVL_Linke_Id, ol.Lectures_name, ol.Drive_Link,cc.OVL_Course_Name FROM ovl_links ol JOIN ovl_course cc ON cc.OVL_Course_Id=ol.OVL_Course_Id  WHERE ol.OVL_Course_Id = ?

router.get('/coursesvideos', async (req, res) => {
    const query = 'SELECT cc.courseCreationId, cc.courseName, e.examName, e.examId, cc.cardImage AS courseCardImage FROM course_creation_table cc LEFT JOIN exams e ON e.examId = cc.examId';
    try {
        const [result] = await db.query(query);

        // Loop through the result and add base64-encoded image string to courseCardImage field
        result.forEach(course => {
            if (course.courseCardImage) {
                course.courseCardImage = `data:image/png;base64,${Buffer.from(course.courseCardImage).toString('base64')}`;
            }
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});




// const apiKey = 'AIzaSyCVDAspi_DbENaQmmUES-z4ipO3DdxsxRA'; 

router.get('/proxy/google-drive/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        if (!fileId) {
            throw new Error('File ID is missing');
        }

        const apiKey = 'AIzaSyCVDAspi_DbENaQmmUES-z4ipO3DdxsxRA'; // Replace 'YOUR_API_KEY' with your actual API key
        const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

        console.log("Fetching video from:", apiUrl); // Log the fetched URL for debugging

        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error('Failed to fetch video:', response.statusText);
            throw new Error('Failed to fetch video');
        }

        const videoData = await response.buffer();
        res.set('Content-Type', 'video/mp4');
        res.send(videoData);
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).send('Error fetching video: ' + error.message); // Send error message in response
    }
});


router.get('/OVL_data', async (req, res) => {
    const query = 'SELECT ol.OVL_Linke_Id ,ol.Drive_Link,ol.Lectures_name,cc.courseCreationId,cc.courseName FROM ovl_links AS ol LEFT JOIN course_creation_table cc ON cc.courseCreationId =ol.courseCreationId';
    try {
        const [result] = await db.query(query);
        res.json(result);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

router.delete(
    "/videslink_delete/:OVL_Linke_Id",
    async (req, res) => {
        const OVL_Linke_Id = req.params.OVL_Linke_Id;

        try {
            await db.query(
                `DELETE ol.* FROM ovl_links AS ol WHERE OVL_Linke_Id = ?`,
                [OVL_Linke_Id]
            );

            res.json({
                message: `course with ID ${OVL_Linke_Id} deleted from the database`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

router.delete("/videslink_delete", async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Invalid or empty IDs array provided" });
    }

    try {
        // Construct a parameterized SQL query with placeholders
        const placeholders = ids.map(() => "?").join(", ");
        const query = `DELETE FROM ovl_links WHERE OVL_Linke_Id IN (${placeholders})`;

        // Execute the query with the actual values of IDs
        await db.query(query, ids);

        res.json({
            message: "Selected video links deleted from the database",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});





router.put("/videslink_update/:OVL_Linke_Id", async (req, res) => {
    const { OVL_Linke_Id } = req.params;
    const { Drive_Link, Lectures_name } = req.body; 
    if (!Drive_Link || !Lectures_name) {
      return res.status(400).json({ error: "Drive_Link and Lectures_name are required." });
    }
    try {
      const updateQuery = `
        UPDATE ovl_links 
        SET Drive_Link = ?, Lectures_name = ?
        WHERE OVL_Linke_Id = ?
      `;
      const [result] = await db.execute(updateQuery, [Drive_Link, Lectures_name, OVL_Linke_Id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Video link not found." });
      }
      return res.status(200).json({ message: "Video link updated successfully." });
    } catch (error) {
      console.error("Error updating video link:", error);
      return res.status(500).json({ error: "Failed to update video link." });
    }
  });



module.exports = router;