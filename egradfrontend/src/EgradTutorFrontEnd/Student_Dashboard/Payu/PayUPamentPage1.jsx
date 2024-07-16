import React,{ useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PayUPamentPage1 = ({ setToggle, form, hash, transactionId }) => {
  // useEffect(() => {
  //   // You can perform additional logic here if needed

  //   // Redirect to the success page
  //   window.location.href = 'https://www.egradtutor.in/success'; // Update with your actual success page URL
  // }, []);
 const { courseCreationId } = useParams();

 const [courseData, setCourseData] = useState([]);
 // const [courseCreationId] = useParams();
 useEffect(() => {
   fetchcourse();
 }, [courseCreationId]);

 const fetchcourse = async () => {
   try {
     const response = await fetch(
       `http://localhost:5001/StudentRegistationPage/coursedataSRP/${courseCreationId}`
     );
     const data = await response.json();
     setCourseData(data);
     console.log(data);
   } catch (error) {
     console.error("Error fetching course data:", error);
   }
 };
  return (
    <div className="payudetaile_conatiner">
      <div className="payudetaile_subconatiner">
        <h4>Details</h4>
        <div>
          <p>
            {courseData.map((course) => (
              <label>
                {/* <p>EXAM: {course.examName}</p>
              <p>SESSION: {course.courseYear}</p> */}
                <lable id="_payu_courses" key={course.courseCreationId}>
                  Course Name: <span>{course.courseName}.</span>
                </lable>
                {/* <p>SUBJECTS :{course.subjects.join(", ")}</p> */}
              </label>
            ))}
          </p>

          <p>
           Candidate Name: <span>{form?.name}</span>{" "}
          </p>

          {/* <span>Date of Birth: {form?.date}</span><br/> */}
          <p>
            Contact Number: <span>{form?.number}</span>{" "}
          </p>

          {/* <span>Mother's Name:{form?.mothername}</span><br/> */}
          {/* <span>Father's Name:{form?.fathername}</span><br/> */}
          {/* <span> Parents Contact No:{form?.contactno}</span><br/> */}
          {/* <span>Postal Address:{form?.address}</span><br/> */}
          <p>
            Email ID: <span>{form?.email}</span>
          </p>

          {/* <span>College of Study:{form?.college} </span><br/> */}
          {/* <span>Pay Amount: {form?.amount}</span> */}
        </div>
        <form action="https://secure.payu.in/_payment" method="POST">
          <input type="hidden" name="key" value="2RJzQH" />
          <input type="hidden" name="txnid" value={transactionId} />
          <input type="hidden" name="amount" value={form?.amount} />
          <input type="hidden" name="productinfo" value="TEST PRODUCT" />
          <input type="hidden" name="firstname" value={form?.name} />
          <input type="hidden" name="email" value={form?.email} />
          <input
            type="hidden"
            name="surl"
            value="http://localhost:5001/PayU/success/"
          />
          <input
            type="hidden"
            name="furl"
            value="http://localhost:5001/PayU/failure"
          />
          <input type="hidden" name="udf1" value={"details1"} />
          <input type="hidden" name="udf2" value={"details2"} />
          <input type="hidden" name="udf3" value={"details3"} />
          <input type="hidden" name="udf4" value={"details4"} />
          <input type="hidden" name="udf5" value={"details5"} />
          <input type="hidden" name="hash" value={hash} />
          <div>
            <button
              type="button"
              onClick={() => {
                setToggle(1);
              }}
            >
              Back
            </button>
            <button type="submit">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default PayUPamentPage1;