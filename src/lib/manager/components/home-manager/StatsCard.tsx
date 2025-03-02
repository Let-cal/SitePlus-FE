import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ClipboardCheck, Briefcase, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  increase: string;
  icon: React.ReactNode;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, increase, icon, iconColor }) => (
  <Card className="rounded-xl border bg-card text-card-foreground shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium leading-none tracking-tight">{title}</CardTitle>
      {React.cloneElement(icon as React.ReactElement, { 
        className: `h-8 w-8 ${iconColor}` 
      })}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <p className="text-xs text-muted-foreground">
                    {increase} từ tháng trước
                </p>
            </div>
    </CardContent>
  </Card>
);

const StatsCards: React.FC = () => {
  const stats = [
    { 
      title: "Tổng số yêu cầu", 
      value: "700", 
      increase: "+20.1%",
      icon: <MessageSquare />,
      iconColor: "text-blue-500"  
    },
    { 
      title: "Tổng mặt bằng đã khảo sát", 
      value: "520", 
      increase: "+10.1%",
      icon: <ClipboardCheck />,
      iconColor: "text-green-500"  
    },
    { 
      title: "Dự án thành công", 
      value: "300", 
      increase: "+12.2%",
      icon: <Briefcase />,
      iconColor: "text-red-500"  
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;