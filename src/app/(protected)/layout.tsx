"use client";

import NavBar from "@/components/navbar";
import AdminSidebar from "@/components/sidebar";
import { SessionContext } from "@/context/SessionContext";
import { redirect, usePathname } from "next/navigation";
import { Fragment, useContext } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { haSessionExpired } = useContext(SessionContext);

    if (haSessionExpired) {
        redirect("/");
    }
    return children;
    // return (
    //     <Fragment>
    //         <NavBar />
    //         <div className="relative w-full min-h-screen flex items-start justify-center">
    //             <AdminSidebar />
    //             <div className="w-4/5 ">{children}</div>
    //         </div>
    //     </Fragment>
    // )
}
