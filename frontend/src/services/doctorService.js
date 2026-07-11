import api from "./api";
import { doctors } from "../data/doctors";
const DOCTOR_KEY = "novacare_doctors";

// Initialize doctors in localStorage only once
function initializeDoctors() {
  if (!localStorage.getItem(DOCTOR_KEY)) {
    localStorage.setItem(
      DOCTOR_KEY,
      JSON.stringify(doctors)
    );
  }
}

function getLocalDoctors() {
  initializeDoctors();
  return JSON.parse(localStorage.getItem(DOCTOR_KEY));
}

function saveLocalDoctors(list) {
  localStorage.setItem(
    DOCTOR_KEY,
    JSON.stringify(list)
  );
}

/*
=========================================
Normalize Doctor Object
=========================================
*/
function normalizeDoctor(doctor) {
  return {
    ...doctor,

    // Backend sends "speciality"
    // Frontend uses "specialization"
    specialization:
      doctor.specialization ||
      doctor.speciality ||
      "",

    speciality:
      doctor.speciality ||
      doctor.specialization ||
      "",

    // Backend sends consultation_fee
    fee:
      doctor.fee ||
      doctor.consultation_fee ||
      0,

    consultation_fee:
      doctor.consultation_fee ||
      doctor.fee ||
      0,
  };
}

/*
=========================================
Get All Doctors
=========================================
*/
export async function getDoctors() {
  try {
    const { data } = await api.get("/doctors");

    return data.map(normalizeDoctor);

  } catch (err) {

    console.log("Using localStorage doctors");

    return getLocalDoctors().map(normalizeDoctor);

    
  }
}

/*
=========================================
Get Doctor By Id
=========================================
*/
export async function getDoctorById(id) {

  try {

    const { data } = await api.get(
      `/doctors/${id}`
    );

    return normalizeDoctor(data);

  } catch (err) {

    const doctor = getLocalDoctors().find(
      (d) => Number(d.id) === Number(id)
    );

    if (!doctor) return null;

    return normalizeDoctor(doctor);
  }
}

/*
=========================================
Search Doctors
=========================================
*/
export async function searchDoctors(
  city = "",
  speciality = ""
) {

  try {

    const { data } = await api.get(
      "/doctors/search",
      {
        params: {
          city,
          speciality,
        },
      }
    );

    return data.map(normalizeDoctor);

  } catch (err) {

    return getLocalDoctors()
      .filter((doctor) => {

        const cityMatch =
          city === ""
            ? true
            : doctor.city
                .toLowerCase()
                .includes(city.toLowerCase());

        const specialityMatch =
          speciality === ""
            ? true
            : (
                doctor.specialization ||
                doctor.speciality
              )
                .toLowerCase()
                .includes(
                  speciality.toLowerCase()
                );

        return cityMatch && specialityMatch;
      })
      .map(normalizeDoctor);
  }
}

/*
=========================================
Search By Name
=========================================
*/
export async function searchDoctorByName(
  keyword
) {

  const list = await getDoctors();

  return list.filter((doctor) =>
    doctor.name
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );
}

/*
=========================================
Get Doctor Statistics
=========================================
*/
export async function getDoctorStatistics() {

  const list = await getDoctors();

  return {

    totalDoctors: list.length,

    cardiologists: list.filter(
      (d) =>
        d.specialization ===
        "Cardiology"
    ).length,

    neurologists: list.filter(
      (d) =>
        d.specialization ===
        "Neurology"
    ).length,

    orthopedics: list.filter(
      (d) =>
        d.specialization ===
        "Orthopedics"
    ).length,

    averageFee:
      list.length === 0
        ? 0
        : Math.round(
            list.reduce(
              (sum, doctor) =>
                sum + Number(doctor.fee),
              0
            ) / list.length
          ),
  };
}

/*
=========================================
Add Doctor
=========================================
*/
export function addDoctor(doctor) {

  const list = getLocalDoctors();

  const newDoctor = {
    ...doctor,

    id: Date.now(),

    rating: 4.8,

    reviews: 0,

    languages: doctor.languages
      ? doctor.languages
          .split(",")
          .map((l) => l.trim())
      : [],

    education: doctor.education
      ? doctor.education
          .split(",")
          .map((e) => e.trim())
      : [],

    experience: Number(doctor.experience),

    fee: Number(doctor.fee),
  };

  list.push(newDoctor);

  saveLocalDoctors(list);

  return newDoctor;
}

/*
=========================================
Update Doctor
=========================================
*/
export function updateDoctor(updatedDoctor) {

  const list = getLocalDoctors();

  const updated = list.map((doctor) =>
    doctor.id === updatedDoctor.id
      ? updatedDoctor
      : doctor
  );

  saveLocalDoctors(updated);
}

/*
=========================================
Delete Doctor
=========================================
*/
export function deleteDoctor(id) {

  const updated = getLocalDoctors().filter(
    (doctor) => Number(doctor.id) !== Number(id)
  );

  saveLocalDoctors(updated);

  return updated;
}

export function updateDoctorProfile(updatedDoctor) {
  const doctors = getLocalDoctors();

  const updated = doctors.map((doctor) =>
    Number(doctor.id) === Number(updatedDoctor.id)
      ? updatedDoctor
      : doctor
  );

  saveLocalDoctors(updated);
}