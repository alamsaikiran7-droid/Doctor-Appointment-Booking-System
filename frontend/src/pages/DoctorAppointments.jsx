import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiUserCheck, FiChevronRight, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import { getDoctorAppointments, acceptAppointment, declineAppointment } from "../services/appointmentService";
import useAuth from "../hooks/useAuth";

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
    if (!user?.id) return;

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
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId
            ? { ...apt, status: "ACCEPTED" }
            : apt
        )
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
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId
            ? { ...apt, status: "DECLINED" }
            : apt
        )
      );
      setShowDeclineForm(null);
      setDeclineReason(prev => ({ ...prev, [appointmentId]: "" }));
      alert("Appointment declined!");
    } catch (err) {
      alert(err.message || "Failed to decline appointment");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingAppointments = useMemo(
    () => appointments.filter(apt => apt.status === "PENDING"),
    [appointments]
  );

  const acceptedAppointments = useMemo(
    () => appointments.filter(apt => apt.status === "ACCEPTED"),
    [appointments]
  );

  const completedAppointments = useMemo(
    () => appointments.filter(apt => apt.status === "COMPLETED"),
    [appointments]
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-emerald-100 text-emerald-700";
      case "DECLINED":
        return "bg-red-100 text-red-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <FiAlertCircle className="mr-1" />;
      case "ACCEPTED":
        return <FiCheck className="mr-1" />;
      case "DECLINED":
        return <FiX className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="doctor">
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={FiAlertCircle}
          label="Pending approvals"
          value={pendingAppointments.length}
          tone="primary"
        />
        <StatCard
          icon={FiCheck}
          label="Accepted appointments"
          value={acceptedAppointments.length}
          tone="gold"
        />
        <StatCard
          icon={FiClock}
          label="Completed"
          value={completedAppointments.length}
          tone="accent"
        />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="eyebrow mb-1">Today's schedule</p>
              <h2 className="font-sans font-semibold text-ink text-xl">Manage appointments</h2>
            </div>
            <button
              onClick={() => navigate("/doctor/availability")}
              className="btn-outline text-sm py-2 px-4"
            >
              Manage slots
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-muted">Loading appointments...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && appointments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted">No appointments yet</p>
            </div>
          )}

          {/* PENDING APPOINTMENTS - Need Action */}
          {pendingAppointments.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                <FiAlertCircle size={18} className="text-yellow-600" />
                Pending Approvals ({pendingAppointments.length})
              </h3>
              <div className="space-y-4">
                {pendingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="rounded-3xl border border-yellow-200 bg-yellow-50 p-4 hover:border-yellow-300 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-full bg-yellow-200 grid place-items-center font-semibold text-sm">
                            {apt.patientName?.charAt(0) || "P"}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">{apt.patientName || "Patient"}</p>
                            <p className="text-xs text-muted">{apt.specialization}</p>
                          </div>
                        </div>
                        <p className="text-sm text-ink mt-2">
                          📅 {apt.date} at {apt.time}
                        </p>
                        {apt.notes && (
                          <p className="text-sm text-muted mt-1">
                            <strong>Reason:</strong> {apt.notes}
                          </p>
                        )}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center whitespace-nowrap ${getStatusColor(apt.status)}`}>
                        {getStatusIcon(apt.status)}
                        {apt.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAccept(apt.id)}
                        disabled={processingId === apt.id}
                        className="flex-1 btn-accent py-2 px-4 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <FiCheck size={16} />
                        {processingId === apt.id ? "Accepting..." : "Accept"}
                      </button>
                      <button
                        onClick={() =>
                          showDeclineForm === apt.id
                            ? setShowDeclineForm(null)
                            : setShowDeclineForm(apt.id)
                        }
                        className="flex-1 btn-outline py-2 px-4 rounded-full flex items-center justify-center gap-2"
                      >
                        <FiX size={16} />
                        Decline
                      </button>
                    </div>

                    {/* Decline Form */}
                    {showDeclineForm === apt.id && (
                      <div className="mt-4 pt-4 border-t border-yellow-200">
                        <textarea
                          value={declineReason[apt.id] || ""}
                          onChange={(e) =>
                            setDeclineReason(prev => ({
                              ...prev,
                              [apt.id]: e.target.value
                            }))
                          }
                          placeholder="Enter reason for declining (optional)"
                          className="w-full input rounded-lg p-3 text-sm mb-3"
                          rows="2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDecline(apt.id)}
                            disabled={processingId === apt.id}
                            className="flex-1 btn-red py-2 px-4 rounded-full disabled:opacity-50"
                          >
                            {processingId === apt.id ? "Declining..." : "Confirm Decline"}
                          </button>
                          <button
                            onClick={() => setShowDeclineForm(null)}
                            className="flex-1 btn-outline py-2 px-4 rounded-full"
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

          {/* ACCEPTED APPOINTMENTS */}
          {acceptedAppointments.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                <FiCheck size={18} className="text-emerald-600" />
                Accepted Appointments ({acceptedAppointments.length})
              </h3>
              <div className="space-y-3">
                {acceptedAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-ink">{apt.patientName}</p>
                      <p className="text-xs text-muted">
                        {apt.date} at {apt.time}
                      </p>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">
                      ✓ Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL OTHER APPOINTMENTS */}
          {appointments.filter(a => a.status !== "PENDING" && a.status !== "ACCEPTED").length > 0 && (
            <div>
              <h3 className="font-semibold text-ink mb-4">Other Appointments</h3>
              <div className="space-y-3">
                {appointments
                  .filter(a => a.status !== "PENDING" && a.status !== "ACCEPTED")
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-2xl border border-line p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-ink">{apt.patientName}</p>
                        <p className="text-xs text-muted">
                          {apt.date} at {apt.time}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR - Recent Patients */}
        <div className="card p-6 bg-primary-light/10 border border-primary-light h-fit">
          <h3 className="font-sans font-semibold text-ink mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-muted mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-ink">{appointments.length}</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-muted mb-1">Approval Rate</p>
              <p className="text-2xl font-bold text-emerald-600">
                {appointments.length === 0
                  ? "0%"
                  : Math.round(
                      (acceptedAppointments.length / appointments.length) * 100
                    ) + "%"}
              </p>
            </div>
            <button
              onClick={() => navigate("/doctor/availability")}
              className="w-full btn-accent py-3 rounded-full font-semibold"
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