import { Montserrat } from "next/font/google";
import "./globals.css";
import AdminSidebar from "@/components/sidebar";
import { Toaster } from "react-hot-toast";
import AllProviders from "@/context/Providers";
import { Metadata } from "next";
import NavBar from "@/components/navbar";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pasifikan - Admin",
  description: "Admin dashboard for Pasifikan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(montserrat.className, "theme")}>
        <AllProviders>
          <NavBar />
          <div className="relative w-full min-h-screen flex items-start justify-center">
            <AdminSidebar />
            <div className="w-4/5 ">{children}</div>
          </div>
          <Toaster />
        </AllProviders>
      </body>
    </html>
  );
}
