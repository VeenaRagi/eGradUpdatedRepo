import React,{ useEffect } from 'react';

const PayUPamentPage1 = ({ setToggle, form, hash, transactionId }) => {
  // useEffect(() => {
  //   // You can perform additional logic here if needed

  //   // Redirect to the success page
  //   window.location.href = 'https://www.egradtutor.in/success'; // Update with your actual success page URL
  // }, []);

  return (
    <div>
      <div>
        <h4>Details</h4>
        <div>
          <span>Product Name: Test Product</span><br/>

          <span>Name: {formData.candidateName}</span><br/>
          <span>Date of Birth: {formData.dateOfBirth}</span><br/>
          <span>Number: {formData.number}</span><br/>
          <span>Mother's Name:{formData.mothername}</span><br/>
          <span>Father's Name:{formData.fathername}</span><br/>
          <span> Parents Contact No:{formData.contactno}</span><br/>
          <span>Postal Address:{formData.address}</span><br/>
          <span>Gmail ID:{formData.emailId}</span><br/>
          <span>College of Study:{formData.college} </span><br/>
          {/* <span>Pay Amount: {form?.amount}</span> */}
        </div>
        <form action="https://secure.payu.in/_payment" method="POST">
          <input type="hidden" name="key" value="2RJzQH" />
          <input type="hidden" name="txnid" value={transactionId} />
          <input type="hidden" name="amount" value={form?.amount} />
          <input type="hidden" name="productinfo" value="TEST PRODUCT" />
          <input type="hidden" name="firstname" value={form?.name} />
          <input type="hidden" name="email" value={form?.email} />
          <input type="hidden" name="surl" value="http://localhost:5001/PayU/success" />
          <input type="hidden" name="furl" value="http://localhost:5001/PayU/failure" />
          <input type="hidden" name="udf1" value={'details1'} />
          <input type="hidden" name="udf2" value={'details2'} />
          <input type="hidden" name="udf3" value={'details3'} />
          <input type="hidden" name="udf4" value={'details4'} />
          <input type="hidden" name="udf5" value={'details5'} />
          <input type="hidden" name="hash" value={hash} />
          <button type="button" onClick={() => { setToggle(1) }}>Back</button>
          <button type="submit">Pay Now</button>
        </form>
      </div>
    </div>
  );
};
 
export default PayUPamentPage1;