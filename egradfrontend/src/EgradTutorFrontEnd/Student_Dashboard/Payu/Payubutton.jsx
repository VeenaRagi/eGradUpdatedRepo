import React,{useState} from 'react'
import axios from "axios";
const PAYU_BASE_URL = 'https://pmny.in/6rKJacqZnitG';

const Payubutton = () => {
    const [form, setForm] = useState({ name: '', email: '', number: '', amount: 0 });
    const [transactionId, setTransactionId] = useState(null);

    function generateTransactionID() {
        const timeStamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000000);
        const merchantPrefix = 'T';
        const transactionId = `${merchantPrefix}${timeStamp}${randomNum}`;
        setTransactionId(transactionId);
      }
      
    const handleSubmit = (e) => {
        e.preventDefault();
        
    
     const payULink = `${PAYU_BASE_URL}?amount=${form.amount}&name=${form.name}&email=${form.email}&transactionId=${transactionId}&other_parameters=...`;
    
        window.location.href = payULink;
    
        axios.post('http://localhost:5001/submitForm', { ...form, transactionId: transactionId })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
        
      };
  return (
    <div>
        <div> <a  className='style'  href='https://pmny.in/6rKJacqZnitG' > Buy Now </a> </div>
    </div>
  )
}

export default Payubutton