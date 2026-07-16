import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
  FiXCircle,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import {
  deleteAppointment,
  getAllAppointments,
} from "../services/appointmentService";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [doctorFilter, setDoctorFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllAppointments();

      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load appointments:", err);

      setAppointments([]);
      setError("Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  }

  function normalizeStatus(status) {
    return status?.toString().trim().toUpperCase() || "UNKNOWN";
  }

  function getStatusLabel(status) {
    const normalizedStatus = normalizeStatus(status);

    const labels = {
      PENDING: "Awaiting Payment",
      CONFIRMED: "Payment Confirmed",
      ACCEPTED: "Doctor Approved",
      COMPLETED: "Completed",
      DECLINED: "Rejected",
      CANCELLED: "Cancelled",
      UNKNOWN: "Unknown",
    };

    return labels[normalizedStatus] || normalizedStatus;
  }

  function getStatusClasses(status) {
    const normalizedStatus = normalizeStatus(status);

    const classes = {
      PENDING: "bg-yellow-100 text-yellow-700",
      CONFIRMED: "bg-blue-100 text-blue-700",
      ACCEPTED: "bg-green-100 text-green-700",
      COMPLETED: "bg-purple-100 text-purple-700",
      DECLINED: "bg-red-100 text-red-700",
      CANCELLED: "bg-gray-200 text-gray-700",
      UNKNOWN: "bg-gray-100 text-gray-700",
    };

    return classes[normalizedStatus] || "bg-gray-100 text-gray-700";
  }
  function canDeleteAppointment(status) {
    const currentStatus = normalizeStatus(status);

    return (
      currentStatus === "PENDING" ||
      currentStatus === "DECLINED" ||
      currentStatus === "CANCELLED"
    );
  }

  function getInitials(name) {
    if (!name || typeof name !== "string") {
      return "?";
    }

    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      return "?";
    }

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return `${words[0].charAt(0)}${words[words.length - 1].charAt(
      0,
    )}`.toUpperCase();
  }

  function capitalizeWords(value) {
    if (!value || typeof value !== "string") {
      return "";
    }

    return value
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function formatTime(timeValue) {
    if (!timeValue) {
      return "-";
    }

    const [hoursString, minutesString] = timeValue.toString().split(":");

    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return timeValue;
    }

    const temporaryDate = new Date();

    temporaryDate.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(temporaryDate);
  }

  function getAppointmentDateTime(appointment) {
    if (!appointment?.date) {
      return 0;
    }

    const appointmentTime = appointment.time || "00:00:00";

    const dateTime = new Date(`${appointment.date}T${appointmentTime}`);

    if (Number.isNaN(dateTime.getTime())) {
      return 0;
    }

    return dateTime.getTime();
  }

  async function handleDeleteAppointment(appointment) {
    const patientName =
      capitalizeWords(appointment.patientName) || "this patient";

    const confirmed = window.confirm(
      `Are you sure you want to delete this appointment for ${patientName}?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(appointment.id);
      setError("");

      await deleteAppointment(appointment.id);

      setAppointments((currentAppointments) =>
        currentAppointments.filter((item) => item.id !== appointment.id),
      );

      if (selectedAppointment?.id === appointment.id) {
        setSelectedAppointment(null);
      }
    } catch (err) {
      console.error("Failed to delete appointment:", err);

      const message =
        err?.response?.data?.detail || "Unable to delete the appointment.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  const sortedAndFilteredAppointments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const sortedAppointments = [...appointments].sort((first, second) => {
      const firstDateTime = getAppointmentDateTime(first);

      const secondDateTime = getAppointmentDateTime(second);

      if (secondDateTime !== firstDateTime) {
        return secondDateTime - firstDateTime;
      }

      return Number(second.id || 0) - Number(first.id || 0);
    });

    return sortedAppointments.filter((appointment) => {
      // Search
      const matchesSearch =
        !searchValue ||
        [
          appointment.id,
          appointment.patientId,
          appointment.patientName,
          appointment.doctorId,
          appointment.doctorName,
          appointment.specialization,
          appointment.date,
          appointment.time,
          appointment.status,
          getStatusLabel(appointment.status),
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(searchValue),
        );

      // Status Filter
      const matchesStatus =
        statusFilter === "ALL" || appointment.status === statusFilter;

      // Doctor Filter
      const matchesDoctor =
        doctorFilter === "ALL" || appointment.doctorName === doctorFilter;

      // Date Filter
      const matchesDate =
        dateFilter === "ALL" || appointment.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
    });
  }, [appointments, search, statusFilter, doctorFilter, dateFilter]);
  [appointments, search];

  const statusCounts = useMemo(() => {
    return appointments.reduce(
      (counts, appointment) => {
        const status = normalizeStatus(appointment.status);

        if (status === "PENDING") {
          counts.pending += 1;
        }

        if (status === "CONFIRMED") {
          counts.confirmed += 1;
        }

        if (status === "ACCEPTED") {
          counts.accepted += 1;
        }

        if (status === "COMPLETED") {
          counts.completed += 1;
        }

        if (status === "DECLINED" || status === "CANCELLED") {
          counts.cancelled += 1;
        }

        return counts;
      },
      {
        pending: 0,
        confirmed: 0,
        accepted: 0,
        completed: 0,
        cancelled: 0,
      },
    );
  }, [appointments]);

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <p className="eyebrow">Administration</p>

        <h1 className="text-3xl font-semibold">Appointment Management</h1>
      </div>

      <div className="grid gap-5 mb-8 md:grid-cols-2 xl:grid-cols-5">
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <FiClock size={24} className="text-yellow-600" />

            <div>
              <p className="text-muted text-sm">Awaiting Payment</p>

              <h2 className="text-3xl font-bold">{statusCounts.pending}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          {" "}
          <div className="flex items-center gap-3">
            <FiCheckCircle size={24} className="text-blue-600" />

            <div>
              <p className="text-muted text-sm">Payment Confirmed</p>

              <h2 className="text-3xl font-bold">{statusCounts.confirmed}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          {" "}
          <div className="flex items-center gap-3">
            <FiCheckCircle size={24} className="text-green-600" />

            <div>
              <p className="text-muted text-sm">Doctor Approved</p>

              <h2 className="text-3xl font-bold">{statusCounts.accepted}</h2>
            </div>
          </div>
        </div>
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <FiActivity size={24} className="text-purple-600" />

            <div>
              <p className="text-muted text-sm">Completed</p>

              <h2 className="text-3xl font-bold">{statusCounts.completed}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <FiXCircle size={24} className="text-red-600" />

            <div>
              <p className="text-muted text-sm">Rejected / Cancelled</p>

              <h2 className="text-3xl font-bold">{statusCounts.cancelled}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <label className="label">Search & Filter Appointments</label>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <FiSearch className="absolute left-3 top-3.5 text-muted" />

            <input
              className="input pl-10"
              placeholder="Search patient, doctor, specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Awaiting Payment</option>
            <option value="CONFIRMED">Payment Confirmed</option>
            <option value="ACCEPTED">Doctor Approved</option>
            <option value="COMPLETED">Completed</option>
            <option value="DECLINED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Doctor Filter */}
          <select
            className="input"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="ALL">All Doctors</option>

            {[...new Set(appointments.map((a) => a.doctorName))]
              .filter(Boolean)
              .sort()
              .map((doctor) => (
                <option key={doctor} value={doctor}>
                  Dr. {doctor}
                </option>
              ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Date Filter */}
          <input
            type="date"
            className="input w-56"
            value={dateFilter === "ALL" ? "" : dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value === "" ? "ALL" : e.target.value)
            }
          />

          {/* Reset Button */}
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
              setDoctorFilter("ALL");
              setDateFilter("ALL");
            }}
            className="rounded-lg border border-line px-4 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-light hover:text-primary hover:shadow-md active:translate-y-0 active:scale-[0.98]"
          >
            Reset Filters
          </button>
        </div>

        <p className="mt-3 text-sm text-muted">
          Showing {sortedAndFilteredAppointments.length} of{" "}
          {appointments.length} appointments
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Loading appointments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-bg">
                <tr>
                  <th className="px-6 py-4 text-left">Patient</th>

                  <th className="px-6 py-4 text-left">Doctor</th>

                  <th className="px-6 py-4 text-left">Date</th>

                  <th className="px-6 py-4 text-left">Time</th>

                  <th className="px-6 py-4 text-left">Status</th>

                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedAndFilteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-muted">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  sortedAndFilteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-t border-line transition-all duration-300 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                            {getInitials(appointment.patientName)}
                          </div>

                          <div>
                            <p className="font-semibold text-ink">
                              {capitalizeWords(appointment.patientName) ||
                                "Unknown Patient"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {getInitials(appointment.doctorName)}
                          </div>

                          <div>
                            <p className="font-semibold text-ink">
                              Dr.{" "}
                              {capitalizeWords(appointment.doctorName) ||
                                "Unknown"}
                            </p>

                            <p className="text-sm text-muted">
                              {capitalizeWords(appointment.specialization) ||
                                "General"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <FiCalendar className="shrink-0 text-primary" />

                          <span>{formatDate(appointment.date)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <FiClock className="shrink-0 text-primary" />

                          <span>{formatTime(appointment.time)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            appointment.status,
                          )}`}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedAppointment(appointment)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-light hover:shadow-md active:translate-y-0 active:scale-[0.95]"
                            title="View appointment details"
                            aria-label="View appointment details"
                          >
                            <FiEye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAppointment(appointment)}
                            disabled={
                              deletingId === appointment.id ||
                              !canDeleteAppointment(appointment.status)
                            }
                            title={
                              canDeleteAppointment(appointment.status)
                                ? "Delete Appointment"
                                : "Only Pending, Declined and Cancelled appointments can be deleted."
                            }
                            aria-label="Delete appointment"
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition
                                  ${
                                    canDeleteAppointment(appointment.status)
                                      ? "border-red-200 text-red-600 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:shadow-md"
                                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                  }
                                  disabled:opacity-60`}
                          >
                            <FiTrash2 size={17} />
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

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <p className="eyebrow">Appointment Details</p>

                <h2 className="text-xl font-semibold text-ink">
                  Appointment Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-bg hover:text-ink"
                aria-label="Close appointment details"
              >
                <FiX size={21} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-bg p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
                    <FiUser />
                    Patient
                  </div>

                  <p className="font-semibold text-ink">
                    {capitalizeWords(selectedAppointment.patientName) ||
                      "Unknown Patient"}
                  </p>
                </div>

                <div className="rounded-xl bg-bg p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
                    <FiUser />
                    Doctor
                  </div>

                  <p className="font-semibold text-ink">
                    Dr.{" "}
                    {capitalizeWords(selectedAppointment.doctorName) ||
                      "Unknown"}
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    {capitalizeWords(selectedAppointment.specialization) ||
                      "General"}
                  </p>
                </div>

                <div className="rounded-xl bg-bg p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
                    <FiCalendar />
                    Appointment Date
                  </div>

                  <p className="font-semibold text-ink">
                    {formatDate(selectedAppointment.date)}
                  </p>
                </div>

                <div className="rounded-xl bg-bg p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
                    <FiClock />
                    Appointment Time
                  </div>

                  <p className="font-semibold text-ink">
                    {formatTime(selectedAppointment.time)}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-muted">Status</p>

                <span
                  className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    selectedAppointment.status,
                  )}`}
                >
                  {getStatusLabel(selectedAppointment.status)}
                </span>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-muted">Notes</p>

                  <div className="rounded-xl bg-bg p-4 text-ink">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg border border-line px-4 py-2 font-medium text-ink transition hover:bg-bg"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleDeleteAppointment(selectedAppointment)}
                disabled={
                  deletingId === selectedAppointment.id ||
                  !canDeleteAppointment(selectedAppointment.status)
                }
                title={
                  canDeleteAppointment(selectedAppointment.status)
                    ? "Delete Appointment"
                    : "Only Pending, Declined and Cancelled appointments can be deleted."
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition
                  ${
                    canDeleteAppointment(selectedAppointment.status)
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <FiTrash2 />

                {deletingId === selectedAppointment.id
                  ? "Deleting..."
                  : "Delete Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminAppointments;
