import * as React from "react";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
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
import CreateTaskSheet from "./CreateTaskSheet";

interface Task {
  id: string;
  location: string; // Giữ location cho hiển thị, nhưng sẽ map từ district và address
  deadline: string;
  staff?: string;
  status: 'assigned' | 'completed';
  // Không thêm các trường khác để giữ bảng đơn giản
}

const initialTasks: Task[] = [
  { id: "AB123", location: "Quận 1", deadline: "01/03/2025", staff: "Nguyễn Văn A", status: "assigned" },
  { id: "CD123", location: "Quận 3", deadline: "31/12/2024", staff: "Trần Thị B", status: "completed" },
  { id: "AB535", location: "Quận 7", deadline: "25/12/2024", staff: "Lê Minh C", status: "assigned" },
  { id: "XY789", location: "Bình Thạnh", deadline: "15/01/2025", staff: "Hồ Ngọc D", status: "completed" },
  { id: "CD892", location: "Phú Nhuận", deadline: "09/02/2025", staff: "Đỗ Thanh E", status: "assigned" },
];

type FilterStatus = "all" | "assigned" | "completed";

const filterLabels = {
  all: "Tất cả",
  assigned: "Đã giao",
  completed: "Hoàn thành",
};

const AssignToStaff = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const getFilteredData = () => {
    let data = tasks;
    if (filterStatus !== "all") {
      data = tasks.filter(task => task.status === filterStatus);
    }
    return data;
  };

  const handleCreateTask = (newTask: {
    id: string;
    name: string;
    priority: string;
    district: string;
    address: string;
    deadline: string;
    staff: string;
    description: string;
  }) => {
    // Map district và address thành location cho hiển thị
    const location = `${newTask.district}, ${newTask.address || ''}`.trim();
    const taskWithStatus: Task = { 
      id: newTask.id, 
      location, 
      deadline: newTask.deadline, 
      staff: newTask.staff, 
      status: "assigned" 
    };
    setTasks(prevTasks => [...prevTasks, taskWithStatus]);
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">
              Quản lý công việc
            </CardTitle>
            <Button onClick={() => setIsSheetOpen(true)}>
              <Plus size={16} className="mr-1" />
              Tạo công việc mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
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
                <TableHead className="w-[15%]">Mã công việc</TableHead>
                <TableHead className="w-[25%]">Địa điểm</TableHead>
                <TableHead className="w-[15%]">Thời hạn</TableHead>
                <TableHead className="w-[20%]">Nhân viên</TableHead>
                <TableHead className="w-[15%]">Xem chi tiết</TableHead>
                <TableHead className="w-[10%] text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.location}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.staff || "Chưa giao"}</TableCell>
                  <TableCell>
                    <Button variant="link" className="text-blue-500 p-0 underline hover:text-blue-700">
                      Xem chi tiết
                    </Button>
                  </TableCell>
                  <TableCell className="text-center p-1 min-w-24">
                    <Badge
                      variant="outline"
                      className={`inline-flex w-full text-xs whitespace-nowrap px-1 justify-center ${
                        task.status === 'completed'
                          ? 'bg-green-500 hover:bg-green-500'
                          : 'bg-yellow-500 hover:bg-yellow-500'
                      } text-white`}
                    >
                      {task.status === 'completed' ? 'Hoàn thành' : 'Đã giao'}
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <CreateTaskSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
};

export default AssignToStaff;