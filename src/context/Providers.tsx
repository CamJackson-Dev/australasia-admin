"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AdminProvider } from "./AdminContext";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AdminProvider>{children}</AdminProvider>
        </QueryClientProvider>
    );
};

export default AllProviders;
