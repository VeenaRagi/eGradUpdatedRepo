const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');
const multer = require('multer');
const fetch = require('node-fetch');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(express.json());
router.use(express.urlencoded({ extended: false }));



router.get('/OVL_courses', async (req, res) => {
    const query = 'SELECT courseCreationId,courseName,Portale_Id FROM course_creation_table WHERE Portale_Id= 3  ';
    try {
        const [result] = await db.query(query);
        res.json(result);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

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

router.put("/videslink_update/:OVL_Linke_Id", async (req, res) => {
    const { OVL_Linke_Id } = req.params;
    const { Drive_Link, Lectures_name, Lecture_order } = req.body;
  
    if (!Drive_Link || !Lectures_name || Lecture_order === undefined) {
      return res.status(400).json({ error: "Drive_Link, Lectures_name, and Lecture_order are required." });
    }
  
    try {
      const updateQuery = `
        UPDATE ovl_links 
        SET Drive_Link = ?, Lectures_name = ?, Lecture_order = ?
        WHERE OVL_Linke_Id = ?
      `;
      const [result] = await db.execute(updateQuery, [Drive_Link, Lectures_name, Lecture_order, OVL_Linke_Id]);
  
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


