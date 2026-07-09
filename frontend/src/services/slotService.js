import api from "./api";

const SLOT_KEY = "novacare_slots";

// ===========================================
// Local Storage Helpers
// ===========================================

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

// ===========================================
// Get Doctor Slots
// ===========================================

export async function getDoctorSlots(doctorId) {
  let slots = [];

  try {
    const { data } = await api.get(`/slots/doctor/${doctorId}`);
    slots = data;
  } catch {
    slots = getLocalSlots().filter(
      (slot) => Number(slot.doctor_id) === Number(doctorId)
    );
  }

  // If Booking.jsx calls this function,
  // convert slots into grouped format.
  if (slots.length > 0 && slots[0].slot_date) {
    const grouped = {};

    slots.forEach((slot) => {
      const date = slot.slot_date;

      if (!grouped[date]) {
        grouped[date] = {
          date,
          isoDate: date,
          slots: [],
        };
      }

      grouped[date].slots.push({
        id: slot.id,
        time: slot.slot_time,
        status: slot.status,
      });
    });

    return Object.values(grouped);
  }

  return slots;
}

// ===========================================
// Create Slot
// ===========================================

export async function createSlot(slot) {
  try {
    const { data } = await api.post("/slots", slot);
    return data;
  } catch {
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

// ===========================================
// Update Slot
// ===========================================

export async function updateSlot(id, updatedData) {
  try {
    const { data } = await api.put(`/slots/${id}`, updatedData);
    return data;
  } catch {
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

// ===========================================
// Delete Slot
// ===========================================

export async function deleteSlot(id) {
  try {
    await api.delete(`/slots/${id}`);
    return true;
  } catch {
    const slots = getLocalSlots().filter(
      (slot) => slot.id !== id
    );

    saveLocalSlots(slots);

    return true;
  }
}

// ===========================================
// Book Slot
// ===========================================

export async function bookSlot(id) {
  try {
    const { data } = await api.put(`/slots/${id}/book`);
    return data;
  } catch {
    const slots = getLocalSlots();

    const slot = slots.find((s) => s.id === id);

    if (!slot) return null;

    slot.status = "BOOKED";

    saveLocalSlots(slots);

    return slot;
  }
}

// ===========================================
// Release Slot
// ===========================================

export async function releaseSlot(id) {
  try {
    const { data } = await api.put(`/slots/${id}/release`);
    return data;
  } catch {
    const slots = getLocalSlots();

    const slot = slots.find((s) => s.id === id);

    if (!slot) return null;

    slot.status = "AVAILABLE";

    saveLocalSlots(slots);

    return slot;
  }
}