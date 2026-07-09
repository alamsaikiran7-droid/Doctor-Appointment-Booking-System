import api from "./api";
import { setUser } from "../utils/storage";
import { adaptUser, adaptUserForBackend } from "./adapters";
import { doctors } from "../data/doctors";

// ======================================
// Login
// ======================================

export async function login({ role, username, password }) {
  try {
    const { data } = await api.post("/auth/login", {
      role,
      username,
      password,
    });

    localStorage.setItem("novacare_token", data.token);

    const user = adaptUser(data.user || data);

    setUser(user);

    return user;

  } catch (err) {
    let mockUser;

    // ==============================
    // Mock Doctor Login
    // ==============================
    if (role === "doctor") {

      const doctor =
        doctors.find(
          (d) =>
            d.name
              .toLowerCase()
              .includes((username || "").toLowerCase())
        ) || doctors[0];

      mockUser = {
        id: doctor.id,
        name: doctor.name,
        username,
        role: "doctor",
        specialization: doctor.specialization,
        city: doctor.city,
        clinic: doctor.clinic,
        fee: doctor.fee,
      };

    }
    // ==============================
    // Mock Patient Login
    // ==============================
    else if (role === "patient") {

      mockUser = {
        id: 1001,
        name: username || "Patient",
        username,
        role: "patient",
      };

    }
    // ==============================
    // Mock Admin Login
    // ==============================
    else {

      mockUser = {
        id: 999,
        name: username || "Admin",
        username,
        role: "admin",
      };

    }

    localStorage.setItem("novacare_token", "mock-token");

    setUser(mockUser);

    return mockUser;
  }
}

// ======================================
// Register
// ======================================

export async function register({ role, ...formData }) {
  try {
    const payload = {
      role,
      ...adaptUserForBackend(formData),
    };

    const { data } = await api.post(
      "/auth/register",
      payload
    );

    return data.user
      ? adaptUser(data.user)
      : data;

  } catch (err) {
    return {
      success: true,
      mock: true,
      role,
      ...formData,
    };
  }
}

// ======================================
// Logout
// ======================================

export function logout() {
  localStorage.removeItem("novacare_token");
  localStorage.removeItem("novacare_user");
}