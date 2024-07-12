import React from 'react'
import './Style/StudentDashboardHeader.css'
import BASE_URL from '../../../apiConfig'
const StudentDashboardHeader = ({ usersData, decryptedUserIdState }) => {
    console.log("user daata from the student dashboard header", usersData)
    return (
        <div>
            <div className='SDHParentContainer'>
                <div className="SDHSubContainer">
                    <div className='SDHContentContainer'>
                    Student DashboardHeader
                    {usersData.users.map((user) => (
                        <>
                            <div className='SDHeaderImgContainer'>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboardHeader