import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import * as React from "react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  userName: string | null;
  userEmail: string | null;
  userId: number | null;
  setUserName: (name: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setUserId: (id: number | null) => void;
  handleLogout: () => Promise<void>; // Changed to async
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Completely redesigned logout handler to ensure proper ordering
  const handleLogout = useCallback(async () => {
    // Set loading to true during logout to prevent ProtectedRoute from running
    setLoading(true);

    // Clear localStorage first
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("hint");
    localStorage.removeItem("name");

    // Then update all state
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    setUserEmail(null);
    setUserId(null);

    // Show notification
    enqueueSnackbar("Đăng xuất thành công", {
      variant: "info",
      preventDuplicate: true,
      anchorOrigin: {
        horizontal: "left",
        vertical: "bottom",
      },
    });

    // Wait for state to be updated before navigation
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Navigate to sign-in page with replace to clear history
    navigate("/sign-in", { replace: true });

    // Give a little more time for navigation to complete
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Then set loading to false
    setLoading(false);
  }, [enqueueSnackbar, navigate]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("hint");

    if (token) {
      setIsAuthenticated(true);
    }
    if (role) {
      setUserRole(role);
    }
    if (name) {
      setUserName(name);
    }
    if (email) {
      setUserEmail(email);
    }
    if (id && !isNaN(Number(id))) {
      setUserId(Number(id));
    } else {
      setUserId(null);
    }

    setLoading(false);
  }, []);

  // Token expiration checker
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode<{ exp: number }>(token);
          if (Date.now() >= decodedToken.exp * 1000) {
            enqueueSnackbar(
              "Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.",
              {
                variant: "warning",
                preventDuplicate: true,
                anchorOrigin: {
                  horizontal: "left",
                  vertical: "bottom",
                },
              }
            );
            handleLogout();
          }
        } catch (error) {
          console.error("Token decode error:", error);
          handleLogout();
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000);
    checkTokenExpiration();
    return () => clearInterval(interval);
  }, [handleLogout, enqueueSnackbar]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        userId,
        setUserId,
        handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
