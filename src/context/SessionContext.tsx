"use client";

import React, { useEffect, useState } from "react";
import { SessionContextType } from "@/types/admin";
import { getUuid } from "@/utils/uuid";
import { logout } from "@/utils/firebase/auth";

export const SessionContext = React.createContext<SessionContextType>({
    accessToken: null,
    expiresIn: null,
    haSessionExpired: true,
    updateSession: () => {},
    logoutSession: () => {},
});

interface SessionProviderProps {
    children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
    children,
}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [expiresIn, setExpiresIn] = useState<Date | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const expiry = localStorage.getItem("expiresIn");

        if (accessToken && expiry) {
            setAccessToken(accessToken);
            setExpiresIn(new Date(expiry));
        }
    }, []);

    const haSessionExpired: boolean =
        !accessToken || !expiresIn || new Date() > expiresIn;

    const updateSession = () => {
        const accessToken = getUuid(50);
        const date = new Date();
        const expiry = new Date(date.getTime() + 15 * 60000);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("expiresIn", expiry.toString());
        setAccessToken(accessToken);
        setExpiresIn(expiry); //15 is the session duration in minutes
    };

    const logoutSession = async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expiresIn");
        setAccessToken(null);
        setExpiresIn(null);
        await logout();
    };

    return (
        <SessionContext.Provider
            value={{
                accessToken,
                expiresIn,
                haSessionExpired,
                updateSession,
                logoutSession,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};
