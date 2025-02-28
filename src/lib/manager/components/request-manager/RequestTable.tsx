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

interface Request {
  id: string;
  brand: string;
  email: string;
  location: string; // Vị trí khảo sát trong TP.HCM
  status?: "accepted" | "rejected";
}

const sampleData: Request[] = [
  { id: "AB123", brand: "Highlands Coffee", email: "contact@highlands.vn", location: "Quận 1, TP.HCM" },
  { id: "CD123", brand: "The Coffee House", email: "info@tch.vn", location: "Quận 7, TP.HCM" },
  { id: "AB535", brand: "Starbucks", email: "vn@starbucks.com", location: "Quận 3, TP.HCM" },
  { id: "AB610", brand: "Phúc Long", email: "support@phuclong.vn", location: "Quận 10, TP.HCM" },
  { id: "CD892", brand: "Trung Nguyên", email: "contact@trungnguyen.vn", location: "Bình Thạnh, TP.HCM" },
];

const processedData: Request[] = [
  { id: "AB129", brand: "Highlands Coffee", email: "contact@highlands.vn", location: "Quận 1, TP.HCM", status: "rejected" },
  { id: "CD125", brand: "The Coffee House", email: "info@tch.vn", location: "Quận 7, TP.HCM", status: "accepted" },
  { id: "AB126", brand: "Starbucks", email: "vn@starbucks.com", location: "Quận 3, TP.HCM", status: "accepted" },
  { id: "CD127", brand: "Phúc Long", email: "support@phuclong.vn", location: "Quận 10, TP.HCM", status: "rejected" },
];

type FilterStatus = "all" | "accepted" | "rejected";

const filterLabels = {
  all: "Tất cả",
  accepted: "Chấp nhận",
  rejected: "Từ chối",
};

export default function RequestTableWithTabs() {
  const [activeTab, setActiveTab] = React.useState<"new" | "processed">("new");
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const getFilteredData = () => {
    if (activeTab === "new") return sampleData;

    let data = processedData;
    if (filterStatus !== "all") {
      data = processedData.filter(item => item.status === filterStatus);
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

  const handleAction = (id: string, action: "accepted" | "rejected") => {
    // No logic needed for UI demonstration
  };

  const ActionButton = ({ request }: { request: Request }) => {
    if (activeTab === "processed") {
      return (
        <div className="flex gap-2">
          <Badge
            className={
              request.status === "accepted"
                ? "bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap" // Tăng chiều rộng lên w-24, thêm whitespace-nowrap để không xuống dòng
                : "bg-rose-500 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-700 w-24 h-6 justify-center px-2 py-0.5 text-xs whitespace-nowrap" // Tăng chiều rộng lên w-24, thêm whitespace-nowrap để không xuống dòng
            }
          >
            {request.status === "accepted" ? "Chấp nhận" : "Từ chối"}
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
            <TableHead className="w-[12%]">Mã yêu cầu</TableHead>
            <TableHead className="w-[20%]">Thương hiệu</TableHead>
            <TableHead className="w-[20%]">Email</TableHead>
            <TableHead className="w-[20%]">Vị trí khảo sát</TableHead>
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
              <TableCell>{request.location}</TableCell>
              <TableCell>
                <Button variant="link" className="text-blue-500 p-0 underline hover:text-blue-700">
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
    </div>
  );
}