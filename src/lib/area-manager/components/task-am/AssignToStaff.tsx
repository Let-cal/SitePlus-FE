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
import areaManagerService from "../../../../services/area-manager/area-manager.service";
import { Loader2 } from "lucide-react"; // Import for loading indicator

interface Task {
  id: number;
  name: string;
  description: string;
  status: number;
  statusName: string;
  priority: number;
  priorityName: string;
  staffId: number;
  staffName: string;
  location: {
    areaId: number;
    areaName: string;
    siteId: number;
    siteAddress?: string;
    buildingName?: string;
  };
  brandInfo: {
    requestId: number;
    brandName?: string;
  };
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

type FilterStatus = "all" | "1" | "2" | "3";
type FilterType = "all" | "normal" | "request";
type FilterPriority = "all" | "1" | "2" | "3";

const filterLabels = {
  all: "Tất cả (Trạng thái)",
  1: "Đã giao",
  2: "Tiến hành",
  3: "Hoàn thành",
};

const typeLabels = {
  all: "Tất cả (Loại)",
  normal: "Thông thường",
  request: "Theo yêu cầu",
};

const priorityLabels = {
  all: "Tất cả (Độ ưu tiên)",
  1: "Thấp",
  2: "Trung bình",
  3: "Cao",
};

const statusColors = {
  1: "bg-blue-500 hover:bg-blue-500",
  2: "bg-yellow-500 hover:bg-yellow-500",
  3: "bg-green-500 hover:bg-green-500",
};

const priorityTextColors = {
  1: "text-white-600",
  2: "text-white-600", 
  3: "text-white-600",
};

const getTaskType = (task: Task) => {
  return task.brandInfo && task.brandInfo.requestId > 0 ? "Theo yêu cầu" : "Thông thường";
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error("Date formatting error:", e);
    return dateString;
  }
};

const AssignToStaff = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  // Load tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const tasksData = await areaManagerService.fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterType, filterPriority]);

  const getFilteredData = () => {
    let data = tasks;
    
    // Lọc theo trạng thái
    if (filterStatus !== "all") {
      data = data.filter(task => task.status.toString() === filterStatus);
    }
    
    // Lọc theo loại
    if (filterType !== "all") {
      data = data.filter(task => {
        const type = task.brandInfo && task.brandInfo.requestId > 0 ? "request" : "normal";
        return type === filterType;
      });
    }
    
    // Lọc theo độ ưu tiên
    if (filterPriority !== "all") {
      data = data.filter(task => task.priority.toString() === filterPriority);
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
    // Implementation would update after API call
    // Reload tasks after creation
    areaManagerService.fetchTasks().then(tasksData => {
      setTasks(tasksData);
    });
    setIsSheetOpen(false);
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
          <div className="flex justify-end gap-3 mb-4 flex-wrap">
            <Select
              value={filterStatus}
              onValueChange={(value: FilterStatus) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-[180px] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent className="border border-gray-300 rounded-md shadow-sm">
                {Object.entries(filterLabels)
                  .sort(([keyA], [keyB]) => {
                    // Đưa "all" lên đầu tiên
                    if (keyA === "all") return -1;
                    if (keyB === "all") return 1;
                    return 0;
                  })
                  .map(([key, label]) => (
                    <SelectItem key={key} value={key} className="hover:bg-gray-100">
                      {label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            
            <Select
              value={filterType}
              onValueChange={(value: FilterType) => setFilterType(value)}
            >
              <SelectTrigger className="w-[180px] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent className="border border-gray-300 rounded-md shadow-sm">
                {Object.entries(typeLabels)
                  .sort(([keyA], [keyB]) => {
                    // Đưa "all" lên đầu tiên
                    if (keyA === "all") return -1;
                    if (keyB === "all") return 1;
                    return 0;
                  })
                  .map(([key, label]) => (
                    <SelectItem key={key} value={key} className="hover:bg-gray-100">
                      {label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            
            <Select
              value={filterPriority}
              onValueChange={(value: FilterPriority) => setFilterPriority(value)}
            >
              <SelectTrigger className="w-[180px] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Lọc theo độ ưu tiên" />
              </SelectTrigger>
              <SelectContent className="border border-gray-300 rounded-md shadow-sm">
                {Object.entries(priorityLabels)
                  .sort(([keyA], [keyB]) => {
                    // Đưa "all" lên đầu tiên
                    if (keyA === "all") return -1;
                    if (keyB === "all") return 1;
                    return 0;
                  })
                  .map(([key, label]) => (
                    <SelectItem key={key} value={key} className="hover:bg-gray-100">
                      {label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[8%]">Id</TableHead>
                    <TableHead className="w-[12%]">Loại</TableHead>
                    <TableHead className="w-[12%]">Thời hạn</TableHead>
                    <TableHead className="w-[15%]">Nhân viên</TableHead>
                    <TableHead className="w-[15%]">Độ ưu tiên</TableHead>
                    <TableHead className="w-[12%]">Xem chi tiết</TableHead>
                    <TableHead className="w-[10%] text-center">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.id}</TableCell>
                        <TableCell>{getTaskType(task)}</TableCell>
                        <TableCell>{formatDate(task.deadline)}</TableCell>
                        <TableCell>{task.staffName || "Chưa giao"}</TableCell>
                        <TableCell className={`font-medium ${priorityTextColors[task.priority] || 'text-gray-600'}`}>
                          {task.priorityName}
                        </TableCell>
                        <TableCell>
                          <Button variant="link" className="text-blue-500 p-0 underline hover:text-blue-700">
                            Xem chi tiết
                          </Button>
                        </TableCell>
                        <TableCell className="text-center p-1 min-w-24">
                          <Badge
                            variant="outline"
                            className={`inline-flex w-32 text-xs whitespace-nowrap px-1 justify-center ${statusColors[task.status] || 'bg-gray-500'
                              } text-white`}
                          >
                            {task.statusName}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredData.length > 0 && (
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
              )}
            </>
          )}
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