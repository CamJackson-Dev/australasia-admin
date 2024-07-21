interface Article {
    id?: string;
    userId: string;
    title: string;
    banner: File | string;
    description: string;
    tags: string[];
    verified: boolean;
    publishedDate: number;
}
