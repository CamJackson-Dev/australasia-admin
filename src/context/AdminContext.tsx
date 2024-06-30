"use client";

import React, { useEffect, useState } from "react";
import { AdminContextType } from "@/types/admin";
import { auth } from "@/utils/firebase/firebase";
import { User } from "firebase/auth";

export const AdminContext = React.createContext<AdminContextType>({
    user: null,
    isOwner: false,
});

interface AdminProviderProps {
    children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const listener = auth.onAuthStateChanged(async (user) => {
            setUser(user);

            if (!user) return;

            const tokens = await user.getIdTokenResult();
            // console.log(tokens);
            if (tokens.claims.role == "owner") {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        });

        return () => {
            listener();
        };
    }, []);

    return (
        <AdminContext.Provider
            value={{
                user,
                isOwner,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};
