import React from 'react'
import CoursePageHeader from './CoursePageHeader/CoursePageHeader'
import CoursePageBanners from './CouresPageBanners/CoursePageBanners'
import PoopularCourses from './CoursePagePopularCourses/PoopularCourses'
import WhyChooseUs from './CoursePageWhychooseUs/WhyChooseUs'
import Footer from '../Footer/Footer'
import CourseHeader2 from './CoursePageHeader/CourseHeader2'

const CoursePage = ({isEditMode} ) => {
  return (
    <div>
      {/* <CoursePageHeader isEditMode={isEditMode} /> */}
      <CourseHeader2 isEditMode={isEditMode}/>
      {/* <CoursePageBanners isEditMode={isEditMode}/> */}
      <PoopularCourses />
      <WhyChooseUs isEditMode={isEditMode}/>
      <Footer/>
    </div>
  )
}

export default CoursePage