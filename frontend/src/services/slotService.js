import api from "../api/api";

/* ---------- CREATE ---------- */

export const createSlot = async (slot) => {
  const { data } = await api.post("/slots/", slot);
  return data;
};

/* ---------- GET ALL ---------- */

export const getSlots = async () => {
  const { data } = await api.get("/slots/");
  return data;
};

export const getAllSlots = getSlots;

/* ---------- GET ONE ---------- */

export const getSlotById = async (id) => {
  const { data } = await api.get(`/slots/${id}`);
  return data;
};

/* ---------- GET DOCTOR SLOTS ---------- */

export const getDoctorSlots = async (doctorId) => {
  const { data } = await api.get(`/slots/doctor/${doctorId}`);
  return data;
};

export const getSlotsByDoctor = getDoctorSlots;

/* ---------- AVAILABLE ---------- */

export const getAvailableSlots = async (doctorId) => {
  const { data } = await api.get(`/slots/available/${doctorId}`);
  return data;
};

/* ---------- UPDATE ---------- */

export const updateSlot = async (id, slot) => {
  const { data } = await api.put(`/slots/${id}`, slot);
  return data;
};

/* ---------- DELETE ---------- */

export const deleteSlot = async (id) => {
  const { data } = await api.delete(`/slots/${id}`);
  return data;
};