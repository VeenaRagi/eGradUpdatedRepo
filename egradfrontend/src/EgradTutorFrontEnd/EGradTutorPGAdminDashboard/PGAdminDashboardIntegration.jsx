import React from 'react'
import AdminHeader from '../EgradtutorPortalsAdmin/AdminHeader'
import PGAdminDashBoardInLeftNav from './PGAdminDashBoardInLeftNav'

const PGAdminDashboardIntegration = () => {
    return (
        <>
            <AdminHeader/>
            <div>PGAdminDashboard</div>
            {/* <p>Need to create left nav</p> */}
            <PGAdminDashBoardInLeftNav/>
        </>
    )
}

export default PGAdminDashboardIntegration