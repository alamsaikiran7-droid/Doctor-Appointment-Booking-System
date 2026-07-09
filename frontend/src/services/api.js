import axios from "axios";

// =======================================
// Axios Instance
// =======================================

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================================
// Request Interceptor
// =======================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================================
// Response Interceptor
// =======================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error?.response?.status,
      error?.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;