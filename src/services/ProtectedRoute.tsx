import { useSnackbar } from "notistack";
import * as React from "react";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Reset notification state when route changes
  useEffect(() => {
    setShowNotification(false);
    setShouldRedirect(false);
  }, [location.pathname]);

  // Handle redirections and notifications
  useEffect(() => {
    // Skip all checks if we're still loading
    if (loading) {
      return;
    }

    // Special handling for sign-in page - always allow access
    if (location.pathname === "/sign-in") {
      return;
    }

    // Check if guest is allowed for current route
    if (!isAuthenticated && !allowGuest) {
      // Only set redirect if not already set to avoid loops
      if (!shouldRedirect) {
        setShouldRedirect(true);
      }
      return;
    }

    // Check role restrictions
    if (
      isAuthenticated &&
      roles &&
      roles.length > 0 &&
      userRole &&
      !roles.includes(userRole)
    ) {
      // Only set redirect if not already set to avoid loops
      if (!shouldRedirect) {
        setShouldRedirect(true);
      }
      return;
    }

    // Reset redirect flag if we passed all checks
    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [
    isAuthenticated,
    userRole,
    roles,
    loading,
    allowGuest,
    location.pathname,
    shouldRedirect,
  ]);

  // Separate effect for actual redirection to avoid loops
  useEffect(() => {
    if (loading || !shouldRedirect) {
      return;
    }

    if (!isAuthenticated && !allowGuest) {
      // This is the login case - redirect to sign-in
      if (!showNotification) {
        enqueueSnackbar("You need to sign in to access this page.", {
          variant: "info",
          preventDuplicate: true,
          anchorOrigin: {
            horizontal: "left",
            vertical: "bottom",
          },
        });
        setShowNotification(true);
      }
      navigate("/sign-in", { replace: true });
      return;
    }

    if (
      isAuthenticated &&
      roles &&
      roles.length > 0 &&
      userRole &&
      !roles.includes(userRole)
    ) {
      // This is the unauthorized role case
      // if (!showNotification) {
      //   enqueueSnackbar("You do not have permission to access this page.", {
      //     variant: "error",
      //     preventDuplicate: true,
      //     anchorOrigin: {
      //       horizontal: "left",
      //       vertical: "bottom",
      //     },
      //   });
      //   setShowNotification(true);
      // }

      // Navigate based on userRole
      switch (userRole) {
        case "Admin":
          navigate("/admin-page", { replace: true });
          break;
        case "Manager":
          navigate("/manager-page", { replace: true });
          break;
        case "Area-Manager":
          navigate("/area-manager-page", { replace: true });
          break;
        case "Staff":
          navigate("/staff-page", { replace: true });
          break;
        default:
          navigate("/home-page", { replace: true });
          break;
      }
    }
  }, [
    shouldRedirect,
    isAuthenticated,
    navigate,
    userRole,
    roles,
    showNotification,
    loading,
    allowGuest,
    enqueueSnackbar,
  ]);

  // If we're still loading, don't render anything
  if (loading) {
    return null;
  }

  // For the login page, always render
  if (location.pathname === "/sign-in") {
    return <>{element}</>;
  }

  // For protected pages, only render if we pass auth checks
  if (!isAuthenticated && !allowGuest) {
    return null;
  }

  // For role-protected pages
  if (
    isAuthenticated &&
    roles &&
    roles.length > 0 &&
    userRole &&
    !roles.includes(userRole)
  ) {
    return null;
  }

  // If we pass all checks, render the element
  return <>{element}</>;
};

export default ProtectedRoute;
