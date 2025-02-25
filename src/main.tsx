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
import AreaManagerSend from "./lib/area-manager/pages/AreaManagerSend";
import AreaManagerSurvey from "./lib/area-manager/pages/AreaManagerSurvey";
import AreaManagerTask from "./lib/area-manager/pages/AreaManagerTask";
import ManagerPage from "./lib/manager/pages/ManagerPage";
import ManagerRequest from "./lib/manager/pages/ManagerRequest";
import ManagerSite from "./lib/manager/pages/ManagerSite";
import ManagerTask from "./lib/manager/pages/ManagerTask";
import ContactPage from "./lib/User/contact-page/pages/ContactPage";
import HomePage from "./lib/User/homepage/pages/HomePage";
import InfoPage from "./lib/User/infopage/pages/InfoPage";
import RatingRequestsPage from "./lib/User/send-requests-page/pages/RatingRequestsPage";
import SurveyRequestsPage from "./lib/User/send-requests-page/pages/SurveyRequestsPage";
import RequestReportPage from "./lib/User/view-requests-reports-page/pages/RequestReportPage";
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
                path="/customer-page"
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
                path="/rating-requests-page"
                element={<RatingRequestsPage />}
              />
              <Route
                path="/survey-requests-page"
                element={<SurveyRequestsPage />}
              />
              <Route path="/khoa-sat-cua-ban" element={<RequestReportPage />} />

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
                path="/area-manager-survey"
                element={
                  <ProtectedRoute
                    element={<AreaManagerSurvey />}
                    roles={["Area-Manager"]}
                  />
                }
              />
              <Route
                path="/area-manager-send"
                element={
                  <ProtectedRoute
                    element={<AreaManagerSend />}
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



