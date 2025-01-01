import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Eye, MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import * as React from "react";
import { useState } from "react";

// Mock data
const mockData = {
  clients: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Client",
      status: "active",
      totalRequests: 15,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Client",
      status: "inactive",
      totalRequests: 8,
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Client",
      status: "active",
      totalRequests: 22,
    },
    {
      id: 4,
      name: "Bob Martin",
      email: "bob@example.com",
      role: "Client",
      status: "inactive",
      totalRequests: 5,
    },
    {
      id: 5,
      name: "Charlie White",
      email: "charlie@example.com",
      role: "Client",
      status: "active",
      totalRequests: 18,
    },
  ],
  managers: [
    {
      id: 1,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Manager",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Manager",
      status: "active",
    },
    {
      id: 3,
      name: "Kevin Brown",
      email: "kevin@example.com",
      role: "Manager",
      status: "inactive",
    },
    {
      id: 4,
      name: "Emily Taylor",
      email: "emily@example.com",
      role: "Manager",
      status: "active",
    },
  ],
  areaManagers: [
    {
      id: 1,
      name: "David Wilson",
      email: "david@example.com",
      role: "Area-Manager",
      status: "active",
      managedArea: "North Region",
    },
    {
      id: 2,
      name: "Lisa Brown",
      email: "lisa@example.com",
      role: "Area-Manager",
      status: "active",
      managedArea: "South Region",
    },
    {
      id: 3,
      name: "Mark Evans",
      email: "mark@example.com",
      role: "Area-Manager",
      status: "inactive",
      managedArea: "East Region",
    },
    {
      id: 4,
      name: "Sophia Clark",
      email: "sophia@example.com",
      role: "Area-Manager",
      status: "active",
      managedArea: "West Region",
    },
  ],
  staff: [
    {
      id: 1,
      name: "Tom Harris",
      email: "tom@example.com",
      role: "Staff",
      status: "active",
      tasksCompleted: 45,
    },
    {
      id: 2,
      name: "Emma Davis",
      email: "emma@example.com",
      role: "Staff",
      status: "inactive",
      tasksCompleted: 32,
    },
    {
      id: 3,
      name: "Jack Robinson",
      email: "jack@example.com",
      role: "Staff",
      status: "active",
      tasksCompleted: 27,
    },
    {
      id: 4,
      name: "Olivia Moore",
      email: "olivia@example.com",
      role: "Staff",
      status: "active",
      tasksCompleted: 52,
    },
    {
      id: 5,
      name: "Lucas Martinez",
      email: "lucas@example.com",
      role: "Staff",
      status: "inactive",
      tasksCompleted: 16,
    },
  ],
};

const UserTable = () => {
  const [userType, setUserType] = useState("clients");
  const [statusFilter, setStatusFilter] = useState("all"); // Add status filter state

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-green-500 hover:bg-green-600",
      inactive: "bg-gray-500 hover:bg-gray-600",
    };

    return (
      <Badge className={`${statusStyles[status]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Get the appropriate data based on user type and filter by status
  const currentData = mockData[userType].filter((user) =>
    statusFilter === "all" ? true : user.status === statusFilter
  );

  // Get available statuses for the current user type
  const getAvailableStatuses = () => {
    const statuses = new Set(mockData[userType].map((user) => user.status));
    return Array.from(statuses);
  };

  // Define table columns based on user type
  const getExtraColumns = () => {
    switch (userType) {
      case "clients":
        return <TableHead className="text-center">Total Requests</TableHead>;
      case "areaManagers":
        return <TableHead className="text-center">Managed Area</TableHead>;
      case "staff":
        return <TableHead className="text-center">Tasks Completed</TableHead>;
      default:
        return null;
    }
  };

  // Render extra cell content based on user type
  const getExtraCell = (user) => {
    switch (userType) {
      case "clients":
        return (
          <TableCell className="text-center">{user.totalRequests}</TableCell>
        );
      case "areaManagers":
        return (
          <TableCell className="text-center">{user.managedArea}</TableCell>
        );
      case "staff":
        return (
          <TableCell className="text-center">{user.tasksCompleted}</TableCell>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Table Users</h2>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {getAvailableStatuses().map((status) => (
                <SelectItem key={String(status)} value={String(status)}>
                  {String(status).charAt(0).toUpperCase() +
                    String(status).slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clients">Clients</SelectItem>
              <SelectItem value="managers">Managers</SelectItem>
              <SelectItem value="areaManagers">Area Managers</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableCaption>
          List of {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {getExtraColumns()}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              {getExtraCell(user)}
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
    </div>
  );
};

export default UserTable;
