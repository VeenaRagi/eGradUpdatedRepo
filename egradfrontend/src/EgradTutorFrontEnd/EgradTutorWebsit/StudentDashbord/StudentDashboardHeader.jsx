import React, { useEffect, useState } from 'react'
import './Style/StudentDashboardHeader.css'
import BASE_URL from '../../../apiConfig'
import logo from '../../../styles/MicrosoftTeams-image (7).png'
import { json } from 'd3'
const StudentDashboardHeader = ({ usersData={}, decryptedUserIdState }) => {
    const[isLoggedInFromLS,setIsLoggedInFromLS]=useState(false)
    useEffect(()=>{
        const checkLoggedIn=()=>{
            const isLoggedIn=localStorage.getItem("tiAuth");
            console.log(isLoggedIn)
            if(isLoggedIn){
                try {
                    const tiAuth=JSON.parse(isLoggedIn);
                    setIsLoggedInFromLS(tiAuth.isLoggedIn)
                    // console.log(tiAuth,"this is ssssssssssss")
                     console.log(isLoggedInFromLS,"wwwwwwwwwwwwwwwwwwwwwww");
                } catch (error) {
                    console.log(error,"parsing the tiauth for back button")
                }
            }
        }
        checkLoggedIn();
    },[])
    console.log("user daata from the student dashboard header", usersData)
    // const users = usersData.users || [];
    // if (isLoggedInFromLS) {
    //     return (
    //       <div className="logout">
    //         <div className="logout-conatiner">
    //           <p>Are you sure you want to logout ?</p>
    //           <div>
    //             <button 
    //             // onClick={handleYesClick}
    //             >Yes</button>
    //             <button 
    //             // onClick={handleNoClick}
    //             >No</button>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   }
    
    return (
        <div>
            <div className='SDHParentContainer'>
                <div className="SDHSubContainer">
                    <div className='SDHContentContainer'>
                    {/* Student DashboardHeader */}
                    <div className='SDHeaderLogoContainer'> 
                        <img src={logo} alt="no logo " />
                    </div>
                    {usersData.users && usersData.users.length > 0 && (
                        <div>
                    {usersData.users.map((user) => (
                        <>
                            <div className='SDHeaderImgContainer' style={{}}>
                                <img style={{ width: "100%", borderRadius:"50%"}} src={`${BASE_URL}/uploads/studentinfoimeages/${user.UplodadPhto}`} alt={`no img${user.UplodadPhto}`} />
                            </div>
                            <div className='toBeDisplayedWhenHovered'>
                            <div>
                                Profile
                            </div>
                            <div>
                                Change Password
                            </div>
                            <div>Log Out</div>
                            </div>
                        </>
                    ))}
                    </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboardHeader