const express = require("express");
const router = express.Router();
const db = require("../../DataBase/db2"); // Make sure db2 is your MySQL connection pool
const multer = require('multer');
const path = require('path');
// const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();



// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  }
});

const upload = multer({ storage: storage });

// Ensure the uploads directory exists
const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir);
}
// // Ensure the upload directory exists
// if (!fs.existsSync('./uploads')) {
//   fs.mkdirSync('./uploads');
// }

// const storage = multer.diskStorage({
//   destination: './uploads',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
//   fileFilter: (req, file, cb) => {
//     // Check the file type
//     if (
//       file.mimetype === 'image/jpeg' ||
//       file.mimetype === 'image/png' ||
//       file.mimetype === 'application/pdf'
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error('Unsupported file type'), false);
//     }
//   }
// });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'webdriveegate@gmail.com',
    pass: 'qftimcrkpkbjugav' 
  }
});

// Helper function to generate random password
const generatePassword = () => {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%&*';
  let password = '';

  for (let i = 0; i < 2; i++) {
    password += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
  }
  for (let i = 0; i < 4; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  for (let i = 0; i < 2; i++) {
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  }
  return password;
};

// Middleware to check if user exists
const checkUserExistence = async (req, res, next) => {
  const { emailId, contactNo } = req.body;
  const checkSql = 'SELECT * FROM otsstudentregistation WHERE emailId = ? OR contactNo = ?';
  const [existingUsers] = await db.query(checkSql, [emailId, contactNo]);

  if (existingUsers.length > 0) {
    return res.status(409).json({ exists: true });
  }
  next();
};

// Register route

// router.post('/register', upload.fields([{ name: 'UplodadPhto' }, { name: 'Signature' }, { name: 'Proof' }]), async (req, res) => {
//   const studentData = req.body;
//   const files = req.files;

//   try {
//     const sql = `
//       INSERT INTO otsstudentregistation 
//       (candidateName, dateOfBirth, Gender, Category, emailId, confirmEmailId, contactNo, fatherName, occupation, mobileNo, line1, state, districts, pincode, qualifications, NameOfCollege, passingYear, marks, UplodadPhto, Signature, Proof, courseCreationId) 
//       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

//     const values = [
//       studentData.candidateName,
//       studentData.dateOfBirth,
//       studentData.Gender,
//       studentData.Category,
//       studentData.emailId,
//       studentData.confirmEmailId,
//       studentData.contactNo,
//       studentData.fatherName,
//       studentData.occupation,
//       studentData.mobileNo,
//       studentData.line1,
//       studentData.state,
//       studentData.districts,
//       studentData.pincode,
//       studentData.qualifications,
//       studentData.NameOfCollege,
//       studentData.passingYear,
//       studentData.marks,
//       files.UplodadPhto ? files.UplodadPhto[0].filename : null,
//       files.Signature ? files.Signature[0].filename : null,
//       files.Proof ? files.Proof[0].filename : null,
//       studentData.courseCreationId || null,
//     ];

//     const [result] = await db.execute(sql, values);
//     res.json({ success: true, message: 'Registration successful!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Database error' });
//   }
// });

router.post('/register', upload.fields([{ name: 'UplodadPhto' }, { name: 'Signature' }, { name: 'Proof' }]), async (req, res) => {
  const studentData = req.body;
  const files = req.files;

  try {
    // SQL query to insert student registration data
    const sql = `
      INSERT INTO otsstudentregistation 
      (candidateName, dateOfBirth, Gender, Category, emailId, confirmEmailId, contactNo, fatherName, occupation, mobileNo, line1, state, districts, pincode, qualifications, NameOfCollege, passingYear, marks, UplodadPhto, Signature, Proof, courseCreationId) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      studentData.candidateName,
      studentData.dateOfBirth,
      studentData.Gender,
      studentData.Category,
      studentData.emailId,
      studentData.confirmEmailId,
      studentData.contactNo,
      studentData.fatherName,
      studentData.occupation,
      studentData.mobileNo,
      studentData.line1,
      studentData.state,
      studentData.districts,
      studentData.pincode,
      studentData.qualifications,
      studentData.NameOfCollege,
      studentData.passingYear,
      studentData.marks,
      files.UplodadPhto ? files.UplodadPhto[0].filename : null,
      files.Signature ? files.Signature[0].filename : null,
      files.Proof ? files.Proof[0].filename : null,
      studentData.courseCreationId || null,
    ];

    const [result] = await db.execute(sql, values);

    // Generate random password
    const autoGeneratedPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(autoGeneratedPassword, 10);

    // Save candidate details in the log table
    const logSql = `
      INSERT INTO log (username, email, password, role, studentregistationId) 
      VALUES (?, ?, ?, ?, ?)`;

    const logValues = [
      studentData.candidateName,
      studentData.emailId,
      hashedPassword,
      'User',
      result.insertId
    ];

    const [logResult] = await db.execute(logSql, logValues);
    const user_Id = logResult.insertId;

    // Send email with the generated password
    const mailOptions = {
      from: 'webdriveegate@gmail.com',
      to: studentData.emailId,
      subject: 'Registration Successful',
      text: `Dear ${studentData.candidateName},\n\nYour registration is successful. Here is your auto-generated password: ${autoGeneratedPassword}\n\nPlease change your password after logging in for the first time.\n\nBest regards,\nYour Team`
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Registration successful and email sent!', user_Id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

router.get('/getUserById/:user_Id', async (req, res) => {
  const user_Id = req.params.user_Id;
  console.log('Received request to get user by ID:', user_Id);
  try {
    const sql = `SELECT * FROM log WHERE user_Id = ?`;
    const [rows] = await db.execute(sql, [user_Id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Check user route
router.post('/checkEmail', async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM otsstudentregistation WHERE emailId = ?',
      [email]
    );

    if (rows[0].count > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error checking email' });
  }
});
// Resend password endpoint
router.post('/resend-password', async (req, res) => {
  const { user_Id } = req.body;

  try {
    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await updateUserPassword(user_Id, hashedPassword);

    // Fetch the user's email
    const user = await getUserById(user_Id);

    // Send the new password via email
    const credentialsMailOptions = {
      from: 'webdriveegate@gmail.com',
      to: user.email,
      subject: 'Your New Code',
      text: `Your new login Code is: ${newPassword}`
    };

    await transporter.sendMail(credentialsMailOptions);

    res.send('New password sent to your registered email');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/change-password', async (req, res) => {
  const { user_Id, oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).send('New password and confirm password do not match');
  }

  try {
    // Fetch the user from the database
    const user = await getUserById(user_Id);

    if (!user) {
      console.log(`User not found: ${user_Id}`);
      return res.status(404).send('User not found');
    }

    console.log(`User found: ${JSON.stringify(user)}`);

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      console.log(`Old password incorrect for user: ${user_Id}`);
      return res.status(400).send('Old password is incorrect');
    }

    // Check the number of password change attempts
    if (user.password_change_attempts >= 3) {
      const newPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      await updateUserPassword(user_Id, hashedPassword);
      await resetPasswordChangeAttempts(user_Id);

      const credentialsMailOptions = {
        from: 'webdriveegate@gmail.com',
        to: user.email,
        subject: 'Your New Password',
        text: `You have reached the maximum number of attempts. Your new login password is: ${newPassword}`
      };

      await transporter.sendMail(credentialsMailOptions);

      return res.status(400).send('Maximum password change attempts reached. A new password has been sent to your registered email.');
    }

    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await updateUserPassword(user_Id, hashedPassword);
    await incrementPasswordChangeAttempts(user_Id);

    res.send('Password updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Function to increment password change attempts
async function incrementPasswordChangeAttempts(user_Id) {
  const sql = 'UPDATE log SET password_change_attempts = password_change_attempts + 1 WHERE user_Id = ?';
  await db.query(sql, [user_Id]);
}

// Function to reset password change attempts
async function resetPasswordChangeAttempts(user_Id) {
  const sql = 'UPDATE log SET password_change_attempts = 0 WHERE user_Id = ?';
  await db.query(sql, [user_Id]);
}

// Function to get user by ID
async function getUserById(user_Id) {
  const sql = 'SELECT * FROM log WHERE user_Id = ?';
  const [rows] = await db.query(sql, [user_Id]);
  console.log(`Query result for user ID ${user_Id}: ${JSON.stringify(rows)}`);
  return rows[0];
}
// Function to update user password
async function updateUserPassword(user_Id, hashedPassword) {
  const sql = 'UPDATE log SET password = ? WHERE user_Id = ?';
  await db.query(sql, [hashedPassword, user_Id]);
}




// Function to get user by email
async function getUserByEmail(email) {
  const sql = 'SELECT * FROM log WHERE email = ?';
  const [rows] = await db.query(sql, [email]);
  return rows[0];
}

// Function to update user password
async function updateUserPasswordByEmail(email, hashedPassword) {
  const sql = 'UPDATE log SET password = ? WHERE email = ?';
  await db.query(sql, [hashedPassword, email]);
}


// Send reset code
router.post('/send-reset-code', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Send email with the reset code
    const mailOptions = {
      from: 'webdriveegate@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`
    };

    await transporter.sendMail(mailOptions);

    // Save the code in the user record
    await db.query('UPDATE log SET reset_code = ? WHERE email = ?', [code, email]);

    res.send('Reset code sent to your email');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Reset password
// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  console.log('Reset password request:', { email, code, newPassword });

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).send('User not found');
    }

    console.log(`User found: ${JSON.stringify(user)}`);

    // Log the values for comparison
    console.log(`Comparing reset code for email: ${email}. Expected: ${user.reset_code}, Received: ${code}`);

    if (user.reset_code?.toString().trim() !== code.trim()) {
      console.log(`Invalid reset code for email: ${email}. Expected: ${user.reset_code}, Received: ${code}`);
      return res.status(400).send('Invalid reset code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateUserPasswordByEmail(email, hashedPassword);

    // Clear the reset code
    await db.query('UPDATE log SET reset_code = NULL WHERE email = ?', [email]);

    console.log(`Password reset successfully for email: ${email}`);
    res.send('Password reset successfully');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Server error');
  }
});





module.exports = router;
