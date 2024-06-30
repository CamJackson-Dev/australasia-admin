import CircularProgress from "@/components/ui/loading";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AdminContext } from "@/context/AdminContext";
import useToast from "@/hooks/useToast";
import { deleteAdmin, getAllAdmins } from "@/mutations/access";
import { Access } from "@/types/access";
import { auth } from "@/utils/firebase/firebase";
import { Trash2 } from "lucide-react";
import { useContext, useEffect } from "react";
import { useMutation, useQuery } from "react-query";

const AccessManagementTable = () => {
    const { isOwner, user } = useContext(AdminContext);
    const notify = useToast();

    const { data, isLoading, refetch } = useQuery({
        queryKey: [`access-${user?.uid ?? ""}`, "table"],
        queryFn: async () => {
            const res = await getAllAdmins();
            const data = res.docs.map((doc) => doc.data() as Access);
            return data;
        },
    });

    if (isLoading)
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <CircularProgress />
            </div>
        );

    const CustomTableRow = (props: { data: Access }) => {
        const { data: rowData } = props;
        const isSelf = rowData.uid == user?.uid || rowData.email == user?.email;

        const { mutateAsync, isLoading: isDeleting } = useMutation({
            mutationFn: async () => {
                await deleteAdmin(rowData.email);
            },
            onSuccess: () => {
                notify("success", `${rowData.email} removed as admin`);
                refetch();
            },
            onError: (e: any) => {
                notify(
                    "error",
                    e.message ?? `Something went wrong. Try again.`
                );
            },
        });

        const handleDelete = async () => {
            if (isDeleting) return;
            await mutateAsync();
        };

        return (
            <TableRow key={rowData.uid}>
                <TableCell className="font-medium">
                    <div
                        onClick={() => refetch()}
                        className="w-9 h-9 text-sm font-bold flex items-center justify-center rounded-full bg-[var(--adminSidebar)]"
                    >
                        {rowData.name[0]}
                    </div>
                </TableCell>
                <TableCell>
                    {rowData.name} {isSelf ? "(you)" : ""}
                </TableCell>
                <TableCell>{rowData.email}</TableCell>
                <TableCell>{rowData.role}</TableCell>
                <TableCell>{rowData.status}</TableCell>
                <TableCell className="text-center">
                    {rowData.access.toString()}
                </TableCell>
                {isOwner && (
                    <TableCell className="flex justify-end items-center">
                        {isSelf ? (
                            "_"
                        ) : (
                            <button
                                onClick={handleDelete}
                                className="bg-[var(--adminSidebar)] w-9 h-9 rounded-full flex justify-center items-center"
                            >
                                {!isDeleting ? (
                                    <Trash2 className="w-5  hover:text-red-400" />
                                ) : (
                                    <CircularProgress width={24} />
                                )}
                            </button>
                        )}
                    </TableCell>
                )}
            </TableRow>
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-primary">
                        Image
                    </TableHead>
                    <TableHead className="text-primary">Name</TableHead>
                    <TableHead className="text-primary">Email</TableHead>
                    <TableHead className="text-primary">Role</TableHead>
                    <TableHead className="text-primary">Status</TableHead>
                    <TableHead className="text-center text-primary">
                        Access
                    </TableHead>
                    {isOwner && (
                        <TableHead className="text-primary text-right">
                            Actions
                        </TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data
                    ?.filter((val) => val.status == "accepted")
                    .sort((a, b) => b.role.localeCompare(a.role))
                    .map((data) => (
                        <CustomTableRow key={data.uid} data={data} />
                    ))}
            </TableBody>
        </Table>
    );
};

export default AccessManagementTable;
