"use client";

import { Role } from "@/types/access";
import Register from "./Register";
import RejectInvitation from "./Reject";
import { useEffect, useState } from "react";
import CircularProgress from "@/components/ui/loading";
import { checkInvitationExist } from "@/mutations/access";

export default function Page({ params }: { params: { slug: string } }) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [[status, role, email], setSlugData] = useState<string[]>([
        "",
        "",
        "",
    ]);

    const parseSlug = async () => {
        try {
            const parsed_slug = atob(params.slug);
            const terms = parsed_slug.split("#");

            if (terms.length != 3) {
                setError(true);
                return;
            }

            const res = await checkInvitationExist(terms[2]);
            if (!res.exists || res.status == "accepted") {
                setIsLoading(false);
                setError(true);
                return;
            }

            setSlugData(terms);
            setIsLoading(false);
        } catch (e) {
            setError(true);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        parseSlug();
    }, [status, role, email]);

    if (isLoading)
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <CircularProgress />
            </div>
        );
    if (error)
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <h2 className="text-4xl font-semibold">400</h2>
                <p className="text-lg">Bad Request</p>
            </div>
        );

    return (
        <div className="w-full h-screen">
            {status == "accept" ? (
                <Register email={email} role={role as Role} />
            ) : (
                <RejectInvitation email={email} />
            )}
        </div>
    );
}
