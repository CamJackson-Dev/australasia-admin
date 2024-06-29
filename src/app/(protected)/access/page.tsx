'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CircularProgress from "@/components/ui/loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useToast from "@/hooks/useToast";
import { sendAdminInvitation } from "@/mutations/access";
import { Access } from "@/types/access";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";

const AccessManagement = () => {
    const notify = useToast()
    const [inviteEmail, setInviteEmail] = useState("")
    const [openDialog, setOpenDialog] = useState(false)

    const mockAccessData: Access[] = [
        {
            uid: "1",
            email: "john.doe@example.com",
            name: "John Doe",
            status: "accepted",
            role: "admin",
            access: ["blogs", "events"]
        },
        {
            uid: "2",
            email: "jane.smith@example.com",
            name: "Jane Smith",
            status: "invited",
            role: "owner",
            access: ["events"]
        },
        {
            uid: "3",
            email: "sam.wilson@example.com",
            name: "Sam Wilson",
            status: "rejected",
            role: "admin",
            access: ["blogs"]
        },
        {
            uid: "4",
            email: "emily.jones@example.com",
            name: "Emily Jones",
            status: "accepted",
            role: "admin",
            access: ["all"]
        },
        {
            uid: "5",
            email: "alex.brown@example.com",
            name: "Alex Brown",
            status: "invited",
            role: "admin",
            access: ["blogs", "events", "all"]
        }
    ];


    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async () => {
            return await sendAdminInvitation(inviteEmail);
        },
        onSuccess: (data) => {
            if (data){
                notify("success", "Admin invitation sent!");
                setOpenDialog(false)
                setInviteEmail("")
            }else{
                notify("error", "User already exists!");

            }
        },
        onError: (res: any) => {
            notify("error", res.message)
        }
    });

    const sendInvitation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isLoading) return
        await mutateAsync()
    }

    
    return ( 
        <div className="p-8">
            <div className="relative flex items-center justify-between mb-4">
                <h1 className="text-center mb-4 text-xl">Access Management</h1>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger>
                        <div className="bg-primary py-2 px-4 rounded-md font-semibold">+ Invite</div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white text-black">
                        <form className="flex flex-col gap-4" onSubmit={sendInvitation}>
                            <DialogHeader>
                                <DialogTitle>Send Invitation</DialogTitle>
                                <DialogDescription>
                                    Invite people to become admin for Australasia.com
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                id="name"
                                className="w-full mb-2 mt-0"
                                type="email"
                                placeholder="Email Address"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                            
                            <DialogFooter>
                                <DialogClose>
                                    <Button className="border-2" variant="secondary" type="button">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">
                                    {isLoading? <CircularProgress width={24} /> : "+ Invite"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead className="">Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Access</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockAccessData.sort((a, b) => b.role.localeCompare(a.role)).map((data) => 
                        <TableRow key={data.uid}>
                            <TableCell className="font-medium">
                                <div className="w-9 h-9 text-sm font-bold flex items-center justify-center rounded-full bg-[var(--adminSidebar)]">{data.name[0]}</div>
                            </TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.email}</TableCell>
                            <TableCell>{data.role}</TableCell>
                            <TableCell>{data.status}</TableCell>
                            <TableCell className="text-right">{data.access.toString()}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
 
export default AccessManagement;