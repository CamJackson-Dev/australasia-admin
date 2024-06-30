"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CircularProgress from "@/components/ui/loading";
import useToast from "@/hooks/useToast";
import { sendAdminInvitation } from "@/mutations/access";
import { Access, Role } from "@/types/access";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useMutation } from "react-query";
import AccessManagementTable from "./Table";
import { AdminContext } from "@/context/AdminContext";

interface Invitation {
    email: string;
    role: Role;
}

const AccessManagement = () => {
    const notify = useToast();
    const { isOwner } = useContext(AdminContext);

    const [invitation, setInvitation] = useState<Invitation>({
        email: "",
        role: "admin",
    });
    const [openDialog, setOpenDialog] = useState(false);

    const handleDataChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setInvitation((data) => ({
            ...data,
            [id]: value,
        }));
    };

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async () => {
            return await sendAdminInvitation(invitation.role, invitation.email);
        },
        onSuccess: (data) => {
            if (data) {
                notify("success", "Admin invitation sent!");
                setOpenDialog(false);
                setInvitation({
                    email: "",
                    role: "owner",
                });
            } else {
                notify("error", "User already exists!");
            }
        },
        onError: (res: any) => {
            notify("error", res.message);
        },
    });

    const sendInvitation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;
        await mutateAsync();
    };

    return (
        <div className="p-8">
            <div className="relative flex items-center justify-between mb-4">
                <h1 className="text-center mb-4 text-xl">Access Management</h1>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    {isOwner && (
                        <DialogTrigger>
                            <div className="bg-primary py-2 px-4 rounded-md font-semibold">
                                + Invite
                            </div>
                        </DialogTrigger>
                    )}
                    <DialogContent className="sm:max-w-[425px] bg-white text-black">
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={sendInvitation}
                        >
                            <DialogHeader>
                                <DialogTitle>Send Invitation</DialogTitle>
                                <DialogDescription>
                                    Invite people to become admin for
                                    Australasia.com
                                </DialogDescription>
                            </DialogHeader>
                            <div className="w-full flex justify-center items-center gap-1">
                                <Input
                                    required
                                    id="email"
                                    className="w-3/4"
                                    type="email"
                                    placeholder="Email Address"
                                    value={invitation.email}
                                    onChange={handleDataChange}
                                />
                                <Select
                                    value={invitation.role}
                                    onValueChange={(value: Role) =>
                                        setInvitation((data) => ({
                                            ...data,
                                            role: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-1/4">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Roles</SelectLabel>
                                            <SelectItem value="owner">
                                                Owner
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <DialogClose>
                                    <Button
                                        className="border-2"
                                        variant="secondary"
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit">
                                    {isLoading ? (
                                        <CircularProgress width={24} />
                                    ) : (
                                        "+ Invite"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <AccessManagementTable />
        </div>
    );
};

export default AccessManagement;
