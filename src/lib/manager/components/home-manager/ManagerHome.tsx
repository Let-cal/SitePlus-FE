import * as React from 'react'
import StatsCards from './StatsCard'
import DashboardCharts from './DashboardCharts'
import UserManagement from './UserManagement'

function ManagerHome() {
  return (
    <div>
        <StatsCards />
        <DashboardCharts />
        <UserManagement />
    </div>
  )
}

export default ManagerHome