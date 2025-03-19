import axios from "axios";
import { API_BASE_URL } from "../api-config";
import { API_ENDPOINTS } from "../api-endpoints";
import toast from "react-hot-toast";

// Định nghĩa interface cho dữ liệu quận từ API
interface District {
  id: number;
  name: string;
  cityId: number;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa interface cho dữ liệu phường từ API
interface Ward {
  id: number;
  name: string;
  districtId: number;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa interface cho dữ liệu nhân viên từ API
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

// Định nghĩa interface cho dữ liệu task từ API
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

// Định nghĩa interface chung cho phản hồi API
interface ApiResponse<T> {
  data: {
    page: number;
    totalPage: number;
    totalRecords: number;
    listData: T[];
  };
  success: boolean;
  message: string;
}

class AreaManagerService {
  // Hàm lấy token và trả về header chung cho tất cả API
  private getAuthHeader(): { headers: Record<string, string> } | null {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn", { position: "top-right", duration: 3000 });
      // Có thể thêm logic chuyển hướng nếu cần
      // window.location.href = "/login";
      return null; // Trả về null nếu không có token
    }

    return {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "accept": "*/*",
      },
    };
  }

  // Get all districts
  async fetchDistricts(): Promise<District[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return []; // Trả về mảng rỗng nếu không có token
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_DISTRICTS}?page=1&pageSize=26`,
        authHeader
      );

      const data: ApiResponse<District> = response.data;
      if (data.success) {
        let allDistricts: District[] = [...data.data.listData];
        if (data.data.totalPage > 1) {
          const pages = Array.from({ length: data.data.totalPage - 1 }, (_, i) => i + 2);
          const pagePromises = pages.map((page) =>
            axios
              .get(`${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_DISTRICTS}?page=${page}&pageSize=26`, authHeader)
              .then((res) => res.data.data.listData as District[])
          );
          const additionalDistricts = (await Promise.all(pagePromises)).flat() as District[];
          allDistricts = allDistricts.concat(additionalDistricts);
        }
        return allDistricts;
      } else {
        toast.error(data.message || "Lỗi khi tải danh sách quận", { position: "top-right", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-right", duration: 3000 });
        localStorage.removeItem("token");
        // window.location.href = "/login";
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return [];
    }
  }

  // Get ward by districtId
  async fetchWardsByDistrictId(districtId: number): Promise<Ward[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return []; // Trả về mảng rỗng nếu không có token
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_WARDS_BY_DISTRICT}/${districtId}?page=1&pageSize=12`,
        authHeader
      );

      const data: ApiResponse<Ward> = response.data;
      if (data.success) {
        let allWards: Ward[] = [...data.data.listData];
        if (data.data.totalPage > 1) {
          const pages = Array.from({ length: data.data.totalPage - 1 }, (_, i) => i + 2);
          const pagePromises = pages.map((page) =>
            axios
              .get(`${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_WARDS_BY_DISTRICT}/${districtId}?page=${page}&pageSize=12`, authHeader)
              .then((res) => res.data.data.listData as Ward[])
          );
          const additionalWards = (await Promise.all(pagePromises)).flat() as Ward[];
          allWards = allWards.concat(additionalWards);
        }
        return allWards;
      } else {
        toast.error(data.message || "Lỗi khi tải danh sách phường", { position: "top-right", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-right", duration: 3000 });
        localStorage.removeItem("token");
        // window.location.href = "/login";
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return [];
    }
  }

  // Get users with pagination (for Area Manager) 
  async fetchUsers(page: number = 1, pageSize: number = 5): Promise<User[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return []; // Trả về mảng rỗng nếu không có token
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_USERS}?page=${page}&pageSize=${pageSize}`,
        authHeader
      );

      console.log("API Response for Users:", response.data); // Log để debug
      const data: ApiResponse<User> = response.data;
      if (data.success) {
        let allUsers: User[] = [...data.data.listData];
        if (data.data.totalPage > 1) {
          const pages = Array.from({ length: data.data.totalPage - 1 }, (_, i) => i + 2);
          const pagePromises = pages.map((pageNum) =>
            axios
              .get(`${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_USERS}?page=${pageNum}&pageSize=${pageSize}`, authHeader)
              .then((res) => {
                console.log(`Page ${pageNum} Response for Users:`, res.data);
                return res.data.data.listData as User[];
              })
          );
          const additionalUsers = (await Promise.all(pagePromises)).flat() as User[];
          allUsers = allUsers.concat(additionalUsers);
        }
        console.log("All Users Fetched:", allUsers); // Log danh sách nhân viên cuối cùng
        return allUsers;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi tải danh sách nhân viên", { position: "top-right", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Users:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-right", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return [];
    }
  }

  // Get Tasks with pagination (for Area Manager)
  async fetchTasks(page: number = 1, pageSize: number = 10): Promise<Task[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return []; // Return empty array if no token
    }
  
    try {
      // Lấy trang đầu tiên và thông tin tổng số trang
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_TASKS}?page=${page}&pageSize=${pageSize}`,
        authHeader
      );
  
      const data: ApiResponse<Task> = response.data;
      
      if (!data.success) {
        toast.error(data.message || "Lỗi khi tải danh sách công việc", { 
          position: "top-right", duration: 3000 
        });
        return [];
      }
      
      // Lưu danh sách từ trang đầu tiên
      const allTasks: Task[] = [...data.data.listData];
      const totalPages = data.data.totalPage;
      
      // Nếu có nhiều hơn 1 trang, tải các trang còn lại tuần tự để tránh trùng lặp
      if (totalPages > 1) {
        for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
          const nextPageResponse = await axios.get(
            `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_TASKS}?page=${pageNum}&pageSize=${pageSize}`,
            authHeader
          );
          
          const nextPageData = nextPageResponse.data;
          if (nextPageData.success) {
            // Nối dữ liệu từ trang tiếp theo
            allTasks.push(...nextPageData.data.listData);
          }
        }
      }
      
      // Kiểm tra và loại bỏ các nhiệm vụ trùng lặp dựa trên ID
      const uniqueTasks = Array.from(
        new Map(allTasks.map(task => [task.id, task])).values()
      );
      
      console.log(`Fetched ${allTasks.length} tasks, ${uniqueTasks.length} unique tasks`);
      return uniqueTasks;
      
    } catch (error) {
      console.error("API Error for Tasks:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { 
          position: "top-right", duration: 3000 
        });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? 
            error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return [];
    }
  }
}

const areaManagerService = new AreaManagerService();
export default areaManagerService;