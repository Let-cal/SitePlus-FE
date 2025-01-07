import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "../api-config";
import { API_ENDPOINTS } from "../api-endpoints";

interface User {
  id: number;
  name: string;
  email: string;
  roleName: string;
  area?: string;
  status: boolean;
}

interface GetUsersRequest {
  roleId: number;
  status: boolean | null;
  page: number;
  pageSize: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: {
    listData: T;
    totalPage: number;
  };
  success: boolean;
  message?: string;
  error: string | null;
  hint: string | null;
  errorMessages: string[] | null;
}

interface Province {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
  province: string;
}

interface Role {
  id: number;
  name: string;
  accounts: null;
}
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleId: number;
  area: string | null;
}
interface AdminApiResponse {
  data: unknown | null;
  success: boolean;
  message?: string;
  error: string | null;
  hint: string | null;
  errorMessages: string[] | null;
}
interface ApiResponse<T> {
  status: string;
  message?: string;
  results: T;
}
interface RatingRequest {
  id: number;
  name: string;
  title: string;
  description: string;
  taxCode: string;
  specificAddress: string;
  industry: string;
  areaSize: number;
  status: number;
  scoreCheck: number;
  reason: string;
  addressId: number;
  clientId: number;
  taskId: number;
}

interface SurveyRequest {
  id: number;
  name: string;
  title: string;
  description: string;
  taxCode: string;
  expectedRentalPrice: number;
  preferredArea: string;
  industry: string;
  expectedTime: string;
  status: number;
  scoreCheck: number;
  reason: string;
  clientId: number;
  taskId: number;
}

interface RequestResponse<T> {
  data: T;
  success: boolean;
  message: string | null;
  error: string | null;
  errorMessages: string[] | null;
}
interface CompletedTask {
  staffId: number;
  staffName: string;
  completedTasksCount: number;
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

  async getAllRoles(): Promise<Role[]> {
    try {
      const response: AxiosResponse<ApiResponse<Role[]>> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ROLES}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data.results;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  }

  async getAllProvinces(): Promise<Province[]> {
    try {
      const response: AxiosResponse<ApiResponse<Province[]>> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_PROVINCES}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data.results;
    } catch (error) {
      console.error("Error fetching provinces:", error);
      throw error;
    }
  }

  async getDistrictsByProvince(provinceCode: string): Promise<District[]> {
    try {
      const response: AxiosResponse<ApiResponse<District[]>> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_DISTRICTS}`,
        {
          headers: this.getAuthHeader(),
          params: {
            province: provinceCode,
          },
        }
      );
      return response.data.results;
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error;
    }
  }
  async createUser(userData: CreateUserRequest): Promise<AdminApiResponse> {
    try {
      const response: AxiosResponse<AdminApiResponse> = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.CREATE_STAFF}`,
        userData,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  async getAllUsers(
    request: GetUsersRequest
  ): Promise<PaginatedResponse<User[]>> {
    try {
      const response: AxiosResponse<PaginatedResponse<User[]>> =
        await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_USERS}`,
          {
            headers: this.getAuthHeader(),
            params: {
              roleId: request.roleId,
              status: request.status,
              page: request.page,
              pageSize: request.pageSize,
              search: request.search,
            },
          }
        );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  async updateUser(data: { id: number; area?: string; status: boolean }) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.POST.UPDATE_USRES}`,
        data,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async getRatingRequests(
    page: number,
    pageSize: number
  ): Promise<RequestResponse<RatingRequest>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_RATING_REQUESTS}`,
        {
          headers: this.getAuthHeader(),
          params: { page, pageSize },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching rating requests:", error);
      throw error;
    }
  }

  async getSurveyRequests(
    page: number,
    pageSize: number
  ): Promise<RequestResponse<SurveyRequest>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_SURVEY_REQUESTS}`,
        {
          headers: this.getAuthHeader(),
          params: { page, pageSize },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching survey requests:", error);
      throw error;
    }
  }
  async getRatingRequestDetails(
    id: number
  ): Promise<RequestResponse<RatingRequest>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/RatingRequest/ratingRequest/${id}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching rating request details:", error);
      throw error;
    }
  }

  async getSurveyRequestDetails(
    id: number
  ): Promise<RequestResponse<SurveyRequest>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/SurveyRequest/surveyRequest/${id}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching survey request details:", error);
      throw error;
    }
  }

  async getTotalUsers() {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_USERS_COUNT}`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async getTotalCustomers() {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_USERS_BY_ROLES_COUNT}`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data.Customer;
  }

  async getTotalRatings() {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_RATING_REQUESTS_COUNT}`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async getTotalSurveys() {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_SURVEY_REQUESTS_COUNT}`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }
  async getCompletedTasks(): Promise<CompletedTask[]> {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET.GET_ALL_TASKS_COMPLETED_COUNT}`,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }
}

export const adminService = new AdminService();
