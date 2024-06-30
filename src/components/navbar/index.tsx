'use client'

import { AdminContext } from "@/context/AdminContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { Button } from "../ui/button";

const NavBar = () => {
    const { haSessionExpired, logoutSession } = useContext(AdminContext);
    
    const pathname = usePathname()
    const isInvitePath = pathname.split("/").includes("invitation")


    if (haSessionExpired || isInvitePath) return;
    return (
        <div className="w-full flex items-center justify-center bg-[var(--adminSidebar)] px-8">
            <div className="w-full flex items-center justify-between">
                <Link href={"https://australasia.com"} target="_blank">
                    <img className="w-52" src={"https://firebasestorage.googleapis.com/v0/b/australasia-ca07e.appspot.com/o/logo%2Flogo2_hkppp9.png?alt=media&token=766459ef-41af-44b2-9c7f-e18dad37a848"} />
                </Link>
                {/* <h1 className="font-bold">Australasia</h1> */}
                
                <div className="flex items-center gap-2">
                    <Link href={"https://australasia.com"} target="_blank">
                        <p className="hover:underline hover:text-primary">Go to website</p>
                    </Link>
                    <Button onClick={logoutSession}>Log out</Button>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
