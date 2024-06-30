"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./SessionContext";
import { AdminProvider } from "./AdminContext";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AdminProvider>
                <SessionProvider>{children}</SessionProvider>
            </AdminProvider>
        </QueryClientProvider>
    );
};

export default AllProviders;
