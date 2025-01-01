import * as React from "react";
import StatsCards from './StatsCard';
import DashboardCharts from "./DashboardCharts";
import UserManagement from "./UserManagement";

const ManagerHome = () => {
    return (
        <div className="">
            <div className="mb-12">  
                <StatsCards />
            </div>
            <div className="mb-12">  
                <DashboardCharts />
            </div>
            <div className="mb-12">  
                <UserManagement />
            </div>
        </div>
    );
};

export default ManagerHome;
