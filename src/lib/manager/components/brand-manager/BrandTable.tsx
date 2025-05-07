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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Edit, Eye, MoreHorizontal, MoreVertical, Search, Store } from "lucide-react";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import managerService from "../../../../services/manager/manager.service";
import { clientService } from "../../../../services/client-role/client.service";
import BrandDetail from "./BrandDetail";
import UpdateBrandDialog from "./UpdateBrandDialog";
import { useDialogState } from "../../../all-site/UseDialogState";

export interface CustomerSegment {
  id: number;
  name: string;
}

export interface IndustryCategory {
  id: number;
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
  const [allBrands, setAllBrands] = React.useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = React.useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchName, setSearchName] = React.useState<string>("");
  const [filterStatus, setFilterStatus] = React.useState<"all" | "active" | "pending">("all");
  const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null);
  const [updateBrand, setUpdateBrand] = React.useState<Brand | null>(null);
  const [allIndustryCategories, setAllIndustryCategories] = React.useState<IndustryCategory[]>([]);
  const [allCustomerSegments, setAllCustomerSegments] = React.useState<CustomerSegment[]>([]);

  const updateDialog = useDialogState(false);
  const detailDialog = useDialogState(false);

  const itemsPerPage = 10;

  const statusFilterLabels = {
    all: "Tất cả",
    active: "Hữu hiệu",
    pending: "Chờ xử lý",
  };

  // Tải danh sách Industry Categories và Customer Segments từ clientService
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesResponse = await clientService.getAllIndustryCategories();
        const segmentsResponse = await clientService.getAllCustomerSegments();
        setAllIndustryCategories(categoriesResponse || []);
        setAllCustomerSegments(segmentsResponse || []);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setAllIndustryCategories([]);
        setAllCustomerSegments([]);
      }
    };
    loadInitialData();
  }, []);

  // Tải toàn bộ dữ liệu thương hiệu từ tất cả các trang từ managerService
  const loadAllBrands = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Lấy trang đầu tiên để biết tổng số trang
      const firstResponse: BrandsApiResponse = await managerService.fetchBrands(
        1,
        itemsPerPage,
        searchName
      );
      console.log("First response:", firstResponse);

      if (!firstResponse.data) {
        setAllBrands([]);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }

      const totalPage = firstResponse.totalPage || 1;
      let allData: Brand[] = firstResponse.data;

      // Nếu có nhiều hơn 1 trang, lấy dữ liệu từ các trang còn lại
      if (totalPage > 1) {
        const promises = [];
        for (let page = 2; page <= totalPage; page++) {
          promises.push(managerService.fetchBrands(page, itemsPerPage, searchName));
        }

        const responses = await Promise.all(promises);
        responses.forEach((response: BrandsApiResponse) => {
          if (response.data) {
            allData = [...allData, ...response.data];
          }
        });
      }

      setAllBrands(allData);
    } catch (error) {
      console.error("Error loading all brands:", error);
      setAllBrands([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchName]);

  // Lọc dữ liệu cục bộ và áp dụng phân trang
  React.useEffect(() => {
    let filtered = allBrands;

    // Lọc theo trạng thái
    if (filterStatus !== "all") {
      filtered = filtered.filter((brand) =>
        filterStatus === "active" ? brand.status === 1 : brand.status !== 1
      );
    }

    // Lọc theo tên (nếu API chưa lọc)
    if (searchName) {
      filtered = filtered.filter((brand) =>
        brand.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredBrands(filtered);

    // Tính toán lại totalPages dựa trên danh sách đã lọc
    const newTotalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    setTotalPages(newTotalPages);

    // Reset về trang 1 nếu currentPage vượt quá totalPages
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }

    console.log("Filtered brands:", filtered);
    console.log("Total pages:", newTotalPages);
  }, [allBrands, filterStatus, searchName, currentPage]);

  // Tải dữ liệu khi searchName thay đổi
  React.useEffect(() => {
    loadAllBrands();
  }, [loadAllBrands]);

  // Reset trang khi thay đổi bộ lọc
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchName]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      loadAllBrands();
    }
  };

  // Memo hóa hàm handleUpdateStoreCount để tránh re-render không cần thiết
  const handleUpdateStoreCount = React.useCallback((brandId: number, storeCount: number) => {
    setAllBrands((prevBrands) =>
      prevBrands.map((brand) =>
        brand.id === brandId ? { ...brand, storeCount } : brand
      )
    );
  }, []);

  const handleViewDetails = (brand: Brand) => {
    setSelectedBrand(brand);
    detailDialog.openDialog();
  };

  const handleCloseDetail = () => {
    detailDialog.closeDialog();
    setSelectedBrand(null);
  };

  const handleUpdate = (brand: Brand) => {
    setUpdateBrand(brand);
    updateDialog.openDialog();
  };

  const handleCloseUpdateDialog = () => {
    console.log("Closing update dialog");
    updateDialog.closeDialog();
    setTimeout(() => {
      setUpdateBrand(null);
    }, 100);
  };

  const handleUpdateSuccess = () => {
    loadAllBrands();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  React.useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  // Áp dụng phân trang trên danh sách đã lọc
  const currentItems = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <Toaster />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
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
          <Select
            value={filterStatus}
            onValueChange={(value: "all" | "active" | "pending") => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent className="border border-gray-300 rounded-md shadow-sm">
              {Object.entries(statusFilterLabels).map(([key, label]) => (
                <SelectItem key={key} value={key} className="hover:bg-gray-100">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-4">Không có dữ liệu để hiển thị</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[8%]">ID</TableHead>
                <TableHead className="w-[17%]">Tên thương hiệu</TableHead>
                <TableHead className="w-[12%]">Cửa hàng</TableHead>
                <TableHead className="w-[12%]">Trạng thái</TableHead>
                <TableHead className="w-[15%]">Loại ngành</TableHead>
                <TableHead className="w-[15%]">Đối tượng khách hàng</TableHead>
                <TableHead className="w-[10%]">Ngày cập nhật</TableHead>
                <TableHead className="w-[8%] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((brand) => (
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
                        <button className="p-1 rounded-md">
                          <MoreVertical className="h-4 w-4" />
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
                {Array.from({ length: totalPages }).map((_, i) => {
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
      <UpdateBrandDialog
        brand={updateBrand}
        isOpen={updateDialog.isOpen}
        onClose={handleCloseUpdateDialog}
        onSuccess={handleUpdateSuccess}
        allIndustryCategories={allIndustryCategories}
        allCustomerSegments={allCustomerSegments}
      />
    </div>
  );
}