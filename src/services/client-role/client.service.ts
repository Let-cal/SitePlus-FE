import axios from "axios";
import { API_BASE_URL } from "../api-config";
import { API_ENDPOINTS } from "../api-endpoints";
interface UserUpdate {
  id: number;
  name: string;
  email: string;
}
interface BrandRequestPayload {
  brandRequest: {
    id: number;
    brandId: number;
    description: string;
    nameCustomer: string;
    emailCustomer: string;
    phoneCustomer: string;
    addressCustomer: string;
    status: number;
    createdAt: string;
  };
  brandRequestStoreProfile: {
    storeProfileId: number;
  };
  storeProfile: {
    storeProfileCategoryId: number;
    createdAt: string;
  };
  storeProfileCriteria: Array<{
    storeProfileId: number;
    attributeId: number;
    maxValue?: string;
    minValue?: string;
    defaultValue?: string;
    createdAt: string;
  }>;
}

export interface StoreProfileCategory {
  id: number;
  name: string;
  siteCategoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T[];
  success: boolean;
}
class ClientService {
  private getAuthHeader() {
    return {
      "Content-Type": "application/json",
      accept: "*/*",
    };
  }
  async createBrandRequest(payload: BrandRequestPayload) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.PUSH.CREATE_BRAND_REQUEST}`,
        payload,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating brand request:", error);
      throw error;
    }
  }
  // Thêm method mới để update profile
  async updateUserProfile(userData: UserUpdate): Promise<void> {
    try {
      await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.UPDATE_PROFILE}`,
        userData,
        {
          headers: this.getAuthHeader(),
        }
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
  async getIndustries() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.GET.GET_INDUSTRY}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching industries:", error);
      throw error;
    }
  }

  async getAllCustomerSegments() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.GET.GET_CUSTOMER_SEGMENT}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching customer segments:", error);
      throw error;
    }
  }

  async getCustomerSegmentsByIndustry(industryId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.GET.GET_CUSTOMER_SEGMENT_BY_INDUSTRY}/${industryId}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching segments by industry:", error);
      throw error;
    }
  }
  
  async getAllIndustryCategories() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.GET.GET_INDUSTRY_CATEGORY}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching all industry categories:", error);
      throw error;
    }
  }

  // Thêm API để lấy Industry Categories theo Industry ID
  async getIndustryCategoriesByIndustry(industryId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.GET.GET_INDUSTRY_CATEGORY_BY_INDUSTRY}/${industryId}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching industry categories by industry:", error);
      throw error;
    }
  }

  async getAllBrands() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.GET.GET_BRAND}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  }

  // API tạo brand mới
  async createBrand(brandData) {
    try {
      const payload = {
        id: 0,
        name: brandData.name,
        status: 0,
        createdAt: new Date().toISOString(),
        brandCustomerSegment: brandData.brandCustomerSegment || [],
        brandIndustryCategory: brandData.brandIndustryCategory || {
          industryCategoryId: 0,
        },
      };

      console.log(
        "Payload gửi tới API createBrand:",
        JSON.stringify(payload, null, 2)
      );

      if (!brandData.name || typeof brandData.name !== "string") {
        throw new Error("Brand name is required and must be a string");
      }

      if (!Array.isArray(brandData.brandCustomerSegment)) {
        throw new Error("brandCustomerSegment must be an array");
      }

      if (
        !brandData.brandIndustryCategory ||
        typeof brandData.brandIndustryCategory !== "object" ||
        !brandData.brandIndustryCategory.industryCategoryId
      ) {
        throw new Error("brandIndustryCategory.industryCategoryId is required");
      }

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.PUSH.CREATE_BRAND}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json-patch+json",
            accept: "*/*",
          },
        }
      );

      console.log("Create brand response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating brand:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      throw error;
    }
  }

  async getAllStoreProfileCategories(): Promise<StoreProfileCategory[]> {
    try {
      const response = await axios.get<ApiResponse<StoreProfileCategory[]>>(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.GET.GET_STORE_PROFILE_CATEGORY}`,
        {
          params: {
            page: 1,
            pageSize: 100, // Tăng số lượng để đảm bảo lấy tất cả dữ liệu
          },
          headers: this.getAuthHeader(),
        }
      );

      if (response.data.success) {
        return response.data.data.flat();
      }
      return [];
    } catch (error) {
      console.error("Error fetching store profile categories:", error);
      return [];
    }
  }

  async getStoreProfileCategoriesBySiteCategoryId(
    siteCategoryId: number
  ): Promise<StoreProfileCategory[]> {
    try {
      const allStoreProfileCategories =
        await this.getAllStoreProfileCategories();
      return allStoreProfileCategories.filter(
        (profile) => profile.siteCategoryId === siteCategoryId
      );
    } catch (error) {
      console.error("Error filtering store profile categories:", error);
      return [];
    }
  }

  async getAllSiteCategories(): Promise<SiteCategory[]> {
    try {
      const response = await axios.get<ApiResponse<SiteCategory[]>>(
        `${API_BASE_URL}${API_ENDPOINTS.CLIENT.GET.GET_SITE_CATEGORY}`,
        {
          params: {
            page: 1,
            pageSize: 50,
          },
          headers: this.getAuthHeader(),
        }
      );

      if (response.data.success) {
        return response.data.data.flat();
      }
      return [];
    } catch (error) {
      console.error("Error fetching site categories:", error);
      return [];
    }
  }

  // ... các method khác
}
export const clientService = new ClientService();