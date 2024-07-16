import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import { nav } from "../Exam_Portal_QuizApp/Data/Data";
import { Link } from "react-router-dom";

 
const Read = () => {


    const [showQuizmobilemenu, setShowQuizmobilemenu] = useState(false);
    const QuiZ_menu = () => {
      setShowQuizmobilemenu(!showQuizmobilemenu);
    };
    

 
  
    const {id} = useParams();
    const [user, setUsers] = useState([]);
 
    useEffect(() => {
        axios.get("http://localhost:5001/ughomepage_banner_login/userdetails/"+id)
        .then(res => {
            console.log(res)
            setUsers(res.data[0]);
        })
        .catch(err => console.log(err))
    }, []);
  

    const handleLogout = () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      window.location.href = "/uglogin";
    };
 
  return (
    <>
      ID: {id}
      <div className="Quiz_main_page_header">
        {/* {nav.map((nav, index) => {
          return (
            <div key={index} className="Quiz_main_page_navbar">
              <div className="Quizzlogo">
                <img src={nav.logo} alt="" />
              </div>

              <div
                className={
                  !showQuizmobilemenu
                    ? "Quiz_main_page_navbar_SUBpart Quiz_main_page_navbar_SUBpart_mobile"
                    : "Quiz_main_page_navbar_SUBpart_mobile"
                }
              >
                <ul>
                  <button style={{ background: "none" }}>
                    <Link to="/Account_info" className="Quiz__home">
                      Home
                    </Link>
                  </button>
                  <div className="Quiz_main_page_login_signUp_btn">
                   
                  </div>
                  <div>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </ul>
              </div>

              <div className="quz_menu" onClick={QuiZ_menu}>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
              </div>
            </div>
          );
        })} */}
      </div>
      <div className="read_container">
       
          
          
             
              <div className="admin_profile_container">
                
                  <div  className="admin_profile_box">
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
                      <p>Role:{user.role}</p>
                    </div>
                    <div className="admin_profile_box_btncontainer">
                      {/* <Link to={`/userread/${user.id}`} className="redbtn ">
                        Read
                      </Link> */}

                      {/* <Link
                        to={`/userupdate/${user.user_Id}`}
                        className="update"
                      >
                        Edit
                      </Link> */}

                      {/* <button
                        onClick={() => handleDelete(user.id)}
                        className="delete"
                      >
                        Delete
                      </button> */}
                    </div>
                  </div>
               
              </div>
            </div>
          
       
    </>
  );
};
 
export default Read;