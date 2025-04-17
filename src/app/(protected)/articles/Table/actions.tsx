import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Bookmark,
    Check,
    Edit2,
    Eye,
    MoreVertical,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className="flex items-center justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-[var(--inputField)]"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white ">
                    <DropdownMenuItem
                        onClick={article.verified ? unverify : verify}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        {updating ? (
                            <CircularProgress stroke={2} width={16} />
                        ) : article.verified ? (
                            <>
                                <X className="h-4 w-4 text-red-400" />
                                <span>Unverify</span>
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4 text-green-400" />
                                <span>Verify</span>
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => deleteArticle(article)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
