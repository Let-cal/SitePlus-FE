import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Check, XCircle, Plus } from "lucide-react";
import managerService from "../../../../services/manager/manager.service";
import areaManagerService from "../../../../services/area-manager/area-manager.service";
import toast from "react-hot-toast";
import SiteDetail from "../../../manager/components/site-manager/SiteDetail";
import AssignTaskSheet from "./AssignTaskSheet"; // Import AssignTaskSheet

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

export default function SiteCheck() {
  const [sites, setSites] = React.useState<Site[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [activeTab, setActiveTab] = React.useState<"status9" | "status8">("status9");
  const [selectedSiteId, setSelectedSiteId] = React.useState<number | null>(null);
  const [isAssignTaskOpen, setIsAssignTaskOpen] = React.useState(false); // State để mở AssignTaskSheet
  const [assignSiteId, setAssignSiteId] = React.useState<number | null>(null); // State để lưu siteId khi giao việc
  const itemsPerPage = 10;

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "1", name: "Mặt bằng nội khu" },
    { id: "2", name: "Mặt bằng độc lập" },
  ];

  const handleAccept = async (siteId: number) => {
    try {
      const success = await areaManagerService.updateSiteStatus({
        siteId,
        status: 8,
      });

      if (success) {
        const status = activeTab === "status9" ? 9 : 8;
        const response: SitesApiResponse = await managerService.fetchSites(currentPage, itemsPerPage, status);
        if (response.success) {
          const filteredSites =
            selectedCategory === "all"
              ? response.data.listData
              : response.data.listData.filter(
                  (site) => site.siteCategoryId.toString() === selectedCategory
                );
          setSites(filteredSites);
          setTotalPages(response.data.totalPage || 1);
        }
      } else {
        toast.error("Không thể cập nhật trạng thái Site", { position: "top-right", duration: 3000 });
      }
    } catch (error) {
      console.error("Lỗi khi chấp nhận site:", error);
      toast.error("Lỗi khi cập nhật trạng thái Site", { position: "top-right", duration: 3000 });
    }
  };

  const handleReject = async (siteId: number) => {
    try {
      const success = await areaManagerService.updateSiteStatus({
        siteId,
        status: 4,
      });

      if (success) {
        const status = activeTab === "status9" ? 9 : 8;
        const response: SitesApiResponse = await managerService.fetchSites(currentPage, itemsPerPage, status);
        if (response.success) {
          const filteredSites =
            selectedCategory === "all"
              ? response.data.listData
              : response.data.listData.filter(
                  (site) => site.siteCategoryId.toString() === selectedCategory
                );
          setSites(filteredSites);
          setTotalPages(response.data.totalPage || 1);
        }
      } else {
        toast.error("Không thể cập nhật trạng thái Site", { position: "top-right", duration: 3000 });
      }
    } catch (error) {
      console.error("Lỗi khi từ chối site:", error);
      toast.error("Lỗi khi cập nhật trạng thái Site", { position: "top-right", duration: 3000 });
    }
  };

  const handleAssignTask = (siteId: number) => {
    setAssignSiteId(siteId); // Lưu siteId để truyền vào AssignTaskSheet
    setIsAssignTaskOpen(true); // Mở dialog AssignTaskSheet
  };

  const handleCloseAssignTask = () => {
    setIsAssignTaskOpen(false); // Đóng dialog
    setAssignSiteId(null); // Reset siteId
  };

  const handleSubmitTask = async (newTask: {
    name: string;
    priority: string;
    district: string;
    ward: string;
    deadline: string;
    staff: string;
    description: string;
  }) => {
    // Sau khi giao việc thành công, tải lại danh sách site
    const status = activeTab === "status9" ? 9 : 8;
    const response: SitesApiResponse = await managerService.fetchSites(currentPage, itemsPerPage, status);
    if (response.success) {
      const filteredSites =
        selectedCategory === "all"
          ? response.data.listData
          : response.data.listData.filter(
              (site) => site.siteCategoryId.toString() === selectedCategory
            );
      setSites(filteredSites);
      setTotalPages(response.data.totalPage || 1);
    }
  };

  const handleViewDetail = (siteId: number) => {
    setSelectedSiteId(siteId);
  };

  const handleCloseDetail = () => {
    setSelectedSiteId(null);
  };

  React.useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true);
      try {
        const status = activeTab === "status9" ? 9 : 8;
        const response: SitesApiResponse = await managerService.fetchSites(currentPage, itemsPerPage, status);
        console.log("Sites loaded:", response);
        if (response.success) {
          const filteredSites =
            selectedCategory === "all"
              ? response.data.listData
              : response.data.listData.filter(
                  (site) => site.siteCategoryId.toString() === selectedCategory
                );
          setSites(filteredSites);
          setTotalPages(response.data.totalPage || 1);
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
    loadSites();
  }, [currentPage, selectedCategory, activeTab]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "status9" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("status9");
              setCurrentPage(1);
            }}
          >
            CẦN XÁC MINH
          </Button>
          <Button
            variant={activeTab === "status8" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("status8");
              setCurrentPage(1);
            }}
          >
            ĐÃ CHẤP NHẬN
          </Button>
        </div>

        <div className="flex justify-end">
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Lọc theo loại mặt bằng" />
            </SelectTrigger>
            <SelectContent className="border border-gray-300 rounded-md shadow-sm">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="hover:bg-gray-100">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                <TableHead className="w-[10%]">ID</TableHead>
                <TableHead className="w-[25%]">Địa chỉ</TableHead>
                <TableHead className="w-[15%]">Quận</TableHead>
                <TableHead className="w-[10%]">Diện tích</TableHead>
                <TableHead className="w-[15%]">Loại</TableHead>
                <TableHead className="w-[15%]">Xem chi tiết</TableHead>
                <TableHead className="w-[10%]">
                  {activeTab === "status9" ? "Hành động" : "Giao việc"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.id}</TableCell>
                  <TableCell>{`${site.address}${site.areaName ? `, ${site.areaName}` : ""}`}</TableCell>
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
                      onClick={() => handleViewDetail(site.id)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                  <TableCell>
                    {activeTab === "status9" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border border-gray-300 rounded-md shadow-sm">
                          <DropdownMenuItem
                            onClick={() => handleAccept(site.id)}
                            className="hover:bg-gray-100 flex items-center"
                          >
                            <Check className="h-4 w-4 mr-2" /> Chấp nhận
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleReject(site.id)}
                            className="hover:bg-gray-100 flex items-center"
                          >
                            <XCircle className="h-4 w-4 mr-2" /> Từ chối
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="default"
                        className="bg-black text-white hover:bg-gray-800 w-[120px] px-2 h-7 text-sm"
                        onClick={() => handleAssignTask(site.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Giao việc
                      </Button>
                    )}
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
        </>
      )}

      {/* Hiển thị SiteDetail khi có siteId được chọn */}
      {selectedSiteId !== null && (
        <SiteDetail siteId={selectedSiteId} onClose={handleCloseDetail} />
      )}

      {/* Hiển thị AssignTaskSheet khi nhấn nút Giao việc */}
      {isAssignTaskOpen && assignSiteId !== null && (
        <AssignTaskSheet
          isOpen={isAssignTaskOpen}
          onClose={handleCloseAssignTask}
          siteId={assignSiteId}
          onSubmit={handleSubmitTask}
        />
      )}
    </div>
  );
}