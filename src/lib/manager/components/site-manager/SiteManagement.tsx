import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

// Interface cho site
interface Site {
  id: number;
  address: string;
  areaName?: string;
  districtName?: string;
  size: number;
  status: number;
  siteCategoryId: number;
  siteCategoryName: string;
  taskId?: number;
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
  const [allSites, setAllSites] = React.useState<Site[]>([]);
  const [filteredSites, setFilteredSites] = React.useState<Site[]>([]);
  const [displayedSites, setDisplayedSites] = React.useState<Site[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedSiteId, setSelectedSiteId] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState<"KHẢ DỤNG" | "ĐÃ CHỐT">("KHẢ DỤNG");
  const [searchSiteId, setSearchSiteId] = React.useState<string>("");
  const itemsPerPage = 10;
  const pageSize = 100;

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "1", name: "Mặt bằng nội khu" },
    { id: "2", name: "Mặt bằng độc lập" },
  ];

  // Gọi API để lấy toàn bộ dữ liệu
  React.useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true);
      try {
        const siteIdToSearch = searchSiteId.trim() !== "" ? parseInt(searchSiteId) : null;
        let allData: Site[] = [];

        // Gọi API lần đầu để lấy tổng số trang và dữ liệu trang 1
        const firstResponse: SitesApiResponse = await managerService.fetchSites(
          1,
          pageSize,
          activeTab === "KHẢ DỤNG" ? 1 : 10,
          siteIdToSearch
        );

        if (firstResponse.success) {
          allData = [...firstResponse.data.listData];
          const totalPagesFromApi = firstResponse.data.totalPage;

          // Nếu có nhiều hơn 1 trang, gọi API cho các trang còn lại
          if (totalPagesFromApi > 1) {
            const pagePromises = Array.from(
              { length: totalPagesFromApi - 1 },
              (_, i) => i + 2
            ).map((pageNum) =>
              managerService.fetchSites(
                pageNum,
                pageSize,
                activeTab === "KHẢ DỤNG" ? 1 : 10,
                siteIdToSearch
              )
            );

            const additionalResponses = await Promise.all(pagePromises);
            additionalResponses.forEach((response) => {
              if (response.success) {
                allData = allData.concat(response.data.listData);
              }
            });
          }

          setAllSites(allData);
        } else {
          setAllSites([]);
        }
      } catch (error) {
        console.error("Error loading sites:", error);
        setAllSites([]);
      } finally {
        setIsLoading(false);
      }
    };

    const searchParams = new URLSearchParams(window.location.search);
    const siteIdParam = searchParams.get("siteId");

    if (!siteIdParam) {
      loadSites();
    }
  }, [activeTab, searchSiteId]);

  // Lọc dữ liệu khi selectedCategory hoặc allSites thay đổi
  React.useEffect(() => {
    const filtered = selectedCategory === "all"
      ? allSites
      : allSites.filter((site) => site.siteCategoryId.toString() === selectedCategory);
    setFilteredSites(filtered);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  }, [selectedCategory, allSites]);

  // Phân trang dữ liệu đã lọc
  React.useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSites = filteredSites.slice(startIndex, endIndex);
    setDisplayedSites(paginatedSites);
    setTotalPages(Math.ceil(filteredSites.length / itemsPerPage) || 1);
  }, [filteredSites, currentPage]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "KHẢ DỤNG" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("KHẢ DỤNG");
              setCurrentPage(1);
            }}
          >
            KHẢ DỤNG
          </Button>
          <Button
            variant={activeTab === "ĐÃ CHỐT" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("ĐÃ CHỐT");
              setCurrentPage(1);
            }}
          >
            ĐÃ CHỐT
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative w-[350px]">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Tìm kiếm theo Site ID"
              value={searchSiteId}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d+$/.test(value)) {
                  setSearchSiteId(value);
                  setCurrentPage(1);
                }
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
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
      </div>

      {isLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : displayedSites.length === 0 ? (
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
                <TableHead className="w-[10%]">Task ID</TableHead>
                <TableHead className="w-[15%]">Loại</TableHead>
                <TableHead className="w-[8%]">Xem chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedSites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.id}</TableCell>
                  <TableCell>{`${site.address}${
                    site.areaName ? `, ${site.areaName}` : ""
                  }`}</TableCell>
                  <TableCell>{site.districtName || "Không xác định"}</TableCell>
                  <TableCell>{`${site.size}m²`}</TableCell>
                  <TableCell>{site.taskId ?? "N/A"}</TableCell>
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
                      onClick={() => setSelectedSiteId(site.id)}
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

      {selectedSiteId && (
        <SiteDetail
          siteId={selectedSiteId}
          onClose={() => setSelectedSiteId(null)}
        />
      )}
    </div>
  );
}