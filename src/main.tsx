import ForgotPassPage from "@/lib/auth/pages/ForgotPassPage";
import LoginPage from "@/lib/auth/pages/LoginPage";
import RegisterPage from "@/lib/auth/pages/RegisterPage";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import AdminPage from "./lib/admin/pages/AdminPage";
import { ThemeProvider } from "./lib/all-site/ThemeProvider";
import OTP_Page from "./lib/auth/pages/OTP_Page";
import ResetPassPage from "./lib/auth/pages/ResetPassPage";
import { AuthProvider } from "./lib/auth/services/AuthContext";
import ProtectedRoute from "./lib/auth/services/ProtectedRoute";
import ContactPage from "./lib/cilent/contact-page/pages/ContactPage";
import HomePage from "./lib/cilent/homepage/pages/HomePage";
import InfoPage from "./lib/cilent/infopage/pages/InfoPage";
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
                path="/Customer-page"
                element={
                  <ProtectedRoute
                    element={<HomePage />}
                    roles={["Customer"]}
                    allowGuest={true}
                  />
                }
              />
              {/* <Route
              path="/Admin-page"
              element={
                <ProtectedRoute element={<AdminPage />} roles={["Admin"]} />
              }
            /> */}
              <Route path="/Admin-page" element={<AdminPage />} />
              <Route path="/sign-up" element={<RegisterPage />} />
              <Route path="/sign-in" element={<LoginPage />} />
              <Route path="/contact-page" element={<ContactPage />} />
              <Route path="/forgot-password" element={<ForgotPassPage />} />
              <Route path="/OTP-page" element={<OTP_Page />} />
              <Route path="/reset-page" element={<ResetPassPage />} />
              <Route path="/info-page" element={<InfoPage />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>
);
