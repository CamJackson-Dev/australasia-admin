export interface AdminContextType {
    accessToken: string | null;
    expiresIn: Date | null;
    haSessionExpired: boolean;
    updateSession: () => void;
}
