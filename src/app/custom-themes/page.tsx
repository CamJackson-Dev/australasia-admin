"use client";

import { useMutation, useQuery } from "react-query";
import {
    getAllThemes,
    getDefaultTheme,
    updateThemeListing,
    uploadDefaultTheme,
} from "@/mutations/themes";
import { useState } from "react";
import Link from "next/link";
import useToast from "@/hooks/useToast";
import { ThemeDetails } from "@/types/theme";
import CircularProgress from "@/components/ui/loading";
import { CircleCheck, Eye, EyeOff } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export interface DefaultTheme {
    name: string;
    themeId: string;
}

const CustomTheme = () => {
    const notify = useToast();
    const { allThemes, refetchAllThemes } = useTheme();

    const [localDefaultTheme, setLocalDefaultTheme] = useState<DefaultTheme>();

    const {
        data: defaultTheme,
        isLoading: defaultLoading,
        refetch,
    } = useQuery(["defaultTheme"], async () => {
        const res = await getDefaultTheme();
        const localTheme = res.data() as DefaultTheme;
        setLocalDefaultTheme(localTheme);

        return localTheme;
    });

    const { mutate, isLoading: isUpdating } = useMutation({
        mutationFn: async ({
            theme,
            listing,
        }: {
            theme: ThemeDetails;
            listing: boolean;
        }) => {
            await updateThemeListing(theme, listing);
        },
        onSuccess: async () => {
            // console.log(data);
            notify("success", "Theme updated successfully!");
            await refetchAllThemes();
        },
    });

    const updateDefaultTheme = async () => {
        await uploadDefaultTheme(localDefaultTheme);
        notify("success", "Default Theme updated successfully!");
        refetch();
    };

    const ThemeTile = (props: { data: ThemeDetails }) => {
        const { name, themeId, listed } = props.data;
        const isDefault = defaultTheme && themeId == localDefaultTheme?.themeId;

        const changeLocalTheme = () => {
            if (!listed) {
                notify("error", "Unlisted themes can't be default themes");
                return;
            }
            setLocalDefaultTheme({
                name: name,
                themeId: themeId,
            });
        };

        return (
            <div className="w-full p-3 px-4 flex justify-between bg-[var(--inputField)] rounded-sm ">
                <p className="text-base">{name}</p>
                <div className="flex gap-4 items-center">
                    {listed ? (
                        <Eye
                            className="cursor-pointer text-sky-400"
                            // color={"primary"}
                            onClick={() =>
                                mutate({
                                    theme: props.data,
                                    listing: false,
                                })
                            }
                        />
                    ) : (
                        <EyeOff
                            className="cursor-pointer text-red-400"
                            // fontSize="small"
                            // color={"disabled"}
                            onClick={() =>
                                mutate({
                                    theme: props.data,
                                    listing: true,
                                })
                            }
                        />
                    )}
                    <CircleCheck
                        className="cursor-pointer"
                        onClick={changeLocalTheme}
                        // fontSize="small"
                        color={isDefault ? "lime" : "gray"}
                    />
                </div>
            </div>
        );
    };

    if (defaultLoading || isUpdating)
        return (
            <div className="w-full h-[90vh] flex items-center justify-center">
                <CircularProgress />
            </div>
        );

    return (
        <div className="mx-10 mb-10">
            <div className="flex items-center justify-between">
                <p className="text-lg">All available themes</p>

                <Link href={"custom-themes/create"}>
                    <div className="p-2 px-4 bg-sky-500 rounded-md">
                        + Create Theme
                    </div>
                </Link>
            </div>
            <div className="flex flex-col gap-4 mt-8">
                {defaultTheme &&
                    allThemes?.map((theme) => (
                        <ThemeTile key={theme.themeId} data={theme} />
                    ))}
            </div>
            <div className="w-full flex justify-end my-6">
                <button
                    type="button"
                    onClick={updateDefaultTheme}
                    className="p-2 px-4 bg-sky-500 rounded-md"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default CustomTheme;
