import React,{useEffect,useState} from 'react';
import axios from "axios";
import PayUPamentPage1 from "./PayUPamentPage1"
import './payu.css'
import { useParams } from 'react-router-dom';
// const PAYU_BASE_URL = 'https://pmny.in/6rKJacqZnitG';
const Payu =() =>{
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

  console.log(courseCreationId);

      const [form, setForm] = useState({
        name: "",
        email: "",
        number: "",
        amount: 1,
        courseCreationId: courseCreationId,
      });
      console.log(form)
    const [toggle, setToggle] = useState(true);
    const [hash, setHash] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const handleChange = (e) => {
            if (e.target.name === 'amount') {
              setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });
            } else {
              setForm({ ...form, [e.target.name]: e.target.value });
            }
          };

          function generateTransactionID() {
    const timeStamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const merchantPrefix = 'T';
    const transactionId = `${merchantPrefix}${timeStamp}${randomNum}`;
    setTransactionId(transactionId);
  }

  const handleSubmit = (e) => {
        e.preventDefault();
        getHash();
    setToggle(2);
    
  }

  const getHash = () => {
        axios
          .post(
            "http://localhost:5001/PayU/hash",
            { ...form, transactionId: transactionId },
            { courseCreationId: courseData.courseCreationId }
          )
          .then((res) => {
            setHash(res.data.hash);
            setTransactionId(res.data.transactionId);
            console.log("Generated Hash (Client Side):", res.data.hash);
          })
          .catch((error) => {
            console.error(error);
          });
        }
   useEffect(() => {
               generateTransactionID()
  }, []);
   
  return (
    <>
      {toggle && (
        <div className="payujsx_container">
          <h1>eGradTutor</h1>

          {courseData.map((course) => (
            <div id="_payu_courses" key={course.courseCreationId}>
              <p>Payment for {course.courseName} fill the details</p>
            </div>
          ))}

          <div className="payujsx_form_container">
            <form onSubmit={handleSubmit}>
              <div>
                <label className="payulabel">Candidate Name:
                <br /><small>(According to X standard)</small></label>
                <input
                  className="payuinput"
                  value={form.name}
                  required
                  type="text"
                  name="name"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="payulabel">Contact Number</label>
                <input
                  className="payuinput"
                  value={form?.number}
                  required
                  type="text"
                  name="number"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="payulabel">Email ID</label>
                <input
                  className="payuinput"
                  value={form?.email}
                  required
                  type="text"
                  name="email"
                  onChange={handleChange}
                />
              </div> 
              <div>
                <label className="payulabel">Amount</label>
                <span className="payuinput">{form.amount}</span>
              </div>
              <button className="payubutton" type="submit">
                submit
              </button>
            </form>
          </div>
        </div>
      )}
      {toggle === 2 && (
        <PayUPamentPage1
          setToggle={setToggle}
          form={form}
          hash={hash}
          transactionId={transactionId}
        />
      )}
    </>
  );

}

export default Payu