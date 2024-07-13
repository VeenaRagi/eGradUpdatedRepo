const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2'); // Assuming db is your database connection

router.get('/fetchAdmindata', async (req, res) => {
    try {
        const sql = `
            SELECT log.*, ap.adminProfile
            FROM log AS log
            LEFT JOIN adminprofile AS ap ON ap.user_Id = log.user_Id
            WHERE log.role = 'Admin'
        `;
        const [rows] = await db.query(sql);
        console.log(rows); // Logging the fetched admin data
        res.json(rows); // Sending the fetched admin data as JSON response
    } catch (error) {
        console.error('Error fetching admin data:', error);
        res.status(500).send('Error fetching admin details');
    }
});

module.exports = router;
