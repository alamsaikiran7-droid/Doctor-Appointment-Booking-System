import api from "./api";
import { doctors } from "../data/doctors";

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

    console.log("Using local doctors");

    return doctors.map(normalizeDoctor);
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

    const doctor = doctors.find(
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

    return doctors
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