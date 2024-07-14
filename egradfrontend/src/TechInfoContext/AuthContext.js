import { createContext, useContext, useEffect, useState } from "react";

const TIAuthContext = createContext();

const TIAuthProvider = ({ children }) => {
  const [tiAuth, settiAuth]= useState({
    user: "",
    token: "",
    isLoggedIn: false,
    role: "",
    userDecryptedId: null,
    userData: null,  // Initialize userData as null
  });
  // useEffect(()=>{
  //   const data=localStorage.getItem('tiAuth')
  //   if(data){
  //       const parseData=JSON.parse(data)
  //       settiAuth({
  //           ...tiAuth,
  //           user:parseData.user,
  //           token:parseData.token,
  //           role:parseData.role,
  //           userData:parseData.userData,
  //           // userDecryptedId:parseData.user_Id
  //           userDecryptedId:parseData.decryptedId
  //       })
        
  //   }
  // },[])
  useEffect(() => {
    const data = localStorage.getItem('tiAuth');
    if (data) {
      const parseData = JSON.parse(data);
      settiAuth({
        user: parseData.user || "",
        token: parseData.token || "",
        role: parseData.role || "",
        userData: parseData.userData || null,  // Handle possible missing data
        userDecryptedId: parseData.userDecryptedId || null,
        isLoggedIn: parseData.isLoggedIn || false,
      });
    }
  }, []);
  return (
    <TIAuthContext.Provider value={[tiAuth, settiAuth]}>
      {children}
    </TIAuthContext.Provider>
  );
};
// custom hook
const useTIAuth = () => useContext(TIAuthContext);

export { useTIAuth, TIAuthProvider };
