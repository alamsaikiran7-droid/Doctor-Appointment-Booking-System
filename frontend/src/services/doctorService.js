import api from "../api/api";
import { adaptDoctor, adaptDoctorsList } from "./adapters";

/* ---------- GET ALL DOCTORS ---------- */

export const getDoctors = async () => {
  const { data } = await api.get("/doctors/");
  return adaptDoctorsList(data);
};

// Alias
export const getAllDoctors = getDoctors;

/* ---------- GET DOCTOR ---------- */

export const getDoctorById = async (id) => {
  const { data } = await api.get(`/doctors/${id}`);
  return adaptDoctor(data);
};

/* ---------- CREATE ---------- */

export const createDoctor = async (doctor) => {
  const { data } = await api.post("/doctors/", doctor);
  return adaptDoctor(data);
};

export const addDoctor = createDoctor;


/* ---------- UPDATE ---------- */

export const updateDoctor = async (id, doctor) => {
  const { data } = await api.put(`/doctors/${id}`, doctor);
  return adaptDoctor(data);
};

export const updateDoctorProfile = async (doctor) => {
  if (!doctor?.id) {
    throw new Error("Doctor id is required to update profile.");
  }
  return updateDoctor(doctor.id, doctor);
};

/* ---------- DELETE ---------- */

export const deleteDoctor = async (id) => {
  const { data } = await api.delete(`/doctors/${id}`);
  return data;
};

/* ---------- SEARCH ---------- */

export const searchDoctors = async (city, speciality) => {
  const { data } = await api.get("/doctors/search/", {
    params: { city, speciality },
  });

  return adaptDoctorsList(data);
};

export const searchDoctorByName = async (name) => {
  const { data } = await api.get("/doctors/search/name/", {
    params: { name },
  });

  return adaptDoctorsList(data);
};

export const searchDoctorByCity = async (city) => {
  const { data } = await api.get("/doctors/search/city/", {
    params: { city },
  });

  return adaptDoctorsList(data);
};

export const searchDoctorBySpeciality = async (speciality) => {
  const { data } = await api.get("/doctors/search/speciality/", {
    params: { speciality },
  });

  return adaptDoctorsList(data);
};

export const globalSearchDoctors = async (keyword) => {
  const { data } = await api.get("/doctors/search/global/", {
    params: { keyword },
  });

  return adaptDoctorsList(data);
};