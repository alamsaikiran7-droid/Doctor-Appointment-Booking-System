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
    [appointments],
  );
  const acceptedAppointments = useMemo(
    () => appointments.filter((a) => a.status === "ACCEPTED").length,
    [appointments],
  );

  const acceptanceRate =
    totalAppointments === 0
      ? 0
      : Math.round((acceptedAppointments / totalAppointments) * 100);
  const completedAppointments = useMemo(
    () => appointments.filter((a) => a.status === "COMPLETED").length,
    [appointments],
  );

  const confirmedAppointments = useMemo(
    () => appointments.filter((a) => a.status === "CONFIRMED").length,
    [appointments],
  );

  const cancelledAppointments = useMemo(
    () =>
      appointments.filter(
        (a) => a.status === "CANCELLED" || a.status === "DECLINED",
      ).length,
    [appointments],
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
          label="Acceptance Rate"
          value={`${acceptanceRate}%`}
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
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {doctor.name}
                        </p>

                        <p className="mt-1 text-sm text-muted">
                          {doctor.speciality || doctor.specialization}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {doctor.clinic || "Clinic not specified"}
                        </p>
                      </div>

                      <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                        {doctor.city}
                      </span>
                    </div>
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
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition-all duration-200 hover:border-primary hover:bg-primary-light/20"
              >
                <div>
                  <p className="font-semibold">Manage Doctors</p>
                  <p className="text-sm text-muted">
                    Add, edit or remove doctors
                  </p>
                </div>

                <FiArrowRight
                  size={20}
                  className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/admin/patients"
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition-all duration-200 hover:border-primary hover:bg-primary-light/20"
              >
                <div>
                  <p className="font-semibold">Manage Patients</p>
                  <p className="text-sm text-muted">View registered patients</p>
                </div>

                <FiArrowRight
                  size={20}
                  className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/admin/appointments"
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition-all duration-200 hover:border-primary hover:bg-primary-light/20"
              >
                <div>
                  <p className="font-semibold">Appointment Records</p>
                  <p className="text-sm text-muted">View every appointment</p>
                </div>

                <FiArrowRight
                  size={20}
                  className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/admin/reports"
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition-all duration-200 hover:border-primary hover:bg-primary-light/20"
              >
                <div>
                  <p className="font-semibold">Reports</p>
                  <p className="text-sm text-muted">Analytics & statistics</p>
                </div>

                <FiArrowRight
                  size={20}
                  className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* System Summary */}
          <div className="card p-6">
            <p className="eyebrow mb-2">System Overview</p>
            <h2 className="text-xl font-semibold mb-5">Current Statistics</h2>

            <div className="divide-y divide-slate-100">
              <div className="flex justify-between">
                <span>Total Doctors</span>
                <strong>{totalDoctors}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4">
                <span>Acceptance Rate</span>

                <strong className="text-green-600">{acceptanceRate}%</strong>
              </div>

              <div className="flex items-center justify-between py-3">
                <span>Total Patients</span>
                <strong>{totalPatients}</strong>
              </div>

              <div className="flex items-center justify-between py-3">
                <span>Total Appointments</span>
                <strong>{totalAppointments}</strong>
              </div>

              <div className="flex items-center justify-between py-3">
                <span>Pending Requests</span>
                <strong>{pendingAppointments}</strong>
              </div>
            </div>
          </div>

          {/* Appointment Status Summary */}
          <div className="card p-6">
            <p className="eyebrow mb-2">Appointment Activity</p>

            <h2 className="mb-5 text-xl font-semibold">Status Summary</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Pending</p>

                  <p className="text-xs text-muted">
                    Waiting for doctor response
                  </p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl font-bold text-yellow-700">
                  {pendingAppointments}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Accepted</p>

                  <p className="text-xs text-muted">Approved appointments</p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl font-bold text-yellow-700">
                  {acceptedAppointments}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Completed</p>

                  <p className="text-xs text-muted">Successfully finished</p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl font-bold text-yellow-700">
                  {completedAppointments}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Confirmed</p>

                  <p className="text-xs text-muted">
                    Confirmed appointment records
                  </p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl font-bold text-yellow-700">
                  {confirmedAppointments}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Cancelled</p>

                  <p className="text-xs text-muted">
                    Cancelled or declined requests
                  </p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl font-bold text-yellow-700">
                  {cancelledAppointments}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
