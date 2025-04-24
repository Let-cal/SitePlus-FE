import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, ListChecks } from 'lucide-react'; // Thay CircleCheckBig bằng Users
import areaManagerService from "../../../../services/area-manager/area-manager.service";

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
                className: `h-8 w-8 ${iconColor}`
            })}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const Cards: React.FC = () => {
    const [stats, setStats] = React.useState([
        {
            title: "SỐ LƯỢNG NHÂN VIÊN",
            value: "0",
            icon: <Users />, // Thay CircleCheckBig thành Users
            iconColor: "text-blue-500"
        },
        {
            title: "SỐ LƯỢNG KHẢO SÁT",
            value: "0",
            icon: <ClipboardList />, // Giữ nguyên
            iconColor: "text-green-500"
        },
        {
            title: "SỐ LƯỢNG CÔNG VIỆC HOÀN THÀNH",
            value: "0",
            icon: <ListChecks />, // Giữ nguyên
            iconColor: "text-red-500"
        },
    ]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const dashboardData = await areaManagerService.fetchDashboardStatistics();
                if (dashboardData) {
                    setStats([
                        {
                            title: "SỐ LƯỢNG NHÂN VIÊN",
                            value: dashboardData.activeStaffCount.toString(),
                            icon: <Users />, // Thay CircleCheckBig thành Users
                            iconColor: "text-blue-500"
                        },
                        {
                            title: "SỐ LƯỢNG KHẢO SÁT",
                            value: dashboardData.surveyCount.toString(),
                            icon: <ClipboardList />, // Giữ nguyên
                            iconColor: "text-green-500"
                        },
                        {
                            title: "SỐ LƯỢNG CÔNG VIỆC HOÀN THÀNH",
                            value: dashboardData.completedTaskCount.toString(),
                            icon: <ListChecks />, // Giữ nguyên
                            iconColor: "text-red-500"
                        },
                    ]);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {isLoading ? (
                <div className="col-span-3 flex items-center justify-center h-[120px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                stats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))
            )}
        </div>
    );
};

export default Cards;