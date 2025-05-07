import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import areaManagerService from "../../../../services/area-manager/area-manager.service";
import TaskUpdate from "./TaskUpdate";
import SiteDetail from "../../../manager/components/site-manager/SiteDetail"; 

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
    brandName?: string;
  };
  deadline: string;
  createdAt: string;
  updatedAt: string;
  isDeadlineWarning: boolean;
  daysToDeadline: number;
}

interface District {
  id: number;
  name: string;
}

interface TaskDetailProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  onUpdate: () => void;
}

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
    font-family: 'Arial', sans-serif;
  }
  .section-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
    border-bottom: 2px solid hsl(var(--border));
    padding-bottom: 0.25rem;
  }
  .detail-item {
    display: flex;
    align-items: flex-start;
    padding: 0.5rem 0;
    border-bottom: 1px dashed hsl(var(--border));
  }
  .detail-label {
    font-weight: bold;
    font-size: 1.1rem;
    width: 200px;
    flex-shrink: 0;
    color: hsl(var(--foreground));
  }
  .detail-value {
    font-size: 1.1rem;
    flex-grow: 1;
    word-break: break-word;
    color: hsl(var(--foreground));
  }
  .button-group {
    margin-top: 1.5rem;
  }
  .toaster {
    z-index: 9999 !important; /* Đảm bảo Toaster hiển thị trên cùng */
  }
`;

const TaskDetail: React.FC<TaskDetailProps> = ({ isOpen, onClose, taskId, onUpdate }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [districtName, setDistrictName] = useState<string>("Chưa có thông tin");
  const [isSiteDetailOpen, setIsSiteDetailOpen] = useState(false);

  useEffect(() => {
    if (taskId && isOpen) {
      const fetchTask = async () => {
        try {
          const taskData = await areaManagerService.fetchTaskById(taskId);
          console.log("Fetched task data:", taskData); // Debug dữ liệu
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

  useEffect(() => {
    if (isOpen) {
      const districtId = localStorage.getItem("districtId");
      if (districtId) {
        const fetchDistrict = async () => {
          try {
            const districts: District[] = await areaManagerService.fetchDistricts();
            const district = districts.find(d => d.id === parseInt(districtId));
            setDistrictName(district ? district.name : "Chưa có thông tin");
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

  useEffect(() => {
    if (!isOpen) {
      setIsEditingMode(false);
      setDistrictName("Chưa có thông tin");
      setIsSiteDetailOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const getTaskType = (task: Task) => {
    return task.brandInfo && task.brandInfo.requestId > 0 ? "" : "";
  };

  const handleEdit = () => {
    setIsEditingMode(true);
  };

  const handleViewReport = () => {
    if (task && task.location.siteId && task.location.siteId > 0) {
      console.log("Opening SiteDetail with siteId:", task.location.siteId); // Debug
      setIsSiteDetailOpen(true);
    } else {
      console.log("No valid siteId found:", task?.location.siteId); // Debug
      toast.error("Không có siteId hợp lệ để xem báo cáo. Vui lòng kiểm tra trạng thái công việc.", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingMode(false);
  };

  const handleCloseSiteDetail = () => {
    setIsSiteDetailOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="task-detail-drawer">
        <div className="p-6">
          <div className="flex flex-col items-center relative mb-6">
            <h2 className="text-2xl font-bold mt-4 mb-6">
              {task ? (
                isEditingMode ? (
                  `CHỈNH SỬA CÔNG VIỆC - ID ${task.id} (${getTaskType(task)})`
                ) : (
                  `CHI TIẾT CÔNG VIỆC - ID ${task.id}`
                )
              ) : (
                "Chi tiết công việc"
              )}
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
              <div className="space-y-6">
                <div>
                  <h3 className="section-title">Thông tin cơ bản</h3>
                  <div className="detail-item">
                    <span className="detail-label">Tên công việc:</span>
                    <span className="detail-value">{task.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Thời hạn:</span>
                    <span className="detail-value">
                      {task.deadline ? format(new Date(task.deadline), "dd/MM/yyyy") : "Chưa có thời hạn"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nhân viên:</span>
                    <span className="detail-value">{task.staffName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Độ ưu tiên:</span>
                    <span className="detail-value">{getPriorityString(task.priority)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="section-title">Chi tiết địa điểm</h3>
                  <div className="detail-item">
                    <span className="detail-label">Quận:</span>
                    <span className="detail-value">{districtName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phường:</span>
                    <span className="detail-value">{task.location.areaName}</span>
                  </div>
                </div>

                <div>
                  <h3 className="section-title">Mô tả công việc</h3>
                  <div className="detail-item">
                    <span className="detail-label">Nội dung:</span>
                    <span className="detail-value">{task.description}</span>
                  </div>
                </div>

                <div className="button-group flex justify-end space-x-4">
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

      {isSiteDetailOpen && task && task.location.siteId && (
        <SiteDetail siteId={task.location.siteId} onClose={handleCloseSiteDetail} />
      )}

      <Toaster containerClassName="toaster" />
    </>
  );
};

export default TaskDetail;