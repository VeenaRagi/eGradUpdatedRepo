import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import BASE_URL from '../../apiConfig';
import axios from 'axios';

import '../Egradtutor_UG_PortalsAdmin/styles/AdminProfile.css'

const AdminProfile = () => {
    const [adminData, setAdminData] = useState([]);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorsOfForm, setErrorsOfForm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null); // State to store the selected user's ID

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/AdminProfile/fetchAdmindata`);
            if (!response.ok) {
                throw new Error('Failed to fetch admin data');
            }
            const data = await response.json();
            setAdminData(data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            // Handle error as needed
        }
    };

    const handleChangePassword = async (user_Id) => {
        setSelectedUserId(user_Id);
        // Confirm with user before sending OTP
        const userConfirmed = window.confirm("Do you want to change your password?");
        if (userConfirmed) {
            try {
                const response = await axios.post(`${BASE_URL}/studentSettings/changePasswordUsingOTP/${user_Id}`);
                if (response.status === 200) {
                    alert("OTP has been sent successfully");
                    setShowChangePasswordForm(true); // Show the password change form after OTP is sent
                } else {
                    alert("Failed to send the OTP to registered Email. Please try again.");
                }
            } catch (error) {
                console.log("Error sending OTP", error);
                alert("An error occurred while sending the OTP. Please try again.");
            }
        }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setErrorsOfForm("New password and Confirm password do not match");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/studentSettings/verifyOTP`, {
                userId: selectedUserId,
                otp,
                newPassword
            });
            if (response.status === 200) {
                alert("Password changed successfully");
                setShowChangePasswordForm(false); // Close the form after successful password change
                setOtp('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                alert("Error changing password");
            }
        } catch (error) {
            console.log("Error while posting the password", error);
            alert("Can't post the details. Please try again.");
        }
    };

    const handleClose = () => {
        setShowChangePasswordForm(false);
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        setErrorsOfForm('');
    };

    return (
        <>
            <AdminHeader />
            <div className='admin_profile_main_container'>
                <h2 className='admin_profile_header'>Admin Profile</h2>
                <ul className='admin_profile_ul'>
                    {adminData.map((admin) => (
                        <li className='admin_profile_li' key={admin.user_Id}>
                            <div className='admins_profile_img_container'>
                                <img className="admins_profile_img" src={`${BASE_URL}/uploads/AdminProfileImg/${admin.adminProfile}`} alt={`Profile of ${admin.username}`} />
                            </div>

                            <div className='admin_details_containerss'>
                                <p className='admin_details'>Name: {admin.username}</p>
                                <p className='admin_details'>Email: {admin.email}</p>
                                <button className='admin_details_button' onClick={() => handleChangePassword(admin.user_Id)}>Change Password</button>
                            </div>
                        </li>
                    ))}
                </ul>
                {showChangePasswordForm && (
                <form className="change-password-form" onSubmit={handleChangePasswordSubmit}>
                    <h1 className='admin_details_form_heading'>NOTE: OTP IS VALID FOR TEN MINUTES ONLY</h1>
                    <div className='admin_change_password_form_main_container'>
                    <div className='admin_change_password_form_container'>
                        <label className='admin_otp_box' htmlFor="otp">Enter your Code (sent through Email):</label>
                        <input
                            className='input_admin_box'
                            type="number"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <div className='admin_new_password_container'>
                        <label className='admin_new_password_box' htmlFor="newPassword">Enter new password</label>
                        <input
                            className='input_admin_box'
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className='admin_new_password_container'>
                        <label className='admin_new_password_box' htmlFor="confirmNewPassword">Confirm New Password</label>
                        <input
                            className='input_admin_box'
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    {errorsOfForm && (
                        <div className="error-message">{errorsOfForm}</div>
                    )}
                    <div className="admin_button-container">
                        <button type="submit">Change Password</button>
                        <button type="button" className="close-button" onClick={handleClose}>Close</button>
                    </div>
                    </div>
                </form>
                 )} 
            </div>
        </>
    );
};

export default AdminProfile;
