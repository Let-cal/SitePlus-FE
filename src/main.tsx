import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./lib/cilent/auth/pages/LoginPage";
import HomePage from "./lib/cilent/homepage/pages/HomePage";
import RegisterPage from "./lib/cilent/auth/pages/RegisterPage";
import ContactPage from "./lib/cilent/contactpage/pages/ContactPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/sign-up" element={<RegisterPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/contact-page" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
