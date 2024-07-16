import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { nav } from "../eaxm_portal_/DATA/Data";

import { MdAlternateEmail } from "react-icons/md";
import { FaLock, FaUserAlt, FaImage } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import "./Account_info.css";
import BASE_URL from '../../apiConfig'

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
      .get(`${BASE_URL}/ughomepage_banner_login/act_info`)
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

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/ughomepage_banner_login/act_info`
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
        `${BASE_URL}/ughomepage_banner_login/users/${id}`
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
        `${BASE_URL}/ughomepage_banner_login/register`,
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
  return (
    <div className="act_infocontainer">
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
          <h3>All users</h3>
          <div className="admin_profile_container">
            {users.map((user, i) => (
              <div key={i} className="admin_profile_box">
                {/* <p>{i + 1}</p> */}
                <div className="pro_img">
                  <img src={user.profile_image} alt={`Image ${user.user_Id}`} />
                </div>
                <div className="admin_profile_box_info">
                  <p>User ID:{user.username}</p>
                  <p>Email ID:{user.email}</p>
                  {/* <p>Role:{user.role}</p> */}
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
            ))}
          </div>
        </div>
      </div>
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
          `${BASE_URL}/ughomepage_banner_login/user`,
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
        src={`${BASE_URL}/uploads/${question.documen_name}/${option.optionImgName}`}
        alt={`Option ${option.option_id}`}
      /> */}
      <div className="profilepic">
        <p>User ID: {userData.user_Id}</p>
        <h2>Username: {userData.username}</h2>
        <p>Email: {userData.email}</p>
        {/* <img
          src={`${BASE_URL}/profilesimages/${profileImage_1704542933934.jpg}`}
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


