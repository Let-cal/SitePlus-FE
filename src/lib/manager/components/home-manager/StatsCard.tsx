import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ClipboardCheck, Briefcase, Search } from 'lucide-react';

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
  const stats = [
    { 
      title: "Tổng số yêu cầu", 
      value: "700",
      icon: <MessageSquare />,
      iconColor: "text-blue-500"  
    },
    { 
      title: "Tổng mặt bằng đã khảo sát", 
      value: "520",
      icon: <ClipboardCheck />,
      iconColor: "text-green-500"  
    },
    { 
      title: "Dự án thành công", 
      value: "300",
      icon: <Briefcase />,
      iconColor: "text-red-500"  
    },
    { 
      title: "Yêu cầu cần khảo sát mới", 
      value: "90",
      icon: <Search />,
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