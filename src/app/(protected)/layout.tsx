// app/(protected)/layout.tsx
"use client";

import React, { useContext } from "react";
import { redirect } from "next/navigation";
import NavBar from "@/components/navbar";
import AdminSidebar from "@/components/sidebar";
import { SessionContext } from "@/context/SessionContext";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { hasChecked, hasSessionExpired } = useContext(SessionContext);

    // don’t redirect until you’ve read localStorage
    if (!hasChecked) return null;

    if (hasSessionExpired) {
        redirect("/");
    }

    return (
        <>
            <NavBar />
            <div className="relative w-full min-h-screen flex items-start justify-center">
                <AdminSidebar />
                <div className="w-5/6">{children}</div>
            </div>
        </>
    );
}
