import { useState } from "react";
import CustomTheme from ".";
import { objectKeys } from "../../../src/utils/objectKeys";
import { HexColorPicker } from "react-colorful";
import { CircularProgress, ClickAwayListener, Switch } from "@material-ui/core";
import { Animation } from "../../../src/components/animations";
import { uploadThemeDetails } from "../../../src/utils/admin/custom-themes";
import { getUuid } from "../../../src/utils/getUuid";
import useToast from "../../../src/hook/useToast";
import Link from "next/link";
import AdminLayout from "@components/layout/adminLayout";

export interface CustomTheme {
    background: string;
    color: string;

    primary: string;
    header: string;
    subHeader: string;
    inputField: string;

    attractionBody: string;
    attractionShadow: string;

    businessInput: string;
    adminSidebar: string;
}

export interface ThemeDetails {
    themeId: string;
    name: string;
    theme: CustomTheme;
    animations: Animation[];
    listed: boolean;
}

type ThemeKeys = keyof CustomTheme;

const CreateCustomThemes = () => {
    const notify = useToast();
    const [openProperty, setOpenProperty] = useState<ThemeKeys>();
    const [uploading, setUploading] = useState(false);
    const [theme, setTheme] = useState<ThemeDetails>({
        themeId: getUuid(10),
        name: "",
        theme: {
            background: "#fff",
            color: "#000",

            primary: "#29aae1",
            header: "#000",
            subHeader: "#333",
            inputField: "#e4e9ec",

            attractionBody: "#fff",
            attractionShadow: "#e4e9ec",

            businessInput: "#fff",
            adminSidebar: "#f1f5f9",
        },

        animations: [],
        listed: true,
    });

    const allAnimations: Animation[] = ["snowfall", "lights"];

    const updateDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        await uploadThemeDetails(theme);
        notify("success", "Theme uploaded successfully!");
        setUploading(false);
    };

    const capitalize = (val: string) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
    };

    const triggerOpen = (property: ThemeKeys) => {
        if (openProperty == property) {
            setOpenProperty(null);
        } else {
            setOpenProperty(property);
        }
    };

    const addAnimation = (animation: Animation) => {
        if (theme.animations.includes(animation)) {
            const newAnimations = theme.animations.filter(
                (ani) => ani != animation
            );
            setTheme({ ...theme, animations: newAnimations });
        } else {
            setTheme({
                ...theme,
                animations: [...theme.animations, animation],
            });
        }
    };

    if (uploading)
        return (
            <div className="w-full h-[95vh] flex items-center justify-center">
                <CircularProgress />
            </div>
        );

    return (
        <AdminLayout>
            <form onSubmit={updateDetails}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 mt-8 mb-6">
                    <p className="text-xl font-[500]">Create Themes</p>
                    <div className="w-[95%] bg-[var(--inputField)] items-center justify-center p-6 rounded-md">
                        <div className="flex items-center gap-4 mb-4">
                            <p className="font-[500] text-lg">Theme Name: </p>
                            <input
                                required
                                className="w-4/5 p-2 px-2 rounded-md outline-none bg-[var(--businessInput)]"
                                placeholder="Theme Name"
                                value={theme.name}
                                onChange={(e) =>
                                    setTheme({ ...theme, name: e.target.value })
                                }
                            />
                        </div>
                        <div className=" grid grid-cols-2">
                            {objectKeys(theme.theme).map(
                                (key, index) => (
                                    <div
                                        key={key}
                                        className="relative flex items-center gap-4 my-4"
                                    >
                                        <p className="font-[500]">
                                            {capitalize(key)}:{" "}
                                        </p>
                                        <div
                                            style={{
                                                backgroundColor:
                                                    theme.theme[key],
                                            }}
                                            className={`relative w-28 h-8 rounded-md border-2 border-[var(--subHeader)] cursor-pointer`}
                                            onClick={() => triggerOpen(key)}
                                        ></div>
                                        <p className="font-[500]">
                                            {theme.theme[key]}{" "}
                                        </p>
                                        {openProperty == key && (
                                            <ClickAwayListener
                                                onClickAway={() =>
                                                    triggerOpen(key)
                                                }
                                            >
                                                <div className="absolute z-10 top-10">
                                                    <HexColorPicker
                                                        color={theme.theme[key]}
                                                        onChange={(color) =>
                                                            setTheme({
                                                                ...theme,
                                                                theme: {
                                                                    ...theme.theme,
                                                                    [key]: color,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </ClickAwayListener>
                                        )}
                                    </div>
                                )
                                // <PropertyTile key={key} property={key} value={theme[key]} />
                            )}
                        </div>
                    </div>

                    <div className="w-[95%] bg-[var(--inputField)] items-center justify-center p-6 rounded-md">
                        <p className="font-[500] text-lg">Add Animations: </p>
                        <div className="flex justify-start gap-10">
                            {allAnimations.map((animation) => (
                                <div
                                    key={`anim-${animation}`}
                                    className="flex items-center gap-2 my-2"
                                >
                                    <input
                                        className="w-4 h-4"
                                        type="checkbox"
                                        checked={theme.animations.includes(
                                            animation
                                        )}
                                        onChange={() => addAnimation(animation)}
                                    />
                                    <p>{capitalize(animation)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-start items-center gap-3 mt-4">
                            <p className="font-[500] text-lg">
                                List this theme:{" "}
                            </p>
                            <Switch
                                checked={theme.listed}
                                id="testEvent"
                                onChange={(e, checked) =>
                                    setTheme({ ...theme, listed: checked })
                                }
                                color="primary"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link
                                as="/admin/custom-themes/preview"
                                href={{
                                    pathname: "/admin/custom-themes/preview",
                                    query: {
                                        previewTheme: JSON.stringify(theme),
                                    },
                                }}
                                // state={{ previewTheme: theme }}
                            >
                                <button
                                    type="button"
                                    className=" bg-sky-500 text-white px-6 p-2 rounded-md font-[500]"
                                >
                                    Preview
                                </button>
                            </Link>
                            <button
                                type="submit"
                                // onClick={updateDetails}
                                className=" bg-sky-500 text-white px-6 p-2 rounded-md font-[500]"
                            >
                                Publish
                            </button>
                        </div>
                    </div>

                    {/* <div className="relative w-[95%] bg-[var(--inputField)] h-screen overflow-y-scroll border-2 p-4 rounded-md">
                            <CustomThemeProvider theme={theme}>
                                <Navigation />
                                <AustralasiaRoutes />
                            </CustomThemeProvider>
                        </div> */}
                </div>
            </form>
        </AdminLayout>
    );
};

export default CreateCustomThemes;
