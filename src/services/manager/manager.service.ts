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
    async fetchUsers(page: number = 1, pageSize: number = 5): Promise<User[]> {
        const authHeader = this.getAuthHeader();
        if (!authHeader) {
            return []; // Trả về mảng rỗng nếu không có token
        }

        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_USERS}?page=${page}&pageSize=${pageSize}`,
                authHeader
            );

            console.log("API Response for Users (First Page):", JSON.stringify(response.data, null, 2)); // Detailed logging
            const data: ApiResponse<User> = response.data;
            if (data.success) {
                let allUsers: User[] = [...data.data.listData];

                // Log first page details
                console.log(`First Page Details:
            - Total Pages: ${data.data.totalPage}
            - Total Records: ${data.data.totalRecords}
            - Current Page: ${data.data.page}
            - Users on First Page: ${allUsers.length}`);

                if (data.data.totalPage > 1) {
                    const pages = Array.from({ length: data.data.totalPage - 1 }, (_, i) => i + 2);
                    const pagePromises = pages.map((pageNum) =>
                        axios
                            .get(`${API_BASE_URL}${API_ENDPOINTS.MANAGER.GET.GET_USERS}?page=${pageNum}&pageSize=${pageSize}`, authHeader)
                            .then((res) => {
                                console.log(`Page ${pageNum} Response for Users:`, JSON.stringify(res.data, null, 2));
                                return res.data.data.listData as User[];
                            })
                    );
                    const additionalUsers = (await Promise.all(pagePromises)).flat() as User[];
                    allUsers = allUsers.concat(additionalUsers);
                }

                console.log(`All Users Fetched:
                - Total Pages Processed: ${data.data.totalPage}
                - Total Users Retrieved: ${allUsers.length}
                - Users Details:`, JSON.stringify(allUsers, null, 2));

                return allUsers;
            } else {
                console.error("API Error: Success is false", data.message);
                toast.error(data.message || "Lỗi khi tải danh sách nhân viên", { position: "top-right", duration: 3000 });
                return [];
            }
        } catch (error) {
            console.error("API Error for Users:", {
                errorResponse: error.response ? JSON.stringify(error.response.data, null, 2) : null,
                errorMessage: error.message,
                errorConfig: error.config
            });

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", { position: "top-right", duration: 3000 });
                localStorage.removeItem("token");
                // Uncomment if you want to redirect to login
                // window.location.href = "/login";
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