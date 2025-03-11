import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import managerService from "../../../../services/manager/manager.service";

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

const UserManagement = () => {
  const [staffs, setStaffs] = React.useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedStaff, setSelectedStaff] = React.useState<Staff | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // Thêm state lưu trữ tên trạng thái đối lại
  const [statusNameMap, setStatusNameMap] = React.useState<Record<number, string>>({});
  const itemsPerPage = 5;

  // Hàm lấy tên trạng thái đối lại dựa trên trạng thái hiện tại
  const getOppositeStatusName = (currentStatus: number): string => {
    return statusNameMap[getOppositeStatus(currentStatus)] || (currentStatus === 1 ? "Vô hiệu" : "Hoạt động");
  };

  // Gọi API để lấy danh sách nhân viên khi component mount
  React.useEffect(() => {
    const fetchStaffData = async () => {
      // Lấy toàn bộ user
      const users = await managerService.fetchUsers(1, 100); 
    
      const managers = users.filter(user => user.roleName === "Area-Manager");
      
      const mappedStaffs: Staff[] = managers.map(user => ({
        id: user.id,
        staffId: user.id,
        name: user.name,
        district: user.districtName,
        email: user.email,
        status: user.status,
        statusName: user.statusName,
        createdAt: user.createdAt, // Đảm bảo lưu trữ trường createdAt
      }));
      
      // Sắp xếp nhân viên theo thời gian tạo mới nhất (giảm dần)
      const sortedStaffs = [...mappedStaffs].sort((a, b) => {
        // Sử dụng Date để so sánh thời gian
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setStaffs(sortedStaffs);
      
      // Tạo map lưu trữ status -> statusName
      const newStatusNameMap: Record<number, string> = {};
      managers.forEach(user => {
        newStatusNameMap[user.status] = user.statusName;
      });
      setStatusNameMap(newStatusNameMap);
    };

    fetchStaffData();
  }, []);

  const handleStatusClick = (staff: Staff) => {
    setSelectedStaff(staff);
    setDialogOpen(true);
  };

  const handleStatusChange = () => {
    if (selectedStaff) {
      const newStatus = getOppositeStatus(selectedStaff.status);
      // Lấy tên trạng thái từ map hoặc sử dụng giá trị mặc định
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
    }
    setDialogOpen(false);
  };

  const totalPages = Math.ceil(staffs.length / itemsPerPage);
  const currentItems = staffs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">QUẢN LÝ NGƯỜI DÙNG</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Mã nhân viên</TableHead>
                <TableHead className="w-[25%]">Tên</TableHead>
                <TableHead className="w-[20%]">Khu vực</TableHead>
                <TableHead className="w-[30%]">Email</TableHead>
                <TableHead className="w-[10%]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((staff) => (
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
              ))}
            </TableBody>
          </Table>

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

export default UserManagement;