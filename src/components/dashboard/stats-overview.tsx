import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Building2,
    BriefcaseBusiness,
    Handshake,
    UserPlus,
} from "lucide-react";
import { QuerySnapshot, DocumentData } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsOverviewProps {
    data: {
        totalUsers: number;
        newUsers: number;
        totalAssociates: number;
        totalBusinesses: number;
    };
    isLoading: boolean;
}

export function StatsOverview({ data, isLoading }: StatsOverviewProps) {
    const stats = [
        {
            title: "Total Users",
            value: data?.totalUsers?.toString() || "0",
            subTitle: "on the platform",
            icon: Users,
        },
        {
            title: "New Users",
            value: data?.newUsers?.toString() || "0",
            subTitle: "in the last 30 days",
            icon: UserPlus,
        },
        {
            title: "Associates",
            value: data?.totalAssociates?.toString() || "0",
            subTitle: "on the platform",
            icon: Handshake,
        },
        {
            title: "Businesses",
            value: data?.totalBusinesses?.toString() || "0",
            subTitle: "on the platform",
            icon: BriefcaseBusiness,
        },
    ];

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card
                        className="bg-[var(--adminSidebar)] border-[var(--inputField)] text-white border-2 rounded-2xl"
                        key={stat.title}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24 bg-[var(--inputField)]" />
                            <Skeleton className="h-4 w-32 mt-2 bg-[var(--inputField)]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card
                    className="bg-[var(--adminSidebar)] border-[var(--inputField)] text-white border-2 rounded-2xl"
                    key={stat.title}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.subTitle}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
