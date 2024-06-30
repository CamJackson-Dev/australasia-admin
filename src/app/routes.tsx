"use client";

import React, { useContext, useEffect } from "react";
import "./admin.module.css";
import AdminLogin from "./login";
import { SessionContext } from "@/context/SessionContext";
import useToast from "@/hooks/useToast";

const AdminRoutes = () => {
    const notify = useToast();
    const { haSessionExpired } = useContext(SessionContext);

    useEffect(() => {
        if (haSessionExpired) {
            setTimeout(() => {
                notify("error", "Session Expired. Please login again!");
            }, 100);
        } else {
            setTimeout(() => {
                notify("success", "Session restored again!");
            }, 100);
        }
    }, [haSessionExpired]);

    return <>{haSessionExpired ? <AdminLogin /> : <div></div>}</>;
};

export default AdminRoutes;
