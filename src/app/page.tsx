import { AdminProvider } from "@/context/AdminContext";
import AdminRoutes from "./routes";

export default function Home() {
    return (
        <main className="">
            <AdminRoutes />
        </main>
    );
}
