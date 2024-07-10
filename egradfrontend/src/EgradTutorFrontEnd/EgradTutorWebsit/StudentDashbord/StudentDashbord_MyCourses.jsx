import React from 'react'

const StudentDashbord_MyCourses = ({usersData}) => {
  return (
    <div>
      StudentDashbord_MyCourses
      {usersData.users && usersData.users.length > 0 && (
          <div>
           
            <ul>
              {usersData.users.map((user) => (
                <li key={user.user_Id}>Username:{user.username}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  )
}

export default StudentDashbord_MyCourses
