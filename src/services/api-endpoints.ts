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
      GET_ROLES: "/api/roles",
      GET_PROVINCES: "/api/provinces",
      GET_DISTRICTS: "/api/districts",
      CREATE_STAFF: "/api/Authen/staff",
      GET_ALL_USERS: "/api/getall",
      GET_ALL_RATING_REQUESTS: "/api/RatingRequest",
      GET_ALL_SURVEY_REQUESTS: "/api/SurveyRequest",
      GET_ALL_USERS_COUNT: "/api/count-total",
      GET_ALL_USERS_BY_ROLES_COUNT: "/api/count-by-role",
      GET_ALL_RATING_REQUESTS_COUNT: "/api/RatingRequest/ratings/count",
      GET_ALL_SURVEY_REQUESTS_COUNT: "/api/SurveyRequest/surveys/count",
      GET_ALL_TASKS_COMPLETED_COUNT: "/api/completed-tasks",
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
    // Không thêm POST hoặc các endpoint khác cho đến khi bạn đồng ý
  },
};
