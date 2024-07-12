import React from 'react'
import { useParams } from "react-router-dom";
const StudentDashbord_BuyCourses = () => {
  const { userIdTesting } = useParams();
  return (
    <div>StudentDashbord_BuyCourses{userIdTesting}</div>
  )
}

export default StudentDashbord_BuyCourses