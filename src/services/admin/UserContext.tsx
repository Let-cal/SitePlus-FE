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
  useState,
} from "react";
interface UserContextType {
  usersData: UsersResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (params: GetUsersParams) => Promise<void>;
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

  const fetchUsers = async (params: GetUsersParams) => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllUsers(params);
      setUsersData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateParams = (newParams: Partial<GetUsersParams>) => {
    setCurrentParams((prev) => {
      // If changing filters that should reset pagination
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

  const refreshData = async () => {
    await fetchUsers(currentParams);
  };

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
