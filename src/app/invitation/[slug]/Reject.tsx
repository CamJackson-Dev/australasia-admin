"use client";

import { Button } from "@/components/ui/button";
import CircularProgress from "@/components/ui/loading";
import useToast from "@/hooks/useToast";
import { rejectAdminInvitation } from "@/mutations/access";
import { useState } from "react";
import { useMutation } from "react-query";

const RejectInvitation = ({ email }: { email: string }) => {
    const notify = useToast();
    const [body, setBody] = useState(
        "Are your sure you want to reject the invitation?"
    );

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async () => {
            return await rejectAdminInvitation(email);
        },
        onSuccess: (data) => {
            if (data) {
                notify("success", "Admin invitation rejected");
                setBody("Thank you responding to the invitation!");
            }
        },
        onError: (e: any) => {
            notify("error", e.message);
        },
    });

    const handleRejection = async () => {
        await mutateAsync();
        handleClose();
    };

    const handleClose = () => {
        typeof window !== "undefined" &&
            window.location.assign("https://australasia.com/");
        // router.push("/");
    };

    return (
        <div className="w-hull h-full flex items-center justify-center">
            <div className="w-[360px] h-[360px] border p-8 pb-0 rounded-md shadow-lg flex flex-col items-center justify-center">
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <img src="/logo_aus.png" className="w-48" />
                        <h1 className="text-base font-medium text-center my-6">
                            {body}
                        </h1>
                        <Button
                            onClick={handleClose}
                            className="w-full mb-2"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejection}
                            className="w-full"
                            variant="destructive"
                        >
                            Yes
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RejectInvitation;
