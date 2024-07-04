const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');



router.post('/insert_exam_info', async (req, res) => {
    const { EntranceExams_Id, data } = req.body;

    const queries = {
        'Info_broucher': {
            table: 'information_broucher',
            column: 'Info_broucher_links',
            Info_id: '1'
        },
        'Official_Webpage': {
            table: 'official_webpage',
            column: 'Webpage_link',
            Info_id: '2'
        },
        'Conducting_Authority': {
            table: 'conducting_authority',
            column: 'Authority_Data',
            Info_id: '3'
        },
        'Exam_Pattern': {
            table: 'exam_pattern',
            column: 'Pattern_Data',
            Info_id: '4'
        },
        'Eligibility': {
            table: 'eligibility',
            column: 'Eligibility_Data',
            Info_id: '5'
        },
        'Syllabus': {
            table: 'syllabus',
            column: 'Syllabus_Link',
            Info_id: '6'
        },
        'Important_Dates': {
            table: 'important_dates',
            column: 'ImportantDates_data',
            Info_id: '7'
        }
    };

    try {
        console.log('Received data:', data);

        for (const [field, value] of Object.entries(data)) {
            const queryConfig = queries[field];

            if (!queryConfig) {
                console.error(`Invalid field: ${field}`);
                res.status(400).json({ error: `Invalid field: ${field}` });
                return;
            }

            const { table, column } = queryConfig;

            const query = `
                INSERT INTO ${table} (EntranceExams_Id, Info_id, ${column})
                VALUES (?, ?, ?)
            `;

            console.log(`Executing query: ${query} with values [${EntranceExams_Id}, ${queryConfig.Info_id}, ${value}]`);

            await db.query(query, [EntranceExams_Id, queryConfig.Info_id, value]);
        }

        res.status(200).json({ message: 'Information inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.put('/update_exam_info', async (req, res) => {
    const { EntranceExams_Id, data } = req.body;

    const queries = {
        'Info_broucher': {
            table: 'information_broucher',
            column: 'Info_broucher_links',
            Info_id: '1'
        },
        'Official_Webpage': {
            table: 'official_webpage',
            column: 'Webpage_link',
            Info_id: '2'
        },
        'Conducting_Authority': {
            table: 'conducting_authority',
            column: 'Authority_Data',
            Info_id: '3'
        },
        'Exam_Pattern': {
            table: 'exam_pattern',
            column: 'Pattern_Data',
            Info_id: '4'
        },
        'Eligibility': {
            table: 'eligibility',
            column: 'Eligibility_Data',
            Info_id: '5'
        },
        'Syllabus': {
            table: 'syllabus',
            column: 'Syllabus_Link',
            Info_id: '6'
        },
        'Important_Dates': {
            table: 'important_dates',
            column: 'ImportantDates_data',
            Info_id: '7'
        }
    };

    try {
        console.log('Received data:', data);

        for (const [field, value] of Object.entries(data)) {
            const queryConfig = queries[field];

            if (!queryConfig) {
                console.error(`Invalid field: ${field}`);
                res.status(400).json({ error: `Invalid field: ${field}` });
                return;
            }

            const { table, column } = queryConfig;

            const query = `
                UPDATE ${table}
                SET ${column} = ?
                WHERE EntranceExams_Id = ? AND Info_id = ?
            `;

            console.log(`Executing query: ${query} with values [${value}, ${EntranceExams_Id}, ${queryConfig.Info_id}]`);

            await db.query(query, [value, EntranceExams_Id, queryConfig.Info_id]);
        }

        res.status(200).json({ message: 'Information updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;