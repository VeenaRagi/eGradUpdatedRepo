
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from '../../../apiConfig'
import Student_profileUpdateForm from "./Student_profileUpdateForm";
import './Style/StudentDashbord_Settings.css'

const StudentDashbord_Settings = ({ usersData }) => {
 
  return (
    <div className="StudentDashbordsettings_conatiner">
      <div className="StudentDashbordsettings_subconatiner">
        <div className="StudentDashbordsettings_profile_conatiner">
          <div className="StudentDashbordsettings_profile_box">
            {usersData.users && usersData.users.length > 0 && (
              <div>
                {usersData.users.map((user) => (
                  <div>
                    <div className="pro_img">
                      Profile Image
                      <img src={user.imageData} alt={`Image ${user.user_Id}`} />
                    </div>
                    <div className="StudentDashbordsettings_profile_box_info">
                      <p>User ID:{user.username}</p>
                      <p>Email ID:{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="Student_profileUpdate_editconatiner">
          <Student_profileUpdateForm />
        </div>
      </div>
    </div>
  );
};

export default StudentDashbord_Settings;
