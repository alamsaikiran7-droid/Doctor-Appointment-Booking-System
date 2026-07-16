import api from "../api/api";

/**
 * ==========================================
 * Admin Login
 * POST /admin/login
 * ==========================================
 */
export const adminLogin = async (loginData) => {
  const response = await api.post("/admin/login", loginData);

  // Save JWT Token
  if (response.data.access_token) {
    localStorage.setItem("adminToken", response.data.access_token);
  }

  return response.data;
};

/**
 * ==========================================
 * Get Admin Profile
 * GET /admin/profile
 * ==========================================
 */
export const getAdminProfile = async () => {
  const token = localStorage.getItem("adminToken");

  const response = await api.get("/admin/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * ==========================================
 * Logout Admin
 * ==========================================
 */
export const adminLogout = () => {
  localStorage.removeItem("adminToken");
};

/**
 * ==========================================
 * Check Admin Login
 * ==========================================
 */
export const isAdminLoggedIn = () => {
  return !!localStorage.getItem("adminToken");
};