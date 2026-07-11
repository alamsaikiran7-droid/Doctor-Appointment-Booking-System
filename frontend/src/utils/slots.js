// Generates mock slots for the next 6 days for a given doctor.
// This will be replaced by GET /slots/{doctor_id} from Member 2's API.
export function generateSlots(doctorId) {
  const times = ["09:00 AM", "09:30 AM", "10:30 AM", "11:00 AM", "02:00 PM", "03:30 PM", "05:00 PM"];
  const days = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayLabel = date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    const slots = times.map((time, idx) => ({
      id: `${doctorId}-${i}-${idx}`,
      time,
      status: (doctorId + i + idx) % 5 === 0 ? "BOOKED" : "AVAILABLE",
    }));

    days.push({ date: dayLabel, isoDate: date.toISOString().slice(0, 10), slots });
  }

  return days;
}
