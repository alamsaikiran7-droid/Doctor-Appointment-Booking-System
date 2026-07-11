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
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await getPatientAppointments(user?.id);
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      await cancelAppointment(id);

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "CANCELLED" } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Unable to cancel appointment.");
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
        (a) => a.status === "CANCELLED" || a.status === "DECLINED"
      ),
    [appointments]
  );

  function badge(status) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      case "DECLINED":
      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <DashboardLayout role="patient">
      <div className="mb-8">
        <p className="eyebrow">Patient Dashboard</p>
        <h1 className="text-3xl font-semibold">My Appointments</h1>
        <p className="text-muted mt-2">
          View and manage your appointments.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="card p-6">
          <FiCalendar size={24} className="text-primary mb-3" />
          <p className="text-muted">Upcoming</p>
          <h2 className="text-3xl font-bold">
            {upcomingAppointments.length}
          </h2>
        </div>

        <div className="card p-6">
          <FiCheckCircle size={24} className="text-green-600 mb-3" />
          <p className="text-muted">Completed</p>
          <h2 className="text-3xl font-bold">
            {completedAppointments.length}
          </h2>
        </div>

        <div className="card p-6">
          <FiXCircle size={24} className="text-red-600 mb-3" />
          <p className="text-muted">Cancelled</p>
          <h2 className="text-3xl font-bold">
            {cancelledAppointments.length}
          </h2>
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
                    <td
                      colSpan="5"
                      className="text-center py-12 text-muted"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-t border-line"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center">
                            <FiUser className="text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {appointment.doctorName ||
                                appointment.doctor_name ||
                                "Doctor"}
                            </p>
                            <p className="text-sm text-muted">
                              {appointment.speciality ||
                                appointment.specialization ||
                                "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">{appointment.date}</td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <FiClock size={14} />
                          {appointment.time}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        {appointment.status === "PENDING" ||
                        appointment.status === "ACCEPTED" ? (
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="btn-outline text-red-600"
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