import React from "react";
import Link from "next/link";

interface TopLink {
    to: string;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    reload?: boolean;
}

const TopLink = (props: TopLink) => {
    const { to, className, style, children, reload } = props;
    const goToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <Link
            onClick={goToTop}
            href={to ?? ""}
            replace={reload}
            style={style}
            className={className}
        >
            {children}
        </Link>
    );
};

export default TopLink;
