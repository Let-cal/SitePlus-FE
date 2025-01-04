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
  areaManager?: string;
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
  { id: "AB123", type: "Tìm mặt bằng", date: "01/02/2025", customer: "Nguyễn Văn A", areaManager: "Trần Quản Lý" },
  { id: "CD123", type: "Đánh giá", date: "31/12/2024", customer: "Nguyễn Thị B", areaManager: "Lê Quản Lý" },
  { id: "AB535", type: "Tìm mặt bằng", date: "25/12/2024", customer: "Trần Thanh C", areaManager: "Phạm Quản Lý" },
];

export default function AssignTask() {
  const [activeTab, setActiveTab] = React.useState<"pending" | "assigned">("pending");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const getData = () => {
    return activeTab === "pending" ? pendingTasks : assignedTasks;
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const data = getData();
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAssign = (taskId: string, manager: string) => {
    console.log(`Assigning task ${taskId} to ${manager}`);
  };

  const ActionButton = ({ task }: { task: Task }) => {
    if (activeTab === "assigned") {
      return <span>{task.areaManager}</span>;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="w-[92px] px-2 h-7 text-sm">
            Giao việc
            <SquarePen className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleAssign(task.id, "Trần Quản Lý")}>
            Trần Quản Lý
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAssign(task.id, "Lê Quản Lý")}>
            Lê Quản Lý
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAssign(task.id, "Phạm Quản Lý")}>
            Phạm Quản Lý
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
            <TableHead className="w-[23%]">Client</TableHead>
            <TableHead className="w-[23%]">Area manager</TableHead>
            <TableHead className="w-[10%]">View detail</TableHead>
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
                <ActionButton task={task} />
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
      <div className="flex gap-4">
        <Button
          variant={activeTab === "pending" ? "default" : "outline"}
          onClick={() => setActiveTab("pending")}
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