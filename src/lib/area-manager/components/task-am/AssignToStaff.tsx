import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { SquarePen } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Task {
  id: string;
  type: string;
  date: string;
  customer: string;
  staff?: string;
  status?: 'done' | 'in-progress';
}

const pendingTasks: Task[] = [
  { id: "AB123", type: "Tìm mặt bằng", date: "01/02/2025", customer: "Nguyễn Văn A" },
  { id: "CD123", type: "Đánh giá", date: "31/12/2024", customer: "Nguyễn Thị B" },
  { id: "AB535", type: "Tìm mặt bằng", date: "25/12/2024", customer: "Trần Thanh C" },
  { id: "AB610", type: "Tìm mặt bằng", date: "10/01/2025", customer: "Lê Minh D" },
  { id: "CD892", type: "Đánh giá", date: "09/02/2025", customer: "Hồ Ngọc E" },
  { id: "CD893", type: "Đánh giá", date: "09/02/2025", customer: "Trần Ngọc K" },
  { id: "CD894", type: "Đánh giá", date: "09/02/2025", customer: "Đỗ Thanh E" },
];

const assignedTasks: Task[] = [
  { 
    id: "AB123", 
    type: "Tìm mặt bằng", 
    date: "01/02/2025", 
    customer: "Nguyễn Văn A",
    staff: "Trần Nhân Viên",
    status: 'done'
  },
  { 
    id: "CD123", 
    type: "Đánh giá", 
    date: "31/12/2024", 
    customer: "Nguyễn Thị B",
    staff: "Lê Nhân Viên",
    status: 'in-progress'
  },
  { 
    id: "AB535", 
    type: "Tìm mặt bằng", 
    date: "25/12/2024", 
    customer: "Trần Thanh C",
    staff: "Phạm Nhân Viên",
    status: 'in-progress'
  },
  { 
    id: "AB555", 
    type: "Tìm mặt bằng", 
    date: "25/12/2024", 
    customer: "Trần Thanh C",
    staff: "Phan Nhân Viên",
    status: 'done'
  },
];

type FilterStatus = "all" | "done" | "in-progress";

const filterLabels = {
  all: "All",
  done: "Done",
  "in-progress": "In Progress",
};

const StatusBadge = ({ status }: { status: Task['status'] }) => {
  const baseClasses = "w-24 justify-center";
  
  if (status === 'done') {
    return (
      <Badge className={`${baseClasses} bg-green-400 text-green-800 hover:bg-green-100`}>
        Done
      </Badge>
    );
  }
  return (
    <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-100`}>
      In Progress
    </Badge>
  );
};

export default function AssignTask() {
  const [activeTab, setActiveTab] = React.useState<"pending" | "assigned">("pending");
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const getFilteredData = () => {
    if (activeTab === "pending") return pendingTasks;
    
    let data = assignedTasks;
    if (filterStatus !== "all") {
      data = assignedTasks.filter(item => item.status === filterStatus);
    }
    return data;
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterStatus]);

  const data = getFilteredData();
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAssign = (taskId: string, staff: string) => {
    console.log(`Assigning task ${taskId} to ${staff}`);
  };

  const ActionButton = ({ task }: { task: Task }) => {
    if (activeTab === "pending") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-[92px] px-2 h-7 text-sm">
              Assign
              <SquarePen className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAssign(task.id, "Trần Nhân Viên")}>
              Trần Nhân Viên
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAssign(task.id, "Lê Nhân Viên")}>
              Lê Nhân Viên
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAssign(task.id, "Phạm Nhân Viên")}>
              Phạm Nhân Viên
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return null;
  };

  const TableContent = () => {
    if (activeTab === "pending") {
      return (
        <>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">Request ID</TableHead>
              <TableHead className="w-[15%]">Type</TableHead>
              <TableHead className="w-[14%]">Deadline</TableHead>
              <TableHead className="w-[23%]">Client</TableHead>
              <TableHead className="w-[23%]">View detail</TableHead>
              <TableHead className="w-[10%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.date}</TableCell>
                <TableCell>{task.customer}</TableCell>
                <TableCell>
                  <Button variant="link" className="text-blue-500 p-0 underline">
                    View detail
                  </Button>
                </TableCell>
                <TableCell>
                  <ActionButton task={task} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      );
    }

    return (
      <>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Request ID</TableHead>
            <TableHead className="w-[15%]">Type</TableHead>
            <TableHead className="w-[14%]">Deadline</TableHead>
            <TableHead className="w-[23%]">Staff</TableHead>
            <TableHead className="w-[23%]">Work Progress</TableHead>
            <TableHead className="w-[10%]">View detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.type}</TableCell>
              <TableCell>{task.date}</TableCell>
              <TableCell>{task.staff}</TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <Button variant="link" className="text-blue-500 p-0 underline">
                  View detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "pending" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("pending");
              setFilterStatus("all");
            }}
          >
            Wait for assign
          </Button>
          <Button
            variant={activeTab === "assigned" ? "default" : "outline"}
            onClick={() => setActiveTab("assigned")}
          >
            Assigned
          </Button>
        </div>

        {activeTab === "assigned" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
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
        <TableContent />
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