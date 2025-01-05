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
import { Eye, MoreVertical, Pencil, Plus, Search, Trash } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

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

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [processedUsers, setProcessedUsers] = useState<User[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
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
      }
    };
    fetchRoles();
  }, []);

  // Fetch users when filters or pagination changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedRole) return;

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
      }
    };

    const debounceTimer = setTimeout(fetchUsers, 500);
    return () => clearTimeout(debounceTimer);
  }, [selectedRole, statusFilter, currentPage, searchQuery]);

  useEffect(() => {
    const processUsers = () => {
      setIsDataReady(false);
      const processed = users.map((user) => ({
        ...user,
        areaSplit: user.area ? user.area.split(",").map((s) => s.trim()) : [],
      }));
      setProcessedUsers(processed);
      setIsDataReady(true);
    };
    processUsers();
  }, [users]);

  const getAreaColumns = () => {
    switch (selectedRole) {
      case "2":
        return <TableHead className="text-center">City</TableHead>;
      case "3":
      case "4":
        return (
          <>
            <TableHead className="text-center">City</TableHead>
            <TableHead className="text-center">District</TableHead>
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
      case "4":
        return (
          <>
            <TableCell className="text-center">{user.areaSplit[0]}</TableCell>
            <TableCell className="text-center">{user.areaSplit[1]}</TableCell>
          </>
        );
      default:
        return null;
    }
  };

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

  // // Keep the mock data for extra columns
  // const getExtraColumns = () => {
  //   switch (selectedRole) {
  //     case "2": // Assuming 2 is manager role ID
  //       return (
  //         <TableHead className="text-center">
  //           Number Of Area Managers Managing
  //         </TableHead>
  //       );
  //     case "3": // Assuming 3 is area manager role ID
  //       return <TableHead className="text-center">Managed Area</TableHead>;
  //     case "4": // Assuming 4 is staff role ID
  //       return <TableHead className="text-center">Tasks Completed</TableHead>;
  //     case "5": // Assuming 5 is client role ID
  //       return <TableHead className="text-center">Total Requests</TableHead>;

  //     default:
  //       return null;
  //   }
  // };

  // // Keep mock data for extra cells
  // const getExtraCell = () => {
  //   switch (selectedRole) {
  //     case "2":
  //       return <TableCell className="text-center">15</TableCell>;
  //     case "3":
  //       return <TableCell className="text-center">North Region</TableCell>;
  //     case "4":
  //       return <TableCell className="text-center">45</TableCell>;
  //     case "5":
  //       return <TableCell className="text-center">25</TableCell>;
  //     default:
  //       return null;
  //   }
  // };

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

      {isDataReady ? (
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
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Update
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
      ) : (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserTable;
