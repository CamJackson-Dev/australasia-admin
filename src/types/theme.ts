export interface DefaultTheme {
    name: string;
    themeId: string;
}

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

export type Animation = "snowfall" | "firework" | "lights";
