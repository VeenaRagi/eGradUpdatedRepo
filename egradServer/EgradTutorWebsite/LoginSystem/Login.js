const express = require("express");
const router = express.Router();
const db = require("../../DataBase/db2"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // console.log('Login request received:', { email, password });
  
    try {
      // Fetch user from the database by email
      const sql = 'SELECT user_Id,email,password,role FROM log WHERE email = ?';
      const [users] = await db.query(sql, [email]);
  
      if (users.length === 0) {
        // console.log('No user found with email:', email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const user = users[0];
    //   console.log('User found:', user);
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        // console.log('Password mismatch for user:', user);
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const accesToken = jwt.sign({ user_Id: user.user_Id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generated for user:', user);
      const refreshToken = jwt.sign({ user_Id: user.user_Id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      console.log("refreshToken:",refreshToken,"accessToken: ",accesToken )
      res.json({user_Id:user.user_Id,refreshToken, accesToken, role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


//   router.post('/refresh-token', async (req, res) => {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//         return res.status(401).json({ message: 'Refresh token is required' });
//     }

//     try {
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//             if (err) {
//                 return res.status(403).json({ message: 'Invalid refresh token' });
//             }

//             // Generate a new access token
//             const newAccessToken = jwt.sign({ user_Id: user.user_Id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
//             res.json({ accessToken: newAccessToken });
//         });
//     } catch (error) {
//         console.error('Error during token refresh:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Secret Key:', secretKey);

module.exports = router;
