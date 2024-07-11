import React from 'react'

const StudentDashbord_Bookmarks = ({usersData}) => {
  return (
    <div>
      StudentDashbord_Bookmarks
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

export default StudentDashbord_Bookmarks
