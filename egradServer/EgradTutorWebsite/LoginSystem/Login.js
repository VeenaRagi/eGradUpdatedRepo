const express = require("express");
const router = express.Router();
const db = require("../../DataBase/db2"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const CryptoJS = require('crypto-js');
const cors=require('cors');
const { encryptData, decryptData } = require("../../CryptoUtils/Utils");
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
      const encryptedUserId=encryptData(user.user_Id.toString())
      console.log("sending detail are",encryptedUserId,refreshToken,accessToken)
      res.json({user_Id: encryptedUserId,refreshToken, accessToken, role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  router.get('/userDecryptedId', async (req, res) => {
    const { encryptedUserId } = req.query;
    console.log(encryptedUserId,"this is the encrypted user id from the frontend")
    try {
        // Decrypt user ID
        const userId = decryptData(encryptedUserId);
      console.log(userId,"this is the decrypted user id")
        if (!userId) {
            return res.status(400).json({ message: 'Invalid or missing user ID' });
        }
        // Retrieve user details from the database
        const sql = 'SELECT * FROM log WHERE user_Id = ?';
        const [users] = await db.query(sql, [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(users)
        // const user = users[0];
        res.json({ userId, users });
    } catch (error) {
        console.error('Error retrieving user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
