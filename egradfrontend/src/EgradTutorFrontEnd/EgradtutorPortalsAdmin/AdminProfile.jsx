import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import BASE_URL from '../../apiConfig';
import axios from 'axios';

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
            <div>
                <h2>Admin Profile</h2>
                <ul>
                    {adminData.map((admin) => (
                        <li key={admin.user_Id}>
                            <img className="users_profile_img" src={`${BASE_URL}/uploads/AdminProfileImg/${admin.adminProfile}`} alt={`Profile of ${admin.username}`} />
                            <div>
                                <p>Name: {admin.username}</p>
                                <p>Email: {admin.email}</p>
                                <button onClick={() => handleChangePassword(admin.user_Id)}>Change Password</button>
                            </div>
                        </li>
                    ))}
                </ul>
                {showChangePasswordForm && (
                    <form className="change-password-form" onSubmit={handleChangePasswordSubmit}>
                        <div>
                            <div>NOTE: OTP IS VALID FOR TEN MINUTES ONLY</div>
                            <label htmlFor="otp">Enter your Code (sent through Email):</label>
                            <input
                                type="number"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword">Enter new password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>
                        {errorsOfForm && (
                            <div className="error-message">{errorsOfForm}</div>
                        )}
                        <div className="button-container">
                            <button type="submit">Change Password</button>
                            <button type="button" className="close-button" onClick={handleClose}>Close</button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default AdminProfile;
