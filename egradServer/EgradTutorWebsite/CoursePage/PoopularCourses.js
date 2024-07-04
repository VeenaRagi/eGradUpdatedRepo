const express= require('express')
const router=express.Router();
const db=require('../../DataBase/db2')


router.get('/unPurchasedCoursesOnHomePage/:Portale_Id',async(req,res)=>{
    const { Portale_Id } = req.params; 
    const query=`SELECT
    cct.courseCreationId,
    cct.Portale_Id,
    cct.courseName,
    cct.courseStartDate,
    cct.courseEndDate,
    cct.totalPrice,
    cct.cost,
    cct.Discount,    
    e.examId,
    e.examName,
    cct.cardImage,
    p.Portale_Id,
    p.Portale_Name,
    COUNT(DISTINCT tct.testCreationTableId) AS testCount,
    GROUP_CONCAT(s.subjectName) AS subjectNames,
    t.topicName
FROM
    course_creation_table cct
LEFT JOIN exams e ON
    e.examId = cct.examId
LEFT JOIN portales p ON
    p.Portale_Id = cct.Portale_Id
LEFT JOIN course_subjects cs ON
    cs.courseCreationId = cct.courseCreationId
LEFT JOIN subjects s ON
    cs.subjectId = s.subjectId 
LEFT JOIN test_creation_table tct ON
    tct.courseCreationId = cct.courseCreationId
LEFT JOIN topics t ON
    t.courseCreationId = cct.courseCreationId
WHERE
    cct.Portale_Id = ? 
GROUP BY
    cct.courseCreationId;
`

const [results, fields] = await db.execute(query, [Portale_Id]);
const organizedData = {};
results.forEach((result) => {
    const cardImage = result.cardImage ? `data:image/png;base64,${result.cardImage.toString("base64")}` : null;

    const courseId = result.courseCreationId;
    const Portale_Id = result.Portale_Id;

    // Define properties based on portalId
    const properties = {
      Portale_Id: Portale_Id,
      portal: result.Portale_Name,
      examId: result.examId,
      examName: result.examName,
      courseCreationId: result.courseCreationId,
      courseName: result.courseName,
      courseStartDate: result.courseStartDate,
      courseEndDate: result.courseEndDate,
      totalPrice: result.totalPrice,
      discount: result.Discount,
      ActualtotalPrice: result.cost,
      courseCardImage: cardImage,
      testCount: result.testCount,
      subjectNames: result.subjectNames,
      customName: Portale_Id === 4 ? "OTS,OVL,PQB" : null,
      ...(Portale_Id === 4 && { topicName: `(TopicName:${result.topicName})` }),
    };

  

    // Assign properties to organizedData
    organizedData[courseId] = properties;
  });
  res.json(Object.values(organizedData));


})

router.get('/unPurchasedCoursesBuyNow/:courseCreationId', async (req, res) => {
    const { courseCreationId } = req.params;
  
    const query = `
      SELECT
        cct.courseCreationId,
        cct.courseName,
        cct.Portale_Id,
        cct.courseStartDate,
        cct.courseEndDate,  
        e.examId,
        e.examName,
        s.subjectName,
        t.topicName,
        COUNT(DISTINCT CASE WHEN cct.Portale_Id = 3 THEN ol.Drive_Link END) AS videocount,
        COUNT(DISTINCT CASE WHEN cct.Portale_Id IN (1, 2) THEN tct.testCreationTableId END) AS testCount
      FROM
        course_creation_table cct
      LEFT JOIN exams e ON e.examId = cct.examId
      LEFT JOIN course_subjects cs ON cs.courseCreationId = cct.courseCreationId
      LEFT JOIN subjects s ON cs.subjectId = s.subjectId 
      LEFT JOIN test_creation_table tct ON tct.courseCreationId = cct.courseCreationId
      LEFT JOIN topics t ON t.courseCreationId = cct.courseCreationId
      LEFT JOIN ovl_links ol ON ol.courseCreationId = cct.courseCreationId
      WHERE
        cct.courseCreationId = ?
      GROUP BY
        cct.courseCreationId, s.subjectName;
    `;
  
    try {
      const [results, fields] = await db.execute(query, [courseCreationId]);
      const organizedData = {};
      const subjectSet = new Set();
  
      results.forEach((result) => {
        const courseId = result.courseCreationId;
  
        // Add subject name to the set if it's not already present
        if (result.subjectName) {
          subjectSet.add(result.subjectName);
        }
  
        // Determine the count value based on Portale_Id
        let count;
        if (result.Portale_Id === 3) {
          count = result.videocount;
        } else if (result.Portale_Id === 1 || result.Portale_Id === 2) {
          count = result.testCount;
        } else {
          count = 0; // Default value if Portale_Id doesn't match any condition
        }
  
        const properties = {
          examId: result.examId,
          examName: result.examName,
          courseCreationId: result.courseCreationId,
          courseName: result.courseName,
          courseStartDate: result.courseStartDate,
          courseEndDate: result.courseEndDate,
          count: count,
          subjectNames: Array.from(subjectSet).join(', '),
        };
  
        organizedData[courseId] = properties;
      });
  
      console.log(organizedData);
      res.json(Object.values(organizedData));
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

module.exports= router;