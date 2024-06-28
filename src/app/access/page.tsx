import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Access } from "@/types/access";

const AccessManagement = () => {
    const mockAccessData: Access[] = [
        {
            uid: "1",
            email: "john.doe@example.com",
            name: "John Doe",
            status: "accepted",
            roles: ["blogs", "events"]
        },
        {
            uid: "2",
            email: "jane.smith@example.com",
            name: "Jane Smith",
            status: "invited",
            roles: ["events"]
        },
        {
            uid: "3",
            email: "sam.wilson@example.com",
            name: "Sam Wilson",
            status: "rejected",
            roles: ["blogs"]
        },
        {
            uid: "4",
            email: "emily.jones@example.com",
            name: "Emily Jones",
            status: "accepted",
            roles: ["all"]
        },
        {
            uid: "5",
            email: "alex.brown@example.com",
            name: "Alex Brown",
            status: "invited",
            roles: ["blogs", "events", "all"]
        }
    ];
    
    return ( 
        <div className="p-8">
            <h1 className="text-center mb-4 text-xl">Access Management</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead className="">Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Roles</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockAccessData.map((data) => 
                        <TableRow key={data.uid}>
                            <TableCell className="font-medium">
                                <div className="w-9 h-9 text-sm font-bold flex items-center justify-center rounded-full bg-[var(--adminSidebar)]">{data.name[0]}</div>
                            </TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.email}</TableCell>
                            <TableCell>{data.status}</TableCell>
                            <TableCell className="text-right">{data.roles.toString()}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
 
export default AccessManagement;