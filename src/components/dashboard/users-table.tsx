import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";
import { Input } from "../ui/input";
import { useState } from "react";
import {
    BadgeCheck,
    BadgeX,
    Loader2,
    Trash2,
    MoreVertical,
    Eye,
    Download,
    Crown,
} from "lucide-react";
import {
    TooltipTrigger,
    TooltipProvider,
    Tooltip,
    TooltipContent,
} from "../ui/tooltip";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "../ui/dialog";
import { httpsCallable, getFunctions } from "firebase/functions";
import useToast from "@/hooks/useToast";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { firestore } from "@/utils/firebase/firebase";

interface UsersTableProps {
    userData?: User[];
    isLoading: boolean;
    onUserUpdate?: () => Promise<void>;
}

export function UsersTable({
    userData,
    isLoading,
    onUserUpdate,
}: UsersTableProps) {
    const notify = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        vip: null as boolean | null,
        emailVerified: null as boolean | null,
        country: null as string | null,
        type: null as string | null,
        recentlyJoined: null as boolean | null,
    });
    const [updatingVIP, setUpdatingVIP] = useState(false);
    const rowsPerPage = 10;

    const filteredUsers = userData?.filter((user) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            user.fullName?.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.id.toLowerCase().includes(searchLower) ||
            user.type?.toLowerCase().includes(searchLower) ||
            user.status?.toLowerCase().includes(searchLower);

        const matchesFilters =
            (activeFilters.vip === null || user.vip === activeFilters.vip) &&
            (activeFilters.emailVerified === null ||
                user.emailVerified === activeFilters.emailVerified) &&
            (activeFilters.country === null ||
                user.country === activeFilters.country) &&
            (activeFilters.type === null || user.type === activeFilters.type) &&
            (activeFilters.recentlyJoined === null ||
                (activeFilters.recentlyJoined === true &&
                    user.joinDate &&
                    Date.now() - user.joinDate <= 30 * 24 * 60 * 60 * 1000));

        return matchesSearch && matchesFilters;
    });

    // Pagination
    const totalPages = Math.ceil((filteredUsers?.length || 0) / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentUsers = filteredUsers?.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (
        filterType: keyof typeof activeFilters,
        value: any
    ) => {
        setActiveFilters((prev) => ({
            ...prev,
            [filterType]: prev[filterType] === value ? null : value,
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const deleteProfile = async (user: User) => {
        try {
            setDeleting(true);
            setSelectedUser(user);

            const deleteUserFn = httpsCallable(
                getFunctions(),
                "deleteUserAccount"
            );
            await deleteUserFn({ userId: user.id });

            setDeleting(false);
            notify("success", "Account deleted successfully");
        } catch (error) {
            console.error(error);
            notify("error", "Error deleting user account");
            setDeleting(false);
        }
    };

    const toggleVIPStatus = async (user: User) => {
        try {
            setUpdatingVIP(true);
            await firestore.collection("users").doc(user.id).update({
                vip: !user.vip,
            });

            const updatedUser = { ...user, vip: !user.vip };
            if (userData) {
                if (onUserUpdate) {
                    await onUserUpdate();
                }
            }

            notify(
                "success",
                `User ${user.vip ? "removed from" : "added to"} VIP status`
            );
        } catch (error) {
            console.error(error);
            notify("error", "Failed to update VIP status");
        } finally {
            setUpdatingVIP(false);
        }
    };

    const exportToCSV = () => {
        if (!filteredUsers || filteredUsers.length === 0) {
            notify("error", "No data to export");
            return;
        }

        // Define CSV headers
        const headers = [
            "ID",
            "Full Name",
            "Email",
            "Email Verified",
            "Role",
            "VIP Status",
            "Country",
            "Join Date",
        ];

        // Convert user data to CSV rows
        const rows = filteredUsers.map((user) => [
            user.id,
            user.fullName || "Unknown User",
            user.email,
            user.emailVerified ? "Yes" : "No",
            user.type || "user",
            user.vip ? "VIP" : "Not VIP",
            user.country || "Not provided",
            user.joinDate
                ? new Date(user.joinDate).toLocaleDateString()
                : "Not provided",
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        // Create and trigger download
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `users_export_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        // ... loading skeleton ...
        return (
            <Card className="bg-[var(--adminSidebar)] border-[var(--inputField)] text-white border-2 rounded-2xl">
                <CardHeader>
                    <Skeleton className="h-8 w-32 bg-[var(--inputField)]" />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-10 w-10 rounded-full bg-[var(--inputField)]" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32 bg-[var(--inputField)]" />
                                                <Skeleton className="h-3 w-24 bg-[var(--inputField)]" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-48 bg-[var(--inputField)]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-20 bg-[var(--inputField)]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-20 bg-[var(--inputField)]" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="h-8 w-16 bg-[var(--inputField)]" />
                                            <Skeleton className="h-8 w-16 bg-[var(--inputField)]" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-[var(--adminSidebar)] border-[var(--inputField)] text-white border-2 rounded-2xl">
            <CardHeader>
                <CardTitle className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span>Users</span>
                            <span className="text-sm text-muted-foreground">
                                ({filteredUsers?.length || 0} results)
                            </span>
                        </div>
                        <div className="w-4/5 flex justify-end items-center gap-2">
                            <Input
                                className="w-1/3 bg-[var(--inputField)] border-none"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportToCSV}
                                className="border-[var(--inputField)] !text-white hover:bg-[var(--inputField)]"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center mt-4">
                        <p className="text-base mr-4">Filters: </p>

                        {/* VIP Filters */}
                        <Button
                            variant={
                                activeFilters.vip === true
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => handleFilterChange("vip", true)}
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            VIP Users
                        </Button>

                        {/* Email Verified Filter */}
                        <Button
                            variant={
                                activeFilters.emailVerified === true
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                handleFilterChange("emailVerified", true)
                            }
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            Email Verified
                        </Button>

                        {/* Recently Joined Filter */}
                        <Button
                            variant={
                                activeFilters.recentlyJoined === true
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                handleFilterChange("recentlyJoined", true)
                            }
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            Recently Joined
                        </Button>

                        {/* Vertical Divider */}
                        <div className="h-6 w-px bg-[var(--inputField)] mx-2" />

                        {/* User Type Filters */}
                        <Button
                            variant={
                                activeFilters.type === "user"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => handleFilterChange("type", "user")}
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            Users
                        </Button>
                        <Button
                            variant={
                                activeFilters.type === "photographer"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                handleFilterChange("type", "photographer")
                            }
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            Photographers
                        </Button>
                        <Button
                            variant={
                                activeFilters.type === "artist"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => handleFilterChange("type", "artist")}
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            Artists
                        </Button>
                        <Button
                            variant={
                                activeFilters.type === "merchant"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                handleFilterChange("type", "merchant")
                            }
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            Merchants
                        </Button>
                        <Button
                            variant={
                                activeFilters.type === "writer"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => handleFilterChange("type", "writer")}
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            Writers
                        </Button>

                        {/* Vertical Divider */}
                        <div className="h-6 w-px bg-[var(--inputField)] mx-2" />

                        {/* Country Filters */}
                        <Button
                            variant={
                                activeFilters.country === "Australia"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                handleFilterChange("country", "Australia")
                            }
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            Australia
                        </Button>
                        <Button
                            variant={
                                activeFilters.country === "New Zealand"
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                handleFilterChange("country", "New Zealand")
                            }
                            className="border-[var(--inputField)] rounded-full text-xs px-5"
                        >
                            New Zealand
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>VIP</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>
                                                <div className="bg-[var(--inputField)] w-full h-full flex items-center justify-center">
                                                    {user?.fullName
                                                        ?.split(" ")
                                                        .map((name) => name[0])
                                                        .join("")}
                                                </div>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-base">
                                                {user.fullName ||
                                                    "Unknown User"}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {user.id}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="flex items-center gap-2">
                                    {user.email}
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                {user.emailVerified ? (
                                                    <BadgeCheck className="text-green-500 w-5 h-5" />
                                                ) : (
                                                    <BadgeX className="text-red-500 w-5 h-5" />
                                                )}
                                            </TooltipTrigger>
                                            <TooltipContent className="text-sm">
                                                {user.emailVerified
                                                    ? "Email verified"
                                                    : "Email not verified"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className="text-white"
                                        variant="outline"
                                    >
                                        {user.type || "user"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.vip ? "default" : "secondary"
                                        }
                                    >
                                        {user.vip ? "VIP" : "Not VIP"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* Use a vertical ellipsis icon as the trigger */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="border-[var(--inputField)] px-2"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        {/* Show dropdown to the left side */}
                                        <DropdownMenuContent
                                            side="left"
                                            sideOffset={0}
                                            className="absolute -top-2.5 right-0 bg-[var(--inputField)] border-none text-white"
                                        >
                                            {/* VIEW action */}
                                            <DropdownMenuItem asChild>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full text-left px-3 justify-start"
                                                            onClick={() =>
                                                                setSelectedUser(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[500px] bg-[var(--adminSidebar)] border-[var(--inputField)] text-white rounded-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                User Details
                                                            </DialogTitle>
                                                            <DialogDescription />
                                                        </DialogHeader>
                                                        {selectedUser && (
                                                            <div className="grid gap-4 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <Avatar className="h-20 w-20">
                                                                        <AvatarImage
                                                                            src={
                                                                                selectedUser.avatar
                                                                            }
                                                                        />
                                                                        <AvatarFallback className="bg-[var(--inputField)] font-bold text-xl">
                                                                            {selectedUser.fullName
                                                                                ?.split(
                                                                                    " "
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        name
                                                                                    ) =>
                                                                                        name[0]
                                                                                )
                                                                                .join(
                                                                                    ""
                                                                                )}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <Link
                                                                            href={`https://pasifikan.com/user/${selectedUser.id}`}
                                                                            target="_blank"
                                                                        >
                                                                            <h3 className="text-lg font-semibold hover:underline text-primary">
                                                                                {selectedUser.fullName ||
                                                                                    "Unknown User"}
                                                                            </h3>
                                                                        </Link>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            ID:{" "}
                                                                            {
                                                                                selectedUser.id
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="grid gap-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Email
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm">
                                                                                {
                                                                                    selectedUser.email
                                                                                }
                                                                            </span>
                                                                            {selectedUser.emailVerified ? (
                                                                                <BadgeCheck className="text-green-500 w-4 h-4" />
                                                                            ) : (
                                                                                <BadgeX className="text-red-500 w-4 h-4" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Phone
                                                                        </span>
                                                                        <span className="text-sm text-muted-foreground italic">
                                                                            {selectedUser.phone ||
                                                                                "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Auth
                                                                            Provider
                                                                        </span>
                                                                        <Badge
                                                                            className="text-white"
                                                                            variant="outline"
                                                                        >
                                                                            {
                                                                                selectedUser.authProvider
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Role
                                                                        </span>
                                                                        <Badge
                                                                            className="text-white"
                                                                            variant="outline"
                                                                        >
                                                                            {selectedUser.type ||
                                                                                "user"}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Status
                                                                        </span>
                                                                        <Badge
                                                                            variant={
                                                                                selectedUser.status ===
                                                                                "active"
                                                                                    ? "default"
                                                                                    : "secondary"
                                                                            }
                                                                        >
                                                                            {selectedUser.status ||
                                                                                "inactive"}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            VIP
                                                                            Status
                                                                        </span>
                                                                        <Badge
                                                                            variant={
                                                                                selectedUser.vip
                                                                                    ? "default"
                                                                                    : "secondary"
                                                                            }
                                                                        >
                                                                            {selectedUser.vip
                                                                                ? "VIP"
                                                                                : "Not VIP"}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Handle
                                                                        </span>
                                                                        <span className="text-sm text-muted-foreground italic">
                                                                            {selectedUser.handle ||
                                                                                "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Business
                                                                            Subscription
                                                                        </span>
                                                                        <span className="text-sm text-muted-foreground italic">
                                                                            {selectedUser.businessSubscription ||
                                                                                "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Join
                                                                            Date
                                                                        </span>
                                                                        <span className="text-sm text-muted-foreground italic">
                                                                            {selectedUser.joinDate
                                                                                ? new Date(
                                                                                      selectedUser.joinDate
                                                                                  ).toLocaleDateString()
                                                                                : "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            About
                                                                        </span>
                                                                        <span className="text-sm text-muted-foreground italic">
                                                                            {selectedUser.about ||
                                                                                "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Gender
                                                                        </span>
                                                                        <span className="text-sm text-muted-foreground italic">
                                                                            {selectedUser.gender ||
                                                                                "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            Country
                                                                        </span>
                                                                        <span className="text-sm text-muted-foreground italic">
                                                                            {selectedUser.country ||
                                                                                "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="bg-[var(--inputField)] p-3 rounded-lg flex flex-col gap-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm">
                                                                                Facebook
                                                                            </span>
                                                                            <span className="text-sm text-muted-foreground italic">
                                                                                {selectedUser.facebook ||
                                                                                    "Not provided"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm">
                                                                                Instagram
                                                                            </span>
                                                                            <span className="text-sm text-muted-foreground italic">
                                                                                {selectedUser.instagram ||
                                                                                    "Not provided"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm">
                                                                                YouTube
                                                                            </span>
                                                                            <span className="text-sm text-muted-foreground italic">
                                                                                {selectedUser.youtube ||
                                                                                    "Not provided"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </DropdownMenuItem>

                                            {/* VIP action */}
                                            <DropdownMenuItem asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full text-left px-3 justify-start"
                                                    onClick={() =>
                                                        toggleVIPStatus(user)
                                                    }
                                                    disabled={updatingVIP}
                                                >
                                                    {updatingVIP ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Crown className="w-4 h-4 mr-2" />
                                                    )}
                                                    {user.vip
                                                        ? "Remove VIP"
                                                        : "Add VIP"}
                                                </Button>
                                            </DropdownMenuItem>

                                            {/* DELETE action */}
                                            <DropdownMenuItem asChild>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full text-left text-red-500 hover:text-red-600 hover:bg-red-500/20 justify-start px-3"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px] bg-[var(--adminSidebar)] border-[var(--inputField)] text-white rounded-2xl">
                                                        {deleting &&
                                                        selectedUser?.id ===
                                                            user.id ? (
                                                            <div className="flex items-center justify-center">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Delete
                                                                        User
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        delete
                                                                        this
                                                                        user
                                                                        profile?
                                                                        This
                                                                        action
                                                                        cannot
                                                                        be
                                                                        undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="py-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <Avatar className="h-12 w-12">
                                                                            <AvatarImage
                                                                                src={
                                                                                    user.avatar
                                                                                }
                                                                            />
                                                                            <AvatarFallback className="bg-[var(--inputField)]">
                                                                                {user.fullName
                                                                                    ?.split(
                                                                                        " "
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            name
                                                                                        ) =>
                                                                                            name[0]
                                                                                    )
                                                                                    .join(
                                                                                        ""
                                                                                    )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <h3 className="font-medium">
                                                                                {user.fullName ||
                                                                                    "Unknown User"}
                                                                            </h3>
                                                                            <p className="text-sm text-muted-foreground">
                                                                                {
                                                                                    user.email
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <DialogClose
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="outline"
                                                                            className="text-white hover:bg-white hover:text-black"
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            deleteProfile(
                                                                                user
                                                                            )
                                                                        }
                                                                        className="text-red-500 hover:bg-red-500 hover:text-white"
                                                                    >
                                                                        Delete
                                                                        Profile
                                                                    </Button>
                                                                </DialogFooter>
                                                            </>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 py-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        className={
                                            currentPage === 1
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }
                                    />
                                </PaginationItem>

                                {/* Always show first page */}
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => handlePageChange(1)}
                                        isActive={currentPage === 1}
                                    >
                                        1
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Show ellipsis if current page is far from start */}
                                {currentPage > 3 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                {/* Show pages around current page */}
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                )
                                    .filter((page) => {
                                        if (page === 1 || page === totalPages)
                                            return false;
                                        return (
                                            Math.abs(page - currentPage) <= 1
                                        );
                                    })
                                    .map((page) => (
                                        <PaginationItem
                                            className="cursor-pointer"
                                            key={page}
                                        >
                                            <PaginationLink
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                                isActive={currentPage === page}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                {/* Show ellipsis if current page is far from end */}
                                {currentPage < totalPages - 2 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                {/* Always show last page if there's more than one page */}
                                {totalPages > 1 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() =>
                                                handlePageChange(totalPages)
                                            }
                                            isActive={
                                                currentPage === totalPages
                                            }
                                        >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        className={
                                            currentPage === totalPages
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
