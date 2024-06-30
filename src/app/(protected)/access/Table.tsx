import CircularProgress from "@/components/ui/loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllAdmins } from "@/mutations/access";
import { Access } from "@/types/access";
import { useQuery } from "react-query";

const AccessManagementTable = () => {
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

    const { data, isLoading } = useQuery({
        queryKey: ["access", "table", "all"],
        queryFn: async() => {
            const res = await getAllAdmins()
            const data =  res.docs.map((doc) => doc.data() as Access)
            return data
        }
    })

    if (isLoading) return (
        <CircularProgress />
    )

    return ( 
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
                {data?.sort((a, b) => b.role.localeCompare(a.role)).map((data) => 
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
    );
}
 
export default AccessManagementTable;