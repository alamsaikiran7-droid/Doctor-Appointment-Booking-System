import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import useAuth from "../hooks/useAuth";
import { getPatientAppointments } from "../services/appointmentService";

function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [user]);

  async function loadAppointments() {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getPatientAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const upcomingAppointments = useMemo(
    () =>
      appointments.filter(
        (a) => a.status === "PENDING" || a.status === "ACCEPTED"
      ),
    [appointments]
  );

  const completedAppointments = useMemo(
    () => appointments.filter((a) => a.status === "COMPLETED"),
    [appointments]
  );

  const cancelledAppointments = useMemo(
    () =>
      appointments.filter(
        (a) => a.status === "DECLINED" || a.status === "CANCELLED"
      ),
    [appointments]
  );

  return (
    <DashboardLayout role="patient">
      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={FiCalendar}
          label="Total Appointments"
          value={appointments.length}
          tone="primary"
        />

        <StatCard
          icon={FiClock}
          label="Upcoming"
          value={upcomingAppointments.length}
          tone="gold"
        />

        <StatCard
          icon={FiCheckCircle}
          label="Completed"
          value={completedAppointments.length}
          tone="accent"
        />

        <StatCard
          icon={FiUser}
          label="Cancelled"
          value={cancelledAppointments.length}
          tone="primary"
        />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        {/* LEFT SECTION */}
        <div className="space-y-6">
          {/* Upcoming */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="eyebrow">Appointments</p>
                <h2 className="text-xl font-semibold">Upcoming Visits</h2>
              </div>

              <Link to="/doctors" className="btn-outline">
                Book New
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-10 text-muted">
                No upcoming appointments.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-xl p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {appointment.doctorName}
                        </h3>
                        <p className="text-sm text-muted mt-1">
                          {appointment.specialization}
                        </p>
                        <p className="text-sm mt-2">📅 {appointment.date}</p>
                        <p className="text-sm">🕒 {appointment.time}</p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          appointment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
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

          {/* Appointment History */}
          <div className="card p-6">
            <p className="eyebrow mb-2">History</p>
            <h2 className="text-xl font-semibold mb-6">
              Previous Appointments
            </h2>

            {completedAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted">
                No completed appointments.
              </div>
            ) : (
              <div className="space-y-3">
                {completedAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-xl p-4">
                    <p className="font-semibold">{appointment.doctorName}</p>
                    <p className="text-sm text-muted">{appointment.date}</p>
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
            <h2 className="text-xl font-semibold mb-5">Patient Menu</h2>

            <div className="grid gap-3">
              <Link
                to="/doctors"
                className="flex items-center justify-between border border-line rounded-xl p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">Find Doctors</p>
                  <p className="text-sm text-muted">Browse specialists</p>
                </div>

                <FiSearch className="text-primary" size={20} />
              </Link>

              <Link
                to="/my-appointments"
                className="flex items-center justify-between border border-line rounded-xl p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">My Appointments</p>
                  <p className="text-sm text-muted">View booking history</p>
                </div>

                <FiCalendar className="text-primary" size={20} />
              </Link>
            </div>
          </div>

          {/* Health Summary */}
          <div className="card p-6">
            <p className="eyebrow mb-2">Health Summary</p>
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Visits</span>
                <strong>{appointments.length}</strong>
              </div>

              <div className="flex justify-between">
                <span>Upcoming</span>
                <strong>{upcomingAppointments.length}</strong>
              </div>

              <div className="flex justify-between">
                <span>Completed</span>
                <strong>{completedAppointments.length}</strong>
              </div>

              <div className="flex justify-between">
                <span>Cancelled</span>
                <strong>{cancelledAppointments.length}</strong>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <p className="eyebrow mb-2">Notifications</p>
            <h2 className="text-xl font-semibold mb-5">Recent Updates</h2>

            {appointments.length === 0 ? (
              <p className="text-sm text-muted">
                No notifications available.
              </p>
            ) : (
              <div className="space-y-4">
                {appointments
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((appointment) => (
                    <div key={appointment.id} className="border rounded-xl p-3">
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-xs text-muted mt-1">
                        Status : {appointment.status}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;