// context/SessionContext.tsx
"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { getUuid } from "@/utils/uuid";
import { logout } from "@/utils/firebase/auth";

export interface SessionContextType {
    accessToken: string | null;
    expiresIn: Date | null;
    hasChecked: boolean;
    hasSessionExpired: boolean;
    updateSession: () => void;
    logoutSession: () => Promise<void>;
}

export const SessionContext = React.createContext<SessionContextType>({
    accessToken: null,
    expiresIn: null,
    hasChecked: false,
    hasSessionExpired: true,
    updateSession: () => {},
    logoutSession: async () => {},
});

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [expiresIn, setExpiresIn] = useState<Date | null>(null);
    const [hasChecked, setHasChecked] = useState(false);

    // on mount, read from localStorage exactly once
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const expiry = localStorage.getItem("expiresIn");
        if (token && expiry) {
            setAccessToken(token);
            setExpiresIn(new Date(expiry));
        }
        setHasChecked(true);
    }, []);

    const hasSessionExpired =
        !accessToken || !expiresIn || new Date() > expiresIn;

    const updateSession = () => {
        const newToken = getUuid(50);
        const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        localStorage.setItem("accessToken", newToken);
        localStorage.setItem("expiresIn", expiryDate.toString());
        setAccessToken(newToken);
        setExpiresIn(expiryDate);
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
                hasChecked,
                hasSessionExpired,
                updateSession,
                logoutSession,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};
