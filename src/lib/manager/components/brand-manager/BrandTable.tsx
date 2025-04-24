import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Edit, Eye, MoreHorizontal, Search, Store } from "lucide-react";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import managerService from "../../../../services/manager/manager.service";
import BrandDetail from "./BrandDetail"; // Import BrandDetail component
import UpdateBrandDialog from "./UpdateBrandDialog"; // Import UpdateBrandDialog component
import { useDialogState } from "./UseDialogState";

// Interface cho Brand
interface CustomerSegment {
  name: string;
}

interface IndustryCategory {
  name: string;
}

export interface Brand {
  id: number;
  name: string;
  status: number;
  brandStatusName: string;
  createdAt: string;
  updatedAt: string;
  customerSegments: CustomerSegment[];
  industryCategories: IndustryCategory[];
  storeCount?: number;
}

// Interface cho response của API GET_BRANDS
interface BrandsApiResponse {
  data: Brand[];
  success?: boolean;
  message?: string;
  totalCount?: number;
  page?: number;
  totalPage?: number;
}

export default function BrandManagement() {
  const [brands, setBrands] = React.useState<Brand[]>([]); // State để lưu danh sách brand
  const [currentPage, setCurrentPage] = React.useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = React.useState(1); // Tổng số trang
  const [isLoading, setIsLoading] = React.useState(false); // Trạng thái loading
  const [searchName, setSearchName] = React.useState<string>(""); // State để lưu keyword tìm kiếm
  const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null); // State để lưu brand được chọn để xem chi tiết
  const [updateBrand, setUpdateBrand] = React.useState<Brand | null>(null); // State để lưu brand được chọn để cập nhật

  // Sử dụng custom hook để quản lý trạng thái dialog
  const updateDialog = useDialogState(false);
  const detailDialog = useDialogState(false);

  const itemsPerPage = 10; // Số lượng brand trên mỗi trang

  // Hàm tìm kiếm khi bấm Enter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
      loadBrands(); // Tải lại dữ liệu với searchName mới
    }
  };

  const handleUpdateStoreCount = (brandId: number, storeCount: number) => {
    setBrands((prevBrands) =>
      prevBrands.map((brand) =>
        brand.id === brandId ? { ...brand, storeCount } : brand
      )
    );
  };

  // Hàm tải dữ liệu brands
  const loadBrands = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response: BrandsApiResponse = await managerService.fetchBrands(
        currentPage,
        itemsPerPage,
        searchName
      );
      console.log("Brands loaded:", response); // Kiểm tra dữ liệu
      if (response.data) {
        setBrands(response.data);
        // Tính toán tổng số trang nếu API không trả về
        setTotalPages(
          response.totalPage ||
            Math.ceil((response.totalCount || brands.length) / itemsPerPage)
        );
      } else {
        setBrands([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading brands:", error);
      setBrands([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchName]);

  // Gọi API loadBrands khi component mount và khi currentPage hoặc searchName thay đổi
  React.useEffect(() => {
    loadBrands();
  }, [currentPage, loadBrands]);

  // Hàm xử lý xem chi tiết
  const handleViewDetails = (brand: Brand) => {
    setSelectedBrand(brand);
    detailDialog.openDialog();
  };

  const handleCloseDetail = () => {
    detailDialog.closeDialog();
    setSelectedBrand(null);
  };

  // Hàm xử lý mở dialog cập nhật
  const handleUpdate = (brand: Brand) => {
    setUpdateBrand(brand);
    updateDialog.openDialog();
  };

  // Hàm xử lý đóng dialog cập nhật
  const handleCloseUpdateDialog = () => {
    console.log("Closing update dialog");
    updateDialog.closeDialog();
    // Đặt timeout để đảm bảo dialog đã đóng trước khi reset updateBrand
    setTimeout(() => {
      setUpdateBrand(null);
    }, 100);
  };

  // Hàm xử lý khi cập nhật thành công
  const handleUpdateSuccess = () => {
    loadBrands(); // Tải lại danh sách brand
  };

  // Hàm định dạng ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Đảm bảo reset body styles khi component unmount
  React.useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="space-y-4">
      <Toaster /> {/* Thêm Toaster component để hiển thị thông báo */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên thương hiệu..."
            className="pl-8 w-[300px] focus:border-blue-500"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : brands.length === 0 ? (
        <div className="text-center py-4">Không có dữ liệu để hiển thị</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5%]">ID</TableHead>
                <TableHead className="w-[20%]">Tên thương hiệu</TableHead>
                <TableHead className="w-[10%]">Cửa hàng</TableHead>
                <TableHead className="w-[15%]">Trạng thái</TableHead>
                <TableHead className="w-[15%]">Loại ngành</TableHead>
                <TableHead className="w-[15%]">Đối tượng khách hàng</TableHead>
                <TableHead className="w-[12%]">Ngày cập nhật</TableHead>
                <TableHead className="w-[15%] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    {brand.storeCount ? (
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Store className="h-3 w-3 mr-1" />
                          {brand.storeCount}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Chưa có</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        brand.status === 1
                          ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 justify-center px-2 py-0.5"
                          : "bg-red-100 text-red-800 dark:bg-red-300 hover:bg-red-200 dark:hover:bg-red-400 justify-center px-2 py-0.5"
                      }
                    >
                      {brand.status === 1 ? brand.brandStatusName : "Chờ xử lý"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {brand.industryCategories.length > 0
                      ? brand.industryCategories[0].name +
                        (brand.industryCategories.length > 1
                          ? ` +${brand.industryCategories.length - 1}`
                          : "")
                      : "Không có"}
                  </TableCell>
                  <TableCell>
                    {brand.customerSegments.length > 0
                      ? brand.customerSegments[0].name +
                        (brand.customerSegments.length > 1
                          ? ` +${brand.customerSegments.length - 1}`
                          : "")
                      : "Không có"}
                  </TableCell>
                  <TableCell>{formatDate(brand.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(brand)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdate(brand)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Cập nhật</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
      {/* Hiển thị modal BrandDetail khi có selectedBrand */}
      {selectedBrand && (
        <BrandDetail
          brand={selectedBrand}
          isOpen={detailDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseDetail();
          }}
          onUpdateStoreCount={handleUpdateStoreCount}
        />
      )}
      {/* Hiển thị dialog cập nhật brand khi isUpdateDialogOpen = true */}
      <UpdateBrandDialog
        brand={updateBrand}
        isOpen={updateDialog.isOpen}
        onClose={handleCloseUpdateDialog}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
