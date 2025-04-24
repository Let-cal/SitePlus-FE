import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardCheck, Handshake, Users } from 'lucide-react'; // Cập nhật icon
import managerService from "@/services/manager/manager.service"; // Import managerService

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => (
  <Card className="rounded-xl border bg-card text-card-foreground shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium leading-none tracking-tight">{title}</CardTitle>
      {React.cloneElement(icon as React.ReactElement, { 
        className: `h-12 w-12 ${iconColor}`
      })}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const StatsCards: React.FC = () => {
  // State để lưu dữ liệu từ API
  const [statsData, setStatsData] = React.useState({
    totalRequests: 0,
    totalSites: 0,
    totalBrands: 0,
    totalAreaManagers: 0,
  });

  // Gọi API khi component mount
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await managerService.fetchDashboardStatistics();
        if (response.success) {
          setStatsData({
            totalRequests: response.data.totalRequests,
            totalSites: response.data.totalSites,
            totalBrands: response.data.totalBrands,
            totalAreaManagers: response.data.totalAreaManagers,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { 
      title: "SỐ LƯỢNG YÊU CẦU", 
      value: statsData.totalRequests.toString(),
      icon: <FileText />, // Thay đổi icon
      iconColor: "text-blue-500"  
    },
    { 
      title: "MẶT BẰNG ĐÃ KHẢO SÁT", 
      value: statsData.totalSites.toString(),
      icon: <ClipboardCheck />, // Giữ icon
      iconColor: "text-green-500"  
    },
    { 
      title: "THƯƠNG HIỆU ĐÃ HỢP TÁC", 
      value: statsData.totalBrands.toString(),
      icon: <Handshake />, // Thay đổi icon
      iconColor: "text-red-500"  
    },
    { 
      title: "SỐ LƯỢNG AREA MANAGER", 
      value: statsData.totalAreaManagers.toString(),
      icon: <Users />, // Thay đổi icon
      iconColor: "text-yellow-500"  
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;