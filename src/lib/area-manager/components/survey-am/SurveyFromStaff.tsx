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

interface Survey {
  id: string;
  type: string;
  client: string;
  staff: string;
  status?: "accepted" | "rejected";
}

const sampleData: Survey[] = [
  { id: "AB123", type: "Tìm mặt bằng", client: "Công ty ABC", staff: "Nguyễn Văn A" },
  { id: "CD123", type: "Đánh giá", client: "Công ty XYZ", staff: "Nguyễn Thị B" },
  { id: "AB535", type: "Tìm mặt bằng", client: "Công ty DEF", staff: "Trần Thanh C" },
  { id: "AB610", type: "Tìm mặt bằng", client: "Công ty GHI", staff: "Lê Minh D" },
  { id: "CD892", type: "Đánh giá", client: "Công ty JKL", staff: "Hồ Ngọc E" },
];

const processedData: Survey[] = [
  { id: "AB129", type: "Tìm mặt bằng", client: "Công ty MNO", staff: "Phạm Văn F", status: "rejected" },
  { id: "CD125", type: "Đánh giá", client: "Công ty PQR", staff: "Trần Thị G", status: "accepted" },
  { id: "AB126", type: "Tìm mặt bằng", client: "Công ty STU", staff: "Lê Văn H", status: "accepted" },
  { id: "CD127", type: "Đánh giá", client: "Công ty VWX", staff: "Nguyễn Thị I", status: "rejected" },
];

type FilterStatus = "all" | "accepted" | "rejected";

const filterLabels = {
  all: "All Status",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function SurveyFromStaff() {
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
            Acccepted
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction(survey.id, "rejected")}>
            Rejected
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
            <TableHead className="w-[15%]">Request ID</TableHead>
            <TableHead className="w-[15%]">Type</TableHead>
            <TableHead className="w-[23%]">Client</TableHead>
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
              <TableCell>{survey.client}</TableCell>
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