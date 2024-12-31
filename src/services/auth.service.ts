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
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface VerifyOTPRequest {
  email: string;
  codeOTP: string;
}
interface ResetPasswordRequest {
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

      // Store token in localStorage if login successful
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.role);
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

  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
        null,
        {
          params: { email },
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

  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.VERIFY_OTP}`,
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
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASS}`,
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
