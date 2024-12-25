import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import LoginPage from "./lib/cilent/auth/pages/LoginPage";
// import RegisterPage from "./lib/cilent/auth/pages/RegisterPage";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  </StrictMode>
);
