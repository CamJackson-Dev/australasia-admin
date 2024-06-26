"use client";

import {
    CalendarClock,
    MessageSquareMore,
    Palette,
    ThumbsUp,
    UserCheck,
} from "lucide-react";
import { NavLink } from "@/components/ui/navlink";
import { AdminContext } from "@/context/AdminContext";
import { useContext } from "react";

const AdminSidebar = () => {
    const { haSessionExpired } = useContext(AdminContext);

    if (haSessionExpired) return;

    return (
        <div
            className={`w-1/5 h-screen sticky pt-8 top-0 left-0  bg-[var(--adminSidebar)] duration-300`}
        >
            <div className="flex flex-col gap-4">
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
            </div>
        </div>
    );
};

export default AdminSidebar;
