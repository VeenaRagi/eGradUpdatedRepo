import { createContext, useContext, useEffect, useState } from "react";

const TIAuthContext = createContext();

const TIAuthProvider = ({ children }) => {
  const [tiAuth, settiAuth] = useState({
    user: "veena",
    token: "",
  });
  useEffect(()=>{
    const data=localStorage.getItem('tiAuth')
    if(data){
        const parseData=JSON.parse(data)
        settiAuth({
            ...tiAuth,
            user:parseData.user,
            token:parseData.token
        })
        
    }
  },[])
  return (
    <TIAuthContext.Provider value={[tiAuth, settiAuth]}>
      {children}
    </TIAuthContext.Provider>
  );
};
// custom hook
const useTIAuth = () => useContext(TIAuthContext);

export { useTIAuth, TIAuthProvider };
