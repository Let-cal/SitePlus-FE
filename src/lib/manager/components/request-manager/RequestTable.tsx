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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Request {
  id: string;
  type: string;
  date: string;
  customer: string;
  status?: "accepted" | "rejected";
}

const sampleData: Request[] = [
  { id: "AB123", type: "Tìm mặt bằng", date: "01/02/2025", customer: "Nguyễn Văn A" },
  { id: "CD123", type: "Đánh giá", date: "31/12/2024", customer: "Nguyễn Thị B" },
  { id: "AB535", type: "Tìm mặt bằng", date: "25/12/2024", customer: "Trần Thanh C" },
  { id: "AB610", type: "Tìm mặt bằng", date: "10/01/2025", customer: "Lê Minh D" },
  { id: "CD892", type: "Đánh giá", date: "09/02/2025", customer: "Hồ Ngọc E" },
];

const processedData: Request[] = [
  { id: "AB129", type: "Tìm mặt bằng", date: "01/01/2025", customer: "Phạm Văn F", status: "rejected" },
  { id: "CD125", type: "Đánh giá", date: "28/12/2024", customer: "Trần Thị G", status: "accepted" },
  { id: "AB126", type: "Tìm mặt bằng", date: "15/01/2025", customer: "Lê Văn H", status: "accepted" },
  { id: "CD127", type: "Đánh giá", date: "05/01/2025", customer: "Nguyễn Thị I", status: "rejected" },
];

type FilterStatus = "all" | "accepted" | "rejected";

const filterLabels = {
  all: "All",
  accepted: "Accepted",
  rejected: "Rejected",
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

  // Reset to page 1 when filter changes
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
                ? "bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 w-24 justify-center px-2 py-1.5"
                : "bg-rose-500 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-700 w-24 justify-center px-2 py-1.5"
            }
          >
            {request.status === "accepted" ? "Accepted" : "Rejected"}
          </Badge>
        </div>
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
          <DropdownMenuItem onClick={() => handleAction(request.id, "accepted")}>
            Accept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction(request.id, "rejected")}>
            Reject
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
            New requests
          </Button>
          <Button
            variant={activeTab === "processed" ? "default" : "outline"}
            onClick={() => setActiveTab("processed")}
          >
            Handled
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
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("accepted")}>
                Accepted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Request ID</TableHead>
            <TableHead className="w-[20%]">Type</TableHead>
            <TableHead className="w-[15%]">Deadline</TableHead>
            <TableHead className="w-[20%]">Client</TableHead>
            <TableHead className="w-[15%]">View detail</TableHead>
            <TableHead className="w-[10%]">{activeTab === "new" ? "Action" : "Status"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.type}</TableCell>
              <TableCell>{request.date}</TableCell>
              <TableCell>{request.customer}</TableCell>
              <TableCell>
                <Button variant="link" className="text-blue-500 p-0">
                  View detail
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