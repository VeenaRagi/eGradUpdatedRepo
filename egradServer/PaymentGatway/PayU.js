const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");
const crypto = require("crypto");
// const path = require('path');
// const __dirname = path.resolve();
// const{key,SALT_KEY} = require('../client/src/component/test');
const key = "2RJzQH";
const SALT_KEY = "WSRuqJafAmgvQ22Ztmzhixel1fTlZhgg";
const jsSHA = require("jssha");
const axios = require("axios");
const multer = require("multer");
const upload = multer();
const nodemailer = require("nodemailer");
 PAYU_BASE_URL = "https://pmny.in/AJw4GvcdzI8V";

router.post("/hash", async (req, res) => {
  try {
    const {
      name,
      email,
      amount,
      productinfo,
      transactionId,
      courseCreationId,
    } = req.body;
    const data = {
      key: "2RJzQH",
      salt: "WSRuqJafAmgvQ22Ztmzhixel1fTlZhgg",
      txnid: transactionId,
      amount: amount,
      productinfo: "TEST PRODUCT",
      firstname: name,
      email: email,
      courseCreationId: courseCreationId,
      surl: "/success",
      furl: "/failure",
      udf1: "details1",
      udf2: "details2",
      udf3: "details3",
      udf4: "details4",
      udf5: "details5",
    };

    const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}||||||${data.salt}`;

    // Using crypto library
    const cryp = crypto.createHash("sha512");
    cryp.update(hashString);
    const hash = cryp.digest("hex");

    // Using jsSHA library
    const sha = new jsSHA("SHA-512", "TEXT");
    sha.update(hashString);
    const hashJsSHA = sha.getHash("HEX");

    console.log("Generated Hash:", hash);
    return res.status(200).send({
      hash: hash,
      hashJsSHA: hashJsSHA,
      transactionId: transactionId,
      surl: data.surl,
      furl: data.furl,
    });
  } catch (error) {
    console.error("Error in /hash route:", error);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

router.post("/success", async (req, res) => {
  try {
    const userEmail = req.body.email; // Assuming email is in req.body.email
    const name = req.body.name;

    // Create a Nodemailer transporter using your email service credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "egradtutorweb@gmail.com", // Your email address
        pass: "zzwj ffce jrbn tlhs", // Your email password
      },
    });

    // Set up the email options
    const mailOptions = {
      from: "egradtutorweb@gmail.com", // Sender email address
      to: userEmail, // Receiver email address (user's email)
      subject: "Payment Successful", // Subject of the email
      html: `
        <h1>Payment Successful</h1>
        <b>Your course will be activated within the next 48 hours.</b>
        <p>If you have any questions or need assistance, our dedicated support team is here to help. Don't hesitate to reach out to us at <a href="mailto:egradtutor@gmail.com">egradtutor@gmail.com</a>. We're always happy to assist you!</p>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send({
          error: "Internal Server Error",
        });
      } else {
        console.log("Email sent:", info.response);
        const successHtml = `
          <!DOCTYPE html>
          <html>
          <head>
              <title>Payment Successful</title>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f0f0f0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      margin: 0;
                  }
 
                  .content {
                      text-align: center;
                  }
 
                  h1 {
                      color: #333;
                  }
 
                  p {
                      color: #666;
                  }
 
                  button {
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: #fff;
                      border: none;
                      cursor: pointer;
                      border-radius: 5px;
                      margin-top: 20px;
                  }
 
                  button:hover {
                      background-color: #0056b3;
                  }
              </style>
          </head>
          <body>
              <div class="content">
                  <i class="fas fa-check-circle" style="font-size: 6rem; color: rgb(144, 238, 144);"></i>
                  <h1>Payment Successful</h1>
                  <b>Your course will be activated within the next 48 hours.</b>
                  <p>If you have any questions or need assistance, our dedicated support team is here to help. Don't hesitate to reach out to us at <a href="mailto:egradtutor@gmail.com">egradtutor@gmail.com</a>. We're always happy to assist you!</p>
                   <button id="redirectButton">Continue</button>
              </div>
 
              <script>
              document.getElementById('redirectButton').addEventListener('click', function() {
                  window.location.href = 'http://localhost:3000/Student_dashboard/:decryptedUserIdState';
              });
          </script>
          </body>
          </html>
        `;
        return res.status(200).send(successHtml);
      }
    });

    // Define courseCreationId here
    const getUserIdQuery = `
    SELECT l.user_id, l.studentregistationId,sbc.courseCreationId
    FROM log l
    left join student_buy_courses AS sbc ON l.studentregistationId=sbc.studentregistationId
      WHERE l.email = ?
    `;
    const [userData] = await db.query(getUserIdQuery, [userEmail]);

    if (!userData || userData.length === 0) {
      console.log("User not found");
      return res.status(404).send({ error: "User not found" });
    }
    const courseCreationId = userData[0].courseCreationId;
    const userId = userData[0].user_id;
    const studentRegistrationId = userData[0].studentregistationId;

    console.log(userId, studentRegistrationId, courseCreationId);

    // Update payment status if payment is successful
    const updatePaymentStatusQuery = `
  UPDATE student_buy_courses
  SET payu_status = "paid"
  WHERE user_id = ? AND courseCreationId = ? AND studentregistationId = ?
`;
    const updatePaymentStatusValues = [
      userId,
      courseCreationId,
      studentRegistrationId,
    ];

    try {
      await db.query(updatePaymentStatusQuery, updatePaymentStatusValues);
      console.log(
        "Payment status updated successfully:",
        updatePaymentStatusValues
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }

    // Check if payment status was updated successfully
    const checkUpdateQuery = `
  SELECT *
  FROM student_buy_courses
  WHERE user_id = ? AND courseCreationId = ? AND studentregistationId = ? AND payu_status = "paid"
`;

    const [updatedData] = await db.query(
      checkUpdateQuery,
      updatePaymentStatusValues
    );

    if (!updatedData || updatedData.length === 0) {
      console.log("Payment status not updated");
      return res.status(500).send({ error: "Payment status not updated" });
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/failure", async (req, res) => {
  try {
    console.log("Payment failed:", req.body);

    // Extract user email from the form or any other source
    const userEmail = req.body.email; // Assuming email is in req.body.email
    const name = req.body.name;
    // Create a Nodemailer transporter using your email service credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "egradtutorweb@gmail.com", // Your email address
        pass: "zzwj ffce jrbn tlhs", // Your email password
      },
    });

    // Set up the email options
    const mailOptions = {
      from: "egradtutorweb@gmail.com", // Sender email address
      to: userEmail, // Receiver email address (user's email)
      subject: "Payment Failure", // Subject of the email
      text: "Your payment has failed. Please try again.",
      name: name,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send({
          error: "Internal Server Error",
        });
      } else {
        console.log("Email sent:", info.response);
        res.send("Payment failed. Email sent to user.");
      }
    });
  } catch (error) {
    console.error("Error in /failure route:", error);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
