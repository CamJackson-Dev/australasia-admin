interface Article {
    id?: string;
    handle: string;
    userId: string;
    userHandle: string;
    title: string;
    banner: File | string;
    description: string;
    tags: string[];
    verified: boolean;
    publishedDate: number;
    isAdmin: boolean;
}
