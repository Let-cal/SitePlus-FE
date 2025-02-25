import axios from "axios";
import { API_BASE_URL } from "../api-config";
import { API_ENDPOINTS } from "../api-endpoints";
interface UserUpdate {
  id: number;
  name: string;
  email: string;
}

class AdminService {
  private getAuthHeader() {
    return {
      "Content-Type": "application/json",
      accept: "*/*",
    };
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

  // ... các method khác
}

export default new AdminService();
