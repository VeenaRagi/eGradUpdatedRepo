const express = require("express");
const router = express.Router();
const db1 = require("../DataBase/db1");
const db = require("../DataBase/db2");

// const db2 = require('../databases/
// const bcrypt = require("bcrypt");
const fs = require("fs");
const app = express();
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sizeOf = require("image-size");
const bodyParser = require("body-parser");
const multer = require("multer");
const { register } = require("module");
const nodemailer = require("nodemailer");
const path = require("path");
const logoPath = path.resolve(__dirname, "../logo/egate logo.png");
const userimgPath = path.resolve(__dirname, "../logo/user.png");
const xlsx = require("xlsx");

// const logoPath = require("../logo/egate logo.png");

const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

// --------------------------------------------------- databse connection finish ------------------------------------

// --------------------------------------------------- ug admin for banners page------------------------------------

// ----------------------------------UGhomepageadimcourses
router.get("/UGhomepageadimcourses", (req, res) => {
  const query = "SELECT course_name, course_id FROM courses";
  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from the database.");
      return;
    }
    console.log("Retrieved data from test table:");
    console.log(results);
    res.json(results);
  });
});

// ---------UGhomepageadimsections
router.get("/UGhomepageadimsections/:course_id", (req, res) => {
  const course_id = req.params.course_id;
  const sql = "SELECT * FROM  sections_admin WHERE course_id = ? ";
  db1.query(sql, [course_id], (err, result) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      res.status(500).json({ error: "Error fetching exams" });
      return;
    }
    res.json(result);
  });
});

//---------------- UGhomepageadimexams

router.get("/UGhomepageadimexams/:course_id", (req, res) => {
  const course_id = req.params.course_id;
  const sql = "SELECT * FROM  2egquiz_exam WHERE course_id = ?";
  db1.query(sql, [course_id], (err, result) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      res.status(500).json({ error: "Error fetching exams" });
      return;
    }
    res.json(result);
  });
});

// ---------------- for upload upload api

async function getAvailableDiskSpace() {
  const drive = path.parse(__dirname).root;
  const info = await diskusage.check(drive);
  return info.available;
}

db1.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadFiles");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post("/upload", upload.single("image"), (req, res) => {
  const uploadedFile = req.file;
  // Retrieve values from req.body
  const courseId = req.body.course_id;
  const sectionId = req.body.section_id;
  const examId = req.body.exam_id;
  // Read the file content using fs
  fs.readFile(uploadedFile.path, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ message: "Error reading file" });
    }

    // Use the file content as a Buffer for image-size
    const dimensions = sizeOf(data);

    // Rename the file to the original name
    const newPath = path.join(
      uploadedFile.destination,
      uploadedFile.originalname
    );

    fs.rename(uploadedFile.path, newPath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return res.status(500).json({ message: "Error renaming file" });
      }

      const imageBuffer = Buffer.from(data);

      // Modify the query to include the original filename in image_title
      let query;
      let values;

      if (examId) {
        query =
          "INSERT INTO images (image_title, image_data, course_id, section_id, exam_id) VALUES (?, ?, ?, ?,?)";
        values = [
          uploadedFile.originalname,
          imageBuffer,
          courseId,
          sectionId,
          examId,
        ];
      } else {
        query =
          "INSERT INTO images (image_title, image_data, course_id, section_id) VALUES (?, ?, ?,?)";
        values = [uploadedFile.originalname, imageBuffer, courseId, sectionId];
      }

      db1.query(query, values, (err, result) => {
        if (err) {
          console.error("Error uploading image:", err);
          return res.status(500).json({ message: "Error uploading image" });
        }

        console.log("File uploaded and renamed successfully");
        res.json({ message: "Image uploaded successfully" });
      });
    });
  });
});

// for delete uploaded images
router.delete("/HomeImages/:images_id", (req, res) => {
  const idToDelete = parseInt(req.params.images_id);

  // Fetch the image data from the database to get the image title
  const query = "SELECT image_title FROM images WHERE images_id = ?";
  db1.query(query, [idToDelete], (err, result) => {
    if (err) {
      console.error("Error fetching image data:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("Image not found");
      return;
    }

    const imageTitle = result[0].image_title;

    // Delete the image record from the database
    const deleteQuery = "DELETE FROM images WHERE images_id = ?";
    db1.query(deleteQuery, [idToDelete], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting image:", deleteErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (deleteResult.affectedRows > 0) {
        // Delete the corresponding file from the server's uploadFiles directory
        const filePath = path.join(__dirname, "uploadFiles", imageTitle);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
            res.status(500).send("Error deleting file");
          } else {
            console.log("File deleted successfully");
            res.status(200).send("Image and file deleted successfully");
          }
        });
      } else {
        res.status(404).send("Image not found");
      }
    });
  });
});

// for ImageTitle for uploaded images

router.get("/ImageTitle", (req, res) => {
  const query = "SELECT images_id, image_title FROM images";
  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from the database.");
      return;
    }
    console.log("Retrieved data from test table:");
    console.log(results);
    res.json(results);
  });
});

router.get("/courses", (req, res) => {
  const query = "SELECT course_name,course_id FROM courses";
  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from the database.");
      return;
    }
    console.log("Retrieved data from test table:");
    console.log(results);
    res.json(results);
  });
});

router.get("/quiz_exams/:course_id", (req, res) => {
  const course_id = req.params.course_id;
  // const section_id = req.params.section_id;
  const sql = "SELECT * FROM exams WHERE course_id = ?";
  db1.query(sql, [course_id], (err, result) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      res.status(500).json({ error: "Error fetching exams" });
      return;
    }
    res.json(result);
  });
});

router.get("/sections/:course_id", (req, res) => {
  const course_id = req.params.course_id;
  const sql = "SELECT * FROM sections WHERE course_id = ? ";
  db1.query(sql, [course_id], (err, result) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      res.status(500).json({ error: "Error fetching exams" });
      return;
    }
    res.json(result);
  });
});

router.delete("/HomeImages/:images_id", (req, res) => {
  const imageId = req.params.images_id;
  const q = "DELETE FROM images WHERE images_id = ?";

  db1.query(q, [imageId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

router.get("/HomeImagesadmin", (req, res) => {
  const query = "SELECT images_id, image_data FROM images";
  db1.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      res.status(500).send("Internal Server Error");
    } else {
      const imageArray = results.map((result) => {
        const base64 = result.image_data.toString("base64");
        return {
          id: result.images_id,
          imageData: `data:image/png;base64,${base64}`,
        };
      });

      res.json(imageArray);
    }
  });
});

router.get("/HomeImages", (req, res) => {
  const query = "SELECT * FROM images WHERE section_id=1 ;";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Internal Server Error");
    } else {
      const imageDataList = results.map((result) => {
        // Use the correct column name based on your table structure
        const base64 = result.image_data.toString("base64");
        return `data:image/png;base64,${base64}`;
      });
      res.json(imageDataList);
    }
  });
});

router.get("/ExploreExam", (req, res) => {
  const query = "SELECT * FROM images WHERE section_id=2;";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Internal Server Error");
    } else {
      const imageDataList = results.map((result) => {
        // Use the correct column name based on your table structure
        const base64 = result.image_data.toString("base64");
        return `data:image/png;base64,${base64}`;
      });
      res.json(imageDataList);
    }
  });
});

router.get("/ExamBanners", (req, res) => {
  const query = "SELECT * FROM images WHERE exam_id=201;";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Internal Server Error");
    } else {
      const imageDataList = results.map((result) => {
        // Use the correct column name based on your table structure
        const base64 = result.image_data.toString("base64");
        return `data:image/png;base64,${base64}`;
      });
      res.json(imageDataList);
    }
  });
});

router.get("/NeetExamBanners", (req, res) => {
  const query = "SELECT * FROM images WHERE exam_id=202;";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Internal Server Error");
    } else {
      const imageDataList = results.map((result) => {
        // Use the correct column name based on your table structure
        const base64 = result.image_data.toString("base64");
        return `data:image/png;base64,${base64}`;
      });
      res.json(imageDataList);
    }
  });
});

router.get("/BitsatExamBanners", (req, res) => {
  const query = "SELECT * FROM images WHERE exam_id=203;";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Internal Server Error");
    } else {
      const imageDataList = results.map((result) => {
        // Use the correct column name based on your table structure
        const base64 = result.image_data.toString("base64");
        return `data:image/png;base64,${base64}`;
      });
      res.json(imageDataList);
    }
  });
});

router.get("/ApEapcetBanners", (req, res) => {
  const query = "SELECT * FROM images WHERE exam_id=205;";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Internal Server Error");
    } else {
      const imageDataList = results.map((result) => {
        // Use the correct column name based on your table structure
        const base64 = result.image_data.toString("base64");
        return `data:image/png;base64,${base64}`;
      });
      res.json(imageDataList);
    }
  });
});

router.get("/TsEamcetBanners", (req, res) => {
  const query = "SELECT * FROM images WHERE exam_id=211;";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Internal Server Error");
    } else {
      const imageDataList = results.map((result) => {
        // Use the correct column name based on your table structure
        const base64 = result.image_data.toString("base64");
        return `data:image/png;base64,${base64}`;
      });
      res.json(imageDataList);
    }
  });
});

// --------------------------------------------------- ug admin for banners finshed ------------------------------------

// --------------------------------------------------- ug quiz home page ------------------------------------

// ------------------------------------- courses ug function by sra1  ------------------------------------

router.get("/examsug", (req, res) => {
  const course_id = req.params.course_id;
  // const sql = "SELECT exam_name FROM 2egquiz_exam WHERE exam_name=UG";
  const sql =
    "SELECT exam_name FROM 2egquiz_exam WHERE course_id = ( SELECT Min(course_id)  FROM 2egquiz_exam  );";
  db1.query(sql, [course_id], (err, result) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      res.status(500).json({ error: "Error fetching exams" });
      return;
    }
    res.json(result);
  });
});

router.get("/examspg", (req, res) => {
  const course_id = req.params.course_id;
  // const sql = "SELECT exam_name FROM 2egquiz_exam WHERE exam_name=UG";
  const sql =
    "SELECT exam_name FROM 2egquiz_exam WHERE course_id = ( SELECT Min(course_id+1)  FROM 2egquiz_exam  );";
  db1.query(sql, [course_id], (err, result) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      res.status(500).json({ error: "Error fetching exams" });
      return;
    }
    res.json(result);
  });
});
router.get("/examsmba", (req, res) => {
  const course_id = req.params.course_id;
  // const sql = "SELECT exam_name FROM 2egquiz_exam WHERE exam_name=UG";
  const sql =
    "SELECT exam_name FROM 2egquiz_exam WHERE course_id = ( SELECT Min(course_id+2)  FROM 2egquiz_exam  );";
  db1.query(sql, [course_id], (err, result) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      res.status(500).json({ error: "Error fetching exams" });
      return;
    }
    res.json(result);
  });
});
router.get("/examsca", (req, res) => {
  const course_id = req.params.course_id;
  // const sql = "SELECT exam_name FROM 2egquiz_exam WHERE exam_name=UG";
  const sql =
    "SELECT exam_name FROM 2egquiz_exam WHERE course_id = ( SELECT Min(course_id+3)  FROM 2egquiz_exam  );";
  db1.query(sql, [course_id], (err, result) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      res.status(500).json({ error: "Error fetching exams" });
      return;
    }
    res.json(result);
  });
});

router.get("/coursesug", (req, res) => {
  // const query = 'SELECT course_name,course_id FROM 1egquiz_courses';
  const query =
    "SELECT course_name FROM 1egquiz_courses WHERE course_id = ( SELECT Min(course_id)  FROM 1egquiz_courses  );";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from database.");
      return;
    }
    console.log("Retrieved data from test table:");
    console.log(results);
    // Send the retrieved data as JSON response
    res.json(results);
  });
});

router.get("/coursescurrentug", (req, res) => {
  // const query = 'SELECT course_name,course_id FROM 1egquiz_courses';
  const query =
    "SELECT course_name FROM 1egquiz_courses WHERE course_id = ( SELECT Max(course_id)  FROM 1egquiz_courses  );";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from database.");
      return;
    }
    console.log("Retrieved data from test table:");
    console.log(results);
    // Send the retrieved data as JSON response
    res.json(results);
  });
});

router.get("/coursespg", (req, res) => {
  // const query = 'SELECT course_name,course_id FROM 1egquiz_courses';
  const query =
    "SELECT course_name FROM 1egquiz_courses WHERE course_id = ( SELECT Min(course_id+1)  FROM 1egquiz_courses  );";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from database.");
      return;
    }
    console.log("Retrieved data from test table:");
    console.log(results);
    // Send the retrieved data as JSON response
    res.json(results);
  });
});

router.get("/coursesmba", (req, res) => {
  // const query = 'SELECT course_name,course_id FROM 1egquiz_courses';
  const query =
    "SELECT course_name FROM 1egquiz_courses WHERE course_id = ( SELECT max(course_id-1)  FROM 1egquiz_courses  );";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from database.");
      return;
    }
    console.log("Retrieved data from test table:");
    console.log(results);
    // Send the retrieved data as JSON response
    res.json(results);
  });
});
router.get("/coursesca", (req, res) => {
  // const query = 'SELECT course_name,course_id FROM 1egquiz_courses';
  const query =
    "SELECT course_name FROM 1egquiz_courses WHERE course_id = ( SELECT max(course_id)  FROM 1egquiz_courses  );";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from database.");
      return;
    }
    console.log("Retrieved data from test table:");
    console.log(results);
    // Send the retrieved data as JSON response
    res.json(results);
  });
});

// -------------------------------------- login for ug admin and user -----------------------------------------------------

const storage_PROimg = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set up the destination folder for storing uploaded profile images
    cb(null, "profilesimages/");
  },
  filename: function (req, file, cb) {
    // Define how uploaded files should be named
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const profilesimages = multer({ storage: storage_PROimg });
router.post(
  "/register",
  profilesimages.single("profileImage"),
  async (req, res) => {
    try {
      const { username, email, phoneNumber, address } = req.body;
      const generatedPassword = generateRandomPassword();
      const defaultRole = "User";
      let fileContent = null;

      // Check if an image was uploaded
      if (req.file) {
        fileContent = fs.readFileSync(req.file.path);
      } else {
        // Use the default image from the logoPath
        fileContent = fs.readFileSync(userimgPath);
      }

      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const query = `
        INSERT INTO log (username, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        username,
        email,
        generatedPassword,
        defaultRole,
        fileContent,
      ];

      await db.query(query, values);

      // Sending email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com", // Corrected host
        auth: {
          user: "webdriveegate@gmail.com",
          pass: "qftimcrkpkbjugav",
        },
      });
      const loginMailOptions = {
        from: "webdriveegate@gmail.com",
        to: email,
        subject: "Login Details",
        html: `
          <div align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
            style="max-width: 600px; margin: 20px auto; border-collapse: collapse; padding: 20px;">

            <div>
              <img src="cid:defaultLogo" alt="egradtutor" style="width: 150px;margin: 20px auto; margin-left:0; height: auto; display: block;">
            </div>
            <p style="font-size: 16px; color: #333; text-align: center; margin-top: 20px;">Thank you for registering on
              Egradtutor. We hope you enjoy our service!</p>
            </div>

            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
              style="max-width: 600px; margin: 20px auto; border-collapse: collapse; border: 1px solid rgba(0, 0, 0, 0.5); background-color: #ffffff; padding: 20px;">
              <tr>
                <td>
                  <tr>
                    <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Username</th>
                    <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Email</th>
                    <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Password</th>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${username}</td>
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${email}</td>
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${generatedPassword}</td>
                  </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
        attachments: [
          {
            filename: "logo.png",
            path: logoPath,
            cid: "defaultLogo",
          },
          {
            filename: "profileImage.jpg",
            content: Buffer.from(fileContent, "base64"),
            encoding: "base64",
            cid: "profileImage",
          },
        ],
      };

      transporter.sendMail(loginMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending login email:", error);
        } else {
          console.log("email sent");
        }
      });

      // Respond with success message
      res.status(201).json({
        message: "User registered successfully. Login details sent to email.",
      });
    } catch (error) {
      console.error("Error saving form data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.post(
  "/newregister",
  profilesimages.single("profileImage"),
  async (req, res) => {
    try {
      const { username, email, phoneNumber, address } = req.body;
      const generatedPassword = generateRandomPassword();
      const defaultRole = "User";
      let fileContent = null;

      // Check if an image was uploaded
      if (req.file) {
        fileContent = fs.readFileSync(req.file.path);
      } else {
        // Use the default image from the logoPath
        fileContent = fs.readFileSync(userimgPath);
      }

      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const query = `
        INSERT INTO log (username, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        username,
        email,
        generatedPassword,
        defaultRole,
        fileContent,
      ];

      await db.query(query, values);

      // Sending email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com", // Corrected host
        auth: {
          user: "webdriveegate@gmail.com",
          pass: "qftimcrkpkbjugav",
        },
      });
      const loginMailOptions = {
        from: "webdriveegate@gmail.com",
        to: email,
        subject: "Login Details",
        html: `
          <div align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
            style="max-width: 600px; margin: 20px auto; border-collapse: collapse; padding: 20px;">

            <div>
              <img src="cid:defaultLogo" alt="egradtutor" style="width: 150px;margin: 20px auto; margin-left:0; height: auto; display: block;">
            </div>
            <p style="font-size: 16px; color: #333; text-align: center; margin-top: 20px;">Thank you for registering on
              Egradtutor. We hope you enjoy our service!</p>
            </div>

            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
              style="max-width: 600px; margin: 20px auto; border-collapse: collapse; border: 1px solid rgba(0, 0, 0, 0.5); background-color: #ffffff; padding: 20px;">
              <tr>
                <td>
                  <tr>
                    <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Username</th>
                    <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Email</th>
                    <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Password</th>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${username}</td>
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${email}</td>
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${generatedPassword}</td>
                  </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
        attachments: [
          {
            filename: "logo.png",
            path: logoPath,
            cid: "defaultLogo",
          },
          {
            filename: "profileImage.jpg",
            content: Buffer.from(fileContent, "base64"),
            encoding: "base64",
            cid: "profileImage",
          },
        ],
      };

      transporter.sendMail(loginMailOptions, (error, info) => {
        if (error) {
          console.error("Error sending login email:", error);
        } else {
          console.log("email sent");
        }
      });

      // Respond with success message
      res.status(201).json({
        message: "User registered successfully. Login details sent to email.",
      });
    } catch (error) {
      console.error("Error saving form data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
async function checkEmailExists(email) {
  const query = `
    SELECT COUNT(*) AS count FROM log WHERE email = ?
  `;
  const [rows] = await db.query(query, [email]);
  return rows[0].count > 0;
}

function generateRandomPassword() {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  // Generate random characters
  const randomUppercase1 =
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  const randomUppercase2 =
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  const randomLowercase1 =
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  const randomLowercase2 =
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  const randomNumber1 = numbers[Math.floor(Math.random() * numbers.length)];
  const randomNumber2 = numbers[Math.floor(Math.random() * numbers.length)];

  // Concatenate characters to form the password
  const password =
    randomUppercase1 +
    randomUppercase2 +
    randomNumber2 +
    randomLowercase2 +
    randomNumber1 +
    randomLowercase1;

  return password;
}

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const sql = "SELECT * FROM log WHERE email = ?";
//     db1.query(sql, [email], async (error, results) => {
//       if (error || results.length === 0) {
//         res.status(401).json({ error: "Invalid credentials" });
//         return;
//       }

//       const user = results[0];
//       // const passwordMatch = await bcrypt.compare(password, user.password);

//       if (!password) {
//         res.status(401).json({ error: "Invalid credentials" });
//         return;
//       }

//       const token = jwt.sign({ id: user.decryptedUserIdState }, "your_secret_key", {
//         expiresIn: "24h", // 24 hours
//       });
//       const { decryptedUserIdState, email, role } = user;
//       res.status(200).json({ token, user: { decryptedUserIdState, email, role } });
//     });
//     console.log(`${email}`);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM log WHERE email = ?";
    db1.query(sql, [email], (error, results) => {
      if (error || results.length === 0) {
        res.status(401).json({ error: "Invalid email" });
        return;
      }

      const user = results[0];

      // Simulate password checking without bcrypt (not recommended for production)
      if (password !== user.password) {
        res.status(401).json({ error: "Invalid password" });
        return;
      }

      const token = jwt.sign({ id: user.decryptedUserIdState }, "your_secret_key", {
        expiresIn: "24h", // 24 hours
      });
      const { decryptedUserIdState, email, role } = user;
      res.status(200).json({ token, user: { decryptedUserIdState, email, role } });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//------------------- Profile for user to get logined user data

router.get("/profile/:decryptedUserIdState", async (req, res) => {
  const decryptedUserIdState = req.params.decryptedUserIdState;

  try {
    const sql = "SELECT * FROM log WHERE user_Id = ?";
    db1.query(sql, [decryptedUserIdState], (error, results) => {
      if (error || results.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const user = results[0];
      // Send user profile details
      res.status(200).json(user);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//------------------- userdetails for user to get logined user data
router.get("/userdetails/:decryptedUserIdState", (req, res) => {
  const decryptedUserIdState = req.params.decryptedUserIdState;
  db1.query("SELECT * FROM log WHERE user_Id = ?", decryptedUserIdState, (err, results) => {
    if (err) {
      console.log(err);
    }

    if (!results || results.length === 0) {
      console.log("No data found.");
      return res.status(404).send("No data found.");
    }
    const dataWithImages = results
      .map((result) => {
        return {
          id: result.decryptedUserIdState,
          username: result.username,
          email: result.email,
          role: result.role,
          password: result.password,
        };
      })
      .filter((item) => item !== null); // Remove null entries

    console.log("Retrieved data from log table:");
    // console.log(dataWithImages);

    res.json(dataWithImages); // Sending the processed data with images as a response
  });
});

//------------------- user for user to get logined user data

router.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from Authorization header
    const decodedToken = jwt.verify(token, "your_secret_key"); // Verify and decode the token

    const decryptedUserIdState = decodedToken.id; // Get user ID from decoded token
    const sql = "SELECT * FROM log WHERE user_Id = ?";
    db1.query(sql, [decryptedUserIdState], (error, results) => {
      if (error || results.length === 0) {
        console.error("Error fetching images:", error);
        return res.status(500).send("Internal Server Error");
      }

      // Convert BLOB data to base64
      const userData = results[0];
      const base64Image = Buffer.from(
        userData.profile_image,
        "binary"
      ).toString("base64");

      const imageData = {
        id: userData.decryptedUserIdState,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        imageData: `data:image/png;base64,${base64Image}`,

        candidateName: userData.username,
        emailId: userData.email,
        confirmEmailId: userData.email,
      };

      res.status(200).json(imageData); // Send user data with image data as JSON response
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//-----------------------------------USER COURSE DATA-----------------------

// usercourseditaile;
// router.get("/usercourseditaile/:decryptedUserIdState", (req, res) => {
//   const decryptedUserIdState = req.params.decryptedUserIdState;
// console.log("decryptedUserIdState:",decryptedUserIdState);
//   const query = `
//     SELECT log.email, otsstudentregistation.*
//     FROM log
//     JOIN otsstudentregistation ON log.email = otsstudentregistation.emailId
//     WHERE log.decryptedUserIdState = ?;
//   `;

//   db1.query(query, [decryptedUserIdState], (error, results) => {
//     if (error) {
//       console.error("Error executing query:", error);
//       res.status(500).json({ error: "An error occurred" });
//       return;
//     }

//     res.json(results);
//   });
// });

router.get("/usercourseditaile/:decryptedUserIdState", (req, res) => {
  const decryptedUserIdState = req.params.decryptedUserIdState;
  console.log("decryptedUserIdState:", decryptedUserIdState);
  const query = `
    SELECT log.email, otsstudentregistation.*, log.email
    FROM log
    JOIN otsstudentregistation ON log.email = otsstudentregistation.emailId
    WHERE log.user_Id = ?;
  `;

  db1.query(query, [decryptedUserIdState], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    if (results.length === 0) {
      console.log("No data found for user ID:", decryptedUserIdState);
      res.status(404).json({ error: "No data found" });
      return;
    }

    const coursedata = {
      candidateName: results[0].candidateName,
      dateOfBirth: results[0].dateOfBirth,
      GenderId: results[0].GenderId,
      CategoryId: results[0].CategoryId,
      emailId: results[0].emailId,
      confirmEmailId: results[0].confirmEmailId,
      contactNo: results[0].contactNo,
      fatherName: results[0].fatherName,
      occupation: results[0].occupation,
      mobileNo: results[0].mobileNo,
      line1: results[0].line1,
      state_id: results[0].state_id,
      districts_id: results[0].districts_id,
      pincode: results[0].pincode,
      edStatusId: results[0].edStatusId,
      NameOfCollege: results[0].NameOfCollege,
      passingYear: results[0].passingYear,
      marks: results[0].marks,

      // Convert Buffer data to base64 and embed in data URI format
      UplodadPhto: `data:image/png;base64,${results[0].UplodadPhto.toString(
        "base64"
      )}`,
      Signature: `data:image/png;base64,${results[0].Signature.toString(
        "base64"
      )}`,
      Proof: `data:image/png;base64,${results[0].Proof.toString("base64")}`,
    };

    res.json(coursedata);
    console.log(coursedata);
  });
});

9;

//------------------- sigleuserdetails for user to get logined user data

router.get("/sigleuserdetails/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM log WHERE user_Id = ?"; // Replace 'users' with your table name

  db1.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Error fetching user details" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(results[0]);
  });
});

//------------------- user to get and update  register detaile by admin

const storage_PROimg1 = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set up the destination folder for storing uploaded profile images
    cb(null, "profilesimages/");
  },
  filename: function (req, file, cb) {
    // Define how uploaded files should be named
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const profilesimages1 = multer({ storage: storage_PROimg1 });

router.put(
  "/users/:id",
  profilesimages1.single("profileImage"), // Ensure 'profileImage' matches the 'name' attribute in the form
  async (req, res) => {
    const decryptedUserIdState = req.params.id;
    const { username, email, password, role } = req.body;

    const uploadedFile = req.file;

    try {
      let fileContent = null;

      if (uploadedFile) {
        // Read file asynchronously and handle errors
        fileContent = fs.readFileSync(uploadedFile.path);

        // Delete temporary file after reading content
        fs.unlinkSync(uploadedFile.path);
      }

      // Hash password
      // const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare SQL query based on whether profile image is provided or not
      let updateQuery;
      let queryValues;

      if (fileContent) {
        updateQuery =
          "UPDATE log SET username = ?, email = ?, password = ?, role = ?, profile_image = ? WHERE user_Id = ?";
        queryValues = [username, email, password, role, fileContent, decryptedUserIdState];
      } else {
        updateQuery =
          "UPDATE log SET username = ?, email = ?, password = ?, role = ? WHERE user_Id = ?";
        queryValues = [username, email, password, role, decryptedUserIdState];
      }

      // Execute the SQL query to update user details
      db1.query(updateQuery, queryValues, (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          res.status(500).json({ error: "Error updating user" });
        } else {
          res.status(200).json({ message: "User updated successfully" });
        }
      });
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/profile/:id",
  profilesimages1.single("profileImage"), // Ensure 'profileImage' matches the 'name' attribute in the form
  async (req, res) => {
    const decryptedUserIdState = req.params.id;
    const { username, email, password, role } = req.body;

    const uploadedFile = req.file;

    try {
      let fileContent = null;

      if (uploadedFile) {
        // Read file asynchronously and handle errors
        fileContent = fs.readFileSync(uploadedFile.path);

        // Delete temporary file after reading content
        fs.unlinkSync(uploadedFile.path);
      }

      // Hash password
      // const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare SQL query based on whether profile image is provided or not
      let updateQuery;
      let queryValues;

      if (fileContent) {
        updateQuery =
          "UPDATE log SET username = ?, email = ?, password = ?, role = ?, profile_image = ? WHERE user_Id = ?";
        queryValues = [username, email, password, role, fileContent, decryptedUserIdState];
      } else {
        updateQuery =
          "UPDATE log SET username = ?, email = ?, password = ?, role = ? WHERE user_Id = ?";
        queryValues = [username, email, password, role, decryptedUserIdState];
      }

      // Execute the SQL query to update user details
      db1.query(updateQuery, queryValues, (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          res.status(500).json({ error: "Error updating user" });
        } else {
          res.status(200).json({ message: "User updated successfully" });
        }
      });
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

//password code
router.put(
  "/studentprofilepassword/:id",
  profilesimages1.single("profileImage"),
  async (req, res) => {
    const decryptedUserIdState = req.params.id;

    const {
      username,
      email,
      password,
      role,
      currentPassword,
      newPassword,
      confirmpassword,
    } = req.body;

    const uploadedFile = req.file;

    try {
      let fileContent = null;

      if (uploadedFile) {
        fileContent = fs.readFileSync(uploadedFile.path);
        fs.unlinkSync(uploadedFile.path);
      }

      // Check if the current password matches the user's current password
      if (currentPassword !== password) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      // Check if the new password is different from the current password
      if (newPassword === currentPassword) {
        res.status(400).json({
          error: "New password should be different from the current password",
        });
        return;
      }

      // Check if the new password matches the confirmed password
      if (newPassword !== confirmpassword) {
        res.status(400).json({ error: "New password does not match" });
        return;
      }

      // Prepare SQL query based on whether profile image is provided or not
      let updateQuery;
      let queryValues;

      if (fileContent) {
        updateQuery =
          "UPDATE log SET username = ?, email = ?, password = ?, role = ?, profile_image = ? WHERE user_Id = ?";
        queryValues = [
          username,
          email,
          newPassword, // Assuming you're not hashing the password
          role,
          fileContent,
          decryptedUserIdState,
        ];
      } else {
        updateQuery =
          "UPDATE log SET username = ?, email = ?, password = ?, role = ? WHERE user_Id = ?";
        queryValues = [username, email, newPassword, role, decryptedUserIdState];
      }

      // Execute the SQL query to update user details
      db1.query(updateQuery, queryValues, (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          res.status(500).json({ error: "Error updating user" });
        } else {
          res.status(200).json({ message: "User updated successfully" });
        }
      });
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

//------------------- user to get and delete  register detaile by admin

router.delete("/users/:id", (req, res) => {
  const decryptedUserIdState = req.params.id;
  const q = " DELETE FROM log WHERE user_Id = ? ";

  db1.query(q, [decryptedUserIdState], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

router.post("/QUiZ_ForgotPassword", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists in the MySQL database
    const checkUserSql = "SELECT * FROM log WHERE email = ?";
    db1.query(checkUserSql, [email], async (error, results) => {
      if (error) {
        console.error("Error checking user existence:", error);
        return res.status(500).json({ Status: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ Status: "User not existed" });
      }

      const user = results[0];

      const token = jwt.sign({ id: user.decryptedUserIdState }, "jwt_secret_key", {
        expiresIn: "180s",
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "webdriveegate@gmail.com",
          pass: "qftimcrkpkbjugav",
        },
      });

      const mailOptions = {
        from: "webdriveegate@gmail.com",
        to: email,
        subject: "Reset Password Link",
        text: `http://localhost:3000/OTS_reset_password/${user.decryptedUserIdState}/${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ Status: "Internal server error" });
        } else {
          return res.json({ Status: "Success" });
        }
      });
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return res.status(500).json({ Status: "Internal server error" });
  }
});

router.post("/OTS_reset_password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      // Update the password in the MySQL database
      const updatePasswordSql = "UPDATE log SET password = ? WHERE user_Id = ?";
      db1.query(
        updatePasswordSql,
        [password, id],
        (updateError, updateResults) => {
          if (updateError) {
            console.error("Error updating password:", updateError);
            return res.json({ Status: "Error updating password" });
          }

          return res.json({ Status: "Success" });
        }
      );
    }
  });
});

router.get("/act_info", (req, res) => {
  const query = "SELECT * FROM log WHERE role = 'User' ";

  db1.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).send("Error retrieving data from database.");
    }

    if (!results || results.length === 0) {
      console.log("No data found.");
      return res.status(404).send("No data found.");
    }

    const dataWithImages = results
      .map((result) => {
        return {
          decryptedUserIdState: result.decryptedUserIdState,
          username: result.username,
          email: result.email,
          role: result.role,
        };
      })
      .filter((item) => item !== null); // Remove null entries
    res.json(dataWithImages); 
  });
});

const studentexelsheet = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadFiles");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const uploadexcel = multer({
  storage: studentexelsheet,
});
router.post("/studentexelsheet", uploadexcel.single("file"), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).send("Internal server error");
    }

    const sql =
      "INSERT INTO studentdetails (StudentName, MailID, PhoneNumber, CollegeName, FatherName, MotherName, ParentContactNo, PostalAddress, ColleageID) VALUES ?";
    const values = data.map((row) => [
      row.StudentName,
      row.MailID,
      row.PhoneNumber,
      row.CollegeName,
      row.FatherName,
      row.MotherName,
      row.ParentContactNo,
      row.PostalAddress,
      row.ColleageID,
    ]);

    connection.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Internal server error");
        return;
      }

      res.status(200).send("Data inserted successfully");
      connection.release(); // Release the connection back to the pool
    });
  });
});

//_____________________new code____________________


router.get('/fetchStudentDetails', async (req, res) => {
  try {
    const sql = `SELECT ots.*,log.user_Id ,log.username,log.role,log.studentregistationId,log.email FROM otsstudentregistation ots 
                 LEFT JOIN log ON ots.studentregistationId = log.studentregistationId 
                 WHERE role = 'User' AND branchId=1 `;
    const [rows] = await db.query(sql);
    console.log(rows)
    res.send(rows);
  } catch (error) {
    console.log(error, "this is the error");
    res.status(500).send('Error fetching student details');
  }
});

router.get("/getregisterid/:user_Id", async (req, res) => {
  const { user_Id } = req.params;
  console.log("userId:", user_Id); // Log the userId to the console

  try {
    if (!user_Id) {
      throw new Error("userId is required");
    }

    const [rows] = await db.execute(
      `SELECT l.*, sbc.*,cc.*,p.*
      FROM log l
      JOIN student_buy_courses sbc ON l.studentregistationId = sbc.studentregistationId
      LEFT JOIN course_creation_table AS cc
        ON
          sbc.courseCreationId = cc.courseCreationId
          LEFT JOIN portales p ON
          p.Portale_Id = cc.Portale_Id
      WHERE l.user_Id = ?`,
      [user_Id]
    );

    const organizedData = {};

    rows.forEach((row) => {
      const id =row.courseCreationId;
      if (!organizedData[id]) {
        organizedData[id] = {
          user_Id: row.user_Id,
          payu_status: row.payu_status,
          studentregistationId: row.studentregistationId,
          courseName:  row.courseName,
          courseCreationId: row.courseCreationId,
          Portal:row.Portale_Name,
        
        };
      }
    });

    res.json(Object.values(organizedData));
    console.log(organizedData)
  } catch (error) {
    console.error("Error fetching unPurchased courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put(
  "/updatePaymentStatusinactive/:user_Id/:studentRegistationId/:courseCreationId",
  async (req, res) => {
    const { user_Id, studentRegistationId, courseCreationId } = req.params;
    console.log(user_Id);
    console.log(studentRegistationId);
    console.log(courseCreationId);
    try {
      // Update the payment status in the database
      const [
        result,
        fields,
      ] = await db.execute(
        "UPDATE student_buy_courses SET payment_status = 0 WHERE user_Id = ? AND studentregistationId = ? AND courseCreationId = ?",
        [user_Id, studentRegistationId, courseCreationId]
      );

      

      if (result.affectedRows === 1) {
        console.log(
          `Payment status updated for user ${user_Id} and student registration ${studentRegistationId}`
        );
        res.status(200).json({ message: "Payment status updated inactive" });
      } else {
        console.log(
          `No matching record found for user ${user_Id} and student registration ${studentRegistationId}`
        );
        res.status(404).json({ error: "No matching record found" });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/updatePaymentStatusactive/:user_Id/:studentRegistationId/:courseCreationId",
  async (req, res) => {
    const { user_Id, studentRegistationId, courseCreationId } = req.params;
    console.log(user_Id, studentRegistationId, courseCreationId )
    try {
      // Update the payment status in the database
      const [result, fields] = await db.execute(
        "UPDATE student_buy_courses SET payment_status = 1 WHERE user_Id = ? AND studentregistationId = ? AND courseCreationId = ?",
        [user_Id, studentRegistationId, courseCreationId]
      );

      if (result.affectedRows === 1) {
        // Fetch student data and course data for the email
        const [userData] = await db.execute(
          "SELECT os.candidateName,os.emailId FROM otsstudentregistation os JOIN log AS l ON l.studentregistationId = os.studentregistationId WHERE os.studentregistationId = ?",
          [studentRegistationId]
        );

        const [courseData] = await db.execute(
          `SELECT cc.*,p.* FROM course_creation_table AS cc LEFT JOIN portales p ON
          p.Portale_Id = cc.Portale_Id  WHERE cc.courseCreationId = ?`,
          [courseCreationId]
        );

        const organizedData = {};
        courseData .forEach((row) => { 
          const id = row.courseCreationId;
          if (!organizedData[id]) {
            organizedData[id] = {
              courseName: row.courseName,
            }}
        })

        if (userData.length > 0) {
          const userEmail = userData[0].emailId;

          // Send email to the user
          const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
              user: "egradtutorweb@gmail.com",
              pass: "zzwj ffce jrbn tlhs", 
            },
          });

          const mailOptions = {
            from: "egradtutorweb@gmail.com",
            to: userEmail, // Use the provided email
            subject: "Course Activated",
          text: `Dear ${userData[0].candidateName},\n\nYour test for the course  ${courseData.courseName} has been successfully activated. You may now proceed to take the test.\n\nBest regards,\nThe Egrad Tutor`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              console.log("Email sent:", info.response);
              res.status(200).json({ message: "Payment status updated active" });
            }
          });
        } else {
          console.log(
            `No email found for student registration ID ${studentRegistationId}`
          );
          res.status(404).json({ error: "No email found for student" });
        }
      } else {
        console.log(
          `No matching record found for user ${user_Id} and student registration ${studentRegistationId}`
        );
        res.status(404).json({ error: "No matching record found" });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
// ============================for pg=============================
router.get('/fetchStudentDetailsForPG', async (req, res) => {
  try {
    const sql = `SELECT ots.*,log.user_Id ,log.username,log.role,log.studentregistationId,log.email FROM otsstudentregistation ots 
                 LEFT JOIN log ON ots.studentregistationId = log.studentregistationId 
                 WHERE role = 'User' AND branchId=2 `;
    const [rows] = await db.query(sql);
    console.log(rows)
    res.send(rows);
  } catch (error) {
    console.log(error, "this is the error");
    res.status(500).send('Error fetching student details');
  }
});
module.exports = router;

