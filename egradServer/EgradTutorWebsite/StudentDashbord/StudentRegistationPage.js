const express = require("express");
const router = express.Router();
const db = require("../../DataBase/db2"); // Make sure db2 is your MySQL connection pool
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();



// Ensure the upload directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Check the file type
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

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

router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  { name: 'Proof', maxCount: 1 }
]), checkUserExistence, async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    // Validate files
    if (!files.photo || !files.signature || !files.Proof) {
      return res.status(400).send('Missing required files');
    }

    const photo = files.photo[0].filename;
    const signature = files.signature[0].filename;
    const proof = files.Proof[0].filename;
    const courseCreationId = data.courseCreationId;

    const sql = `INSERT INTO otsstudentregistation (candidateName, dateOfBirth, Gender, Category, emailId, confirmEmailId, contactNo, fatherName, occupation, mobileNo, line1, state, districts, pincode, edStatusId, NameOfCollege, passingYear, marks, UploadedPhoto, Signature, Proof, courseCreationId) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.candidateName, data.dateOfBirth, data.Gender, data.Category, data.emailId, data.confirmEmailId, data.contactNo,
      data.fatherName, data.occupation, data.mobileNo, data.line1, data.state, data.districts, data.pincode,
      data.qualification, data.NameOfCollege, data.passingYear, data.marks, photo, signature, proof, courseCreationId
    ];

    const [result] = await db.query(sql, values);
    const studentRegistrationId = result.insertId;

    // Send email with form data
    const mailOptions = {
      from: 'webdriveegate@gmail.com',
      to: data.emailId,
      subject: 'Registration Confirmation',
      text: `Thank you for registering. Here are your details:\n\n${JSON.stringify(data, null, 2)}`
    };

    await transporter.sendMail(mailOptions);

    // Generate credentials and send email
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const credentialsMailOptions = {
      from: 'webdriveegate@gmail.com',
      to: data.emailId,
      subject: 'Your Credentials',
      text: `Your login credentials:\n\nEmail: ${data.emailId}\nCode: ${password}`
    };

    await transporter.sendMail(credentialsMailOptions);

    // Save credentials in log table
    const logSql = `INSERT INTO log (username, email, password, role, studentregistationId) VALUES (?, ?, ?, ?, ?)`;
    const logValues = [data.candidateName, data.emailId, hashedPassword, 'User', studentRegistrationId];
    const [logResult] = await db.query(logSql, logValues);
    const userId = logResult.insertId;

    res.status(200).json({ message: 'Student registration data saved and emails sent', userId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving student registration data');
  }
});



// Check user route
router.post('/check-user', async (req, res) => {
  try {
    const { emailId, contactNo } = req.body;

    const checkSql = 'SELECT * FROM otsstudentregistation WHERE emailId = ? OR contactNo = ?';
    const [existingUsers] = await db.query(checkSql, [emailId, contactNo]);

    if (existingUsers.length > 0) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error checking user data');
  }
});

// Resend password endpoint
router.post('/resend-password', async (req, res) => {
  const { userId } = req.body;

  try {
    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await updateUserPassword(userId, hashedPassword);

    // Fetch the user's email
    const user = await getUserById(userId);

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
  const { userId, oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).send('New password and confirm password do not match');
  }

  try {
    // Fetch the user from the database
    const user = await getUserById(userId);

    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).send('User not found');
    }

    console.log(`User found: ${JSON.stringify(user)}`);

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      console.log(`Old password incorrect for user: ${userId}`);
      return res.status(400).send('Old password is incorrect');
    }

    // Check the number of password change attempts
    if (user.password_change_attempts >= 3) {
      const newPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      await updateUserPassword(userId, hashedPassword);
      await resetPasswordChangeAttempts(userId);

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
    await updateUserPassword(userId, hashedPassword);
    await incrementPasswordChangeAttempts(userId);

    res.send('Password updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Function to increment password change attempts
async function incrementPasswordChangeAttempts(userId) {
  const sql = 'UPDATE log SET password_change_attempts = password_change_attempts + 1 WHERE user_Id = ?';
  await db.query(sql, [userId]);
}

// Function to reset password change attempts
async function resetPasswordChangeAttempts(userId) {
  const sql = 'UPDATE log SET password_change_attempts = 0 WHERE user_Id = ?';
  await db.query(sql, [userId]);
}

// Function to get user by ID
async function getUserById(userId) {
  const sql = 'SELECT * FROM log WHERE user_Id = ?';
  const [rows] = await db.query(sql, [userId]);
  console.log(`Query result for user ID ${userId}: ${JSON.stringify(rows)}`);
  return rows[0];
}
// Function to update user password
async function updateUserPassword(userId, hashedPassword) {
  const sql = 'UPDATE log SET password = ? WHERE user_Id = ?';
  await db.query(sql, [hashedPassword, userId]);
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
