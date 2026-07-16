import api from "../api/api";
import { adaptAppointment, adaptAppointmentsList } from "./adapters";

/**
 * ==========================================
 * Book Appointment
 * POST /appointments/
 * ==========================================
 */
export const bookAppointment = async (appointmentData) => {
  const response = await api.post("/appointments/", appointmentData);
  return adaptAppointment(response.data);
};

/**
 * ==========================================
 * Get All Appointments
 * GET /appointments/
 * ==========================================
 */
export const getAllAppointments = async () => {
  const response = await api.get("/appointments/");
  return adaptAppointmentsList(response.data);
};

/**
 * ==========================================
 * Get Appointment By ID
 * GET /appointments/{appointment_id}
 * ==========================================
 */
export const getAppointmentById = async (appointmentId) => {
  const response = await api.get(`/appointments/${appointmentId}`);
  return adaptAppointment(response.data);
};

/**
 * ==========================================
 * Get Patient Appointments
 * GET /appointments/patient/{patient_id}
 * ==========================================
 */
export const getPatientAppointments = async (patientId) => {
  const response = await api.get(`/appointments/patient/${patientId}`);
  return adaptAppointmentsList(response.data);
};

/**
 * ==========================================
 * Get Doctor Appointments
 * GET /appointments/doctor/{doctor_id}
 * ==========================================
 */
export const getDoctorAppointments = async (doctorId) => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);
  return adaptAppointmentsList(response.data);
};

export const acceptAppointment = async (appointmentId) => {
  const response = await api.put(
    `/appointments/${appointmentId}/accept`
  );
  return adaptAppointment(response.data);
};

export const declineAppointment = async (
  appointmentId,
  reason = ""
) => {
  const response = await api.put(
    `/appointments/${appointmentId}/decline`,
    { reason }
  );
  return adaptAppointment(response.data);
};

/**
 * ==========================================
 * Update Appointment
 * PUT /appointments/{appointment_id}
 * ==========================================
 */
export const updateAppointment = async (
  appointmentId,
  appointmentData
) => {
  const response = await api.put(
    `/appointments/${appointmentId}`,
    appointmentData
  );

  return adaptAppointment(response.data);
};

/**
 * ==========================================
 * Cancel Appointment
 * PATCH /appointments/{appointment_id}/cancel
 * ==========================================
 */
export const cancelAppointment = async (appointmentId) => {
  const response = await api.patch(
    `/appointments/${appointmentId}/cancel`
  );

  return response.data;
};

/**
 * ==========================================
 * Delete Appointment
 * DELETE /appointments/{appointment_id}
 * ==========================================
 */
export const deleteAppointment = async (appointmentId) => {
  const response = await api.delete(
    `/appointments/${appointmentId}`
  );

  return response.data;
};