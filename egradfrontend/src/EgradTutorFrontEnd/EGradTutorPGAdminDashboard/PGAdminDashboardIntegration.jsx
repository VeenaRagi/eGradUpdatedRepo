import React from 'react'
import AdminHeader from '../EgradtutorPortalsAdmin/AdminHeader'
import PGAdminDashBoardInLeftNav from './PGAdminDashBoardInLeftNav'
import PGLeftNav from './PGLeftNav'

const PGAdminDashboardIntegration = () => {
    return (
        <>
            <AdminHeader />
            <div className="Exam_portal_admin_integration_container">
                <PGLeftNav />
            </div>
        </>
    )
}

export default PGAdminDashboardIntegration