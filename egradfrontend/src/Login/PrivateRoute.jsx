import React from 'react';
import { Navigate,Outlet } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const auth = useSelector((state) => state.auth);

//   // if (!auth.token) {
//   //   // return <Navigate to="/login" />;
//   // }

//   return children;
// };

// const PrivateRoute = ({ element }) => {
//   const isAuthenticated = localStorage.getItem("tiAuth");
//   return isAuthenticated ? element : <Navigate to="/uglogin" />;
// };
// export default PrivateRoute;

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("tiAuth");
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/uglogin" />;
};

export default PrivateRoute;

