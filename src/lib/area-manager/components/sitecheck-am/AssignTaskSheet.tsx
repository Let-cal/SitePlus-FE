import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import toast, { Toaster } from "react-hot-toast";
import areaManagerService from "../../../../services/area-manager/area-manager.service";

interface AssignTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: number;
  onSubmit: (newTask: {
    name: string;
    priority: string;
    district: string;
    ward: string;
    deadline: string;
    staff: string;
    description: string;
  }) => void;
}

interface District {
  id: number;
  name: string;
  cityId: number;
  createdAt: string;
  updatedAt: string;
}

interface Ward {
  id: number;
  name: string;
  districtId: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  roleName: string;
  areaName: string;
  districtName: string;
  cityName: string;
  status: number;
  statusName: string;
  createdAt: string;
}

const priorities = ["Thấp", "Bình thường", "Cao"];

const getPriorityValue = (priority: string): number => {
  switch (priority) {
    case "Thấp":
      return 1;
    case "Bình thường":
      return 2;
    case "Cao":
      return 3;
    default:
      return 2;
  }
};

const dialogStyles = {
  customWidth: `
    .dialog-custom-width {
      max-width: 50% !important;
      width: 50% !important;
    }
    
    @media (max-width: 768px) {
      .dialog-custom-width {
        max-width: 95% !important;
        width: 95% !important;
      }
    }
  `
};

const AssignTaskSheet: React.FC<AssignTaskSheetProps> = ({ isOpen, onClose, siteId, onSubmit }) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Bình thường");
  const [district, setDistrict] = useState("Chưa có thông tin");
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [ward, setWard] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [description, setDescription] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [wards, setWards] = useState<Ward[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingWards, setLoadingWards] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const storedDistrictId = localStorage.getItem("districtId");
    const storedDistrict = localStorage.getItem("district");
    if (storedDistrictId && storedDistrict) {
      const parsedDistrictId = Number(storedDistrictId);
      if (!isNaN(parsedDistrictId)) {
        setDistrictId(parsedDistrictId);
        setDistrict(storedDistrict);
      } else {
        setDistrictId(null);
        setDistrict("Chưa có thông tin");
        toast.error("Không tìm thấy districtId hợp lệ trong localStorage", { position: "top-right", duration: 3000 });
      }
    } else {
      setDistrictId(null);
      setDistrict("Chưa có thông tin");
      toast.error("Không tìm thấy district trong localStorage", { position: "top-right", duration: 3000 });
    }
  }, []);

  useEffect(() => {
    const fetchWards = async () => {
      if (districtId) {
        console.log("Fetching wards for districtId:", districtId);
        setLoadingWards(true);
        setWard("");
        try {
          const wardsData = await areaManagerService.fetchWardsByDistrictId(districtId);
          console.log("Wards data received:", wardsData);
          setWards(wardsData);
        } catch (error) {
          console.error("Error fetching wards:", error);
          toast.error("Lỗi khi tải danh sách phường", { position: "top-right", duration: 3000 });
          setWards([]);
        } finally {
          setLoadingWards(false);
        }
      } else {
        setWards([]);
        setWard("");
        setLoadingWards(false);
      }
    };
    fetchWards();
  }, [districtId]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersData = await areaManagerService.fetchUsers({});
        console.log("Users Data in AssignTaskSheet:", usersData);
        setUsers(usersData);
      } catch (error) {
        console.error("Fetch Users Error in AssignTaskSheet:", error);
        toast.error("Lỗi khi tải danh sách nhân viên", { position: "top-right", duration: 3000 });
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deadline) {
      toast.error("Vui lòng chọn thời hạn", { position: "top-right", duration: 3000 });
      return;
    }

    if (!name) {
      toast.error("Vui lòng nhập tên công việc", { position: "top-right", duration: 3000 });
      return;
    }

    if (!description) {
      toast.error("Vui lòng nhập mô tả công việc", { position: "top-right", duration: 3000 });
      return;
    }

    if (!ward) {
      toast.error("Vui lòng chọn phường", { position: "top-right", duration: 3000 });
      return;
    }

    if (!selectedEmployee) {
      toast.error("Vui lòng chọn nhân viên", { position: "top-right", duration: 3000 });
      return;
    }

    const selectedUser = users.find(user => user.id.toString() === selectedEmployee);
    const employeeName = selectedUser ? selectedUser.name : "";
    const selectedWard = wards.find(w => w.name === ward);
    const areaId = selectedWard ? selectedWard.id : 0;

    const formattedDeadline = format(deadline, "yyyy-MM-dd");
    const priorityValue = getPriorityValue(priority);

    const taskData = {
      siteId,
      name,
      description,
      areaId,
      staffId: Number(selectedEmployee),
      deadline: formattedDeadline,
      priority: priorityValue,
    };

    const newTask = {
      name,
      priority,
      district,
      ward,
      deadline: format(deadline, "dd/MM/yyyy"),
      staff: employeeName,
      description,
    };

    try {
      const createResponse = await areaManagerService.createTask(taskData);
      if (createResponse.success) {
        toast.success("Tạo công việc thành công!", { position: "top-right", duration: 3000 });

        const taskId = createResponse.data.id;

        const updateTaskResponse = await areaManagerService.updateTaskStatus({
          taskId,
          status: 2,
        });

        if (!updateTaskResponse) {
          throw new Error("Failed to update task status");
        }

        const updateSiteResponse = await areaManagerService.updateSiteStatus({
          siteId,
          status: 2,
        });

        if (!updateSiteResponse) {
          throw new Error("Failed to update site status");
        }

        toast.success("Giao việc thành công!", { position: "top-right", duration: 3000 });

        onSubmit(newTask);
        onClose();

        setName("");
        setPriority("Bình thường");
        setWard("");
        setDeadline(undefined);
        setSelectedEmployee("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Lỗi khi giao việc", { position: "top-right", duration: 3000 });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setPriority("Bình thường");
      setWard("");
      setDeadline(undefined);
      setSelectedEmployee("");
      setDescription("");
    }
  }, [isOpen]);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = dialogStyles.customWidth;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="p-4 rounded-md shadow-lg border overflow-y-auto no-scrollbar dialog-custom-width"
          aria-describedby="dialog-description"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold text-center">
              GIAO CÔNG VIỆC KHẢO SÁT
            </DialogTitle>
          </DialogHeader>
          <span id="dialog-description" className="sr-only">
            Điền thông tin để giao một công việc khảo sát mới.
          </span>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm">Tên công việc</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên công việc"
                required
                autoComplete="off"
                className="text-sm h-10 w-full"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="deadline" className="text-sm">Thời hạn</Label>
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-sm h-10"
                  onClick={() => setShowCalendar(!showCalendar)}
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
                {showCalendar && (
                  <div className="absolute z-10 top-[calc(100%+4px)] w-[300px] border rounded-md shadow-lg bg-background border-border p-2">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={(date) => {
                        setDeadline(date);
                        setShowCalendar(false);
                      }}
                      className="bg-background text-foreground"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="district" className="text-sm">Quận</Label>
                <div
                  id="district"
                  className="text-sm h-10 w-full p-2 border rounded-md bg-background text-foreground border-border flex items-center"
                >
                  {district}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="ward" className="text-sm">Phường</Label>
                <Select value={ward} onValueChange={setWard} disabled={loadingWards || !districtId}>
                  <SelectTrigger id="ward" className="text-sm h-10">
                    <SelectValue placeholder={
                      loadingWards 
                        ? "Đang tải..." 
                        : !districtId 
                          ? "Không có quận được chọn" 
                          : wards.length === 0 
                            ? "Không có phường" 
                            : "Chọn phường"
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px] overflow-y-auto no-scrollbar">
                    {wards.map((wardOption) => (
                      <SelectItem key={wardOption.id} value={wardOption.name} className="text-sm">
                        {wardOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="employee" className="text-sm">Nhân viên</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={loadingUsers}>
                  <SelectTrigger id="employee" className="text-sm h-10">
                    <SelectValue placeholder={loadingUsers ? "Đang tải..." : "Chọn nhân viên"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px] overflow-y-auto no-scrollbar">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()} className="text-sm">
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="priority" className="text-sm">Độ ưu tiên</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority" className="text-sm h-10">
                    <SelectValue placeholder="Chọn độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px] overflow-y-auto no-scrollbar">
                    {priorities.map((priorityOption) => (
                      <SelectItem key={priorityOption} value={priorityOption} className="text-sm">
                        {priorityOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm">Mô tả công việc</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả công việc"
                required
                autoComplete="off"
                className="w-full text-sm p-2 border rounded-md resize-y min-h-[120px] bg-background text-foreground border-border"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-3">
              <Button type="button" variant="outline" onClick={onClose} className="text-sm h-10 px-6">
                Hủy
              </Button>
              <Button type="submit" className="text-sm h-10 px-6">
                Giao
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default AssignTaskSheet;