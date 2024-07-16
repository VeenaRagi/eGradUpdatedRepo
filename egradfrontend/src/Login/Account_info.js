import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { nav } from "../Exam_Portal_QuizApp/Data/Data";
import { FaSearch } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaLock, FaUserAlt, FaImage } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import "./Styles/Account_info.css";

const Account_info = () => {
  const [showQuizmobilemenu, setShowQuizmobilemenu] = useState(false);
  const [actinfo, setActinfo] = useState([]);
  const QuiZ_menu = () => {
    setShowQuizmobilemenu(!showQuizmobilemenu);
  };
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/uglogin";
  };

  useEffect(() => {
    axios
      .get("http://localhost:5001/ughomepage_banner_login/act_info")
      .then((res) => {
        setActinfo(res.data);
        console.log(actinfo);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      {userRole === "admin" && (
        <div>
          {/* <p>Admin View: Show all features</p> */}
          {/* Admin-specific content goes here */}
          <Users />
        </div>
      )}

      {userRole === "viewer" && (
        <div>
          <p>Viewer View: Show limited features</p>

          <Users_info />
          {/* Viewer-specific content goes here */}
        </div>
      )}
    </>
  );
};

export default Account_info;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [showUserCourse, setShowUserCourse] = useState(false);
  const [usercourseData, setUsercourseData] = useState([]);
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/ughomepage_banner_login/act_info"
        );
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllUsers();
  }, []);

  console.log(users);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5001/ughomepage_banner_login/users/${id}`
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid(password)) {
      setMessage("Password should be at least 6 characters long.");
      return;
    }

    if (!isUsernameValid(username)) {
      setMessage("Username should be at least 3 characters long.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImage) {
      formData.append("profileImage", profileImage, profileImage.name); // Append the image file with its name
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/ughomepage_banner_login/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("123");
      console.log(formData);

      if (response.status === 201) {
        // Check for successful registration status
        setSMessage("User registered successfully!");
        setMessage("");
        setUsername("");
        setEmail("");
        setPassword("");
        setProfileImage(null);
        window.location.href = "/uglogin";
      }
      setAdminadduser(false);
      window.location.reload();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error registering user");
      console.error("Error:", error);
    }
  };
  const handleRegisterclose = () => {
    setAdminadduser(false);
  };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [smessage, setSMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length >= 6;
  };

  const isUsernameValid = (username) => {
    return username.length >= 3;
  };

  const [adminadduser, setAdminadduser] = useState(false);
  const handleadminadduser = () => {
    setAdminadduser(true);
  };
  const handleactive = async (userId) => {
    setShowUserCourse(!showUserCourse);
    try {
      const response = await axios.get(
        `http://localhost:5001/Exam_Course_Page/getregisterid/${userId}`
      );
      setUsercourseData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Call handleactive with the userId here
    handleactive(users.id);
  }, []);
  const handleactiveclose = () => {
    window.location.reload();

    setShowUserCourse(true);
  };

  const handleChangeactivcourse = (userId, studentregistationId, courseCreationId,userEmail) => async (e) => {
    try {
      const selectedValue = e.target.value;
  
      if (selectedValue === "Activate") {
        const response = await axios.put(
          `http://localhost:5001/Exam_Course_Page/updatePaymentStatusactive/${userId}/${studentregistationId}/${courseCreationId}`,
          { email: userEmail } // Include the email address in the request body
        );
        console.log(response.data);
      }
  
      if (selectedValue === "Inactive") {
        const response = await axios.put(
          `http://localhost:5001/Exam_Course_Page/updatePaymentStatusinactive/${userId}/${studentregistationId}/${courseCreationId}`,
          { email: userEmail } // Include the email address in the request body
        );
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
const filteredUsers = users.filter((user) =>
user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <div className="act_infocontainer">
      {showUserCourse ? (
        <div className="admin_profile_superparentcontainer">
          <div className="admin_profile_superparentcontainer_addnew_user">
            <button onClick={handleadminadduser}>Add new users</button>
          </div>
          {adminadduser ? (
            <div className="ug_adminregistercontainer">
              <div className=" ug_adminregistersubcontainer">
                <div className="ug_logincontainer_box">
                  <div className="ug_logincontainer_box_close">
                    <button onClick={handleRegisterclose}>
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>

                  <h2>Register</h2>
                  <form onSubmit={handleRegister}>
                    <label>
                      <FaUserAlt />
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                      />
                    </label>

                    <label>
                      <MdAlternateEmail />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                      />
                    </label>

                    <label>
                      <FaLock />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                      />
                    </label>

                    {/* Input for profile image */}
                    <label>
                      <FaImage />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                      />
                    </label>

                    <br />
                    {message && <p style={{ color: "red" }}>{message}</p>}
                    {smessage && <p style={{ color: "green" }}>{smessage}</p>}

                    <button type="submit">Register</button>
                  </form>
                  {/* <p>
                  Already have an account? <Link to="/uglogin">Login here</Link>
                </p> */}
                </div>
              </div>
            </div>
          ) : null}

          <div className="admin_profile_parentcontainer">
          <div className="create_exam_header_SearchBar">
          {/* Search bar */}
          <FaSearch className="Adminsearchbaricon" />
          <input
            className="AdminSearchBar"
            type="text"
            placeholder="Search By User Name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
            <h3>All users</h3>
            <div className="admin_profile_container">
            {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6">No User found.</td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => (
                  <div key={i} className="admin_profile_box">
                    {/* <p>{i + 1}</p> */}
                    <div className="pro_img">
                      <img
                        src={user.profile_image}
                        alt={`Image ${user.user_Id}`}
                      />
                    </div>
                    <div className="admin_profile_box_info">
                      <p>User ID:{user.username}</p>
                      <p>Email ID:{user.email}</p>
                      {/* <p>Role:{user.role}</p> */}
                    </div>
                    <div className="Applied_Courses">
                      {/* <button onClick={() => handleactive(user.id)}>
                        Course Activation
                      </button> */}
                      <button onClick={() => handleactive(user.id)}>
                        Course Activation
                      </button>
                    </div>
                    <div className="admin_profile_box_btncontainer">
                      <Link to={`/userread/${user.id}`} className="redbtn ">
                        Read
                      </Link>
  
                      <Link to={`/userupdate/${user.id}`} className="update">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <>
            <div className="studentcourseactive_container">
              <div
                className="studentcourseactive_container_goback"
                onClick={handleactiveclose}
              >
                Go Back
              </div>
              <h1>Applied Courses</h1>
              <div>
                { }

                {usercourseData.length === 0 ? (
                  <p>No courses applied</p>
                ) : (
                  usercourseData.map((item, index) => (
                    <div key={index}>
                      {/* <p>User ID: {item.user_id}</p> */}
                      {/* <p>Username: {item.username}</p> */}
                      {/* <p>
                        Student Registration ID: {item.studentregistationId}
                      </p> */}
                      {/* courseCreationId ID: {item.courseCreationId} */}
                      {/* <p></p> */}
                      <div className="studentcourseactive_container_activ_inact_containe">
                        <p>{item.courseName}</p>
                        <p>{item.Portal}</p>

                        <p>{item.payu_status}</p>
                        <select
                          name=""
                          id=""
                          onChange={(e) => handleChangeactivcourse(item.user_id, item.studentregistationId, item.courseCreationId)(e)}
                          
                        >
                          <option value="">Select</option>
                          <option value="Activate">Activate</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        </>
      )}
    </div>
  );
};


export const Users_info = () => {
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5001/ughomepage_banner_login/user",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token to headers for authentication
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
          console.log(userData);
        } else {
          // Handle errors, e.g., if user data fetch fails
        }
      } catch (error) {
        // Handle other errors
      }
    };

    fetchUserData();
  }, []);

  console.log(userData.profile_image);

  return (
    <>
      {/* <img
        src={`http://localhost:5001/uploads/${question.documen_name}/${option.optionImgName}`}
        alt={`Option ${option.option_id}`}
      /> */}
      <div className="profilepic">
        <p>User ID: {userData.user_Id}</p>
        <h2>Username: {userData.username}</h2>
        <p>Email: {userData.email}</p>
        {/* <img
          src={`http://localhost:5001/profilesimages/${profileImage_1704542933934.jpg}`}
          alt={`Option ${option.option_id}`}
        /> */}
        <img src={userData.imageData} alt={`Image ${userData.user_Id}`} />
        {/* <img
          key={userData.user_Id}
          src={userData.profile_image}
          alt={`Image ${userData.user_Id}`}
        /> */}
        {/* <img src={userData.profile_image} alt="Profile" /> */}
      </div>
    </>
  );
};


