import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
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
    if (!user) return;
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

  const pendingCount = useMemo(
    () => appointments.filter((a) => a.status === "PENDING").length,
    [appointments]
  );

  const acceptedCount = useMemo(
    () => appointments.filter((a) => a.status === "ACCEPTED").length,
    [appointments]
  );

  const patientCount = useMemo(() => {
    return new Set(appointments.map((a) => a.patientName)).size;
  }, [appointments]);

  const todaySlots = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return slots.filter((s) => s.slot_date === today);
  }, [slots]);

  return (
    <DashboardLayout role="doctor">
      {/* Dashboard Statistics */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
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

      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="eyebrow">Appointment Requests</p>
                <h2 className="text-xl font-semibold">Pending Approvals</h2>
              </div>

              <Link to="/doctor/appointments" className="btn-outline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : pendingCount === 0 ? (
              <div className="text-center py-10 text-muted">
                No pending requests
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter((a) => a.status === "PENDING")
                  .slice(0, 5)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex justify-between items-center border rounded-xl p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-muted">
                          {appointment.date}
                          {" • "}
                          {appointment.time}
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                        Pending
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Today's Slots */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="eyebrow">Today's Schedule</p>
                <h2 className="text-xl font-semibold">Available Slots</h2>
              </div>
            </div>

            {todaySlots.length === 0 ? (
              <div className="text-center py-10 text-muted">
                No slots available today
              </div>
            ) : (
              <div className="space-y-3">
                {todaySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center border rounded-xl p-4"
                  >
                    <div>
                      <p className="font-medium">{slot.slot_time}</p>
                      <p className="text-xs text-muted">
                        {slot.duration_minutes} Minutes
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
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

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <p className="eyebrow mb-2">Quick Actions</p>
            <h2 className="text-xl font-semibold mb-5">Doctor Menu</h2>

            <div className="grid gap-3">
              <Link
                to="/doctor/appointments"
                className="flex items-center justify-between rounded-xl border border-line p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">Manage Appointments</p>
                  <p className="text-sm text-muted">
                    Accept or reject appointment requests
                  </p>
                </div>

                <FiArrowRight className="text-primary" size={20} />
              </Link>

              <Link
                to="/doctor/availability"
                className="flex items-center justify-between rounded-xl border border-line p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">Manage Slots</p>
                  <p className="text-sm text-muted">
                    Create, edit and delete slots
                  </p>
                </div>

                <FiArrowRight className="text-primary" size={20} />
              </Link>

              <Link
                to="/doctor/profile"
                className="flex items-center justify-between rounded-xl border border-line p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">My Profile</p>
                  <p className="text-sm text-muted">
                    Update doctor information
                  </p>
                </div>

                <FiArrowRight className="text-primary" size={20} />
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <p className="eyebrow mb-2">Activity</p>
            <h2 className="text-xl font-semibold mb-5">Recent Bookings</h2>

            {appointments.length === 0 ? (
              <div className="text-center py-8 text-muted">
                No appointments found
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((appointment) => (
                    <div key={appointment.id} className="border rounded-xl p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">
                            {appointment.patientName}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {appointment.date}
                            {" • "}
                            {appointment.time}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            appointment.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : appointment.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card p-6 bg-primary-light">
            <h3 className="font-semibold text-lg mb-4">Today's Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Slots</span>
                <strong>{slots.length}</strong>
              </div>

              <div className="flex justify-between">
                <span>Pending Requests</span>
                <strong>{pendingCount}</strong>
              </div>

              <div className="flex justify-between">
                <span>Accepted</span>
                <strong>{acceptedCount}</strong>
              </div>

              <div className="flex justify-between">
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