import { User } from "firebase/auth";

export interface SessionContextType {
    accessToken: string | null;
    expiresIn: Date | null;
    haSessionExpired: boolean;
    updateSession: () => void;
    logoutSession: () => void;
}

export interface AdminContextType {
    user: User | null;
    isOwner: boolean;
}
