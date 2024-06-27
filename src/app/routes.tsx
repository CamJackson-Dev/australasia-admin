"use client";

import React, { useContext, useEffect } from "react";
import "./admin.module.css";
import AdminLogin from "./login";
import { AdminContext } from "@/context/AdminContext";
import useToast from "@/hooks/useToast";

const AdminRoutes = () => {
    const notify = useToast();
    const { haSessionExpired } = useContext(AdminContext);

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
