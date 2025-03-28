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
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [description, setDescription] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [wards, setWards] = useState<Ward[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [hasDistrictError, setHasDistrictError] = useState(false);

  // Fetch wards và set ward một cách đồng bộ
  const fetchAndSetWards = useCallback(async (currentDistrictId: number) => {
    try {
      setLoadingWards(true);
      console.log("Fetching wards for districtId:", currentDistrictId);
      
      const wardsData = await areaManagerService.fetchWardsByDistrictId(currentDistrictId);
      console.log("Wards data received:", wardsData);
      
      setWards(wardsData);

      // Ưu tiên set ward từ task
      if (task?.location?.areaName) {
        const matchingWard = wardsData.find(w => w.name === task.location.areaName);
        if (matchingWard) {
          setWard(matchingWard.name);
          console.log("Ward set from task:", matchingWard.name);
        } else if (wardsData.length > 0) {
          // Nếu không tìm thấy, chọn ward đầu tiên
          setWard(wardsData[0].name);
          console.log("Ward set to first ward:", wardsData[0].name);
        }
      } else if (wardsData.length > 0) {
        // Nếu không có task, chọn ward đầu tiên
        setWard(wardsData[0].name);
        console.log("Ward set to first ward:", wardsData[0].name);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      toast.error("Lỗi khi tải danh sách phường", { position: "top-right", duration: 3000 });
    } finally {
      setLoadingWards(false);
    }
  }, [task]);

  // Fetch districts
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

  // Khởi tạo state từ task
  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setPriority(getPriorityString(task.priority));
      setDeadline(new Date(task.deadline));
      console.log("Initial task data set:", task);
    }
  }, [task]);

  // Lấy districtId từ localStorage
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

        // Fetch wards và districts ngay khi có districtId
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersData = await areaManagerService.fetchUsers({});
        console.log("Users Data in TaskUpdate:", usersData);
        setUsers(usersData);
        
        if (task && usersData.length > 0) {
          const matchingUser = usersData.find(u => u.id === task.staffId);
          if (matchingUser) {
            setSelectedEmployee(matchingUser.id.toString());
          }
        }
      } catch (error) {
        console.error("Fetch Users Error in TaskUpdate:", error);
        toast.error("Lỗi khi tải danh sách nhân viên", { position: "top-right", duration: 3000 });
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [task]);

  // Thêm custom styles để tăng z-index của SelectContent
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
    };

    try {
      // Gọi API cập nhật task (chưa có API, tạm thời bỏ qua)
      // await areaManagerService.updateTask(task.id, updatedTask);
      toast.success("Cập nhật công việc thành công!", { position: "top-right", duration: 3000 });

      onUpdate();
      onClose();
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
              <SelectValue placeholder={loadingWards ? "Đang tải..." : "Chọn phường"} />
            </SelectTrigger>
            <SelectContent className="max-h-[250px] overflow-y-auto select-content-high-zindex">
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
          <Select 
            value={selectedEmployee} 
            onValueChange={setSelectedEmployee} 
            disabled={loadingUsers}
          >
            <SelectTrigger id="employee" className="text-sm h-10">
              <SelectValue placeholder={loadingUsers ? "Đang tải..." : "Chọn nhân viên"} />
            </SelectTrigger>
            <SelectContent className="max-h-[250px] overflow-y-auto select-content-high-zindex">
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