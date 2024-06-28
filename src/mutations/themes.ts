import { DefaultTheme, ThemeDetails } from "@/types/theme";
import { firestore, storage } from "@/utils/firebase/firebase";

export const getDefaultTheme = async () => {
    return firestore
        .collection(`custom_themes`)
        .doc("default")
        .get()
        .then((snapshot) => snapshot);
};

export const uploadDefaultTheme = async (defaultTheme: DefaultTheme) => {
    return firestore
        .collection("custom_themes")
        .doc("default")
        .set(defaultTheme)
        .then((res) => {
            console.log("Completed");
        });
};

export const getAllThemes = async () => {
    return firestore
        .collection(`custom_themes`)
        .get()
        .then((snapshot) => snapshot);
};

export const uploadThemeDetails = async (themeDetails: ThemeDetails) => {
    const { themeId, name } = themeDetails;
    // const eventHandle = getHandleFromName(title);

    return firestore
        .collection("custom_themes")
        .doc(name)
        .set(themeDetails)
        .then((res) => {
            console.log("Completed");
        });
};

export const updateThemeListing = async (
    themeDetails: ThemeDetails,
    listing: boolean
) => {
    const { name } = themeDetails;

    return firestore
        .collection(`custom_themes`)
        .doc(name)
        .update({ listed: listing });
};
