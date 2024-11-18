import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Bookmark,
    Check,
    Edit2,
    Eye,
    SquareArrowOutUpRight,
    Trash2,
    X,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { DialogTrigger } from "@/components/ui/dialog";
import { updateArticleVerification } from "@/mutations/articles";
import { Button } from "@/components/ui/button";
import { FullPageProgressBar } from "@/components/ProgressBar/ProgressBar";
import CircularProgress from "@/components/ui/loading";
import useToast from "@/hooks/useToast";

export const PreviewColumn = ({ article }: { article: Article }) => {
    return (
        <div className="flex items-center space-x-2">
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                        <Link href={`/articles/${article.handle}`}>
                            <Eye className="h-6 w-6 text-gray-200" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>Preview</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                        <Link
                            href={`https://pasifikan.com/articles/${article.handle}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <SquareArrowOutUpRight
                                className="h-5 w-5 text-gray-200"
                                aria-label="View Homepage"
                            />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>Visit</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export const ActionsColumn = ({
    article,
    deleteArticle,
    refetch,
}: {
    article: Article;
    deleteArticle: any;
    refetch: any;
}) => {
    const notify = useToast();
    const [updating, setUpdating] = useState(false);
    const unverify = async () => {
        setUpdating(true);
        await updateArticleVerification(article.id, false);
        await refetch();
        notify("success", `Article "${article.title}" unverified`);
        setUpdating(false);
    };

    const verify = async () => {
        setUpdating(true);
        await updateArticleVerification(article.id, true);
        await refetch();
        notify("success", `Article "${article.title}" verified`);
        setUpdating(false);
    };

    return (
        <div className="flex items-center space-x-2 pl-2">
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                        {updating ? (
                            <CircularProgress stroke={2} width={20} />
                        ) : article.verified ? (
                            <div
                                onClick={unverify}
                                className="p-0 bg-transparent hover:bg-transparent"
                            >
                                <X className="h-5 w-5 text-red-400" />
                            </div>
                        ) : (
                            <div
                                onClick={verify}
                                className="p-0 bg-transparent hover:bg-transparent"
                            >
                                <Check className="h-5 w-5 text-green-400" />
                            </div>
                        )}
                    </TooltipTrigger>
                    <TooltipContent>
                        {article.verified ? "Unverify" : "Verify"}
                    </TooltipContent>
                </Tooltip>
                {/* <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                        <Edit2 className="h-5 w-5 text-blue-400" />
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                </Tooltip> */}

                <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                        <DialogTrigger>
                            <Trash2
                                onClick={() => deleteArticle(article)}
                                className="h-5 w-5 text-red-500 mt-1"
                            />
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};
