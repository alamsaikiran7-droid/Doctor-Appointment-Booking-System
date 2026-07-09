import api from "./api";
import {
  getAppointments,
  saveAppointments,
  saveAppointment,
} from "../utils/storage";

/* =====================================
   Book Appointment
===================================== */

export async function bookAppointment(appointment) {
  try {
    const { data } = await api.post(
      "/appointments",
      appointment
    );

    return data;
  } catch (error) {
    console.log("Backend unavailable. Using LocalStorage.");

    return saveAppointment({
      ...appointment,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });
  }
}

/* =====================================
   Patient Appointments
===================================== */

export async function getPatientAppointments(patientId) {
  try {
    const { data } = await api.get(
      `/appointments/patient/${patientId}`
    );

    return data;
  } catch (error) {
    console.log("Using LocalStorage.");

    return getAppointments().filter(
      (appointment) =>
        Number(appointment.patientId) ===
        Number(patientId)
    );
  }
}

/* =====================================
   Doctor Appointments
===================================== */

export async function getDoctorAppointments(doctorId) {
  try {
    const { data } = await api.get(
      `/appointments/doctor/${doctorId}`
    );

    return data;
  } catch (error) {
    console.log("Using LocalStorage.");

    return getAppointments().filter(
      (appointment) =>
        Number(appointment.doctorId) ===
        Number(doctorId)
    );
  }
}

/* =====================================
   Get All Appointments
===================================== */

export async function getAllAppointments() {
  try {
    const { data } = await api.get(
      "/appointments"
    );

    return data;
  } catch (error) {
    console.log("Using LocalStorage.");

    return getAppointments();
  }
}

/* =====================================
   Get Appointment By Id
===================================== */

export async function getAppointmentById(id) {
  try {
    const { data } = await api.get(
      `/appointments/${id}`
    );

    return data;
  } catch (error) {
    return getAppointments().find(
      (appointment) =>
        Number(appointment.id) === Number(id)
    );
  }
}

/* =====================================
   Accept Appointment
===================================== */

export async function acceptAppointment(id) {
  try {
    const { data } = await api.put(
      `/appointments/${id}/accept`
    );

    return data;
  } catch (error) {
    const appointments = getAppointments();

    const updated = appointments.map(
      (appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "ACCEPTED",
            }
          : appointment
    );

    saveAppointments(updated);

    return updated.find(
      (appointment) => appointment.id === id
    );
  }
}

/* =====================================
   Decline Appointment
===================================== */

export async function declineAppointment(
  id,
  reason = ""
) {
  try {
    const { data } = await api.put(
      `/appointments/${id}/decline`,
      {
        reason,
      }
    );

    return data;
  } catch (error) {
    const appointments = getAppointments();

    const updated = appointments.map(
      (appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "DECLINED",
              declineReason: reason,
            }
          : appointment
    );

    saveAppointments(updated);

    return updated.find(
      (appointment) => appointment.id === id
    );
  }
}

/* =====================================
   Complete Appointment
===================================== */

export async function completeAppointment(id) {
  try {
    const { data } = await api.put(
      `/appointments/${id}/complete`
    );

    return data;
  } catch (error) {
    const appointments = getAppointments();

    const updated = appointments.map(
      (appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "COMPLETED",
            }
          : appointment
    );

    saveAppointments(updated);

    return updated.find(
      (appointment) => appointment.id === id
    );
  }
}

/* =====================================
   Cancel Appointment
===================================== */

export async function cancelAppointment(id) {
  try {
    const { data } = await api.put(
      `/appointments/${id}/cancel`
    );

    return data;
  } catch (error) {
    const appointments = getAppointments();

    const updated = appointments.map(
      (appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "CANCELLED",
            }
          : appointment
    );

    saveAppointments(updated);

    return updated.find(
      (appointment) => appointment.id === id
    );
  }
}

/* =====================================
   Delete Appointment
===================================== */

export async function deleteAppointment(id) {
  try {
    const { data } = await api.delete(
      `/appointments/${id}`
    );

    return data;
  } catch (error) {
    const appointments = getAppointments();

    const updated = appointments.filter(
      (appointment) =>
        appointment.id !== id
    );

    saveAppointments(updated);

    return true;
  }
}

/* =====================================
   Appointment Statistics
===================================== */

export async function getAppointmentStats() {
  const appointments =
    await getAllAppointments();

  return {
    total: appointments.length,

    pending: appointments.filter(
      (appointment) =>
        appointment.status === "PENDING"
    ).length,

    accepted: appointments.filter(
      (appointment) =>
        appointment.status === "ACCEPTED"
    ).length,

    declined: appointments.filter(
      (appointment) =>
        appointment.status === "DECLINED"
    ).length,

    completed: appointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED"
    ).length,

    cancelled: appointments.filter(
      (appointment) =>
        appointment.status === "CANCELLED"
    ).length,
  };
}