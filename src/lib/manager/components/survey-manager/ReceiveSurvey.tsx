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
import { ChevronDown} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Survey {
  id: string;
  type: string;
  area: string;
  staff: string;
  status?: "accepted" | "rejected";
}

const sampleData: Survey[] = [
  { id: "AB123", type: "Tìm mặt bằng", area: "Trần Văn C", staff: "Nguyễn Văn A" },
  { id: "CD123", type: "Đánh giá", area: "Lê Minh H", staff: "Nguyễn Thị B" },
  { id: "AB535", type: "Tìm mặt bằng", area: "Nguyễn Quốc K", staff: "Trần Thanh C" },
  { id: "AB610", type: "Tìm mặt bằng", area: "Lý Minh D", staff: "Lê Minh D" },
  { id: "CD892", type: "Đánh giá", area: "Đỗ Hoàng P", staff: "Hồ Ngọc E" },
];

const processedData: Survey[] = [
  { id: "AB129", type: "Tìm mặt bằng", area: "Trần Văn C", staff: "Phạm Văn F", status: "rejected" },
  { id: "CD125", type: "Đánh giá", area: "Đỗ Minh B", staff: "Trần Thị G", status: "accepted" },
  { id: "AB126", type: "Tìm mặt bằng", area: "Hoàng Ngọc D", staff: "Lê Văn H", status: "accepted" },
  { id: "CD127", type: "Đánh giá", area: "Nguyễn Khanh T", staff: "Nguyễn Thị I", status: "rejected" },
];

type FilterStatus = "all" | "accepted" | "rejected";

const filterLabels = {
  all: "All",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function ReceiveSurvey() {
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
    // Add your logic here
    console.log(`Survey ${id} ${action}`);
  };

  const ActionButton = ({ survey }: { survey: Survey }) => {
    if (activeTab === "processed") {
      return (
        <Badge
          className={
            survey.status === "accepted"
              ? "bg-emerald-500 hover:bg-emerald-600 w-24 justify-center px-2 py-1.5"
              : "bg-rose-500 hover:bg-rose-600 w-24 justify-center px-2 py-1.5"
          }
        >
          {survey.status === "accepted" ? "Accepted" : "Rejected"}
        </Badge>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="w-[90px] px-2 h-7 text-sm">
            Handle
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleAction(survey.id, "accepted")}>
            Chấp nhận
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction(survey.id, "rejected")}>
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
            New survey
          </Button>
          <Button
            variant={activeTab === "processed" ? "default" : "outline"}
            onClick={() => setActiveTab("processed")}
          >
            Processed
          </Button>
        </div>

        {activeTab === "processed" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {/* <Filter className="mr-2 h-4 w-4" /> */}
                {filterLabels[filterStatus]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(filterLabels).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setFilterStatus(key as FilterStatus)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Request ID</TableHead>
            <TableHead className="w-[15%]">Type</TableHead>
            <TableHead className="w-[23%]">Area Manager</TableHead>
            <TableHead className="w-[23%]">Staff</TableHead>
            <TableHead className="w-[14%]">View detail</TableHead>
            <TableHead className="w-[10%]">{activeTab === "new" ? "Action" : "Status"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((survey) => (
            <TableRow key={survey.id}>
              <TableCell>{survey.id}</TableCell>
              <TableCell>{survey.type}</TableCell>
              <TableCell>{survey.area}</TableCell>
              <TableCell>{survey.staff}</TableCell>
              <TableCell>
                <Button variant="link" className="text-blue-500 p-0">
                  View detail
                </Button>
              </TableCell>
              <TableCell>
                <ActionButton survey={survey} />
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