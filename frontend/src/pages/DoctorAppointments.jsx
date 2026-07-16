import { useEffect, useMemo, useState } from "react";

import {
  FiAlertCircle,
  FiCalendar,
  FiCheck,
  FiClock,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/dashboard/StatCard";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";
import {
  acceptAppointment,
  declineAppointment,
  getDoctorAppointments,
} from "../services/appointmentService";

function DoctorAppointments() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [declineReason, setDeclineReason] = useState({});
  const [showDeclineForm, setShowDeclineForm] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const fetchAppointments = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getDoctorAppointments(user.id);

      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      setProcessingId(appointmentId);

      await acceptAppointment(appointmentId);

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: "ACCEPTED",
              }
            : appointment,
        ),
      );

      alert("Appointment accepted!");
    } catch (err) {
      alert(err.message || "Failed to accept appointment");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (appointmentId) => {
    try {
      setProcessingId(appointmentId);

      const reason = declineReason[appointmentId] || "";

      await declineAppointment(appointmentId, reason);

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: "DECLINED",
              }
            : appointment,
        ),
      );

      setShowDeclineForm(null);

      setDeclineReason((currentReasons) => ({
        ...currentReasons,
        [appointmentId]: "",
      }));

      alert("Appointment declined!");
    } catch (err) {
      alert(err.message || "Failed to decline appointment");
    } finally {
      setProcessingId(null);
    }
  };
  const pendingAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status === "CONFIRMED",
    );
  }, [appointments]);

  const acceptedAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status === "ACCEPTED",
    );
  }, [appointments]);

  const completedAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status === "COMPLETED",
    );
  }, [appointments]);
  const declinedAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status === "DECLINED",
    );
  }, [appointments]);

  const approvalRate = useMemo(() => {
    if (appointments.length === 0) {
      return 0;
    }

    return Math.round(
      (acceptedAppointments.length / appointments.length) * 100,
    );
  }, [appointments.length, acceptedAppointments.length]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ACCEPTED":
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-700";

      case "DECLINED":
        return "bg-red-100 text-red-700";

      case "COMPLETED":
        return "bg-slate-200 text-slate-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      ACCEPTED: "Accepted",
      DECLINED: "Declined",
      COMPLETED: "Completed",
    };

    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <FiAlertCircle className="mr-1" />;

      case "ACCEPTED":
      case "CONFIRMED":
        return <FiCheck className="mr-1" />;

      case "DECLINED":
        return <FiX className="mr-1" />;

      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="doctor">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow mb-2">Appointment Management</p>

            <h1 className="text-3xl font-semibold text-ink">
              Doctor Appointments
            </h1>

            <p className="mt-2 max-w-2xl text-muted">
              Review appointment requests, respond to patients, and manage your
              consultation schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/doctor/availability")}
            className="btn-primary shrink-0"
          >
            <FiCalendar size={18} />
            Manage Availability
          </button>
        </div>
      </div>

      {/* Appointment Statistics */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FiAlertCircle}
          label="Waiting for Approval"
          value={pendingAppointments.length}
          tone="primary"
        />

        <StatCard
          icon={FiCheck}
          label="Accepted Appointments"
          value={acceptedAppointments.length}
          tone="gold"
        />

        <StatCard
          icon={FiClock}
          label="Completed"
          value={completedAppointments.length}
          tone="accent"
        />

        <StatCard
          icon={FiCalendar}
          label="Total Requests"
          value={appointments.length}
          tone="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        {/* Appointment Management */}
        <div className="card p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow mb-1">Today&apos;s Schedule</p>

              <h2 className="text-xl font-semibold text-ink">
                Manage Appointments
              </h2>

              <p className="mt-1 text-sm text-muted">
                Review requests and monitor appointment progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/doctor/availability")}
              className="btn-outline shrink-0"
            >
              <FiCalendar className="mr-2" size={16} />
              Manage Slots
            </button>
          </div>

          {loading && (
            <div className="flex min-h-48 flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary" />

              <p className="mt-2 text-sm text-muted">Loading appointments...</p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-bg px-6 text-center">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary-light">
                <FiCalendar size={22} className="text-primary" />
              </div>

              <p className="font-semibold text-ink">No appointments yet</p>

              <p className="mt-1 text-sm text-muted">
                New patient requests will appear here.
              </p>
            </div>
          )}

          {/* Pending Appointments */}
          {!loading && pendingAppointments.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <FiAlertCircle size={18} className="text-yellow-600" />
                  Pending Approvals
                </h3>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  {pendingAppointments.length}
                </span>
              </div>

              <div className="space-y-4">
                {pendingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-yellow-200 font-semibold text-yellow-800">
                            {appointment.patientName
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </div>

                          <div>
                            <p className="font-semibold text-ink">
                              {appointment.patientName || "Patient"}
                            </p>

                            <p className="text-xs text-muted">
                              {appointment.specialization ||
                                "General Consultation"}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-ink">
                          {appointment.date}
                          {" • "}
                          {appointment.time}
                        </p>

                        {appointment.notes && (
                          <p className="mt-2 text-sm text-muted">
                            <strong className="text-ink">Reason:</strong>{" "}
                            {appointment.notes}
                          </p>
                        )}
                      </div>

                      <span
                        className={`flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          appointment.status,
                        )}`}
                      >
                        {getStatusIcon(appointment.status)}

                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleAccept(appointment.id)}
                        disabled={processingId === appointment.id}
                        className="btn-accent flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiCheck size={16} />

                        {processingId === appointment.id
                          ? "Accepting..."
                          : "Accept"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          showDeclineForm === appointment.id
                            ? setShowDeclineForm(null)
                            : setShowDeclineForm(appointment.id)
                        }
                        disabled={processingId === appointment.id}
                        className="btn-outline flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiX size={16} />
                        Decline
                      </button>
                    </div>

                    {/* Decline Form */}
                    {showDeclineForm === appointment.id && (
                      <div className="mt-4 border-t border-yellow-200 pt-4">
                        <label
                          htmlFor={`decline-reason-${appointment.id}`}
                          className="label"
                        >
                          Decline Reason
                        </label>

                        <textarea
                          id={`decline-reason-${appointment.id}`}
                          value={declineReason[appointment.id] || ""}
                          onChange={(event) =>
                            setDeclineReason((currentReasons) => ({
                              ...currentReasons,

                              [appointment.id]: event.target.value,
                            }))
                          }
                          placeholder="Enter reason for declining (optional)"
                          className="input mt-2 resize-none"
                          rows="3"
                        />

                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => handleDecline(appointment.id)}
                            disabled={processingId === appointment.id}
                            className="btn-red flex-1 rounded-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processingId === appointment.id
                              ? "Declining..."
                              : "Confirm Decline"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowDeclineForm(null)}
                            disabled={processingId === appointment.id}
                            className="btn-outline flex-1 rounded-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accepted Appointments */}
          {!loading && acceptedAppointments.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <FiCheck size={18} className="text-emerald-600" />
                  Accepted Appointments
                </h3>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {acceptedAppointments.length}
                </span>
              </div>

              <div className="space-y-3">
                {acceptedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-ink">
                        {appointment.patientName || "Patient"}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {appointment.date}
                        {" • "}
                        {appointment.time}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Accepted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Appointments */}
          {!loading && completedAppointments.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <FiClock size={18} className="text-blue-600" />
                  Completed Appointments
                </h3>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {completedAppointments.length}
                </span>
              </div>

              <div className="space-y-3">
                {completedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-ink">
                        {appointment.patientName || "Patient"}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {appointment.date}
                        {" • "}
                        {appointment.time}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declined Appointments */}
          {!loading && declinedAppointments.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <FiX size={18} className="text-red-600" />
                  Declined Appointments
                </h3>

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  {declinedAppointments.length}
                </span>
              </div>

              <div className="space-y-3">
                {declinedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-ink">
                        {appointment.patientName || "Patient"}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {appointment.date}
                        {" • "}
                        {appointment.time}
                      </p>

                      {appointment.notes && (
                        <p className="mt-2 text-xs text-muted">
                          Reason: {appointment.notes}
                        </p>
                      )}
                    </div>

                    <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Declined
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Statistics */}
        <div className="card h-fit border border-primary-light bg-primary-light/10 p-6">
          <p className="eyebrow mb-2">Appointment Overview</p>

          <h2 className="mb-5 text-xl font-semibold text-ink">Quick Stats</h2>

          <div className="space-y-4">
            <div className="rounded-xl bg-white p-4">
              <p className="mb-1 text-xs text-muted">Total Requests</p>

              <p className="text-2xl font-bold text-ink">
                {appointments.length}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="mb-1 text-xs text-muted">Approval Rate</p>

              <p className="text-2xl font-bold text-emerald-600">
                {approvalRate}%
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="mb-1 text-xs text-muted">Pending Responses</p>

              <p className="text-2xl font-bold text-yellow-600">
                {pendingAppointments.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/doctor/availability")}
              className="btn-accent w-full rounded-full py-3 font-semibold"
            >
              Manage Availability
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorAppointments;
