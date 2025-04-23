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
import { useUserContext } from "@/services/admin/UserContext";
import { Eye, MoreVertical, Plus, Search, Trash } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import UpdateUserDialog from "./UpdateUserDialog";

interface ProcessedUser extends User {
  formattedBranch?: string;
  formattedArea?: string;
}

const UserTable = () => {
  const { usersData, isLoading, currentParams, updateParams, refreshData } =
    useUserContext();

  const [roles, setRoles] = useState<Role[]>([]);
  const [processedUsers, setProcessedUsers] = useState<ProcessedUser[]>([]);
  const [searchQueryInput, setSearchQueryInput] = useState(
    currentParams.search || ""
  );
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Lấy danh sách vai trò khi component được mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await adminService.getAllRoles();
        // Lọc các vai trò theo yêu cầu: "Manager", "Area-Manager", "Staff"
        const filteredRoles = data
          .filter((role) =>
            ["Manager", "Area-Manager", "Staff"].includes(role.name)
          )
          .sort((a, b) => a.name.localeCompare(b.name));

        setRoles(filteredRoles);

        // Đặt vai trò Manager làm mặc định nếu có và chưa có roleId trong params
        if (!currentParams.roleId && filteredRoles.length > 0) {
          const managerRole = filteredRoles.find(
            (role) => role.name === "Manager"
          );

          if (managerRole) {
            updateParams({ roleId: managerRole.id });
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy vai trò:", error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);

  // Xử lý dữ liệu người dùng khi có dữ liệu mới
  useEffect(() => {
    if (usersData && usersData.listData) {
      processUserData(usersData.listData);
    }
  }, [usersData, currentParams.roleId]);

  const processUserData = (users: User[]) => {
    const processed: ProcessedUser[] = users.map((user) => {
      const processedUser: ProcessedUser = { ...user };

      // Định dạng dữ liệu vị trí dựa theo vai trò
      const roleId = currentParams.roleId?.toString();
      switch (roleId) {
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

  const handleRoleChange = (newRole: string) => {
    updateParams({ roleId: parseInt(newRole) });
  };

  const handleStatusFilterChange = (newStatus: string) => {
    // Chuyển đổi giá trị trạng thái
    const statusValue = newStatus === "all" ? null : newStatus === "Hoạt động";

    updateParams({ status: statusValue });
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQueryInput(value);

    // Debounce search to avoid too many requests
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      updateParams({ search: value });
    }, 500);
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const getExtraColumns = () => {
    const roleId = currentParams.roleId?.toString();
    switch (roleId) {
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
    const roleId = currentParams.roleId?.toString();
    switch (roleId) {
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

  // Xác định trạng thái hiện tại cho các bộ lọc
  const currentStatus =
    currentParams.status === null
      ? "all"
      : currentParams.status
      ? "Hoạt động"
      : "Vô hiệu";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh Sách Tài Khoản</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-8 w-[200px]"
              value={searchQueryInput}
              onChange={handleSearchQueryChange}
            />
          </div>
          <Select
            value={currentStatus}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Hoạt động">Đang hoạt động</SelectItem>
              <SelectItem value="Vô hiệu">Vô hiệu</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentParams.roleId?.toString() || ""}
            onValueChange={handleRoleChange}
          >
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
            Danh sách người dùng - Tổng số: {usersData?.totalRecords || 0}
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
            {isLoading && !processedUsers.length
              ? Array.from({ length: currentParams.pageSize || 10 }).map(
                  (_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {Array.from({
                        length:
                          currentParams.roleId === 7 ||
                          currentParams.roleId === 8 ||
                          currentParams.roleId === 9
                            ? 7
                            : 6,
                      }).map((_, cellIndex) => (
                        <TableCell key={`cell-${index}-${cellIndex}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                )
              : processedUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {((currentParams.page || 1) - 1) *
                        (currentParams.pageSize || 10) +
                        index +
                        1}
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
                              onUpdate={refreshData}
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
        {usersData && (
          <Pagination
            currentPage={currentParams.page || 1}
            totalPages={usersData.totalPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default UserTable;
