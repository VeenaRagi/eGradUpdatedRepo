import React, { useEffect, useState } from 'react';
import './Style/StudentDashboardHeader.css';
import { useNavigate,Link } from "react-router-dom";
import BASE_URL from '../../../apiConfig';
import logo from '../../../styles/MicrosoftTeams-image (7).png';
import { useTIAuth } from "../../../TechInfoContext/AuthContext";

const StudentDashboardHeader = ({ usersData = {}, decryptedUserIdState,setActiveComponent  }) => {
  const [showLinks, setShowLinks] = useState(false);
  const navigate = useNavigate();
  const [tiAuth, settiAuth] = useTIAuth();
  const [isLoggedInFromLS, setIsLoggedInFromLS] = useState(false);

  useEffect(() => {
    const checkLoggedIn = () => {
      const isLoggedIn = localStorage.getItem('tiAuth');
      console.log(isLoggedIn);
      if (isLoggedIn) {
        try {
          const tiAuth = JSON.parse(isLoggedIn);
          setIsLoggedInFromLS(tiAuth.isLoggedIn);
          console.log(isLoggedInFromLS, 'wwwwwwwwwwwwwwwwwwwwwww');
        } catch (error) {
          console.log(error, 'parsing the tiauth for back button');
        }
      }
    };
    checkLoggedIn();
  }, []);

  console.log('user data from the student dashboard header', usersData);
  const handleLogOut = () => {
    settiAuth({
      ...tiAuth,
      user: null,
      token: "",
      userDecryptedId:"",
      isLoggedIn: false,
    });
    localStorage.removeItem("tiAuth");
    navigate("/userlogin");
  };


  return (
    <div>
      <div className="SDHParentContainer">
        <div className="SDHSubContainer">
          <div className="SDHContentContainer">
            <div className="SDHeaderLogoContainer">
              <img src={logo} alt="no logo " />
            </div>
            {usersData.users && usersData.users.length > 0 && (
              <div>
                {usersData.users.map((user) => (
                  <div className="SDHeaderImgContainer" key={user.UplodadPhto}>
                    <img
                      style={{ width: '100%', borderRadius: '50%' }}
                      src={`${BASE_URL}/uploads/studentinfoimeages/${user.UplodadPhto}`}
                      alt={`no img${user.UplodadPhto}`}
                    />
                    <div className="toBeDisplayedWhenHovered">
                      <Link to='#' className='sub-links-userrr'  onClick={() => setActiveComponent("settings")}>Profile</Link>
                      <Link to='#' className='sub-links-userrr'  onClick={() => setActiveComponent("settings")}>Change Password</Link>
                      <button className='sub-links-userrr' onClick={handleLogOut}>Log Out</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardHeader;
