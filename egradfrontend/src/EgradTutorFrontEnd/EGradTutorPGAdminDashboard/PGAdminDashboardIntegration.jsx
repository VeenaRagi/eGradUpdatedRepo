import React from 'react'
import AdminHeader from '../EgradtutorPortalsAdmin/AdminHeader'
import PGAdminDashBoardInLeftNav from './PGAdminDashBoardInLeftNav'
import PGLeftNav from './PGLeftNav'

const PGAdminDashboardIntegration = () => {
    return (
        <>
            <AdminHeader/>
            <div>PGAdminDashboard</div>
            {/* <p>Need to create left nav</p> */}
            <PGLeftNav/>
        </>
    )
}

export default PGAdminDashboardIntegration