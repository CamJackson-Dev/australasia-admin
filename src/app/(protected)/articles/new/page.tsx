"use client";

import TagsInput from "@/components/TagsInput";
import { FullPageProgressBar } from "@/components/ProgressBar/ProgressBar";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { articleTags } from "@/data/articleTags";
import useToast from "@/hooks/useToast";
import { uploadArticle, uploadArticleBanner } from "@/mutations/articles";
import { getHandleFromName } from "@/utils/getHandle";
import { getObjectUrl } from "@/utils/getObjectUrl";
import { getUuid } from "@/utils/uuid";
import Head from "next/head";
import { ChangeEvent, Fragment, useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
// import { AuthContext } from "src/config/auth";

const NewArticle = () => {
    const notify = useToast();
    const router = useRouter();
    // const { userInfo } = useContext(AuthContext);

    const [bannerError, setBannerError] = useState(false);
    const [descriptionError, setDescriptionError] = useState("");
    const [data, setData] = useState<Article>({
        title: "",
        handle: "",
        userId: "",
        userHandle: "",
        description: "",
        banner: "",
        tags: [],
        verified: true,
        publishedDate: 0,
        isAdmin: true,
    });

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            id: getUuid(20),
            publishedDate: new Date().getTime(),
        }));
    }, []);

    const { mutateAsync, isLoading } = useMutation({
        mutationKey: ["article", "upload"],
        mutationFn: async (val: Article) => {
            const res = await uploadArticleBanner(val);
            await uploadArticle(res);
        },
        onSuccess: async () => {
            await router.push(`/articles`);
            notify("success", "Article uploaded successfully!");
        },
    });

    const handleChange = <K extends keyof Article>(
        key: K,
        value: Article[K]
    ) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        // console.log(files[0]);
        if (files[0]) {
            handleChange("banner", files[0]);
            setBannerError(false);
        } else {
            setBannerError(true);
        }
    };

    const handleTagsChange = (tags: string[]) => {
        handleChange("tags", tags);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (bannerError) {
            return;
        }
        if (!data.banner) {
            setBannerError(true);
            return;
        }

        if (data.description.length < 100) {
            setDescriptionError("Minimum 100 characters required");
            return;
        } else if (data.description.length == 0) {
            setDescriptionError("Description required");
            return;
        } else {
            setDescriptionError("");
        }
        await mutateAsync({ ...data, handle: getHandleFromName(data.title) });
        // console.log(data);
    };

    if (isLoading) return <FullPageProgressBar />;

    return (
        <Fragment>
            <Head>
                <title>Create Article</title>
            </Head>
            <div className="w-full min-h-[calc(100%_+_10rem] flex justify-center">
                <div className="w-[90%] py-10">
                    <div className="relative flex items-center justify-center mb-6">
                        <Button
                            onClick={() => router.back()}
                            className=" absolute -left-4 top-0 hover:bg-transparent"
                            variant="ghost"
                        >
                            <ArrowLeft className="text-white w-6 h-6" />
                        </Button>
                        <h1 className="text-2xl font-semibold text-center">
                            Create new article
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <p className="font-medium">Title: </p>
                            <Input
                                required
                                type="text"
                                value={data.title}
                                className="bg-[var(--inputField)] border-0"
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-6">
                            <p className="font-medium">Banner: </p>
                            <label htmlFor="banner_upload">
                                <div className="relative w-full h-48 flex items-center justify-center bg-[var(--inputField)] rounded-md cursor-pointer">
                                    {data.banner ? (
                                        <div className="relative group w-full h-full ">
                                            <img
                                                className="w-full h-full object-cover rounded-md group-hover:bg-blend-overlay"
                                                src={getObjectUrl(data.banner)}
                                            />
                                            <div className="absolute w-full h-full duration-150 top-0 left-0 group-hover:bg-[rgba(0,0,0,0.8)] flex items-center justify-center">
                                                <p className="hidden group-hover:flex">
                                                    Change banner
                                                </p>
                                            </div>
                                            <input
                                                id="banner_upload"
                                                className=" invisible absolute"
                                                type="file"
                                                accept="image/png, image/gif, image/jpeg"
                                                onChange={handleBannerChange}
                                            />
                                        </div>
                                    ) : (
                                        <Fragment>
                                            <p>Upload Banner Image</p>
                                            <input
                                                id="banner_upload"
                                                className="invisible absolute"
                                                type="file"
                                                accept="image/png, image/gif, image/jpeg"
                                                onChange={handleBannerChange}
                                            />
                                        </Fragment>
                                    )}
                                </div>
                                {bannerError && (
                                    <p className="text-sm text-red-400">
                                        Banner image required
                                    </p>
                                )}
                            </label>
                        </div>
                        <div className="mb-6">
                            <p className="font-medium">Description: </p>
                            <RichTextEditor
                                className="h-80 rounded-md"
                                value={data.description}
                                onChange={(value) =>
                                    handleChange("description", value)
                                }
                            />

                            <p className="text-sm  mt-12 text-red-400">
                                {descriptionError}
                            </p>
                        </div>
                        <div className="mb-6">
                            <p className="font-medium">Tags: </p>
                            <TagsInput
                                tags={data.tags}
                                options={articleTags}
                                updateTags={handleTagsChange}
                            />
                        </div>
                        <div className="mb-6 flex justify-end">
                            <button
                                type="submit"
                                className="bg-primary p-1.5 px-4 rounded-md text-white"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default NewArticle;
