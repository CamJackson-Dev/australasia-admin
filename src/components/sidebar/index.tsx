"use client";

import {
    CalendarClock,
    LayoutDashboard,
    MessageSquareMore,
    Newspaper,
    Palette,
    ScanFace,
    ThumbsUp,
    UserCheck,
} from "lucide-react";
import { NavLink } from "@/components/ui/navlink";
import { SessionContext } from "@/context/SessionContext";
import { useContext } from "react";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
    const { haSessionExpired } = useContext(SessionContext);

    const pathname = usePathname();
    const isInvitePath = pathname.split("/").includes("invitation");

    if (haSessionExpired || isInvitePath) return;

    return (
        <div
            className={`w-1/6 h-screen sticky pt-8 top-0 left-0  bg-[var(--adminSidebar)] duration-300 text-sm`}
        >
            <div className="flex flex-col gap-4">
                <NavLink
                    exact={true}
                    href={`/dashboard`}
                    className={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] text-[var(--subHeader)]"
                    }
                    activeClassName={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] bg-[var(--inputField)] text-sky-500"
                    }
                >
                    <LayoutDashboard className="w-5" />
                    <p className="hidden md:block">Dashboard</p>
                </NavLink>
                <NavLink
                    exact={true}
                    href={`/registrations`}
                    className={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] text-[var(--subHeader)]"
                    }
                    activeClassName={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] bg-[var(--inputField)] text-sky-500"
                    }
                >
                    <UserCheck className="w-5" />
                    <p className="hidden md:block">Associate Registration</p>
                </NavLink>
                <NavLink
                    exact={true}
                    href={`/feedbacks`}
                    className={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] text-[var(--subHeader)]"
                    }
                    activeClassName={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] bg-[var(--inputField)] text-sky-500"
                    }
                >
                    <ThumbsUp className="w-5" />
                    <p className="hidden md:block">Feedback</p>
                </NavLink>
                <NavLink
                    exact={true}
                    href={`/messages`}
                    className={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] text-[var(--subHeader)]"
                    }
                    activeClassName={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] bg-[var(--inputField)] text-sky-500"
                    }
                >
                    <MessageSquareMore className="w-5" />
                    <p className="hidden md:block">Messages</p>
                </NavLink>
                <NavLink
                    exact={true}
                    href={`/articles`}
                    className={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] text-[var(--subHeader)]"
                    }
                    activeClassName={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] bg-[var(--inputField)] text-sky-500"
                    }
                >
                    <Newspaper className="w-5" />
                    <p className="hidden md:block">Articles</p>
                </NavLink>
                <NavLink
                    exact={false}
                    href={`/custom-events`}
                    className={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] text-[var(--subHeader)]"
                    }
                    activeClassName={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] bg-[var(--inputField)] text-sky-500"
                    }
                >
                    <CalendarClock className="w-5" />
                    <p className="hidden md:block">Custom Events</p>
                </NavLink>
                <NavLink
                    exact={false}
                    href={`/custom-themes`}
                    className={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] text-[var(--subHeader)]"
                    }
                    activeClassName={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] bg-[var(--inputField)] text-sky-500"
                    }
                >
                    <Palette className="w-5" />
                    <p className="hidden md:block">Custom Themes</p>
                </NavLink>
                <NavLink
                    exact={false}
                    href={`/access`}
                    className={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] text-[var(--subHeader)]"
                    }
                    activeClassName={
                        "flex items-center gap-2 p-2 mx-4 rounded-md hover:bg-[var(--attractionShadow)] bg-[var(--inputField)] text-sky-500"
                    }
                >
                    <ScanFace className="w-5" />
                    <p className="hidden md:block">Access Management</p>
                </NavLink>
            </div>
        </div>
    );
};

export default AdminSidebar;
