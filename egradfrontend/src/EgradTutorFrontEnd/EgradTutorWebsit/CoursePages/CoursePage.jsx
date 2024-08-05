import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../../apiConfig';
import CoursePageHeader from './CoursePageHeader/CoursePageHeader';
import CoursePageBanners from './CouresPageBanners/CoursePageBanners';
import PoopularCourses from './CoursePagePopularCourses/PoopularCourses';
import WhyChooseUs from './CoursePageWhychooseUs/WhyChooseUs';
import Footer from '../Footer/Footer';
import CourseHeader2 from './CoursePageHeader/CourseHeader2';

const CoursePage = ({ isEditMode }) => {
  const { Branch_Id } = useParams();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${BASE_URL}/LandingPageExamData/branch/${Branch_Id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBranches(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching branches:', error);
        setLoading(false);
      }
    };

    fetchBranches();
  }, [Branch_Id]);

  console.log('Branch_Id', Branch_Id);

  return (
    <div>
      {/* <CoursePageHeader isEditMode={isEditMode} /> */}
      <CourseHeader2 isEditMode={isEditMode} Branch_Id={Branch_Id}/>
      {/* <CoursePageBanners isEditMode={isEditMode}/> */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        branches.map((branch) => (
          <div key={branch.Branch_Id}>
            <p>{branch.Branch_Name}</p>
          </div>
        ))
      )}
      <PoopularCourses />
      <WhyChooseUs isEditMode={isEditMode} />
      <Footer />
    </div>
  );
};

export default CoursePage;
