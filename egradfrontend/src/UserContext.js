// UserContext.js
import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [decryptedUserIdState, setDecryptedUserIdState] = useState(null);
    const [usersData, setUsersData] = useState(null);
    const [branchIdFromLS,setBranchIdFromLS] = useState(null);

    return (
        <UserContext.Provider value={{ decryptedUserIdState, setDecryptedUserIdState, usersData, setUsersData,branchIdFromLS,setBranchIdFromLS }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
