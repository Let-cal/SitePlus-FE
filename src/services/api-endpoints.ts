// src/services/api-endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    FORGOT_PASSWORD: "/api/Authen/forgot-password",
    REGISTER: "/api/Authen/register",
    LOGIN: "/api/Authen/login",
    VERIFY_OTP: "/api/Authen/verify-otp",
    RESET_PASS: "/api/Authen/reset-password",
  },
  ADMIN: {
    GET_ROLES: '/api/roles',
    GET_PROVINCES: "/api/provinces",
    GET_DISTRICTS: "/api/districts",
  },
};
