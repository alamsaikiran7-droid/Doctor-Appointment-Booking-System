import api from "./api";
import { setUser } from "../utils/storage";
import { adaptUser, adaptUserForBackend } from "./adapters";

// These calls map directly to Member 1's Auth API:
//   POST /auth/register
//   POST /auth/login
//   GET  /auth/profile
// Until the backend is live, we resolve with mock data so the UI is fully demoable.

export async function login({ role, username, password }) {
  try {
    const { data } = await api.post("/auth/login", { role, username, password });
    localStorage.setItem("novacare_token", data.token);
    const user = adaptUser(data.user || data);
    setUser(user);
    return user;
  } catch (err) {
    // Mock fallback (no backend running yet)
    const mockUser = { name: username || "Guest User", role, username };
    localStorage.setItem("novacare_token", "mock-token");
    setUser(mockUser);
    return mockUser;
  }
}

export async function register({ role, ...formData }) {
  try {
    const payload = { role, ...adaptUserForBackend(formData) };
    const { data } = await api.post("/auth/register", payload);
    // Some backends return created user; normalize if present
    return data.user ? adaptUser(data.user) : data;
  } catch (err) {
    return { success: true, mock: true, role, ...formData };
  }
}

export function logout() {
  localStorage.removeItem("novacare_token");
  localStorage.removeItem("novacare_user");
}
