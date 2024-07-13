import React, { useEffect, useState } from 'react';
import './Style/StudentDashboardHeader.css';
import BASE_URL from '../../../apiConfig';
import logo from '../../../styles/MicrosoftTeams-image (7).png';

const StudentDashboardHeader = ({ usersData = {}, decryptedUserIdState }) => {
  const [showLinks, setShowLinks] = useState(false);

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
  // const handleLogOut = () => {
  //   settiAuth({
  //     ...tiAuth,
  //     user: null,
  //     token: "",
  //     userDecryptedId:"",
  //     isLoggedIn: false,
  //   });
  //   localStorage.removeItem("tiAuth");
  //   navigate("/userlogin");
  // };
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
                      <div className='sub-links-userrr'>Profile</div>
                      <div className='sub-links-userrr'>Change Password</div>
                      <div className='sub-links-userrr' >Log Out</div>
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
