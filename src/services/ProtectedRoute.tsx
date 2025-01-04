import { useSnackbar } from "notistack";
import * as React from "react";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  element: ReactNode;
  roles?: string[];
  allowGuest?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  roles,
  allowGuest = false,
}) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !allowGuest) {
        navigate("/sign-in");
        enqueueSnackbar("You do not have permission to access this page.", {
          variant: "error",
          preventDuplicate: true,
          anchorOrigin: {
            horizontal: "left",
            vertical: "bottom",
          },
        });
        setShowNotification(true);
      } else if (roles && !roles.includes(userRole!) && isAuthenticated) {
        if (!showNotification) {
          enqueueSnackbar("You do not have permission to access this page.", {
            variant: "error",
            preventDuplicate: true,
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });
          setShowNotification(true);
        }

        // Navigate based on userRole
        switch (userRole) {
          case "Admin":
            navigate("/admin-page");
            break;
          case "Customer":
            navigate("/customer-page");
            break;
          case "Manager":
            navigate("/manager-page");
            break;
          case "Area-Manager":
            navigate("/area-manager-page");
            break;
          case "Staff":
            navigate("/staff-page");
            break;
        }
      }
    }
  }, [
    isAuthenticated,
    navigate,
    userRole,
    roles,
    showNotification,
    loading,
    allowGuest,
    enqueueSnackbar,
  ]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated && !allowGuest) {
    return null;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
