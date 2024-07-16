import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import { nav } from "../Exam_Portal_QuizApp/Data/Data";
import './Styles/UserUpdate.css'

const Userupdate = () => {
  const [showQuizmobilemenu, setShowQuizmobilemenu] = useState(false);
  const QuiZ_menu = () => {
    setShowQuizmobilemenu(!showQuizmobilemenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "/uglogin";
  };

  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    // profile_image: "",
    profile_image: "null",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.pathname.split("/")[2];

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleImageChange = (e) => {
  setUser((prev) => ({ ...prev, profile_image: e.target.files[0] }));
};
  const userRole = localStorage.getItem('userRole');
const handleClick = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("role", user.role);
   
    formData.append("profileImage", user.profile_image); // Ensure profile_image is appended correctly

    // Send a PUT request to the server with the FormData
    
      await axios.put(
        `http://localhost:5001/ughomepage_banner_login/users/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      
      // if (userRole === "viewer"){
      // navigate("/student_dashboard");

      // } 
      
      navigate("/Quiz_dashboard");
  } catch (err) {
    console.log(err);
  }
};
  useEffect(() => {
    axios
      .get("http://localhost:5001/ughomepage_banner_login/userdetails/" + id)
      .then((res) => {
        setUser(res.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="Quiz_main_page_header">
        {/* {nav.map((nav, index) => {
          return (
            <div key={index} className="Quiz_main_page_navbar">
            </div>
          );
        })} */}
      </div>
      <div className="userContainer">
        <h1>Edit Form</h1>
        <form className="formInUserUpdate">
          <div className="mb-3 mt-3">
            <label className="form-label"> ID:</label>
            <input
              type="text"
              // className="form-control"
              id="id"
              placeholder="Enter Your Full Name"
              name="id"
              value={id}
              disabled
            />
          </div>

          <div className="mb-3 mt-3">
            <label className="form-label"> Full Name:</label>
            <input
              type="text"
              // className="form-control"
              placeholder="Enter Your Full Name"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 mt-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              // className="form-control"
              id="email"
              placeholder="Enter email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3 mt-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              // className="form-control"
              id="password"
              placeholder="Enter password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3 mt-3">
            <label className="form-label">Role:</label>
            <input
              type="text"
              // className="form-control"
              id="password"
              name="role"
              value={user.role}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 mt-3 imgInUserUpdate">
            <label className="form-label">Profile Image:</label>
            Current Image:
            {/* <p></p> */}
            <img src={user.profile_image} alt="" />
            <input
              type="file"
              // className="form-control"
              name="profileImage"
              // value={user.profile_image}
              onChange={handleImageChange}
            />
          </div>
          {userRole === "admin" && (
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleClick}
            >
              Update
            </button>
          )}
        </form>
        <div className="userContainer d-flex justify-content-center">
          <Link to="/">See all users</Link>
        </div>
      </div>
    </>
  );
};

export default Userupdate;







