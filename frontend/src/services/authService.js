import api from "../api/api";

/* ==========================================
   Register User
========================================== */
export const register = async (userData) => {
  const payload = {
    full_name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    role: userData.role,
  };

  const { data } = await api.post(
    "/auth/register",
    payload,
  );

  return data;
};
/* ==========================================
   Login User
========================================== */
export const login = async ({ role, username, password }) => {
  // Username field is treated as email
  const payload = {
    email: username,
    password,
  };

  let response;

  switch (role) {
    case "admin":
      response = await api.post("/admin/login", payload);
      break;

    case "doctor":
      response = await api.post("/doctor/login", payload);
      break;

    default:
      // Patient login
      response = await api.post("/auth/login", payload);
      break;
  }

  // Save JWT token
  localStorage.setItem("userToken", response.data.access_token);

  return response.data;
};

/* ==========================================
   Current User Profile (Patient/Admin)
========================================== */
export const getUserProfile = async () => {
  const token = localStorage.getItem("userToken");

  const { data } = await api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

/* ==========================================
   Get All Registered Patients (Admin)
========================================== */
export const getAllPatients = async () => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    throw new Error("Authentication required.");
  }

  const { data } = await api.get("/auth/patients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
/* ==========================================
   Change Doctor Password
========================================== */
export const changeDoctorPassword = async (
  currentPassword,
  newPassword
) => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    throw new Error("Authentication required.");
  }

  const payload = {
    current_password: currentPassword,
    new_password: newPassword,
  };

  const { data } = await api.post(
    "/doctor/change-password",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

/* ==========================================
   Logout
========================================== */
export const logout = () => {
  localStorage.removeItem("userToken");
};

/* ==========================================
   Helper
========================================== */
export const isLoggedIn = () => {
  return !!localStorage.getItem("userToken");
};