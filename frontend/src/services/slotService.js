import api from "./api";

const SLOT_KEY = "novacare_slots";

// ============================================
// Local Storage Helpers
// ============================================

function getLocalSlots() {
  try {
    return JSON.parse(localStorage.getItem(SLOT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocalSlots(slots) {
  localStorage.setItem(SLOT_KEY, JSON.stringify(slots));
}

// ============================================
// Get Doctor Slots
// ============================================

export async function getDoctorSlots(doctorId) {
  try {
    const { data } = await api.get(`/slots/doctor/${doctorId}`);
    return data;
  } catch (err) {
    return getLocalSlots().filter(
      (slot) => Number(slot.doctor_id) === Number(doctorId)
    );
  }
}

// ============================================
// Create Slot
// ============================================

export async function createSlot(slot) {
  try {
    const { data } = await api.post("/slots", slot);
    return data;
  } catch (err) {
    const slots = getLocalSlots();

    const newSlot = {
      id: Date.now(),
      doctor_id: Number(slot.doctor_id),
      slot_date: slot.slot_date,
      slot_time: slot.slot_time,
      duration_minutes: slot.duration_minutes || 30,
      status: "AVAILABLE",
    };

    slots.push(newSlot);
    saveLocalSlots(slots);

    return newSlot;
  }
}

// ============================================
// Update Slot
// ============================================

export async function updateSlot(id, updatedData) {
  try {
    const { data } = await api.put(`/slots/${id}`, updatedData);
    return data;
  } catch (err) {
    const slots = getLocalSlots();

    const updatedSlots = slots.map((slot) =>
      slot.id === id
        ? {
            ...slot,
            ...updatedData,
          }
        : slot
    );

    saveLocalSlots(updatedSlots);

    return updatedSlots.find((slot) => slot.id === id);
  }
}

// ============================================
// Delete Slot
// ============================================

export async function deleteSlot(id) {
  try {
    await api.delete(`/slots/${id}`);
    return true;
  } catch (err) {
    const slots = getLocalSlots().filter(
      (slot) => slot.id !== id
    );

    saveLocalSlots(slots);

    return true;
  }
}

// ============================================
// Mark Slot as Booked
// ============================================

export async function bookSlot(id) {
  try {
    const { data } = await api.put(`/slots/${id}/book`);
    return data;
  } catch (err) {
    const slots = getLocalSlots();

    const slot = slots.find((s) => s.id === id);

    if (!slot) return null;

    slot.status = "BOOKED";

    saveLocalSlots(slots);

    return slot;
  }
}

// ============================================
// Mark Slot as Available Again
// ============================================

export async function releaseSlot(id) {
  try {
    const { data } = await api.put(`/slots/${id}/release`);
    return data;
  } catch (err) {
    const slots = getLocalSlots();

    const slot = slots.find((s) => s.id === id);

    if (!slot) return null;

    slot.status = "AVAILABLE";

    saveLocalSlots(slots);

    return slot;
  }
}