import React, { useEffect, useState } from 'react';
import BASE_URL from '../../apiConfig'
const Image_Upload_for_Ac_ADMIN = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [course, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [test, setTest] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [examImage, setExamImage] = useState(null);
  const [courseImage, setCourseImage] = useState(null);
  const [testImage, setTestImage] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Imageupload/examforimeageupload`);
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error('Error fetching exam data:', error);
      }
    };

    fetchExams();
  }, []);

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  useEffect(() => {
    const fetchtest = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Imageupload/testsforimeageupload`);
        const data = await response.json();
        setTest(data);
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchtest();
  }, []);

  const handleTestChange = (event) => {
    setSelectedTest(event.target.value);
  };

  useEffect(() => {
    const fetchcourse = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Imageupload/courseforimeageupload`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchcourse();
  }, []);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleExamImageChange = (event) => {
    const file = event.target.files[0];
    setExamImage(file);
  };

  const handleCourseImageChange = (event) => {
    const file = event.target.files[0];
    setCourseImage(file);
  };

  const handleTestImageChange = (event) => {
    const file = event.target.files[0];
    setTestImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // FormData to append the file and other form data
    const examFormData = new FormData();
    examFormData.append('examId', selectedExam);
    examFormData.append('cardimeage', examImage);

    const courseFormData = new FormData();
    courseFormData.append('courseCreationId', selectedCourse);
    courseFormData.append('cardimeage', courseImage);

    const testFormData = new FormData();
    testFormData.append('testCreationTableId', selectedTest);
    testFormData.append('cardimeage', testImage);

    try {
        console.log('Uploading exam image:', selectedExam);
      const examResponse = await fetch(`${BASE_URL}/Imageupload/uploadImage`, {
        method: 'POST',
        body: examFormData,
      });

      const courseResponse = await fetch(`${BASE_URL}/Imageupload/uploadImage`, {
        method: 'POST',
        body: courseFormData,
      });

      const testResponse = await fetch(`${BASE_URL}/Imageupload/uploadImage`, {
        method: 'POST',
        body: testFormData,
      });

      if (examResponse.ok) {
        console.log('Exam image uploaded successfully');
        // Reset form fields if needed
        setSelectedExam('');
        setExamImage(null);
      } else {
        console.error('Failed to upload exam image');
      }

      if (courseResponse.ok) {
        console.log('Course image uploaded successfully');
        // Reset form fields if needed
        setSelectedCourse('');
        setCourseImage(null);
      } else {
        console.error('Failed to upload course image');
      }

      if (testResponse.ok) {
        console.log('Test image uploaded successfully');
        // Reset form fields if needed
        setSelectedTest('');
        setTestImage(null);
      } else {
        console.error('Failed to upload test image');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div className="create_exam_container otsMainPages">
      <h3 className="Coures_-otsTitels">Image Upload for Academic Admin</h3>
      <form onSubmit={handleSubmit}>
        <div className="examForm_Contant-container">
          <div className="Exams_contant examSubjects_-contant">
            <div className="formdiv_contaniner">
              <label htmlFor="examDropdown">Select Exam:</label>
              <select
                id="examDropdown"
                value={selectedExam}
                onChange={handleExamChange}
              >
                <option value="" disabled>
                  Select an exam
                </option>
                {exams.map((exam) => (
                  <option key={exam.examId} value={exam.examId}>
                    {exam.examName}
                  </option>
                ))}
              </select>
            </div>
            <div className="formdiv_contaniner">
              <label>Upload Exam Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleExamImageChange}
              />
            </div>
            <div className="formdiv_contaniner">
              <label htmlFor="courseDropdown">Select Course:</label>
              <select
                id="courseDropdown"
                value={selectedCourse}
                onChange={handleCourseChange}
              >
                <option value="" disabled>
                  Select a course
                </option>
                {course.map((course) => (
                  <option
                    key={course.courseCreationId}
                    value={course.courseCreationId}
                  >
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div className="formdiv_contaniner">
              <label>Upload Course Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCourseImageChange}
              />
            </div>
            <div className="formdiv_contaniner">
              <label htmlFor="testDropdown">Select Test:</label>

              <select
                id="testDropdown"
                value={selectedTest}
                onChange={handleTestChange}
              >
                <option value="" disabled>
                  Select a test
                </option>
                {test.map((test) => (
                  <option
                    key={test.testCreationTableId}
                    value={test.testCreationTableId}
                  >
                    {test.TestName}
                  </option>
                ))}
              </select>
            </div>
            <div className="formdiv_contaniner">
              <label>Upload Test Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleTestImageChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="ots_-createBtn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Image_Upload_for_Ac_ADMIN;
