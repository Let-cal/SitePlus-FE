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

interface FetchUsersParams {
    search?: string;
}

// API Response interface 
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

class ManagerService {
    // Private method to get authentication header
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

    // Get users with pagination (similar to Area Manager approach)
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
}

const managerService = new ManagerService();
export default managerService;