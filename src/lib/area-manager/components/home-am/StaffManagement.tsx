import * as React from "react";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  areaName: string; // Thay district thành areaName
  email: string;
  status: number;
  statusName: string;
  createdAt: string;
  tasksInProgress: number;
  tasksCompleted: number;
}

// Hàm lấy trạng thái đối lập dựa trên status hiện tại
const getOppositeStatus = (currentStatus: number): number => {
  return currentStatus === 1 ? 2 : 1;
};

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusNameMap, setStatusNameMap] = useState<Record<number, string>>({});
  const itemsPerPage = 10;

  // Hàm lấy tên trạng thái đối lập dựa trên trạng thái hiện tại
  const getOppositeStatusName = (currentStatus: number): string => {
    return statusNameMap[getOppositeStatus(currentStatus)] || (currentStatus === 1 ? "Vô hiệu" : "Hoạt động");
  };

  // Gọi API để lấy danh sách nhân viên khi component mount
  useEffect(() => {
    const fetchStaffData = async () => {
      const users = await areaManagerService.fetchUsers();
      
      const mappedStaffs: Staff[] = users.map(user => ({
        id: user.id,
        staffId: user.id,
        name: user.name,
        areaName: user.areaName, 
        email: user.email,
        status: user.status,
        statusName: user.statusName,
        createdAt: user.createdAt,
        tasksInProgress: user.tasksInProgress, // Lấy từ API
        tasksCompleted: user.tasksCompleted, // Lấy từ API
      }));
      
      const sortedStaffs = [...mappedStaffs].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setStaffs(sortedStaffs);
      setFilteredStaffs(sortedStaffs);
      
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
    setCurrentPage(1);
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
              <div className="relative w-[300px]">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">ID</TableHead>
                <TableHead className="w-[20%]">Tên</TableHead>
                <TableHead className="w-[20%]">Khu vực</TableHead>
                <TableHead className="w-[15%]">Hoàn thành</TableHead>
                <TableHead className="w-[15%]">Đang làm</TableHead>
                <TableHead className="w-[8%]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.staffId}</TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.areaName}</TableCell>
                    <TableCell>{staff.tasksCompleted}</TableCell>
                    <TableCell>{staff.tasksInProgress}</TableCell>
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
                  <TableCell colSpan={6} className="text-center py-8">
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