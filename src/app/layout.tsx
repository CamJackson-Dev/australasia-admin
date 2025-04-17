// app/layout.tsx
import { Montserrat } from "next/font/google";
import "./globals.css";
import AllProviders from "@/context/Providers";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Pasifikan - Admin",
    description: "Admin dashboard for Pasifikan",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={cn(montserrat.className, "theme")}>
                <AllProviders>
                    {children}
                    <Toaster />
                </AllProviders>
            </body>
        </html>
    );
}
