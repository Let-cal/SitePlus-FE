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
import { adminService, Role, User } from "@/services/admin/admin.service";
import { Eye, MoreVertical, Plus, Search, Trash } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import UpdateUserDialog from "./UpdateUserDialog";

interface ProcessedUser extends User {
  formattedBranch?: string;
  formattedArea?: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [processedUsers, setProcessedUsers] = useState<ProcessedUser[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    setCurrentPage(1); // Đặt lại trang 1 khi thay đổi vai trò
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Đặt lại trang 1 khi thay đổi bộ lọc trạng thái
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Đặt lại trang 1 khi thay đổi từ khóa tìm kiếm
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getAllRoles();

        // Kiểm tra dữ liệu vai trò trước khi lọc
        if (data && Array.isArray(data)) {
          // Lọc các vai trò theo yêu cầu: "Manager", "Area-Manager", "Staff"
          const filteredRoles = data
            .filter((role) =>
              ["Manager", "Area-Manager", "Staff"].includes(role.name)
            )
            .sort((a, b) => a.name.localeCompare(b.name));

          setRoles(filteredRoles);

          // Đặt vai trò Manager làm mặc định nếu có
          const managerRole = filteredRoles.find(
            (role) => role.name === "Manager"
          );

          if (managerRole) {
            setSelectedRole(managerRole.id.toString());
          }
        } else {
          console.error(
            "Dữ liệu vai trò không phải là mảng hoặc undefined:",
            data
          );
          setRoles([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy vai trò:", error);
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Lấy danh sách người dùng khi bộ lọc hoặc phân trang thay đổi
  useEffect(() => {
    if (selectedRole) {
      const debounceTimer = setTimeout(fetchUsers, 500);
      return () => clearTimeout(debounceTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole, statusFilter, currentPage, searchQuery, sort]);

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
        sort,
      });

      // Cập nhật theo cấu trúc phản hồi thực tế
      setUsers(response.data.listData);
      setTotalPages(response.data.totalPage);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    processUserData();
  }, [users, selectedRole]);

  const processUserData = () => {
    const processed: ProcessedUser[] = users.map((user) => {
      const processedUser: ProcessedUser = { ...user };

      // Định dạng dữ liệu vị trí dựa theo vai trò
      switch (selectedRole) {
        case "7": // Manager
          processedUser.formattedBranch = `${user.districtName || ""}/${
            user.areaName || ""
          }`;
          break;
        case "8": // Area Manager
          processedUser.formattedArea = user.districtName || "";
          break;
        case "9": // Staff
          processedUser.formattedBranch = `${user.districtName || ""}/${
            user.areaName || ""
          }`;
          break;
        default:
          break;
      }

      return processedUser;
    });

    setProcessedUsers(processed);
  };

  const getExtraColumns = () => {
    switch (selectedRole) {
      case "7": // Manager
        return <TableHead>Chi nhánh trực thuộc</TableHead>;
      case "8": // Area Manager
        return <TableHead>Khu vực quản lý</TableHead>;
      case "9": // Staff
        return <TableHead>Chi nhánh trực thuộc</TableHead>;
      default:
        return null;
    }
  };

  const getExtraCell = (user: ProcessedUser) => {
    switch (selectedRole) {
      case "7": // Manager
        return <TableCell>{user.formattedBranch}</TableCell>;
      case "8": // Area Manager
        return <TableCell>{user.formattedArea}</TableCell>;
      case "9": // Staff
        return <TableCell>{user.formattedBranch}</TableCell>;
      default:
        return null;
    }
  };

  const getStatusBadge = (statusName: string) => {
    const statusStyles = {
      "Hoạt động": "bg-green-500 hover:bg-green-600", // Đang hoạt động
      "Vô hiệu": "bg-gray-500 hover:bg-gray-600", // Không hoạt động
    };

    return (
      <Badge
        className={`${statusStyles[statusName] || "bg-gray-500"} text-white`}
      >
        {statusName === "Hoạt động" ? "Đang hoạt động" : "Vô hiệu"}
      </Badge>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hàm định dạng ngày
  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Lỗi khi parse date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh Sách Tài Khoản</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Hoạt động">Đang hoạt động</SelectItem>
              <SelectItem value="Vô hiệu">Vô hiệu</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Chọn vai trò" />
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

      <div>
        <Table>
          <TableCaption>
            Danh sách người dùng - Tổng số: {totalRecords}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#ID</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              {getExtraColumns()}
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({
                      length:
                        selectedRole === "7" ||
                        selectedRole === "8" ||
                        selectedRole === "9"
                          ? 7
                          : 6,
                    }).map((_, cellIndex) => (
                      <TableCell key={`cell-${index}-${cellIndex}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : processedUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.roleName}</TableCell>
                    {getExtraCell(user)}
                    <TableCell>{getStatusBadge(user.statusName)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo mới
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <UpdateUserDialog
                              user={user}
                              onUpdate={fetchUsers}
                              asTrigger={true}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Xóa
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
      </div>
    </div>
  );
};

export default UserTable;
