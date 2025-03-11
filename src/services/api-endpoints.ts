// src/services/api-endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/Authen/register",
    LOGIN: "/api/user/login",
  },
  CLIENT: {
    UPDATE_PROFILE: "/api/update-from-user",
  },
  ADMIN: {
    GET: {
      GET_ROLES: "/api/roles/get-all",
      GET_AREA_BY_DISTRICTS: "/api/areas",
      GET_DISTRICTS: "/api/districts/get-all",
      CREATE_STAFF: "/api/Authen/staff",
      GET_USERS: "/api/user/get-users",
      GET_TOTAL_USERS: "/api/Statistics/total-users",
      GET_TOTAL_STAFF: "/api/Statistics/total-staff",
      GET_TOTAL_SITES: "/api/Statistics/total-sites",
      GET_TOTAL_REPORTS: "/api/Statistics/total-reports",
      GET_TOTAL_USERS_BY_MONTH: "/api/Statistics/total-users-by-month",
      GET_TOTAL_REQUESTS_BY_MONTH: "/api/Statistics/total-requests-by-month",
      GET_USER_COUNT_BY_ROLE_PER_MONTH: '/api/user/count-by-role-per-month'
    },
    POST: {
      UPDATE_USRES: "/api/update-from-admin",
    },
  },
  AREA_MANAGER: {
    GET: {
      GET_DISTRICTS: "/api/districts/get-all",
      GET_WARDS_BY_DISTRICT: "/api/areas",
      GET_USERS: "/api/user/get-users",
    },
  },
  MANAGER: {
    GET: {
      GET_DISTRICTS: "/api/districts/get-all",
      GET_WARDS_BY_DISTRICT: "/api/areas",
      GET_USERS: "/api/user/get-users",
    },
  },
};
