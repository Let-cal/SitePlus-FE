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
import { Button } from "@/components/ui/button";

interface Site {
  id: string;
  address: string; // Địa chỉ (tên đường và quận ở TP.HCM)
  area: string; // Diện tích, ví dụ: "50m²"
  type: "Mặt bằng nội khu" | "Mặt bằng độc lập"; // Thay inBuilding thành type
  status: "Đã thuê" | "Còn trống" | "Sắp trống";
}

const sampleSites: Site[] = [
  { id: "MB001", address: "123 Lê Lợi, Quận 1", area: "80m²", type: "Mặt bằng nội khu", status: "Đã thuê" },
  { id: "MB002", address: "45 Nguyễn Huệ, Quận 7", area: "60m²", type: "Mặt bằng độc lập", status: "Còn trống" },
  { id: "MB003", address: "78 Pasteur, Quận 3", area: "100m²", type: "Mặt bằng nội khu", status: "Sắp trống" },
  { id: "MB004", address: "90 Bùi Thị Xuân, Quận 10", area: "70m²", type: "Mặt bằng độc lập", status: "Đã thuê" },
  { id: "MB005", address: "22 Lê Văn Sỹ, Quận Phú Nhuận", area: "50m²", type: "Mặt bằng nội khu", status: "Còn trống" },
  { id: "MB006", address: "15 Điện Biên Phủ, Quận Bình Thạnh", area: "90m²", type: "Mặt bằng nội khu", status: "Sắp trống" },
  { id: "MB007", address: "33 Phạm Văn Đồng, Quận Gò Vấp", area: "65m²", type: "Mặt bằng độc lập", status: "Đã thuê" },
  { id: "MB008", address: "67 Võ Văn Kiệt, Quận 5", area: "85m²", type: "Mặt bằng nội khu", status: "Còn trống" },
  { id: "MB009", address: "88 Tô Hiến Thành, Quận 10", area: "75m²", type: "Mặt bằng độc lập", status: "Sắp trống" },
  { id: "MB010", address: "12 Nguyễn Trãi, Quận 5", area: "95m²", type: "Mặt bằng nội khu", status: "Đã thuê" },
];

type FilterStatus = "all" | "Đã thuê" | "Còn trống" | "Sắp trống";

const filterLabels = {
  all: "Tất cả",
  "Đã thuê": "Đã thuê",
  "Còn trống": "Còn trống",
  "Sắp trống": "Sắp trống",
};

export default function SiteManagement() {
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const getFilteredData = () => {
    let data = sampleSites;
    if (filterStatus !== "all") {
      data = sampleSites.filter(item => item.status === filterStatus);
    }
    return data;
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl text-gray-800"></div>
        <Select
          value={filterStatus}
          onValueChange={(value: FilterStatus) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[180px] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent className="border border-gray-300 rounded-md shadow-sm">
            {Object.entries(filterLabels).map(([key, label]) => (
              <SelectItem key={key} value={key} className="hover:bg-gray-100">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">Mã mặt bằng</TableHead>
            <TableHead className="w-[20%]">Địa chỉ</TableHead>
            <TableHead className="w-[15%]">Diện tích</TableHead>
            <TableHead className="w-[15%]">Loại</TableHead> {/* Đổi tên cột */}
            <TableHead className="w-[12%]">Xem chi tiết</TableHead>
            <TableHead className="w-[10%]">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((site) => (
            <TableRow key={site.id}>
              <TableCell>{site.id}</TableCell>
              <TableCell>{site.address}</TableCell>
              <TableCell>{site.area}</TableCell>
              <TableCell>{site.type}</TableCell> {/* Hiển thị dữ liệu mới */}
              <TableCell>
                <Button variant="link" className="text-blue-500 p-0 underline hover:text-blue-700">
                  Xem chi tiết
                </Button>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    site.status === "Đã thuê"
                      ? "bg-rose-500 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
                      : site.status === "Còn trống"
                      ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
                      : "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap"
                  }
                >
                  {site.status}
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
    </div>
  );
}