import axios, { AxiosResponse } from 'axios';
import { API_ENDPOINTS } from '../api-endpoints';
import { API_BASE_URL } from '../api-config';

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

interface ApiResponse<T> {
  status: string;
  message?: string;
  results: T;
}

class AdminService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: '*/*',
    };
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      const response: AxiosResponse<ApiResponse<Role[]>> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET_ROLES}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async getAllProvinces(): Promise<Province[]> {
    try {
      const response: AxiosResponse<ApiResponse<Province[]>> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET_PROVINCES}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  }

  async getDistrictsByProvince(provinceCode: string): Promise<District[]> {
    try {
      const response: AxiosResponse<ApiResponse<District[]>> = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.GET_DISTRICTS}`,
        {
          headers: this.getAuthHeader(),
          params: {
            province: provinceCode
          }
        }
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();