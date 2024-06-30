import { Role } from "@/types/access"
import Register from "./Register"

export default function Page({ params }: { params: { slug: string } }) {
    const parsed_slug = atob(params.slug)
    const terms = parsed_slug.split("#")

    const [status, role, email] = terms
    return (
        <div className="w-full h-screen">
            {/* <p>{status}</p>
            <p>{role}</p>
            <p>{email}</p> */}
            <Register email={email} role={role as Role} />
        </div>
    )
}