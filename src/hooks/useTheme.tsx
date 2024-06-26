import { useEffect, useState } from "react";
import { create } from "zustand";
import { useQuery } from "react-query";
import { getAllThemes } from "@/mutations/themes";
import { ThemeDetails } from "@/types/theme";

export type Theme = "light" | "dark" | string;

interface IThemeSettings {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    allThemes: ThemeDetails[];
    setAllThemes: (themes: ThemeDetails[]) => void;
}

const useSettingStore = create<IThemeSettings>((set) => ({
    theme: "light",
    setTheme: (theme) => set({ theme }),
    allThemes: [],
    setAllThemes: (themes) => set({ allThemes: themes }),
}));

const useTheme = () => {
    const { theme, setTheme, allThemes, setAllThemes } = useSettingStore();
    const [isLoading, setIsLoading] = useState(true);

    const { data, refetch: refetchAllThemes } = useQuery(
        ["allThemes"],
        async () => {
            const res = await getAllThemes();

            const allThemes = res.docs
                .filter((doc) => doc.id != "default")
                .map((theme) => theme.data() as ThemeDetails);
            setAllThemes(allThemes);

            return allThemes;
        }
    );

    const muiFetch = async () => {
        setIsLoading(true);
        await Promise.resolve(() => setTimeout(() => {}, 100)).then(() =>
            setIsLoading(false)
        );
    };

    useEffect(() => {
        const localTheme = localStorage.getItem("theme");
        if (localTheme) {
            setTheme(localTheme as Theme);
        }

        muiFetch();
    }, []);

    const changeTheme = (theme: Theme) => {
        setTheme(theme);
        localStorage.setItem("theme", theme);
    };

    const toggleTheme = () => {
        if (theme == "dark") {
            changeTheme("light");
        } else {
            changeTheme("dark");
        }
    };

    return {
        isLoading,
        theme,
        changeTheme,
        toggleTheme,
        allThemes,
        refetchAllThemes,
    };
};

export default useTheme;
