import api from "../api/api";

/* ==========================================
   Create Payment
========================================== */
export const createPayment = async (paymentData) => {
  const { data } = await api.post(
    "/payments/",
    paymentData
  );

  return data;
};

/* ==========================================
   Process Payment
========================================== */
export const processPayment = async (
  paymentId,
  paymentData
) => {
  const { data } = await api.put(
    `/payments/${paymentId}/process`,
    paymentData
  );

  return data;
};

/* ==========================================
   Get Payment
========================================== */
export const getPayment = async (paymentId) => {
  const { data } = await api.get(
    `/payments/${paymentId}`
  );

  return data;
};

/* ==========================================
   Get Payment By Appointment
========================================== */
export const getPaymentByAppointment = async (
  appointmentId
) => {
  const { data } = await api.get(
    `/payments/appointment/${appointmentId}`
  );

  return data;
};

/* ==========================================
   Get Patient Payments
========================================== */
export const getPatientPayments = async (
  patientId
) => {
  const { data } = await api.get(
    `/payments/patient/${patientId}`
  );

  return data;
};

/* ==========================================
   Get All Payments
========================================== */
export const getAllPayments = async () => {
  const { data } = await api.get("/payments/");

  return data;
};