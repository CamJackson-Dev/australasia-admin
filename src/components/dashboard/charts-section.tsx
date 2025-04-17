"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
    LineChart,
    PieChart,
    BarChart,
    Bar,
    ResponsiveContainer,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Pie,
    Cell,
} from "recharts";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

const USER_TYPES = ["user", "artist", "merchant", "photographer", "writer"];

function countUsersUpToTime(users: User[], endTime: number): number {
    return users.filter((u) => (u.joinDate ?? 0) <= endTime).length;
}

type TimePeriod = "1day" | "7days" | "30days" | "1year" | "5years";
interface ChartsSectionProps {
    userData?: User[];
    associateData?: AssociateInfo[];
    isLoading: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function ChartsSection({
    userData,
    associateData,
    isLoading,
}: ChartsSectionProps) {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("7days");
    const growthData = getChartDataForTimePeriod(userData, timePeriod);
    const distributionData = getUserDistributionData(userData);
    const stateDistributionData =
        getAssociateDistributionByState(associateData);

    const chartConfig = {
        totalUsers: {
            label: "Total Users",
            color: "#8884d8",
        },
        newUsers: {
            label: "New Users",
            color: "#82ca9d",
        },
        ...Object.fromEntries(
            USER_TYPES.map((type, index) => [
                type,
                {
                    label: type.charAt(0).toUpperCase() + type.slice(1),
                    color: COLORS[index % COLORS.length],
                },
            ])
        ),
    };

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2 bg-[var(--adminSidebar)] border-[var(--inputField)] text-white border-2 rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-32 bg-[var(--inputField)]" />
                            <Skeleton className="h-10 w-48 bg-[var(--inputField)]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full bg-[var(--inputField)]" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2 bg-[var(--adminSidebar)] border-[var(--inputField)] text-white border-2 rounded-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>User Growth</CardTitle>
                        <Tabs
                            defaultValue="7days"
                            onValueChange={(value) =>
                                setTimePeriod(value as TimePeriod)
                            }
                        >
                            <TabsList className="bg-[var(--inputField)] text-white">
                                <TabsTrigger
                                    value="1day"
                                    className="hidden sm:block"
                                >
                                    1 Day
                                </TabsTrigger>
                                <TabsTrigger value="1day" className="sm:hidden">
                                    1
                                </TabsTrigger>
                                <TabsTrigger
                                    value="7days"
                                    className="hidden sm:block"
                                >
                                    7 Days
                                </TabsTrigger>
                                <TabsTrigger
                                    value="7days"
                                    className="sm:hidden"
                                >
                                    7
                                </TabsTrigger>
                                <TabsTrigger
                                    value="30days"
                                    className="hidden sm:block"
                                >
                                    30 Days
                                </TabsTrigger>
                                <TabsTrigger
                                    value="30days"
                                    className="sm:hidden"
                                >
                                    30
                                </TabsTrigger>
                                <TabsTrigger
                                    value="1year"
                                    className="hidden sm:block"
                                >
                                    1 Year
                                </TabsTrigger>
                                <TabsTrigger
                                    value="1year"
                                    className="sm:hidden"
                                >
                                    365
                                </TabsTrigger>
                                <TabsTrigger
                                    value="5years"
                                    className="hidden sm:block"
                                >
                                    5 Years
                                </TabsTrigger>
                                <TabsTrigger
                                    value="5years"
                                    className="sm:hidden"
                                >
                                    5Y
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="h-[360px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData} width={1000}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip
                                    content={
                                        <ChartTooltipContent className="bg-[var(--adminSidebar)] !text-white [&_*]:!text-white" />
                                    }
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="totalUsers"
                                    stroke="#8884d8"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="newUsers"
                                    stroke="#82ca9d"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="bg-[var(--adminSidebar)] border-[var(--inputField)] text-white border-2 rounded-2xl">
                <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        <ChartContainer
                            config={chartConfig}
                            className="h-full w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="80%"
                                        label={({ name, percent }) =>
                                            `${name} (${(percent * 100).toFixed(
                                                0
                                            )}%)`
                                        }
                                    >
                                        {distributionData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip
                                        content={
                                            <ChartTooltipContent className="bg-[var(--adminSidebar)] !text-white [&_*]:!text-white" />
                                        }
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-[var(--adminSidebar)] border-[var(--inputField)] text-white border-2 rounded-2xl">
                <CardHeader>
                    <CardTitle>Associates by State</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        <ChartContainer
                            config={chartConfig}
                            className="h-full w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={stateDistributionData}
                                    layout="vertical"
                                >
                                    <XAxis type="number" />
                                    <YAxis
                                        type="category"
                                        dataKey="state"
                                        width={100}
                                    />
                                    <Tooltip
                                        content={
                                            <ChartTooltipContent className="bg-[var(--adminSidebar)] !text-white [&_*]:!text-white" />
                                        }
                                    />
                                    <Legend />
                                    <Bar dataKey="count">
                                        {stateDistributionData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={entry.state}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function getChartDataForTimePeriod(users: User[], timePeriod: TimePeriod) {
    if (!users || !users.length) return [];

    const validUsers = users.filter((u) => typeof u.joinDate === "number");
    validUsers.sort((a, b) => (a.joinDate ?? 0) - (b.joinDate ?? 0));

    const now = Date.now();
    const ONE_HOUR = 3600_000;
    const ONE_DAY = 24 * ONE_HOUR;

    let timestamps: number[] = [];
    switch (timePeriod) {
        case "1day":
            for (let i = 10; i >= 0; i--) {
                timestamps.push(now - i * ONE_HOUR);
            }
            break;

        case "7days":
            for (let i = 7; i >= 0; i--) {
                timestamps.push(now - i * ONE_DAY);
            }
            break;

        case "30days":
            for (let i = 30; i >= 0; i--) {
                timestamps.push(now - i * ONE_DAY);
            }
            break;

        case "1year":
            for (let i = 12; i >= 0; i--) {
                timestamps.push(now - i * 30 * ONE_DAY);
            }
            break;

        case "5years":
            for (let i = 5; i >= 0; i--) {
                timestamps.push(now - i * 365 * ONE_DAY);
            }
            break;
    }

    const data = timestamps.map((ts, idx) => {
        const totalUpToThisTime = countUsersUpToTime(validUsers, ts);
        const totalUpToPrevious =
            idx === 0 ? 0 : countUsersUpToTime(validUsers, timestamps[idx - 1]);
        const newUsersInInterval = totalUpToThisTime - totalUpToPrevious;

        let label: string;
        const d = new Date(ts);
        switch (timePeriod) {
            case "1day":
                label = d.getHours().toString().padStart(2, "0") + ":00";
                break;
            case "7days":
            case "30days":
                label = d.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                });
                break;
            case "1year":
            case "5years":
                label = d.toLocaleDateString([], {
                    month: "short",
                    year: "numeric",
                });
                break;
        }

        return {
            label,
            totalUsers: totalUpToThisTime,
            newUsers: newUsersInInterval < 0 ? 0 : newUsersInInterval,
        };
    });

    return data;
}

function getUserDistributionData(
    users: User[]
): { name: UserType; value: number }[] {
    const distribution = users?.reduce((acc, user) => {
        const role = user.type as UserType;
        if (!role || role == "user") return acc;
        if (!acc[role]) {
            acc[role] = 0;
        }
        acc[role]++;
        return acc;
    }, {} as Record<UserType, number>);

    return Object.entries(distribution || {})
        .map(([role, count]) => ({
            name: role as UserType,
            value: count,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

function getAssociateDistributionByState(associates: AssociateInfo[]) {
    if (!associates || !associates.length) return [];

    const AUSTRALIAN_STATES = [
        "NSW",
        "New South Wales",
        "VIC",
        "Victoria",
        "QLD",
        "Queensland",
        "WA",
        "Western Australia",
        "SA",
        "South Australia",
        "TAS",
        "Tasmania",
        "ACT",
        "Australian Capital Territory",
        "NT",
        "Northern Territory",
    ];

    const stateCounts = associates.reduce((acc, associate) => {
        const state = associate.province || "Unknown";

        if (state === "Unknown") {
            if (!acc["Unknown"]) {
                acc["Unknown"] = 0;
            }
            acc["Unknown"]++;
        } else if (AUSTRALIAN_STATES.includes(state)) {
            if (!acc[state]) {
                acc[state] = 0;
            }
            acc[state]++;
        } else {
            if (!acc["Others"]) {
                acc["Others"] = 0;
            }
            acc["Others"]++;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(stateCounts)
        .map(([state, count]) => ({
            state,
            count,
        }))
        .sort((a, b) => {
            // Sort Unknown to the end
            if (a.state === "Unknown") return 1;
            if (b.state === "Unknown") return -1;
            // Sort Others to second last
            if (a.state === "Others") return 1;
            if (b.state === "Others") return -1;
            // Sort by count for the rest
            return b.count - a.count;
        });
}
