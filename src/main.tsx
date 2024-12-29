import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import LoginPage from "./lib/cilent/auth/pages/LoginPage";
import RegisterPage from "./lib/cilent/auth/pages/RegisterPage";
import ContactPage from "./lib/cilent/contactpage/pages/ContactPage";
import HomePage from "./lib/cilent/homepage/pages/HomePage";
import InfoPage from "./lib/cilent/infopage/pages/InfoPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /home-page */}
        <Route path="/" element={<Navigate to="/home-page" replace />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/sign-up" element={<RegisterPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/contact-page" element={<ContactPage />} />
        <Route path="/info-page" element={<InfoPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
