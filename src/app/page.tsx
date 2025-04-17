// app/page.tsx
"use client";

import React, { useContext } from "react";
import AdminLogin from "./login";
import Dashboard from "./(protected)/dashboard/page";
import { SessionContext } from "@/context/SessionContext";
import useToast from "@/hooks/useToast";
import NavBar from "@/components/navbar";
import AdminSidebar from "@/components/sidebar";

export default function HomePage() {
    const { hasChecked, hasSessionExpired } = useContext(SessionContext);
    const notify = useToast();

    React.useEffect(() => {
        if (!hasChecked) return;
        if (hasSessionExpired) {
            notify("error", "Session expired. Please log in again!");
        } else {
            notify("success", "Welcome back!");
        }
    }, [hasChecked, hasSessionExpired, notify]);

    // wait until session is loaded
    if (!hasChecked) return null;

    // Not logged‑in → show login page (no nav/sidebar)
    if (hasSessionExpired) {
        return <AdminLogin />;
    }

    // Logged‑in → show dashboard wrapped in nav + sidebar
    return (
        <>
            <NavBar />
            <div className="relative w-full min-h-screen flex items-start justify-center">
                <AdminSidebar />
                <div className="w-5/6">
                    <Dashboard />
                </div>
            </div>
        </>
    );
}
