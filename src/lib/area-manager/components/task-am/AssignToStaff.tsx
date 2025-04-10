import * as React from "react";
import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
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
import { Input } from "@/components/ui/input";
import { Plus, MoreVertical, Eye, Trash, Search, Check, FileBarChart, XCircle } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateTaskSheet from "./CreateTaskSheet";
import TaskDetail from "./TaskDetail";
import SiteDetail from "../../../manager/components/site-manager/SiteDetail"; 
import areaManagerService from "../../../../services/area-manager/area-manager.service";
import { Loader2 } from "lucide-react";
import { useDebounce } from 'use-debounce';

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
    siteId?: number;
    siteAddress?: string;
    buildingName?: string;
  };
  brandInfo: {
    requestId: number;
  };
  siteDeals: {
    siteDealId: number;
    createdAt: string;
  }[];
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

type FilterStatus = "all" | "1" | "2" | "3" | "4";
type FilterPriority = "all" | "1" | "2" | "3";

const filterLabels = {
  all: "Trạng thái",
  1: "Đã giao",
  2: "Tiến hành",
  3: "Chờ duyệt",
  4: "Hoàn thành",
};

const priorityLabels = {
  all: "Độ ưu tiên",
  1: "Thấp",
  2: "Trung bình",
  3: "Cao",
};

const statusColors: { [key: string]: string } = {
  "1": "bg-blue-500 hover:bg-blue-500", // Đã giao
  "2": "bg-yellow-500 hover:bg-yellow-500", // Tiến hành
  "3": "bg-gray-500 hover:bg-gray-500", // Chờ duyệt (màu xám)
  "4": "bg-green-500 hover:bg-green-500", // Hoàn thành (màu xanh lá)
};

const priorityTextColors = {
  1: "text-white-600",
  2: "text-white-600",
  3: "text-white-600",
};

const truncateName = (name: string, maxLength: number = 15) => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + "...";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const AssignToStaff = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null); // Thêm state cho SiteDetail
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // Load tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const tasksData = await areaManagerService.fetchTasks({
          search: debouncedSearchQuery || undefined,
          status: filterStatus !== "all" ? parseInt(filterStatus) : undefined,
          priority: filterPriority !== "all" ? parseInt(filterPriority) : undefined,
        });
        const filteredTasks = filterStatus !== "all"
          ? tasksData.filter(task => task.status === parseInt(filterStatus))
          : tasksData;
        setTasks(filteredTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [debouncedSearchQuery, filterStatus, filterPriority]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPriority, debouncedSearchQuery]);

  const getFilteredData = () => {
    let data = tasks;

    // Sắp xếp theo createdAt (mới nhất trước)
    data = data.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return data;
  };

  const handleCreateTask = (newTask: {
    name: string;
    priority: string;
    district: string;
    ward: string;
    deadline: string;
    staff: string;
    description: string;
  }) => {
    areaManagerService.fetchTasks().then(tasksData => {
      setTasks(tasksData);
    });
    setIsSheetOpen(false);
  };

  const handleViewDetails = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsDetailOpen(true);
  };

  const handleViewSiteDetail = (siteId: number | undefined) => {
    // Đóng dropdown menu trước
    document.body.click(); // Cách đơn giản để đóng tất cả các dropdown đang mở
    
    // Sau đó mới mở dialog với timeout nhỏ
    setTimeout(() => {
      if (siteId) {
        setSelectedSiteId(siteId);
      } else {
        toast.error("Task này không liên quan đến site", { position: "top-right", duration: 3000 });
      }
    }, 50); // Timeout nhỏ để đảm bảo dropdown đã đóng hoàn toàn
  };

  const handleCloseSiteDetail = () => {
    setSelectedSiteId(null);
  };

  const handleDelete = (taskId: number) => {
    console.log(`Xóa task ID: ${taskId}`);
    // Thêm logic để xóa task (ví dụ: gọi API xóa và reload danh sách)
  };

  const handleAccept = async (task: Task) => {
    try {
      const siteId = task.location.siteId;
      if (siteId) {
        const siteUpdated = await areaManagerService.updateSiteStatus({ siteId, status: 1 });
        if (!siteUpdated) {
          throw new Error("Failed to update site status");
        }
      }

      const taskUpdated = await areaManagerService.updateTaskStatus({ taskId: task.id, status: 4 });
      if (!taskUpdated) {
        throw new Error("Failed to update task status");
      }

      if (task.siteDeals && task.siteDeals.length > 0) {
        const latestSiteDeal = task.siteDeals.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })[0];

        const siteDealUpdated = await areaManagerService.updateSiteDealStatus({
          id: latestSiteDeal.siteDealId,
          status: 1,
        });
        if (!siteDealUpdated) {
          throw new Error("Failed to update site deal status");
        }
      }

      toast.success("Chấp nhận task thành công!", { position: "top-right", duration: 3000 });

      const tasksData = await areaManagerService.fetchTasks({
        search: debouncedSearchQuery || undefined,
        status: filterStatus !== "all" ? parseInt(filterStatus) : undefined,
        priority: filterPriority !== "all" ? parseInt(filterPriority) : undefined,
      });
      const filteredTasks = filterStatus !== "all"
        ? tasksData.filter(task => task.status === parseInt(filterStatus))
        : tasksData;
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error accepting task:", error);
      toast.error("Lỗi khi chấp nhận task", { position: "top-right", duration: 3000 });
    }
  };

  const handleReject = async (task: Task) => {
    try {
      const siteId = task.location.siteId;
      if (siteId) {
        const siteUpdated = await areaManagerService.updateSiteStatus({ siteId, status: 4 });
        if (!siteUpdated) {
          throw new Error("Failed to update site status");
        }
      }

      const taskUpdated = await areaManagerService.updateTaskStatus({ taskId: task.id, status: 2 });
      if (!taskUpdated) {
        throw new Error("Failed to update task status");
      }

      toast.success("Từ chối task thành công!", { position: "top-right", duration: 3000 });

      const tasksData = await areaManagerService.fetchTasks({
        search: debouncedSearchQuery || undefined,
        status: filterStatus !== "all" ? parseInt(filterStatus) : undefined,
        priority: filterPriority !== "all" ? parseInt(filterPriority) : undefined,
      });
      const filteredTasks = filterStatus !== "all"
        ? tasksData.filter(task => task.status === parseInt(filterStatus))
        : tasksData;
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error rejecting task:", error);
      toast.error("Lỗi khi từ chối task", { position: "top-right", duration: 3000 });
    }
  };

  const handleUpdateTask = () => {
    areaManagerService.fetchTasks().then(tasksData => {
      setTasks(tasksData);
    });
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
          <div className="mb-4">
            <div className="flex gap-3 flex-wrap justify-end">
              <div className="relative w-[300px]">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                    <TableHead className="w-[12%]">Tên</TableHead>
                    <TableHead className="w-[15%]">Nhân viên</TableHead>
                    <TableHead className="w-[15%]">Độ ưu tiên</TableHead>
                    <TableHead className="w-[15%]">Deadline</TableHead>
                    <TableHead className="w-[10%] text-center">Trạng thái</TableHead>
                    <TableHead className="w-[10%] text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.id}</TableCell>
                        <TableCell>{truncateName(task.name)}</TableCell>
                        <TableCell>{task.staffName || "Chưa giao"}</TableCell>
                        <TableCell className={`font-medium ${priorityTextColors[task.priority] || 'text-gray-600'}`}>
                          {task.priorityName}
                        </TableCell>
                        <TableCell>{formatDate(task.deadline)}</TableCell>
                        <TableCell className="text-center p-1 min-w-24">
                          <Badge
                            variant="outline"
                            className={`inline-flex w-32 text-xs whitespace-nowrap px-1 justify-center ${statusColors[task.status.toString()] || 'bg-gray-500'} text-white`}
                          >
                            {task.statusName}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center p-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(task.id)}>
                                <Eye size={16} className="mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              {/* {(task.status === 1 || task.status === 2) && (
                                <DropdownMenuItem onClick={() => handleDelete(task.id)}>
                                  <Trash size={16} className="mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              )} */}
                              {(task.status === 3 || task.status === 4) && (
                                <DropdownMenuItem onClick={() => handleViewSiteDetail(task.location.siteId)}>
                                  <FileBarChart size={16} className="mr-2" />
                                  Xem báo cáo
                                </DropdownMenuItem>
                              )}
                              {task.status === 3 && (
                                <>
                                  <DropdownMenuItem onClick={() => handleAccept(task)}>
                                    <Check size={16} className="mr-2" />
                                    Chấp nhận
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReject(task)}>
                                    <XCircle size={16} className="mr-2" />
                                    Từ chối
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {selectedTaskId && (
        <TaskDetail
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedTaskId(null);
          }}
          taskId={selectedTaskId}
          onUpdate={handleUpdateTask}
        />
      )}

      {selectedSiteId !== null && (
        <SiteDetail
          siteId={selectedSiteId}
          onClose={handleCloseSiteDetail}
        />
      )}
    </>
  );
};

export default AssignToStaff;