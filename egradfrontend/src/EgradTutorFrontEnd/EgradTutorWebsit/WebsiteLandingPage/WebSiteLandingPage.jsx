// import React, { useState } from 'react';
// import LandingPageHeader from './LandingPageHeader/LandingPageHeader';
// import LandingPageExamdata from './LandingpageExamdata/LandingPageExamdata';
// import Footer from '../Footer/Footer';

// const WebSiteLandingPage = ({ isEditMode }) => {

  
//   return (
//     <div>
//       <LandingPageHeader isEditMode={isEditMode} />
//       <LandingPageExamdata isEditMode={isEditMode} />
//       <Footer isEditMode={isEditMode} />
//     </div>
//   );
// };

// export default WebSiteLandingPage;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPageHeader from './LandingPageHeader/LandingPageHeader';
import LandingPageExamdata from './LandingpageExamdata/LandingPageExamdata';
import Footer from '../Footer/Footer';
import Maintenance1 from '../../MaintenanceMode/Maintenance1';

const WebSiteLandingPage = ({ isEditMode }) => {
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Replace with your health check endpoint
        await axios.get('http://localhost:3000/health');
        setIsServerOnline(true);
      } catch (error) {
        setIsServerOnline(true);
      } finally {
        setLoading(false);
      }
    };

    checkServerStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isServerOnline ? (
        <>
          <LandingPageHeader isEditMode={isEditMode} />
          <LandingPageExamdata isEditMode={isEditMode} />
          <Footer isEditMode={isEditMode} />
        </>
      ) : (
        <Maintenance1 />
      )}
    </div>
  );
};

export default WebSiteLandingPage;
