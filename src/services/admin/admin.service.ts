import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "../api-config";
import { API_ENDPOINTS } from "../api-endpoints";
export interface UserRoleCountByMonth {
  month: number;
  manager: number;
  areaManager: number;
  staff: number;
}
interface TotalResponse {
  total: number;
  todayTotal: number;
  percentageChange: number;
  trend: "Up" | "Down" | "Neutral";
}
export interface User {
  id: number;
  email: string;
  name: string;
  roleName: string;
  areaName?: string;
  areaId: number;
  districtName?: string;
  cityName?: string;
  statusName: string;
  status: boolean;
  createdAt: string;
  passWord: string;
}
export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  roleId?: number;
  status?: boolean | null;
}
export interface UsersResponse {
  page: number;
  totalPage: number;
  totalRecords: number;
  listData: User[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
type MonthlyData = {
  month: number;
  total: number;
};

export interface District {
  id: number;
  name: string;
  cityId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: number;
  name: string;
  districtId: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  page: number;
  totalPage: number;
  totalRecords: number;
  listData: T[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  roleId: number;
  areaId: number;
}

export interface CreateUserResponse {
  email: string;
  password: string;
  name: string;
  roleId: number;
  areaId: number;
}

interface AdminApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string | null;
  hint?: string | null;
  errorMessages?: string[] | null;
}
export interface ApiResponse<T> {
  data: T[];
  success: boolean;
}
class AdminService {
  private getAuthHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      accept: "*/*",
    };
  }

  private getAuthHeaderForCreateUser() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json-patch+json",
      accept: "*/*",
    };
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      const response: AxiosResponse<AdminApiResponse<Role[]>> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ROLES}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  }

  async getAllDistricts(
    page: number = 1,
    pageSize: number = 100
  ): Promise<District[]> {
    try {
      const response: AxiosResponse<
        AdminApiResponse<PaginatedResponse<District>>
      > = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_DISTRICTS}?page=${page}&pageSize=${pageSize}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data.data.listData || [];
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error;
    }
  }

  async getAllAreas(page: number = 1, pageSize: number = 100): Promise<Area[]> {
    try {
      const response: AxiosResponse<AdminApiResponse<PaginatedResponse<Area>>> =
        await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_AREAS}?page=${page}&pageSize=${pageSize}`,
          {
            headers: this.getAuthHeader(),
          }
        );
      return response.data.data.listData || [];
    } catch (error) {
      console.error("Error fetching all areas:", error);
      throw error;
    }
  }
  async getAreasByDistrict(
    districtId: number,
    page: number = 1,
    pageSize: number = 100
  ): Promise<Area[]> {
    try {
      const response: AxiosResponse<AdminApiResponse<PaginatedResponse<Area>>> =
        await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_AREA_BY_DISTRICTS}/${districtId}?page=${page}&pageSize=${pageSize}`,
          {
            headers: this.getAuthHeader(),
          }
        );
      return response.data.data.listData || [];
    } catch (error) {
      console.error("Error fetching areas:", error);
      throw error;
    }
  }

  async createUser(
    userData: CreateUserRequest
  ): Promise<AdminApiResponse<CreateUserResponse>> {
    try {
      const response: AxiosResponse<AdminApiResponse<CreateUserResponse>> =
        await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.ADMIN.POST.CREATE_USER}`,
          userData,
          {
            headers: this.getAuthHeaderForCreateUser(),
          }
        );
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllUsers(
    params: GetUsersParams
  ): Promise<AdminApiResponse<UsersResponse>> {
    try {
      // Convert boolean status to string format expected by API
      let statusParam = undefined;
      if (params.status !== null && params.status !== undefined) {
        statusParam = params.status ? "Available" : "Disabled";
      }

      const response: AxiosResponse<AdminApiResponse<UsersResponse>> =
        await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_USERS}`, {
          headers: this.getAuthHeader(),
          params: {
            page: params.page || 1,
            pageSize: params.pageSize || 1000,
            search: params.search || "",
            sort: params.sort || "",
            roleId: params.roleId,
            status: statusParam,
          },
        });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  async updateUser(data: {
    id: number;
    roleId: number;
    status: number;
    areaId: number;
    password?: string;
  }) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.POST.UPDATE_USRES}/${data.id}`,
        data,
        { headers: this.getAuthHeaderForCreateUser() } // Sử dụng header với Content-Type: application/json-patch+json
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async getTotalUsers(): Promise<TotalResponse> {
    try {
      const response: AxiosResponse<TotalResponse> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_TOTAL_USERS}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total users:", error);
      return { total: 0, todayTotal: 0, percentageChange: 0, trend: "Neutral" };
    }
  }

  async getTotalStaff(): Promise<TotalResponse> {
    try {
      const response: AxiosResponse<TotalResponse> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_TOTAL_STAFF}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total staff:", error);
      return { total: 0, todayTotal: 0, percentageChange: 0, trend: "Neutral" };
    }
  }

  async getTotalSites(): Promise<TotalResponse> {
    try {
      const response: AxiosResponse<TotalResponse> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_TOTAL_SITES}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total sites:", error);
      return { total: 0, todayTotal: 0, percentageChange: 0, trend: "Neutral" };
    }
  }

  async getTotalReports(): Promise<TotalResponse> {
    try {
      const response: AxiosResponse<TotalResponse> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_TOTAL_REPORTS}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total reports:", error);
      return { total: 0, todayTotal: 0, percentageChange: 0, trend: "Neutral" };
    }
  }
  async getTotalUsersByMonth(year: number): Promise<MonthlyData[]> {
    try {
      const response: AxiosResponse<MonthlyData[]> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_TOTAL_USERS_BY_MONTH}?year=${year}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total users by month:", error);
      return [];
    }
  }

  async getTotalRequestsByMonth(year: number): Promise<MonthlyData[]> {
    try {
      const response: AxiosResponse<MonthlyData[]> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_TOTAL_REQUESTS_BY_MONTH}?year=${year}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total requests by month:", error);
      return [];
    }
  }
  async getUserCountByRolePerMonth(
    year: string
  ): Promise<UserRoleCountByMonth[]> {
    try {
      const response: AxiosResponse<UserRoleCountByMonth[]> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_USER_COUNT_BY_ROLE_PER_MONTH}/${year}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user count by role per month:", error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
