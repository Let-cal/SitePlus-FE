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
  areaId: number;
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
  };
  siteDeals: {
    siteDealId: number;
    createdAt: string;
  }[];
  deadline: string;
  createdAt: string;
  updatedAt: string;
  isDeadlineWarning: boolean;
  daysToDeadline: number;
}

// Định nghĩa interface cho dữ liệu gửi lên khi tạo task
interface CreateTaskRequest {
  siteId?: number,
  name: string;
  description: string;
  areaId: number;
  staffId: number;
  deadline: string;
  priority: number;
}

// BrandRequest interfaces
interface StoreProfileCriteria {
  id: number;
  storeProfileId: number;
  attributeId: number;
  attributeName: string;
  maxValue: string;
  minValue: string;
  defaultValue: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreProfile {
  id: number;
  brandId: number;
  storeProfileCategoryId: number;
  storeProfileCategoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandRequestStoreProfile {
  id: number;
  storeProfileId: number;
  brandRequestId: number;
}

interface BrandRequest {
  id: number;
  brandId: number;
  brandName: string;
  nameCustomer: string;
  emailCustomer: string;
  phoneCustomer: string;
  addressCustomer: string;
  status: number;
  statusName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandRequestResponse {
  brandRequest: BrandRequest;
  brandRequestStoreProfile: BrandRequestStoreProfile;
  storeProfile: StoreProfile;
  storeProfileCriteria: StoreProfileCriteria[];
}

interface UpdateTaskRequest {
  name: string;
  description: string;
  staffId: number;
  deadline: string;
  priority: number;
  status: number;
  areaId: number;
}

// Interface cho tham số của updateSiteDealStatus
interface UpdateSiteDealStatusParams {
  id: number;
  status: number;
}

// Interface cho phản hồi của API PUT Update Site Deal Status
interface UpdateSiteDealStatusResponse {
  success: boolean;
  message: string;
  messageQdrant: string;
  totalCount: number;
}

// Định nghĩa interface cho dữ liệu chi tiết site từ API
interface SiteImage {
  id: number;
  url: string;
}

interface SiteDeal {
  proposedPrice: number;
  leaseTerm: string;
  deposit: number;
  additionalTerms: string;
  depositMonth: string;
  status: number;
  statusName: string;
  createdAt: string;
  updatedAt: string;
}

interface AttributeValue {
  id: number;
  value: string;
  additionalInfo: string;
}

interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}

interface AttributeGroup {
  id: number;
  name: string;
  attributes: Attribute[];
}

interface SiteDetail {
  id: number;
  address: string;
  size: number;
  floor: number;
  totalFloor: number;
  description: string;
  buildingName: string;
  status: number;
  statusName: string;
  areaId: number;
  areaName: string;
  districtName: string;
  cityName: string;
  siteCategoryId: number;
  siteCategoryName: string;
  images: SiteImage[];
  attributeGroups: AttributeGroup[];
  siteDeals: SiteDeal[];
}

// Định nghĩa interface cho phản hồi API chi tiết site
interface SiteDetailResponse {
  data: SiteDetail;
  success: boolean;
  message: string;
  totalCount: number;
}
// Interface cho tham số của updateTaskStatus
interface UpdateTaskStatusParams {
  taskId: number;
  status: number;
}

// Interface cho phản hồi của API PATCH Update Task Status
interface UpdateTaskStatusResponse {
  success: boolean;
  message: string;
  data: Task;
}

interface UpdateSiteStatusParams {
  siteId: number;
  status: number;
}

// Interface cho phản hồi của API PATCH Update Site Status
interface UpdateSiteStatusResponse {
  data: boolean;
  success: boolean;
  message: string;
  totalCount: number;
}

// Định nghĩa interface chung cho phản hồi API (có phân trang)
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

// Interface cho phản hồi của API POST (có thể khác với GET)
interface CreateTaskResponse {
  success: boolean;
  message: string;
  data: Task; // Task vừa được tạo
}

// Interface cho phản hồi của API GET Task by ID (không có phân trang)
interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

// Interface cho phản hồi của API GET Brand Requests (không có phân trang)
interface BrandRequestApiResponse {
  data: BrandRequestResponse[];
  success: boolean;
  message: string;
}

// Interface cho tham số của fetchTasks
interface FetchTasksParams {
  search?: string;
  status?: number;
  priority?: number;
  isCompanyTaskOnly?: boolean;
  page?: number;
  pageSize?: number;
}

interface FetchUsersParams {
  search?: string;
}

class AreaManagerService {
  // Hàm lấy token và trả về header chung cho tất cả API
  private getAuthHeader(): { headers: Record<string, string> } | null {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn", { position: "top-right", duration: 3000 });
      return null;
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
      return [];
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
      return [];
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
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return [];
    }
  }

  // Get users (for Area Manager) - Sửa để lấy toàn bộ dữ liệu và hỗ trợ tìm kiếm
  async fetchUsers(params: FetchUsersParams = {}): Promise<User[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    const { search } = params;

    try {
      // Xây dựng query string từ tham số search
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("pageSize", "1000"); // Đặt pageSize lớn để lấy toàn bộ dữ liệu
      if (search) queryParams.append("search", search);

      // Gọi API lần đầu để lấy dữ liệu
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_USERS}?${queryParams.toString()}`,
        authHeader
      );

      console.log("API Response for Users:", response.data);
      const data: ApiResponse<User> = response.data;
      if (data.success) {
        let allUsers: User[] = [...data.data.listData];
        const totalPages = data.data.totalPage;

        // Nếu có nhiều hơn 1 trang, gọi API song song để lấy dữ liệu từ các trang còn lại
        if (totalPages > 1) {
          const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
          const pagePromises = pages.map((pageNum) => {
            const pageQueryParams = new URLSearchParams();
            pageQueryParams.append("page", pageNum.toString());
            pageQueryParams.append("pageSize", "1000");
            if (search) pageQueryParams.append("search", search);

            return axios
              .get(
                `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_USERS}?${pageQueryParams.toString()}`,
                authHeader
              )
              .then((res) => {
                console.log(`Page ${pageNum} Response for Users:`, res.data);
                return res.data.data.listData as User[];
              })
              .catch((error) => {
                console.error(`Error fetching page ${pageNum}:`, error);
                return [];
              });
          });

          const additionalUsers = (await Promise.all(pagePromises)).flat() as User[];
          allUsers = allUsers.concat(additionalUsers);
        }

        // Loại bỏ các user trùng lặp (dựa trên id)
        const uniqueUsers = Array.from(
          new Map(allUsers.map(user => [user.id, user])).values()
        );

        console.log(`Fetched ${allUsers.length} users, ${uniqueUsers.length} unique users`);
        return uniqueUsers;
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

  // Get Tasks with pagination and filters (for Area Manager)
  async fetchTasks(params: FetchTasksParams = {}): Promise<Task[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    const {
      search,
      status,
      priority,
      isCompanyTaskOnly,
      page = 1,
      pageSize = 10, // Đặt pageSize mặc định là 10
    } = params;

    try {
      // Xây dựng query string từ các tham số
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      if (search) queryParams.append("search", search);
      if (status !== undefined) queryParams.append("status", status.toString());
      if (priority !== undefined) queryParams.append("priority", priority.toString());
      if (isCompanyTaskOnly !== undefined) queryParams.append("isCompanyTaskOnly", isCompanyTaskOnly.toString());

      // Gọi API lần đầu để lấy totalPage và dữ liệu trang đầu tiên
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_TASKS}?${queryParams.toString()}`,
        authHeader
      );

      const data: ApiResponse<Task> = response.data;

      if (!data.success) {
        toast.error(data.message || "Lỗi khi tải danh sách công việc", {
          position: "top-right",
          duration: 3000,
        });
        return [];
      }

      let allTasks: Task[] = [...data.data.listData];
      const totalPages = data.data.totalPage;

      // Nếu có nhiều hơn 1 trang, gọi API song song để lấy dữ liệu từ các trang còn lại
      if (totalPages > 1) {
        const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const pagePromises = pages.map((pageNum) => {
          const pageQueryParams = new URLSearchParams();
          pageQueryParams.append("page", pageNum.toString());
          pageQueryParams.append("pageSize", pageSize.toString());
          if (search) pageQueryParams.append("search", search);
          if (status !== undefined) queryParams.append("status", status.toString());
          if (priority !== undefined) queryParams.append("priority", priority.toString());
          if (isCompanyTaskOnly !== undefined) queryParams.append("isCompanyTaskOnly", isCompanyTaskOnly.toString());

          return axios
            .get(
              `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_TASKS}?${pageQueryParams.toString()}`,
              authHeader
            )
            .then((res) => {
              const pageData: ApiResponse<Task> = res.data;
              if (pageData.success) {
                return pageData.data.listData as Task[];
              }
              return [];
            })
            .catch((error) => {
              console.error(`Error fetching page ${pageNum}:`, error);
              return [];
            });
        });

        const additionalTasks = (await Promise.all(pagePromises)).flat() as Task[];
        allTasks = allTasks.concat(additionalTasks);
      }

      // Loại bỏ các task trùng lặp (dựa trên id)
      const uniqueTasks = Array.from(
        new Map(allTasks.map(task => [task.id, task])).values()
      );

      console.log(`Fetched ${allTasks.length} tasks, ${uniqueTasks.length} unique tasks`);
      return uniqueTasks;

    } catch (error) {
      console.error("API Error for Tasks:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", {
          position: "top-right",
          duration: 3000,
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

  // Get Task by ID
  async fetchTaskById(taskId: number): Promise<Task | null> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return null;
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_TASK_BY_ID}`.replace(":taskId", taskId.toString());
      const response = await axios.get(endpoint, authHeader);

      const data: TaskResponse = response.data;
      if (data.success) {
        return data.data;
      } else {
        toast.error(data.message || "Lỗi khi tải thông tin công việc", { position: "top-right", duration: 3000 });
        return null;
      }
    } catch (error) {
      console.error("API Error for Task by ID:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-right", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return null;
    }
  }

  // Create a new task (POST)
  async createTask(taskData: CreateTaskRequest): Promise<CreateTaskResponse> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      throw new Error("No token available");
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.POST.CREATE_TASK}`,
        taskData,
        authHeader
      );

      const data: CreateTaskResponse = response.data;
      if (data.success) {
        console.log("Task created successfully:", data.data);
        return data;
      } else {
        toast.error(data.message || "Lỗi khi tạo công việc", { position: "top-right", duration: 3000 });
        throw new Error(data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("API Error for Create Task:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-right", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      throw error;
    }
  }

  // Get Brand Requests
  async fetchBrandRequests(): Promise<BrandRequestResponse[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("pageSize", "1000");

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_BRAND_REQUESTS}?${queryParams.toString()}`,
        authHeader
      );

      console.log("API Response for Brand Requests:", response.data);
      const data: BrandRequestApiResponse = response.data;
      if (data.success) {
        const allBrandRequests: BrandRequestResponse[] = [...data.data];

        const uniqueBrandRequests = Array.from(
          new Map(allBrandRequests.map(item => [item.brandRequest.id, item])).values()
        );

        console.log(`Fetched ${allBrandRequests.length} brand requests, ${uniqueBrandRequests.length} unique brand requests`);
        return uniqueBrandRequests;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi tải danh sách yêu cầu thương hiệu", { position: "top-right", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Brand Requests:", error.response ? error.response.data : error.message);
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

  // Get Site by ID
  async getSiteById(siteId: number): Promise<SiteDetail | null> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return null;
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_SITE_BY_ID}`.replace(":siteId", siteId.toString());
      const response = await axios.get(endpoint, authHeader);

      const data: SiteDetailResponse = response.data;
      if (data.success) {
        return data.data;
      } else {
        toast.error(data.message || "Lỗi khi tải thông tin site", { position: "top-right", duration: 3000 });
        return null;
      }
    } catch (error) {
      console.error("API Error for Site by ID:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-right", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return null;
    }
  }

  // Update Task Status (PATCH)
  async updateTaskStatus(params: UpdateTaskStatusParams): Promise<Task | null> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return null;
    }

    const { taskId, status } = params;

    try {
      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.PATCH.UPDATE_TASK_STATUS}`,
        { taskId, status },
        authHeader
      );

      const data: UpdateTaskStatusResponse = response.data;
      if (data.success) {
        // toast.success(data.message || "Cập nhật trạng thái task thành công!", {
        //   position: "top-right",
        //   duration: 3000,
        // });
        return data.data;
      } else {
        // toast.error(data.message || "Lỗi khi cập nhật trạng thái task", {
        //   position: "top-right",
        //   duration: 3000,
        // });
        return null;
      }
    } catch (error) {
      console.error("API Error for Update Task Status:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", {
          position: "top-right",
          duration: 3000,
        });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return null;
    }
  }

  // Update Site Status (PATCH)
  async updateSiteStatus(params: UpdateSiteStatusParams): Promise<boolean> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return false;
    }

    const { siteId, status } = params;

    try {
      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.PATCH.UPDATE_SITE_STATUS}`,
        { siteId, status },
        authHeader
      );

      const data: UpdateSiteStatusResponse = response.data;
      if (data.success) {
        // toast.success(data.message || "Cập nhật trạng thái Site thành công!", {
        //   position: "top-right",
        //   duration: 3000,
        // });
        return data.data;
      } else {
        // toast.error(data.message || "Lỗi khi cập nhật trạng thái Site", {
        //   position: "top-right",
        //   duration: 3000,
        // });
        return false;
      }
    } catch (error) {
      console.error("API Error for Update Site Status:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", {
          position: "top-right",
          duration: 3000,
        });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return false;
    }
  }

  // Update Site Deal Status (PUT)
  async updateSiteDealStatus(params: UpdateSiteDealStatusParams): Promise<boolean> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return false;
    }

    const { id, status } = params;

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.PUT.UPDATE_SITE_DEAL_STATUS}`.replace(":id", id.toString());
      const response = await axios.put(
        endpoint,
        { status },
        authHeader
      );

      const data: UpdateSiteDealStatusResponse = response.data;
      if (data.success) {
        // toast.success(data.message || "Cập nhật trạng thái Site Deal thành công!", {
        //   position: "top-right",
        //   duration: 3000,
        // });
        return true;
      } else {
        // toast.error(data.message || "Lỗi khi cập nhật trạng thái Site Deal", {
        //   position: "top-right",
        //   duration: 3000,
        // });
        return false;
      }
    } catch (error) {
      console.error("API Error for Update Site Deal Status:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", {
          position: "top-right",
          duration: 3000,
        });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return false;
    }
  }

  // Update Task (PUT)
  async updateTask(taskId: number, taskData: UpdateTaskRequest): Promise<Task | null> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return null;
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.PUT.UPDATE_TASK}`.replace(":taskId", taskId.toString());
      const response = await axios.put(endpoint, taskData, authHeader);

      const data: TaskResponse = response.data;
      if (data.success) {
        // toast.success(data.message || "Cập nhật task thành công!", {
        //   position: "top-right",
        //   duration: 3000,
        // });
        return data.data;
      } else {
        toast.error(data.message || "Lỗi khi cập nhật task", {
          position: "top-right",
          duration: 3000,
        });
        return null;
      }
    } catch (error) {
      console.error("API Error for Update Task:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", {
          position: "top-right",
          duration: 3000,
        });
        localStorage.removeItem("token");
      } else {
        toast.error(
          (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-right", duration: 3000 }
        );
      }
      return null;
    }
  }
}

const areaManagerService = new AreaManagerService();
export default areaManagerService;