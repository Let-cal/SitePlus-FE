// src/services/api-endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/Authen/register", //not use
    LOGIN: "/api/users/auth/token", //done
  },
  CLIENT: {
    UPDATE_PROFILE: "/api/update-from-user", //not use
    GET: {
      GET_INDUSTRY: "/api/industries", //done
      GET_INDUSTRY_CATEGORY: "/api/industry-categories", //done
      GET_SITE_CATEGORY: "/api/site-categories", //done
      GET_STORE_PROFILE_CATEGORY: "/api/store-profile-categories", //done
      // GET_INDUSTRY_CATEGORY_BY_INDUSTRY: "/api/IndustryCategory/IndustryCategoryByIndustry",
      GET_INDUSTRY_CATEGORY_BY_INDUSTRY: "/api/industry-categories/by-industry", //done
      GET_CUSTOMER_SEGMENT: "/api/customer-segments", //done
      // GET_CUSTOMER_SEGMENT_BY_INDUSTRY: "/api/CustomerSegment/GetCustomerSegmentByIndustry",
      GET_CUSTOMER_SEGMENT_BY_INDUSTRY: "/api/customer-segments/GetCustomerSegmentByIndustry", //done
      GET_BRAND: "/api/brands", //done
    },
    PUSH: {
      UPDATE_BRAND: "/api/brands", //not use
      CREATE_BRAND: "/api/brands", //done
      CREATE_BRAND_REQUEST: "/api/brand-requests", //done
    },
  },
  ADMIN: {
    GET: {
      GET_ROLES: "/api/roles", //done
      GET_AREA_BY_DISTRICTS: "/api/areas/district", //done
      GET_ALL_AREAS: "/api/areas", //done
      GET_DISTRICTS: "/api/districts", //done
      CREATE_STAFF: "/api/Authen/staff", //not use
      GET_USERS: "/api/users", //done
      GET_TOTAL_USERS: "/api/statistics/users", //done
      GET_TOTAL_STAFF: "/api/statistics/staff", //done
      GET_TOTAL_SITES: "/api/statistics/sites", //done
      GET_TOTAL_REPORTS: "/api/statistics/reports", //done  
      GET_TOTAL_USERS_BY_MONTH: "/api/statistics/users/monthly", //done
      GET_TOTAL_REQUESTS_BY_MONTH: "/api/statistics/requests/monthly", //done
      GET_USER_COUNT_BY_ROLE_PER_MONTH: "/api/users/statistics/by-role", //done
    },
    POST: {
      UPDATE_USRES: "/api/users", //done
      CREATE_USER: "/api/users", //done
    },
  },
  AREA_MANAGER: {
    GET: {
      GET_DISTRICTS: "/api/districts", //done
      GET_WARDS_BY_DISTRICT: "/api/areas/district/:districtId", //done
      GET_USERS: "/api/users", //done
      GET_TASKS: "/api/tasks", //done
      GET_TASK_BY_ID: "/api/tasks/:id", //done
      GET_BRAND_REQUESTS: "/api/brand-requests", //done
      GET_SITE_BY_ID: "/api/sites/:id", //done
      GET_DASHBOARD_STATISTICS: "/api/statistics/area-managers/dashboard", //done
    },
    POST: {
      CREATE_TASK: "/api/tasks", //done
    },
    PATCH: {
      UPDATE_TASK_STATUS: "/api/tasks/status", //done
      UPDATE_SITE_STATUS: "/api/sites/status", //done
    },
    PUT: {
      UPDATE_SITE_DEAL_STATUS: "/api/site-deals/:id/status", //done
      UPDATE_TASK: "/api/tasks/:id", //done
    },
  },
  MANAGER: {
    GET: {
      GET_DISTRICTS: "/api/districts", //done
      GET_WARDS_BY_DISTRICT: "/api/areas", //done
      GET_USERS: "/api/users", //done
      GET_BRAND_REQUESTS: "/api/brand-requests", //done
      GET_BRAND_REQUEST_BY_ID: "/api/brand-requests/:id", //done
      // GET_FAVORITES: "/api/Qdrant/brand-request/:requestId",
      GET_FAVORITES: "/api/qdrants/brand-requests/:brandRequestId/matches", //done
      EXPORT_PDF: "/api/pdfs/brand-requests/:brandRequestId/pdf", //done
      GET_SITES: "/api/sites", //done
      GET_BRANDS: "/api/brands", //done
      GET_MANAGER_DASHBOARD: "/api/statistics/managers/dashboard", //done
      GET_BRAND_REQUEST_CHART: "/api/statistics/brand-requests/monthly-chart", //done
      GET_STORE_BY_BRANDID: "/api/stores/brands/:brandId", //done
    },
    PUT: {
      UPDATE_BRAND_REQUEST_STATUS: "/api/brand-requests/Status/:id", //done
      UPDATE_MATCHED_SITE: "/api/qdrants/matches", //done
      UPDATE_BRAND_STATUS: "/api/brands/status/:id", //done
      UPDATE_BRAND: "/api/brands/:id", //done
    },
    PATCH: {
      UPDATE_SITE_STATUS: "/api/sites/status", //done
    },
    POST: {
      SEARCH_BY_AI: "/api/qdrants/comparisons", //done
      SEND_ACCEPT_EMAIL: "/api/brand-requests/emails", //done 
      SEND_REJECT_EMAIL: "/api/brand-requests/email", //done
    },
  },
};