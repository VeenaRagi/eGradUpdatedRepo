
import React from 'react'
import './MaintenanceMode.css'; // Import your CSS file for styling
import oopsImage from '../../assets/oops image.jpg';

const Maintenance1 = () => {
    return (
        <div className="maintenance-container">
            <img src = {oopsImage} alt = "default" className='oops_Image'/>
            <h1>We’re Currently Updating</h1>
            <p>Our server is currently undergoing maintenance. Please try again after some time.</p>
            <p>We apologize for the inconvenience and appreciate your patience.</p>
        </div>
    );
}

export default Maintenance1

