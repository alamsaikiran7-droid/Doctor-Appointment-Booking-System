import { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiActivity,
  FiArrowRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import { getDoctors } from "../services/doctorService";
import { getAllAppointments } from "../services/appointmentService";

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const doctorData = await getDoctors();
      const appointmentData = await getAllAppointments();
      setDoctors(doctorData);
      setAppointments(appointmentData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;

  const totalPatients = useMemo(() => {
    return new Set(appointments.map((a) => a.patientName)).size;
  }, [appointments]);

  const pendingAppointments = useMemo(
    () => appointments.filter((a) => a.status === "PENDING").length,
    [appointments]
  );

  return (
    <DashboardLayout role="admin">
      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={FiUserCheck}
          label="Doctors"
          value={totalDoctors}
          tone="primary"
        />

        <StatCard
          icon={FiUsers}
          label="Patients"
          value={totalPatients}
          tone="gold"
        />

        <StatCard
          icon={FiCalendar}
          label="Appointments"
          value={totalAppointments}
          tone="accent"
        />

        <StatCard
          icon={FiActivity}
          label="Pending"
          value={pendingAppointments}
          tone="primary"
        />
      </div>

      <div className="grid lg:grid-cols-[1.7fr_0.8fr] gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Recent Appointments */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="eyebrow">Administration</p>
                <h2 className="text-xl font-semibold">Recent Appointments</h2>
              </div>

              <Link to="/admin/appointments" className="btn-outline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 text-muted">
                No appointments found.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments
                  .slice()
                  .reverse()
                  .slice(0, 8)
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
                          {appointment.doctorName}
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
                  ))}
              </div>
            )}
          </div>

          {/* Doctors */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="eyebrow">Doctors</p>
                <h2 className="text-xl font-semibold">Registered Doctors</h2>
              </div>

              <Link to="/admin/doctors" className="btn-outline">
                Manage
              </Link>
            </div>

            {doctors.length === 0 ? (
              <div className="text-center py-10 text-muted">
                No doctors registered.
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.slice(0, 6).map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex justify-between items-center border rounded-xl p-4"
                  >
                    <div>
                      <p className="font-semibold">{doctor.name}</p>
                      <p className="text-sm text-muted">
                        {doctor.speciality || doctor.specialization}
                      </p>
                    </div>

                    <span className="text-primary font-semibold">
                      {doctor.city}
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
            <h2 className="text-xl font-semibold mb-5">Administrator</h2>

            <div className="grid gap-3">
              <Link
                to="/admin/doctors"
                className="flex items-center justify-between border border-line rounded-xl p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">Manage Doctors</p>
                  <p className="text-sm text-muted">
                    Add, edit or remove doctors
                  </p>
                </div>

                <FiArrowRight size={20} className="text-primary" />
              </Link>

              <Link
                to="/admin/patients"
                className="flex items-center justify-between border border-line rounded-xl p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">Manage Patients</p>
                  <p className="text-sm text-muted">
                    View registered patients
                  </p>
                </div>

                <FiArrowRight size={20} className="text-primary" />
              </Link>

              <Link
                to="/admin/appointments"
                className="flex items-center justify-between border border-line rounded-xl p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">Appointment Records</p>
                  <p className="text-sm text-muted">View every appointment</p>
                </div>

                <FiArrowRight size={20} className="text-primary" />
              </Link>

              <Link
                to="/admin/reports"
                className="flex items-center justify-between border border-line rounded-xl p-4 hover:border-primary transition"
              >
                <div>
                  <p className="font-semibold">Reports</p>
                  <p className="text-sm text-muted">Analytics & statistics</p>
                </div>

                <FiArrowRight size={20} className="text-primary" />
              </Link>
            </div>
          </div>

          {/* System Summary */}
          <div className="card p-6">
            <p className="eyebrow mb-2">System Overview</p>
            <h2 className="text-xl font-semibold mb-5">Current Statistics</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Doctors</span>
                <strong>{totalDoctors}</strong>
              </div>

              <div className="flex justify-between">
                <span>Total Patients</span>
                <strong>{totalPatients}</strong>
              </div>

              <div className="flex justify-between">
                <span>Total Appointments</span>
                <strong>{totalAppointments}</strong>
              </div>

              <div className="flex justify-between">
                <span>Pending Requests</span>
                <strong>{pendingAppointments}</strong>
              </div>
            </div>
          </div>

          {/* Latest Activity */}
          <div className="card p-6">
            <p className="eyebrow mb-2">Recent Activity</p>
            <h2 className="text-xl font-semibold mb-5">Latest Updates</h2>

            {appointments.length === 0 ? (
              <p className="text-muted">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {appointments
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((appointment) => (
                    <div key={appointment.id} className="border rounded-xl p-3">
                      <p className="font-medium">
                        {appointment.patientName}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        booked with {appointment.doctorName}
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

export default AdminDashboard;