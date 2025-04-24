import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as React from "react";
import managerService from "../../../../services/manager/manager.service";
import SiteDetail from "./SiteDetail";

// Interface cho site (đơn giản hóa từ API)
interface Site {
  id: number;
  address: string;
  areaName?: string; // Tùy chọn
  districtName?: string; // Tùy chọn
  size: number;
  status: number;
  siteCategoryId: number; // Thêm siteCategoryId
  siteCategoryName: string;
}

// Interface cho response của API GET_SITES
interface SitesApiResponse {
  data: {
    page: number;
    totalPage: number;
    totalRecords: number;
    currentPageCount: number;
    listData: Site[];
  };
  success: boolean;
  message: string;
  totalCount: number;
}

export default function SiteManagement() {
  const [sites, setSites] = React.useState<Site[]>([]); // State để lưu danh sách site
  const [currentPage, setCurrentPage] = React.useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = React.useState(1); // Tổng số trang
  const [isLoading, setIsLoading] = React.useState(false); // Trạng thái loading
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all"); // State để lọc theo siteCategoryId
  const [selectedSiteId, setSelectedSiteId] = React.useState<number | null>(
    null
  ); // State để lưu siteId khi bấm "Xem chi tiết"
  const [activeTab, setActiveTab] = React.useState<"KHẢ DỤNG" | "ĐÃ CHỐT">(
    "KHẢ DỤNG"
  ); // State cho tab
  const itemsPerPage = 10; // Số lượng site trên mỗi trang

  // Danh sách các category để hiển thị trong dropdown
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "1", name: "Mặt bằng nội khu" }, // siteCategoryId: 1
    { id: "2", name: "Mặt bằng độc lập" }, // siteCategoryId: 2
  ];

  // Gọi API fetchSites khi currentPage, selectedCategory hoặc activeTab thay đổi
  React.useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true);
      try {
        const response: SitesApiResponse = await managerService.fetchSites(
          currentPage,
          itemsPerPage,
          activeTab === "KHẢ DỤNG" ? 1 : 10 // Dùng status theo tab
        );
        if (response.success) {
          // Lọc site theo selectedCategory
          const filteredSites =
            selectedCategory === "all"
              ? response.data.listData
              : response.data.listData.filter(
                  (site) => site.siteCategoryId.toString() === selectedCategory
                );
          setSites(filteredSites);
          setTotalPages(response.data.totalPage || 1); // Lấy totalPage từ API response
        } else {
          setSites([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error loading sites:", error);
        setSites([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    const searchParams = new URLSearchParams(window.location.search);
    const siteIdParam = searchParams.get("siteId");

    if (!siteIdParam) {
      // Nếu không có siteId trong URL, load bình thường
      loadSites();
    }
  }, [currentPage, selectedCategory, activeTab]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "KHẢ DỤNG" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("KHẢ DỤNG");
              setCurrentPage(1); // Reset về trang 1 khi đổi tab
            }}
          >
            KHẢ DỤNG
          </Button>
          <Button
            variant={activeTab === "ĐÃ CHỐT" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("ĐÃ CHỐT");
              setCurrentPage(1); // Reset về trang 1 khi đổi tab
            }}
          >
            ĐÃ CHỐT
          </Button>
        </div>
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
          }}
        >
          <SelectTrigger className="w-[180px] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Lọc theo loại mặt bằng" />
          </SelectTrigger>
          <SelectContent className="border border-gray-300 rounded-md shadow-sm">
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
                className="hover:bg-gray-100"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : sites.length === 0 ? (
        <div className="text-center py-4">Không có dữ liệu để hiển thị</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[8%]">ID</TableHead>
                <TableHead className="w-[30%]">Địa chỉ</TableHead>
                <TableHead className="w-[15%]">Quận</TableHead>
                <TableHead className="w-[10%]">Diện tích</TableHead>
                <TableHead className="w-[15%]">Loại</TableHead>
                <TableHead className="w-[8%]">Xem chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.id}</TableCell>
                  <TableCell>{`${site.address}${
                    site.areaName ? `, ${site.areaName}` : ""
                  }`}</TableCell>
                  <TableCell>{site.districtName || "Không xác định"}</TableCell>
                  <TableCell>{`${site.size}m²`}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        site.siteCategoryId === 1
                          ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 w-32 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
                          : "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 w-32 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
                      }
                    >
                      {site.siteCategoryName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="text-blue-500 p-0 underline hover:text-blue-700"
                      onClick={() => setSelectedSiteId(site.id)} // Mở modal khi bấm "Xem chi tiết"
                    >
                      Xem chi tiết
                    </Button>
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

      {/* Hiển thị modal SiteDetail khi có siteId được chọn */}
      {selectedSiteId && (
        <SiteDetail
          siteId={selectedSiteId}
          onClose={() => setSelectedSiteId(null)} // Đóng modal
        />
      )}
    </div>
  );
}
