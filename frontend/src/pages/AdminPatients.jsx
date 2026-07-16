import { useEffect, useMemo, useState } from "react";
import {
  FiEye,
  FiMail,
  FiPhone,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import { getAllAppointments } from "../services/appointmentService";
import { getAllPatients } from "../services/authService";

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);

      const [registeredPatients, appointments] = await Promise.all([
        getAllPatients(),
        getAllAppointments(),
      ]);

      const formattedPatients = registeredPatients.map((patient) => {
        const patientAppointments = appointments
          .filter(
            (appointment) =>
              Number(appointment.patientId) === Number(patient.id),
          )
          .sort((first, second) => {
            const firstDate = new Date(
              `${first.date || ""}T${first.time || "00:00:00"}`,
            );

            const secondDate = new Date(
              `${second.date || ""}T${second.time || "00:00:00"}`,
            );

            return secondDate - firstDate;
          });

        const latestAppointment = patientAppointments[0];

        return {
          patientId: patient.id,
          patientName: patient.full_name || "Unknown Patient",
          phone: patient.phone || "Not Available",
          email: patient.email || "Not Available",
          doctor: latestAppointment?.doctorName || "-",
          date: latestAppointment?.date || "-",
          status: latestAppointment?.status || "NO_APPOINTMENTS",
        };
      });

      setPatients(formattedPatients);
    } catch (err) {
      console.error("Unable to load patients:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPatients = useMemo(() => {
    const keyword = search.toLowerCase();

    return patients.filter((patient) => {
      const patientName = patient.patientName?.toLowerCase() || "";

      const doctor = patient.doctor?.toLowerCase() || "";

      const phone = patient.phone?.toLowerCase() || "";

      return (
        patientName.includes(keyword) ||
        doctor.includes(keyword) ||
        phone.includes(keyword)
      );
    });
  }, [patients, search]);

  async function removePatient(patientId) {
    const ok = window.confirm("Remove this patient?");

    if (!ok) {
      return;
    }

    try {
      setDeletingId(patientId);

      setPatients((currentPatients) =>
        currentPatients.filter((patient) => patient.patientId !== patientId),
      );
    } finally {
      setDeletingId(null);
    }
  }

  function openPatientDetails(patient) {
    setSelectedPatient(patient);
  }

  function closePatientDetails() {
    setSelectedPatient(null);
  }

  return (
    <DashboardLayout role="admin">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div>
          <p className="eyebrow mb-2">Administration</p>

          <h1 className="text-3xl font-semibold text-ink">
            Patients Management
          </h1>

          <p className="mt-2 max-w-2xl text-muted">
            View and manage patients connected to registered appointments.
          </p>
        </div>
      </div>

      {/* Statistics and Search */}
      <div className="mb-8 grid gap-5 xl:grid-cols-3">
        {/* Total Patients */}
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Total Patients</p>

              <h2 className="mt-2 text-3xl font-bold text-ink">
                {patients.length}
              </h2>

              <p className="mt-1 text-xs text-muted">
                Unique appointment patients
              </p>
            </div>

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-light">
              <FiUsers className="text-primary" size={22} />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Search Results</p>

              <h2 className="mt-2 text-3xl font-bold text-ink">
                {filteredPatients.length}
              </h2>

              <p className="mt-1 text-xs text-muted">
                Patients currently displayed
              </p>
            </div>

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100">
              <FiSearch className="text-green-600" size={22} />
            </div>
          </div>
        </div>

        {/* Search Patient */}
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <label htmlFor="patient-search" className="label">
            Search Patient
          </label>

          <div className="relative mt-2">
            <FiSearch
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              id="patient-search"
              type="text"
              className="input pl-11"
              placeholder="Patient, doctor, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="mt-2 text-xs text-muted">
            Search by patient name, doctor, or phone number.
          </p>
        </div>
      </div>

      {/* Patients Table */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-1">Patient Directory</p>

            <h2 className="text-xl font-semibold text-ink">
              Registered Patients
            </h2>

            <p className="mt-1 text-sm text-muted">
              Patients are collected from existing appointment records.
            </p>
          </div>

          <div className="rounded-xl bg-bg px-4 py-2 text-sm text-muted">
            Showing{" "}
            <span className="font-semibold text-ink">
              {filteredPatients.length}
            </span>{" "}
            of <span className="font-semibold text-ink">{patients.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-4 px-6 py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary" />

            <div className="text-center">
              <p className="font-semibold text-ink">Loading patients</p>

              <p className="mt-1 text-sm text-muted">
                Please wait while patient records are loaded.
              </p>
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-light">
              <FiSearch size={24} className="text-primary" />
            </div>

            <h3 className="text-lg font-semibold text-ink">
              No patients found
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted">
              No patient records match your current search. Try another patient,
              doctor, or phone number.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-bg"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-bg">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Doctor
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Last Visit
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-ink">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.patientId}
                    className="border-t border-line transition hover:bg-bg"
                  >
                    {/* Patient */}
                    <td className="px-6 py-5">
                      <p className="font-semibold text-ink">
                        {patient.patientName}
                      </p>

                      <p className="mt-1 text-sm text-muted">
                        Registered patient
                      </p>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FiPhone className="shrink-0 text-primary" />

                          <span>{patient.phone}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FiMail className="shrink-0 text-primary" />

                          <span>{patient.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-6 py-5">{patient.doctor || "-"}</td>

                    {/* Date */}
                    <td className="px-6 py-5">{patient.date || "-"}</td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          patient.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700"
                            : patient.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : patient.status === "DECLINED"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {patient.status === "NO_APPOINTMENTS"
                          ? "No Appointments"
                          : patient.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => openPatientDetails(patient)}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 transition hover:bg-blue-100"
                          title="View patient"
                          aria-label={`View ${patient.patientName}`}
                        >
                          <FiEye className="text-blue-600" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removePatient(patient.patientId)}
                          disabled={deletingId === patient.patientId}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remove patient"
                          aria-label={`Remove ${patient.patientName}`}
                        >
                          <FiTrash2 className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closePatientDetails}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-line bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-line px-6 py-5">
              <div>
                <p className="eyebrow mb-1">Patient Details</p>

                <h2 className="text-2xl font-semibold text-ink">
                  {selectedPatient.patientName}
                </h2>

                <p className="mt-1 text-sm text-muted">Appointment patient</p>
              </div>

              <button
                type="button"
                onClick={closePatientDetails}
                className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition hover:bg-bg hover:text-ink"
                title="Close"
                aria-label="Close patient details"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-xl bg-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Phone
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-ink">
                  <FiPhone className="text-primary" />

                  {selectedPatient.phone}
                </div>
              </div>

              <div className="rounded-xl bg-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Email
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-ink">
                  <FiMail className="text-primary" />

                  {selectedPatient.email}
                </div>
              </div>

              <div className="rounded-xl bg-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Doctor
                </p>

                <p className="mt-2 font-medium text-ink">
                  {selectedPatient.doctor || "-"}
                </p>
              </div>

              <div className="rounded-xl bg-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Last Visit
                </p>

                <p className="mt-2 font-medium text-ink">
                  {selectedPatient.date || "-"}
                </p>
              </div>

              <div className="rounded-xl bg-bg p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Appointment Status
                </p>

                <div className="mt-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedPatient.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : selectedPatient.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : selectedPatient.status === "DECLINED"
                            ? "bg-red-100 text-red-700"
                            : selectedPatient.status === "COMPLETED"
                              ? "bg-slate-100 text-slate-700"
                              : selectedPatient.status === "CANCELLED"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedPatient.status === "NO_APPOINTMENTS"
                      ? "No Appointments"
                      : selectedPatient.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-line px-6 py-4">
              <button
                type="button"
                onClick={closePatientDetails}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminPatients;
