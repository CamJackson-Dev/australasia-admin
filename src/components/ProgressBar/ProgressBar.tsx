import React, { Fragment, useEffect } from "react";
import logo from "@/app/favicon.ico";
// import style from "./style.module.css";
import Image from "next/image";
import CircularProgress from "../ui/loading";

export const FullPageProgressBar = (props: { backgroundColor?: string }) => {
    return (
        <div className="h-[90vh] w-full flex items-center justify-center">
            <CircularProgress />
        </div>
    );
};
