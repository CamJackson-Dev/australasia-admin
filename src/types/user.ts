export interface User {
    authProvider: "google" | "facebook" | "email";
    email: string;
    emailVerified: boolean;
    fullName: string;
    phone: string;
    type: string;
    handle?: string;
    status?: string;
    vip?: boolean;
    id: string;
    businessSubscription?: string;

    joinDate?: number;
    about?: string;
    gender?: "male" | "female" | "other";
    avatar?: string;
    banner?: string;
    country?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
}
