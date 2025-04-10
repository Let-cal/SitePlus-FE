import LoginPage from "@/lib/auth/pages/LoginPage";
import RegisterPage from "@/lib/auth/pages/RegisterPage";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import AdminPage from "./lib/admin/pages/AdminPage";
import AdminUserPage from "./lib/admin/pages/AdminUserPage";
import { ThemeProvider } from "./lib/all-site/ThemeProvider";
import AreaManagerPage from "./lib/area-manager/pages/AreaManagerPage";
import AreaManagerSiteCheck from "./lib/area-manager/pages/AreaManagerSiteCheck";
import AreaManagerTask from "./lib/area-manager/pages/AreaManagerTask";
import ManagerPage from "./lib/manager/pages/ManagerPage";
import ManagerRequest from "./lib/manager/pages/ManagerRequest";
import ManagerSite from "./lib/manager/pages/ManagerSite";
import ManagerTask from "./lib/manager/pages/ManagerTask";
import ContactPage from "./lib/User/contact-page/pages/ContactPage";
import HomePage from "./lib/User/homepage/pages/HomePage";
import InfoPage from "./lib/User/infopage/pages/InfoPage";
import SurveyRequestsPage from "./lib/User/send-requests-page/pages/SurveyRequestsPage";
import { AuthProvider } from "./services/AuthContext";
import ProtectedRoute from "./services/ProtectedRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={3000}
    >
      {" "}
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* Redirect root to /home-page */}

              <Route
                path="/"
                element={
                  <ProtectedRoute element={<HomePage />} allowGuest={true} />
                }
              />
              <Route
                path="/home-page"
                element={
                  <ProtectedRoute element={<HomePage />} allowGuest={true} />
                }
              />
              <Route
                path="/admin-page"
                element={
                  <ProtectedRoute element={<AdminPage />} roles={["Admin"]} />
                }
              />
              <Route
                path="/admin-users"
                element={
                  <ProtectedRoute
                    element={<AdminUserPage />}
                    roles={["Admin"]}
                  />
                }
              />
              <Route
                path="/survey-requests-page"
                element={<SurveyRequestsPage />}
              />

              <Route path="/sign-up" element={<RegisterPage />} />
              <Route path="/sign-in" element={<LoginPage />} />
              <Route path="/contact-page" element={<ContactPage />} />
              <Route path="/info-page" element={<InfoPage />} />

              <Route
                path="/manager-page"
                element={
                  <ProtectedRoute
                    element={<ManagerPage />}
                    roles={["Manager"]}
                  />
                }
              />
              <Route
                path="/manager-request"
                element={
                  <ProtectedRoute
                    element={<ManagerRequest />}
                    roles={["Manager"]}
                  />
                }
              />
              <Route
                path="/manager-task"
                element={
                  <ProtectedRoute
                    element={<ManagerTask />}
                    roles={["Manager"]}
                  />
                }
              />
              <Route
                path="/manager-site"
                element={
                  <ProtectedRoute
                    element={<ManagerSite />}
                    roles={["Manager"]}
                  />
                }
              />
              <Route
                path="/area-manager-page"
                element={
                  <ProtectedRoute
                    element={<AreaManagerPage />}
                    roles={["Area-Manager"]}
                  />
                }
              />
              <Route
                path="/area-manager-task"
                element={
                  <ProtectedRoute
                    element={<AreaManagerTask />}
                    roles={["Area-Manager"]}
                  />
                }
              />
              <Route
                path="/area-manager-sitecheck"
                element={
                  <ProtectedRoute
                    element={<AreaManagerSiteCheck />}
                    roles={["Area-Manager"]}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>
);
