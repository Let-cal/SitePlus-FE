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
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
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
  status: "ready" | "sent";
  sentDate?: string;
  managerStatus?: "pending" | "accepted" | "rejected";
  managerComment?: string;
}

const sampleData: Survey[] = [
  { 
    id: "AB130", 
    type: "Tìm mặt bằng", 
    client: "Công ty HIJ", 
    staff: "Lê Văn K", 
    status: "ready"
  },
  { 
    id: "CD131", 
    type: "Đánh giá", 
    client: "Công ty KLM", 
    staff: "Trần Thị L", 
    status: "ready"
  },
  { 
    id: "AB132", 
    type: "Tìm mặt bằng", 
    client: "Công ty NOP", 
    staff: "Phạm Văn M", 
    status: "sent",
    sentDate: "2024-01-05",
    managerStatus: "pending"
  },
  { 
    id: "CD133", 
    type: "Đánh giá", 
    client: "Công ty QRS", 
    staff: "Nguyễn Văn N", 
    status: "sent",
    sentDate: "2024-01-04",
    managerStatus: "accepted"
  },
  { 
    id: "AB134", 
    type: "Tìm mặt bằng", 
    client: "Công ty TUV", 
    staff: "Trần Thị O", 
    status: "sent",
    sentDate: "2024-01-03",
    managerStatus: "rejected",
    managerComment: "Cần bổ sung thêm thông tin"
  },
  { 
    id: "CD193", 
    type: "Đánh giá", 
    client: "Công ty QRS", 
    staff: "Nguyễn Văn N", 
    status: "sent",
    sentDate: "2024-01-04",
    managerStatus: "rejected",
    managerComment: "Nội dung khảo sát còn quá nhiều thiếu xót"
  },
];

type TabType = "ready" | "sent";
type ManagerStatus = "all" | "pending" | "accepted" | "rejected";

export default function SendToManager() {
  const [activeTab, setActiveTab] = React.useState<TabType>("ready");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedStatus, setSelectedStatus] = React.useState<ManagerStatus>("all");
  const itemsPerPage = 5;

  const getFilteredData = () => {
    let filtered = sampleData.filter(item => item.status === activeTab);
    
    if (activeTab === "sent" && selectedStatus !== "all") {
      filtered = filtered.filter(item => item.managerStatus === selectedStatus);
    }
    
    return filtered;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSendToManager = (id: string) => {
    console.log(`Sending survey ${id} to manager`);
  };

  const StatusBadge = ({ status }: { status?: "pending" | "accepted" | "rejected" }) => {
    if (!status) return null;

    const statusStyles = {
      pending: "bg-yellow-500 hover:bg-yellow-600",
      accepted: "bg-emerald-500 hover:bg-emerald-600",
      rejected: "bg-rose-500 hover:bg-rose-600"
    };

    const statusLabels = {
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected"
    };

    return (
      <div className="space-y-1">
        <Badge className={`${statusStyles[status]} justify-center w-24 px-2 py-1.5`}>
          {statusLabels[status]}
        </Badge>
      </div>
    );
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedStatus]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "ready" ? "default" : "outline"}
            onClick={() => setActiveTab("ready")}
          >
            Ready to Send
          </Button>
          <Button
            variant={activeTab === "sent" ? "default" : "outline"}
            onClick={() => setActiveTab("sent")}
          >
            Sent
          </Button>
        </div>
        
        {activeTab === "sent" && (
          <Select
            value={selectedStatus}
            onValueChange={(value: ManagerStatus) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Request ID</TableHead>
            <TableHead className="w-[15%]">Type</TableHead>
            <TableHead className="w-[20%]">Client</TableHead>
            <TableHead className="w-[20%]">Staff</TableHead>
            <TableHead className="w-[18%]">View detail</TableHead>
            {activeTab === "sent" ? (
              <TableHead className="w-[15%]">Status</TableHead>
            ) : (
              <TableHead className="w-[15%]">Action</TableHead>
            )}
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
                {activeTab === "ready" ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleSendToManager(survey.id)}
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                ) : (
                  <div>
                    <StatusBadge status={survey.managerStatus} />
                    {survey.managerComment && (
                      <p className="text-sm text-gray-500 mt-1">
                        {survey.managerComment}
                      </p>
                    )}
                  </div>
                )}
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