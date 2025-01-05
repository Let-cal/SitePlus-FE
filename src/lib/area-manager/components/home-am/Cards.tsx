import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheckBig, ClipboardList, ListChecks, TrendingUp } from 'lucide-react';

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
                    {increase} from last month
                </p>
            </div>
        </CardContent>
    </Card>
);

const Cards: React.FC = () => {
    const stats = [
        {
            title: "Approved by manager",
            value: "300",
            increase: "+12.1%",
            icon: <CircleCheckBig />,
            iconColor: "text-blue-500"
        },
        {
            title: "Number of surveys",
            value: "520",
            increase: "+10.1%",
            icon: <ClipboardList />,
            iconColor: "text-green-500"
        },
        {
            title: "Assigned Tasks",
            value: "400",
            increase: "+20.1%",
            icon: <ListChecks />,
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

export default Cards;