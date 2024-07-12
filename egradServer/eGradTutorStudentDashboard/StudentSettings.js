const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");
const nodemailer = require("nodemailer");
// const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const expiryTimeForOTP=new Date(Date.now()+10*60*1000)
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "webdriveegate@gmail.com",
      pass: "qftimcrkpkbjugav",
    },
  });

  const mailOptions = {
    from: "webdriveegate@gmail.com",
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

const storeOtpForUser = async (userId, otp,expiryTime) => {
  // Store OTP in the database associated with the user
// const 
  try {
    const sql = `
  INSERT INTO log (user_Id, reset_code, otp_expiry) 
  VALUES (?, ?, ?) 
  ON DUPLICATE KEY UPDATE 
    reset_code = VALUES(reset_code), 
    otp_expiry = VALUES(otp_expiry)
`;
const [rows] = await db.query(sql, [userId, otp, expiryTime]);

console.log(rows, "OTP stored or updated successfully");

  } catch (error) {
    console.log(error);
  }
};

router.post("/changePasswordUsingOTP/:decryptedUserId", async (req, res) => {
  const { decryptedUserId } = req.params;
  console.log(decryptedUserId, "this is the user id from frontend");
  const sqlforEmailId = "select email from log where user_Id=?";
  const [rows] = await db.query(sqlforEmailId, [decryptedUserId]);
  console.log(
    rows[0].email,
    "This is the email id for the user who wants to change password"
  );
  const userEmailId = rows[0].email;
  if (!userEmailId) {
    console.log("User not found");
    return res.status(404).send("User not found");
  }
  // 6 digit number will be generated
  const otp = generateOtp();
  await sendOtpEmail(userEmailId, otp);
  await storeOtpForUser(decryptedUserId, otp,expiryTimeForOTP);
  res.status(200).send("OTP sent successfully");
});

//----------verify OTP----------
router.post("/verifyOTP", async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    console.log(userId, otp, newPassword, "these are form body");
    const numericOTP = Number(otp);
    const sql = "SELECT reset_code,otp_expiry FROM log WHERE user_Id = ?";
    const [rows] = await db.query(sql, [userId]);

    if (rows.length === 0) {
      return res.status(400).send("Invalid user ID");
    }

    console.log(rows[0].reset_code, "rows from backend");
    console.log(rows[0].otp_expiry,"This is the expiry time for the otp from backend");

    if (rows[0].reset_code !== numericOTP) {
      return res.status(400).send("Invalid OTP");
    }
    const currentTime = new Date();
    if(currentTime> new Date(rows[0].otp_expiry)){
      return res.status(400).send("OTP Expired")
    }

    //  hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log(hashedPassword, "for", newPassword);
    // Update password in the log table
    const queryForUpdatePassword =
      "UPDATE log SET password = ? WHERE user_Id = ?";
    const [updatedRows] = await db.query(queryForUpdatePassword, [
      hashedPassword,
      userId,
    ]);

    if (updatedRows.affectedRows === 0) {
      return res.status(500).send("Failed to update password");
    }

    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.log(error, "error happened in verifyOTP");
    res.status(500).send("An error occurred");
  }
});

// -----------------------------

module.exports = router;
