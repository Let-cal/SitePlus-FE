// src/services/api-endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/Authen/register",
    LOGIN: "/api/user/login",
  },
  CLIENT: {
    UPDATE_PROFILE: "/api/update-from-user",
    GET: {
      GET_INDUSTRY: "/api/Industry",
      GET_INDUSTRY_CATEGORY: "/api/IndustryCategory",
      GET_INDUSTRY_CATEGORY_BY_INDUSTRY:
        "/api/IndustryCategory/IndustryCategoryByIndustry",
      GET_CUSTOMER_SEGMENT: "/api/CustomerSegment",
      GET_CUSTOMER_SEGMENT_BY_INDUSTRY:
        "/api/CustomerSegment/GetCustomerSegmentByIndustry",
      GET_BRAND: "/api/Brand",
    },
    PUSH: {
      CREATE_BRAND: "/api/Brand",
      CREATE_BRAND_REQUEST: "/api/BrandRequest",
    },
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
      GET_USER_COUNT_BY_ROLE_PER_MONTH: "/api/user/count-by-role-per-month",
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
      GET_TASKS: "/api/Task",
      GET_TASK_BY_ID: "/api/Task/:taskId",
      GET_BRAND_REQUESTS: "/api/BrandRequest",
      GET_SITE_BY_ID: "/api/Site/:siteId",
    },
    POST: {
      CREATE_TASK: "/api/Task",
    },
    PATCH: {
      UPDATE_TASK_STATUS: "/api/Task/status",
      UPDATE_SITE_STATUS: "/api/Site/status",
    },
    PUT: {
      UPDATE_SITE_DEAL_STATUS: "/api/SiteDeal/:id/status",
    },
  },
  MANAGER: {
    GET: {
      GET_DISTRICTS: "/api/districts/get-all",
      GET_WARDS_BY_DISTRICT: "/api/areas",
      GET_USERS: "/api/user/get-users",
      GET_BRAND_REQUESTS: "/api/BrandRequest",
      GET_BRAND_REQUEST_BY_ID: "/api/BrandRequest/:brandRequestId",
      GET_FAVORITES: "/api/Qdrant/brand-request/:requestId",
      EXPORT_PDF: "/api/generate/:brandRequestId",
      GET_SITES: "/api/Site",
    },
    PUT: {
      UPDATE_BRAND_REQUEST_STATUS: "/api/BrandRequest/Status/:id",
      UPDATE_MATCHED_SITE: "/api/Qdrant/update-matched-site",
    },
    PATCH: {
      UPDATE_SITE_STATUS: "/api/site/status",
    },
    POST: { // Thêm POST nếu chưa có
      SEARCH_BY_AI: "/api/Qdrant/compare", // Thêm endpoint mới
    },
  },
};
