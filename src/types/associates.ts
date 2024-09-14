type UserType = "user" | "photographer" | "writer" | "merchant" | "artist";

type Social =
    | "Facebook"
    | "Instagram"
    | "Twitter"
    | "Youtube"
    | "Website"
    | "Tiktok";

type SocialLinks = {
    [K in Social]: string;
};

interface AssociateGalleryImage {
    image: string | File;
    name: string;
    description: string;
    price: number;
}

interface AssociateInfo {
    avatar: string | null;
    banner: string | null;
    description: string;
    email: string;
    fullname: string;
    gallery: AssociateGalleryImage[];
    handle: string;
    links: string[] | null;
    social: SocialLinks | null;
    logo: string | null;
    logoUrl: string | null;
    phone: string | null;
    type: UserType;
    userID?: string;
    signatures?: string[] | null;

    //artist location
    country?: string | null;
    province?: string | null;
    city?: string | null;
    village?: string | null;
    mob?: string | null;
    verified?: boolean;
}
