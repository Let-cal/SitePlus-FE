import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import toast from "react-hot-toast";
import areaManagerService from "../../../../services/area-manager/area-manager.service";

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
  areaId: number;
  areaName: string;
  districtName: string;
  cityName: string;
  status: number;
  statusName: string;
  createdAt: string;
}

interface District {
  id: number;
  name: string;
}

interface TaskUpdateProps {
  task: Task | null;
  onCancel: () => void;
  onUpdate: () => void;
  onClose: () => void;
}

const priorities = ["Thấp", "Bình thường", "Cao"];

const getPriorityString = (priority: number): string => {
  switch (priority) {
    case 1: return "Thấp";
    case 2: return "Bình thường";
    case 3: return "Cao";
    default: return "Bình thường";
  }
};

const getPriorityValue = (priority: string): number => {
  switch (priority) {
    case "Thấp": return 1;
    case "Bình thường": return 2;
    case "Cao": return 3;
    default: return 2;
  }
};

const customStyles = `
  .select-content-high-zindex {
    z-index: 2000 !important;
  }
`;

const TaskUpdate: React.FC<TaskUpdateProps> = ({ task, onCancel, onUpdate, onClose }) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Bình thường");
  const [district, setDistrict] = useState("");
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [districtName, setDistrictName] = useState<string>("Chưa có thông tin");
  const [ward, setWard] = useState<string>("");
  const [displayedWard, setDisplayedWard] = useState<string>(""); // Giá trị hiển thị cho phường
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [displayedStaff, setDisplayedStaff] = useState<string>(""); // Giá trị hiển thị cho nhân viên
  const [description, setDescription] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [wards, setWards] = useState<Ward[]>([]);
  const [filteredWards, setFilteredWards] = useState<Ward[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [hasDistrictError, setHasDistrictError] = useState(false);

  const fetchAndSetWards = useCallback(async (currentDistrictId: number) => {
    try {
      setLoadingWards(true);
      console.log("Fetching wards for districtId:", currentDistrictId);
      
      const wardsData = await areaManagerService.fetchWardsByDistrictId(currentDistrictId);
      console.log("Wards data received:", wardsData);
      
      setWards(wardsData);
      setFilteredWards(wardsData);

      if (task?.location?.areaName) {
        const matchingWard = wardsData.find(w => w.name === task.location.areaName);
        if (matchingWard) {
          setWard(matchingWard.name);
          setDisplayedWard(matchingWard.name);
          console.log("Ward set from task:", matchingWard.name);
        }
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      toast.error("Lỗi khi tải danh sách phường", { position: "top-right", duration: 3000 });
      setWards([]);
      setFilteredWards([]);
    } finally {
      setLoadingWards(false);
    }
  }, [task]);

  const fetchDistricts = useCallback(async () => {
    try {
      const districts: District[] = await areaManagerService.fetchDistricts();
      console.log("Districts fetched:", districts);
      
      const district = districts.find(d => d.id === districtId);
      if (district) {
        setDistrictName(district.name);
      } else {
        setDistrictName("Quận không tồn tại");
        setHasDistrictError(true);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistrictName("Chưa có thông tin");
      setHasDistrictError(true);
    }
  }, [districtId]);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setPriority(getPriorityString(task.priority));
      if (task.deadline) {
        try {
          const datePart = task.deadline.split('T')[0];
          const [year, month, day] = datePart.split('-').map(Number);
          const parsedDeadline = new Date(year, month - 1, day);
          if (!isNaN(parsedDeadline.getTime())) {
            setDeadline(parsedDeadline);
          } else {
            throw new Error("Invalid date");
          }
        } catch (error) {
          console.error("Error parsing deadline:", error);
          setDeadline(undefined);
          toast.error("Thời hạn không hợp lệ", { position: "top-right", duration: 3000 });
        }
      } else {
        setDeadline(undefined);
      }
      // Set giá trị ban đầu cho nhân viên và phường
      setDisplayedStaff(task.staffName || "");
      setDisplayedWard(task.location?.areaName || "");
      setWard(task.location?.areaName || "");
      setSelectedEmployee(task.staffId.toString());
      console.log("Initial task data set:", task);
    }
  }, [task]);

  useEffect(() => {
    const storedDistrictId = localStorage.getItem("districtId");
    const storedDistrict = localStorage.getItem("district");
    
    console.log("Stored districtId:", storedDistrictId);
    console.log("Stored district:", storedDistrict);

    if (storedDistrictId) {
      const parsedDistrictId = Number(storedDistrictId);
      if (!isNaN(parsedDistrictId)) {
        setDistrictId(parsedDistrictId);
        setHasDistrictError(false);
        fetchAndSetWards(parsedDistrictId);
        fetchDistricts();
      } else {
        setDistrictId(null);
        setHasDistrictError(true);
        toast.error("Không tìm thấy districtId hợp lệ", { position: "top-right", duration: 3000 });
      }
    }

    if (storedDistrict) {
      setDistrict(storedDistrict);
    }
  }, [fetchAndSetWards, fetchDistricts]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersData = await areaManagerService.fetchUsers({});
        console.log("Users Data in TaskUpdate:", usersData);
        const activeUsers = usersData.filter(user => user.status === 1);
        setUsers(activeUsers);
        setFilteredUsers(activeUsers);

        if (task && activeUsers.length > 0) {
          const matchingUser = activeUsers.find(u => u.id === task.staffId);
          if (matchingUser) {
            setSelectedEmployee(matchingUser.id.toString());
            setDisplayedStaff(matchingUser.name);
          }
        }
      } catch (error) {
        console.error("Fetch Users Error in TaskUpdate:", error);
        toast.error("Lỗi khi tải danh sách nhân viên", { position: "top-right", duration: 3000 });
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [task]);

  useEffect(() => {
    if (selectedEmployee && selectedEmployee !== "none") {
      const selectedUser = users.find(user => user.id.toString() === selectedEmployee);
      if (selectedUser) {
        setDisplayedStaff(selectedUser.name); // Cập nhật tên hiển thị khi chọn nhân viên
        if (selectedUser.areaId) {
          const matchingWard = wards.find(ward => ward.id === selectedUser.areaId);
          if (matchingWard) {
            setFilteredWards([matchingWard]);
            setWard(matchingWard.name);
            setDisplayedWard(matchingWard.name);
          } else {
            setFilteredWards([]);
            setWard("");
            setDisplayedWard("");
          }
        } else {
          setFilteredWards(wards);
          setWard("");
          setDisplayedWard("");
        }
      }
    } else {
      setFilteredWards(wards);
      setWard(task?.location?.areaName || "");
      setDisplayedWard(task?.location?.areaName || "");
    }
  }, [selectedEmployee, wards, users, task]);

  useEffect(() => {
    if (ward && ward !== "none") {
      const selectedWard = wards.find(w => w.name === ward);
      if (selectedWard) {
        setDisplayedWard(selectedWard.name); // Cập nhật tên hiển thị khi chọn phường
        const matchingUsers = users.filter(user => user.areaId === selectedWard.id);
        setFilteredUsers(matchingUsers);
        if (matchingUsers.length > 0) {
          const currentEmployeeStillValid = matchingUsers.some(user => user.id.toString() === selectedEmployee);
          if (!currentEmployeeStillValid) {
            setSelectedEmployee("");
            setDisplayedStaff("");
          }
        } else {
          setSelectedEmployee("");
          setDisplayedStaff("");
        }
      } else {
        setFilteredUsers(users);
        setSelectedEmployee(task?.staffId.toString() || "");
        setDisplayedStaff(task?.staffName || "");
      }
    } else {
      setFilteredUsers(users);
      setSelectedEmployee(task?.staffId.toString() || "");
      setDisplayedStaff(task?.staffName || "");
    }
  }, [ward, wards, users, task]);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) {
      toast.error("Không tìm thấy thông tin task để cập nhật", { position: "top-right", duration: 3000 });
      return;
    }

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

    if (!ward || ward === "none") {
      toast.error("Vui lòng chọn phường", { position: "top-right", duration: 3000 });
      return;
    }

    if (!selectedEmployee || selectedEmployee === "none") {
      toast.error("Vui lòng chọn nhân viên", { position: "top-right", duration: 3000 });
      return;
    }

    const selectedWard = wards.find(w => w.name === ward);
    const areaId = selectedWard ? selectedWard.id : task?.location.areaId || 0;
    const formattedDeadline = format(deadline, "yyyy-MM-dd");
    const priorityValue = getPriorityValue(priority);

    const updatedTask = {
      name,
      description,
      areaId,
      staffId: Number(selectedEmployee),
      deadline: formattedDeadline,
      priority: priorityValue,
      status: task.status,
    };

    try {
      const result = await areaManagerService.updateTask(task.id, updatedTask);
      if (result) {
        toast.success("Cập nhật công việc thành công!", { position: "top-right", duration: 3000 });
        onUpdate();
        onClose();
      } else {
        toast.error("Cập nhật công việc thất bại", { position: "top-right", duration: 3000 });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Lỗi khi cập nhật công việc", { position: "top-right", duration: 3000 });
    }
  };

  return (
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

      <div className="space-y-1 relative">
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
            <div className="absolute z-[2000] top-[calc(100%+4px)] left-0 w-[300px] border rounded-md shadow-lg bg-background border-border p-2">
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
            {districtName}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="ward" className="text-sm">Phường</Label>
          <Select 
            value={ward} 
            onValueChange={setWard} 
            disabled={loadingWards}
          >
            <SelectTrigger id="ward" className="text-sm h-10">
              <SelectValue placeholder={
                loadingWards 
                  ? "Đang tải..." 
                  : filteredWards.length === 0 
                    ? "Không có phường" 
                    : displayedWard || "Chọn phường"
              } />
            </SelectTrigger>
            <SelectContent className="max-h-[250px] overflow-y-auto select-content-high-zindex">
              <SelectItem value="none" className="text-sm">
                Chọn phường
              </SelectItem>
              {filteredWards.map((wardOption) => (
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
          <Select 
            value={selectedEmployee} 
            onValueChange={setSelectedEmployee} 
            disabled={loadingUsers}
          >
            <SelectTrigger id="employee" className="text-sm h-10">
              <SelectValue placeholder={loadingUsers ? "Đang tải..." : displayedStaff || "Chọn nhân viên"} />
            </SelectTrigger>
            <SelectContent className="max-h-[250px] overflow-y-auto select-content-high-zindex">
              <SelectItem value="none" className="text-sm">
                Chọn nhân viên
              </SelectItem>
              {filteredUsers.map((user) => (
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
            <SelectContent className="max-h-[250px] overflow-y-auto select-content-high-zindex">
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
        <Button type="button" variant="outline" onClick={onCancel} className="text-sm h-10 px-6">
          Hủy
        </Button>
        <Button type="submit" className="text-sm h-10 px-6">
          Lưu
        </Button>
      </div>
    </form>
  );
};

export default TaskUpdate;