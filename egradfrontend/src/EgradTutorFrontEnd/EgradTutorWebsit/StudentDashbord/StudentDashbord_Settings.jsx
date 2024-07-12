import React from 'react'
const StudentDashbord_Settings = ({ usersData,decryptedUserIdState }) => {

  return (
    <div>
      StudentDashbord_Settings
      decryptedUserIdState:{decryptedUserIdState }
      {usersData.users && usersData.users.length > 0 && (
          <ul>
            {usersData.users.map((user) => (
              <p> {user.username}</p>
            ))}
          </ul>
        )}
    </div>
  )
}

export default StudentDashbord_Settings