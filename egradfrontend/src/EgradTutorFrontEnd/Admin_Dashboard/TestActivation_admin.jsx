
import React, { useState, useEffect } from 'react';
import "./Styles/TestActivation_admin.css";
import BASE_URL from '../../apiConfig'
const TestActivation_admin = ({ testCreationTableId }) => {
  const [tests, setTests] = useState([]);
  const [activationStates, setActivationStates] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, [testCreationTableId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/TestActivationPage/TestActivation/${testCreationTableId}`);
      const data = await response.json();
      console.log('Fetched Data:', data);
  
      // Initialize activation states with default values
      const initialActivationStates = {};
      data.forEach(test => {
        initialActivationStates[test.testCreationTableId] = parseInt(test.status, 10) === 1;
      });
  
      console.log('Initial Activation States:', initialActivationStates);
      setActivationStates(initialActivationStates);
      setTests(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleDropdownChange = async (testId, value) => {
    console.log('Handling dropdown change for testId:', testId);
  
    // Check if the test has TotalQuestions
    const testWithTotalQuestions = tests.find(test => test.testCreationTableId === testId && test.TotalQuestions > 0);
  
    console.log('Test with TotalQuestions:', testWithTotalQuestions);
  
    if (testWithTotalQuestions) {
      try {
        // Fetch the count of questions for the test from the database
        const questionCountResponse = await fetch(`${BASE_URL}/TestCreation/getQuestionCountForTest/${testId}`);
        const questionCountResult = await questionCountResponse.json();
  
        const questionCount = questionCountResult.count;
  
        // Compare the question count with TotalQuestions
        if (questionCount === testWithTotalQuestions.TotalQuestions) {
          // If counts are equal, proceed with activation
          const response = await fetch(`${BASE_URL}/TestActivationPage/updateTestActivationStatus/${testId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: value === 'Yes' ? 1 : 0 }),
          });
  
          const result = await response.json();
          console.log('API Response:', result);
  
          if (result.success) {
            setActivationStates(prevStates => ({
              ...prevStates,
              [testId]: value === 'Yes',
            }));
          } else {
            console.log('Failed to update activation state.');
          }
        } else {
          // If counts are not equal, show an alert
          alert('Question count does not match TotalQuestions. Cannot activate the test.');
        }
      } catch (error) {
        console.error('Error updating activation state:', error);
      }
    } else {
      console.log('Activation not allowed. Test does not have TotalQuestions.');
    }
  };
  

  // Filter tests based on selected status
  const filteredTests = tests.filter(test => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'active') return activationStates[test.testCreationTableId];
    if (selectedStatus === 'inactive') return !activationStates[test.testCreationTableId];
    return false;
  });

  return (
    <div>
      <div className='Test_Activation_Admin_conatiner'>
        <h2>Test Activation Admin</h2>

        <div className='Menu_Bar'>
          <span
            className={selectedStatus === 'all' ? 'active' : ''}
            onClick={() => handleStatusChange('all')}
          >
            All
          </span>
          <span
            className={selectedStatus === 'active' ? 'active' : ''}
            onClick={() => handleStatusChange('active')}
          >
            Active
          </span>
          <span
            className={selectedStatus === 'inactive' ? 'active' : ''}
            onClick={() => handleStatusChange('inactive')}
          >
            Inactive
          </span>
        </div>

        <div className='Test_Activation_Admin_subconatiner'>
          {filteredTests.map(test => (
            <div className='Test_Activation_Admin_ecahcard' key={test.testCreationTableId}>
              <h3>{test.TestName}</h3>

              <div className='Test_Activation_Admin_ecahcard_info'>
                {test.subjects.map(subject => (
                  <div className='Test_Activation_Admin_ecahcard_subjectName' key={subject.subjectId}>
                    <span>{subject.subjectName}<p>({subject.numberOfQuestionsInSubject})</p></span>
                    {subject.sections.map(section => (
                      <div className='Test_Activation_Admin_ecahcard_section_quntion' key={section.sectionId}>
                        <p>{section.sectionName}</p>
                        <p title={section.numberOfQuestions}>{section.numberOfQuestionsInSection}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className='Dropdown'>
                <label htmlFor={`dropdown-${test.testCreationTableId}`}>Activate Test:</label>
                <select
                  id={`dropdown-${test.testCreationTableId}`}
                  onChange={(e) => handleDropdownChange(test.testCreationTableId, e.target.value)}
                  value={activationStates[test.testCreationTableId] ? 'Yes' : 'No'}
                >
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestActivation_admin;


