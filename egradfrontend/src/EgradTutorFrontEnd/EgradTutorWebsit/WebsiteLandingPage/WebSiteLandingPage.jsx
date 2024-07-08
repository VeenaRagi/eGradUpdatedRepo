import React, { useState } from 'react';
import LandingPageHeader from './LandingPageHeader/LandingPageHeader';
import LandingPageExamdata from './LandingpageExamdata/LandingPageExamdata';
import Footer from '../Footer/Footer';
import { useTIAuth } from '../../../TechInfoContext/AuthContext';
import img from '../../../bgr.png';

const WebSiteLandingPage = ({ isEditMode }) => {
  const [tiAuth, settiAuth] = useTIAuth();

  return (
    <div
    //  style={{ backgroundImage: `url(${img})` }}
     >
      {/* <pre>
        {JSON.stringify(tiAuth, null, 4)}
      </pre> */}
      <LandingPageHeader isEditMode={isEditMode} />
      <LandingPageExamdata isEditMode={isEditMode} />
      <Footer isEditMode={isEditMode} />
    </div>
  );
};

export default WebSiteLandingPage;
