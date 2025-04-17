"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { UsersTable } from "@/components/dashboard/users-table";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { QueryClient, QueryClientProvider } from "react-query";
import { User } from "@/types/user";
import { useMemo } from "react";

const queryClient = new QueryClient();

export default function Dashboard() {
    return (
        <QueryClientProvider client={queryClient}>
            <DashboardContent />
        </QueryClientProvider>
    );
}

function DashboardContent() {
    const {
        data: usersData,
        isLoading: usersLoading,
        refetch: refetchUsers,
    } = useFirestoreQuery("users");

    const { data: businessData, isLoading: businessLoading } =
        useFirestoreQuery("business");

    const { data: associateData, isLoading: associateLoading } =
        useFirestoreQuery("associates");

    const users = useMemo(() => {
        return usersData?.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as User)
        );
    }, [usersData]);

    const associates = useMemo(() => {
        return associateData?.docs.map(
            (doc) => ({ ...doc.data(), userID: doc.id } as AssociateInfo)
        );
    }, [associateData]);

    const statsData = useMemo(() => {
        const totalUsers = users?.length;
        const newUsers = users?.filter(
            (user) => user.joinDate > Date.now() - 30 * 24 * 60 * 60 * 1000
        ).length; // 30 days
        const totalAssociates = users?.filter(
            (user) => user.type != "user"
        ).length;
        const totalBusinesses = businessData?.docs.length;

        return {
            totalUsers,
            newUsers,
            totalAssociates,
            totalBusinesses,
        };
    }, [users, businessData]);

    const handleUserUpdate = async () => {
        await refetchUsers();
    };

    return (
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <StatsOverview
                data={statsData}
                isLoading={usersLoading || businessLoading}
            />
            <ChartsSection
                userData={users}
                associateData={associates}
                isLoading={usersLoading || associateLoading}
            />
            <UsersTable
                userData={users}
                isLoading={usersLoading}
                onUserUpdate={handleUserUpdate}
            />
        </div>
    );
}
