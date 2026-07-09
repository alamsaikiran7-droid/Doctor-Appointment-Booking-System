import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiClock, FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getDoctorSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} from "../services/slotService";
import useAuth from "../hooks/useAuth";

function DoctorAvailability() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({
    slot_date: "",
    slot_time: "",
    duration_minutes: 30,
  });

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    try {
      setLoading(true);
      const data = await getDoctorSlots(user?.id);
      setSlots(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const slot = {
      doctor_id: user.id,
      slot_date: newSlot.slot_date,
      slot_time: newSlot.slot_time,
      duration_minutes: Number(newSlot.duration_minutes),
    };
    const created = await createSlot(slot);
    setSlots((prev) => [...prev, created]);
    setNewSlot({
      slot_date: "",
      slot_time: "",
      duration_minutes: 30,
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this slot?")) return;
    await deleteSlot(id);
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleToggle(slot) {
    const status = slot.status === "AVAILABLE" ? "BOOKED" : "AVAILABLE";
    const updated = await updateSlot(slot.id, { status });
    setSlots((prev) =>
      prev.map((s) => (s.id === slot.id ? updated : s))
    );
  }

  const available = slots.filter((s) => s.status === "AVAILABLE").length;
  const booked = slots.filter((s) => s.status === "BOOKED").length;

  return (
    <DashboardLayout role="doctor">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow">Doctor Panel</p>
          <h1 className="text-3xl font-semibold">
            Availability Management
          </h1>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="card p-6">
          <p className="text-muted">Total Slots</p>
          <h2 className="text-3xl font-bold">{slots.length}</h2>
        </div>

        <div className="card p-6">
          <p className="text-muted">Available Slots</p>
          <h2 className="text-3xl font-bold text-green-600">{available}</h2>
        </div>

        <div className="card p-6">
          <p className="text-muted">Booked Slots</p>
          <h2 className="text-3xl font-bold text-red-600">{booked}</h2>
        </div>
      </div>

      {/* Create Slot */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-5">Create New Slot</h2>

        <form
          onSubmit={handleCreate}
          className="grid md:grid-cols-4 gap-4"
        >
          <input
            type="date"
            className="input"
            value={newSlot.slot_date}
            onChange={(e) =>
              setNewSlot({ ...newSlot, slot_date: e.target.value })
            }
            required
          />

          <input
            type="time"
            className="input"
            value={newSlot.slot_time}
            onChange={(e) =>
              setNewSlot({ ...newSlot, slot_time: e.target.value })
            }
            required
          />

          <input
            type="number"
            className="input"
            min="15"
            value={newSlot.duration_minutes}
            onChange={(e) =>
              setNewSlot({
                ...newSlot,
                duration_minutes: e.target.value,
              })
            }
          />

          <button className="btn-primary" type="submit">
            <FiPlus />
            Create Slot
          </button>
        </form>
      </div>

      {/* Slots */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading Slots...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Time</th>
                  <th className="px-6 py-4 text-left">Duration</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {slots.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-muted"
                    >
                      No slots available.
                    </td>
                  </tr>
                ) : (
                  slots.map((slot) => (
                    <tr
                      key={slot.id}
                      className="border-t border-line hover:bg-bg transition"
                    >
                      {/* Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-primary" />
                          {slot.slot_date}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-primary" />
                          {slot.slot_time}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-5">
                        {slot.duration_minutes} Minutes
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            slot.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : slot.status === "BOOKED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {slot.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleToggle(slot)}
                            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
                          >
                            {slot.status === "AVAILABLE"
                              ? "Mark Booked"
                              : "Mark Available"}
                          </button>

                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 grid place-items-center transition"
                          >
                            <FiTrash2 className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorAvailability;