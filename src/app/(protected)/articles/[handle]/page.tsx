"use client";

import Head from "next/head";
import { Fragment } from "react";
import { useQuery } from "react-query";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import { getArticleAuthor, getArticles } from "@/mutations/articles";
import { FullPageProgressBar } from "@/components/ProgressBar/ProgressBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User2 } from "lucide-react";
import Link from "next/link";
// import { capitalize } from "@/utils/capitalize";

const IndividualArticle = ({ params }: { params: { handle: string } }) => {
    const router = useRouter();
    const handle = params.handle;

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", handle],
        queryFn: async () => {
            const res = await getArticles({ handle });

            const data = res.docs[0].data() as Article;
            return data;
        },
        enabled: !!handle,
    });

    const { data: authorData, isLoading: isAuthorLoading } = useQuery({
        queryKey: ["article", handle, "author"],
        queryFn: async () => {
            if (article?.isAdmin) return null;

            const res = await getArticleAuthor(article?.userId);
            const data = res.data() as AssociateInfo;
            return data;
        },
        enabled: !!article,
    });

    const getURL = () => {
        if (typeof article.banner == "string") return article.banner;
        return URL.createObjectURL(article.banner);
    };

    if (isLoading) return <FullPageProgressBar />;

    if (!article)
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-cl font-semibold">Article Not Found</p>
            </div>
        );

    return (
        <Fragment>
            <Head>
                <title>{article.title} - Pasifikan</title>
            </Head>
            <div className="w-full flex justify-center">
                <div className="w-[90%] mt-8 mb-10 flex flex-col gap-6">
                    <div className="relative flex items-center justify-center">
                        <Button
                            onClick={() => router.back()}
                            className=" absolute left-0 top-0 hover:bg-transparent"
                            variant="ghost"
                        >
                            <ArrowLeft className="text-white w-6 h-6" />
                        </Button>
                        <h1 className="text-4xl font-semibold text-center">
                            {article.title}
                        </h1>
                    </div>
                    <p className="text-right italic">
                        {"-" +
                            " " +
                            new Date(article.publishedDate).toDateString()}
                    </p>
                    <img
                        className="w-full h-[400px] rounded-md object-cover object-center"
                        src={getURL()}
                    />

                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(article.description),
                        }}
                    ></div>

                    {authorData && (
                        <Link
                            target="_blank"
                            href={`https://pasifikan.com/associate/${authorData.handle}`}
                        >
                            <div className="w-full flex justify-end">
                                <div className=" shadow-lg w-max p-3 px-6 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        {authorData.avatar ? (
                                            <img
                                                className="w-16 h-16 rounded-full"
                                                src={authorData.avatar}
                                            />
                                        ) : (
                                            <User2 className="w-10 h-10 rounded-full text-white bg-gray-500 p-1" />
                                        )}
                                        <div>
                                            <p className="text-lg font-semibold">
                                                {authorData.fullname}
                                            </p>
                                            <p>{authorData.type}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {article.tags && article.tags.length > 0 && (
                        <div>
                            <h2 className="mb-2 font-medium">Related tags:</h2>
                            <div className="flex gap-2 mb-8">
                                {article.tags.map((tag) => (
                                    <div
                                        className="bg-[var(--inputField)] rounded-full p-1 px-3"
                                        key={tag}
                                    >
                                        <p className="text-sm">{tag}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default IndividualArticle;
