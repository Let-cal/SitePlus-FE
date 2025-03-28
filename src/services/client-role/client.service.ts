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
  brandRequestCustomerSegment: Array<{
    customerSegmentId: number;
  }>;
  brandRequestIndustryCategory: {
    industryCategoryId: number;
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
      };
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

      // Log the response to see what's being returned
      console.log("Create brand response:", response.data);

      return response.data.data;
    } catch (error) {
      console.error("Error creating brand:", error);
      throw error;
    }
  }
  // ... các method khác
}

export default new ClientService();
