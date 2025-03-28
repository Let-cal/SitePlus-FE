import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE_URL } from "./api-config";
import { API_ENDPOINTS } from "./api-endpoints";

interface ApiResponse {
  data: unknown | null;
  success: boolean;
  message?: string;
  error: string | null;
  hint: string | null;
  errorMessages: string[] | null;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  role: string;
  hint: number;
  name: string;
  areaId: number;
  area: string;
  districtId: number;
  district: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      console.log("API Response:", response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("areaId", response.data.areaId.toString());
        localStorage.setItem("area", response.data.area);
        localStorage.setItem("districtId", response.data.districtId.toString());
        localStorage.setItem("district", response.data.district);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message = axiosError.response?.data?.message || "An error occurred";
      return new Error(message);
    }
    return new Error("Network error occurred");
  }
}

export const authService = new AuthService();
