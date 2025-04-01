import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Sử dụng AlertDialog thay vì Dialog
import toast, { Toaster } from "react-hot-toast";
import managerService from "../../../../services/manager/manager.service";
import RequestDetail from "./RequestDetail";

interface Request {
  id: string;
  brand: string;
  email: string;
  description: string;
  status?: number;
  statusName?: string;
  createdAt: string; // Thêm trường createdAt
}

type FilterStatus = "all" | "accepted" | "matching";

const filterLabels = {
  all: "Tất cả",
  accepted: "Chấp nhận",
  matching: "Đang ghép",
};

export default function RequestTableWithTabs() {
  const [activeTab, setActiveTab] = React.useState<"new" | "processed">("new");
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [requests, setRequests] = React.useState<Request[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);
  const itemsPerPage = 10;

  // State để quản lý AlertDialog xác nhận
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogAction, setDialogAction] = React.useState<"accepted" | "rejected" | null>(null);
  const [dialogRequestId, setDialogRequestId] = React.useState<string | null>(null);

  // Gọi API khi component mount và sắp xếp theo createdAt
  React.useEffect(() => {
    const loadBrandRequests = async () => {
      const data = await managerService.fetchBrandRequests();
      const mappedData: Request[] = data.map((item) => ({
        id: item.brandRequest.id.toString(),
        brand: item.brandRequest.brandName,
        email: item.brandRequest.emailCustomer,
        description: item.brandRequest.description,
        status: item.brandRequest.status,
        statusName: item.brandRequest.statusName,
        createdAt: item.brandRequest.createdAt, // Lấy createdAt từ API
      }));

      // Sắp xếp theo createdAt giảm dần (mới nhất trước)
      const sortedData = [...mappedData].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setRequests(sortedData);
    };
    loadBrandRequests();
  }, []);

  const getFilteredData = () => {
    let data = requests;

    if (activeTab === "new") {
      return data.filter((item) => item.status === 0);
    }

    data = data.filter((item) => item.status === 1 || item.status === 3);

    if (filterStatus === "accepted") {
      data = data.filter((item) => item.status === 1);
    } else if (filterStatus === "matching") {
      data = data.filter((item) => item.status === 3);
    }

    return data;
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, activeTab]);

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm xử lý hành động (Chấp nhận/Từ chối) - Mở AlertDialog xác nhận
  const handleAction = (id: string, action: "accepted" | "rejected") => {
    setDialogRequestId(id);
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  // Hàm xác nhận hành động trong AlertDialog
  const confirmAction = async () => {
    if (!dialogRequestId || !dialogAction) return;

    const requestId = parseInt(dialogRequestId);
    const newStatus = dialogAction === "accepted" ? 1 : 2; // 1: Chấp nhận, 2: Từ chối

    try {
      // Gọi API để cập nhật trạng thái
      const success = await managerService.updateBrandRequestStatus(requestId, newStatus);
      if (success) {
        // Cập nhật danh sách requests
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === dialogRequestId
              ? {
                  ...req,
                  status: newStatus,
                  statusName: dialogAction === "accepted" ? "Chấp nhận" : "Từ chối",
                }
              : req
          )
        );
        toast.success(
          `Đã ${dialogAction === "accepted" ? "chấp nhận" : "từ chối"} yêu cầu ID: ${dialogRequestId}`,
          { position: "top-right", duration: 3000 }
        );
      } else {
        toast.error("Lỗi khi cập nhật trạng thái", { position: "top-right", duration: 3000 });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Lỗi khi cập nhật trạng thái", { position: "top-right", duration: 3000 });
    } finally {
      // Đóng AlertDialog sau khi xử lý
      setIsDialogOpen(false);
      setDialogRequestId(null);
      setDialogAction(null);
    }
  };

  // Hàm mở drawer khi bấm "Xem chi tiết"
  const handleViewDetail = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsDrawerOpen(true);
  };

  // Hàm đóng drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRequestId(null);
  };

  const ActionButton = ({ request }: { request: Request }) => {
    if (activeTab === "processed") {
      return (
        <div className="flex gap-2">
          <Badge
            className={
              request.status === 1
                ? "bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
                : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
            }
          >
            {request.statusName}
          </Badge>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="w-[90px] px-2 h-7 text-sm">
            Xử lý
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleAction(request.id, "accepted")}>
            Chấp nhận
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction(request.id, "rejected")}>
            Từ chối
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const truncateDescription = (desc: string) => {
    return desc.length > 15 ? desc.substring(0, 15) + "..." : desc;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "new" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("new");
              setFilterStatus("all");
            }}
          >
            YÊU CẦU MỚI
          </Button>
          <Button
            variant={activeTab === "processed" ? "default" : "outline"}
            onClick={() => setActiveTab("processed")}
          >
            ĐÃ XỬ LÝ
          </Button>
        </div>

        {activeTab === "processed" && (
          <Select
            value={filterStatus}
            onValueChange={(value: FilterStatus) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(filterLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">ID</TableHead>
            <TableHead className="w-[20%]">Thương hiệu</TableHead>
            <TableHead className="w-[20%]">Email khách hàng</TableHead>
            <TableHead className="w-[20%]">Yêu cầu</TableHead>
            <TableHead className="w-[12%]">Xem chi tiết</TableHead>
            <TableHead className="w-[8%]">{activeTab === "new" ? "Hành động" : "Trạng thái"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.brand}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{truncateDescription(request.description)}</TableCell>
              <TableCell>
                <Button
                  variant="link"
                  className="text-blue-500 p-0 underline hover:text-blue-700"
                  onClick={() => handleViewDetail(request.id)}
                >
                  Xem chi tiết
                </Button>
              </TableCell>
              <TableCell>
                <ActionButton request={request} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Drawer hiển thị chi tiết BrandRequest */}
      {selectedRequestId && (
        <RequestDetail
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          brandRequestId={parseInt(selectedRequestId)}
        />
      )}

      {/* AlertDialog xác nhận hành động */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hành động</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn{" "}
              {dialogAction === "accepted" ? "chấp nhận" : "từ chối"} yêu cầu ID: {dialogRequestId} không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
}