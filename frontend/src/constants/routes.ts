export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
  },
  INCIDENTS: {
    LIST: "/incidents",
    DETAILS: (id: string) => `/incidents/${id}`,
    REPORT: "/incidents/report",
  },
  PREDICTION: "/prediction",
  EMERGENCY: "/emergency",
  ANALYTICS: "/analytics",
  REPORTS: "/reports",
  VENUES: "/venues",
  AI_ASSISTANT: "/ai-assistant",
  NOTIFICATIONS: "/notifications",
  USERS: "/users",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

export type RouteType = typeof ROUTES;
