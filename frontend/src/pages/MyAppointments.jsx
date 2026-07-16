import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiXCircle,
  FiCheckCircle,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getPatientAppointments,
  cancelAppointment,
} from "../services/appointmentService";

import useAuth from "../hooks/useAuth";

function MyAppointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    loadAppointments();
  }, [user?.id]);

  async function loadAppointments() {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await getPatientAppointments(user.id);

      setAppointments(data || []);
    } catch (err) {
      console.error("Unable to load appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) return;

    try {
      await cancelAppointment(id);

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "CANCELLED" } : item,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Unable to cancel appointment.");
    }
  }

  const upcomingAppointments = useMemo(
    () =>
      appointments.filter((a) =>
        ["PENDING", "ACCEPTED", "CONFIRMED"].includes(a.status?.toUpperCase()),
      ),
    [appointments],
  );

  const completedAppointments = useMemo(
    () => appointments.filter((a) => a.status === "COMPLETED"),
    [appointments],
  );

  const cancelledAppointments = useMemo(
    () =>
      appointments.filter(
        (a) => a.status === "CANCELLED" || a.status === "DECLINED",
      ),
    [appointments],
  );

  function badge(status) {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "border-yellow-300 bg-yellow-50 text-yellow-700";

      case "CONFIRMED":
        return "border-violet-300 bg-violet-50 text-violet-700";

      case "ACCEPTED":
        return "border-green-300 bg-green-50 text-green-700";

      case "COMPLETED":
        return "border-blue-300 bg-blue-50 text-blue-700";

      case "DECLINED":
      case "CANCELLED":
        return "border-red-300 bg-red-50 text-red-700";

      default:
        return "border-gray-300 bg-gray-50 text-gray-700";
    }
  }
  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(time) {
    if (!time) return "-";

    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const pendingAppointments = appointments.filter(
    (a) => a.status?.toUpperCase() === "PENDING",
  );

  const confirmedAppointments = appointments.filter(
    (a) => a.status?.toUpperCase() === "CONFIRMED",
  );

  const acceptedAppointments = appointments.filter(
    (a) => a.status?.toUpperCase() === "ACCEPTED",
  );

  const completedList = appointments.filter(
    (a) => a.status?.toUpperCase() === "COMPLETED",
  );

  const cancelledList = appointments.filter((a) =>
    ["DECLINED", "CANCELLED"].includes(a.status?.toUpperCase()),
  );
  function AppointmentCard({ appointment }) {
    return (
      <div className="rounded-2xl border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-start justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100">
              <FiUser className="text-emerald-600" size={22} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Dr. {appointment.doctorName || appointment.doctor_name}
              </h3>

              <p className="text-sm text-muted">
                {appointment.speciality || appointment.specialization}
              </p>

              <div className="mt-3 flex items-center gap-6 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <FiCalendar className="text-primary" size={14} />
                  {formatDate(appointment.date)}
                </span>

                <span className="flex items-center gap-2">
                  <FiClock className="text-primary" size={14} />
                  {formatTime(appointment.time)}
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge(
                appointment.status,
              )}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  appointment.status?.toUpperCase() === "PENDING"
                    ? "bg-yellow-500"
                    : appointment.status?.toUpperCase() === "CONFIRMED"
                      ? "bg-violet-500"
                      : appointment.status?.toUpperCase() === "ACCEPTED"
                        ? "bg-green-500"
                        : appointment.status?.toUpperCase() === "COMPLETED"
                          ? "bg-blue-500"
                          : ["DECLINED", "CANCELLED"].includes(
                                appointment.status?.toUpperCase(),
                              )
                            ? "bg-red-500"
                            : "bg-gray-500"
                }`}
              />

              {appointment.status}
            </span>

            {["PENDING", "ACCEPTED", "CONFIRMED"].includes(
              appointment.status?.toUpperCase(),
            ) && (
              <button
                onClick={() => handleCancel(appointment.id)}
                className="rounded-xl border border-red-200 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout role="patient">
      <div className="mb-8 pt-2">
        <p className="eyebrow">Patient Dashboard</p>
        <h1 className="text-3xl font-semibold">My Appointments</h1>
        <p className="text-muted mt-2">View and manage your appointments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Upcoming */}
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
            <FiCalendar className="text-yellow-600" size={22} />
          </div>

          <h3 className="text-3xl font-bold text-slate-900">
            {upcomingAppointments.length}
          </h3>

          <p className="mt-1 font-medium text-yellow-700">
            Upcoming Appointments
          </p>

          <p className="mt-2 text-sm text-yellow-600">
            Waiting for your consultation.
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <FiCheckCircle className="text-green-600" size={22} />
          </div>

          <h3 className="text-3xl font-bold text-slate-900">
            {completedAppointments.length}
          </h3>

          <p className="mt-1 font-medium text-green-700">Completed Visits</p>

          <p className="mt-2 text-sm text-green-600">
            Successfully completed appointments.
          </p>
        </div>

        {/* Cancelled */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
            <FiXCircle className="text-red-600" size={22} />
          </div>

          <h3 className="text-3xl font-bold text-slate-900">
            {cancelledAppointments.length}
          </h3>

          <p className="mt-1 font-medium text-red-700">Cancelled Visits</p>

          <p className="mt-2 text-sm text-red-600">
            Cancelled or declined appointments.
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow">Appointment History</p>

            <h2 className="mt-1 text-2xl font-semibold">My Appointments</h2>

            <p className="mt-2 text-sm text-muted">
              Review your upcoming and previous appointments.
            </p>
          </div>

          <span className="rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary">
            {appointments.length} Appointments
          </span>
        </div>
        {loading ? (
          <div className="p-10 text-center">Loading appointments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr>
                  <th className="px-6 py-4 text-left">Doctor</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Time</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-muted">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-t border-line transition-all duration-200 hover:bg-emerald-50 hover:shadow-sm"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200">
                            <FiUser className="text-emerald-600" size={20} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-900">
                              Dr.{" "}
                              {appointment.doctorName ||
                                appointment.doctor_name ||
                                "Doctor"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {appointment.speciality ||
                                appointment.specialization ||
                                "General Physician"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <FiCalendar size={14} className="text-primary" />

                          {formatDate(appointment.date)}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <FiClock size={14} />
                          {formatTime(appointment.time)}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge(
                            appointment.status,
                          )}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              appointment.status?.toUpperCase() === "PENDING"
                                ? "bg-yellow-500"
                                : appointment.status?.toUpperCase() ===
                                    "CONFIRMED"
                                  ? "bg-violet-500"
                                  : appointment.status?.toUpperCase() ===
                                      "ACCEPTED"
                                    ? "bg-green-500"
                                    : appointment.status?.toUpperCase() ===
                                        "COMPLETED"
                                      ? "bg-blue-500"
                                      : ["DECLINED", "CANCELLED"].includes(
                                            appointment.status?.toUpperCase(),
                                          )
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                            }`}
                          />

                          {appointment.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        {["PENDING", "ACCEPTED", "CONFIRMED"].includes(
                          appointment.status?.toUpperCase(),
                        ) ? (
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-500 hover:bg-red-50 hover:shadow-sm"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-muted text-sm">--</span>
                        )}
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

export default MyAppointments;
