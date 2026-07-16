import { useEffect, useState } from "react";
import { FiCalendar, FiCheck, FiClock, FiPlus, FiTrash2 } from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import useAuth from "../hooks/useAuth";

import {
  getDoctorSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} from "../services/slotService";
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
    if (!user?.id) return;

    loadSlots();
  }, [user?.id]);
  async function loadSlots() {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await getDoctorSlots(user.id);

      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load slots:", err);
      setSlots([]);
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
    setSlots((prev) => prev.map((s) => (s.id === slot.id ? updated : s)));
  }

  const available = slots.filter((s) => s.status === "AVAILABLE").length;

  const pending = slots.filter((s) => s.status === "PENDING").length;

  const booked = slots.filter((s) => s.status === "BOOKED").length;

  const completed = slots.filter((s) => s.status === "COMPLETED").length;

  const cancelled = slots.filter((s) => s.status === "CANCELLED").length;
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");

    const d = new Date();
    d.setHours(hour, minute);

    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <DashboardLayout role="doctor">
      {/* Header */}
      <div className="card mb-8 flex flex-col justify-between gap-6 p-6 lg:flex-row lg:items-center">
        <div>
          <p className="eyebrow mb-2">Doctor Schedule</p>

          <h1 className="text-4xl font-semibold text-ink">
            Manage Availability
          </h1>

          <p className="mt-2 max-w-2xl text-muted">
            Create consultation slots, update availability, and manage your
            schedule.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={FiCalendar}
          label="Available"
          value={available}
          tone="success"
        />

        <StatCard
          icon={FiClock}
          label="Pending"
          value={pending}
          tone="warning"
        />

        <StatCard icon={FiCheck} label="Booked" value={booked} tone="primary" />

        <StatCard
          icon={FiCheck}
          label="Completed"
          value={completed}
          tone="success"
        />

        <StatCard
          icon={FiTrash2}
          label="Cancelled"
          value={cancelled}
          tone="danger"
        />
      </div>

      {/* Create Slot */}
      <div className="card p-6 mb-8">
        <p className="eyebrow mb-2">Schedule Management</p>

        <h2 className="text-2xl font-semibold text-ink">Create New Slot</h2>

        <p className="mt-2 mb-6 text-muted">
          Add consultation slots for patients to book appointments.
        </p>

        <form onSubmit={handleCreate} className="grid gap-4 lg:grid-cols-4">
          {/* Date */}
          <div>
            <label
              htmlFor="slot-date"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Consultation Date
            </label>

            <div className="relative">
              <FiCalendar
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                size={17}
              />

              <input
                id="slot-date"
                type="date"
                className="input w-full pl-11"
                min={new Date().toISOString().split("T")[0]}
                value={newSlot.slot_date}
                onChange={(e) =>
                  setNewSlot({
                    ...newSlot,
                    slot_date: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor="slot-time"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Start Time
            </label>

            <div className="relative">
              <FiClock
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                size={17}
              />

              <input
                id="slot-time"
                type="time"
                className="input w-full pl-11"
                value={newSlot.slot_time}
                onChange={(e) =>
                  setNewSlot({
                    ...newSlot,
                    slot_time: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="slot-duration"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Duration
            </label>

            <div className="relative">
              <input
                id="slot-duration"
                type="number"
                className="input w-full pr-20"
                min="15"
                step="5"
                value={newSlot.duration_minutes}
                onChange={(e) =>
                  setNewSlot({
                    ...newSlot,
                    duration_minutes: e.target.value,
                  })
                }
                required
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                Minutes
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              className="btn-primary flex w-full items-center justify-center gap-2"
            >
              <FiPlus size={17} />
              Create Slot
            </button>
          </div>
        </form>
      </div>

      {/* Slots */}
      <div className="card overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-1">Availability Overview</p>

            <h2 className="text-xl font-semibold text-ink">
              Consultation Slots
            </h2>

            <p className="mt-1 text-sm text-muted">
              View and manage all your scheduled consultation slots.
            </p>
          </div>

          <div className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-primary">
            {slots.length} {slots.length === 1 ? "Slot" : "Slots"}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted">Loading Slots...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Date
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Time
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Duration
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {slots.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-50">
                          <FiCalendar className="text-primary" size={21} />
                        </div>

                        <p className="font-semibold text-ink">
                          No consultation slots
                        </p>

                        <p className="mt-1 text-sm text-muted">
                          Create your first slot using the form above.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  slots.map((slot) => (
                    <tr
                      key={slot.id}
                      className="border-t border-line transition hover:bg-slate-50"
                    >
                      {/* Date */}
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <FiCalendar
                            className="shrink-0 text-primary"
                            size={16}
                          />

                          <span className="font-medium text-ink">
                            {formatDate(slot.slot_date)}
                          </span>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <FiClock
                            className="shrink-0 text-primary"
                            size={16}
                          />

                          <span className="font-medium text-ink">
                            {formatTime(slot.slot_time)}
                          </span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-5 text-center text-slate-700">
                        {slot.duration_minutes} Minutes
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                            slot.status === "AVAILABLE"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : slot.status === "PENDING"
                                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                : slot.status === "BOOKED"
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : slot.status === "COMPLETED"
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : slot.status === "CANCELLED"
                                      ? "border-red-200 bg-red-50 text-red-700"
                                      : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {slot.status === "AVAILABLE" && "🟢 Available"}
                          {slot.status === "PENDING" && "🟡 Pending Approval"}
                          {slot.status === "BOOKED" && "🔵 Booked"}
                          {slot.status === "COMPLETED" && "✅ Completed"}
                          {slot.status === "CANCELLED" && "❌ Cancelled"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          {slot.status === "BOOKED" ? (
                            <button
                              type="button"
                              disabled
                              className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500"
                            >
                              Booked
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggle(slot)}
                              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                            >
                              Mark Booked
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(slot.id)}
                            disabled={slot.status === "BOOKED"}
                            className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                              slot.status === "BOOKED"
                                ? "cursor-not-allowed bg-slate-100"
                                : "bg-red-50 hover:bg-red-100"
                            }`}
                            title={
                              slot.status === "BOOKED"
                                ? "Booked slots cannot be deleted"
                                : "Delete slot"
                            }
                            aria-label="Delete slot"
                          >
                            <FiTrash2
                              size={16}
                              className={
                                slot.status === "BOOKED"
                                  ? "text-slate-400"
                                  : "text-red-600"
                              }
                            />
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
