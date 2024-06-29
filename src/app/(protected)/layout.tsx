'use client'

import { AdminContext } from "@/context/AdminContext";
import { redirect, usePathname } from "next/navigation";
import { useContext } from "react";

export default function Layout({children}: {children: React.ReactNode}) {
    const { haSessionExpired } = useContext(AdminContext)
    
    if (haSessionExpired){
        redirect("/")
    }
    return children
}