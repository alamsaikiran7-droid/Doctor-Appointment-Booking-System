import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiActivity,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import { getAllAppointments } from "../services/appointmentService";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return (
        appointment.patientName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.doctorName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.status?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [appointments, search]);

  const pending = appointments.filter((a) => a.status === "PENDING").length;

  const accepted = appointments.filter((a) => a.status === "ACCEPTED").length;

  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === "DECLINED" || a.status === "CANCELLED"
  ).length;

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <p className="eyebrow">Administration</p>
        <h1 className="text-3xl font-semibold">Appointment Management</h1>
      </div>

      <div className="grid lg:grid-cols-4 gap-5 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <FiClock size={24} className="text-yellow-600" />

            <div>
              <p className="text-muted text-sm">Pending</p>
              <h2 className="text-3xl font-bold">{pending}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <FiCheckCircle size={24} className="text-green-600" />

            <div>
              <p className="text-muted text-sm">Accepted</p>
              <h2 className="text-3xl font-bold">{accepted}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <FiActivity size={24} className="text-blue-600" />

            <div>
              <p className="text-muted text-sm">Completed</p>
              <h2 className="text-3xl font-bold">{completed}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <FiXCircle size={24} className="text-red-600" />

            <div>
              <p className="text-muted text-sm">Cancelled</p>
              <h2 className="text-3xl font-bold">{cancelled}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <label className="label">Search Appointment</label>

        <div className="relative">
          <FiSearch className="absolute left-3 top-3.5 text-muted" />
          <input
            className="input pl-10"
            placeholder="Patient / Doctor / Status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Loading appointments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr>
                  <th className="px-6 py-4 text-left">Patient</th>
                  <th className="px-6 py-4 text-left">Doctor</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Time</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-muted"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-t border-line hover:bg-bg transition"
                    >
                      {/* Patient */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-ink">
                            {appointment.patientName || "Unknown"}
                          </p>
                          <p className="text-sm text-muted">
                            ID : {appointment.patientId || "-"}
                          </p>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium">
                            {appointment.doctorName || "-"}
                          </p>
                          <p className="text-sm text-muted">
                            {appointment.specialization || ""}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-primary" />
                          {appointment.date || "-"}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-5">{appointment.time || "-"}</td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            appointment.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : appointment.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : appointment.status === "DECLINED"
                              ? "bg-red-100 text-red-700"
                              : appointment.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
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

export default AdminAppointments;