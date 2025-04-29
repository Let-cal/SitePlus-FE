import {
  adminService,
  GetUsersParams,
  UsersResponse,
} from "@/services/admin/admin.service";
import * as React from "react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface UserContextType {
  usersData: UsersResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (params: GetUsersParams) => Promise<void>;
  fetchAllUsers: (roleId?: number) => Promise<UsersResponse | null>;
  currentParams: GetUsersParams;
  updateParams: (newParams: Partial<GetUsersParams>) => void;
  refreshData: () => Promise<void>;
}

const initialParams: GetUsersParams = {
  page: 1,
  pageSize: 10,
  search: "",
  sort: "",
  roleId: undefined,
  status: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usersData, setUsersData] = useState<UsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] =
    useState<GetUsersParams>(initialParams);

  // Cache để lưu trữ dữ liệu đã tải theo tham số
  const dataCache = useRef<Record<string, UsersResponse>>({});

  // Hàm để tạo khóa cache từ tham số
  const getCacheKey = (params: GetUsersParams): string => {
    return JSON.stringify({
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || "",
      sort: params.sort || "",
      roleId: params.roleId,
      status: params.status,
    });
  };

  const fetchUsers = async (params: GetUsersParams) => {
    const cacheKey = getCacheKey(params);

    // Nếu dữ liệu đã có trong cache, sử dụng ngay
    if (dataCache.current[cacheKey]) {
      setUsersData(dataCache.current[cacheKey]);
      return;
    }

    // Nếu chưa có dữ liệu trong cache, tải mới
    setIsLoading(true);
    try {
      const response = await adminService.getAllUsers(params);
      // Lưu vào cache và cập nhật state
      dataCache.current[cacheKey] = response.data;
      setUsersData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users data");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm mới để fetch tất cả users (với pageSize lớn) cho mục đích validation
  const fetchAllUsers = async (
    roleId?: number
  ): Promise<UsersResponse | null> => {
    try {
      const params: GetUsersParams = {
        page: 1,
        pageSize: 1000, // Dùng pageSize lớn để có thể lấy tất cả user
        roleId,
      };

      const response = await adminService.getAllUsers(params);
      return response.data;
    } catch (err) {
      console.error("Error fetching all users:", err);
      return null;
    }
  };

  const updateParams = (newParams: Partial<GetUsersParams>) => {
    setCurrentParams((prev) => {
      // Nếu thay đổi bộ lọc thì reset về trang 1
      if (
        newParams.roleId !== undefined ||
        newParams.status !== undefined ||
        newParams.search !== undefined
      ) {
        return { ...prev, ...newParams, page: 1 };
      }
      return { ...prev, ...newParams };
    });
  };

  // Hàm xóa cache và tải lại dữ liệu
  const refreshData = async () => {
    // Xóa cache khi cần refresh
    dataCache.current = {};
    await fetchUsers(currentParams);
  };

  // Chỉ tải dữ liệu khi tham số thay đổi và có roleId
  useEffect(() => {
    if (currentParams.roleId) {
      fetchUsers(currentParams);
    }
  }, [currentParams]);

  return (
    <UserContext.Provider
      value={{
        usersData,
        isLoading,
        error,
        fetchUsers,
        fetchAllUsers,
        currentParams,
        updateParams,
        refreshData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
