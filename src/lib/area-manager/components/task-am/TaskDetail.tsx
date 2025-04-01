import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import areaManagerService from "../../../../services/area-manager/area-manager.service";
import TaskUpdate from "./TaskUpdate";

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

interface District {
  id: number;
  name: string;
  // Các trường khác nếu có
}

interface TaskDetailProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  onUpdate: () => void;
}

// Hàm chuyển priority từ số sang chuỗi
const getPriorityString = (priority: number): string => {
  switch (priority) {
    case 1:
      return "Thấp";
    case 2:
      return "Trung bình";
    case 3:
      return "Cao";
    default:
      return "Trung bình";
  }
};

// CSS tùy chỉnh cho drawer
const customStyles = `
  .task-detail-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: hsl(var(--background));
    border-top: 1px solid hsl(var(--border));
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    overflow-y: auto;
  }
`;

const TaskDetail: React.FC<TaskDetailProps> = ({ isOpen, onClose, taskId, onUpdate }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [districtName, setDistrictName] = useState<string>("Chưa có thông tin"); // State để lưu tên Quận

  // Lấy dữ liệu task từ API
  useEffect(() => {
    if (taskId && isOpen) {
      const fetchTask = async () => {
        try {
          const taskData = await areaManagerService.fetchTaskById(taskId);
          if (taskData) {
            setTask(taskData);
          }
        } catch (error) {
          console.error("Error fetching task:", error);
          toast.error("Lỗi khi tải chi tiết công việc", { position: "top-right", duration: 3000 });
        }
      };
      fetchTask();
    }
  }, [taskId, isOpen]);

  // Lấy districtId từ localStorage và gọi API để lấy thông tin Quận
  useEffect(() => {
    if (isOpen) {
      const districtId = localStorage.getItem("districtId");
      if (districtId) {
        const fetchDistrict = async () => {
          try {
            const districts: District[] = await areaManagerService.fetchDistricts();
            const district = districts.find(d => d.id === parseInt(districtId));
            if (district) {
              setDistrictName(district.name); // Lấy tên Quận từ danh sách
            } else {
              setDistrictName("Chưa có thông tin");
            }
          } catch (error) {
            console.error("Error fetching districts:", error);
            setDistrictName("Chưa có thông tin");
          }
        };
        fetchDistrict();
      } else {
        setDistrictName("Chưa có thông tin");
      }
    }
  }, [isOpen]);

  // Reset state khi đóng form
  useEffect(() => {
    if (!isOpen) {
      setIsEditingMode(false);
      setDistrictName("Chưa có thông tin"); // Reset districtName khi đóng
    }
  }, [isOpen]);

  // Thêm custom styles cho drawer
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const getTaskType = (task: Task) => {
    return task.brandInfo && task.brandInfo.requestId > 0 ? "THEO YÊU CẦU" : "Thông thường";
  };

  const handleEdit = () => {
    setIsEditingMode(true);
  };

  const handleViewReport = () => {
    // Logic để xem báo cáo sẽ được thêm sau khi có API hoặc yêu cầu cụ thể
    // toast.info("Chức năng xem báo cáo đang được phát triển", { position: "top-right", duration: 3000 });
  };

  const handleCancelEdit = () => {
    setIsEditingMode(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="task-detail-drawer">
        <div className="p-6">
          {/* Tiêu đề và nút đóng */}
          <div className="flex flex-col items-center relative mb-4">
            <h2 className="text-xl font-semibold mt-4 mb-6">
              {task ? `ID ${task.id} - ${getTaskType(task)}` : "Chi tiết công việc"}
            </h2>
            <Button
              variant="ghost"
              onClick={onClose}
              className="absolute top-3 right-0 p-4"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {task ? (
            isEditingMode ? (
              <TaskUpdate
                task={task}
                onCancel={handleCancelEdit}
                onUpdate={onUpdate}
                onClose={onClose}
              />
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm">Tên công việc</Label>
                  <div
                    id="name"
                    className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                  >
                    {task.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="deadline" className="text-sm">Thời hạn</Label>
                  <div
                    id="deadline"
                    className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                  >
                    {task.deadline ? format(new Date(task.deadline), "dd/MM/yyyy") : "Chưa có thời hạn"}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="district" className="text-sm">Quận</Label>
                    <div
                      id="district"
                      className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                    >
                      {districtName}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="ward" className="text-sm">Phường</Label>
                    <div
                      id="ward"
                      className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                    >
                      {task.location.areaName}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="employee" className="text-sm">Nhân viên</Label>
                    <div
                      id="employee"
                      className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                    >
                      {task.staffName}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="priority" className="text-sm">Độ ưu tiên</Label>
                    <div
                      id="priority"
                      className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                    >
                      {getPriorityString(task.priority)}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm">Mô tả công việc</Label>
                  <textarea
                    id="description"
                    value={task.description}
                    disabled
                    className="w-full text-sm p-2 border rounded-md resize-y min-h-[120px] bg-background text-foreground border-border"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-3">
                  {task && (task.status === 3 || task.status === 4) && (
                    <Button onClick={handleViewReport} className="text-sm h-10 px-4">
                      Xem báo cáo
                    </Button>
                  )}
                  {task && (task.status === 1 || task.status === 2) && (
                    <Button onClick={handleEdit} className="text-sm h-10 px-4">
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>
            )
          ) : (
            <p className="text-center">Đang tải...</p>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default TaskDetail;