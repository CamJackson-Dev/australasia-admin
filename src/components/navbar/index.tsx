"use client";

import { SessionContext } from "@/context/SessionContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { Button } from "../ui/button";
import { AdminContext } from "@/context/AdminContext";

const NavBar = () => {
    const { user } = useContext(AdminContext);
    const { hasSessionExpired, logoutSession } = useContext(SessionContext);

    const pathname = usePathname();
    const isInvitePath = pathname.split("/").includes("invitation");

    if (hasSessionExpired || isInvitePath) return;
    return (
        <div className="w-full flex items-center justify-center bg-[var(--adminSidebar)] px-8">
            <div className="w-full flex items-center justify-between py-3">
                <Link href={"https://pasifikan.com"} target="_blank">
                    <img className="w-32" src={"/pasifikan.png"} />
                </Link>
                {/* <h1 className="font-bold">Australasia</h1> */}

                <div className="flex items-center gap-2">
                    <p className=" font-medium">{user?.displayName}</p>|
                    <Button
                        className="h-8"
                        variant="secondary"
                        onClick={logoutSession}
                    >
                        Log out
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
