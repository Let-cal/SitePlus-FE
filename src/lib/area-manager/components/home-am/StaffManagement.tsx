import * as React from "react";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; // Thêm icon Search
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import areaManagerService from "../../../../services/area-manager/area-manager.service";
import { useDebounce } from 'use-debounce';

// Định nghĩa interface cho dữ liệu nhân viên dựa trên API
interface Staff {
  id: number;
  staffId: number; 
  name: string;
  district: string; 
  email: string;
  status: number; 
  statusName: string;
  createdAt: string; // Thêm trường createdAt
}

// Hàm lấy trạng thái đối lập dựa trên status hiện tại
const getOppositeStatus = (currentStatus: number): number => {
  return currentStatus === 1 ? 2 : 1;
};

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]); // Dữ liệu sau khi lọc
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State cho ô search
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300); // Debounce tìm kiếm
  const [statusNameMap, setStatusNameMap] = useState<Record<number, string>>({});
  const itemsPerPage = 10; // Sửa thành 10 để hiển thị 10 nhân viên mỗi trang

  // Hàm lấy tên trạng thái đối lập dựa trên trạng thái hiện tại
  const getOppositeStatusName = (currentStatus: number): string => {
    return statusNameMap[getOppositeStatus(currentStatus)] || (currentStatus === 1 ? "Vô hiệu" : "Hoạt động");
  };

  // Gọi API để lấy danh sách nhân viên khi component mount
  useEffect(() => {
    const fetchStaffData = async () => {
      // Lấy toàn bộ nhân viên
      const users = await areaManagerService.fetchUsers();
      
      const mappedStaffs: Staff[] = users.map(user => ({
        id: user.id,
        staffId: user.id,
        name: user.name,
        district: user.districtName,
        email: user.email,
        status: user.status,
        statusName: user.statusName,
        createdAt: user.createdAt,
      }));
      
      // Sắp xếp nhân viên theo thời gian tạo mới nhất (giảm dần)
      const sortedStaffs = [...mappedStaffs].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setStaffs(sortedStaffs);
      setFilteredStaffs(sortedStaffs); // Ban đầu dữ liệu lọc giống dữ liệu gốc
      
      // Tạo map lưu trữ status -> statusName
      const newStatusNameMap: Record<number, string> = {};
      users.forEach(user => {
        newStatusNameMap[user.status] = user.statusName;
      });
      setStatusNameMap(newStatusNameMap);
    };

    fetchStaffData();
  }, []);

  // Lọc dữ liệu khi searchQuery thay đổi
  useEffect(() => {
    const filtered = staffs.filter(staff =>
      staff.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      staff.id.toString().includes(debouncedSearchQuery)
    );
    setFilteredStaffs(filtered);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  }, [debouncedSearchQuery, staffs]);

  const handleStatusClick = (staff: Staff) => {
    setSelectedStaff(staff);
    setDialogOpen(true);
  };

  const handleStatusChange = () => {
    if (selectedStaff) {
      const newStatus = getOppositeStatus(selectedStaff.status);
      const newStatusName = statusNameMap[newStatus] || getOppositeStatusName(selectedStaff.status);
      
      setStaffs(prevStaffs =>
        prevStaffs.map(s => {
          if (s.id === selectedStaff.id) {
            return {
              ...s,
              status: newStatus,
              statusName: newStatusName,
            };
          }
          return s;
        })
      );
      setFilteredStaffs(prevStaffs =>
        prevStaffs.map(s => {
          if (s.id === selectedStaff.id) {
            return {
              ...s,
              status: newStatus,
              statusName: newStatusName,
            };
          }
          return s;
        })
      );
    }
    setDialogOpen(false);
  };

  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);
  const currentItems = filteredStaffs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">Quản lý nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex gap-3 flex-wrap justify-end">
              {/* Ô search với icon kính lúp */}
              <div className="relative w-[300px]">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10" // Thêm padding-left để không đè lên icon
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">ID</TableHead>
                <TableHead className="w-[25%]">Tên</TableHead>
                <TableHead className="w-[20%]">Khu vực (quận)</TableHead>
                <TableHead className="w-[30%]">Tên đăng nhập</TableHead>
                <TableHead className="w-[10%]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.staffId}</TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.district}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`w-[100px] h-5 flex items-center justify-center cursor-pointer ${
                          staff.status === 1
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        } text-white text-xs whitespace-nowrap`}
                        onClick={() => handleStatusClick(staff)}
                      >
                        {staff.statusName}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredStaffs.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thay đổi trạng thái của {selectedStaff?.name} từ {selectedStaff?.statusName} sang{" "}
              {selectedStaff && (statusNameMap[getOppositeStatus(selectedStaff.status)] || getOppositeStatusName(selectedStaff.status))}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StaffManagement;