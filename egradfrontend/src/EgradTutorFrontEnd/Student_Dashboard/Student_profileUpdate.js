import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import { nav } from "../Exam_Portal_QuizApp/Data/Data";
import "./styles/StudentDashbord.css";
import BASE_URL from "../../apiConfig";
// import { nav } from "../eaxm_portal_/DATA/Data";
const Student_profileUpdate = () => {
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
    currentPassword: "",
    newPassword: "",
    confirmpassword: "",
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

  //  const handleImageChange = (e) => {
  //    const file = e.target.files[0];
  //    if (file) {
  //      const reader = new FileReader();
  //      reader.onloadend = () => {
  //        setUser({ imageData: reader.result });
  //      };
  //      reader.readAsDataURL(file);
  //    } else {
  //      // No file selected, set default image or hide the image tag
  //      setUser({ imageData: null });
  //    }
  //  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append other user details
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("role", user.role);
      formData.append("currentPassword", user.currentPassword);
      formData.append("newPassword", user.newPassword);
      formData.append("currentPassword", user.confrimpassword);

      // Append the profile image
      formData.append("profileImage", user.profile_image);

      const response = await fetch(
        `${BASE_URL}/ughomepage_banner_login/profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        window.location.reload();
        setpasswordchangemessage(false);
        setSuceessupdatechangemessage("User details updated successfully");
        // console.log("User details updated successfully");
      } else {
        setpasswordchangemessage("Failed to update user details");
        // console.log("Failed to update user details");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [passwordchangemessage, setpasswordchangemessage] = useState("");
  const [suceessupdatechangemessage, setSuceessupdatechangemessage] =
    useState("");

  const handlePASSWORDClick = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append other user details
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("role", user.role);
      formData.append("currentPassword", user.currentPassword);
      formData.append("newPassword", user.newPassword);
      formData.append("confirmpassword", user.confirmpassword);

      // Append the profile image
      formData.append("profileImage", user.profile_image);

      // Check if the current password matches the user's current password
      if (user.currentPassword !== user.password) {
        // console.log(user.currentPassword);
        // console.log(user.password);
        setpasswordchangemessage("Old password does not match");
        // console.log("Old password does not match");
        return;
      }

      // Check if the new password is different from the current password
      if (user.newPassword === user.password) {
        setpasswordchangemessage(
          "New password should be different from the current password"
        );

        return;
      }

      if (user.newPassword === user.currentPassword) {
        setpasswordchangemessage(
          "New password should be different from the current password"
        );
        // console.log("New password should be different from the current password");
        return;
      }

      if (user.newPassword !== user.confirmpassword) {
        // console.log(" password does not match");
        setpasswordchangemessage(" password does not match");

        // console.log(user.newPassword);
        // console.log(user.confirmpassword);
        return;
      }

      const response = await fetch(
        `${BASE_URL}/ughomepage_banner_login/studentprofilepassword/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        window.location.reload();
        setpasswordchangemessage(false);

        setSuceessupdatechangemessage("User details updated successfully");
        // console.log("User details updated successfully");
      } else {
        setpasswordchangemessage("Failed to update user details");
        // console.log("Failed to update user details");
      }
    } catch (err) {
      console.log(err);
    }
  };

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
          const user = await response.json();
          setUser(user);
          console.log(user);
        } else {
          // Handle errors, e.g., if user data fetch fails
        }
      } catch (error) {
        // Handle other errors
      }
    };

    fetchUserData();
  }, []);

  // const [
  //   studentDashbordeditformnwithoutpassword,
  //   setStudentDashbordeditformnwithoutpassword,
  // ] = useState(true);

  // const [
  //   studentDashbordeditformnwithpassword,
  //   setStudentDashbordeditformnwithpassword,
  // ] = useState(false);

  // const [
  //   studentDashbordeditformnwithoutpasswordbtn,
  //   setStudentDashbordeditformnwithoutpasswordbtn,
  // ] = useState(true);

  // const [
  //   studentDashbordeditformnwithpasswordbtn,
  //   setStudentDashbordeditformnwithpasswordbtn,
  // ] = useState(false);

  const [
    studentDashbordeditformnwithoutpassword,
    setStudentDashbordeditformnwithoutpassword,
  ] = useState(() => {
    const storedState = localStorage.getItem(
      "studentDashbordeditformnwithoutpassword"
    );
    return storedState ? JSON.parse(storedState) : true;
  });

  const [
    studentDashbordeditformnwithpassword,
    setStudentDashbordeditformnwithpassword,
  ] = useState(() => {
    const storedState = localStorage.getItem(
      "studentDashbordeditformnwithpassword"
    );
    return storedState ? JSON.parse(storedState) : false;
  });

  const [
    studentDashbordeditformnwithoutpasswordbtn,
    setStudentDashbordeditformnwithoutpasswordbtn,
  ] = useState(() => {
    const storedState = localStorage.getItem(
      "studentDashbordeditformnwithoutpasswordbtn"
    );
    return storedState ? JSON.parse(storedState) : true;
  });

  const [
    studentDashbordeditformnwithpasswordbtn,
    setStudentDashbordeditformnwithpasswordbtn,
  ] = useState(() => {
    const storedState = localStorage.getItem(
      "studentDashbordeditformnwithpasswordbtn"
    );
    return storedState ? JSON.parse(storedState) : false;
  });

  // Update local storage when state changes
  useEffect(() => {
    localStorage.setItem(
      "studentDashbordeditformnwithoutpassword",
      JSON.stringify(studentDashbordeditformnwithoutpassword)
    );
    localStorage.setItem(
      "studentDashbordeditformnwithpassword",
      JSON.stringify(studentDashbordeditformnwithpassword)
    );
    localStorage.setItem(
      "studentDashbordeditformnwithoutpasswordbtn",
      JSON.stringify(studentDashbordeditformnwithoutpasswordbtn)
    );
    localStorage.setItem(
      "studentDashbordeditformnwithpasswordbtn",
      JSON.stringify(studentDashbordeditformnwithpasswordbtn)
    );
  }, [
    studentDashbordeditformnwithoutpassword,
    studentDashbordeditformnwithpassword,
    studentDashbordeditformnwithoutpasswordbtn,
    studentDashbordeditformnwithpasswordbtn,
  ]);

  const handleClickstudentDashbordeditformnwithpassword = () => {
    setStudentDashbordeditformnwithoutpasswordbtn(false);
    setStudentDashbordeditformnwithpasswordbtn(true);
    setStudentDashbordeditformnwithpassword(true);
    setStudentDashbordeditformnwithoutpassword(false);
  };

  const handleClickstudentDashbordeditformnwithoutpassword = () => {
    setStudentDashbordeditformnwithoutpasswordbtn(true);
    setStudentDashbordeditformnwithpasswordbtn(false);
    setStudentDashbordeditformnwithpassword(false);
    setStudentDashbordeditformnwithoutpassword(true);
  };

  return (
    <>
      <div className="Student_profileUpdate_editsubconatiner">
        <h3 className="std_profile_edit">Edit Profile</h3>
        <div className="studentDashbordconatinereditfrombtns">
          <button
            onClick={handleClickstudentDashbordeditformnwithoutpassword}
            className={
              studentDashbordeditformnwithoutpasswordbtn
                ? "studentDashbordeditformnwithoutpasswordbtnactive"
                : "studentDashbordeditformnwithoutpasswordbtnnotactive"
            }
          >
            Personal details
          </button>

          <button
            onClick={handleClickstudentDashbordeditformnwithpassword}
            className={
              studentDashbordeditformnwithpasswordbtn
                ? "studentDashbordeditformnwithoutpasswordbtnactive"
                : "studentDashbordeditformnwithoutpasswordbtnnotactive"
            }
          >
            Change password
          </button>
        </div>

        {studentDashbordeditformnwithoutpassword ? (
          <form className="Student_profileUpdate_editsubconatiner_from">
            <div className="std_pswd_edit">{passwordchangemessage}</div>
            <div style={{ color: "green" }}>{suceessupdatechangemessage}</div>
            <div className="pswd_id">
              <label className="form-label"> ID:</label>
              <input
                type="text"
                className="form-control"
                id="id"
                placeholder="Enter Your Full Name"
                name="id"
                value={user.id} // Assuming 'id' is the correct property for user id
                disabled
              />
            </div>

            <div className="full-name_pswd">
              <label className="form-label"> Full Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Your Full Name"
                name="username"
                value={user.username}
                onChange={handleChange}
              />
            </div>
            <div  className="full-name_email">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                name="email"
                value={user.email}
                onChange={handleChange}
                disabled
              />
            </div>
     
            <div className="Student_profileUpdate_editsubconatiner_from_choss_img_cinatiner">
              <label className="form-label">Profile Image:</label>

              <div>
                <p className="imggg_container">Image daata</p>
                {/* {courseDa} */}
                <img className="pswd_profile_imgg" src={user.imageData} alt="Profile" />
                {/* {user.imageData ? (
                  <img src={user.imageData} alt="Profile" />
                ) : (
                  <>
                    <img
                      src="default-profile-image.jpg"
                      alt="Default Profile"
                    />
                  </>
                )} */}
                <input
                  type="file"
                  className="form-control"
                  name="profileImage"
                  onChange={handleImageChange}
                />
              </div>
              {/* Update this line */}
            </div>
            <button className="update_pswd" type="submit" onClick={handleClick}>
              Update
            </button>
          </form>
        ) : null}
        {studentDashbordeditformnwithpassword ? (
          <>
            <div style={{ color: "red" }}>{passwordchangemessage}</div>
            <div style={{ color: "green" }}>{suceessupdatechangemessage}</div>

            <div className="user_update_pswd_cntner">
              <label className="form-label">Current Password:</label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                placeholder="Enter current password"
                name="currentPassword"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 mt-3">
              <label className="form-label">New Password:</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="Enter new password"
                name="newPassword"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm new password"
                name="confirmpassword"
                onChange={handleChange}
              />
            </div>
            <button type="submit" onClick={handlePASSWORDClick}>
              Update
            </button>
          </>
        ) : null}
        {/* <div className="container d-flex justify-content-center">
          <Link to="/">See all users</Link>
        </div> */}
      </div>
    </>
  );
};

export default Student_profileUpdate;
