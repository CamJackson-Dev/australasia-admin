import Link from "next/link";
import { usePathname } from "next/navigation";

interface INavLink {
    href: string;
    exact: boolean;
    children: React.ReactNode;
    className: string;
    activeClassName: string;
}

export const NavLink = ({
    href,
    exact,
    children,
    className,
    activeClassName,
}: INavLink) => {
    const pathname = usePathname();
    const isActive = exact
        ? pathname === href
        : typeof window !== "undefined" && pathname.startsWith(href);

    if (isActive) {
        className = activeClassName;
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
};
