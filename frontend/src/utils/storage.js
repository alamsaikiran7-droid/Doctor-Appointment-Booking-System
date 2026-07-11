// ==========================================
// src/utils/storage.js
// Local Storage Helper
// Used when backend APIs are unavailable.
// ==========================================

const USER_KEY = "novacare_user";
const TOKEN_KEY = "novacare_token";
const APPOINTMENTS_KEY = "novacare_appointments";
const SLOTS_KEY = "novacare_slots";

// ==========================================
// USER
// ==========================================

export function getUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );

  return user;
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

// ==========================================
// TOKEN
// ==========================================

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(
    TOKEN_KEY,
    token
  );
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ==========================================
// APPOINTMENTS
// ==========================================

export function getAppointments() {
  try {
    const data = localStorage.getItem(
      APPOINTMENTS_KEY
    );

    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function saveAppointments(list) {
  localStorage.setItem(
    APPOINTMENTS_KEY,
    JSON.stringify(list)
  );
}

export function saveAppointment(appointment) {

  const appointments = getAppointments();

  const newAppointment = {
    id: appointment.id || Date.now(),

    doctorId: appointment.doctorId,

    patientId: appointment.patientId,

    doctorName: appointment.doctorName,

    patientName: appointment.patientName,

    specialization:
      appointment.specialization,

    phone: appointment.phone,

    date: appointment.date,

    time: appointment.time,

    notes: appointment.notes || "",

    status:
      appointment.status || "PENDING",

    createdAt:
      appointment.createdAt ||
      new Date().toISOString(),
  };

  appointments.push(newAppointment);

  saveAppointments(appointments);

  return newAppointment;
}

export function updateAppointment(
  id,
  updatedFields
) {

  const appointments = getAppointments();

  const updated = appointments.map((item) =>
    item.id === id
      ? {
          ...item,
          ...updatedFields,
        }
      : item
  );

  saveAppointments(updated);

  return updated.find(
    (item) => item.id === id
  );
}

export function deleteAppointment(id) {

  const appointments =
    getAppointments().filter(
      (item) => item.id !== id
    );

  saveAppointments(appointments);
}

// ==========================================
// SLOTS
// ==========================================

export function getSlots() {

  try {

    const data =
      localStorage.getItem(SLOTS_KEY);

    return data ? JSON.parse(data) : [];

  } catch {

    return [];

  }

}

export function saveSlots(slots) {

  localStorage.setItem(
    SLOTS_KEY,
    JSON.stringify(slots)
  );

}

export function createSlot(slot) {

  const slots = getSlots();

  const newSlot = {

    id: slot.id || Date.now(),

    doctor_id: slot.doctor_id,

    slot_date: slot.slot_date,

    slot_time: slot.slot_time,

    duration_minutes:
      slot.duration_minutes || 30,

    status:
      slot.status || "AVAILABLE",
  };

  slots.push(newSlot);

  saveSlots(slots);

  return newSlot;
}

export function updateSlot(
  id,
  updatedFields
) {

  const slots = getSlots();

  const updated = slots.map((slot) =>
    slot.id === id
      ? {
          ...slot,
          ...updatedFields,
        }
      : slot
  );

  saveSlots(updated);

  return updated.find(
    (slot) => slot.id === id
  );
}

export function deleteSlot(id) {

  const updated =
    getSlots().filter(
      (slot) => slot.id !== id
    );

  saveSlots(updated);
}

// ==========================================
// CLEAR ALL
// ==========================================

export function clearStorage() {

  localStorage.removeItem(USER_KEY);

  localStorage.removeItem(TOKEN_KEY);

  localStorage.removeItem(
    APPOINTMENTS_KEY
  );

  localStorage.removeItem(
    SLOTS_KEY
  );
}