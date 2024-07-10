import React from 'react'

const Student_dashboard_Home = ({ usersData }) => {
  return (
    <div>
      Student_dashboard_Home
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

export default Student_dashboard_Home
