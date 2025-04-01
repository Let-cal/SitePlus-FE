import axios from "axios";
import { API_BASE_URL } from "../api-config";
import { API_ENDPOINTS } from "../api-endpoints";
import toast from "react-hot-toast";

// User interface 
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

// Interface cho kết quả tìm kiếm bằng AI
interface Project {
  id: number;
  nameSite?: string; // Tùy chọn, dùng cho API searchByAI
  imageUrl: string;
  score?: number; // Tùy chọn, chỉ có trong API searchByAI
  siteCategoryName?: string; // Thêm từ API GET_FAVORITES
  area?: string; // Thêm từ API GET_FAVORITES
  address?: string; // Thêm từ API GET_FAVORITES
  size?: number; // Thêm từ API GET_FAVORITES
  floor?: number; // Thêm từ API GET_FAVORITES
  totalFloor?: number; // Thêm từ API GET_FAVORITES
  description?: string; // Thêm từ API GET_FAVORITES
  statusName?: string; // Thêm từ API GET_FAVORITES
  buildingName?: string; // Thêm từ API GET_FAVORITES
}

interface SearchAIResponse {
  status: string;
  data: {
    requestId: number;
    numberOfProjects: number;
    projects: Project[];
  };
}

// Interface cho response của API cập nhật status
interface UpdateStatusResponse {
  success: boolean;
  message: string;
  messageQdrant: string;
  totalCount: number;
}

// Interface cho response của API update matched site
interface UpdateMatchedSiteResponse {
  success: boolean;
  message: string;
}

// Interface cho response của API lấy danh sách favorites
interface FetchFavoritesResponse {
  data: {
    closedSites: any[];
    matchedSites: Project[];
  };
  success: boolean;
  message: string;
  totalCount: number;
}

interface FetchUsersParams {
  search?: string;
}

// API Response interface for Brand Requests (danh sách)
interface BrandRequestApiResponse {
  data: BrandRequestResponse[];
  success: boolean;
  message: string;
}

// API Response interface for Brand Request by ID (chi tiết)
interface BrandRequestDetailApiResponse {
  data: BrandRequestResponse;
  success: boolean;
  totalCount: number;
  message?: string; // Đặt message là tùy chọn
}

// API Response interface for Users
interface UserApiResponse {
  data: {
    page: number;
    totalPage: number;
    totalRecords: number;
    listData: User[];
  };
  success: boolean;
  message: string;
}

class ManagerService {
  private getAuthHeader(isPatch: boolean = false): { headers: Record<string, string> } | null {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn", { position: "top-left", duration: 3000 });
      return null;
    }

    return {
      headers: {
        "Content-Type": isPatch ? "application/json-patch+json" : "application/json",
        "Authorization": `Bearer ${token}`,
        "accept": "*/*",
      },
    };
  }

  async fetchUsers(params: FetchUsersParams = {}): Promise<User[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    const { search } = params;

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("pageSize", "1000");
      if (search) queryParams.append("search", search);

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AREA_MANAGER.GET.GET_USERS}?${queryParams.toString()}`,
        authHeader
      );

      console.log("API Response for Users:", response.data);
      const data: UserApiResponse = response.data;
      if (data.success) {
        let allUsers: User[] = [...data.data.listData];
        const totalPages = data.data.totalPage;

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

        const uniqueUsers = Array.from(
          new Map(allUsers.map(user => [user.id, user])).values()
        );

        console.log(`Fetched ${allUsers.length} users, ${uniqueUsers.length} unique users`);
        return uniqueUsers;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi tải danh sách nhân viên", { position: "top-left", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Users:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return [];
    }
  }

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
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_BRAND_REQUESTS}?${queryParams.toString()}`,
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
        toast.error(data.message || "Lỗi khi tải danh sách yêu cầu thương hiệu", { position: "top-left", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Brand Requests:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return [];
    }
  }

  async fetchBrandRequestById(brandRequestId: number): Promise<BrandRequestResponse | null> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return null;
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_BRAND_REQUEST_BY_ID}`.replace(":brandRequestId", brandRequestId.toString());
      const response = await axios.get(endpoint, authHeader);

      console.log("API Response for Brand Request by ID:", response.data);
      const data: BrandRequestDetailApiResponse = response.data;
      if (data.success) {
        return data.data;
      } else {
        console.log("API Error: Success is false", data.message || "No message provided");
        toast.error(data.message || "Lỗi khi tải chi tiết yêu cầu thương hiệu", { position: "top-left", duration: 3000 });
        return null;
      }
    } catch (error) {
      console.error("API Error for Brand Request by ID:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return null;
    }
  }

  // Phương thức Tìm kiếm bằng AI
  async searchByAI(requestId: number, limit: number = 6): Promise<Project[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("requestId", requestId.toString());
      queryParams.append("limit", limit.toString());

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.SEARCH_BY_AI}?${queryParams.toString()}`,
        authHeader
      );

      console.log("API Response for Search by AI:", response.data);
      const data: SearchAIResponse = response.data;
      if (data.status === "ok" && data.data.projects) {
        return data.data.projects;
      } else {
        console.log("API Error: Status is not ok", data.status);
        toast.error("Không tìm thấy kết quả từ AI", { position: "top-left", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Search by AI:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return [];
    }
  }

  // Phương thức Cập nhật status của brand request
  async updateBrandRequestStatus(requestId: number, status: number): Promise<boolean> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return false;
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.MANAGER.PUT.UPDATE_BRAND_REQUEST_STATUS}`.replace(":id", requestId.toString());
      const body = {
        status: status,
        updateAt: new Date().toISOString(),
      };

      const response = await axios.put(endpoint, body, authHeader);

      console.log("API Response for Update Status:", response.data);
      const data: UpdateStatusResponse = response.data;
      if (data.success) {
        return true;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi cập nhật status", { position: "top-left", duration: 3000 });
        return false;
      }
    } catch (error) {
      console.error("API Error for Update Status:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return false;
    }
  }

  // Phương thức Thêm site vào kho quan tâm (matched sites)
  async updateMatchedSite(requestId: number, siteId: number, score: number): Promise<boolean> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return false;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("requestId", requestId.toString());
      queryParams.append("siteId", siteId.toString());
      queryParams.append("score", score.toString());

      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.PUT.UPDATE_MATCHED_SITE}?${queryParams.toString()}`,
        {},
        authHeader
      );

      console.log("API Response for Update Matched Site:", response.data);
      const data: UpdateMatchedSiteResponse = response.data;
      if (data.success) {
        return true;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi thêm site vào kho quan tâm", { position: "top-left", duration: 3000 });
        return false;
      }
    } catch (error) {
      console.error("API Error for Update Matched Site:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return false;
    }
  }

  // Phương thức Cập nhật status của site
  async updateSiteStatus(siteId: number, status: number): Promise<boolean> {
    const authHeader = this.getAuthHeader(true);
    if (!authHeader) {
      return false;
    }

    try {
      const body = {
        siteId: siteId,
        status: status,
      };

      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.MANAGER.PATCH.UPDATE_SITE_STATUS}`,
        body,
        authHeader
      );

      console.log("API Response for Update Site Status:", response.data);
      const data: UpdateStatusResponse = response.data;
      if (data.success) {
        return true;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi cập nhật status của site", { position: "top-left", duration: 3000 });
        return false;
      }
    } catch (error) {
      console.error("API Error for Update Site Status:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi kết nối API: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return false;
    }
  }

  // Phương thức Lấy danh sách site đã quan tâm (favorites)
  async fetchFavorites(requestId: number): Promise<Project[]> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return [];
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_FAVORITES}`.replace(":requestId", requestId.toString());
      const response = await axios.get(endpoint, authHeader);

      console.log("API Response for Fetch Favorites:", response.data);
      const data: FetchFavoritesResponse = response.data;
      if (data.success) {
        // Gán address hoặc buildingName + address làm nameSite để hiển thị
        const favorites = data.data.matchedSites.map((site) => ({
          ...site,
          nameSite: site.buildingName ? `${site.buildingName}, ${site.address}` : site.address,
        }));
        return favorites;
      } else {
        console.log("API Error: Success is false", data.message);
        toast.error(data.message || "Lỗi khi tải danh sách quan tâm", { position: "top-left", duration: 3000 });
        return [];
      }
    } catch (error) {
      console.error("API Error for Fetch Favorites:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
          localStorage.removeItem("token");
        } else if (error.response?.status === 404) {
          // Nếu lỗi 404, không hiển thị toast, chỉ trả về mảng rỗng
          return [];
        } else {
          toast.error(
            "Lỗi kết nối API: " + (error.response?.data?.message || error.message),
            { position: "top-left", duration: 3000 }
          );
        }
      } else {
        toast.error("Lỗi kết nối API: Không xác định", { position: "top-left", duration: 3000 });
      }
      return [];
    }
  }

  // Phương thức Xuất PDF
  async exportPDF(brandRequestId: number): Promise<Blob | null> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      return null;
    }

    try {
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.EXPORT_PDF}`.replace(":brandRequestId", brandRequestId.toString());
      const response = await axios.get(endpoint, {
        ...authHeader,
        responseType: "blob", // Đặt responseType là blob để nhận file PDF
      });

      console.log("API Response for Export PDF:", response);
      return response.data; // Trả về file PDF dưới dạng Blob
    } catch (error) {
      console.error("API Error for Export PDF:", error.response ? error.response.data : error.message);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-left", duration: 3000 });
        localStorage.removeItem("token");
      } else {
        toast.error(
          "Lỗi khi xuất PDF: " + (axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Không xác định"),
          { position: "top-left", duration: 3000 }
        );
      }
      return null;
    }
  }
}

const managerService = new ManagerService();
export default managerService;