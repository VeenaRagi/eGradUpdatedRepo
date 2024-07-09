const express = require("express");
const router = express.Router();
const db = require("../../DataBase/db2"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const CryptoJS = require('crypto-js');
const cors=require('cors')
router.use(cors());
router.use(cors({
  origin: 'http://localhost:3000', // Update to your client URL
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));
const secretKey=process.env.LOCAL_STORAGE_SECRET_KEY_FOR_USER_ID;
router.use(express.json());
router.options('*', cors()); // Enable preflight requests

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
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
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      // Generate JWT token
      const accessToken = jwt.sign({ user_Id: user.user_Id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generated for user:', user);
      const refreshToken = jwt.sign({ user_Id: user.user_Id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      console.log("refreshToken:",refreshToken,"accessToken: ",accessToken )
      console.log("sending detail are",user.user_Id,refreshToken,accessToken)
      res.json({user_Id: user.user_Id,refreshToken, accessToken, role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;
