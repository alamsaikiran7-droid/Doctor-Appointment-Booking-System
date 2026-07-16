import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiUser,
  FiArrowRight,
  FiActivity,
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
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAppointments() {
      if (!user?.id) {
        if (isMounted) {
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setPageError("");

        const data = await getPatientAppointments(user.id);

        if (!isMounted) {
          return;
        }

        setAppointments(Array.isArray(data) ? data : []);
        console.table(
          data.map((appointment) => ({
            id: appointment.id,
            doctor: appointment.doctorName,
            status: appointment.status,
            date: appointment.date,
            time: appointment.time,
          })),
        );
      } catch (err) {
        console.error("Patient dashboard loading error:", err);

        if (isMounted) {
          setPageError("Unable to load your appointments.");
          setAppointments([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  function getDoctorName(appointment) {
    return appointment.doctorName || appointment.doctor_name || "Doctor";
  }

  function getSpecialization(appointment) {
    return appointment.specialization || "Medical Specialist";
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(timeValue) {
    if (!timeValue) {
      return "Time unavailable";
    }

    const [hours, minutes] = timeValue.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    if (Number.isNaN(date.getTime())) {
      return timeValue;
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getAppointmentDateTime(appointment) {
    if (!appointment.date || !appointment.time) {
      return new Date(0);
    }

    const dateTime = new Date(`${appointment.date}T${appointment.time}`);

    if (Number.isNaN(dateTime.getTime())) {
      return new Date(0);
    }

    return dateTime;
  }
  function getDisplayStatus(appointment) {
    return appointment.status;
  }

  function getStatusClasses(status) {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "CONFIRMED":
        return "border-violet-200 bg-violet-50 text-violet-700";

      case "ACCEPTED":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "COMPLETED":
        return "border-slate-200 bg-slate-100 text-slate-700";

      case "DECLINED":
        return "border-red-200 bg-red-50 text-red-700";

      case "CANCELLED":
        return "border-orange-200 bg-orange-50 text-orange-700";

      default:
        return "border-slate-200 bg-slate-50 text-slate-600";
    }
  }

  function getNotificationMessage(status) {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Your appointment is booked and waiting for payment.";

      case "CONFIRMED":
        return "Payment completed. Waiting for doctor approval.";

      case "ACCEPTED":
        return "Your appointment has been accepted by the doctor.";

      case "COMPLETED":
        return "Your appointment has been completed.";

      case "DECLINED":
        return "Your appointment request was declined.";

      case "CANCELLED":
        return "Your appointment was cancelled.";

      default:
        return `Appointment status updated to ${status}.`;
    }
  }

  const displayedAppointments = useMemo(() => {
    return appointments.map((appointment) => ({
      ...appointment,
      displayStatus: getDisplayStatus(appointment),
    }));
  }, [appointments]);

  const pendingAppointments = useMemo(() => {
    return displayedAppointments.filter(
      (appointment) => appointment.displayStatus === "PENDING",
    );
  }, [displayedAppointments]);

  const confirmedAppointments = useMemo(() => {
    return displayedAppointments.filter(
      (appointment) => appointment.displayStatus === "CONFIRMED",
    );
  }, [displayedAppointments]);
  const acceptedAppointments = useMemo(() => {
    return displayedAppointments.filter(
      (appointment) => appointment.displayStatus === "ACCEPTED",
    );
  }, [displayedAppointments]);
  const completedAppointments = useMemo(() => {
    return displayedAppointments.filter(
      (appointment) => appointment.displayStatus === "COMPLETED",
    );
  }, [displayedAppointments]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    const activeStatuses = ["PENDING", "CONFIRMED", "ACCEPTED"];

    const statusOrder = {
      PENDING: 1,
      CONFIRMED: 2,
      ACCEPTED: 3,
    };

    return displayedAppointments
      .filter((appointment) => {
        const status = appointment.displayStatus;

        if (!activeStatuses.includes(status)) {
          return false;
        }

        // Always show unpaid pending appointments.
        if (status === "PENDING") {
          return true;
        }

        // Confirmed and accepted appointments must be upcoming.
        const appointmentDateTime = getAppointmentDateTime(appointment);

        return appointmentDateTime.getTime() >= now.getTime();
      })
      .sort((first, second) => {
        const firstStatusOrder = statusOrder[first.displayStatus] || 99;

        const secondStatusOrder = statusOrder[second.displayStatus] || 99;

        if (firstStatusOrder !== secondStatusOrder) {
          return firstStatusOrder - secondStatusOrder;
        }

        return getAppointmentDateTime(first) - getAppointmentDateTime(second);
      });
  }, [displayedAppointments]);
  const nextAppointment = useMemo(() => {
    const acceptedAppointment = upcomingAppointments.find(
      (appointment) => appointment.displayStatus === "ACCEPTED",
    );

    if (acceptedAppointment) {
      return acceptedAppointment;
    }

    const confirmedAppointment = upcomingAppointments.find(
      (appointment) => appointment.displayStatus === "CONFIRMED",
    );

    if (confirmedAppointment) {
      return confirmedAppointment;
    }

    return null;
  }, [upcomingAppointments]);

  const historyAppointments = useMemo(() => {
    return displayedAppointments
      .filter((appointment) =>
        ["COMPLETED", "DECLINED", "CANCELLED"].includes(
          appointment.displayStatus,
        ),
      )
      .sort(
        (first, second) =>
          getAppointmentDateTime(second) - getAppointmentDateTime(first),
      );
  }, [displayedAppointments]);

  const cancelledAppointments = useMemo(() => {
    return displayedAppointments.filter(
      (appointment) =>
        appointment.displayStatus === "DECLINED" ||
        appointment.displayStatus === "CANCELLED",
    );
  }, [displayedAppointments]);

  const recentAppointments = useMemo(() => {
    return displayedAppointments
      .slice()
      .sort((first, second) => {
        if (second.id && first.id) {
          return second.id - first.id;
        }

        return getAppointmentDateTime(second) - getAppointmentDateTime(first);
      })
      .slice(0, 5);
  }, [displayedAppointments]);

  return (
    <DashboardLayout role="patient">
      {/* Statistics */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={FiCalendar}
          label="Total Appointments"
          value={appointments.length}
          tone="primary"
        />

        <StatCard
          icon={FiClock}
          label="Pending"
          value={pendingAppointments.length}
          tone="gold"
        />

        <StatCard
          icon={FiCheckCircle}
          label="Confirmed"
          value={confirmedAppointments.length}
          tone="accent"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Accepted"
          value={acceptedAppointments.length}
          tone="accent"
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

      {pageError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {pageError}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        {/* Left section */}
        <div className="space-y-6">
          {/* Upcoming appointments */}
          <section className="card p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow mb-2">Appointments</p>

                <h2 className="text-xl font-semibold text-slate-900">
                  Active Appointments
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Track appointments that are awaiting payment, confirmation, or
                  consultation.
                </p>
              </div>

              <Link
                to="/doctors"
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                Book New
                <FiArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-line bg-slate-50/50">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

                  <p className="text-sm text-muted">Loading appointments...</p>
                </div>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line bg-slate-50/50 px-6 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-primary">
                  <FiCalendar size={22} />
                </div>

                <h3 className="font-semibold text-slate-900">
                  No upcoming appointments
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  You currently have no scheduled visits. Find a doctor and book
                  an appointment.
                </p>

                <Link
                  to="/doctors"
                  className="btn-primary mt-5 inline-flex items-center gap-2"
                >
                  Find Doctors
                  <FiArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <article
                    key={appointment.id}
                    className="group rounded-xl border border-line p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                          <FiUser size={20} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            Dr. {getDoctorName(appointment)}
                          </h3>

                          <p className="mt-1 text-sm text-muted">
                            {getSpecialization(appointment)}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-2">
                              <FiCalendar className="text-primary" />

                              {formatDate(appointment.date)}
                            </span>

                            <span className="inline-flex items-center gap-2">
                              <FiClock className="text-primary" />

                              {formatTime(appointment.time)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Appointment history */}
          <section className="card p-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-2">History</p>

                <h2 className="text-xl font-semibold text-slate-900">
                  Previous Appointments
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Review your completed, declined, and cancelled appointments.
                </p>
              </div>

              <Link
                to="/my-appointments"
                className="hidden items-center gap-2 text-sm font-semibold text-primary hover:underline sm:inline-flex"
              >
                View all
                <FiArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm text-muted">
                Loading history...
              </div>
            ) : completedAppointments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line bg-slate-50/50 px-6 py-10 text-center">
                <FiCheckCircle
                  className="mx-auto mb-3 text-slate-400"
                  size={28}
                />

                <p className="font-medium text-slate-700">
                  No completed appointments yet
                </p>

                <p className="mt-1 text-sm text-muted">
                  Completed visits will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedAppointments.map((appointment) => (
                  <article
                    key={appointment.id}
                    className="flex flex-col gap-3 rounded-xl border border-line px-4 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <FiCheckCircle size={18} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          Dr. {getDoctorName(appointment)}
                        </p>

                        <p className="mt-1 text-sm text-muted">
                          {getSpecialization(appointment)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-medium text-slate-700">
                          {formatDate(appointment.date)}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {formatTime(appointment.time)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          appointment.displayStatus,
                        )}`}
                      >
                        {appointment.displayStatus}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Link
              to="/my-appointments"
              className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-primary sm:hidden"
            >
              View all appointments
              <FiArrowRight size={15} />
            </Link>
          </section>
        </div>

        {/* Right section */}
        <div className="space-y-6">
          {/* Quick actions */}
          <section className="card p-6">
            <p className="eyebrow mb-2">Quick Actions</p>

            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Patient Menu
            </h2>

            <div className="grid gap-3">
              <Link
                to="/doctors"
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-emerald-50/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                    <FiSearch size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">Find Doctors</p>

                    <p className="mt-1 text-sm text-muted">
                      Browse available specialists
                    </p>
                  </div>
                </div>

                <FiArrowRight
                  className="text-primary transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </Link>

              <Link
                to="/my-appointments"
                className="group flex items-center justify-between rounded-xl border border-line p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-emerald-50/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                    <FiCalendar size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      My Appointments
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      View and manage bookings
                    </p>
                  </div>
                </div>

                <FiArrowRight
                  className="text-primary transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </Link>
            </div>
          </section>
          {/* Next Appointment */}
          <section className="card p-6">
            <p className="eyebrow mb-2">Upcoming Reminder</p>

            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Next Appointment
            </h2>

            {!nextAppointment ? (
              <div className="rounded-xl border border-dashed border-line py-10 text-center">
                <FiCalendar className="mx-auto mb-3 text-slate-400" size={30} />

                <p className="font-medium text-slate-700">
                  No upcoming appointments
                </p>

                <p className="mt-2 text-sm text-muted">
                  Book your next consultation with a specialist.
                </p>

                <Link
                  to="/doctors"
                  className="btn-primary mt-5 inline-flex items-center gap-2"
                >
                  Book Appointment
                  <FiArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <FiUser className="text-primary" size={22} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      Dr. {getDoctorName(nextAppointment)}
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      {getSpecialization(nextAppointment)}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-primary" />

                        {formatDate(nextAppointment.date)}
                      </div>

                      <div className="flex items-center gap-2">
                        <FiClock className="text-primary" />

                        {formatTime(nextAppointment.time)}
                      </div>
                    </div>

                    <span
                      className={`mt-5 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        nextAppointment.displayStatus,
                      )}`}
                    >
                      {nextAppointment.displayStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;
