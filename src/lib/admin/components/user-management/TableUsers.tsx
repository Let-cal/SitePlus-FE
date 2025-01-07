import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/lib/all-site/pagination";
import { adminService } from "@/services/admin/admin.service";
import { Eye, MoreVertical, Plus, Search, Trash } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import UpdateUserDialog from "./UpdateUserDialog";
interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roleName: string;
  area?: string;
  status: boolean;
}
interface CompletedTask {
  staffId: number;
  staffName: string;
  completedTasksCount: number;
}
const UserTable = () => {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [processedUsers, setProcessedUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getAllRoles();
        const filteredRoles = data
          .filter((role) =>
            ["Manager", "Area-Manager", "Staff", "Customer"].includes(role.name)
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setRoles(filteredRoles);
        // Set Manager role as default
        const managerRole = filteredRoles.find(
          (role) => role.name === "Customer"
        );
        if (managerRole) {
          setSelectedRole(managerRole.id.toString());
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Fetch users when filters or pagination changes
  useEffect(() => {
    fetchUsers();
    const debounceTimer = setTimeout(fetchUsers, 500);
    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole, statusFilter, currentPage, searchQuery]);

  const fetchUsers = async () => {
    if (!selectedRole) return;
    setIsLoading(true);
    try {
      const response = await adminService.getAllUsers({
        roleId: parseInt(selectedRole),
        status: statusFilter === "all" ? null : statusFilter === "active",
        page: currentPage,
        pageSize,
        search: searchQuery,
      });

      setUsers(response.data.listData);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const processUsers = () => {
      const processed = users.map((user) => ({
        ...user,
        areaSplit: user.area ? user.area.split(",").map((s) => s.trim()) : [],
      }));
      setProcessedUsers(processed);
    };
    processUsers();
  }, [users]);
  useEffect(() => {
    const fetchData = async () => {
      if (selectedRole === "4") {
        // 4 is Staff role
        const tasksData = await adminService.getCompletedTasks();
        setCompletedTasks(tasksData);
      }
    };
    fetchData();
  }, [selectedRole]);
  const getAreaColumns = () => {
    switch (selectedRole) {
      case "2":
        return <TableHead className="text-center">City</TableHead>;
      case "3":
        return (
          <>
            <TableHead className="text-center">City</TableHead>
            <TableHead className="text-center">District</TableHead>
          </>
        );
      case "4":
        return (
          <>
            <TableHead className="text-center">City</TableHead>
            <TableHead className="text-center">District</TableHead>
            <TableHead>Tasks Completed</TableHead>
          </>
        );
      default:
        return null;
    }
  };

  const getAreaCells = (user: User & { areaSplit?: string[] }) => {
    if (!user.areaSplit?.length) return null;

    switch (selectedRole) {
      case "2":
        return (
          <TableCell className="text-center">{user.areaSplit[0]}</TableCell>
        );
      case "3":
        return (
          <>
            <TableCell className="text-center">{user.areaSplit[0]}</TableCell>
            <TableCell className="text-center">{user.areaSplit[1]}</TableCell>
          </>
        );
      case "4":
        return (
          <>
            <TableCell className="text-center">{user.areaSplit[0]}</TableCell>
            <TableCell className="text-center">{user.areaSplit[1]}</TableCell>
            <TableCell>
              {user.roleName === "Staff"
                ? completedTasks.find((t) => t.staffId === user.id)
                    ?.completedTasksCount ?? "N/A"
                : "N/A"}
            </TableCell>
          </>
        );
      default:
        return null;
    }
  };
  console.log(selectedRole);
  const getStatusBadge = (status: boolean) => {
    const statusStyles = {
      true: "bg-green-500 hover:bg-green-600",
      false: "bg-gray-500 hover:bg-gray-600",
    };

    return (
      <Badge className={`${statusStyles[String(status)]} text-white`}>
        {status ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anything..."
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        Array.from({ length: pageSize }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 7 }).map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <>
          <Table>
            <TableCaption>List of Users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                {/* {getExtraColumns()} */}
                {getAreaColumns()}

                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.roleName}</TableCell>
                  {/* {getExtraCell()} */}
                  {getAreaCells(user)}

                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="h-4 w-4 mr-2" />
                          Create
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <UpdateUserDialog
                            user={user}
                            onUpdate={fetchUsers}
                            asTrigger={true} // Thêm prop tùy chỉnh để xác định trigger
                          />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
export default UserTable;
