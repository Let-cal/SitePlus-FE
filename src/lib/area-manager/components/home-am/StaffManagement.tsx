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
import areaManagerService from "../../../../services/area-manager/area-manager.service";

// Định nghĩa interface cho dữ liệu nhân viên dựa trên API
interface Staff {
  id: number;
  staffId: number; // Lấy từ id của API
  name: string;
  district: string; // Lấy từ districtName
  email: string;
  status: string; // Lấy từ statusName (giá trị chuỗi từ API)
}

// Hàm lấy trạng thái đối lập dựa trên statusName hiện tại
const getOppositeStatus = (currentStatus: string): string => {
  // Giả định statusName chỉ có 2 giá trị: một giá trị là "Hoạt động" hoặc "Đang hoạt động" (hoặc tương tự),
  // và một giá trị là "Vô hiệu" hoặc "Tạm ngưng" (hoặc tương tự)
  const activeStatuses = ["Hoạt động", "Đang hoạt động", "Đang làm"]; // Danh sách các trạng thái "hoạt động"
  return activeStatuses.includes(currentStatus) ? "Vô hiệu" : "Hoạt động"; // Chuyển đổi linh hoạt
};

const StaffManagement = () => {
  const [staffs, setStaffs] = React.useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedStaff, setSelectedStaff] = React.useState<Staff | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const itemsPerPage = 5;

  // Gọi API để lấy danh sách nhân viên khi component mount
  React.useEffect(() => {
    const fetchStaffData = async () => {
      const users = await areaManagerService.fetchUsers(1, itemsPerPage);
      const mappedStaffs: Staff[] = users.map(user => ({
        id: user.id,
        staffId: user.id, // id từ API làm mã nhân viên
        name: user.name,
        district: user.districtName,
        email: user.email,
        status: user.statusName, // Sử dụng statusName trực tiếp từ API
      }));
      setStaffs(mappedStaffs);
    };

    fetchStaffData();
  }, []);

  const handleStatusClick = (staff: Staff) => {
    setSelectedStaff(staff);
    setDialogOpen(true);
  };

  const handleStatusChange = () => {
    if (selectedStaff) {
      setStaffs(prevStaffs =>
        prevStaffs.map(s => {
          if (s.id === selectedStaff.id) {
            const newStatus = getOppositeStatus(selectedStaff.status); // Lấy trạng thái đối lập
            return {
              ...s,
              status: newStatus,
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
          <CardTitle className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">Quản lý nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Mã nhân viên</TableHead>
                <TableHead className="w-[25%]">Tên</TableHead>
                <TableHead className="w-[20%]">Khu vực (quận)</TableHead>
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
                        ["Hoạt động", "Đang hoạt động", "Đang làm"].includes(staff.status)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      } text-white text-xs whitespace-nowrap`}
                      onClick={() => handleStatusClick(staff)}
                    >
                      {staff.status}
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
              Bạn có chắc chắn muốn thay đổi trạng thái của {selectedStaff?.name} từ {selectedStaff?.status} sang{" "}
              {getOppositeStatus(selectedStaff?.status || "")}?
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