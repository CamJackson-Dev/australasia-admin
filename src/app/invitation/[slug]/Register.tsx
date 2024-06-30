"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CircularProgress from "@/components/ui/loading";
import { SessionContext } from "@/context/SessionContext";
import useToast from "@/hooks/useToast";
import { Role } from "@/types/access";
import { adminSignUp, logout } from "@/utils/firebase/auth";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useMutation } from "react-query";

interface IRegister {
    email: string;
    role: Role;
}

const Register = ({ email, role }: IRegister) => {
    const notify = useToast();

    const router = useRouter();
    const { logoutSession } = useContext(SessionContext);
    const [details, setDetails] = useState({
        email: email,
        name: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setDetails((val) => ({
            ...val,
            [id]: value,
        }));
    };

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async () => {
            return await adminSignUp({
                email: details.email,
                name: details.name,
                password: details.password,
                role: role,
            });
        },
        onSuccess: (data) => {
            if (data) {
                notify("success", "Admin registration successful");
                notify("success", "Login to continue");
                logoutSession();
                router.push("/");
            } else {
                notify("error", "Something went wrong!");
            }
        },
        onError: (res: any) => {
            notify("error", res.message);
        },
    });

    const handleRegistration = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;
        await mutateAsync();
    };

    return (
        <div className="w-hull h-full flex items-center justify-center">
            <form onSubmit={handleRegistration}>
                <div className="flex flex-col justify-center w-4/5 md:w-[400px] border-2 border-neutral-400 p-4 rounded-md">
                    <h1 className="text-center font-semibold text-lg ">
                        Register
                    </h1>

                    <Label className="font-semibold mt-6 mb-2">Email:</Label>
                    <Input
                        className=" cursor-not-allowed bg-neutral-600"
                        value={details.email}
                        readOnly
                    />

                    <Label className="font-semibold mt-6 mb-2">
                        Full Name:
                    </Label>
                    <Input
                        required
                        id="name"
                        value={details.name}
                        onChange={handleChange}
                        className=" border-2 border-[var(--businessInput)]"
                        placeholder="Full Name"
                    />

                    <Label className="font-semibold mt-6 mb-2">Password:</Label>
                    <Input
                        required
                        id="password"
                        value={details.password}
                        onChange={handleChange}
                        type="password"
                        className="border-2 border-[var(--businessInput)]"
                        placeholder="Password"
                    />
                    <Button
                        type="submit"
                        className="mt-4 flex items-center gap-2"
                        variant="default"
                    >
                        {!isLoading ? (
                            "Register"
                        ) : (
                            <CircularProgress width={24} />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Register;
