import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import BASE_URL from '../../apiConfig';
import '../../EgradTutorFrontEnd/EgradtutorPortalsAdmin/styles/Account_info.css'

Modal.setAppElement('#root'); // Set the root element for accessibility

const AccountInfo = () => {
  const [userData, setUserData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isCourseModal, setIsCourseModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ughomepage_banner_login/fetchStudentDetails`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching student details', error);
      }
    };

    fetchData();
  }, []);

  const openModal = (user, isCourseModal) => {
    setSelectedUser(user);
    setIsCourseModal(isCourseModal);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedCourses([]);
    setIsCourseModal(false);
    setModalIsOpen(false);
  };

  const fetchCourseDetails = async (user_Id) => {
    try {
      const response = await axios.get(`${BASE_URL}/ughomepage_banner_login/getregisterid/${user_Id}`);
      setSelectedCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses', error);
    }
  };

  const openCourseModal = async (user) => {
    await fetchCourseDetails(user.user_Id);
    openModal(user, true);
  };

  const handleChangeactivcourse = (user_Id, studentregistationId, courseCreationId, userEmail) => async (e) => {
    try {
      const selectedValue = e.target.value;

      if (selectedValue === "Activate") {
        const response = await axios.put(
          `http://localhost:5001/Exam_Course_Page/updatePaymentStatusactive/${user_Id}/${studentregistationId}/${courseCreationId}`,
          { email: userEmail }
        );
        console.log(response.data);
      }

      if (selectedValue === "Inactive") {
        const response = await axios.put(
          `http://localhost:5001/Exam_Course_Page/updatePaymentStatusinactive/${user_Id}/${studentregistationId}/${courseCreationId}`,
          { email: userEmail }
        );
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div className='admin_account_info_container'>
      <h1 className='no_data_info_for_admin_account_info_header'>Account Information</h1>
      {userData.length === 0 ? (
        <p className='no_data_info_for_admin_account_info_para'>No user data available</p>
      ) : (
        <div className='tttttttttt'>
          <ul className='admin_ul_container'>
            {userData.map(user => (
              <li className='admin_img_container' key={user.studentRegistationId}>
                <div style={{height:"100px",width:"100px"}}>
                <img
                  className="users_profile_img_admin"
                  src={`${BASE_URL}/uploads/studentinfoimeages/${user.UplodadPhto}`}
                  alt={`no img${user.UplodadPhto}`}
                />
                </div>
                <div className='tttttttttt'>
                  <div className='detailsss_container'>
                    <p className='admin_para'>Name: {user.username}</p>
                    <p className='admin_para'>Email: {user.email}</p>
                    <p className='admin_para'>Role: {user.role === 'User' ? 'Student' : user.role}</p>
                  </div>
                  <div className='btns_adminn_contaainer'>
                    <button className='more_btn_admin' onClick={() => openModal(user, false)}>More Info</button>
                    <button className='course_activation_btn_admin' onClick={() => openCourseModal(user)}>Course Activation</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

        </div>

      )}

      {selectedUser && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel={isCourseModal ? "Course Activation" : "User Information"}
        >
          <button onClick={closeModal}>Close</button>

          {isCourseModal ? (
            <div className='admin_selective_courses'>
              <h2>Courses</h2>
              {selectedCourses.length === 0 ? (
                <p>No courses available</p>
              ) : (
                <ul className='admin_selective_ul'>
                  {selectedCourses.map(course => (
                    <li className='admin_selective_li' key={course.courseCreationId}>
                      <p>Course Name: {course.courseName}</p>
                      <p>Portal: {course.Portal}</p>

                      <select
                        name=""
                        id=""
                        onChange={(e) => handleChangeactivcourse(course.user_Id, course.studentregistationId, course.courseCreationId)(e)}
                      >
                        <option value="">Select</option>
                        <option value="Activate">Activate</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <h2>User Information</h2>
              <div className='user_information_container'>
                <div className='users_profile_img_user_admin_side_container'>
                <img
                  className="users_profile_img_user_admin_side"
                  src={`${BASE_URL}/uploads/studentinfoimeages/${selectedUser.UplodadPhto}`}
                  alt={`no img${selectedUser.UplodadPhto}`}
                />
                </div>
               
                <div className='user_information_sub_container'>
                  <p>Role: {selectedUser.role === 'User' ? 'Student' : selectedUser.role}</p>
                  <p>Name: {selectedUser.username}</p>
                  <p>Email: {selectedUser.email}</p>
                  <p>Date Of Birth: {selectedUser.dateOfBirth}</p>
                  <p>Gender: {selectedUser.Gender}</p>
                  <p>Category: {selectedUser.Category}</p>
                  <p>Contact No: {selectedUser.contactNo}</p>
                  <p>Father Name: {selectedUser.fatherName}</p>
                  <p>Occupation: {selectedUser.occupation}</p>
                  <p>Mobile No: {selectedUser.mobileNo}</p>
                  <p>Address: {selectedUser.line1},{selectedUser.state},{selectedUser.districts},{selectedUser.pincode}</p>
                  <p>Qualifications: {selectedUser.qualifications}</p>
                  <p>Name Of College: {selectedUser.NameOfCollege}</p>
                  <p>Passing Year: {selectedUser.passingYear}</p>
                  <p>Marks: {selectedUser.marks}</p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AccountInfo;
