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

// Các interfaces giữ nguyên như cũ
interface CreateTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTask: {
    id: string;
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

// Interface cho dữ liệu nhân viên từ API
interface User {
  id: number;
  email: string;
  name: string; // Tên nhân viên
  roleName: string;
  areaName: string;
  districtName: string;
  cityName: string;
  status: number;
  statusName: string;
  createdAt: string;
}

const priorities = ["Thấp", "Bình thường", "Cao"];

const generateJobCode = () => {
  const prefix = "KS";
  const randomNumbers = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNumbers}`;
};

// Custom CSS for dialog width
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

const CreateTaskSheet: React.FC<CreateTaskSheetProps> = ({ isOpen, onClose, onSubmit }) => {
  const [jobCode] = useState(generateJobCode());
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Bình thường");
  const [district, setDistrict] = useState("");
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [ward, setWard] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<string>(""); // Lưu ID nhân viên từ API
  const [description, setDescription] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [users, setUsers] = useState<User[]>([]); // State để lưu danh sách nhân viên từ API
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingWards, setLoadingWards] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch districts when component mounts
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const districtsData = await areaManagerService.fetchDistricts();
        setDistricts(districtsData);
        
        // Set default district only if district is not already set
        if (districtsData.length > 0 && !district) {
          const defaultDistrict = districtsData.find((d) => d.name === "Quận 1") || districtsData[0];
          setDistrict(defaultDistrict.name);
          setDistrictId(defaultDistrict.id);
        }
      } catch (error) {
        toast.error("Lỗi khi tải danh sách quận", { position: "top-right", duration: 3000 });
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, []);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersData = await areaManagerService.fetchUsers(1, 20); // Lấy 20 nhân viên để đảm bảo có đủ dữ liệu
        console.log("Users Data in CreateTaskSheet:", usersData);
        setUsers(usersData);
      } catch (error) {
        console.error("Fetch Users Error in CreateTaskSheet:", error);
        toast.error("Lỗi khi tải danh sách nhân viên", { position: "top-right", duration: 3000 });
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch wards whenever districtId changes
  useEffect(() => {
    const fetchWards = async () => {
      if (districtId) {
        console.log("Fetching wards for districtId:", districtId);
        setLoadingWards(true);
        setWard(""); // Reset ward selection when district changes
        
        try {
          const wardsData = await areaManagerService.fetchWardsByDistrictId(districtId);
          console.log("Wards data received:", wardsData);
          setWards(wardsData);
          
          // Không tự động chọn phường đầu tiên nữa
          // Người dùng sẽ phải tự chọn phường
        } catch (error) {
          console.error("Error fetching wards:", error);
          toast.error("Lỗi khi tải danh sách phường", { position: "top-right", duration: 3000 });
          setWards([]);
        } finally {
          setLoadingWards(false);
        }
      } else {
        // If no district is selected, clear wards
        setWards([]);
        setWard("");
      }
    };
  
    fetchWards();
  }, [districtId]);

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find((d) => d.name === value);
    if (selectedDistrict) {
      setDistrict(value);
      setDistrictId(selectedDistrict.id);
    } else {
      setDistrict(value);
      setDistrictId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Lấy tên nhân viên từ ID đã chọn
    const selectedUser = users.find(user => user.id.toString() === selectedEmployee);
    const employeeName = selectedUser ? selectedUser.name : "";

    const formattedDeadline = format(deadline, "dd/MM/yyyy");
    const newTask = {
      id: jobCode,
      name,
      priority,
      district,
      ward,
      deadline: formattedDeadline,
      staff: employeeName, 
      description,
    };

    onSubmit(newTask);
    onClose();

    // Reset form
    setName("");
    setPriority("Bình thường");
    setDistrict("");
    setDistrictId(null);
    setWard("");
    setDeadline(undefined);
    setSelectedEmployee(""); 
    setDescription("");
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setPriority("Bình thường");
      // Don't reset district/ward here to avoid unnecessary API calls
      setDeadline(undefined);
      setSelectedEmployee("");
      setDescription("");
    }
  }, [isOpen]);

  // Add the global styles
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = dialogStyles.customWidth;
    document.head.appendChild(styleElement);

    // Cleanup function to remove the style when component unmounts
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
              TẠO CÔNG VIỆC KHẢO SÁT
            </DialogTitle>
          </DialogHeader>
          <span id="dialog-description" className="sr-only">
            Điền thông tin để tạo một công việc khảo sát mới.
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
                <Label htmlFor="district" className="text-sm">Quận/Huyện</Label>
                <Select 
                  value={district} 
                  onValueChange={handleDistrictChange} 
                  disabled={loadingDistricts}
                >
                  <SelectTrigger id="district" className="text-sm h-10">
                    <SelectValue placeholder={loadingDistricts ? "Đang tải..." : "Chọn quận/huyện"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px] overflow-y-auto no-scrollbar">
                    {districts.map((districtOption) => (
                      <SelectItem key={districtOption.id} value={districtOption.name} className="text-sm">
                        {districtOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="ward" className="text-sm">Phường</Label>
                <Select value={ward} onValueChange={setWard} disabled={loadingWards || !districtId}>
                  <SelectTrigger id="ward" className="text-sm h-10">
                    <SelectValue placeholder={
                      loadingWards 
                        ? "Đang tải..." 
                        : !districtId 
                          ? "Vui lòng chọn quận trước" 
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

            {/* Mô tả công việc */}
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
                Tạo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default CreateTaskSheet;