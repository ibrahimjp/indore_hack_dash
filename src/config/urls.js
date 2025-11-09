// Admin Portal (Doctor Dashboard) URL Configuration
export const URLS = {
  FRONTEND_URL: "http://localhost:5173",
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
  USER_DASHBOARD_URL: "http://localhost:5174",
  DOCTOR_DASHBOARD_URL: "http://localhost:5175",
};

// Helper functions for common redirects
export const getFrontendUrl = () => URLS.FRONTEND_URL;
export const getBackendUrl = () => URLS.BACKEND_URL;
export const getUserDashboardUrl = () => URLS.USER_DASHBOARD_URL;
export const getDoctorDashboardUrl = () => URLS.DOCTOR_DASHBOARD_URL;



