import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import StatCard from "../components/dashboard/StatCard";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";
import { getDoctorAppointments } from "../services/appointmentService";
import { getDoctorSlots } from "../services/slotService";

function DoctorDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  async function loadDashboard() {
    if (!user) {
      return;
    }

    try {
      setLoading(true);

      const appts = await getDoctorAppointments(user.id);
      const doctorSlots = await getDoctorSlots(user.id);

      setAppointments(appts);
      setSlots(doctorSlots);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const pendingCount = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status === "PENDING",
    ).length;
  }, [appointments]);

  const acceptedCount = useMemo(() => {
    return appointments.filter((appointment) =>
      ["ACCEPTED", "CONFIRMED"].includes(appointment.status),
    ).length;
  }, [appointments]);

  const patientCount = useMemo(() => {
    return new Set(appointments.map((appointment) => appointment.patientName))
      .size;
  }, [appointments]);

  const todaySlots = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return slots.filter((slot) => slot.slot_date === today);
  }, [slots]);
  const statusLabel = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    CONFIRMED: "Accepted",
    COMPLETED: "Completed",
    DECLINED: "Declined",
  };

  return (
    <DashboardLayout role="doctor">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow mb-2">Doctor Dashboard</p>

            <h1 className="text-3xl font-semibold text-ink">
              Welcome back, {user?.name || "Doctor"}
            </h1>

            <p className="mt-2 max-w-2xl text-muted">
              Review appointment requests, manage your schedule, and monitor
              recent patient activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/doctor/appointments" className="btn-outline">
              <FiCalendar size={18} />
              Appointments
            </Link>

            <Link to="/doctor/availability" className="btn-primary">
              <FiClock size={18} />
              Manage Slots
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FiCalendar}
          label="Total Appointments"
          value={appointments.length}
          tone="primary"
        />

        <StatCard
          icon={FiCheckCircle}
          label="Accepted"
          value={acceptedCount}
          tone="gold"
        />

        <StatCard
          icon={FiUsers}
          label="Patients"
          value={patientCount}
          tone="accent"
        />

        <StatCard
          icon={FiClock}
          label="Today's Slots"
          value={todaySlots.length}
          tone="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <div className="card p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow mb-1">Appointment Requests</p>

                <h2 className="text-xl font-semibold text-ink">
                  Pending Approvals
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Review the latest appointment requests awaiting your response.
                </p>
              </div>

              <Link to="/doctor/appointments" className="btn-outline shrink-0">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex min-h-44 flex-col items-center justify-center gap-4">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary-light border-t-primary" />

                <p className="text-sm text-muted">
                  Loading appointment requests...
                </p>
              </div>
            ) : pendingCount === 0 ? (
              <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-bg px-6 text-center">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary-light">
                  <FiCheckCircle size={22} className="text-primary" />
                </div>

                <p className="font-semibold text-ink">No pending requests</p>

                <p className="mt-1 text-sm text-muted">
                  All appointment requests have been reviewed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter((appointment) => appointment.status === "PENDING")
                  .slice(0, 5)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-4 rounded-xl border border-line p-4 transition hover:bg-bg sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-ink">
                          {appointment.patientName}
                        </p>

                        <p className="mt-1 text-sm text-muted">
                          {appointment.date}
                          {" • "}
                          {appointment.time}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Pending
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Today's Slots */}
          <div className="card p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow mb-1">Today&apos;s Schedule</p>

                <h2 className="text-xl font-semibold text-ink">
                  Available Slots
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Review the slots scheduled for today.
                </p>
              </div>

              <Link to="/doctor/availability" className="btn-outline shrink-0">
                Manage Slots
              </Link>
            </div>

            {todaySlots.length === 0 ? (
              <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-bg px-6 text-center">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary-light">
                  <FiClock size={22} className="text-primary" />
                </div>

                <p className="font-semibold text-ink">
                  No slots available today
                </p>

                <p className="mt-1 text-sm text-muted">
                  Create a new slot from the availability page.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-xl border border-line p-4 transition hover:bg-bg"
                  >
                    <div>
                      <p className="font-medium text-ink">{slot.slot_time}</p>

                      <p className="mt-1 text-xs text-muted">
                        {slot.duration_minutes} Minutes
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        slot.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : slot.status === "BOOKED"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <p className="eyebrow mb-2">Quick Actions</p>

            <h2 className="mb-5 text-xl font-semibold text-ink">Doctor Menu</h2>

            <div className="grid gap-3">
              <Link
                to="/doctor/appointments"
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition-all duration-300 hover:border-primary hover:bg-primary-light/40"
              >
                <div>
                  <p className="font-semibold text-ink">Manage Appointments</p>

                  <p className="mt-1 text-sm text-muted">
                    Accept or reject appointment requests
                  </p>
                </div>

                <FiArrowRight className="shrink-0 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                size={20} />
              </Link>

              <Link
                to="/doctor/availability"
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition-all duration-300 hover:border-primary hover:bg-primary-light/40"
              >
                <div>
                  <p className="font-semibold text-ink">Manage Slots</p>

                  <p className="mt-1 text-sm text-muted">
                    Create, edit, and delete slots
                  </p>
                </div>

                <FiArrowRight
                  className="shrink-0 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                  size={20}
                />
              </Link>

              <Link
                to="/doctor/profile"
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition-all duration-300 hover:border-primary hover:bg-primary-light/40"
              >
                <div>
                  <p className="font-semibold text-ink">My Profile</p>

                  <p className="mt-1 text-sm text-muted">
                    Update doctor information
                  </p>
                </div>

                <FiArrowRight className="shrink-0 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                size={20} />
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-1">Activity</p>

                <h2 className="text-xl font-semibold text-ink">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Latest patient appointments.
                </p>
              </div>

              <span className="rounded-xl bg-bg px-3 py-2 text-sm text-muted">
                {appointments.length} Total
              </span>
            </div>

            {appointments.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-line bg-bg text-muted">
                No appointments found
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-xl border border-line p-4 transition hover:bg-bg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-ink">
                            {appointment.patientName}
                          </p>

                          <p className="mt-1 text-sm text-muted">
                            {appointment.date}
                            {" • "}
                            {appointment.time}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold
                ${
                  appointment.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : ["ACCEPTED", "CONFIRMED"].includes(appointment.status) ||
                        appointment.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                }`}
                        >
                          {statusLabel[appointment.status] ||
                            appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card p-6">
            <p className="eyebrow mb-2">Daily Overview</p>

            <h2 className="mb-6 text-xl font-semibold text-ink">
              Today's Summary
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary-light px-4 py-3">
                <span>Total Slots</span>

                <strong>{slots.length}</strong>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                <span>Pending Requests</span>

                <strong>{pendingCount}</strong>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <span>Accepted</span>

                <strong>{acceptedCount}</strong>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <span>Total Patients</span>

                <strong>{patientCount}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;
